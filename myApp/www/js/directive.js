angular.module('starter.directive', [])

.directive('appHeadSearch',[function(){
	return {
		restrict:'A',
		replace:true,
		templateUrl:'templates/view/headSearch.html',
		// scope:{
		// 	isHide:'='
		// },
		link:function($scope){
			// 搜索框颜色渐变
		}
	}
}])

.directive('appCarousel',[function(){
	return {
		restrict:'A',
		replace:true,
		templateUrl:'templates/view/carousel.html',
		scope:{
			list:'='
		},
		link:function($scope){
		}
	}
}])


.directive('appListHead',[function(){
	return {
		restrict:'A',
		replace:true,
		templateUrl:'templates/view/listHead.html',
		scope:{
			backstyle:'=',
			stitle:'='
		},
		link:function($scope){
			$scope.back = function(){
				window.history.back();
			}
			$scope.search = function(){
				console.log(111);
			}
		}
	}
}])

.directive('appModuleList',[function(){
	return {
		restrict:'A',
		replace:true,
		templateUrl:'templates/view/module.html',
		scope:{
			list:'='
		}
	}
}])

.directive('appCourseList',[function(){
	return {
		restrict:'A',
		replace:true,
		templateUrl:'templates/view/courseList.html',
		scope:{
			titleName:'@',
			list:'=',
			more:'@'
		},
		controller:function($scope,$state,$http){
			// 跳转到课程详情页
			$scope.goCourseInfo = function(obj){
				$state.go('courseInfo',{name:obj.courseName,teachName:obj.teacherName,id:obj.courseId});		
			}
		}
	}
}])

.directive('appNewsList',[function(){
	return {
		restrict:'A',
		replace:true,
		templateUrl:'templates/view/newsList.html',
		scope:{
			titleName:'@',
			list:'=',
			more:'@'
		}
	}
}])

.directive('appPaperList',[function(){
	return {
		restrict:'A',
		replace:true,
		templateUrl:'templates/view/paperList.html',
		scope:{
			list:'=',
			titleName:'@',
			more:'@'
		}
	}
}])

.directive('appVideoList',[function(){
	return {
		restrict:'A',
		replace:true,
		templateUrl:'templates/view/videoList.html',
		scope:{
			list:'=',
			titleName:'@',
			more:'@'
		}
	}
}]);