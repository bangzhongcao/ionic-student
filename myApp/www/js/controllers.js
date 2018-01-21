angular.module('starter.controllers', [])
// 登录
.controller('loginCtrl',['$rootScope','$scope','$state','$interval','$timeout','$http',function($rootScope,$scope,$state,$interval,$timeout,$http){
  //输入框获取焦点 失去焦点
  $scope.isFocus = false;
  $scope.Focus = function(){
    $scope.isFocus = true;

  }
  $scope.Blur = function(){
    $scope.isFocus = false;
  }
  // 按钮disabled
  $scope.isDisabled = false;
  $scope.IsUserInfoRight = function(){
    $scope.isDisabled = $scope.user_Id&&$scope.user_pass;
  }

  //初始化用户信息
  // 表单验证
  $scope.isTip = false;
  $scope.tips = '';
  // 提示框显示时间
  function showTips(info){
    $scope.isTip = true;
    $scope.tips = info;
    var times = $timeout(function() {
      $scope.isTip = false;
      $scope.tips = '';
      $timeout.cancel(times);
    }, 2000);
  }

  // 提交
  $scope.submit = function(){
    // var DefaultHeadPic = '/img/headPic.png';
    $http({
      method:'POST',
      url:'/students_info',
      data:{
        "Id":$scope.user_Id,
        "Pass":$scope.user_pass
      }
    }).success(function(res){
      if(res.data.result){
        sessionStorage.setItem('userName', res.data.user.name);
        // sessionStorage.userName = res.user.name;
        $state.go('tab.dash');
      }else{
        showTips('学号或密码错误');
      }
    }).error(function(res){
      showTips(res);
    });
  }
}])

//忘记密码页面
.controller('forgetCtrl',['$scope','$state','$interval','$timeout','$http',function($scope,$state,$interval,$timeout,$http){
  $scope.isDisabled = false;
  $scope.mail_code = '';
  // 下一步按钮disabled
  $scope.IsInfoRight = function(){
    $scope.isDisabled = $scope.mail_addr && $scope.mail_code.length===6;
  }

  //提示信息
  $scope.isTip = false;
  $scope.tips = '';
  // 提示框显示时间
  function showTips(info){
    $scope.isTip = true;
    $scope.tips = info;
    var times = $timeout(function() {
      $scope.isTip = false;
      $scope.tips = '';
      $timeout.cancel(times);
    }, 2000);
  }

  // 验证码倒计时
  function countDown(){
    $scope.isCode = true;
      var count = 120;
      $scope.time='120s';
      var interval = $interval(function(){
        if(count<=0){
          $interval.cancel(interval);
          $scope.time = '';
          $scope.isCode = false;
        }else{
          count--;
          $scope.time = count+'s';
        }
      },1000);
  }
  //发送验证码
  $scope.isCode = false;
  var mailReg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
  var identify_num = '';//验证码
  var mailaddr = '';
  $scope.getCode = function(){
    if(mailReg.test($scope.mail_addr)){
        $http({
          method:'POST',
          url:'/get_verification',
          data:{
            mail:$scope.mail_addr
          }
        }).success(function(res){
          identify_num = res.data.identify;
          mailaddr = res.data.mail;
          countDown();
        }).error(function(res){
          alert(res);
        });
    }else{
      showTips('请输入正确的邮箱');
    } 
  }
  // 点击进入下一步
  $scope.submitMail = function(){
    if($scope.isCode){
        if($scope.mail_code===identify_num && $scope.mail_addr === mailaddr){
          $state.go('alterPass');
        }else{
          showTips('验证码不正确');
        }
    }else{
        showTips('请重新获取验证码');
        identify_num = '';
    }
  }
}])


//修改密码页面
.controller('alterPassCtrl',['$scope','$state','$interval','$timeout','$http',function($scope,$state,$interval,$timeout,$http){
  // 初始化
  $scope.new_pass = '';
  $scope.sec_pass = '';
  //提示信息
  $scope.isTip = false;
  $scope.tips = '';
  // 提示框显示时间
  function showTips(info){
    $scope.isTip = true;
    $scope.tips = info;
    var times = $timeout(function() {
      $scope.isTip = false;
      $scope.tips = '';
      $timeout.cancel(times);
    }, 2000);
  }

  // 确定按钮默认为disabled
  $scope.isDisabled = false;
  // 下一步按钮disabled
  $scope.IsPassRight = function(){
    $scope.isDisabled = $scope.userId && $scope.new_pass.length >=6 && $scope.sec_pass.length>=6;
  }
  // 提交新密码
  $scope.submitAlterPass = function(){
    if($scope.new_pass === $scope.sec_pass){
      $http({
        method:'POST',
        url:'/alter_pass',
        data:{'id':$scope.userId,'newPass':$scope.sec_pass}
      }).success(function(res){
        if(res.data.status){
          console.log(res);
          $state.go('login');
        }
      }).error(function(res){
        console.log(res);
      })
    }else{
      showTips('两次密码输入不相同');
    }
  }
}])



// 首页
.controller('DashCtrl',['$scope','$ionicScrollDelegate','$http',function($scope,$ionicScrollDelegate,$http) {
  $scope.isHidden = false;
  // 搜索框颜色渐变
  $scope.scroll = function(){
    var banner = document.getElementsByClassName('head_search')[0];
    var imgList = document.getElementsByClassName('imgList')[0];
    var height = imgList.offsetHeight - banner.offsetHeight;
    var top = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
    if(top>=0){
      $scope.$apply(function(){
        $scope.isHidden = false;
      });
      if(top>height){
        banner.style.backgroundColor = 'rgba(212,63,58,1)';
      }else{
        var op = top/height* 1;
        banner.style.backgroundColor = 'rgba(212,63,58, '+op+')';
      }
    }else{
      $scope.$apply(function(){
        $scope.isHidden = true;
      });
    }
    
  }

  $scope.modulelist = [{
      url:'course',
      img:'img/course.png',
      name:'我的课程'
    },{
      url:'tab.dash',
      img:'img/news.png',
      name:'作业'
    },{
      url:'tab.dsah',
      img:'img/video.png',
      name:'视频'
    },{
      url:'tab.dash',
      img:'img/paper.png',
      name:'论文'
    }];
//四大模块，课程，新闻，纪录片，论文
//发起请求向数据库调用模块数据信息
// var moduleinfo=[];
// $http({
//       method:'GET',
//       url:'/header',
//     }).then(function(res){ 
//         var results = res['data'];
//         console.log(results);      
//         results.forEach(function(item){
//             var url = item[0];
//             //console.log(item[0]);
//             var img = item[1];
//             //console.log(img);
//             var name = item[2];
//             var moduledata ={
//                 url: url,
//                 img: img,
//                 name: name
//             }
//             moduleinfo.push(moduledata);
//         });
//      });

//   $scope.modulelist=moduleinfo;


  //[moduleinfo[0],moduleinfo[1],moduleinfo[2],moduleinfo[3]];
  // [{
  //   url:'course',
  //   img:'img/course.png',
  //   name:'课程'
  // },{
  //   url:'news',
  //   img:'img/news.png',
  //   name:'新闻'
  // },{
  //   url:'video',
  //   img:'img/video.png',
  //   name:'纪录片'
  // },{
  //   url:'paper',
  //   img:'img/paper.png',
  //   name:'论文'
  // }];

  //首页最新课程清单
  // var courseinfo=[];
  // $http({
  //     method:'GET',
  //     url:'/update_courselist',
  //   }).then(function(res){ 
  //       var results = res['data'];
  //       //console.log(results);      
  //       results.forEach(function(item){
  //           var id = item['id'];
  //           //console.log(id);
  //           var img = item['img'];
  //           //console.log(img);
  //           var name = item['name'];
  //           //console.log(name);
  //           var intro = item['intro'];
  //           //console.log(intro);
  //           var coursedata ={
  //               id: id,
  //               img: img,
  //               name: name,
  //               intro: intro
  //           }
  //           courseinfo.push(coursedata);
  //       });
  //    });
  // $scope.courselist = courseinfo;

  // [{
  //   id:1,
  //   img:'img/course1.png',
  //   name:'Spark从零开始',
  //   intro:'本课程旨在让同学们了解Spark基础知识，掌握Spark基础开发。'
  // },{
  //   id:2,
  //   img:'img/course2.png',
  //   name:'R语言入门与进阶',
  //   intro:'这门课将会带领您领略R语言的精髓,打开R语言的大门。'
  // }];

  //首页最新新闻清单
  // var newsinfo = [];
  // $http({
  //     method:'GET',
  //     url:'/update_newslist',
  // }).then(function(res){
  //   console.log(res);
  //     var results = res['data'];
  //     console.log(results);
  //     results.forEach(function(item){
  //           var id = item['id'];
  //           var img = item['img'];
  //           var name = item['name'];
  //           var time = item['time'];
  //           var newsdata = {
  //                 id:id,
  //                 img:img,
  //                 name:name,
  //                 time:time
  //           }
  //           newsinfo.push(newsdata);
  //     });
  // });
  // $scope.newslist = newsinfo; 

  // [{
  //   id:1,
  //   img:'img/news1.png',
  //   name:'指南 ▏如何快速全面建立自己的大数据知识体系？',
  //   time:'2017-07-24 09:37'
  // },{
  //   id:2,
  //   img:'img/news2.png',
  //   name:'关于大数据中的用户画像那些事，看这篇一文章就够了',
  //   time:'2017-07-21 15:25'
  // }];

  //首页最新纪录片清单
  // var documentaryinfo = [];
  // $http({
  //     method:'GET',
  //     url:'/update_documentarylist',
  // }).then(function(res){
  //     var results = res['data'];
  //     console.log(results);
  //     results.forEach(function(item){
  //           var id = item['id'];
  //           var img = item['img'];
  //           var name = item['name'];
  //           var episodes = item['episodes'];
  //           var documentarydata = {
  //                 id:id,
  //                 img:img,
  //                 name:name,
  //                 episodes:episodes
  //           }
  //           documentaryinfo.push(documentarydata);
  //     });
  // });
  // $scope.videolist = documentaryinfo;


  // [{
  //   id:1,
  //   img:'img/video1.png',
  //   name:'互联网时代',
  //   episodes:'12集'
  // },{
  //   id:2,
  //   img:'img/video2.png',
  //   name:'现代生活的秘密规则：算法',
  //   episodes:'1集'
  // },{
  //   id:3,
  //   img:'img/video3.png',
  //   name:'谷歌与世界头脑',
  //   episodes:'1集'
  // }];

  //首页最新论文清单
  // var paperinfo = [];
  // $http({
  //     method:'GET',
  //     url:'/update_paperlist',
  // }).then(function(res){
  //     var results = res['data'];
  //     console.log(results);
  //     results.forEach(function(item){
  //           var pclass = item['pclass'];
  //           var name = item['name'];
  //           var author = item['author'];
  //           var time = item['time'];
  //           var keyword = item['keyword'];
  //           var paperdata = {
  //                 pclass:pclass,
  //                 name:name,
  //                 author:author,
  //                 time:time,
  //                 keyword:keyword
  //           }
  //           paperinfo.push(paperdata);
  //     });
  // });
  // $scope.paperlist = paperinfo;


  // [{
  //   pclass:'[硕士学位论文]',
  //   name:'面向大数据查询的索引技术研究',
  //   author:'朱春莹  计算机科学与技术 山东大学',
  //   time:'2016(学位年度)',
  //   keyword:'数据查询 数据分类'
  // },{
  //   pclass:'[会议论文]',
  //   name:' 大数据及其应用',
  //   author:'冯斐   2015航空试验测试技术学术交流会',
  //   time:'2015',
  //   keyword:'大数据 特征 处理技术 大数据应用'
  // },{
  //   pclass:'[期刊论文]',
  //   name:' 大数据与推荐系统',
  //   author:'李翠平 蓝梦微 邹本友 王绍卿 赵衎衎 《大数据》',
  //   time:'2015年1期',
  //   keyword:'大数据 OLAP SQL分析 SQL on Hadoop'
  // }];

  $scope.imglist = [{
    url:'main',
    img:'img/carousel1.png'
  },{
    url:'main',
    img:'img/carousel2.jpg'
  },{
    url:'main',
    img:'img/carousel3.jpg'
  }];
}])

//跳转后的课程模块
.controller('courseCtrl',['$scope','$http',function($scope,$http){
  $scope.back_course_style = {
    "background-color" : "#741D88"
  };
  $scope.course_title = '课程';

  // var courseinfo=[];
  // $http({
  //     method:'GET',
  //     url:'/courselist_all',
  //   }).then(function(res){ 
  //       var results = res['data'];
  //       //console.log(results);      
  //       results.forEach(function(item){
  //           var id = item['id'];
  //           //console.log('update'+id);
  //           var img = item['img'];
  //           //console.log('update'+img);
  //           var name = item['name'];
  //           //console.log('update'+name);
  //           var intro = item['intro'];
  //           //console.log('update'+intro);
  //           var coursedata ={
  //               id: id,
  //               img: img,
  //               name: name,
  //               intro: intro
  //           }
  //           courseinfo.push(coursedata);
  //       });
  //    });
  // $scope.courselist = courseinfo;

  $scope.courselist =[{
    id:1,
    img:'img/course1.png',
    name:'动画技术',
    intro:'授课老师：洪志国'
  },{
    id:2,
    img:'img/course2.png',
    name:'计算机软件网络与编程',
    intro:'授课老师：林卫国'
  },{
    id:3,
    img:'img/course3.png',
    name:'算法设计与分析',
    intro:'授课老师：曹建香'
  },{
    id:4,
    img:'img/course4.png',
    name:'现代软件工程',
    intro:'授课老师：扈文峰'
  }];
}])

//‘spark从零开始’课程内容详解
.controller('courseInfoCtrl',['$scope','$state','$cookies',function($scope,$state,$cookies){
  $scope.outlinelist = [{
    title:' 第1章 Spark介绍',
    content:[{
      name:'▷ 1.1 Spark简介',
      src:'video/spark-1.mp4'
    },{
      name:'▷ 1.2 Spark生态介绍',
      src:'video/spark-1.mp4'
    },{
      name:'▷ 1.3 Spark与hadoop的比较',
      src:'video/spark-1.mp4'
    }]
  },{
    title:' 第2章 Spark的下载和安装',
    content:[{
      name:'▷ 2.1 Spark的安装',
      src:'video/spark-1.mp4'
    }]
  },{
    title:' 第3章 开发第一个Spark程序',
    content:[{
      name:'▷ 3.1 Spark开发环境搭建',
      src:'video/spark-1.mp4'
    },{
      name:'▷ 3.2 开发第一个Spark程序',
      src:'video/spark-1.mp4'
    }]
  },{
    title:' 第4章 Rdds',
    content:[{
      name:'▷ 4.1 Rdds介绍 ',
      src:'video/spark-1.mp4'
    },{
      name:'▷ 4.2 RDDs基本操作之Transformations',
      src:'video/spark-1.mp4'
    },{
      name:'▷ 4.3 RDD基本操作之Action',
      src:'video/spark-1.mp4'
    },{
      name:'▷ 4.4 RDDS的特性',
      src:'video/spark-1.mp4'
    },{
      name:'▷ 4.5 KeyValue对RDDs',
      src:'video/spark-1.mp4'
    }]
  }];
  if($cookies.get('phone')){
    $scope.selfName = $cookies.get('phone');
  }
  
  $scope.back = function(){
    window.history.back();
  }
  $scope.learn = function(){
    $state.go('videoPlay');
  }
  $scope.login = function(){
    $state.go('login');
  }
}])
.controller('courseTestCtrl',['$scope','$state','$cookies',function($scope,$state,$cookies){
  $scope.back = function(){
    window.history.back();
  }
}])
.controller('exerciseCtrl',['$scope','$state','$cookies','$stateParams','$interval',function($scope,$state,$cookies,$stateParams,$interval){
  // 获得所有题目
  // $http({
  //     method:'GET',
  //     url:'/getQuestionByTest',
  // }).then(function(res){
  //     var results = res['data'];
  //     console.log(results);
  //     results.forEach(function(item){
  //           var pclass = item['pclass'];
  //           var name = item['name'];
  //           var author = item['author'];
  //           var time = item['time'];
  //           var keyword = item['keyword'];
  //           var paperdata = {
  //                 pclass:pclass,
  //                 name:name,
  //                 author:author,
  //                 time:time,
  //                 keyword:keyword
  //           }
  //           paperinfo.push(paperdata);
  //     });
  // });
  var questions = {
    time:45,
    question:[
      {
        id : 1,
        title : '新窗口打开网页，用到以下哪个值（）',
        type : '0',
        typeName : '单选',
        selectType : 'checkbox',
        options :[
            '_self','_blank','_top','_parent'
         ]
      },
      {
        id : 2,
        title : '下面有关jquery事件的响应，描述错误的是？',
        type : '0',
        typeName : '单选',
        selectType : 'checkbox',
        options :[
            'onclick 鼠标点击某对象',
            'onfocus 元素失去焦点',
            'onload 是某个页面的css js html 文档结构和图像被完全加载',
            'onmousedown 某个鼠标按键被按下'
         ]
      }
    ]
  };
  $scope.exerName = $stateParams.exerName;
  $scope.exerTime = questions.time;
  $scope.exerTotal = questions.question.length;
  $scope.currentIndex = 1;
  $scope.exerType = questions.question[0].typeName;
  $scope.exerTitle = questions.question[0].title;
  $scope.exerOptions = questions.question[0].options;
  $scope.answer = {};
  $scope.choice = undefined;
  $scope.changeChoice = function(index){
    $scope.answer[$scope.currentIndex] = index;
    console.log($scope.answer);
  }
  // 考试时间倒计时
  $scope.timeDown = function(){
    var times = $scope.exerTime * 60;
    var interval = $interval(function(){
      if(times<=0){
        $interval.cancel(interval);
        alert('考试时间结束！');
      }else{
        times--;
        var hour = parseInt(times/3600);
        var minute = parseInt(times%3600/60);
        var second = parseInt(times-3600*hour-60*minute); 
        $scope.time = Math.floor(hour/10)+hour%10+':'+Math.floor(minute/10)+minute%10+':'+Math.floor(second/10)+second%10;
      }
    },1000);
  }
  $scope.timeDown();
  // 选择选项
  $scope.choose = function(){
    console.log($scope.choice);
  }
  // 上一题
  $scope.pre = function(){
    if($scope.currentIndex > 1){
      $scope.currentIndex --;
      $scope.exerType = questions.question[$scope.currentIndex-1].typeName;
      $scope.exerTitle = questions.question[$scope.currentIndex-1].title;
      $scope.exerOptions = questions.question[$scope.currentIndex-1].options;
    }
  }
  // 下一题
  $scope.next = function(){
    if($scope.currentIndex === $scope.exerTotal){
      alert('提交！');
    }else{
      $scope.currentIndex ++;
      $scope.exerType = questions.question[$scope.currentIndex-1].typeName;
      $scope.exerTitle = questions.question[$scope.currentIndex-1].title;
      $scope.exerOptions = questions.question[$scope.currentIndex-1].options;
    }
  }
  // 返回
  $scope.back = function(){
    window.history.back();
  }
}])
//跳转后的新闻模块
.controller('newsCtrl',['$scope','$http',function($scope,$http){
  $scope.back_news_style = {
    "background-color" : "#2194CA"
  };
  $scope.news_title = '新闻';

  var newsinfo = [];
  $http({
      method:'GET',
      url:'/newslist_all',
  }).then(function(res){
      var results = res['data'];
      console.log(results);
      results.forEach(function(item){
            var id = item['id'];
            var img = item['img'];
            var name = item['name'];
            var time = item['time'];
            var newsdata = {
                  id:id,
                  img:img,
                  name:name,
                  time:time
            }
            newsinfo.push(newsdata);
      });
  });
  $scope.newslist = newsinfo;
//   [{
//     id:1,
//     img:'img/news1.png',
//     name:'指南 ▏如何快速全面建立自己的大数据知识体系？',
//     time:'2017-07-24 09:37'
//   },{
//     id:2,
//     img:'img/news2.png',
//     name:'关于大数据中的用户画像那些事，看这篇一文章就够了',
//     time:'2017-07-21 15:25'
//   }];
}])

//跳转后的纪录片模块
.controller('videoCtrl',['$scope','$http',function($scope,$http){
  $scope.back_video_style = {
    "background-color" : "#17A668"
  };
  $scope.video_title = '纪录片';

  var documentaryinfo = [];
  $http({
      method:'GET',
      url:'/documentarylist_all',
  }).then(function(res){
      var results = res['data'];
      console.log(results);
      results.forEach(function(item){
            var id = item['id'];
            var img = item['img'];
            var name = item['name'];
            var episodes = item['episodes'];
            var documentarydata = {
                  id:id,
                  img:img,
                  name:name,
                  episodes:episodes
            }
            documentaryinfo.push(documentarydata);
      });
  });
  $scope.videolist = documentaryinfo;
  // [{
  //   id:1,
  //   img:'img/video1.png',
  //   name:'互联网时代',
  //   episodes:'12集'
  // },{
  //   id:2,
  //   img:'img/video2.png',
  //   name:'现代生活的秘密规则：算法',
  //   episodes:'1集'
  // },{
  //   id:3,
  //   img:'img/video3.png',
  //   name:'谷歌与世界头脑',
  //   episodes:'1集'
  // }];
}])

//跳转后的论文模块
.controller('paperCtrl',['$scope','$http',function($scope,$http){
  $scope.back_paper_style = {
    "background-color" : "#DA9627"
  };
  $scope.paper_title = '论文';

  var paperinfo = [];
  $http({
      method:'GET',
      url:'/paperlist_all',
  }).then(function(res){
      var results = res['data'];
      console.log(results);
      results.forEach(function(item){
            var pclass = item['pclass'];
            var name = item['name'];
            var author = item['author'];
            var time = item['time'];
            var keyword = item['keyword'];
            var paperdata = {
                  pclass:pclass,
                  name:name,
                  author:author,
                  time:time,
                  keyword:keyword
            }
            paperinfo.push(paperdata);
      });
  });
  $scope.paperlist = paperinfo;
  // [{
  //   pclass:'[硕士学位论文]',
  //   name:'面向大数据查询的索引技术研究',
  //   author:'朱春莹  计算机科学与技术 山东大学',
  //   time:'2016(学位年度)',
  //   keyword:'数据查询 数据分类'
  // },{
  //   pclass:'[会议论文]',
  //   name:' 大数据及其应用',
  //   author:'冯斐   2015航空试验测试技术学术交流会',
  //   time:'2015',
  //   keyword:'大数据 特征 处理技术 大数据应用'
  // },{
  //   pclass:'[期刊论文]',
  //   name:' 大数据与推荐系统',
  //   author:'李翠平 蓝梦微 邹本友 王绍卿 赵衎衎 《大数据》',
  //   time:'2015年1期',
  //   keyword:'大数据 OLAP SQL分析 SQL on Hadoop'
  // }];
}])

//聊天界面
.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

//个人中心
.controller('AccountCtrl', ['$rootScope','$scope','$state','$cookies',function($rootScope,$scope,$state,$cookies) {
  if(sessionStorage.userName){
    $scope.selfName = sessionStorage.userName;
    // $scope.selfImage = $cookies.get('headPic');
  }else{
    $scope.selfName = '';
    $scope.selfImage = '';
  }
  // console.log($cookies.getObject('userInfo'));
  $scope.defaultImg = 'img/defaultPic.png';
  $scope.logout = function(){
    delete sessionStorage.removeItem('userName'); 
    $state.go('login');
  }
  $scope.login = function(){
    $state.go('login');
  }
}]);
