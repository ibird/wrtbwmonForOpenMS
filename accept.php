<?php

//更改设备mac地址
function change($device, $macaddr, $id, $json)
{
	foreach ($json['club'] as $k => $v)
	{
		if($v['id'] == $id)
		{
			foreach ($json['club'][$k]['device'] as $key=>$value)
			{
				if($value['type'] == $device)
				{
					$json['club'][$k]['device'][$key]['mac'] = $macaddr;
				}
			}
		}
	}
	$json_str = json_encode($json);
	
	//为了保证data.json的数据格式便于wrtbwmon脚本操作，在
	//id前加入回车,保证每个用户一条记录占用一行
	$json_str = str_replace('{"id"',"\n{\"id\"",$json_str);
	
	file_put_contents('data.json',$json_str);
	exec('wrtbwmon sync /www/openms/data.json /etc/config/wireless');
}

//新增设备
function add($device, $macaddr, $id, $json)
{
	$arr['type'] = $device;
	$arr['mac'] = $macaddr;
	$arr['in'] = "0";
	$arr['out'] = "0";

	foreach ($json['club'] as $k => $v)
	{
		if($v['id'] == $id)
		{
			$json['club'][$k]['device'][] = $arr;
		}
	}
	$json_str = json_encode($json);
	$json_str = str_replace('{"id"',"\n{\"id\"",$json_str);
	file_put_contents('data.json',$json_str);
	exec('wrtbwmon sync /www/openms/data.json /etc/config/wireless');
}

//新增用户
function adduser($id, $name, $total, $json)
{
	$arr['id'] = $id;
	$arr['name'] = $name;
	$arr['total'] = $total;
	$arr['nowflow'] = "0";
	$arr['device'] = array();

	$json['club'][] = $arr;
	$json_str = json_encode($json);
	$json_str = str_replace('{"id"',"\n{\"id\"",$json_str);
	file_put_contents('data.json',$json_str);
}

//更改设备流量
function changeFlow($flow, $id, $json)
{

	foreach ($json['club'] as $k => $v)
	{
		if($v['id'] == $id)
		{
			$json['club'][$k]['total'] = $flow;
		}
	}
	$json_str = json_encode($json);
	$json_str = str_replace('{"id"',"\n{\"id\"",$json_str);
	file_put_contents('data.json',$json_str);
	exec('wrtbwmon sync /www/openms/data.json /etc/config/wireless');

}

//删除设备
function delDev($id, $mac, $json) 
{
	foreach ($json['club'] as $k => $v)
	{
		if($v['id'] == $id)
		{
			foreach ($json['club'][$k]['device'] as $key => $value)
			{
				if($value['mac'] == $mac)
				{
					array_splice($json['club'][$k]['device'], $key, 1);
				}
			}
		}
	}
	$json_str = json_encode($json);
	$json_str = str_replace('{"id"',"\n{\"id\"",$json_str);
	file_put_contents('data.json',$json_str);
	exec('wrtbwmon sync /www/openms/data.json /etc/config/wireless');

}

//删除用户
function delUser($id, $json)
{
	foreach ($json['club'] as $k => $v)
	{
		if($v['id'] == $id)
		{
			array_splice($json['club'], $k, 1);
		}
	}
	$json_str = json_encode($json);
	$json_str = str_replace('{"id"',"\n{\"id\"",$json_str);
	file_put_contents('data.json',$json_str);
	exec('wrtbwmon sync /www/openms/data.json /etc/config/wireless');
}

//清除流量
function cleanFlow()
{
	exec('wrtbwmon clear /www/openms/data.json /etc/config/wireless');
}

//数据预处理
function funToArgv($fun)
{
	$arr = array();
	switch($fun)
	{
	case 'add':
	{
		$arr['device'] = $_POST['device'];
		$arr['macaddr'] = $_POST['macaddr'];
		$arr['id'] = $_POST['id'];
		break;
	}
	case 'change':
	{
		$arr['device'] = $_POST['device'];
		$arr['macaddr'] = $_POST['macaddr'];
		$arr['id'] = $_POST['id'];
		break;
	}
	case 'changeFlow':
	{
		// 将提交的GB 转为 byte
		$arr['flow'] = (string)($_POST['flow'] * 1024 * 1024 * 1024);
		$arr['id'] = $_POST['id'];
		break;
	}
	case 'adduser':
	{
		$arr['id'] = $_POST['id'];
		$arr['name'] = $_POST['name'];
		$arr['total'] = (string)($_POST['total'] * 1024 * 1024 * 1024);
		break;
	}
	case 'delDev':
	{
		$arr['id'] = $_POST['id'];
		$arr['mac'] = $_POST['mac'];
		break;
	}
	case 'delUser':
	{
		$arr['id'] = $_POST['id'];
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
