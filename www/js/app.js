// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('vllaznia', ['ionic', 'vllaznia.services', 'vllaznia.controllers', 'easypiechart', 'ngSanitize', 'admobModule'])
//angular.module('starter', ['angular-carousel'])

.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    var admobid = {};
    try{

        ga_storage._setAccount('UA-2341193-9');
        ga_storage._trackPageview('#/app/appJS', 'Vllaznia App Js IOS');
		navigator.splashscreen.hide();
       
	    admobid = { 
            banner: 'ca-app-pub-7925487268042880/6770099564',
            interstitial: 'ca-app-pub-7925487268042880/7097196767'
        };
	   

    //admob.initAdmob("ca-app-pub-7925487268042880/9744485565","ca-app-pub-7925487268042880/3804502366");
	//admob.showBanner(admob.BannerSize.SMART_BANNER,admob.Position.BOTTOM_APP);
	//admob.cacheInterstitial();

	
	AdMob.createBanner( {
        adId: admobid.banner, 
        isTesting: false,
        overlap: false, 
        offsetTopBar: false, 
        position: AdMob.AD_POSITION.BOTTOM_CENTER,
        bgColor: 'black'
    } );
    
    AdMob.prepareInterstitial({
        adId: admobid.interstitial,
        autoShow: true
    });

    } catch (e) {
          console.log(e.message);
    }

    var notificationOpenedCallback = function(jsonData) {
      //alert("Notification received:\n" + JSON.stringify(jsonData));
      //console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
      // firing an event downwards
      $rootScope.$broadcast('pushEvent', jsonData);
    };

    // Update with your OneSignal AppId and googleProjectNumber before running.
    window.plugins.OneSignal.init("fb965b9c-e77a-11e4-a9ea-97388ec7efa9",
                                   {googleProjectNumber: "455582282730"},
                                   notificationOpenedCallback);

     window.plugins.OneSignal.sendTags({app: "v3", news: "true"});
/*
window.plugins.OneSignal.init("fb965b9c-e77a-11e4-a9ea-97388ec7efa9",
                       {googleProjectNumber: "455582282730"},
                       didReceiveRemoteNotificationCallBack);


window.plugins.OneSignal.getIds(function(ids) {
    console.log('getIds: ' + JSON.stringify(ids)); // I can see PushToken and UserId in the console.
    window.localStorage["notification"] = JSON.stringify(jsonData);
    //$rootScope.pushToken = ids.pushToken;
});
*/

/*    window.didReceiveRemoteNotificationCallBack = function(jsonData) {
        alert("Notification received:\n" + JSON.stringify(jsonData));
        window.localStorage["notification"] = JSON.stringify(jsonData);
        console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
    }
*/


    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })
    .state('app.index', {
      url: "/index",
      views: {
        'menuContent' :{
          templateUrl: "templates/index.html",
          controller: 'IndexCtrl'
        }
      }
    })

    .state('app.lajmet', {
      url: "/lajmet",
      views: {
        'menuContent' :{
          templateUrl: "templates/lajmet.html",
          controller: 'LajmeCtrl'
        }
      }
    })
    .state('app.lajmi', {
      url: "/lajmi/:lajmiId",
      views: {
        'menuContent' :{
          templateUrl: "templates/lajmet-detaje.html",
          controller: 'LajmeDetCtrl'
        }
      }
    })
    .state('app.ndeshjet', {
      url: "/ndeshjet",
      views: {
        'menuContent' :{
          templateUrl: "templates/ndeshjet.html",
          controller: 'NdeshjetCtrl'
        }
      }
    })
    .state('app.ndeshja', {
      url: "/ndeshja/:ndeshjaId",
      views: {
        'menuContent' :{
          templateUrl: "templates/ndeshja.html",
          controller: 'NdeshjetDetCtrl'
        }
      }
    })

    .state('app.klubi', {
      url: "/klubi",
      views: {
        'menuContent' :{
          templateUrl: "templates/klubi.html",
          controller: 'KlubiCtrl'
        }
      }
    })
    .state('app.tv', {
      url: "/tv",
      views: {
        'menuContent' :{
          templateUrl: "templates/tv.html",
          controller: 'TvCtrl'
        }
      }
    })
    .state('app.forumi', {
      url: "/forumi",
      views: {
        'menuContent' :{
          templateUrl: "templates/forumi.html",
          controller: 'ForumiCtrl'
        }
      }
    })
    .state('app.multimedia', {
      url: "/multimedia",
      views: {
        'menuContent' :{
          templateUrl: "templates/multimedia.html"
        }
      }
    })
    .state('app.klasifikimi', {
      url: "/klasifikimi",
      views: {
        'menuContent' :{
          templateUrl: "templates/klasifikimi.html",
          controller: 'KlasifikimiCtrl'
        }
      }
    })
    .state('app.klasifikimidet', {
      url: "/klasifikimidet/:klasifikimiId",
      views: {
        'menuContent' :{
          templateUrl: "templates/klasifikimidet.html",
          controller: 'KlasifikimiDetCtrl'
        }
      }
    })
    .state('app.ekipi', {
      url: "/ekipi",
      views: {
        'menuContent' :{
          templateUrl: "templates/lojtaret.html",
          controller: 'LojtaretCtrl'
        }
      }
    })

   .state('app.credits', {
      url: "/credits",
      views: {
        'menuContent' :{
          templateUrl: "templates/credits.html"
        }
      }
    })

    .state('app.lojtari', {
      url: "/ekipi/:lojtariId",
      views: {
        'menuContent' :{
          templateUrl: "templates/lojtari.html",
          controller: 'LojtaretDetCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/index');
});
