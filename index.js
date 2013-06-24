var typeArr = ['pc', 'kindle', 'phone', 'laptop', 'others']
var flowArr = ['1','2','3','4','5']
var Ajax_URL = '/FControl/accept.php'
var flag = 1

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

var checkMac = function(macaddr)
{
	var patt = new RegExp('^([0-9a-f]{2}:){5}[0-9a-f]{2}$')
	return patt.test(macaddr)
}

var arrToStr = function(arr)
{
	var str = ''
	for( x in arr )
	{
		str += x + '='
		str += arr[x] + '&'
	}
	str = str.slice(0,-1)
	return str
}

var checkFlag = function()
{
	if (flag == 0)
	{
		alert('请确认执行完上一个操作！')
		return false
	}

	flag = 0
	return true

}

//ajax方法
var ajax = function(url, f, string){ 
	var xml = (window.XMLHttpRequest) ? (new XMLHttpRequest()) : (new ActiveXObject("Micorsoft.XMLHttpRequest"));
	xml.onreadystatechange = function(){
		if(xml.readyState == 4 && xml.status == 200)
		{
  			f(xml.responseText);
		}
	}

	xml.open("POST",url,true);
	xml.setRequestHeader("Content-type","application/x-www-form-urlencoded");	
	xml.send(string);
}

//替换节点
var changeId = function(id, newtype)
{
	var old = document.getElementById(id)
	if(old.firstChild != null)
	{
		old.removeChild(old.firstChild)
	}
	old.appendChild(newtype)
}

//新增设备
var addDevice = function(obj)
{
	if(!checkFlag())return;

	var id = obj.name
	var oldtype = id + '_newtype'
	var oldmac = id + '_newmac'
	
	arr = {'method':'addDevice','id':id, 'node':{'device':oldtype,'macaddr':oldmac}}
	changeId(oldtype, initSelect(typeArr))
	
	var input =document.createElement('input')
	input.setAttribute('type' , 'text')
	
	changeId(oldmac, input)
	obj.setAttribute('value','确定')
	obj.setAttribute('onclick','Submit(arr)')
}

//新增用户
var addUser = function(obj)
{
	if(!checkFlag())return;

	var input =document.createElement('input')
	input.setAttribute('type' , 'text')
	changeId('newname', input)

	changeId('newflow', initSelect(flowArr))

	arr = {'method':'addUser','node':{'name':'newname','total':'newflow'}}

	obj.setAttribute('value','确定')
	obj.setAttribute('onclick','Submit(arr)')

}
//更改流量
var changeFlow = function(obj)
{
	if(!checkFlag())return;

	id = obj.name
	oldflow = id + '_flow'

	arr = {'method':'changeFlow','id':id, 'node':{'flow':oldflow}}

	changeId(oldflow, initSelect(flowArr))

	obj.setAttribute('value','确定')
	obj.setAttribute('onclick','Submit(arr)')
}


//修改Mac
var changeMac = function(obj)
{
	if(!checkFlag())return;

	var id = obj.name
	var oldmac = id + '_mac'
	var oldtype = id + '_type'
	
	arr = {'method':'changeMac','id':id, 'node':{'macaddr':oldmac}}

	var input =document.createElement('input')
	input.setAttribute('type' , 'text')
	input.setAttribute('value', document.getElementById(oldmac).firstChild.nodeValue)
	changeId(oldmac, input)
	obj.setAttribute('value','确定')
	obj.setAttribute('onclick','Submit(arr)')
}
	
//删除用户
var delUser = function(obj){
	if(!checkFlag())return;

	var r = confirm("您确定要删除该设备？")
	if (r == true)
	{
		var arr = {}
		arr['method'] = 'delUser'
		arr['id'] = obj.name
		string = arrToStr(arr)
		ajax(Ajax_URL,check,string)
	}		
	flag = 1
}

//删除设备
var delDevice = function(obj){
	if(!checkFlag())return;

	var r = confirm("您确定要删除该设备？")
	if (r == true)
	{
		var arr = {}
		arr['id'] = obj.name
		arr['method'] = 'delDevice'
		string = arrToStr(arr)
		ajax(Ajax_URL,check,string)
	}		
	flag = 1
}

var Submit = function(arr)
{
	var send = {}
	if(arr['id'])
	{
		send['id'] = arr['id']
	}
	send['method'] = arr['method']
	for(x in arr['node'])
	{
		var node = document.getElementById(arr['node'][x])
		text = node.firstChild.value
		send[x] = text
	}
	for(x in send)
	{
		if(x == 'macaddr' && checkMac(send[x]) == false)
		{
			alert('请检查mac地址的格式')
			return;
		}
	}
	string = arrToStr(send)
	ajax(Ajax_URL,check,string)
	flag = 1
}

//清除流量后通过ajax方法提交
var cleanFlow = function()
{
	string = 'method=cleanFlow'
	ajax(Ajax_URL, check, string)
	flag = 1
} 

var check = function(response){
		timer()
}

var timer =function(){
	window.location.assign('http://127.0.0.1/FControl/index.php')
}
