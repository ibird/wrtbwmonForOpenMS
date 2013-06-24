<?php

function syncJson($json)
{
	$json_File = "data.json";

	$json_str = json_encode($json);
	
	//为了保证data.json的数据格式便于wrtbwmon脚本操作，在
	//id前加入回车,保证每个用户一条记录占用一行
	$json_str = str_replace('{"name"',"\n{\"name\"",$json_str);
	
	file_put_contents($json_File, $json_str);
//	exec('wrtbwmon sync /www/openms/data.json /etc/config/wireless');
}

//更改设备mac地址
function changeMac($id, $device, $macaddr, $json)
{
	$json['club'][$id]['device'][$device]['mac'] = $macaddr;
	syncJson($json);
}

//新增设备
function addDevice($device, $macaddr, $id, $json)
{
	$arr['type'] = $device;
	$arr['mac'] = $macaddr;
	$arr['in'] = "0";
	$arr['out'] = "0";

	$json['club'][$id]['device'][] = $arr;
	syncJson($json);
}

//新增用户
function addUser($name, $total, $json)
{
	$json_File = "data.json";

	$arr['name'] = $name;
	$arr['total'] = $total;
	$arr['nowflow'] = "0";
	$arr['device'] = array();

	$json['club'][] = $arr;

	$json_str = json_encode($json);
	$json_str = str_replace('{"name"',"\n{\"name\"",$json_str);
	file_put_contents($json_File, $json_str);
	var_dump($json_str);
}

//更改设备流量
function changeFlow($flow, $id, $json)
{

	$json['club'][$id]['total'] = $flow;

	syncJson($json);
}

//删除设备
function delDevice($id, $device, $json) 
{
	array_splice($json['club'][$id]['device'], $device, 1);

	syncJson($json);

}

//删除用户
function delUser($id, $json)
{
	array_splice($json['club'], $id, 1);

	syncJson($json);
}

//清除流量
function cleanFlow()
{
//	exec('wrtbwmon clear /www/openms/data.json /etc/config/wireless');
}

//数据预处理
function funToArgv($fun)
{
	$arr = array();
	switch($fun)
	{
	case 'addDevice':
	{
		$arr['device'] = $_POST['device'];
		$arr['macaddr'] = $_POST['macaddr'];
		$arr['id'] = (int)$_POST['id'];
		break;
	}
	case 'changeMac':
	{
		$temp = explode("_",$_POST['id']);
		$arr['id'] = (int)$temp[0];
		$arr['device'] = (int)$temp[1];
		$arr['macaddr'] = $_POST['macaddr'];
		break;
	}
	case 'changeFlow':
	{
		// 将提交的GB 转为 byte
		$arr['flow'] = (string)($_POST['flow'] * 1024 * 1024 * 1024);
		$arr['id'] = (int)$_POST['id'];
		break;
	}
	case 'addUser':
	{
		$arr['name'] = $_POST['name'];
		$arr['total'] = (string)($_POST['total'] * 1024 * 1024 * 1024);
		break;
	}
	case 'delDevice':
	{
		$temp = explode("_",$_POST['id']);
		$arr['id'] = (int)$temp[0];
		$arr['device'] = (int)$temp[1];
		break;
	}
	case 'delUser':
	{
		$arr['id'] = (int)$_POST['id'];
		break;
	}
	case 'cleanFlow':
	{
		break;
	}
	default:
		exit();	
	}
	return $arr;
}

// 获取json数据，转化为数组
$json_string = file_get_contents('data.json');
$json =json_decode($json_string, true);

// 通过method字段来过滤不同函数所需的变量，然后利用php的回调机制，通过method字段来调用不同的函数
$arr = funToArgv($_POST['method']);
$arr['json'] = $json;
call_user_func_array($_POST['method'],$arr);

?>
