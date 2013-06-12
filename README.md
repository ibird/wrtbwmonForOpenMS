路由流量监控管理平台

平台：
OpenWrt  		----	一款为路由定制的精简版Linux

组件：
Iptable  		---- 	Linux下最强大的防火墙，没有之一
/etc/config/wireless	----	Openwrt下的MAC过滤配置文件	
Cron			----	Linux下的定时管理任务守护进程

脚本：
Wrtbwmon		----	一个利用iptable进行流量统计的shell脚本
	setup 	添加设备到iptables
	update	将iptables中统计的流量更新到/tmp/usage.db
	publish	将/tmp/usage.db的数据输出成html格式

我们的工作:

通过Hack Wrtbwmon这个脚本，与/etc/config/wireless协同工作，实现流量监控、管理、设备添加，并且为其做一套便于操作的web控制平台。

通过定义一个json文件，实现我们所要存储的数据结构,大致结构参见data.json
将wrtbwmon的update按照json的格式输出到data.json
实现一个sync的功能，将data.json的未超流量的Mac地址同步到data.json
实现一个clear的功能，将data.json中的已用流量清零

实现一套web管理系统，便于管理员操作，实现用户和设备的增删改操作,并且触发后端的脚本去同步。

Cron配置:
* * * * * /bin/wrtbwmon setup br-lan
* * * * * /bin/wrtbwmon update /www/openms/data.json
3 1 1 * * /bin/wrtbwmon clear /www/openms/data.json /etc/config/wireless
