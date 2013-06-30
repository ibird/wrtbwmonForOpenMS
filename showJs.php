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
			echo "</tr>";

		}
	}

	$id = $id + 1;
	$total_flow = (int)($total_flow / 1024 / 1024);
	$total_out = (int)($total_out / 1024 / 1024);
	$total_in = (int)($total_in / 1024 / 1024);
	echo "<tr>";
	echo "<td >总计</td>";
	echo "<td>30720</td>";
	echo "<td>$total_flow</td>";
	echo "<td colspan='2'></td>";
	echo "<td>$total_out</td>";
	echo "<td>$total_in</td>";
	echo "</tr>";
?>
	</table>
	<script src="index.js"></script>
</html>
