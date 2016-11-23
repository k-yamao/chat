//var module = ons.bootstrap('my-app', ['onsen']);
var module = angular.module('admin-app', ['onsen']);
//var module = ons.bootstrap('chat-app', ['onsen']);
document.addEventListener ("deviceready", onDeviceReady, false);


function onDeviceReady () {
    //navigator.splashscreen.hide();
}

//document.addEventListener("offline", function(){console.log('nettest');}, false);
var host = "localhost:3000";
var host = "spika.local-c.com:3000";

// コントローラー
module.controller('adminCtrl', function($scope, $http, $sce, $q, $anchorScroll, $location, $timeout, $element, socket) {

	
  	// document ready
    angular.element(document).ready(function () {
		
		
		adminNavigator.on('postpush', function(event) {
			// レポート画面
			if(event.enterPage.name == "admin_report.html") {
				console.log(event.enterPage.name);
				// レポート取得
				$scope.initReport();
			}

			// ボード確認
			if(event.enterPage.name == "admin_board.html") {
				console.log(event.enterPage.name);
				 // ボード取得
				$scope.initBoard();
			}
		});

		adminNavigator.on('prepush', function(event) {
		});

		adminNavigator.on('prepop', function(e) {
		});

		adminNavigator.on('postpop', function(e) {
		});
    });
    $scope.webAPI = {
        URL    : "http://" + host + "/spika/v1",
        people  : "/people",
        profile : "/profile",
        signin  : "/signin",
        board   : "/board",
        pick    : "/pick",
        room    : "/room",
        report  : "/report",
        msg     : "/msg",
        list    : "/list",
        count   : "/count",
        delete  : "/delete",
        change  : "/change",
        read    : "/read"
    };
    $scope.newMsgAlert = true;
    $scope.imgBaseURL = "http://spika.local-c.com:3000/spika/v1/file/download/";
    // ボードのデフォルト検索検索LIMIT
    $scope.boardListLimit = 200;
    // オートログインの期間
    $scope.autoLoginTime = Math.floor( new Date().getTime() / 1000 ) - 5184000; // 2ヶ月前
    $scope.networkState = false;
    $scope.device = {
        id : null,
		os : ''
    };
    $scope.options = {
          animation: 'slide', // アニメーションの種類
          onTransitionEnd: function() {} // アニメーションが完了した際によばれるコールバック
    };
    $scope.page = {
        setting     : 'setting.html',       // 設定
        boardMsg    : 'boardMsg.html',    	// メッセージ
        boardSearch : 'boardSearch.html',  	// ボード検索条件
        profile     : 'profile.html',		// プロフィール
		profileEdit : "profileEdit.html",   // プロフィール編集
        main        : 'main.html',			// メイン
        talkroom    : 'talkroom.html',		// 部屋一覧
        talk        : 'talk.html',		    // トーク
        signup      : 'signup.html',		// 新規登録
        login       : 'login.html',			// ログイン
        auth        : 'auth.html',			// 認証ページ
        top         : 'top.html',    		// トップページ
        password    : 'password.html',    	// パスワード初期化
		menu    	: 'menu.html',    	// 
		areport  	: 'a-report.html',    	// 
		board   	: 'a-board.html',    	// 
		msg         : 'a-msg.html',    	// パスワード初期化
		main    	: 'a-main.html'    	// パスワード初期化
    };
    
    $scope.people = {
        peopleID    : "",
        mail        : "",
        password    : "",
        nicname     : "",
        imageURL    : "http://file.local-c.com/uploads/mimicry/noimage.png",
        imageFile   : "",
        sex         : "女性",
        birthDay    : "",
        pref        : "",
        city        : "",
        appeal      : "",
        phrase      : "",
        auth        : "0",
        token       : "",
        loging      : "0",
        updated     : "0",
        created     : "0"
    };
    $scope.birth = {
        year  : "",
        month : "",
        day   : ""
    }
    // アラートダイアログ
    $scope.alert = function(msg, material) {
        ons.notification.alert({
          title  : '',
          message: msg,
          modifier: material ? 'material' : undefined
        });
    };
    /******************************************************************
     *  ボード一覧[board.html] sboard
     *******************************************************************/
    $scope.initBoard = function() {
		$scope.boards = [];
        $scope.getBoards($scope.boardListLimit, 0, true);
        
    };
    $scope.boardCount = 100;
    $scope.boardItemHeight = 150;
    $scope.boards = [];
    $scope.getBoards = function (limit, offset, refresh, callback){
               
        //console.log($scope.seachParam);
        $http({
            method: 'GET',
            url : $scope.webAPI.URL + $scope.webAPI.board + $scope.webAPI.list + "/?limit=" + limit + "&offset=" + offset + $scope.getSearchParam(),
            headers: { 'Content-Type': 'application/json' },
        }).success(function(data, status, headers, config) {
            
            if(refresh) {
                $scope.boards = data.data;
            } else {
                // 配列の入れ替え作業保存
                angular.forEach(data.data, function (board, key) {
                    $scope.boards.push(board);
                });
            }
            // データをセット
            
            $scope.isLoading = false;
            
        }).error(function(data, status, headers, config) {
            // 登録済みのエラー
            $scope.alert("トーク一覧取得エラー", true);
            // モーダル非表示
            modal.hide();
        }).finally(function() {
            // ボードの処理が終わったらコールバック
            callback();
        });

    };
    // 検索条件ようにパラメーター文字列を生成
    $scope.getSearchParam = function() {
        var param = "";
        var amp   = "&";
        if ($scope.seachParam.sex != "") {
            param += amp + "sex=" + $scope.seachParam.sex;
        }
        if ($scope.seachParam.pref != "") {
            param += amp + "pref=" + $scope.seachParam.pref;
        }
        if ($scope.seachParam.age != "") {
            $scope.ageList
            param += amp + "age=" + $scope.ageList.indexOf($scope.seachParam.age);
        }
        return param;
    };
    $scope.seachParam = {
        sex  : "",
        pref : "",
        age  : ""
        
    };
    $scope.ageList = ["0歳 - 12歳", "13歳 - 15歳", "16歳 - 18歳","19歳 - 22歳","23歳 - 30歳","31歳 - 40歳","41歳 - 50歳","51歳 - 60歳","61歳 - 70歳","71歳 - 80歳","81歳 - 90歳"];
    $scope.seachBoard = function (){
        $scope.movePage($scope.page.boardSearch, $scope.options);
    };
    // 生年月日を設定
    $scope.setAge = function(value){
        // ダイアログ非表示
        $scope.dialog.hide();
        $scope.seachParam.age = value;
    };
     // 生年月日を設定
    $scope.setSeachPref = function(value){
        // ダイアログ非表示
        $scope.dialog.hide();
        $scope.seachParam.pref = value;
    };
    
    $scope.isBoardSearch = function(){
        if($scope.seachParam.sex == "" && $scope.seachParam.pref == "" && $scope.seachParam.age == "") {
            return false;
        } else {
            return true;
        }
    };
    $scope.boardSearchClass = function(){
        return {
            'search-active'  :$scope.isBoardSearch(),
            'search-none'    :!$scope.isBoardSearch()
        }
    };
    // 検索条件を設定して検索をする
    $scope.searchBoard = function(){
        
        $scope.getBoards($scope.boardListLimit, 0, true, function(){
            $scope.movePopPage();
        });
        
        
    };
    // 検索条件をクリアする
    $scope.searchClear = function(){
        
        $scope.seachParam.sex = "";
        $scope.seachParam.pref = "";
        $scope.seachParam.age = "";
    };
    
    // ボードを削除する
    $scope.removeBoard = function(item) {
        //var mod = material ? 'material' : undefined;
        var mod = {
            
        };
        ons.notification.confirm({
          title: '確認',
          message: 'この投稿を削除しますか?',
          modifier: mod,
          callback: function(idx) {
            switch (idx) {
              case 0:
                break;
              case 1:

                    
                $http({
                    method: 'GET',
                    url : $scope.webAPI.URL + $scope.webAPI.board + $scope.webAPI.delete + "/" + item.boardID,
                    headers: { 'Content-Type': 'application/json' }
                }).success(function(data, status, headers, config) {
                    
                    angular.forEach($scope.boards, function(board, key) {
                    
                         if (item.boardID == board.boardID) {
                             $scope.boards.splice(key,1);
                            //$scope.$apply();         
                         }
                     
                    });
                    $scope.alert("投稿を削除しました", true);
                    
                }).error(function(data, status, headers, config) {
                    // 登録済みのエラー
                    $scope.alert("投稿の削除に失敗しました。", true);
                }).finally(function() {
                    
                });
                break;
            }
          }
        });
    };
	
	// 退会 People削除
    $scope.removePeople = function(peopleID) {

        // トークリストを取得 
        $http({
            method: 'GET',
            url : $scope.webAPI.URL + $scope.webAPI.people +  $scope.webAPI.delete + '/' + peopleID,
            headers: { 'Content-Type': 'application/json' },
            data: null,
        }).success(function(data, status, headers, config) {
            
            ons.notification.alert({
                title: '',
                message: 'Peopleしました。'
            });

        }).error(function(data, status, headers, config) {
            ons.notification.alert({
                title: '',
                message: 'People削除に失敗しました。'
            });
        });
    };
    
  	$scope.initReport = function() {
		$scope.reports = [];
        $scope.getReport(100, 0, true);
        
    };
    $scope.reports = [];
    $scope.getReport = function (limit, offset, refresh){
               
        //console.log($scope.seachParam);
        $http({
            method: 'GET',
            url : $scope.webAPI.URL + $scope.webAPI.report + $scope.webAPI.list + "/?limit=" + limit + "&offset=" + offset + $scope.getSearchParam(),
            headers: { 'Content-Type': 'application/json' },
        }).success(function(data, status, headers, config) {
            
            if(refresh) {
                $scope.reports = data.data;
            } else {
                // 配列の入れ替え作業保存
                angular.forEach(data.data, function (board, key) {
                    $scope.reports.push(board);
                });
            }
            // データをセット
            
            $scope.isLoading = false;
            
        }).error(function(data, status, headers, config) {
            // 登録済みのエラー
            $scope.alert("レポート覧取得エラー", true);
            // モーダル非表示
            modal.hide();
        }).finally(function() {
           
        });

    };
    
                        
});  

module.filter('substr', function() {
    return function(input, from, to) {
        // do some bounds checking here to ensure it has that index
        //return input.substring(from, to);
        var inputtext = String(input);
        return inputtext.substring(from, to);
        
    }
});

module.filter('customReadMore', function() {
    return function(input, from, to, text) {
       
        var readmoreText = '';
        
        var inputtext = String(input);
        if (inputtext.length > to && !angular.isUndefined(text)) {
            readmoreText = text;
        }        
        return inputtext.substring(from, to) + readmoreText;
        
    }
});


module.filter('autoLink', function($sce) {
    return function(input) {
        input.replace(/"/g, '&quot;').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        input = input.replace(/\n|\r/g, '<br>')
        var regexp_url = /((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g; // ']))/;
        var regexp_makeLink = function(all, url, h, href) {
            //return '<div ng-click="openWindow(\'h' + href + '\');">' + url + '</div>';
            return '<a href="#" ng-click="alert(1)">' + url + '</a>';
            //return '<a href="h' + href + '" target="_blank">' + url + '</a>';
        }
        return $sce.trustAsHtml(input.replace(regexp_url, regexp_makeLink));
    }
});

module.directive('a', function() {
  return {
    restrict: 'E',
    link: function(scope, elem, attrs) {
        console.log(attrs);
      if(attrs.ngClick || attrs.href === '' || attrs.href === '#'){
        elem.on('click', function(e){
          e.preventDefault();
        });
      }
    }
  };
});

/**
 * 日付カスタムフィルター1
 * フォーマット2016/2/21 13:48:10
 */
module.filter('customDate1', function() {
    return function(input) {
        var objDate = new Date(input);
        var nowDate = new Date();
        //現在時間との差
        myHour = Math.floor((nowDate.getTime()-objDate.getTime()) / (1000*60*60)) + 1;

        var year = objDate.getFullYear();
        var month = objDate.getMonth() + 1;
        var date = objDate.getDate();
        var hours = objDate.getHours();
        var minutes = objDate.getMinutes();
        var seconds = objDate.getSeconds();
        if ( hours < 10 ) { hours = "0" + hours; }
        if ( minutes < 10 ) { minutes = "0" + minutes; }
        if ( seconds < 10 ) { seconds = "0" + seconds; }
        str = year + '/' + month + '/' + date + ' ' + hours + ':' + minutes + ':' + seconds;
        var rtnValue = str;

        return rtnValue;
        
    }
});
/**
 * 日付カスタムフィルター2　何時間前か
 * フォーマット　1秒前,1分前,1時間前
 */
module.filter('customDate2', function() {
    return function(input) {
        var rtnValue = 'Now';
        
        var objDate = new Date(input);
        var nowDate = new Date();
        //現在時間との差 時間
        var myHour = Math.floor((nowDate.getTime()-objDate.getTime()) / (1000*60*60));
        //現在時間との差 分
        var myMin  = Math.floor((nowDate.getTime()-objDate.getTime()) / (1000*60));
        //現在時間との差 秒
        var mySec  = Math.floor((nowDate.getTime()-objDate.getTime()) / (1000));

        
        if (myHour > 0) {
            rtnValue = myHour + '時間前'
        } else if (myMin > 0){
            rtnValue = myMin + '分前'
        } else {
            rtnValue = mySec + '秒前'
        }
        

        return rtnValue;
        
    }
});
/**
 * 日付カスタム　年齢
 * フォーマット　
 */
module.filter('customDate3', function() {
    return function(input) {
        if (angular.isUndefined(input)) {
            return "";
        }
        var age     = 0;
        var nowDate = new Date();
        var year = parseInt(input.substr(0,4));
        var month = parseInt(input.substr(4,2));
        var date = parseInt(input.substr(6,2));
        var yearNow = nowDate.getFullYear();
        var monthNow = nowDate.getMonth() + 1;
        var dateNow = nowDate.getDate();
        age     =  yearNow-year;
        var m   =  monthNow-month;
        var d   =  dateNow-date
        if (0 <= m) {
            if (0 == m && 0 > d) {
                age -= 1;
            }
        } else {
           age -= 1;
        }
        return age;
        
    }
});
/**
 * 日付カスタム　トーク用
 * フォーマット 2/21 13:48
 */
module.filter('customDate4', function() {
    return function(input) {
        var objDate = new Date(input);
        var nowDate = new Date();
        //現在時間との差
        myHour = Math.floor((nowDate.getTime()-objDate.getTime()) / (1000*60*60)) + 1;

        var year = objDate.getFullYear();
        var month = objDate.getMonth() + 1;
        var date = objDate.getDate();
        var hours = objDate.getHours();
        var minutes = objDate.getMinutes();
        var seconds = objDate.getSeconds();
        if ( hours < 10 ) { hours = "0" + hours; }
        if ( minutes < 10 ) { minutes = "0" + minutes; }
        if ( seconds < 10 ) { seconds = "0" + seconds; }
        
        var rtnValue = "";
        if (myHour < 24) {
            rtnValue = hours + ':' + minutes;
        } else {
            rtnValue = month + '/' + date + ' ' + hours + ':' + minutes;    
        }
        return rtnValue;
    }
});

/**
 * 改行コードをBR　変換
 * フォーマット 2/21 13:48
 */
module.filter('nl2br', function($sce) {
    return function (input, exp) {
        // console.log(input);
        // if (!angular.isUndefined(input)) {
        //     console.log("sss");
        // }
            var replacedHtml = input.replace(/"/g, '&quot;').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return $sce.trustAsHtml(replacedHtml.replace(/\n|\r/g, '<br>'));
    };
});

module.filter('inlinenl2br', function($sce) {
    return function (input, exp) {
            var replacedHtml = input.replace(/"/g, '&quot;').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return $sce.trustAsHtml('＞' + replacedHtml.replace(/\n|\r/g, '<br>＞') + '<br>');
    };
});


//http://localhost:3000
//ws://spika.local-c.com:3000/spika
module.factory('socket', function ($rootScope) {
  var socket = io.connect("ws://" + host + "/spika");
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});


/**
 * リクエストのときパラメータを変換
 **/ 
module.config(function ($httpProvider) {
//    console.log('config');
//    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
//    $httpProvider.defaults.transformRequest = function(data){
//        if (data === undefined) {
//            return data;
//        }
//        console.log($.param(data));
//        return $.param(data);
//    }
    
    
});
