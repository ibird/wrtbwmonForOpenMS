var typeArr = ['pc', 'kindle', 'phone', 'laptop', 'others']
var flowArr = ['1','2','3','4','5']

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

//替换节点
var changeId = function(id, newtype)
{
	old = document.getElementById(id)
	if(old.childNodes)
	{
		old.removeChild(old.firstChild)
	}
	old.appendChild(newtype)
}

//新增设备
var addDevice = function(obj)
{
	id = obj.name
	oldtype = id + '_newtype'
	oldmac = id + '_newmac'
	
	changeId(oldtype, initSelect(typeArr))
	
	var input =document.createElement('input')
	input.setAttribute('type' , 'text')
	
	changeId(oldmac, input)
	obj.setAttribute('value','确定')
	obj.setAttribute('onclick','Submit()')
}

//更改流量
var changeFlow = function(obj)
{
	id = obj.name
	oldflow = id + '_flow'

	changeId(oldflow, initSelect(flowArr))

	obj.setAttribute('value','确定')
	obj.setAttribute('onclick','Submit()')
}


//修改Mac
var changeMac = function(obj)
{
	id = obj.name
	oldmac = id + '_mac'

	var input =document.createElement('input')
	input.setAttribute('type' , 'text')
	input.setAttribute('value', document.getElementById(oldmac).firsttChild.nodeValue)
	changeId(oldmac, input)
	obj.setAttribute('value','确定')
	obj.setAttribute('onclick','Submit()')
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

//删除设备
var delDevice = function(obj){
	var r = confirm("您确定要删除该设备？")
	if (r == true)
	{
		id = obj.name
		id_mac = id +  '_mac'
		mac = document.getElementById(id_mac).firstChild
		method = 'delDev'
		string = "mac=" + mac + "&id=" + id + "&method=" +method
		ajax('/openms/accept.php',check,string)
	}		
}

var Submit = function()
{}
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
