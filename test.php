<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="mystyle.css" />
	</head>
<?php
	$json = file_get_contents("data.json");
	$json = str_replace("\n","",$json);
	echo  "<script>var json = '$json'</script>";
?>
<script src="index.js"></script>
