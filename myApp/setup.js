//模块依赖
var mysql = require('mysql');
//var config = require('./config');

var fs=require('fs');
var file="./config.json";
var config=JSON.parse(fs.readFileSync(file));

//初始化客户端
//delete config.database;
var db = mysql.createConnection(config);
//创建数据库
//db.query('CREATE DATABASE IF NOT EXISTS `big_data` ');
db.query('use `big_data`');
//创建modulelist表
// db.query('DROP TABLE IF EXISTS moduleList');
// db.query('CREATE TABLE moduleList('+ 
// 	'`id` int(11) NOT NULL AUTO_INCREMENT,'+
// 	'`url` varchar(30) DEFAULT NULL,'+
// 	'`img` varchar(225) NOT NULL,'+
// 	'`name` varchar(30),'+
// 	'PRIMARY KEY (`id`))'+'ENGINE=InnoDB DEFAULT CHARSET=utf8');
//插入数据
// db.query("INSERT INTO `moduleList` VALUES ('1', 'course', 'http://localhost:8000/img/course.png','课程')");
// db.query("INSERT INTO `moduleList` VALUES ('2', 'news', 'http://localhost:8000/img/news.png','新闻')");
// db.query("INSERT INTO `moduleList` VALUES ('3', 'video', 'http://localhost:8000/img/video.png','纪录片')");
// db.query("INSERT INTO `moduleList` VALUES ('4', 'paper','http://localhost:8000/img/paper.png','论文')");
//创建courselist表
// db.query('DROP TABLE IF EXISTS courseList');
// db.query('CREATE TABLE courseList('+ 
// 	'`id` int(11) NOT NULL AUTO_INCREMENT,'+
// 	'`img` varchar(225) NOT NULL,'+
// 	'`name` varchar(30),'+
// 	'`intro` varchar(255),'+
// 	'PRIMARY KEY (`id`))'+'ENGINE=InnoDB DEFAULT CHARSET=utf8');
//插入数据
// db.query("INSERT INTO `courselist` VALUES ('1','http://localhost:8000/img/course1.png','Spark从零开始','本课程旨在让同学们了解Spark基础知识，掌握Spark基础开发。')");
// db.query("INSERT INTO `courselist` VALUES ('2','http://localhost:8000/img/course2.png','R语言入门与进阶','这门课将会带领您领略R语言的精髓,打开R语言的大门。')");
// db.query("INSERT INTO `courselist` VALUES ('3','http://localhost:8000/img/course3.png','机器学习-实现简单神经网络','人工智能时代，你准备好成为抓住机遇的那百分之二吗。')");
// db.query("INSERT INTO `courselist` VALUES ('4','http://localhost:8000/img/course4.png','电商大数据应用之用户画像','真正接触大数据，接触用户画像，掌握构建用户画像的方法。')");
//创建newslist表
// db.query('DROP TABLE IF EXISTS newslist');
// db.query('CREATE TABLE newslist('+
// 	'`id` int(11) NOT NULL AUTO_INCREMENT,'+
// 	'`img` varchar(225) NOT NULL,'+
// 	'`name` varchar(50),'+
// 	'`time` varchar(50),'+
// 	'PRIMARY KEY(`id`))'+'ENGINE=InnoDB DEFAULT CHARSET=utf8');
//插入数据
// db.query("INSERT INTO `newslist` VALUES ('1','http://localhost:8000/img/news1.png','指南 ▏如何快速全面建立自己的大数据知识体系？','2017-07-24 09:37')");
// db.query("INSERT INTO `newslist` VALUES ('2','http://localhost:8000/img/news2.png','关于大数据中的用户画像那些事，看这篇一文章就够了','2017-07-21 15:25')");

//创建documentarylist表
// db.query('DROP TABLE IF EXISTS documentarylist');
// db.query('CREATE TABLE documentarylist('+
// 	'`id` int(11) NOT NULL AUTO_INCREMENT,'+
// 	'`img` varchar(225) NOT NULL,'+
// 	'`name` varchar(50),'+
// 	'`episodes` varchar(50),'+
// 	'PRIMARY KEY(`id`))'+'ENGINE=InnoDB DEFAULT CHARSET=utf8');
// //插入数据
// db.query("INSERT INTO `documentarylist` VALUES ('1','http://localhost:8000/img/video1.png','互联网时代','12集')");
// db.query("INSERT INTO `documentarylist` VALUES ('2','http://localhost:8000/img/video2.png','现代生活的秘密规则：算法','1集')");
// db.query("INSERT INTO `documentarylist` VALUES ('3','http://localhost:8000/img/video3.png','谷歌与世界头脑','1集')");

//创建paperlist表
db.query('DROP TABLE IF EXISTS paperlist');
db.query('CREATE TABLE paperlist('+
	'`id` int(10) NOT NULL AUTO_INCREMENT,'+
	'`pclass` varchar(50) NOT NULL,'+
	'`name` varchar(50) NOT NULL,'+
	'`author` varchar(50) NOT NULL,'+
	'`time` varchar(50),'+
	'`keyword` varchar(225) NOT NULL,'+
	'PRIMARY KEY(`id`))'+'ENGINE=InnoDB DEFAULT CHARSET=utf8');
//插入数据
db.query("INSERT INTO `paperlist` VALUES ('1','[硕士学位论文]','面向大数据查询的索引技术研究','朱春莹  计算机科学与技术 山东大学','2016(学位年度)','数据查询 数据分类')");
db.query("INSERT INTO `paperlist` VALUES ('2','[会议论文]','大数据及其应用','冯斐   2015航空试验测试技术学术交流会','2015','大数据 特征 处理技术 大数据应用')");
db.query("INSERT INTO `paperlist` VALUES ('3','[期刊论文]','大数据与推荐系统','李翠平 蓝梦微 邹本友 王绍卿 赵衎衎 《大数据》','2015年1期','大数据 OLAP SQL分析 SQL on Hadoop')");
//关闭数据库
db.end();