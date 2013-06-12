	var json = eval ("(" + json + ")");
	
	showJson = function(obj) {
		var user = new Array()

		var total = new Array()
		total['flow'] = 0
		total['down'] = 0
		total['up'] = 0

		var html = "<table><tr><td>姓名</td><td>总流量(M)</td><td>已用流量(M)</td><td>设备名</td><td>设备Mac地址</td><td>上传量(M)</td><td>下载量(M)</td><td colspan='4'>操作</td></tr>"
		document.write(html)
		for (x in obj.club)
		{
			var device_n = obj.club[x].device.length + 1
			var totalFlow = parseInt(obj.club[x].total / 1024 / 1024 )
			var nowFlow = parseInt(obj.club[x].nowflow / 1024 / 1024)
			var user = "<tr><td rowspan='"+device_n+"'>"+obj.club[x].name+"</td><td rowspan='"+device_n+"'>"+totalFlow+"</td><td rowspan='"+device_n+"'>"+nowFlow+"</td><td></td><td></td><td></td><td></td><td colspan='2'><input type='button' value='新增设备' name='"+ obj.club[x].id+"'  onclick='add(this)'/></td><td rowspan='"+device_n+"'><input type='button' value='修改流量' name='"+ obj.club[x].id+"'  onclick='changeFlow(this)'/></td><td rowspan='"+device_n+"'><input type='button' value='删除用户' name='"+ obj.club[x].id+"'  onclick='delUser(this)'/></td></tr>"
			total['flow'] += parseFloat(nowFlow)
			document.write(user)

			for ( y in obj.club[x].device)
			{
				i = obj.club[x].device[y]
				down = (parseInt)(i.out / 1024 / 1024)
				up = (parseInt)(i.in / 1024 /1024)
				var device = "<td>"+i.type+"</td><td>"+i.mac+"</td><td>"+up+"</td><td>"+down+"</td><td><input type='button' value='修改Mac' name='"+obj.club[x].id+"' onclick='change(this)'/></td><td><input type='button' value='删除设备' name='"+obj.club[x].id+"' onclick='delDev(this)'/></td></tr>"
				document.write(device)

				total['down'] += down
				total['up'] += up
			}

			var nowID = parseInt(obj.club[x].id) + 1
		}
		var adduser = "<tr><td></td><td></td><td colspan='5'></td><td colspan='4'><input type='button' value='新增用户' name='" + nowID + "' onclick='addUser(this)' /></td></tr>"
		document.write(adduser);
		var end = "<tr><td >总计</td><td>30720</td><td>"+total['flow']+"</td><td colspan='2'></td><td>"+total['up']+"</td><td>"+total['down']+"</td><td colspan='4'><input type='button' value='清零流量' onclick='cleanFlow()' /></td></tr>"
		document.write(end)
		document.write("</table>")
		document.write("<div id='time' style='display:none'></div>")
	}

	var ajax = function(url, f, string){ 
		var xml = (window.XMLHttpRequest) ? (new XMLHttpRequest()) : (new ActiveXObject("Micorsoft.XMLHttpRequest"));
        	xml.onreadystatechange = function(){
       		//if(xml.readyState == 0) {
          		f(xml.responseText);
        	//}}
        	}

    		xml.open("POST",url,true);
    		xml.setRequestHeader("Content-type","application/x-www-form-urlencoded");	
		xml.send(string);
		}


	var add = function(obj){
		a = obj.parentNode.parentNode
		var arr = ['pc', 'kindle', 'phone', 'laptop', 'others']
		var select = initSelect(arr)
		a.childNodes[3].appendChild(select)

		var input = document.createElement("input")
		input.setAttribute('type', 'text')	
		a.childNodes[4].appendChild(input)

		a.childNodes[7].childNodes[0].setAttribute('value','确定')
		a.childNodes[7].childNodes[0].setAttribute('onclick','addSubmit(this)')
	}
	
	var initSelect = function( arr )
	{
		var select = document.createElement('select')
		for(i in arr)
		{
			var option = document.createElement('option')
			option.setAttribute('value', arr[i])
			option.text = arr[i]
			select.appendChild(option)
		}
		return select
	}	

	var delUser = function(obj){
		var r = confirm("您确定要删除该设备？")
		if (r == true)
		{
			method = 'delUser'
			id = obj.name
			string = "id=" + id + "&method=" +method
			ajax('/openms/accept.php',check,string)
		}		
	}
	var changeFlow = function(obj){
		a = obj.parentNode.parentNode
		a.childNodes[1].removeChild(a.childNodes[1].childNodes[0])

		var arr = ['1','2','3','4','5']
		var select = initSelect(arr)

		a.childNodes[1].appendChild(select)

		a.childNodes[8].childNodes[0].setAttribute('value','确定')
		a.childNodes[8].childNodes[0].setAttribute('onclick','changeFlowSub(this)')
	}

	var changeFlowSub = function(obj) {
		a = obj.parentNode.parentNode
		select =  a.childNodes[1].childNodes[0]
		flow = select.options[select.selectedIndex].text
		id = obj.name
		method = 'changeFlow'
		string = "flow=" + flow + "&id=" + id  + "&method=" + method
		ajax('/openms/accept.php', check, string)
		
	}
	var delDev = function(obj){
		var r = confirm("您确定要删除该设备？")
		if (r == true)
		{
			a = obj.parentNode.parentNode
			mac = a.childNodes[1].childNodes[0].nodeValue	
			method = 'delDev'
			id = obj.name
			string = "mac=" + mac + "&id=" + id + "&method=" +method
			ajax('/openms/accept.php',check,string)
		}		
	}


	var addUser = function(obj){
		a = obj.parentNode.parentNode

		var input = document.createElement("input")
		input.setAttribute('type', 'text')	
		a.childNodes[0].appendChild(input)

		arr = ['1','2','3','4','5']
		select = initSelect(arr)
		a.childNodes[1].appendChild(select)

		a.childNodes[3].childNodes[0].setAttribute('value','确定')
		a.childNodes[3].childNodes[0].setAttribute('onclick','addUserSubmit(this)')
	}

	var change = function(obj){
		a = obj.parentNode.parentNode
		oldmac = a.childNodes[1].childNodes[0].nodeValue	
		a.childNodes[1].removeChild(a.childNodes[1].childNodes[0])
		var input = document.createElement("input")
		input.setAttribute('type', 'text')	
		input.setAttribute('value', oldmac)	
		a.childNodes[1].appendChild(input)

		a.childNodes[4].childNodes[0].setAttribute('value','确定')
		a.childNodes[4].childNodes[0].setAttribute('onclick','changeSubmit(this)')
	}
	
	var addSubmit = function(obj){
		a = obj.parentNode.parentNode
		select =  a.childNodes[3].childNodes[0]
		device = select.options[select.selectedIndex].text
		macaddr = a.childNodes[4].childNodes[0].value	
		id = obj.name
		method = 'add'
		string = "device=" + device + "&macaddr=" + macaddr + "&id=" + id  + "&method=" + method
		ajax('/openms/accept.php', check, string)
	}

	var addUserSubmit = function(obj){
		a = obj.parentNode.parentNode
		select = a.childNodes[1].childNodes[0]
		name = a.childNodes[0].childNodes[0].value
		total = select.options[select.selectedIndex].text 
		id = obj.name;
		method = 'adduser'
		string = 'id=' + id +  '&name=' + name + "&total=" + total + "&method=" + method
		ajax('/openms/accept.php', check, string)
	}

	var changeSubmit = function(obj){
		a = obj.parentNode.parentNode
		device =  a.childNodes[0].childNodes[0].nodeValue
		macaddr = a.childNodes[1].childNodes[0].value	
		id = obj.name
		method = 'change'
		string = "device=" + device + "&macaddr=" + macaddr + "&id=" + id  + "&method=" + method
		ajax('/openms/accept.php', check, string)
	}

	var cleanFlow = function()
	{
		string = 'method=cleanFlow'
		ajax('/openms/accept.php', check, string)
	}

	var check = function(response){
			time = document.getElementById('time')
			var input =document.createElement('input')
			input.setAttribute('type', 'button')
			input.setAttribute('value', '倒计时')
			time.appendChild(input)
			var input =document.createElement('input')
			input.setAttribute('type', 'button')
			input.setAttribute('value', '2')
			input.setAttribute('name', 'timer')
			time = document.getElementById('time')
			time.appendChild(input)
			timer()
	}
	var timer =function(){
		var value=Number(document.all['timer'].value);
	        if (value>1) 
	        	document.all['timer'].value=value-1;
		else {
			window.location.assign('http://10.0.0.1/openms/index.php')
                 }
                 window.setTimeout("timer()",1000);
	}
	showJson(json);
