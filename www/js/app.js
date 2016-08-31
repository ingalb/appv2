var URL_APP_TEST = "http://api1.ingalb.info/";
var URL_APP = "http://api.albaniasoccer.com/";
// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('vllaznia', ['ionic', 'vllaznia.services', 'vllaznia.controllers', 'easypiechart', 'ngSanitize'])
//angular.module('starter', ['angular-carousel'])

.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    var admobid = {};
    try{

        ga_storage._setAccount('UA-2341193-9');
        ga_storage._trackPageview('#/app/appJS24', 'Vllaznia App Js Android v2.4');
		navigator.splashscreen.hide();
       
	    //Android
	    admobid = { 
          banner: 'ca-app-pub-7925487268042880/6770099564',
          interstitial: 'ca-app-pub-7925487268042880/7097196767'
        };
		
		//IOS
		/* admobid = { 
          banner: 'ca-app-pub-7925487268042880/5455385567',
          interstitial: 'ca-app-pub-7925487268042880/6932118769'
        }; */
	   

   /** window.admob.initAdmob("ca-app-pub-7925487268042880/6770099564","ca-app-pub-7925487268042880/7097196767");
	window.admob.showBanner(admob.BannerSize.SMART_BANNER,admob.Position.BOTTOM_APP);
	window.admob.cacheInterstitial();
	**/

 	AdMob.setOptions({
      publisherId: admobid.banner,
      interstitialAdId: admobid.interstitial,
      bannerAtTop: false, // set to true, to put banner at top
      overlap: false, // set to true, to allow banner overlap webview
      offsetStatusBar: true, // set to true to avoid ios7 status bar overlap
      isTesting: false, // receiving test ads (do not test with real ads as your account will be banned)
      autoShowBanner: true, // auto show banners ad when loaded
      autoShowInterstitial: false // auto show interstitials ad when loaded
    });
	
/* 	AdMob.setOptions({
		publisherId: admobid.banner,
		interstitialAdId: admobid.interstitial,
		bannerAtTop: false,  // set to true, to put banner at top 
		overlap: true,  // set to true, to allow banner overlap webview 
		offsetTopBar: false,  // set to true to avoid ios7 status bar overlap 
		isTesting: false,  // receiving test ad 
		autoShow: false,  // auto show interstitial ad when loaded 
	}); */
	
	//AdMob.createBannerView();

	/* AdMob.prepareInterstitial({
      adId: admobid.interstitial,
      autoShow: false,
    }); */
    // Request interstitial (will present automatically when autoShowInterstitial is set to true)
    //AdMob.requestInterstitialAd();
	
	
 	AdMob.createBanner( {
        adId: admobid.banner, 
        isTesting: false,
        overlap: false, 
        offsetTopBar: false, 
        position: AdMob.AD_POSITION.BOTTOM_CENTER,
        bgColor: 'red'
    } );
    
    AdMob.prepareInterstitial({
        adId: admobid.interstitial,
        autoShow: false
    });

    } catch (e) {
        console.log(e.message);
    }
	
	/**window.admob.isInterstitialReady(function(isReady){
		if(isReady){
			console.log("admob Interstitial loaded");
		}
	});
	**/	
    var notificationOpenedCallback = function(jsonData) {
      //alert("Notification received:\n" + JSON.stringify(jsonData));
      //console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
      // firing an event downwards
      $rootScope.$broadcast('pushEvent', jsonData);
    };
		
    //window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
	
    // Update with your OneSignal AppId and googleProjectNumber before running.
    window.plugins.OneSignal.init("fb965b9c-e77a-11e4-a9ea-97388ec7efa9",
                                   {googleProjectNumber: "455582282730"},
                                   notificationOpenedCallback);

    window.plugins.OneSignal.sendTags({app: "v2.4", news: "true"});
	window.plugins.OneSignal.setSubscription(true);
	window.plugins.OneSignal.enableInAppAlertNotification(true);
	
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

    /* document.addEventListener("admob.Event.onInterstitialReceive", function() {
        console.log("The application is recieve interstial ready");
		window.admob.showInterstitial();
    }, false); */

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
	
	.state('app.kupa', {
      url: "/kupa",
      views: {
        'menuContent' :{
          templateUrl: "templates/kupa.html",
          controller: 'KupaCtrl'
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
