##	路由流量监控管理平台

![软件截图](http://github.com/ibird/wrbwmonForOpenMS/raw/master/screen.png)
###	What
	路由流量监控管理平台是为了方便网络管理人员监控流量而做的一套基于openwrt的软件。
	由后端shell脚本和前端web系统两部分组成。
	后端shell脚本起到监控流量、同步mac白名单的作用。
	前端web起到方便网络管理人员管理用户mac设备及用户流量。
	
###	Why
	在网络流量有限，而连接用户未知的情况下，总是会经常出现流量超用滥用的情况。
	在西电（当然诸如此类的网络环境应该还有很多），大多实验室、宿舍为了方便上网，都会采用openwrt的路由。
	而在这套精简版的路由上面，并没有好的流量监控管理软件。
	作者所在的活动室就处于这种情况的困扰，因此趁着这次比赛，实现了一个轻量级的流量监控管理系统

###	Where
	*	平台：
		-	OpenWrt		一款为路由定制的精简版Linux
	*	组件：
		-	iptable			Linux下最强大的防火墙，没有之一(自带)
		-	/etc/config/wireless	Openwrt下的MAC过滤配置文件（自带）
		-	cron			Linux下的定时管理任务守护进程（自带）
			Cron Config:
				* * * * * /bin/wrtbwmon setup br-lan
				* * * * * /bin/wrtbwmon update /www/openms/data.json
				3 1 1 * * /bin/wrtbwmon clear /www/openms/data.json /etc/config/wireless
		-	uhttpd			Openwrt下的web服务器	(opkg install uhttpd)
		-	php5			php解析器		(opkg install php5)
		-	php5-mod-json	php的json处理模块	(opkg install php5-mod-json）


###	How
	在开发前，我们找到了wrtbwmon这个脚本，一个运行在Openwrt上的利用iptable进行流量统计的shell脚本。
	在理解了wrtbwmon的工作机制之后，我们定义了一个json文件，结构参见文件data.json，作为该软件的数据结构。
	我们hack了wrtbwmon的setup功能，实现了通过filter.txt实现内网流量的过滤。
	我们hack了wrbwmon的update功能，将其输出按照我们定义的格式输入到data.json。
	实现了sync的功能，对于data.json的未超流量的Mac地址同步到data.json。
	实现了clear的功能，将data.json以日期备份然后将流量清零。
	最后，我们实现一套web管理系统，便于管理员操作，实现用户和设备的增删改操作,并且触发后端的脚本进行同步。
	
###	Who
	西安电子科技大学 计算机学院	袁少鹏
	西安电子科技大学 计算机学院	曾少剑
	如果在使用中有任何问题，请emai至ibirdyuan@gmail.com


