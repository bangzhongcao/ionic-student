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
      id:1,
      pclass:'[硕士学位论文]',
      name:'面向大数据查询的索引技术研究',
      author:'朱春莹  计算机科学与技术 山东大学',
      time:'2016(学位年度)',
      keyword:'数据查询 数据分类'
      // url:'common/paper/The Solution of Web Font-end Performance Optimization .pdf'
    },{
      id:2,
      pclass:'[会议论文]',
      name:' 大数据及其应用',
      author:'冯斐   2015航空试验测试技术学术交流会',
      time:'2015',
      keyword:'大数据 特征 处理技术 大数据应用'
      // url:'common/paper/The Solution of Web Font-end Performance Optimization .pdf'
    },{
      id:3,
      pclass:'[期刊论文]',
      name:' 大数据与推荐系统',
      author:'李翠平 蓝梦微 邹本友 王绍卿 赵衎衎 《大数据》',
      time:'2015年1期',
      keyword:'大数据 OLAP SQL分析 SQL on Hadoop'
      // url:'common/paper/The Solution of Web Font-end Performance Optimization .pdf'
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

  // var newsinfo = [];
  // $http({
  //     method:'GET',
  //     url:'/newslist_all',
  // }).then(function(res){
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
  $scope.newslist = [{
    id:1,
    img:'img/news1.png',
    name:'指南 ▏如何快速全面建立自己的大数据知识体系？',
    time:'2017-07-24 09:37'
  },{
    id:2,
    img:'img/news2.png',
    name:'关于大数据中的用户画像那些事，看这篇一文章就够了',
    time:'2017-07-21 15:25'
  }];
}])

//论文详情页面
.controller('newsReadCtrl',['$scope','$http','$state','$stateParams',function($scope,$http,$state,$stateParams){
  $scope.newsId = $stateParams.id;
  $scope.isComment = 1;
  $scope.comment = '';
  // 论文详情
  $scope.newsInfo = {
    "name":'指南 ▏如何快速全面建立自己的大数据知识体系？',
    "content":"<p>很多人都看过不同类型的书，也接触过很多有关大数据方面的文章，但都是很零散不成系统，对自己也没有起到多大的作用，所以作者第一时间，带大家从整体体系思路上，了解大数据产品设计架构和技术策略。</p><p>大数据产品，从系统性和体系思路上来做，主要分为五步：</p><p>针对前端不同渠道进行数据埋点，然后根据不同渠道的采集多维数据，也就是做大数据的第一步，没有全量数据，何谈大数据分析；</p><p>第二步，基于采集回来的多维度数据，采用ETL对其各类数据进行结构化处理及加载；</p><p>然后第三步，对于ETL处理后的标准化结构数据，建立数据存储管理子系统，归集到底层数据仓库，这一步很关键，基于数据仓库，对其内部数据分解成基础的同类数据集市；</p><p>然后基于归集分解的不同数据集市，利用各类R函数包对其数据集进行数据建模和各类算法设计，里面算法是需要自己设计，个别算法可以用R函数，这个过程产品和运营参与最多；这一步做好了，也是很多公司用户画像系统的底层。</p><p>最后根据建立的各类数据模型及算法，结合前端不同渠道不同业务特征，根据渠道触点自动匹配后端模型自动展现用户个性化产品和服务。</p><img src='img/news1.jpg'><p><strong>建立系统性数据采集指标体系</strong></p><p>建立数据采集分析指标体系是形成营销数据集市的基础，也是营销数据集市覆盖用户行为数据广度和深度的前提，数据采集分析体系要包含用户全活动行为触点数据，用户结构化相关数据及非结构化相关数据，根据数据分析指标体系才能归类汇总形成筛选用户条件的属性和属性值，也是发现新的营销事件的基础。</p><p>构建营销数据指标分析模型，完善升级数据指标采集，依托用户全流程行为触点，建立用户行为消费特征和个体属性，从用户行为分析、商业经营数据分析、营销数据分析三个维度，形成用户行为特征分析模型。用户维度数据指标是不同维度分析要素与用户全生命周期轨迹各触点的二维交叉得出。</p><p>目前做大数据平台的公司，大多数采集的数据指标和输出的可视化报表，都存在几个关键问题：</p><p>采集的数据都是以渠道、日期、地区统计，无法定位到具体每个用户；</p><p>计算统计出的数据都是规模数据，针对规模数据进行挖掘分析，无法支持；</p><p>数据无法支撑系统做用户获客、留存、营销推送使用。</p><p>所以，要使系统采集的数据指标能够支持平台前端的个性化行为分析，必须围绕用户为主线来进行画像设计，在初期可视化报表成果基础上，将统计出来的不同规模数据，细分定位到每个用户，使每个数据都有一个用户归属。</p><p>将分散无序的统计数据，在依据用户来衔接起来，在现有产品界面上，每个统计数据都增加一个标签，点击标签，可以展示对应每个用户的行为数据，同时可以链接到其他统计数据页面。</p><p>由此可以推导出，以用户为主线来建立数据采集指标维度：用户身份信息、用户社会生活信息、用户资产信息、用户行为偏好信息、用户购物偏好、用户价值、用户反馈、用户忠诚度等多个维度，依据建立的采集数据维度，可以细分到数据指标或数据属性项。</p><p>① 用户身份信息维度</p><p>性别，年龄，星座，居住城市，活跃区域，证件信息，学历，收入，健康等。</p><p>② 用户社会生活信息维度</p><p>行业，职业，是否有孩子，孩子年龄，车辆，住房性质，通信情况，流量使用情况……</p><p>③ 用户行为偏好信息</p><p>是否有网购行为，风险敏感度，价格敏感度，品牌敏感度，收益敏感度，产品偏好，渠道偏好……</p><p>④ 用户购物偏好信息</p><p>品类偏好，产品偏好，购物频次，浏览偏好，营销广告喜好，购物时间偏好，单次购物最高金额……</p><p>⑤ 用户反馈信息维度</p><p>用户参与的活动，参与的讨论，收藏的产品，购买过的商品，推荐过的产品，评论过的产品……</p><img src='img/news2.jpg'><p><strong>基于采集回来的多维度数据，采用ETL对其各类数据进行结构化处理及加载</strong></p><p>数据补缺：对空数据、缺失数据进行数据补缺操作，无法处理的做标记。</p><p>数据替换：对无效数据进行数据的替换。</p><p>格式规范化：将源数据抽取的数据格式转换成为便于进入仓库处理的目标数据格式。</p><p>主外键约束：通过建立主外键约束，对非法数据进行数据替换或导出到错误文件重新处理。</p><p>数据合并：多用表关联实现（每个字段加索引，保证关联查询的效率）</p><p>数据拆分：按一定规则进行数据拆分</p><p>行列互换、排序/修改序号、去除重复记录</p><p>数据处理层 由 Hadoop集群 组成 , Hadoop集群从数据采集源读取业务数据，通过并行计算完成业务数据的处理逻辑，将数据筛选归并形成目标数据。</p><p><strong>数据建模、用户画像及特征算法</strong></p><p>提取与营销相关的客户、产品、服务数据，采用聚类分析和关联分析方法搭建数据模型，通过用户规则属性配置、规则模板配置、用户画像打标签，形成用户数据规则集，利用规则引擎实现营销推送和条件触发的实时营销推送，同步到前端渠道交互平台来执行营销规则，并将营销执行效果信息实时返回到大数据系统。</p><img src='img/news3.jpg'><p><strong>根据前端用户不同个性化行为，自动匹配规则并触发推送内容</strong></p><p>根据用户全流程活动行为轨迹，分析用户与线上渠道与线下渠道接触的所有行为触点，对营销用户打标签，形成用户行为画像，基于用户画像提炼汇总营销筛选规则属性及属性值，最终形成细分用户群体的条件。每个用户属性对应多个不同属性值，属性值可根据不同活动个性化进行配置，支持用户黑白名单的管理功能。</p><p>可以预先配置好基于不同用户身份特性的活动规则和模型，当前端用户来触发配置好的营销事件，数据系统根据匹配度最高的原则来实时自动推送营销规则，并通过实时推送功能来配置推送的活动内容、优惠信息和产品信息等，同时汇总前端反馈回的效果数据，对推送规则和内容进行优化调整。</p><img src='img/news4.jpg'><p>大数据系统结合客户营销系统在现有用户画像、用户属性打标签、客户和营销规则配置推送、同类型用户特性归集分库模型基础上，未来将逐步扩展机器深度学习功能，通过系统自动搜集分析前端用户实时变化数据，依据建设的机器深度学习函数模型，自动计算匹配用户需求的函数参数和对应规则，营销系统根据计算出的规则模型，实时自动推送高度匹配的营销活动和内容信息。</p><img src='img/news5.jpg'><p>机器自学习模型算法是未来大数据系统深度学习的核心，通过系统大量采样训练，多次数据验证和参数调整，才能最终确定相对精准的函数因子和参数值，从而可以根据前端用户产生的实时行为数据，系统可自动计算对应的营销规则和推荐模型。</p><p>大数据系统在深度自学习外，未来将通过逐步开放合作理念，对接外部第三方平台，扩展客户数据范围和行为触点，尽可能覆盖用户线上线下全生命周期行为轨迹，掌握用户各行为触点数据，扩大客户数据集市和事件库，才能深层次挖掘客户全方位需求，结合机器自学习功能，从根本上提升产品销售能力和客户全方位体验感知。</p>",
    "Origin":"互联网金融干货",
    "pclass":"硕士学位论文",
    "time":"2017-07-24 09:37:28"
  };
  // 评论内容
  $scope.remark = [{
    "name":'王轩',
    "content":"还好吧~",
    "time":"2018-03-12 12:42:19"
  },{
    "name":'张超',
    "content":"这篇文章慢慢的干货，收藏啦！",
    "time":"2018-04-01 09:32:43"
  },{
    "name":'李星辰',
    "content":"嗯嗯嗯嗯，文章写的有些繁琐啦",
    "time":"2018-05-01 17:21:54"
  }];
  // 发表评论
  $scope.submitComment = function(){
    // TO DO
    console.log($scope.comment);
    $scope.isComment = 1;
  }
  // 跳转到阅读页面
  $scope.goRead = function(){
    $state.go('paperRead',{id:$scope.paperId});
  }
  // 返回
  $scope.back = function(){
    window.history.back();
  }
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
  $scope.videolist = [{
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
  }];
}])

//跳转后的论文模块
.controller('paperCtrl',['$scope','$http',function($scope,$http){
  $scope.back_paper_style = {
    "background-color" : "#DA9627"
  };
  $scope.paper_title = '论文';

  $scope.paperlist = [{
    id:1,
    pclass:'[硕士学位论文]',
    name:'面向大数据查询的索引技术研究',
    author:'朱春莹  计算机科学与技术 山东大学',
    time:'2016(学位年度)',
    keyword:'数据查询 数据分类'
  },{
    id:2,
    pclass:'[会议论文]',
    name:' 大数据及其应用',
    author:'冯斐   2015航空试验测试技术学术交流会',
    time:'2015',
    keyword:'大数据 特征 处理技术 大数据应用'
  },{
    id:3,
    pclass:'[期刊论文]',
    name:' 大数据与推荐系统',
    author:'李翠平 蓝梦微 邹本友 王绍卿 赵衎衎 《大数据》',
    time:'2015年1期',
    keyword:'大数据 OLAP SQL分析 SQL on Hadoop'
  }];
}])

//论文详情页面
.controller('paperInfoCtrl',['$scope','$http','$state','$stateParams',function($scope,$http,$state,$stateParams){
  $scope.paperId = $stateParams.id;
  $scope.active = 1;
  $scope.isComment = 1;
  $scope.comment = '';
  // 论文详情
  $scope.paperInfo = {
    "name":'面向大数据查询的索引技术研究',
    "intro":" <p>随着互联网技术的飞速发展，全球数据量呈爆炸性增长，并且数据种类极为丰富，传统的存储模型和索引技术已经无法适用于现今的大数据管理环境中。因此，针对大数据的特点和需求，借鉴传统索引技术的设计思想，研究面向大数据的索引技术已经成为学术界比较关注的研究课题。</p><p>大数据具有多样性，也就是说组织中的数据不再单单是过去传统的结构化的关系型数据，还包括来自网页、社交媒体、电子邮件等大量非结构化数据。由于两种数据具有异构性，所以经常被分开存储和处理，但在一个应用系统中，往往存在大量的相互关联的异构数据，而当用户需要搜索这些数据时，亟需要一种索引机制实现结构化和非结构化数据的快速统一访问。而在过去的研究中，只是针对某一种数据类型的索引技术进行研究和应用，对异构数据索引技术的研究工作还很少，极其缺乏一个完善的索引机制用于解决异构海量数据的查询问题。</p><p>除多样性外，大数据还具有一个明显的特征便是海量性。为了存储海量的数据，出现了很多具有代表性的分布式存储和管理系统，如Google的分布式文件系统GFS、雅虎的PNUTS、Hadoop的HDFS等。但它们大部分只提供简单的基于主键的快速查询，因缺乏必要的索引等机制，而无法高效地支持多种查询方式，如范围查询、非主键查询等。因此，为满足用户的多样化查询需求，提高数据查询处理的效率，对海量数据的索引技术展开研究已成为一个亟待解决的挑战性问题。</p><p>针对上述两个方面的问题和挑战，本文主要做了以下工作:</p><p>(1)提出一种关联索引模型，用于解决海量异构数据的统一查询问题。该索引机制利用结构化数据与非结构化数据之间对共同实体的描述来建立联系，并将该实体作为关键字创建索引。索引的结构采用web上广泛使用的RDF元数据形式，来描述实体与结构化和非结构化资源之间的对应关系。为了减少关联索引的冗余以及快速定位相应资源，本模型在关联索引层之下又引入辅助索引层，分别为结构化数据创建B+tree索引，为非结构化的自由文档创建基于实体的倒排索引。该关联索引模型很好的解决了结构化数据和非结构化数据索引分离的问题，为混合数据的查询提供了统一的接口。最后通过实验结果分析表明，该索引体制不仅能够有效地支持异构数据的混合查询，而且还提高了查询结果的准确性。</p><p>(2)提出一种两级位图索引模型，将精简的位图索引模式应用到大数据环境中，结合MapReduce并行计算框架为存储在分布式文件系统中的海量数据分别创建基于分块级别的位图索引和记录级别的位图索引。分块级别的位图索引相当于一个全局位图，指示某个属性值在各个分块中的存在情况，从而避免查询不相关的分块，而记录级别的位图索引则相当于一个局部位图，指示了在一个分块内部属性值的分布情况，从而可以过滤掉不相关的记录，快速定位目标元组。该索引方案从两个层次上避免了读取无用数据，从而有效提高了海量数据的处理效率。最后实验结果证明，该索引机制不仅具有较少的时间开销和空间开销，而且明显优于无索引环境</p>",
    "keyword":"索引技术 异构数据 大数据查询 位图模式 关联模式",
    "author":"朱春莹",
    "Organization":"山东大学",
    "pclass":"硕士学位论文",
    "time":"2016年10月20日"
  };
  // 评论内容
  $scope.remark = [{
    "name":'杨小昱',
    "content":"论文内容适合入门时阅读，作者语言简单易懂，很不错！",
    "time":"2018-3-28 18:27:47"
  },{
    "name":'张玮',
    "content":"读起来感觉还不错~",
    "time":"2018-3-29 14:21:09"
  }];
  // 发表评论
  $scope.submitComment = function(){
    // TO DO
    console.log($scope.comment);
    $scope.isComment = 1;
  }
  // 跳转到阅读页面
  $scope.goRead = function(){
    $state.go('paperRead',{id:$scope.paperId});
  }
  // 返回
  $scope.back = function(){
    window.history.back();
  }
}])
// 论文阅读页面
.controller('paperReadCtrl',['$scope','$http','$state','$stateParams',function($scope,$http,$state,$stateParams){
  $scope.paperId = $stateParams.id;
  console.log($scope.paperId);
  // pdf.js
  var url = 'common/paper/原生APP和HTML5的混合开发模式.pdf';  
  //加载核心文件  
  PDFJS.workerSrc = 'js/vendor/pdf.worker.js';  
    
  var loadingTask = PDFJS.getDocument(url);  
  loadingTask.promise.then(function(pdf) {   
    // PDF总页数
    var totalNumber = pdf.numPages; 
    // 从第一页开始渲染
    for(let pageNumber=1;pageNumber<=totalNumber;pageNumber++){
      pdf.getPage(pageNumber).then(function(page) {   
        
      let scale = 1.5;  
      let viewport = page.getViewport(scale);  

      let ReaderPanel = document.getElementById('pdfReader'); 

      let canvas = document.createElement("canvas");
      let context = canvas.getContext('2d');
      ReaderPanel.appendChild(canvas);

      canvas.height = viewport.height;  
      canvas.width = viewport.width;  
    
      let renderContext = {  
        canvasContext: context,  
        viewport: viewport  
      };  
      let renderTask = page.render(renderContext);  
      renderTask.then(function () {  
        console.log('Page rendered');  
      });  
    });
    }
     
  }, function (reason) {  
    console.error(reason);  
  });
  // 返回
  $scope.back = function(){
    window.history.back();
  }
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
