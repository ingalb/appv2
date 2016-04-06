angular.module('vllaznia.controllers', [])

.controller('AppCtrl', function($scope, $ionicPopup) {
   if(navigator.splashscreen){
      navigator.splashscreen.hide();
   }
})

    .filter('html',function($sce){
     return function(input){
        return $sce.trustAsHtml(input);
      }
    })

   .filter('indexData', function($filter){
     return function(input)
     {
       if(input == null){ return ""; }
       var value = input.split("+");
       var _date = $filter('date')(new Date(value[0]),'dd/MM/yyyy - HH:mm');
       return _date;
     };
    })

  .filter('orderObjectBy', function() {
   return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
     if(reverse) filtered.reverse();
      return filtered;
    };
  })

    .controller('IndexCtrl', function($scope, $ionicSlideBoxDelegate, $state, $timeout, $ionicLoading, $ionicPopup, LajmeService, $ionicModal, $rootScope, NdeshjetService) {
        var tani = new Date();
        var timerhide = 15000;
        ga_storage._trackPageview('#/app/index', 'Vllaznia App Index');
        if(navigator.splashscreen){
           navigator.splashscreen.hide();
        }
		
		if(admob){
           console.log("definito");
        }
		else{
			console.log("non definito!");
		}
		

        $scope.CloseNotification = function() {
           $scope.modal.hide();
          //notifica();
       };

       $ionicModal.fromTemplateUrl('modal.html', function($ionicModal) {
          $scope.modal = $ionicModal;
       }, {
       // Use our scope for the scope of the modal to keep it simple
       scope: $scope,
       // The animation we want to use for the modal entrance
       animation: 'slide-in-up'
       });

/*        var notifica = $rootScope.$on('pushEvent', function(event,message){
        // alert("Notification received:\n" + JSON.stringify(message));
         $scope.titulli=message.additionalData.title;
         $scope.teksti=message.message;
         //$scope.dati = JSON.stringify(message);
         $scope.modal.show();
       }); */
	   
	   var notifica = $rootScope.$on('pushEvent', function(event,message){
         console.log(JSON.stringify(message));
         $scope.titulli=message.additionalData.title;
         $scope.teksti=message.message;
         //$scope.dati = JSON.stringify(message);
		 //$scope.teksti=message.additionalData;
		 //console.log(JSON.stringify(message.additionalData));
		 var myVar = message.additionalData.page;
		 //console.log(myVar);
		 var pattern = /match/;
		//returns true or false...
		var exists = pattern.test(myVar);
		if(exists){
			//true statement, do whatever
			console.log(myVar.substr(5));
			$state.go('app.ndeshja', {ndeshjaId: parseInt(myVar.substr(5))} );

		}else{
			//false statement..do whatever
			if(myVar=="lajme")
			{$scope.lajmi = true;}
			$scope.modal.show();
		}
       });

        $scope.loadNdeshje = false;
        $scope.go = function ( path ) {
          //alert(path);
          $state.go('app.ndeshja', {ndeshjaId: path} );
        };
        $scope.loadingIndicator = $ionicLoading.show({
	         content: 'Loading Data',
	         animation: 'fade-in',
	         showBackdrop: true,
	         maxWidth: 200,
	         showDelay: 100
	        });
        LajmeService.getSlider(function(data) {
           // gaPlugin = window.plugins.gaPlugin;
           // gaPlugin.init(successHandler, errorHandler, "UA-2341193-8", 10);
           // console.log("slider");
            $scope.slider = data;
            $ionicLoading.hide();
            $ionicSlideBoxDelegate.update();
          //  admob.showBannerAd();
        });
        NdeshjetService.getSuperligaLastNdeshje(function(data) {
            //alert(tani);
            //$scope.items = data;
            $scope.items = data.slice(0,2);
            $ionicLoading.hide();
            $scope.loadNdeshje = true;
        });

       $scope.customArrayFilter = function (item) {
         //console.log(tani);
         d2 = new Date(tani.getTime()- 800000000);
        // d3 = new Date(tani.getTime() + 800000000);

         //console.log(d2);
         d1 = new Date(item.data);
         //$scope.data = d1;
         return ( d1>d2);
       };
	   
	  $scope.$on('$ionicView.beforeLeave', function(){
         $timeout.cancel(timer);
		 console.log("leave view");
		});
		
		$scope.$on('$ionicView.enter', function(){
	    	console.log("enter view");
			var update = function update() {
				timer = $timeout(update, 12000);
				NdeshjetService.getSuperligaLastNdeshje(function(data) {
				//console.log("new data");
				//$scope.items = data;
				$scope.items = data.slice(0,2);
				});
			}();
		});

      $timeout(function(){
        $ionicLoading.hide();
        //AdMob.showBanner(8);
		//window.admob.showBanner(admob.BannerSize.SMART_BANNER,admob.Position.BOTTOM_APP);
		//window.admob.showInterstitial();
		AdMob.showBannerAd(true);
		AdMob.showInterstitialAd();
		console.log("hide loading + show banner");
      },timerhide);

      })

    .controller('LajmeCtrl', function($scope, $sce, $timeout, $ionicLoading, LajmeService) {
      ga_storage._trackPageview('#/app/lajmet', 'Vllaznia App Lajmet');
	  $scope.anim = "ion-ios-bell-outline";
	  
      $scope.loadingIndicator = $ionicLoading.show({
	    content: 'Loading Data',
	    animation: 'fade-in',
	    showBackdrop: true,
	    maxWidth: 200,
	    showDelay: 100
	    });
		
	    var isSubscribed = function(){
		      window.plugins.OneSignal.getTags(function(tag) {
			     if(tag["news"]=="true")
			     {
				     $scope.notification = true;
				     $scope.anim = "ion-ios-bell";
			     }
			     else{
				     $scope.notification = false;
				     $scope.anim = "ion-ios-bell-outline";
			     }
		      });
	    }
		 
		isSubscribed();

      $scope.$on('$ionicView.enter', function(){
         isSubscribed();
      });

	    var subscribe = function(){
			$scope.notification = true;
			$scope.anim = "ion-ios-bell";
			window.plugins.OneSignal.setSubscription(true);
			window.plugins.OneSignal.sendTag("news",true);
		}
		var unSubscribe = function(){
			$scope.notification = false;
			$scope.anim = "ion-ios-bell-outline";
			window.plugins.OneSignal.deleteTag("news");
		}
        //FacebookAds.showInterstitial();
	    //admob.showBanner(admob.BannerSize.SMART_BANNER,admob.Position.BOTTOM_CENTER);
		//AdMob.showBanner(8);
		//window.admob.showBanner(admob.BannerSize.SMART_BANNER,admob.Position.BOTTOM_APP);
		admob.showBannerAd(true);
        LajmeService.getAll(function(data) {
            $scope.lajme = data;
            //console.log($scope.lajme);
            $ionicLoading.hide();
        });
		$scope.subNotification = function(){
			$scope.notification = $scope.notification === true ? false: true;
			if($scope.notification)
			{
				subscribe();
			}
			else{
				unSubscribe();
			}
	    }
        $scope.doRefresh = function() {
          LajmeService.getAll(function(data) {
			isSubscribed();
            $scope.lajme = data;
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
        });
       }
       $timeout(function(){
         $ionicLoading.hide();
       },10000);
    })

    .controller('LajmeDetCtrl', function($scope, $sce, $stateParams, $ionicLoading, LajmeService) {
        ga_storage._trackPageview('#/app/lajmi/'+ $stateParams.lajmiId+'', 'Vllaznia App Lajme Det');
        $scope.shareL = function(message, subject, image, link){
          ga_storage._trackEvent('Lajme', 'Share', subject);
          window.plugins.socialsharing.share(message, subject, image, link, this.onSuccess, this.onError);
        }
        $scope.loadingIndicator = $ionicLoading.show({
			content: 'Loading Data',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 100
	    });
        $scope.lajmi = LajmeService.getId($stateParams.lajmiId);
        $ionicLoading.hide();
		
		/* AdMob.prepareInterstitial({
			adId: 'ca-app-pub-7925487268042880/6932118769',
			autoShow: true
		}); */
		//AdMob.prepareInterstitial('ca-app-pub-7925487268042880/6932118769');
        //AdMob.showInterstitial();
		//window.admob.cacheInterstitial();
		//window.admob.showInterstitial();
		admob.requestInterstitialAd();
		admob.showInterstitialAd();
		
		$scope.showAds = function()
		{
			//window.admob.cacheInterstitial();
			//window.admob.showInterstitial();
			admob.requestInterstitialAd();
			admob.showInterstitialAd();
			
/* 			AdMob.prepareInterstitial({
				adId: admobid.interstitial,
				autoShow: true
			}); */
		}
    })

    .controller('NdeshjetCtrl', function($scope, $sce, $timeout, $ionicLoading, $ionicBackdrop, $ionicPopover, NdeshjetService) {
      ga_storage._trackPageview('#/app/ndeshjet', 'Vllaznia App Ndeshjet');

      $scope.clubId = 13;

      $scope.SezoneList = [
        { text: "Superliga 2015-16", value: 105 },
        { text: "Superliga 2014-15", value: 100 },
        { text: "Superliga 2013-14", value: 97 },
        { text: "Superliga 2012-13", value: 86 },
        { text: "Superliga 2011-12", value: 79 },
        { text: "Superliga 2010-11", value: 15 },
        { text: "Superliga 2009-10", value: 10 },
       ];

      //admob.showBannerAd(true);
      $scope.sezoni_id = $scope.SezoneList[0].value;
      $scope.sezoni_text = $scope.SezoneList[0].text;

      $scope.loadingIndicator = $ionicLoading.show({
	    content: 'Loading Data',
	    animation: 'fade-in',
	    showBackdrop: true,
	    maxWidth: 200,
	    showDelay: 500
	   });

     $ionicPopover.fromTemplateUrl('popover-template.html', {
        scope: $scope,
      }).then(function(popover) {
        $scope.popover = popover;
      });

      $scope.changeSezoni = function(item) {
        $scope.sezoni_text = item.text;
        $scope.sezoni_id = item.value;
        $scope.popover.hide();
        //$scope.loadingIndicator.show;
        $ionicBackdrop.retain();
        NdeshjetService.getAllNdeshjet($scope.sezoni_id, $scope.clubId, function(data) {
            $scope.items = data;
			//console.log(data.length);
            //selectPopup.close();
            $scope.popover.hide();
            $ionicBackdrop.release();
        });
      };

     NdeshjetService.getAllNdeshjet($scope.sezoni_id, $scope.clubId, function(data) {
            $scope.items = data;
            $ionicLoading.hide();
        });
        $timeout(function(){
          $ionicLoading.hide();
        },5000);
      })

     .controller('NdeshjetDetCtrl', function($scope, $sce, $stateParams, $timeout, $ionicNavBarDelegate, $ionicScrollDelegate, $ionicSlideBoxDelegate, $ionicLoading, NdeshjaService) {
       ga_storage._trackPageview('#/app/ndeshja/'+ $stateParams.ndeshjaId+'', 'Vllaznia App Ndeshja Det');
       var tani = new Date();
       var time = 1;
       var d1, minuti, percenti;
       //$scope.minuta = "minuta";
       //admob.showBannerAd(false);
       $scope.selected = 0;
	   $scope.notification = false;
	   $scope.anim = "ion-ios-bell-outline";
	   //console.log($scope.notification);
	   var tags = "match"+ $stateParams.ndeshjaId;
       console.log('User Tag: '+tags);
	   var isSubscribed = function(tags){
		  window.plugins.OneSignal.getTags(function(tag) {
			if(tag[tags]=="true" && tag["match"]=="true")
			{
				$scope.notification = true;
				$scope.anim = "ion-ios-bell";
			}
			else{
				$scope.notification = false;
				$scope.anim = "ion-ios-bell-outline";
			}
		  });
	    }
	   isSubscribed(tags);
	   var subscribe = function(tags){
		console.log("sub called");
		console.log(tags);
		$scope.notification = true;
		$scope.anim = "ion-ios-bell";
		window.plugins.OneSignal.setSubscription(true);
		window.plugins.OneSignal.sendTag("match",true);
		window.plugins.OneSignal.sendTag(tags,true);
	   }
	   var unSubscribe = function(tags){
		console.log("unsub called");
		console.log(tags);
		$scope.notification = false;
		$scope.anim = "ion-ios-bell-outline";
		window.plugins.OneSignal.deleteTag(tags);
	   } 
       $scope.loadingIndicator = $ionicLoading.show({
	        content: 'Loading Data',
	        animation: 'fade-in',
	        showBackdrop: true,
	        maxWidth: 200,
	        showDelay: 100
	    });
       $scope.percent = Math.floor(time/90*100);
       $scope.percenti=time;
       $scope.options = {
            animate:{
                duration:1000,
                enabled:true
            },
            barColor:'#cc3333',
            scaleColor:'#ddd',
            lineWidth:3,
            lineCap:'round',
            size:'60'
        };

		$scope.$on('$ionicView.beforeLeave', function(){
         $timeout.cancel(timer);
		 console.log("leave view");
		});

		$scope.$on('$ionicView.enter', function(){
	    	console.log("enter view");
			var update = function update() {
				timer = $timeout(update, 59000);
				isSubscribed(tags);
				NdeshjaService.getReport($stateParams.ndeshjaId, function(data) {
					$scope.item = data;
					$scope.content = data.kronika;
					$scope.percent = data.percent;
					$ionicNavBarDelegate.title(data.java);
					$ionicSlideBoxDelegate.update();
					$ionicScrollDelegate.resize();
					$ionicLoading.hide();
				});
			}();
		});
       $scope.slideTo = function(index) {
          $ionicSlideBoxDelegate.slide(index);
          $scope.selected = index;
          $ionicSlideBoxDelegate.update();
          $ionicScrollDelegate.resize();
          $ionicScrollDelegate.scrollTop(true);
       }
	   $scope.slideNext = function() {
          $ionicSlideBoxDelegate.next();
          $ionicSlideBoxDelegate.update();
          $ionicScrollDelegate.resize();
       }
	   $scope.slidePrevious = function() {
          $ionicSlideBoxDelegate.previous();
          $ionicSlideBoxDelegate.update();
          $ionicScrollDelegate.resize();
       }

	    $scope.subNotification = function(){
		   $scope.notification = $scope.notification === true ? false: true;
		   var tag = "match"+ $stateParams.ndeshjaId;
		   if($scope.notification)
		   {
			    console.log("sub");
		        console.log(tag);
				subscribe(tag);
		   }
		   else{
			    console.log("unsub");
		        console.log(tag);
				unSubscribe(tag);
		   }
	    }
       $scope.doRefresh = function() {
         $scope.loadingIndicator = $ionicLoading.show({
	          content: 'Loading Data',
	           animation: 'fade-in',
	           showBackdrop: true,
	           maxWidth: 200,
	           showDelay: 100
	       });
       NdeshjaService.getReport($stateParams.ndeshjaId, function(data) {
            tani = new Date();
            $scope.item = data;
            $scope.content = data.kronika;
            $scope.percent = data.percent;
            $ionicNavBarDelegate.title(data.java);
			isSubscribed(tags);
            $scope.$broadcast('scroll.refreshComplete');
            $ionicScrollDelegate.resize();
            $ionicScrollDelegate.scrollTop(true);
            $ionicSlideBoxDelegate.update();
            $ionicLoading.hide();
        });
       }
    })


    .controller('KlasifikimiCtrl', function($scope, $stateParams, $timeout, $ionicLoading, $ionicBackdrop, KlasifikimiService, $ionicPopover) {
     ga_storage._trackPageview('#/app/klasifikimi', 'Vllaznia App Klasifikimi');
     var titulliPop = "Zgjidh kampionatin";
     $scope.SezoneList = [
       { text: "Superliga 2015-16", value: 105 },
       { text: "Superliga 2014-15", value: 100 },
       { text: "Superliga 2013-14", value: 97 },
       { text: "Superliga 2012-13", value: 86 },
       { text: "Superliga 2011-12", value: 79 },
       { text: "Superliga 2010-11", value: 15 },
       { text: "Superliga 2009-10", value: 10 },
      ];

       $scope.loadingIndicator = $ionicLoading.show({
	         content: 'Loading Data',
	         animation: 'fade-in',
	         showBackdrop: true,
	         maxWidth: 200,
	         showDelay: 500
	     });

       $ionicPopover.fromTemplateUrl('popover-template.html', {
          scope: $scope,
        }).then(function(popover) {
          $scope.popover = popover;
        });

       // $scope.sezoni = "2014-15";
       // $scope.sezoni_id = 100;
       $scope.sezoni_id = $scope.SezoneList[0].value;
       $scope.sezoni_text = $scope.SezoneList[0].text;

       KlasifikimiService.getAllKlasifikimi($scope.sezoni_id,function(data) {
            $scope.items = data;
            $ionicLoading.hide();
        });

        // An alert dialog for change seson
/**        $scope.selectKamp = function() {
          var selectPopup = $ionicPopup.alert({
            title: titulliPop,
            templateUrl: 'popup-template.html',
            scope: $scope,
          });
          selectPopup.then(function(res) {
            KlasifikimiService.getAllKlasifikimi($scope.sezoni_id, function(data) {
              $scope.items = data;
            });
          });
        };
**/
      $scope.changeSezoni = function(item) {
        $scope.sezoni_text = item.text;
        $scope.sezoni_id = item.value;
        $scope.popover.hide();
        $ionicBackdrop.retain();
        KlasifikimiService.getAllKlasifikimi($scope.sezoni_id,function(data) {
            $scope.items = data;
            //selectPopup.close();
          //$scope.popover.hide();
            $ionicBackdrop.release();
        });
      };


        $timeout(function(){
          $ionicLoading.hide();
          //selectPopup.close();
          $scope.popover.hide();
        //  $ionicBackdrop.release();
        },6000);

    })

    .controller('KlasifikimiDetCtrl', function($scope, $stateParams, KlasifikimiService) {
        $scope.item = KlasifikimiService.get($stateParams.klasifikimiId);
    })

    .controller('LojtaretCtrl', function($scope, $timeout, $stateParams, $ionicLoading, EkipiService) {
        ga_storage._trackPageview('#/app/ekipi', 'Vllaznia App Ekipi');
        $scope.sezoni_id ='superliga';
        $scope.ekipiId =13;
        $scope.loadingIndicator = $ionicLoading.show({
	         content: 'Loading Data',
	         animation: 'fade-in',
	         showBackdrop: true,
	         maxWidth: 200,
	         showDelay: 500
	      });
        EkipiService.getAllEkipi($scope.sezoni_id,$scope.ekipiId, function(data) {
            $scope.items = data;
			//console.log(data);
            $ionicLoading.hide();
        });
        $timeout(function(){
          $ionicLoading.hide();
        },6000);
    })

    .controller('LojtaretDetCtrl', function($scope, $stateParams, $timeout, $ionicLoading, EkipiService) {
        ga_storage._trackPageview('#/app/ekipi/'+ $stateParams.lojtariId+'', 'Vllaznia App Lojtari Det');
        //alert($stateParams.lojtariId);
        //$scope.playerID = 1;
       //$scope.item.pid = 1;
        //console.log($stateParams.lojtariId);
        $scope.anim="";
        $scope.loadingIndicator = $ionicLoading.show({
	         content: 'Loading Data',
	         animation: 'fade-in',
	         showBackdrop: true,
	         maxWidth: 200,
	         showDelay: 50
	      });
        $scope.item = EkipiService.get($stateParams.lojtariId);
        $ionicLoading.hide();
        //console.log($scope.item.pid);
        $scope.lojtariN = function(numri){
          if($scope.anim === "slideUp")
             $scope.anim = "slideDown";
         else
            $scope.anim = "slideUp";
          // $scope.anim="slideLeft";
           numri = $scope.item.pid +1;
           if(numri>25){numri=1;
            $scope.item.pid=1;}
           $scope.item = EkipiService.get(numri);
           $ionicLoading.hide();
           //console.log($scope.item.pid);
           //numri = $scope.item.pid;
          // $scope.playerID = index+1;
         }
         $scope.lojtariP = function(numri){
           if($scope.anim === "slideUp")
             $scope.anim = "slideDown";
           else
            $scope.anim = "slideUp";
           numri = $scope.item.pid - 1;
           if(numri<1){numri=25;
           $scope.item.pid=25;}
           $scope.item = EkipiService.get(numri);
           $ionicLoading.hide();
          // console.log($scope.item.pid);
           //numri = $scope.item.pid;
          // $scope.playerID = index+1;
         }
         $timeout(function(){
           $ionicLoading.hide();
         },6000);
    })


  .controller('KlubiCtrl', function($scope, $ionicLoading, $ionicSlideBoxDelegate, $ionicScrollDelegate) {
        ga_storage._trackPageview('#/app/klubi', 'Vllaznia App Klubi');
        $scope.title="Klubi";
        $scope.slideHasChanged = function(){
          $ionicScrollDelegate.resize();
          $ionicSlideBoxDelegate.update();
          $ionicScrollDelegate.scrollTop(true);
		  //$ionicScrollDelegate.scrollBy(0, 100);
         }
        $scope.slideTo = function(index) {
          if(index){
          $scope.title="Trofetë";
          $ionicSlideBoxDelegate.slide(index);
          $ionicScrollDelegate.resize();
          $ionicSlideBoxDelegate.update();
		  //$ionicScrollDelegate.scrollBy(0, 100);
          $ionicScrollDelegate.scrollTop(true);
          }
          else{
          $scope.title="Historia";
          $ionicSlideBoxDelegate.slide(index);
          $ionicScrollDelegate.resize();
          $ionicSlideBoxDelegate.update();
		  $ionicScrollDelegate.scrollBy(0, 100);
          //$ionicScrollDelegate.scrollTop(true);
          }
          $ionicSlideBoxDelegate.slide(index);
          $ionicScrollDelegate.resize();
          $ionicSlideBoxDelegate.update();
		  //$ionicScrollDelegate.scrollBy(0, 100);
          $ionicScrollDelegate.scrollTop(true);
       }
    })


    .controller('TvCtrl', function($scope) {
		ga_storage._trackPageview('#/app/tv', 'Vllaznia App TV');
/*         AdMob.prepareInterstitial({
			adId: 'ca-app-pub-7925487268042880/6932118769',
			autoShow: true
		});
        AdMob.showInterstitial(); */
		
		//window.admob.cacheInterstitial();
		//window.adMob.showInterstitial();
		admob.requestInterstitialAd();
		admob.showInterstitialAd();
		
        $scope.browse = function(v){
          ga_storage._trackEvent('TV', 'Play', v);
            window.open(v, "_system", "location=yes");
        }
    })

   .controller('ForumiCtrl', function($scope, $timeout, $ionicLoading, ForumiService) {
        ga_storage._trackPageview('#/app/forumi', 'Vllaznia App Forumi');
        $scope.loadingIndicator = $ionicLoading.show({
	         content: 'Loading Data',
	         animation: 'fade-in',
	         showBackdrop: true,
	         maxWidth: 200,
	         showDelay: 10
	      });
        ForumiService.getAllPostimet(function(data) {
            $scope.posts = data;
            $ionicLoading.hide();
        });
        $scope.browse = function(v) {
          ga_storage._trackEvent('Forumi', 'Read', v);
          window.open(v, "_system", "location=yes");
        }
        $timeout(function(){
          $ionicLoading.hide();
        },6000);
    });
