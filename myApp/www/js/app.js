// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','starter.directive','ngCookies'])

    .config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

      $ionicConfigProvider.platform.ios.tabs.style('standard');
      $ionicConfigProvider.platform.ios.tabs.position('bottom');
      $ionicConfigProvider.platform.android.tabs.style('standard');
      $ionicConfigProvider.platform.android.tabs.position('standard');

      $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
      $ionicConfigProvider.platform.android.navBar.alignTitle('left');

      $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
      $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

      $ionicConfigProvider.platform.ios.views.transition('ios');
      $ionicConfigProvider.platform.android.views.transition('android');


      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js
      $stateProvider
          .state('login',{
            cache:false,
            url:'/login',
            templateUrl:'templates/login.html',
            controller:'loginCtrl'
          })
          .state('forget',{
            cache:false,
            url:'/forget',
            templateUrl:'templates/forget-pass.html',
            controller:'forgetCtrl'
          })
          .state('alterPass',{
            cache:false,
            url:'/alterPass',
            templateUrl:'templates/alterPass.html',
            controller:'alterPassCtrl'
          })
        // setup an abstract state for the tabs directive
          .state('tab', {
            url: "/tab",
            abstract: true,
            templateUrl: "templates/tabs.html"
          })

        // Each tab has its own nav history stack:
          .state('tab.dash', {
            url: '/dash',
            views: {
              'tab-dash': {
                templateUrl: 'templates/tab-dash.html',
                controller: 'DashCtrl'
              }
            }
          })
          .state('search',{
            url:'/search',
            templateUrl:'templates/search.html',
            controller:'searchCtrl'
          })
          .state('course',{
            url:'/course',
            templateUrl:'templates/course.html',
            controller:'courseCtrl'
          })
          .state('courseInfo',{
            url:'/courseInfo/:name/:teachName/:id',
            templateUrl:'templates/courseInfo.html',
            controller:'courseInfoCtrl'
          })
          .state('video',{
            url:'/video',
            templateUrl:'templates/video.html',
            controller:'videoCtrl'
          })
          .state('news',{
            url:'/news',
            templateUrl:'templates/news.html',
            controller:'newsCtrl'
          })
          .state('newsRead',{
            url:'/newsRead/:id',
            templateUrl:'templates/newsRead.html',
            controller:'newsReadCtrl'
          })
          .state('paper',{
            url:'/paper',
            templateUrl:'templates/paper.html',
            controller:'paperCtrl'
          })
          .state('paperInfo',{
            url:'/paperInfo/:id',
            templateUrl:'templates/paperInfo.html',
            controller:'paperInfoCtrl'
          })
          .state('paperRead',{
            url:'/paperRead/:id',
            templateUrl:'templates/paperRead.html',
            controller:'paperReadCtrl'
          })
          .state('tab.tests', {
            url: '/tests',
            cache:'false', 
            views: {
              'tab-tests': {
                templateUrl: 'templates/tab-tests.html',
                controller: 'TestsCtrl'
              }
            }
          })
          .state('exercise',{
            url:'/exercise/:exerName/:exerStatus/:exerId',
            templateUrl:'templates/exercise.html',
            controller:'exerciseCtrl'
          })
          .state('tab.account', {
            url: '/account',
            cache:'false', 
            views: {
              'tab-account': {
                templateUrl: 'templates/tab-account.html',
                controller: 'AccountCtrl'
              }
            }
          });

      // if none of the above states are matched, use this as the fallback
      // $urlRouterProvider.otherwise('/login');
    })

    //ionic点击系统返回键退出APP  
    //  $cordovaKeyboard,
    .run(function ($rootScope, $ionicPlatform, $state, $ionicHistory, $ionicPopup, $timeout) {
      // var ips = 'http://192.168.23.1:7000';
      var ips = 'http://127.0.0.1:7000';
      if(sessionStorage.getItem('userId')){
        window.location.href= ips+"/#/tab/dash";//登录
      }else{
        window.location.href= ips+"/#/login";//未登录
      }
      
      window.addEventListener('native.keyboardhide', function (e) {  
        cordova.plugins.Keyboard.isVisible = true;  
        $timeout(function () {  
          cordova.plugins.Keyboard.isVisible = false;  
        }, 100);  
      
      });  
      $ionicPlatform.registerBackButtonAction(function (e) {  
        //阻止默认的行为  
        e.preventDefault();  
        // 退出提示框  
        function showConfirm() {  
          var servicePopup = $ionicPopup.show({  
            title: '提示',  
            subTitle: '你确定要退出应用吗？',  
            scope: $rootScope,  
            buttons: [  
              {  
                text: '取消',  
                type: 'button-clear button-calm',  
                onTap: function () {  
                  return 'cancel';  
                }  
              },  
              {  
                text: '确认',  
                type: 'button-clear button-calm border-left',  
                onTap: function (e) {  
                  return 'active';  
                }  
              }  
            ]  
          });  
          servicePopup.then(function (res) {  
            if (res == 'active') {  
              // 退出app  
              ionic.Platform.exitApp();  
            }  
          });  
        }  
        // 判断当前路由是否为各个导航栏的首页，是的话则显示提示框  
        var current_state_name = $state.current.name; 
        debugger 
        // if ($cordovaKeyboard.isVisible()) {  
        //   $cordovaKeyboard.close();  
        // } else {  
          if (current_state_name == 'login' || current_state_name == 'tab.dash' || current_state_name == 'tab.chats' || current_state_name == 'tab.account') {  
            showConfirm();  
          } else if ($ionicHistory.backView()) {  
            $ionicHistory.goBack();  
          } else {  
            showConfirm();  
          }  
        // }  
      }, 402); //101优先级常用于覆盖‘返回上一个页面’的默认行为  
    })  