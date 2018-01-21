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
          .state('course',{
            url:'/course',
            templateUrl:'templates/course.html',
            controller:'courseCtrl'
          })
          .state('courseInfo',{
            url:'/courseInfo/:id',
            templateUrl:'templates/courseInfo.html',
            controller:'courseInfoCtrl'
          })
          .state('courseTest',{
            url:'/courseTest',
            templateUrl:'templates/view/courseTest.html',
            controller:'courseTestCtrl'
          })
          .state('exercise',{
            url:'/exercise/:exerName',
            templateUrl:'templates/exercise.html',
            controller:'exerciseCtrl'
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
          .state('paper',{
            url:'/paper',
            templateUrl:'templates/paper.html',
            controller:'paperCtrl'
          })
          .state('tab.chats', {
            url: '/chats',
            cache:'false', 
            views: {
              'tab-chats': {
                templateUrl: 'templates/tab-chats.html',
                controller: 'ChatsCtrl'
              }
            }
          })
          .state('tab.chat-detail', {
            url: '/chats/:chatId',
            views: {
              'tab-chats': {
                templateUrl: 'templates/chat-detail.html',
                controller: 'ChatDetailCtrl'
              }
            }
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
      $urlRouterProvider.otherwise('/login');
    });