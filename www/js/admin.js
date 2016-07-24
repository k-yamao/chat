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
		// 初期処理
		$scope.initApp();
		
		adminNavigator.on('prepush', function(e) {

			
		});

		adminNavigator.on('postpush', function(e) {
//			console.log(e.getCurrentPage().page);
//			if(e.currentPage.page == $scope.page.areport) {
//				console.log($scope.page.areport);
//			}
			
			
			
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
    // 画面遷移イベント
    $scope.movePage = function(page) {
        // オプションの指定がなければ、デフォルトオプション
        if (page == $scope.page.areport){

        } else if (page == $scope.page.areport) {
			
		}
		

        adminNavigator.pushPage(page);
    };
    // 内部ブラウザを起動
    $scope.openWindow = function(url) {
        console.log(url);
       window.open(url, '_blank', 'location=yes');
    };
    // 画面遷移
    $scope.movePopPage = function(options) {
        
        // オプションの指定がなければ、デフォルトオプション
        if (angular.isUndefined(options)){
            adminNavigator.popPage($scope.options);
        } else {
            // 指定がなければ、引数のオプション
            adminNavigator.popPage(options);
        }
        
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
    
    $scope.db     = null;
    $scope.istable = false;
    $scope.conf = {
        "database_name"         : "database",   // DB名
        "database_version"      : "1.0",        // バージョン
        "database_displayname"  : "chatdb",   // 表示名
        "database_size"         : 2000000    // サイズ
    };
    
    // クエリー
    $scope.query = {
        checkPeopleTable    : 'SELECT COUNT(*) cnt FROM sqlite_master WHERE type="table" AND name="People"',
        dropTabelPeople     : 'DROP TABLE IF EXISTS People',
        createTabelPeople   : 'CREATE TABLE IF NOT EXISTS People (_id text, peopleID text, mail text, password text, nicname text, imageURL text, auth text, token text, sex text, birthDay text, pref text, city text, appeal text, phrase text, loging text, updated text, created text)',
        insertTabelPeople   : 'INSERT INTO People (_id, peopleID, mail, password, nicname, imageURL, auth, token, sex, birthDay, pref, city, appeal, phrase, loging, updated, created) VALUES ("","","","","","","","","","","","","","","","","")',
        selectTabelPeople   : 'SELECT _id, peopleID, mail, password, nicname, imageURL, auth, token, sex, birthDay, pref, city, appeal, phrase, loging, updated, created FROM People',
        updateTabelPeople   : 'UPDATE People SET ',
        deleteTabelPeople   : 'DELETE FROM People',
        
    };
    
    /*******************************************************************
     * アプリ起動時、トップ画面 [top.html]
     *******************************************************************/
    $scope.signinStatus = false;
    $scope.initApp = function() {        /**
         * DBからメール、パスワード、ログイン期間を取得
         */         
        // データベースオブジェクト取得
        //$scope.db = $scope.getDB();
        var db = window.openDatabase($scope.conf.database_name, $scope.conf.database_version, $scope.conf.database_displayname, $scope.conf.database_size);
        
        // テーブル存在チェック
        db.transaction((function (tx) {
            // テーブルチェック
            tx.executeSql($scope.query.checkPeopleTable, [], 
                (function(tx, results) {
                    // Peopleテーブル存在して
                    if (results.rows.item(0).cnt > 0) {
                    //if (false) {
                        //modal.show();
                        // 認証処理
                        // ピープルデータ取得
                        db.transaction(
                            (function (tx) {
                                tx.executeSql(
                                    $scope.query.selectTabelPeople, 
                                    [], 
                                    // ピープルデータの取得に成功
                                    (function(tx, results) {
                                        var nU = Math.floor( new Date().getTime() / 1000 ) ;
                                        var p = results.rows.item(0);
                                        $scope.people._id        = p._id;
                                        $scope.people.peopleID   = p.peopleID;
                                        $scope.people.mail       = p.mail;
                                        $scope.people.password   = p.password;
                                        $scope.people.nicname    = p.nicname;
                                        $scope.people.imageURL   = p.imageURL == "" ? "http://file.local-c.com/uploads/mimicry/noimage.png" : p.imageURL;
                                        $scope.people.sex        = p.sex;
                                        $scope.people.birthDay   = p.birthDay;
                                        $scope.people.pref       = p.pref;
                                        $scope.people.city       = p.city;
                                        $scope.people.appeal     = p.appeal;
                                        $scope.people.phrase     = p.phrase;
                                        $scope.people.auth       = p.auth;
                                        $scope.people.token      = p.token;
                                        $scope.people.loging     = p.loging;
                                        $scope.people.updated    = p.updated;
                                        $scope.people.created    = p.created;
										
										/**
										 * サインイン
										 */
										$scope.signin(false);

                                    }), $scope.errorDB);
                            }), 
                            $scope.errorDB
                        );
                        //　テーブルデータの取得処理
                        //$scope.getPeopleData($scope.db);
                        //$scope.createDB($scope.db);  
                        return true;
                    // Peopleテーブルなし
                    } else {
                        // データベース・テーブル作成処理
                            db.transaction((function (tx) { // テーブル作成
                                tx.executeSql($scope.query.dropTabelPeople);
                                tx.executeSql($scope.query.createTabelPeople);
                                tx.executeSql($scope.query.insertTabelPeople);
                            }),
                            // 
                            $scope.errorDB,             // テーブル作成失敗
                            (function(tx, results) {    // テーブル作成、空レコード作成成功
                                // トップページのままでOK
                                // Todo初期処理で他になにかあれば記載
                                
                                // トップページでボタンを表示
                                $scope.signinStatus = true;
                                $scope.$apply(); 
                            }));
                            
                            
                        return false;
                    }
                }), $scope.errorDB);
        }), $scope.errorDB);
    };
    // データベースオブジェクト取得
    $scope.getDB = function(){
        return window.openDatabase($scope.conf.database_name, $scope.conf.database_version, $scope.conf.database_displayname, $scope.conf.database_size);
    };
    // データベースのエラー時の処理（アラート）
    $scope.errorDB = function (err) {
        console.log("SQL 実行中にエラーが発生しました: " + err.code);
        $scope.alert('データベースエラー', true);
		// トップページでボタンを表示
		$scope.signinStatus = true;
		$scope.$apply(); 
    };
    // ピープルテーブルの更新
    $scope.updatePeople = function(){
        // データベースオブジェクト取得
        var db = window.openDatabase($scope.conf.database_name, $scope.conf.database_version, $scope.conf.database_displayname, $scope.conf.database_size);
        // スコアを更新
        db.transaction($scope.exePeopleUpdate, $scope.errorDB);
    };
    // ピープルテーブルの削除
    $scope.deletePeople = function(){
        // データベースオブジェクト取得
        var db = window.openDatabase($scope.conf.database_name, $scope.conf.database_version, $scope.conf.database_displayname, $scope.conf.database_size);
        // ピープルテーブルを削除
        db.transaction($scope.exePeopleDelete, $scope.errorDB);    
    };
    // ピープルテーブルの更新
    $scope.exePeopleUpdate = function (tx) {
        tx.executeSql(
            $scope.query.updateTabelPeople
            + '_id = "'          + $scope.people._id             + '"'
            + ',peopleID = "'    + $scope.people.peopleID        + '"'  
            + ',mail     = "'    + $scope.people.mail            + '"'
            + ',password = "'    + $scope.people.password        + '"'
            + ',nicname  = "'    + $scope.people.nicname         + '"' 
            + ',imageURL = "'    + $scope.people.imageURL        + '"' 
            + ',sex      = "'    + $scope.people.sex             + '"'
            + ',birthDay = "'    + $scope.people.birthDay        + '"'
            + ',pref     = "'    + $scope.people.pref            + '"'
            + ',city     = "'    + $scope.people.city            + '"'
            + ',appeal   = "'    + $scope.people.appeal          + '"'
            + ',phrase   = "'    + $scope.people.phrase          + '"'
            + ',auth     = "'    + $scope.people.auth            + '"'
            + ',token    = "'    + $scope.people.token           + '"'
            + ',loging   = "'    + $scope.people.loging          + '"'
            + ',updated  = "'    + $scope.people.updated         + '"'
            + ',created  = "'    + $scope.people.created         + '"'
        );
    };
    // ピープルテーブルの削除
    $scope.exePeopleDelete = function (tx) {
        tx.executeSql($scope.query.dropTabelPeople);
        tx.executeSql($scope.query.createTabelPeople);
        tx.executeSql($scope.query.insertTabelPeople);
    };
    $scope.dialogs = {};
    $scope.msgDialog = function(dlg) {
        if (!$scope.dialogs[dlg]) {
            ons.createDialog(dlg).then(function(dialog) {
                $scope.dialogs[dlg] = dialog;
                dialog.show();
            });
        } else {
          $scope.dialogs[dlg].show();
        }
    };
    
  
    // ピープルデータをDBから取得
    $scope.getPeople = function(){
        // データベースオブジェクト取得
        var db = window.openDatabase($scope.conf.database_name, $scope.conf.database_version, $scope.conf.database_displayname, $scope.conf.database_size);
        // ピープルデータの取得に成功
        db.transaction(
            (function (tx) {
                tx.executeSql(
                    $scope.query.selectTabelPeople, [], 
                        (function(tx, results) {
                            $scope.people = results.rows.item(0);
                            //return $scope.people;
                        }), $scope.errorDB);
                }), 
            $scope.errorDB
        );
    };
    
    /******************************************************************    
     *  サインイン[signin.html]
     *******************************************************************/
    $scope.signin = function(modalFlag){

        // メールチェック
        if (angular.isUndefined($scope.people.mail)){
           $scope.alert("メールアドレスを確認しください", true);
           return false;
        }

        // パスワード
        if (angular.isUndefined($scope.people.password)){
            $scope.alert("パスワードを確認しください", true);
            return false;
        }
        
        if (modalFlag) {
            // モーダル表示
            modal.show();
        }
        
        
        setTimeout(function() {
            $http({
                method: 'POST',
                url : $scope.webAPI.URL + $scope.webAPI.people + $scope.webAPI.signin,
                headers: { 'Content-Type': 'application/json' },
                data: $scope.people,
            }).success(function(data, status, headers, config) {
                   
                    // サインインが完了
                    $scope.people.peopleID     = data.data.peopleID;
                    $scope.people._id          = data.data._id;
                    $scope.people.mail         = data.data.mail;
                    $scope.people.password     = data.data.password;
                    $scope.people.nicname      = data.data.nicname;
                    $scope.people.imageURL     = angular.isUndefined(data.data.imageURL) ? 'http://file.local-c.com/uploads/mimicry/noimage.png' : data.data.imageURL;
                    $scope.people.nicname      = data.data.nicname;
                    $scope.people.sex          = data.data.sex;
                    $scope.people.birthDay     = angular.isUndefined(data.data.birthDay) ? '' : data.data.birthDay;
                    $scope.people.pref         = angular.isUndefined(data.data.pref) ? '' : data.data.pref;
                    $scope.people.appeal       = angular.isUndefined(data.data.appeal) ? '' : data.data.appeal;
                    $scope.people.phrase       = angular.isUndefined(data.data.phrase) ? '' : data.data.phrase;
                    $scope.people.auth         = data.data.auth;
                    $scope.people.token        = data.data.token;
                    $scope.people.loging       = data.data.loging;
                    $scope.people.updated      = data.data.updated;
                    $scope.people.created      = data.data.created;
                    $scope.people.boards       = angular.isUndefined(data.data.boards) ? [] : data.data.boards;
                    // ピープルテーブルへ保存
                    $scope.updatePeople();
                    
                    
				
                    // メール、パスワードあり、認証あり、最終ログインが２ヶ月以内
                    if ($scope.people.peopleID == "1" || $scope.people.peopleID == "2") {
                        // メインへ遷移
                        $scope.options.people = $scope.people;
                        $scope.movePage($scope.page.menu, $scope.people);
						
                    } else {
						
						$scope.movePage($scope.page.login, $scope.people);
                        // トップページでボタンを表示
                        $scope.signinStatus = true;
                        $scope.$apply();   
                    }

            }).error(function(data, status, headers, config) {
                
                // モーダル非表示
                modal.hide();
                
                
                if (!$scope.signoutFlag) {
                    $scope.alert('サインインに失敗しました。',true);
                } 
                //     
                
                // トップページでボタンを表示
                $scope.signinStatus = true;
                //$scope.$apply();
            });
       }, 3000);
        
    };

	$scope.getMsgList = function(roomID, lastMsgID){
        
        //console.log($scope.webAPI.URL + $scope.webAPI.msg + $scope.webAPI.list + '/' + roomID + '/' + lastMsgID)
        // APIから取得？
        // トークリストを取得 
        $http({
            method: 'GET',
            url : $scope.webAPI.URL + $scope.webAPI.msg + $scope.webAPI.list + '/' + roomID + '/' + lastMsgID,
            headers: { 'Content-Type': 'application/json' },
            data: null,
        }).success(function(data, status, headers, config) {

            // 配列の入れ替え作業保存
            angular.forEach(data.data, function (msg, key) {
                if (msg.msg != "join") {
                    $scope.talkList.unshift(msg);    
                }
            });
            
            // 最下部へスクロール
            $scope.scrollMsg(400);
            
            // トーク画面へ遷移
            $scope.movePage($scope.page.talk, $scope.options);
            
    
            var element = document.getElementsByClassName("timeline-li");
            for (var i=0;i<element.length;i++) {
                console.log(element[i].style.borderBottom);
              element[i].style.borderBottom = "none"
            }
            
            
            // 既読にする
            $scope.readMsg(roomID);
            

        }).error(function(data, status, headers, config) {

            $scope.alert('トークの取得に失敗しました。',true);
        });
        
        
    };    
   
   
    $scope.convertLink  = function (input) {
        input.replace(/"/g, '&quot;').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        //input = input.replace(/\n|\r/g, '<br>')
        var regexp_url = /((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g; // ']))/;
        var regexp_makeLink = function(all, url, h, href) {
            return '<div ng-click="openWindow(\'h' + href + '\');">' + url + '</div>';
            //return '<a href="#" ng-click="alert(1)">' + url + '</a>';
            //return '<a href="h' + href + '" target="_blank">' + url + '</a>';
        }
        return $sce.trustAsHtml(input.replace(regexp_url, regexp_makeLink));
    }
    
	
	
	
	
	
	 /******************************************************************
     *  レポート一覧[report.html] sboard
     *******************************************************************/
	$scope.initReport = function() {
        $scope.getReport($scope.boardListLimit, 0, true);
        
    };
    $scope.loadReport = function($done) {
        
        $timeout(function() {        
            $scope.getReports(100, 0, true, function(){
                // コールバックしてDONE
                $done();
            });
        }, 1000);
    };
    $scope.boardMsg = {
        peopleID    : "",
        nicname     : "",
        imageURLTo  : "",
        boardIDTo   : "",
        peopleIDTo  : "",
        nicnameTo   : '',
        inline      : "",
        desc        : ""
    };    
    $scope.reportCount = 100;
    $scope.reportItemHeight = 150;
    $scope.reports = [];
    $scope.getReports = function (limit, offset, refresh, callback){
               
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
    /******************************************************************
     *  ボード一覧[board.html] sboard
     *******************************************************************/
    $scope.initBoard = function() {
        $scope.getBoards($scope.boardListLimit, 0, true);
        
    };
    $scope.loadBoard = function($done) {
        
        $timeout(function() {        
            $scope.getBoards(100, 0, true, function(){
                // コールバックしてDONE
                $done();
            });
        }, 1000);
    };
    $scope.boardMsg = {
        peopleID    : "",
        nicname     : "",
        imageURLTo  : "",
        boardIDTo   : "",
        peopleIDTo  : "",
        nicnameTo   : '',
        inline      : "",
        desc        : ""
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
    }
    
   
    /******************************************************************
     *  プロフィール表示[profile.html] 
     *******************************************************************/
    
    $scope.profile = {
        people     : null,
        boards     : [],
        boardCount : 0,
        pickCount  : 0,
        pickerCount: 0
    };
    $scope.pushProfile = function(people) {
        $scope.profile.people = people;
        
        // プロフィールのボード情報を取得
        $scope.getProfileBoards(people, "", function(){

            // ピープルのカウント情報取得
            $scope.getProfileCount(people, function(){
                
                // プロフィールへ遷移
                $scope.movePage($scope.page.profile, $scope.options);
            });
        });
        
        // プロフィールへ遷移
        //$scope.movePage($scope.page.profile, $scope.options);
        //$scope.$apply();
    };
    // ピープルのボードを取得
    $scope.getProfileBoards = function(people, boardID, callback) {
        var bid = ""
        if (!angular.isUndefined(boardID) && boardID != "") {
            bid = "&boardID=" + boardID;
        }
        
        //http://localhost:3000/spika/v1/board/list/?boardID=7&peopleID=1
        $http({
            method: 'GET',
            url : $scope.webAPI.URL + $scope.webAPI.board + $scope.webAPI.list + "/?peopleID=" + people.peopleID + bid,
            headers: { 'Content-Type': 'application/json' },
            data: null,
        }).success(function(data, status, headers, config) {
            
            if (!angular.isUndefined(boardID) && boardID != "") {
                $scope.profile.boards.push(data.data);
            } else {
                $scope.profile.boards = data.data;
            }
             
            
        }).error(function(data, status, headers, config) {
            // 登録済みのエラー
            $scope.alert("プロフィールボードの取得エラー", true);

        }).finally(function() {
            // ボードの処理が終わったらコールバック
            callback();
        });
        
    };
    // ピープルの各カウントを取得
    $scope.getProfileCount = function(people, callback) {
        
        $http({
            method: 'GET',
            url : $scope.webAPI.URL + $scope.webAPI.people + $scope.webAPI.count + "/" + people.peopleID,
            headers: { 'Content-Type': 'application/json' },
            data: null,
        }).success(function(data, status, headers, config) {
            
            
            if (data.code == 200) {
                $scope.profile.boardCount  = data.data.boardCount;
                $scope.profile.pickCount   = data.data.pickCount;
                $scope.profile.pickerCount = data.data.pickerCount;
            }
        }).error(function(data, status, headers, config) {
            // 登録済みのエラー
            $scope.alert("プロフィールのカウント取得エラー", true);

        }).finally(function() {
            // ボードの処理が終わったらコールバック
            callback();
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
