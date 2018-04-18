//模块依赖
var mysql = require('mysql');
var express =  require('express');
var bodyParser = require('body-parser');  

var config = require('./config.json');

var sendMail = require('./mail.js');
//连接mysql
// var db = mysql.createConnection(config);
//console.log('数据库连接success');
//创建应用
var app = express();
// var router = express.Router();

var appData = require('./mock/data.json');
var students = appData.students;

var courseListData = require('./mock/courseList.json');
var TestListData = require('./mock/courseTestList.json');
var completedData = require('./mock/completed.json');
var uncompleteData = require('./mock/uncomplete.json');

const ips = '10.2.212.42:7000';

app.use(bodyParser.urlencoded({ extended: false }));//extended为false表示使用querystring来解析数据，这是URL-encoded解析器  
app.use(bodyParser.json());
app.use(express.static('www'));

exports = module.exports = function(path){
	//登录验证
	app.post('/students_info', function (req, res) {
		var user_info = req.body;
		var flag = false;
		for(var index in students){
			console.log(user_info);
			console.log(students[index]);
			flag = (user_info.Id === students[index].id && user_info.Pass === students[index].pass);
			if(flag){
				res.json({
					data:{"result":flag,"user":students[index]}
				});
				break;
			}
		}
		if(!flag){
			res.json({
				data:{result:flag}
			});
		}
	});

	//发送邮件验证码
	app.post('/get_verification',function(req,res){
		var mailAddr = req.body.mail;
		console.log(mailAddr);
		var title = "【大数据资源网】邮箱验证码";
		//随机生成验证码
		var Num=""; 
		for(var i=0;i<6;i++) 
		{ 
			Num+=Math.floor(Math.random()*10); 
		} 
		var content = '亲爱的大数据资源网用户，您的验证码是('+Num+'),千万不要告诉别人哦~';

		// 拼接 2373498353@qq.com
		var mailOptions = {
		    from: '462156634@qq.com', // 发件地址
		    to: mailAddr, // 收件列表
		    subject: title, // 标题
		    //text和html两者只支持一种
		    text: content, // 标题
		    html: '<b>'+content+'</b>' // html 内容
		};
		// 发送邮件
		sendMail(mailOptions);
		res.json({
			data:{identify:Num,mail:mailAddr}
		});
	});

	//修改密码
	app.post('/alter_pass',function(req,res){
		var new_pass = req.body.newPass;
		res.json({
			data:{status:true}
		});
	});

	//课程列表
	app.get('/getCourseList',function(req,res){
		res.json({body:courseListData});
	});
	//测试列表
	app.get('/getTestList',function(req,res){
		res.json({body:TestListData});
	});
	//未完成的试题
	app.get('/getTestInfo/uncomplete',function(req,res){
		res.json({body:uncompleteData});
	});
	//已完成的试题
	app.get('/getTestInfo/completed',function(req,res){
		res.json({body:completedData});
	});
	//提交试题
	app.post('/question_submit',function(req,res){
		var returnData = { studentid: 1,testid: 1,answerIstrueArr: [ 0, 0, 1, 1 ],trueOptionArr: [ 4, 4, 4, 1 ]};
		res.json({body:returnData});
	});
	//首页路由
	//四大模块查询
	// var modulelist = [];
	// db.query('SELECT url,img,name FROM modulelist',function(err,results){
	// 	if(err){
	// 		throw err;
	// 	}
	// 	if(results){
	// 		for(var i = 0; i < results.length; i++) {
	// 			modulelist[i]=[results[i].url,results[i].img,results[i].name];
	// 		}
	// 	}
	// });
	// app.get("/header", function(req,res){
	// 	res.send(modulelist);
	// 	//res.render('controllers.js',{modulelist:results});
	// });

	//课程清单查询
	//var courselist = [];
	//首页最新课程清单
	// db.query('select * from courselist order by id DESC limit 2',function(err,results){
	// 	if(err){
	// 		throw err;
	// 	}
	// 	//courselist=results;
	// 	//console.log(courselist);
	// 	app.get("/update_courselist",function(req,res){
	// 		res.send(results);
	// 	});
	// });
	//所有课程清单
	// db.query('select * from courselist',function(err,results){
	// 	if(err){
	// 		throw err;
	// 	}
	// 	app.get("/courselist_all",function(req,res){
	// 		res.send(results);
	// 	});
	// });

 //    //新闻清单查询
 //    //首页最新新闻清单
 //    db.query('select * from newslist order by id DESC limit 2',function(err,results){
 //    	if(err){
 //    		throw err;
 //    	}
 //    	app.get("/update_newslist",function(req,res){
 //    		res.send(results);
 //    	});
 //    });
 //    //所有新闻清单
 //    db.query('select * from newslist',function(err,results){
	// 	if(err){
	// 		throw err;
	// 	}
	// 	app.get("/newslist_all",function(req,res){
	// 		res.send(results);
	// 	});
	// });

 //    //纪录片清单查询
 //    //首页最新纪录片清单
 //     db.query('select * from documentarylist order by id DESC limit 3',function(err,results){
 //    	if(err){
 //    		throw err;
 //    	}
 //    	app.get("/update_documentarylist",function(req,res){
 //    		res.send(results);
 //    	});
 //    });
 //     //所有纪录片清单
 //     db.query('select * from documentarylist',function(err,results){
	// 	if(err){
	// 		throw err;
	// 	}
	// 	app.get("/documentarylist_all",function(req,res){
	// 		res.send(results);
	// 	});
	// });

 //    //论文清单查询
 //    //首页最新论文清单
 //    db.query('select * from paperlist order by id DESC limit 3',function(err,results){
 //    	if(err){
 //    		throw err;
 //    	}
 //    	app.get("/update_paperlist",function(req,res){
 //    		res.send(results);
 //    	});
 //    });
 //    //所有论文清单
 //    db.query('select * from paperlist',function(err,results){
	// 	if(err){
	// 		throw err;
	// 	}
	// 	app.get("/paperlist_all",function(req,res){
	// 		res.send(results);
	// 	});
	// });

	// app.get("/ajax_data", function(req,res){
	// 	res.send('hello world!');
	// });

	app.listen(7000);
	console.log('server start!');    
}