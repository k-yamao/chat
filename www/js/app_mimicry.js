//var module = ons.bootstrap('mimicry-app', ['onsen']);

var module = angular.module('mimicry-app', ['onsen']);

document.addEventListener ("deviceready", onDeviceReady, false);

//this function runs when phoneGap is ready
function onDeviceReady () {
    console.log('PhoneGap is ready!!!');
    // on()とoff()メソッドの使用例

}

// リクエストのときパラメータを変換
module.config(function ($httpProvider) {
    $httpProvider.defaults.transformRequest = function(data){
        if (data === undefined) {
            return data;
        }
        return $.param(data);
    }
});

// コントローラー
module.controller('mainCtrl', function($scope, $http, $sce, $q, $anchorScroll, $location) {
    
    // document.readyの実装
    angular.element(document).ready(function () {
        // デバイスIDを取得し、ものまねリストを取得する
        monaca.getDeviceId(function(id){
            // デバイスIDを取得する
            if (id != undefined){
                $scope.mrec.device_id = id;
                
            }
            $scope.networkCheck();
            // ものまねリストを取得[1-30件ソート:new]
            $scope.getList(30, 0, $scope.apiParam.sort, $scope.mrec.device_id, 0, true);
            $scope.getMyList(30, 0, 9, $scope.mrec.device_id, 0, true);
        });
  
     
        
        
    });
    $scope.tabPush = function(tabindex){
        $scope.initPlay();
        $scope.initPlay2();
    }
    $scope.networkCheck = function(){
        if (navigator.connection.type == "none") {
            navigator.notification.alert(
                'ネット接続できませんでした。',  // メッセージ
                null,         // コールバック
                'エラー',            // タイトル
                'OK'                  // ボタンの表示名
            );
            return false;            
        }
        return true;        
    }
    $scope.playM = function(rankingId) {
        $scope.ctrlField = rankingId;
    };
    //
    $scope.ctrlField = undefined;
    // ものまね再生コントローラー表示、非表示
    var isCtrlBy = function(rankingId) {
        return $scope.ctrlField === rankingId;
    };
    $scope.isCtrl = function(rankingId) {
        return {
          'display-none': !isCtrlBy(rankingId)
        };
    };
    // Mimicryリスス配列
    $scope.mimicryList = [
        // {"title": "hogetitle","nicname":"hogenick", "updateDate":"20130228035849", "imgpath":"http://farm8.static.flickr.com/7240/7319040888_4b4fc9303a_z.jpg", "fileurl":"https://dl.dropboxusercontent.com/u/13468178/mimicry/5615789bbf5d094b-16_20130816-234507.wav"},
        // {"title": "hoge2title","nicname":"hoge2nick", "updateDate":"20130228035849", "imgpath":"http://farm8.static.flickr.com/7240/7319040888_4b4fc9303a_z.jpg", "fileurl":"https://dl.dropboxusercontent.com/u/13468178/mimicry/5615789bbf5d094b-16_20130816-234507.wav"},
        // {"title": "hoge3title","nicname":"hoge3nick", "updateDate":"20130228035849", "imgpath":"http://farm8.static.flickr.com/7240/7319040888_4b4fc9303a_z.jpg", "fileurl":"https://dl.dropboxusercontent.com/u/13468178/mimicry/5615789bbf5d094b-16_20130816-234507.wav"},
        //  
    ];
    // Mimicryリスス配列
    $scope.mimicryMyList = [];
    // MimicryAPI
    $scope.apiURL = "http://api.local-c.com/mimicry/ranking/list";
    $scope.apieeneURL = "http://api.local-c.com/mimicry/ranking/eene";
    $scope.apideleteURL = "http://api.local-c.com/mimicry/ranking/delete/";
    $scope.shareURL = "http://mimicry.local-c.com/detail.html#";
    $scope.apiParam = {
        "limit"     : 30,   // リミット
        "offset"    : 0,    // オフセット
        "deviceid"  : "",   // デバイスID
        "sort"      : 1     // 並び順
    };
    // 一覧のステータス
    $scope.count = {
        "all"       : 0,
        "from"      : 0,
        "to"        : 0
    };
    $scope.mycount = {
        "all"       : 0,
        "from"      : 0,
        "to"        : 0
    };
    // 録音オブジェクト
    $scope.mrec = {
        "mimicry_id": 0,
        "device_id" : "",
        "recfile"   : "",
        "fileurl"   : "",
        "filname"   : "",
        "imgfile"   : "",
        "imgpath"   : "http://file.local-c.com/uploads/mimicry/noimage.png",
        "title"     : "",
        "nicname"   : "",
        "btn_status": false,
        
    };
    $scope.mrecstr = {
        "play"   : "PLAY",
        "stop"   : "STOP",
        "pause"   : "PAUSE"
    }
    $scope.noimgfile = "http://file.local-c.com/uploads/mimicry/noimage.png";
    $scope.recfile_keep = "";
    $scope.deferred = null;
    $scope.mediaTimer = null;
    $scope.playTime = null;
    $scope.playPosition = 0;
    $scope.playRange = 0;
    $scope.playChange = function() {
        //console.log($scope.playRange);
    };
    // インターバルで再生時間をセットしてやる
    $scope.media = null;
    // 報告フラグのデータ
    $scope.reportFlagData  = {
        "ranking_id" : null,
        "report_type" : 0,
        "report_text" : '',
    }
    // 報告フラグクリック
    $scope.reportFlag  = function(mimicry_id){
        
        $scope.reportFlagData.ranking_id = mimicry_id;
        function alertDismissed() {
            
        }
        navigator.notification.confirm(
            '', // メッセージ
             $scope.onReportConfirm,        // 押されたボタンのインデックスを使用して呼び出すコールバック
            '報告',           // タイトル
            ['キャンセル','性的な内容','暴力的または不快な内容','差別的または攻撃的な内容','有害で危険な行為','児童虐待', 'スパムや誤解を招く説明','権利の侵害']   // ボタンのラベル名
        );
    };
    // 報告を登録する
    $scope.onReportConfirm = function(buttonIndex) {
        if (buttonIndex == 1) {
            return false;
        }
        $scope.reportFlagData.report_type = buttonIndex;
        $http({
            method : 'POST',
            url : 'http://lcapi.local-c.com/mimicry/report/',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            data: $scope.reportFlagData
        }).success(function(data, status, headers, config) {
            navigator.notification.alert('報告しました。', null ,' ');     
        }).error(function(data, status, headers, config) {
            
            navigator.notification.alert(
                         '報告に失敗しました。',
                         null
                         ,'エラー'
            );     
            
        });
    };
    $scope.terms = function() {
        window.open('http://mimicry.local-c.com/privacy.html', '_system')
    },
     $scope.privacy = function() {
        window.open('http://mimicry.local-c.com/privacy.html', '_system')
    },
    // 録音したものまねを再生
    $scope.playRec = function() {
        $scope.mrec.btn_status = true;        
    
        if ($scope.media == null) {
            $scope.media = new Media($scope.mrec.recfile, $scope.onSuccess(), $scope.onError);
            $scope.media.play();
            $scope.startTimer();
            
        } else {
            $scope.media.play();
            $scope.startTimer();
        }
    };
    $scope.startTimer = function() {
        $scope.mediaTimer = setInterval(function() {
            // media の再生位置を取得
            $scope.media.getCurrentPosition(
                // 呼び出し成功
                function(position) {
                    //console.log(position);
                    if (position > -1) {
                        $scope.setAudioPosition(position);
                    } else {
                        clearInterval($scope.mediaTimer);
                        $scope.initPlay();
                        $scope.$apply();
                    }
                },
                // 呼び出し失敗
                function(e) {
                    console.log("Error getting pos=" + e);
                    //$scope.setAudioPosition("Error: " + e);
                    clearInterval(mediaTimer);
                    $scope.media.stop();
                }
            );
        }, 100);
    };
    // 再生位置をセット
    $scope.setAudioPosition = function(position) {
        //console.log(Math.floor(((position * 1000) / ($scope.playTime * 1000)) * 100));
        $scope.playPosition = position;
        $scope.playRange = Math.floor(((position * 1000) / ($scope.playTime * 1000)) * 100);
        //console.log($scope.playRange);
        $scope.$apply();
    };
    // 録音したものまねを一時停止
    $scope.pauseRec = function() {
      // 一時停止
      $scope.media.pause();
      // インターバルをストップ
      clearInterval($scope.mediaTimer);
      
      // ボタンをPLAYにする
      $scope.mrec.btn_status = false;
      
    };
    // 録音したものまねの初期化
    $scope.initPlay = function() {
        $scope.playPosition = 0;
        $scope.playRange = 0;  
        $scope.mrec.btn_status = false;
        if ($scope.media != null) {
            $scope.media.stop();
            $scope.media = null;
            
        }
    }
    $scope.onSuccess = function() {
        console.log("Audio Success");
        // 再生時間を取得
    };
    $scope.onError = function(error) {
        console.log(error.message);
    };
    $scope.stopRec = function() {
        $scope.initPlay();
        
    };
    // MOREボタンの制御
    $scope.getMore = function() {
        if ($scope.count.all ==  $scope.count.to || $scope.count.all < $scope.apiParam.limit) {
            return false;
        }
        return true;
    };
    // MOREボタンの制御 MY
    $scope.getMyMore = function() {
        if ($scope.mycount.all ==  $scope.mycount.to || $scope.mycount.all < $scope.apiParam.limit) {
            return false;
        }
        return true;
    };
    // 並び順の変更
    $scope.sortChange = function(sort, modalflag) {
        // ネット接続チェック
        if (!$scope.networkCheck()) {
            return false;
        }
        // 再生中を初期化
        $scope.initPlay2();
        
        $scope.apiParam.sort = sort;
        $scope.getList(30, 0, sort, $scope.mrec.device_id, 0, modalflag);
        
        // 一覧トップへスクロール
        $location.hash('list');
        $anchorScroll();
    };
    // Mimicryの一覧を取得
    $scope.getList = function(limit, offset, sort, device_id, more, modalflag) {
        // モーダルを表示
        if (modalflag) {
            modal.show();    
        }
        
        console.log($scope.apiURL + '?' + 'sort=' + sort + '&limit=' + limit  + '&offset=' + offset + '&deviceid=' + device_id);
        // GETでAPIかJSONを取得
        $http.get($scope.apiURL + '?' + 'sort=' + sort + '&limit=' + limit  + '&offset=' + offset + '&deviceid=' + device_id).success(function(data) {
            if (more > 0) {
                // さらに読み込むときは、配列に追加
                angular.forEach(data.result, function(record, i) {
                    // 追加
                    $scope.mimicryList.push(record);
                });
                
            } else {
                // 初期表示はそのままセット
                $scope.mimicryList = data.result;
            }
            // 全件のカウントを保持
            $scope.count.all = data.count;
            
            // MOREさらに読み込んだ場合
            if (offset > 0) {
                // 件数FROM-TOを設定
                $scope.count.to = offset + 1 + limit;
                // 全件よりTOの件数が多かったら全件の値をToに設定
                if ($scope.count.all < $scope.count.to) {
                    $scope.count.to = $scope.count.all;
                }
            // 初期表示の場合
            } else {
                // 初期表示の件数
                $scope.count.from = offset + 1;
                if ($scope.apiParam.limit >  data.count) {
                    $scope.count.to = data.count;
                } else {
                    $scope.count.to = limit;
                }
            }

            // モーダルを閉じる
            if (modalflag) {
                modal.hide();
            }
            
         
        });
    };
    // Mimicryの一覧を取得
    $scope.getMyList = function(limit, offset, sort, device_id, more, modalflag) {
        // モーダルを表示
        if (modalflag) {
            modal.show();    
        }
        console.log($scope.apiURL + '?' + 'sort=' + sort + '&limit=' + limit  + '&offset=' + offset + '&deviceid=' + device_id);
        // GETでAPIかJSONを取得
        $http.get($scope.apiURL + '?' + 'sort=' + sort + '&limit=' + limit  + '&offset=' + offset + '&deviceid=' + device_id).success(function(data) {
            if (more > 0) {
                // さらに読み込むときは、配列に追加
                angular.forEach(data.result, function(record, i) {
                    // 追加
                    $scope.mimicryMyList.push(record);
                });
                
            } else {
                // 初期表示はそのままセット
                $scope.mimicryMyList = data.result;
            }
            // 全件のカウントを保持
            $scope.mycount.all = data.count;
            
            // MOREさらに読み込んだ場合
            if (offset > 0) {
                // 件数FROM-TOを設定
                $scope.mycount.to = offset + 1 + limit;
                // 全件よりTOの件数が多かったら全件の値をToに設定
                if ($scope.mycount.all < $scope.mycount.to) {
                    $scope.mycount.to = $scope.mycount.all;
                }
            // 初期表示の場合
            } else {
                // 初期表示の件数
                $scope.mycount.from = offset + 1;
                
                if ($scope.apiParam.limit >  data.count) {
                    $scope.mycount.to = data.count;
                } else {
                    $scope.mycount.to = limit;
                }
                
            }

            // モーダルを閉じる
            if (modalflag) {
                modal.hide();
            }
            
         
        });
    };
    // MOREボタンをクリック
    $scope.moreList = function() {
        // オフセットを更新
        $scope.apiParam.offset = $scope.apiParam.offset + $scope.apiParam.limit;
        // 一覧を追加取得
        $scope.getList($scope.apiParam.limit, $scope.apiParam.offset, $scope.apiParam.sort, $scope.mrec.device_id, 1, true);
    };
    $scope.trustSrc = function(src) {
          return $sce.trustAsResourceUrl(src);
    };
    $scope.captureAudio = function() {
            console.log(111);
            navigator.device.capture.captureAudio($scope.captureSuccess, $scope.captureError,{limit: 1});
    };
    $scope.captureSuccess = function(media) {

            console.log(media[0].localURL);
            // 音声ファイルをモデルに設定
            $scope.mrec.recfile = media[0].localURL;

            // オーディオプレイヤー
            var media = new Media($scope.mrec.recfile, function(){}, function(){});
            media.play();   // 再生時間を取得するために再生
            
            // 再生時間を取得する
            var counter = 0;
            var timerDur = setInterval(function() {
                counter = counter + 100;
                if (counter > 2000) {
                    media.stop();
                    clearInterval(timerDur);
                    $scope.$apply();
                }
                $scope.playTime = media.getDuration();
                console.log($scope.playTime);
                if ($scope.playTime > 0) {
                    media.stop();
                    clearInterval(timerDur);
                    $scope.$apply();
                }
            }, 100);

            // 明示的にバインディングさせる
            //$scope.mrec.recfile = media[0].fullPath;
            // document.getElementById('mrec').style.display = "block";
            // document.getElementById("audio_preview").src = media[0].fullPath;
    };
    $scope.captureError = function(error) {
        var error_message = "不明なエラー";
        switch(error.code){
            case CaptureError.CAPTURE_INTERNAL_ERR:
                error_message = "カメラまたはマイクの画像やサウンドをキャプチャに失敗しました。";
                break;
            case CaptureError.CAPTURE_APPLICATION_BUSY:
                error_message = "現在カメラやオーディオのキャプチャのアプリケーションは別のキャプチャ要求を処理しています。";
                break;
            case CaptureError.CAPTURE_INVALID_ARGUMENT:
                error_message = "無効なAPIが使用されました。";
                break;
            case CaptureError.CAPTURE_NO_MEDIA_FILES:
                error_message = "キャプチャを開始する前にキャプチャが終了しました。";
                break;
            case CaptureError.CAPTURE_NOT_SUPPORTED:
                error_message = "要求されたキャプチャ操作はサポートされていません。";
                break;
        }
        // 録音に失敗
        navigator.notification.alert(
            error_message,
            null
            ,'録音'
        );
    };
    $scope.isInput = function() {
        var msg = [];
        var internal =  'Error';
        // デバイスIDチェック
        
        if ($scope.mrec.device_id == "") {
            msg.push("デバイスIDの取得に失敗しました。");
        }
        if ($scope.mrec.recfile == "") {
            msg.push("ものまねが録音されていません。");
        }
        if ($scope.mrec.title == "") {
            msg.push("タイトルを入力してください。");
        }
        if ($scope.mrec.title.length > 30) {
            msg.push("タイトルは30文字以内です。");
        }
        if ($scope.mrec.nicname.length > 30) {
            msg.push("ニックネームは30文字以内です。");
        }
        console.log($scope.mrec.recfile);
        if( msg.length > 0) {
            var error_message = msg.join('\n');
             // 録音に失敗
            navigator.notification.alert(
                error_message,
                null
                ,'エラー'
            );
            return false;
        } 
        return true;
    };
    $scope.Post = function() {
        
        // ネット接続チェック
        if (!$scope.networkCheck()) {
            return false;
        }
        
        // 入力チェック
        if (!$scope.isInput()) {
             return false;
        }
        // モーダルを表示
        modal.show();
        
        // プロミス配列
        var promise_arr = [];
        if(monaca.isAndroid === true){
            var pAudio = $scope.uploadFile($scope.mrec.recfile, 2, $scope.mrec.device_id, '3gpp');
        } else {
            var pAudio = $scope.uploadFile($scope.mrec.recfile, 2, $scope.mrec.device_id, 'wav');    
        }
        
        promise_arr.push(pAudio);
        if ($scope.mrec.imgfile == "") {
             $scope.mrec.imgfile = $scope.noimgfile;
        } else if ($scope.mrec.imgfile != $scope.noimgfile) {
            // 画像ファイルのアップロード
            var pImage = $scope.uploadFile($scope.mrec.imgfile, 1, $scope.mrec.device_id, "");
            promise_arr.push(pImage);
        }
        
        // ランキング登録
        var successCallback = function(resolveObj) { 
            console.log($.param($scope.mrec));
            
            $http({
                method : 'POST',
                url : 'http://api.local-c.com/mimicry/ranking/post',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            	data: $scope.mrec
            }).success(function(data, status, headers, config) {
                // モーダルを非表示
                modal.hide();
                // console.log(data);
                var options = {animation:'slide'};
                // MY RECを取得しなおす
                $scope.getMyList(30, 0, 9, $scope.mrec.device_id, 0, 1);
                // NEWも取り直す
                if ($scope.apiParam.sort == 2) {
                    $scope.getList(30, 0, 2, $scope.mrec.device_id, 0, 1);    
                }
                
                //myNavigator.pushPage('page1.html');
                ons.tabbar.setActiveTab(2);
                // 一覧をMYで取得しなおす
                

            }).error(function(data, status, headers, config) {
                console.log(data);
            	 console.log(status);
            });
          
        };
        var errorCallback = function(rejectObj) { 
            modal.hide();
            navigator.notification.alert(
                         '登録に失敗しました。',
                         null
                         ,'エラー'
            );     
            
        };
        var notifyCallback  = function(notifyObj) { /* TODO: */ };
        var finallyCallback = function() {
            /* TODO: */ 
        };

        // 音声ファイル、画像ファイルのアップロード 成功したらランキング登録
        $q.all(promise_arr).then(successCallback, errorCallback, notifyCallback).finally(finallyCallback);
        
        
        
       
    };
    // Upload files to server
    // type : 1:画像ファイル、2:音声ファイル
    $scope.uploadFile = function(mediaFile, type, device_id, ex) {
            var deferred = $q.defer();
            var ft = new FileTransfer();
            var path = mediaFile;
            //console.log(path);
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = mediaFile.substr(mediaFile.lastIndexOf('/') + 1);
            // options.mimeType = "audio/x-wav";
            // options.httpMethod = "POST";
            var params = {};
            params.type = type;
            params.filename = device_id;
            params.ex = ex;
            params.dir = 'mimicry';
            options.params = params;
        
            var upSuccess = function(result) {
                var data = JSON.parse(result.response);
                if (data.code == 200) {
                    if (data.type == 2) {
                        $scope.mrec.fileurl  = data.fileurl;
                        $scope.mrec.filename = data.filename;
                    } else {
                        $scope.mrec.imgpath  = data.fileurl;
                    }
                }
                deferred.resolve(data);
            };
            var upError = function(error) {
                var data = error.body;
                console.log(error);
                console.log("An error has occurred: Code = " + error.code);
                deferred.reject(data);
            };
            
            ft.upload(path,
                encodeURI("http://file.local-c.com/upload.php"),
                upSuccess,
                upError,
                options);
        
            return deferred.promise; 
    };
    
    $scope.snapPicture = function(type) {
        // カメラ撮影 or ライブラリ選択
        navigator.camera.getPicture (onSuccess, onFail, 
                { 
                    quality: 100, 
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: type,
                    allowEdit: true,
                    targetWidth: 100,
                    targetHeight: 100
                }
            );

        // 画像取得に成功
        function onSuccess (imageURI) {
            $scope.mrec.imgfile = imageURI;
            document.getElementById('picture').src = imageURI;
        }
        // 画像取得に失敗
        function onFail (message) {
             navigator.notification.alert(
                '選択されませんでした。',
                null
                ,'画像'
                );
        }
    };
    $scope.cnffirm = function() {
        function alertDismissed() {
            console.log(123);// 処理
        }
        navigator.notification.confirm(
            '', // メッセージ
             $scope.onConfirm,        // 押されたボタンのインデックスを使用して呼び出すコールバック
            'ものまね画像',           // タイトル
            ['ライブラリ','カメラ','キャンセル']   // ボタンのラベル名
        );
     };
    $scope.onConfirm = function(buttonIndex) {
        console.log(buttonIndex);
        if(buttonIndex == 1) {
            $scope.snapPicture(0);    
        } else if (buttonIndex == 2){
            $scope.snapPicture(1);    
        } else {
            return false;
        }
        
    };
    $scope.show = function(dlg) {
        if (!$scope.dialogs[dlg]) {
            ons.createDialog(dlg).then(function(dialog) {
            
                dialog.on("posthide", function(e) {
                      // console.log(1);
                      // console.log(e);
                      //e.cancel();
                });

                dialog.show();
                $scope.dialogs[dlg] = dialog;
            });
        } else {
            
            $scope.dialogs[dlg].show();
        }
    };
//    $scope.playId = 0;
    $scope.playrankingId = 0;
    $scope.mediaPlay = null;
    $scope.position = 0;
    $scope.sec = 0;
    $scope.playId = undefined;

    $scope.play = function (fileurl, rankingId){
        // ネット接続チェック
        if (!$scope.networkCheck()) {
            return false;
        }
        console.log(rankingId);
        if ($scope.playrankingId > 0 && $scope.playrankingId != rankingId) {
            console.log("★");
            $scope.initPlay2();
        }
        $scope.playrankingId = rankingId;
        //console.log($scope.playId);
        if ($scope.mediaPlay == null) {
            $scope.mediaPlay = new Media(fileurl, $scope.onSuccess, $scope.onError);
            $scope.playM(rankingId);
            // 再生時間を取得する
            var counter = 0;
            var timerDur = setInterval(function() {
                counter = counter + 100;
                if (counter > 15000) {
                    $scope.mediaPlay.stop();
                    clearInterval(timerDur);
                    $scope.sec = 0;
                    $scope.position = 0;

                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                       $scope.$apply();
                    }
                    navigator.notification.alert(
                      '再生に失敗しました。',     // メッセージ
                        null,        // コールバック
                        'エラー',    // タイトル
                        'OK'         // ボタンの表示名
                    );
                }
                
                $scope.sec = $scope.mediaPlay.getDuration();
                
                if ($scope.sec > 0) {
                    $scope.mediaPlay.stop();
                    clearInterval(timerDur);
                    $scope.$apply();
                    $scope.mediaPlay.play();
                    $scope.startTimer2();
                    $scope.playStatus(rankingId);
                }
            }, 100);
            
            $scope.mediaPlay.play();
            
        } else {
            $scope.playStatus(rankingId);
            $scope.playM(rankingId);
            $scope.mediaPlay.play();
            $scope.startTimer2();
        }
        
        // $scope.playStatus(rankingId);
        // $scope.playM(rankingId);
        // $scope.mediaPlay.play();
        // // 再生時間を取得する
        // var counter = 0;
        // var timerDur = setInterval(function() {
        //     counter = counter + 100;
        //     if (counter > 2000) {
        //         $scope.mediaPlay.stop();
        //         clearInterval(timerDur);
        //         $scope.$apply();
        //     }
        //     $scope.sec = $scope.mediaPlay.getDuration();
        //     console.log($scope.sec);
        //     if ($scope.sec > 0) {
        //         $scope.mediaPlay.stop();
        //         clearInterval(timerDur);
        //         $scope.$apply();
        //         $scope.mediaPlay.play();
        //         $scope.startTimer2();
        //     }
        // }, 100);
        
        
  
    };
    $scope.stop = function (){
        $scope.initPlay2();
    };
    // 録音したものまねを一時停止
    $scope.pause = function() {
        // 一時停止
        $scope.mediaPlay.pause();
        // インターバルをストップ
        clearInterval($scope.mediaTimer2);      
        
        console.log($scope.ctrlField == undefined);
        //console.log($scope.playId == undefined);
        // ボタンをPLAYにする
        //$scope.playStatus(undefined);
        //$scope.ctrlField = undefined;
        $scope.playStatus(undefined);
//        $scope.playId = undefined;
    
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
           $scope.$apply();
        }
      
    };    
    
    //
    $scope.playStatus = function(rankingId) {
        $scope.playId = rankingId;
    };   
    
    // ものまね再生コントローラー表示、非表示
    var isCtrlByPlay = function(rankingId) {
        return $scope.playId === rankingId;
    };
    $scope.isPlay = function(rankingId) {
        return isCtrlByPlay(rankingId);
    };    
     // インターバルで再生時間をセットしてやる
    $scope.startTimer2 = function() {
        $scope.mediaTimer2 = setInterval(function() {            
            
            // media の再生位置を取得
            $scope.mediaPlay.getCurrentPosition(
                // 呼び出し成功
                function(position) {
                    //console.log(position);
                    if (position > -1) {
                        $scope.setAudioPosition2(position);
                    } else {
                        
                        clearInterval($scope.mediaTimer2);
                        $scope.initPlay2();
                        $scope.$apply();
                    }
                },
                // 呼び出し失敗
                function(e) {
                    console.log("Error getting pos=" + e);
                    clearInterval($scope.mediaTimer2);
                    $scope.mediaPlay.stop();
                }
            );
        }, 100);
    };

    // 再生位置をセット
    $scope.setAudioPosition2 = function(position) {
        //console.log(Math.floor(((position * 1000) / ($scope.playTime * 1000)) * 100));
        $scope.position = position;
        //$scope.playRange = Math.floor(((position * 1000) / ($scope.playTime * 1000)) * 100);
        //console.log($scope.playRange);
        
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
             $scope.$apply();
        }
        //$scope.$apply();
    };
    // ものまねの再生を初期化
    $scope.initPlay2 = function() {
        $scope.sec = 0;
        $scope.position = 0;
        clearInterval($scope.mediaTimer2);
        $scope.playStatus(undefined);
        $scope.playM(undefined);
        // $scope.ctrlField = undefined;
        // $scope.playId = undefined;
        $scope.playrankingId = 0;
        if ($scope.mediaPlay != null) {
            $scope.mediaPlay.stop();
            $scope.mediaPlay = null;
        }
        //$scope.$apply();
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
             $scope.$apply();
        }
    };
    
    
});  


module.controller('mimicryCtrl', function($scope,$http) {
    
    $scope.mimicry.oneene = false;
    //http://api.local-c.com/mimicry/ranking/eene?rankingid=244&deviceid=C3823A42-589A-462B-A45D-D94A6A0ABBAE
    $scope.eeneOn = function(rankingId) {
        // ネット接続チェック
        if (!$scope.networkCheck()) {
            return false;
        }
        $scope.mimicry.eeneflg = 1;
        var url = $scope.apieeneURL + "?rankingid=" + rankingId + "&deviceid=" + $scope.mrec.device_id;
        $http.get(url).success(function(data) {
            
        });
    };
    $scope.eeneClear = function(rankingId) {
        // ネット接続チェック
        if (!$scope.networkCheck()) {
            return false;
        }
        
        $scope.mimicry.eeneflg = 0;
        var url = $scope.apieeneURL + "?rankingid=" + rankingId + "&deviceid=" + $scope.mrec.device_id + "&del=1";
        $http.get(url).success(function(data) {
            
        });
    };
    $scope.delm = function(rankingId) {
        
        var url = $scope.apideleteURL + rankingId;
        $http.get(url).success(function(data) {
            $scope.getMyList(30, 0, 9, $scope.mrec.device_id, 0, 1);
            
        });
    };
    $scope.share = function(rankingId, title, nicname) {
        // ネット接続チェック
        if (!$scope.networkCheck()) {
            return false;
        }
        
        if(monaca.isAndroid === true){
            window.plugins.share.show({
                    subject: 'Mimicry',
                    text: $scope.shareURL + rankingId
                },
                function() {}, // Success function
                function() {alert('シェアに失敗しました。')}
            );
        } else {
            alert($scope.shareURL + rankingId);
        }
    }
});

module.filter('substr', function() {
    return function(input, from, to) {
        // do some bounds checking here to ensure it has that index
        //return input.substring(from, to);
        var inputtext = String(input);
        return inputtext.substring(from, to);
        
    }
});

// module.controller('ctrName', ['$sce', function($sce) {
//   $scope.recordings = $sce.trustAsResourceUrl(recordings);
// }]);
// module.config( ['$compileProvider', function($compileProvider){   
//   $compileProvider.imgSrcSanitizationWhitelist(/^\s*(blob):/);
// 
//   // another sample to allow diffrent kinds of url in <a>
//   // $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto):/);
// }]);



module.run(function( $http ) {
  //  $http.get("http://api.local-c.com/mimicry/ranking/list?limit=20&offset=0").success(function( d ) {
    //console.log(d.result);
//    console.log(mimicryList);
    
  // });
});



