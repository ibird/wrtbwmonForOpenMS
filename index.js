	//将json字符串转化为json对象
	var json = eval ("(" + json + ")");

	//将data.json中的数据输出为html	
	showJson = function(obj) {

		var total = []
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
			total['flow'] += nowFlow

			var html = "<tr><td rowspan='"+device_n+"'>"+obj.club[x].name+"</td><td rowspan='"+device_n+"'>"+totalFlow+"</td><td id='" + x + "_flow' rowspan='"+device_n+"'>"+nowFlow+"</td><td></td><td></td><td></td><td></td><td colspan='2'><input type='button' value='新增设备' name='"+ obj.club[x].id+"'  onclick='add(this)'/></td><td rowspan='"+device_n+"'><input type='button' value='修改流量' name='"+ obj.club[x].id+"'  onclick='changeFlow(this)'/></td><td rowspan='"+device_n+"'><input type='button' value='删除用户' name='"+ obj.club[x].id+"'  onclick='delUser(this)'/></td></tr>"


			document.write(html)

			for ( y in obj.club[x].device)
			{
				i = obj.club[x].device[y]
				down = (parseInt)(i['out'] / 1024 / 1024)
				up = (parseInt)(i['in'] / 1024 /1024)
				total['down'] += down
				total['up'] += up

				var html = "<td>"+i.type+"</td><td>"+i.mac+"</td><td>"+up+"</td><td>"+down+"</td><td><input type='button' value='修改Mac' name='"+obj.club[x].id+"' onclick='change(this)'/></td><td><input type='button' value='删除设备' name='"+obj.club[x].id+"' onclick='delDev(this)'/></td></tr>"
				document.write(html)

			}

			var nowID = parseInt(obj.club[x].id) + 1
		}

		html = "<tr><td></td><td></td><td colspan='5'></td><td colspan='4'><input type='button' value='新增用户' name='" + nowID + "' onclick='addUser(this)' /></td></tr>"
		document.write(html);

		html = "<tr><td >总计</td><td>30720</td><td>"+total['flow']+"</td><td colspan='2'></td><td>"+total['up']+"</td><td>"+total['down']+"</td><td colspan='4'><input type='button' value='清零流量' onclick='cleanFlow()' /></td></tr></table>"
		document.write(html)

		document.write("<div id='time' style='display:none'></div>")
	}
	
	//ajax方法
	var ajax = function(url, f, string){ 
		var xml = (window.XMLHttpRequest) ? (new XMLHttpRequest()) : (new ActiveXObject("Micorsoft.XMLHttpRequest"));
        	xml.onreadystatechange = function(){
          		f(xml.responseText);
        	}

    		xml.open("POST",url,true);
    		xml.setRequestHeader("Content-type","application/x-www-form-urlencoded");	
		xml.send(string);
		}

	//增加设备
	var add = function(obj){
		a = obj.parentNode.parentNode
		var arr = ['pc', 'kindle', 'phone', 'laptop', 'others']
		var select = initSelect(arr)
		a.childNodes[3].appendChild(select)

		var input = document.createElement("input")
		input.setAttribute('type', 'text')	
		a.childNodes[4].appendChild(input)

		obj.setAttribute('value','确定')
		obj.setAttribute('onclick','addSubmit(this)')
	}
	
	//初始化select标签，参数为option的value值的数组
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
	
	//删除用户
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

	//更改用户总流量
	var changeFlow = function(obj){
		a = obj.parentNode.parentNode
		a.childNodes[1].removeChild(a.childNodes[1].childNodes[0])

		var arr = ['1','2','3','4','5']
		var select = initSelect(arr)

		a.childNodes[1].appendChild(select)

		a.childNodes[8].childNodes[0].setAttribute('value','确定')
		a.childNodes[8].childNodes[0].setAttribute('onclick','changeFlowSub(this)')
	}

	//更改用户流量后通过ajax方法提交
	var changeFlowSub = function(obj) {
		a = obj.parentNode.parentNode
		select =  a.childNodes[1].childNodes[0]
		flow = select.options[select.selectedIndex].text
		id = obj.name
		method = 'changeFlow'
		string = "flow=" + flow + "&id=" + id  + "&method=" + method
		ajax('/openms/accept.php', check, string)
		
	}

	//删除设备
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

	//增加用户
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
	
	//更改设备的mac地址
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
	
	//增加设备后通过ajax方法提交
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

	//增加用户后通过ajax方法提交
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
	
	//改变设备mac地址后通过ajax方法提交
	var changeSubmit = function(obj){
		a = obj.parentNode.parentNode
		device =  a.childNodes[0].childNodes[0].nodeValue
		macaddr = a.childNodes[1].childNodes[0].value	
		id = obj.name
		method = 'change'
		string = "device=" + device + "&macaddr=" + macaddr + "&id=" + id  + "&method=" + method
		ajax('/openms/accept.php', check, string)
	}

	//清除流量后通过ajax方法提交
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
	//计时器方法，在ajax方法下没改变一次response状态，一秒后再发起请求，保证后端wifi重置后，网页连接能再次连上
	var timer =function(){
		var value=Number(document.all['timer'].value);
	        if (value>1) 
	        	document.all['timer'].value=value-1;
		else {
			window.location.assign('http://10.0.0.1/openms/index.php')
                 }
                 window.setTimeout("timer()",1000);
	}
	//显示页面
	//showJson(json);
