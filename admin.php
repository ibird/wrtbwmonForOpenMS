<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="mystyle.css" />
	</head>
	<table>
		<tr>
			<td>姓名</td>
			<td>总流量(M)</td>
			<td>已用流量(M)</td>
			<td>设备名</td>
			<td>设备Mac地址</td>
			<td>上传量(M)</td>
			<td>下载量(M)</td>
			<td colspan='4'>操作</td>
		</tr>
<?php 
	$json_string = file_get_contents("data.json");
	$json = json_decode($json_string, true);

	$total_flow = 0;
	$total_out = 0;
	$total_in = 0;

	foreach ($json['club'] as $k => $v)
	{
		$device_n	= count($v['device']) + 1;
		$id		= $k;
		$name		= $v['name'];
		$total		= (int)($v['total'] / 1024 / 1024);
		$nowflow	= (int)($v['nowflow'] / 1024 / 1024);
		$total_flow    += $v['nowflow'];

		$id_flow = $id . '_flow';
		$id_type = $id . '_newtype';
		$id_mac = $id . '_newmac';

		echo "<tr>";
		echo "<td rowspan='$device_n'>$name</td>";
		echo "<td id='$id_flow' rowspan='$device_n'>$total</td>";
		echo "<td rowspan='$device_n'>$nowflow</td>";
		echo "<td id='$id_type'></td>";
		echo "<td id='$id_mac'></td>";
		echo "<td></td>";
		echo "<td></td>";
		echo "<td colspan='2'><input type='button' value='新增设备' name='$id'  onclick='addDevice(this)'/></td>";
		echo "<td rowspan='$device_n'><input type='button' value='修改流量' name='$id'  onclick='changeFlow(this)'/></td>";
		echo "<td rowspan='$device_n'><input type='button' value='删除用户' name='$id'  onclick='delUser(this)'/></td>";
		echo "</tr>";
		foreach($json['club'][$k]['device'] as $key=>$value)
		{
			$type = $value['type'];
			$mac = $value['mac'];
			$out = (int)($value['out'] / 1024 / 1024);
			$in = (int)($value['in'] / 1024 / 1024);


			$id_type = $id.'_'.$key . '_type';
			$id_mac = $id .'_'.$key . '_mac';

			$id_key = $id . '_' . $key;

			$total_out += (int)$value['out'];
			$total_in += (int)$value['in'];
			echo "<tr>";
			echo "<td id='$id_type'>$type</td>";
			echo "<td id='$id_mac'>$mac</td>";
			echo "<td>$out</td>";
			echo "<td>$in</td>";
			echo "<td><input type='button' value='修改Mac' name='$id_key' onclick='changeMac(this)'/></td>";
			echo "<td><input type='button' value='删除设备' name='$id_key' onclick='delDevice(this)'/></td>";
			echo "</tr>";

		}
	}

	$id = $id + 1;
	$total_flow = (int)($total_flow / 1024 / 1024);
	$total_out = (int)($total_out / 1024 / 1024);
	$total_in = (int)($total_in / 1024 / 1024);
	echo "<tr>";
	echo "<td id='newname'></td>";
	echo "<td id='newflow'></td>";
	echo "<td colspan='5'></td>";
	echo "<td colspan='4'><input type='button' value='新增用户' name='$id' onclick='addUser(this)' /></td>";
	echo "</tr>";
	echo "<tr>";
	echo "<td >总计</td>";
	echo "<td>30720</td>";
	echo "<td>$total_flow</td>";
	echo "<td colspan='2'></td>";
	echo "<td>$total_out</td>";
	echo "<td>$total_in</td>";
	echo "<td colspan='4'><input type='button' value='清零流量' onclick='cleanFlow()' /></td>";
	echo "</tr>";
?>
	</table>
	<script src="index.js"></script>
</html>
