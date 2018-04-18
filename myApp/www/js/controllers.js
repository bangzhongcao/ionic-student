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
        sessionStorage.setItem('userId',$scope.user_Id);
        sessionStorage.setItem('userName', res.data.user.name);
        // sessionStorage.userName = res.user.name;
        $state.go('tab.dash');
      }else{
        showTips('学号或密码错误');
      }
    }).error(function(res){
      showTips('服务器连接错误');
    });
  }
}])

//忘记密码页面
.controller('forgetCtrl',['$scope','$state','$interval','$timeout','$http',function($scope,$state,$interval,$timeout,$http){
  $scope.isDisabled = false;
  $scope.mail_code = '';
  // 判断信息是否正确
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
        countDown();
        $http({
          method:'POST',
          url:'/get_verification',
          data:{
            mail:$scope.mail_addr
          }
        }).success(function(res){
          identify_num = res.data.identify;
          mailaddr = res.data.mail;
        }).error(function(res){
          alert(res);
        });
    }else{
      showTips('请输入正确的邮箱');
    } 
  }
  // 点击进入下一步
  $scope.submitMail = function(){
    if($scope.isDisabled){
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
    $scope.isDisabled = $scope.userId && $scope.new_pass.length >=6 && $scope.sec_pass.length>=6&&$scope.new_pass==$scope.sec_pass;
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
.controller('DashCtrl',['$scope','$ionicScrollDelegate','$http','$window',function($scope,$ionicScrollDelegate,$http,$window) {
  $scope.isHidden = false;
  // // 搜索框颜色渐变
  $scope.scroll = function(){
    var banner = $window.document.getElementById('searchTab');
    var imgList = $window.document.getElementById('img-carousel');
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
  // 模块入口
  $scope.modulelist = [
      {
        url:'course',
        img:'img/course.png',
        name:'课程'
      },{
        url:'news',
        img:'img/news.png',
        name:'新闻'
      },{
        url:'video',
        img:'img/video.png',
        name:'纪录片'
      },{
        url:'paper',
        img:'img/paper.png',
        name:'论文'
      }
  ];
    //课程列表
  $scope.courselist = [
      {
        id:1,
        img:'img/course1.png',
        name:'Spark从零开始',
        teachName:'刘芳宇',
        intro:'本课程旨在让同学们了解Spark基础知识，掌握Spark基础开发。'
      },{
        id:2,
        img:'img/course2.png',
        name:'R语言入门与进阶',
        teachName:'张戈',
        intro:'这门课将会带领您领略R语言的精髓,打开R语言的大门。'
      }
  ];
  // 新闻列表
  $scope.newslist = [
    {
      id:1,
      img:'img/news1.png',
      name:'指南 ▏如何快速全面建立自己的大数据知识体系？',
      time:'2017-07-24 09:37'
    },{
      id:2,
      img:'img/news2.png',
      name:'关于大数据中的用户画像那些事，看这篇一文章就够了',
      time:'2017-07-21 15:25'
    }
  ];
// 纪录片列表
  $scope.videolist = [
    {
      id:1,
      img:'img/video1.png',
      name:'互联网时代',
      episodes:'12集'
    },{
      id:2,
      img:'img/video2.png',
      name:'现代生活的秘密规则：算法',
      episodes:'1集'
    },{
      id:3,
      img:'img/video3.png',
      name:'谷歌与世界头脑',
      episodes:'1集'
    }
  ];
// 论文列表
  $scope.paperlist = [
    {
      pclass:'[硕士学位论文]',
      name:'面向大数据查询的索引技术研究',
      author:'朱春莹  计算机科学与技术 山东大学',
      time:'2016(学位年度)',
      keyword:'数据查询 数据分类'
    },{
      pclass:'[会议论文]',
      name:' 大数据及其应用',
      author:'冯斐   2015航空试验测试技术学术交流会',
      time:'2015',
      keyword:'大数据 特征 处理技术 大数据应用'
    },{
      pclass:'[期刊论文]',
      name:' 大数据与推荐系统',
      author:'李翠平 蓝梦微 邹本友 王绍卿 赵衎衎 《大数据》',
      time:'2015年1期',
      keyword:'大数据 OLAP SQL分析 SQL on Hadoop'
    }
  ];
  // 轮播图
  $scope.imglist = [
    {
      url:'main',
      img:'img/carousel1.png'
    },{
      url:'main',
      img:'img/carousel2.jpg'
    },{
      url:'main',
      img:'img/carousel3.jpg'
    }
  ];
}])

//课程列表
.controller('courseCtrl',['$scope','$http','$state',function($scope,$http,$state){
  $scope.back_course_style = {
    "background-color" : "#741D88"
  };
  $scope.course_title = '课程';
  // 获得课程列表
  $http({
      method:'GET',
      url:'/getCourseList'
  }).then(function(res){
      $scope.courselist = res.data.body;
  });
}])

//课程内容详解
.controller('courseInfoCtrl',['$scope','$state','$http','$stateParams',function($scope,$state,$http,$stateParams){
  $scope.course_name = $stateParams.name;
  $scope.teacher_name = $stateParams.teachName;
  var course_id = $stateParams.id;
  // 跳转到测试列表页面
  $scope.goTestList = function(){
    $state.go('courseTest',{name:$scope.course_name,teachName:$scope.teacher_name,id:course_id});
  }
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

//测试列表界面
.controller('TestsCtrl', ['$scope','$state','$stateParams','$http','$rootScope','$ionicPopup',function($scope,$state,$stateParams,$http,$rootScope,$ionicPopup){
  // 获得测试列表
  $http({
    method:'GET',
    url:'/getTestList'
  }).then(function(res){
    $scope.tests = res.data.body;
  });
  // 进入试题
  $scope.goTest = function(obj){
    if(obj.status==='未完成'){
      // 获得所有题目
      $http({
          method:'GET',
          url:'/getTestInfo/uncomplete',
          params:{id:obj.id}
      }).then(function(res){
          $rootScope['testQuestions'] = res.data.body;
          // 是否进入测试弹窗
          $ionicPopup.confirm({
            title: '进入测试',
            template: "确定进入“"+obj.name+"”试题吗？（一旦进入测试不可中途退出）"
          }).then(function(res) {
            if(res) {
              // 进入测试
              $state.go('exercise',{exerName:obj.name,exerStatus:obj.status});
            } else {
              console.log('You are not sure');
            }
          });


      });
    }else if(obj.status==='已完成'){
      // 获得所有题目
      $http({
          method:'GET',
          url:'/getTestInfo/completed',
          params:{id:obj.id}
      }).then(function(res){
          $rootScope['testQuestions'] = res.data.body;
          $state.go('exercise',{exerName:obj.name,exerStatus:obj.status,exerId:obj.id});
      });
    }
  }
  $scope.back = function(){
    window.history.back();
  }
}])


// 试题
.controller('exerciseCtrl',['$scope','$state','$rootScope','$stateParams','$interval','$http','$ionicPopup',function($scope,$state,$rootScope,$stateParams,$interval,$http,$ionicPopup){
  var questions = $rootScope['testQuestions'];
  // 获得路由传递的参数
  $scope.question = questions.question;
  $scope.exerName = $stateParams.exerName;//测试名称
  var status = $stateParams.exerStatus;//测试状态
  var testId = $stateParams.exerId;//测试编号

  $scope.exerTotal = questions.question.length;//一共有多少题
  $scope.currentIndex = 1;//当前的题号
  $scope.exerType = questions.question[0].typeName;//第一题的类型
  $scope.exerTitle = questions.question[0].title;//第一题题目
  $scope.exerOptions = questions.question[0].options;//第一题选项
  
  $scope.isRadio = true;//单选题还是多选题
  $scope.isSheet = false;//是否显示答题卡
  $scope.isResult = false;//是否显示结果
  $scope.resultFlag = false;
  $scope.answer = {};//答案
  $scope.correctAnswer = {};//正确答案
  $scope.yourAnswer = {};//你的答案

  // 提交返回结果
  $scope.submitAnswer = function(time){
    // 整理答案格式
    checkAnswer = [];
    for(var key in $scope.answer){
      if(typeof($scope.answer[key])==='object'){
        var answers = [];
        for(var i in $scope.answer[key]){
          if($scope.answer[key][i]!==undefined){
            answers.push($scope.answer[key][i]);
          }
        }
        checkAnswer.push(answers);
      }else{
        checkAnswer.push($scope.answer[key]);
      }
    }
    // 拼接提交的数据
    var id = sessionStorage.getItem('userId');
    var exerData = {
      'studentid':id,
      'testid':testId,
      'option':checkAnswer
    }

    // 时间结束自动提交
    if(time){
      $http({
           method:'POST',
           url:'/question_submit',
           data:exerData
       }).then(function(res){
           var results = res.data.body;
           $scope.trueArr = results.answerIstrueArr;
           $scope.isResult = true;
           // 弹出消息框
           var alertPopup = $ionicPopup.alert({
             title: '测试时间到',
             template: '测试时间截止，答题卡自动提交'
           });
           alertPopup.then(function(res) {
            // 重新获取题目
             $http({
                  method:'GET',
                  url:'/getTestInfo/completed',
                  params:{id:testId}
              }).then(function(res){
                  questions = res.data.body;
                  status = '已完成';
                  $scope.isTest = true;//是否为考试状态
                  $scope.resultFlag = true;
              });
           });
       });
    }else{//点击提交按钮提交答题卡
      // 提交确认弹窗
      $interval.cancel($scope.interval);//停止倒计时
      var confirmPopup = $ionicPopup.confirm({
         title: '提交答题卡',
         template: '确定结束测试并提交答题卡吗?'
      });
      confirmPopup.then(function(res) {
        if(res) {
         // 提交答案
         $http({
             method:'POST',
             url:'/question_submit',
             data:exerData
         }).then(function(res){
             var results = res.data.body;
             $scope.trueArr = results.answerIstrueArr;
             // 重新获取题目
             $http({
                  method:'GET',
                  url:'/getTestInfo/completed',
                  params:{id:testId}
              }).then(function(res){
                  questions = res.data.body;
                  status = '已完成';
                  $scope.resultFlag = true;
                  $scope.isResult = true;//显示答题结果
                  $scope.isTest = true;//是否为考试状态
              });
         });
        } else {
          console.log('You are not sure');
        }
      });
    }
    
  }

  // 考试时间倒计时
  $scope.timeDown = function(){
    var times = $scope.exerTime * 60;
    $scope.interval = $interval(function(){
      if(times<=0){
        $interval.cancel($scope.interval);
        $scope.submitAnswer(true);
      }else{
        times--;
        var hour = parseInt(times/3600);
        var minute = parseInt(times%3600/60);
        var second = parseInt(times-3600*hour-60*minute); 
        $scope.time = Math.floor(hour/10)+hour%10+':'+Math.floor(minute/10)+minute%10+':'+Math.floor(second/10)+second%10;
      }
    },1000);
  }

  // 初始化第一题 获得试题的时间
  if(status==='未完成'){
      $scope.isTest = false;//选项是否可以选择
      $scope.exerTime = questions.time;//时间
      // 执行倒计时
      $scope.timeDown();

      $scope.isSelected = {};//是否选择完题目
      // 初始化判断题目类型
      if($scope.exerType==='单选'){
        $scope.isRadio = true;
        $scope.answer[$scope.currentIndex] = undefined;
      }else if($scope.exerType==='多选'){
        $scope.isRadio = false;
        $scope.answer[$scope.currentIndex] = [];
        for(var i=0;i<$scope.exerOptions.length;i++){
          $scope.answer[$scope.currentIndex][i] = undefined;
        }
      }
      // 初始化选择题目 的状态
      for(var i=0;i<$scope.exerTotal;i++){
        $scope.isSelected[i+1] = false;
      }
  }else if(status==='已完成'){
      $scope.isTest = true;
      // 将已选择的答案显示出来
      $scope.correctAnswer[$scope.currentIndex] = $scope.question[0].correctAnswer;//正确答案
      $scope.yourAnswer[$scope.currentIndex] = $scope.question[0].hasSelected;//正确答案
      if($scope.exerType==='单选'){
        $scope.isRadio = true;
        $scope.answer[$scope.currentIndex] = $scope.question[0].hasSelected;
      }else if($scope.exerType==='多选'){
        $scope.isRadio = false;
        var length = $scope.question[0].options.length;
        $scope.answer[$scope.currentIndex] = [];
        for(var j=0;j<length;j++){
          if($scope.question[i].hasSelected.indexOf(j+1)>-1){
            $scope.answer[$scope.currentIndex][j] = j+1;
          }else{
            $scope.answer[$scope.currentIndex][j] = undefined;
          }
        }
      }
  }
  
  // 单选选择选项触发事件
  $scope.changeChoice = function(index){
    if(!$scope.isTest){//未完成时可点击
      $scope.isSelected[$scope.currentIndex] = true;
      $scope.answer[$scope.currentIndex] = index;
    }
  }

  // 多选触发事件
  $scope.changeCheckChoice = function(index){
    if(!$scope.isTest){//未完成时可点击
      $scope.isSelected[$scope.currentIndex] = false;
      if($scope.answer[$scope.currentIndex][index-1]===index){
        $scope.answer[$scope.currentIndex][index-1] = undefined;
      }else{
        $scope.answer[$scope.currentIndex][index-1] = index;
      }
      // 判断是否有选项
      for(var i=0;i<$scope.answer[$scope.currentIndex].length;i++){
        if($scope.answer[$scope.currentIndex][i]!==undefined){
          $scope.isSelected[$scope.currentIndex] = true;
        }
      }
    }
  }
  
  // 上一题
  $scope.pre = function(){
    if($scope.currentIndex > 1){
      $scope.currentIndex --;
      $scope.exerType = questions.question[$scope.currentIndex-1].typeName;
      $scope.exerTitle = questions.question[$scope.currentIndex-1].title;
      $scope.exerOptions = questions.question[$scope.currentIndex-1].options;
      // 当为未完成时
      if(!$scope.isTest){
        // 判断题目类型
        if($scope.exerType==='单选'){
          $scope.isRadio = true;
          // 未选择的情况
          if(typeof($scope.answer[$scope.currentIndex])!=='number'){
            $scope.answer[$scope.currentIndex] = undefined;
          }
        }else if($scope.exerType==='多选'){
          $scope.isRadio = false;
          // 未选择的情况
          if(!$scope.answer[$scope.currentIndex]){
            $scope.answer[$scope.currentIndex] = [];
            for(var i=0;i<$scope.exerOptions.length;i++){
              $scope.answer[$scope.currentIndex][i] = undefined;
            }
          }
        }
      }
    }
  }
  // 下一题
  $scope.next = function(){
    if($scope.currentIndex === $scope.exerTotal){
      if(!$scope.isTest){
        $scope.isSheet = true;
      }else{
        $scope.isSheet = false;
      }
    }else{
      $scope.currentIndex ++;
      var ques = questions.question[$scope.currentIndex-1];
      $scope.exerType = questions.question[$scope.currentIndex-1].typeName;
      $scope.exerTitle = questions.question[$scope.currentIndex-1].title;
      $scope.exerOptions = questions.question[$scope.currentIndex-1].options;
      //已完成
      if(status==='已完成'){
        $scope.correctAnswer[$scope.currentIndex] = ques.correctAnswer;//正确答案
        $scope.yourAnswer[$scope.currentIndex] = ques.hasSelected;//你的答案
        // 将已选择的答案显示出来
        if($scope.exerType==='单选'){
          $scope.isRadio = true;
          $scope.answer[$scope.currentIndex] = ques.hasSelected;
        }else if($scope.exerType==='多选'){
          $scope.isRadio = false;
          var length = ques.options.length;
          $scope.answer[$scope.currentIndex] = [];
          for(var j=0;j<length;j++){
            console.log(ques.hasSelected);
            if(ques.hasSelected.indexOf(j+1)>-1){
              $scope.answer[$scope.currentIndex][j] = j+1;
            }else{
              $scope.answer[$scope.currentIndex][j] = undefined;
            }
          }
        }
      }else if(status==='未完成'){//未完成
        // 判断题目类型
        if($scope.exerType==='单选'){
          $scope.isRadio = true;
          if(!$scope.answer[$scope.currentIndex]){
            $scope.answer[$scope.currentIndex] = undefined;
          }
        }else if($scope.exerType==='多选'){
          $scope.isRadio = false;
          if(!$scope.answer[$scope.currentIndex]){
            $scope.answer[$scope.currentIndex] = [];
            for(var i=0;i<$scope.exerOptions.length;i++){
              $scope.answer[$scope.currentIndex][i] = undefined;
            }
          }
        }
      }
    }
  }
  // 取消答题卡
  $scope.cancelSheet = function(){
    $scope.isSheet = false;
    // 返回到课程列表页面
    if($scope.isResult){
      $scope.isResult = false;
      window.history.back();
    }
  }

  // 从答题卡上跳转到某一题目
  $scope.turnQues = function(n){
    $scope.isSheet = false;
    $scope.isResult = false;
    $scope.currentIndex = n;
    var ques = questions.question[$scope.currentIndex-1];
    $scope.exerType = questions.question[$scope.currentIndex-1].typeName;
    $scope.exerTitle = questions.question[$scope.currentIndex-1].title;
    $scope.exerOptions = questions.question[$scope.currentIndex-1].options;
    // 判断是否完成
    if(status==='已完成'){
      $scope.correctAnswer[$scope.currentIndex] = ques.correctAnswer;//正确答案
      $scope.yourAnswer[$scope.currentIndex] = ques.hasSelected;//你的答案
      // 将已选择的答案显示出来
      if($scope.exerType==='单选'){
        $scope.isRadio = true;
        $scope.answer[$scope.currentIndex] = ques.hasSelected;
      }else if($scope.exerType==='多选'){
        $scope.isRadio = false;
        var length = ques.options.length;
        $scope.answer[$scope.currentIndex] = [];
        for(var j=0;j<length;j++){
          console.log(ques.hasSelected);
          if(ques.hasSelected.indexOf(j+1)>-1){
            $scope.answer[$scope.currentIndex][j] = j+1;
          }else{
            $scope.answer[$scope.currentIndex][j] = undefined;
          }
        }
      }
    }else if(status==='未完成'){
      // 判断题目类型
      if($scope.exerType==='单选'){
        $scope.isRadio = true;
        if(!$scope.answer[$scope.currentIndex]){
          $scope.answer[$scope.currentIndex] = undefined;
        }
      }else if($scope.exerType==='多选'){
        $scope.isRadio = false;
        if(!$scope.answer[$scope.currentIndex]){
          $scope.answer[$scope.currentIndex] = [];
          for(var i=0;i<$scope.exerOptions.length;i++){
            $scope.answer[$scope.currentIndex][i] = undefined;
          }
        }
      }
    }
  }

  // 返回
  $scope.back = function(){
    if($scope.resultFlag){
      $scope.isResult = true;
    }else{
      window.history.back();
    }
  }
}])
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
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userName'); 
    $state.go('login');
  }
  $scope.login = function(){
    $state.go('login');
  }
}]);
