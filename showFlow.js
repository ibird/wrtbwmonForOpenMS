	var obj = eval ("(" + json + ")");
	
	showJson = function(obj) {
		var user = new Array()
		var html = "<table> <tr> <td>姓名</td> <td>总流量</td> <td>已用流量</td> <td>设备名</td> <td>设备Mac地址</td> <td>上传量</td> <td>下载量</td></tr>"
		document.write(html)
		for (x in obj.club)
		{
			var user = "<tr><td>"+obj.club[x].name+"</td><td>"+obj.club[x].total+"</td><td>"+obj.club[x].flow+"</td><td colspan='4'></td></tr>"
			document.write(user)

			for ( y in obj.club[x].device)
			{
				i = obj.club[x].device[y]
				var device = "<tr><td colspan='3'></td><td>"+i.type+"</td><td>"+i.mac+"</td><td>"+i.down+"</td><td>"+i.up+"</td></tr>"
				document.write(device)
			}
		}
		document.write("</table>")
	}

	showJson(obj);
