<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="mystyle.css" />
	</head>
<?php
	$json_string = file_get_contents("data.json");
	$json = json_decode($json_string, true);
?>
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
	foreach ($json['club'] as $k => $v)
	{
			$device_n	= count($v['device']) + 1;
			$id			= $v['id'];
			$name		= $v['name'];
			$total		= $v['total'];
			$nowflow	= $v['nowflow'];
			echo "<tr>";
			echo "<td rowspan='$device_n'>$name</td>";
			echo "<td rowspan='$device_n'>$total</td>";
			echo "<td rowspan='$device_n'>$nowflow</td>";
			echo "<td></td>";
			echo "<td></td>";
			echo "<td></td>";
			echo "<td></td>";
			echo "<td colspan='2'><input type='button' value='新增设备' name='$id'  onclick='add(this)'/></td>";
			echo "<td rowspan='$device_n'><input type='button' value='修改流量' name='$id'  onclick='changeFlow(this)'/></td>";
			echo "<td rowspan='$device_n'><input type='button' value='删除用户' name='$id'  onclick='delUser(this)'/></td>";
			echo "</tr>";
	}
	/*
		</tr>
		<tr>
			<td>"+i.type+"</td>
			<td>"+i.mac+"</td>
			<td>"+up+"</td>
			<td>"+down+"</td>
			<td><input type='button' value='修改Mac' name='"+obj.club[x].id+"' onclick='change(this)'/></td>
			<td><input type='button' value='删除设备' name='"+obj.club[x].id+"' onclick='delDev(this)'/></td>
		</tr>
		<tr>
			<td></td>
			<td></td>
			<td colspan='5'></td>
			<td colspan='4'><input type='button' value='新增用户' name='" + nowID + "' onclick='addUser(this)' /></td>
		</tr>
		<tr>
			<td >总计</td>
			<td>30720</td>
			<td>"+total['flow']+"</td>
			<td colspan='2'></td>
			<td>"+total['up']+"</td>
			<td>"+total['down']+"</td>
			<td colspan='4'><input type='button' value='清零流量' onclick='cleanFlow()' /></td>
			</tr>
	 */
?>
	</table>
	<script src="index.js"></script>
</html>
