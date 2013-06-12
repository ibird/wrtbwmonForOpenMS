<?php

function change($device, $macaddr, $id, $json)
{
	$flag = 0;
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
	$json_str = str_replace('{"id"',"\n{\"id\"",$json_str);
	file_put_contents('data.json',$json_str);
	echo $flag;
	exec('wrtbwmon sync /www/openms/data.json /etc/config/wireless');
}

function add($device, $macaddr, $id, $json)
{
	$flag = 0;
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
	echo $flag;
	exec('wrtbwmon sync /www/openms/data.json /etc/config/wireless');
}

function adduser($id, $name, $total, $json)
{
	$flag = 0;
	$arr['id'] = $id;
	$arr['name'] = $name;
	$arr['total'] = $total;
	$arr['nowflow'] = "0";
	$arr['device'] = array();

	$json['club'][] = $arr;
	$json_str = json_encode($json);
	$json_str = str_replace('{"id"',"\n{\"id\"",$json_str);
	echo $flag;
	file_put_contents('data.json',$json_str);
}
function changeFlow($flow, $id, $json)
{
	$flag = 0;

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
	echo $flag;

}

function delDev($id, $mac, $json) 
{
	$flag = 0;
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
	echo $flag;

}

function delUser($id, $json)
{
	$flag = 0;
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
	echo $flag;
	exec('wrtbwmon sync /www/openms/data.json /etc/config/wireless');
}

function cleanFlow()
{
	$flag = 0;
	echo $flag;
	exec('wrtbwmon clear /www/openms/data.json /etc/config/wireless');
}

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

$json_string = file_get_contents('data.json');
$json =json_decode($json_string, true);
$arr = funToArgv($_POST['method']);
$arr['json'] = $json;
call_user_func_array($_POST['method'],$arr);

?>
