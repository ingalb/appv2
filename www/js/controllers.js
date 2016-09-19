angular.module('vllaznia.controllers', [])

.controller('AppCtrl', function($scope, $ionicPopup) {
   if(navigator.splashscreen){
      navigator.splashscreen.hide();
   }
})

    .filter('matchData', function($filter){
     return function(input)
     {
       if(input == null){ return ""; }
       var value = input.split("+");
       var _date = $filter('date')(new Date(value[0]),'dd MMM HH:mm');
       return _date;
     };
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
	
    .filter('matchData1', function($filter){
     return function(input)
     {
       if(input == null){ return ""; }
       var value = input.split("+");
       var _date = $filter('date')(new Date(value[0]),'dd MMM');
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
        var timerhide = 5000;
        ga_storage._trackPageview('#/app/index', 'Vllaznia App Index v2.4');
        if(navigator.splashscreen){
           navigator.splashscreen.hide();
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
				$scope.items = data.slice(0,3);
				//displayInterstial();
				});
			}();
		});

	    var displayInterstial = function(){
			var deviceName = device.model;
			console.log(deviceName);
			var pattern0 = /(GT-I9508|Nexus 5|nexus 5|SM-G920|SM-G925|SM-G93|SM-G90|GT-I95)/;
			//returns true or false...
			var exists0 = pattern0.test(deviceName);
			if(!exists0)
			{
				ga_storage._trackEvent('Admob', 'Show', deviceName);
				//AdMob.showInterstitial();
				window.plugins.AdMob.showInterstitialAd(true, 
          			function(){},
          			function(e){console.log(JSON.stringify(e));}
        			);
			}
            else{
	            ga_storage._trackEvent('Admob', 'Dontshow', deviceName);
            }			
		};
	  
      $timeout(function(){
        $ionicLoading.hide();
        //AdMob.showBanner(8);
		//admob.showBanner(admob.BannerSize.SMART_BANNER,admob.Position.BOTTOM_APP);
		//window.admob.showBanner(admob.BannerSize.SMART_BANNER,admob.Position.BOTTOM_APP);
		//window.admob.showInterstitial();
		//window.AdMob.showBannerAd();
		//AdMob.showInterstitialAd();
		//if(AdMob) AdMob.showInterstitial();
		console.log("hide loading + show banner");
		displayInterstial();
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
		//AdMob.showBannerAd();
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
		ga_storage._trackPageview('#/app/lajmi/'+ $scope.lajmi.id+'', $scope.lajmi.title);
		//console.log($scope.lajmi);
        $ionicLoading.hide();
		
	/**	AdMob.prepareInterstitial({
			adId: 'ca-app-pub-7925487268042880/6932118769',
			autoShow: false
		});
	**/
		window.plugins.AdMob.createInterstitialView();
		
		$scope.$on('$ionicView.enter', function(){
			displayInterstial();
        });
				
		var displayInterstial = function(){  
			var deviceName = device.model;
			var pattern0 = /(GT-I9508|Nexus 5|nexus 5|SM-G920|SM-G925|SM-G93|SM-G90|GT-I95)/;
			//returns true or false...
			var exists0 = pattern0.test(deviceName);
			console.log(deviceName);
			if(!exists0)
			{
                console.log("show interstial");	
                ga_storage._trackEvent('AdmobL', 'ShowL', deviceName);
                window.plugins.AdMob.showInterstitialAd(true, 
          			function(){},
          			function(e){console.log(JSON.stringify(e));}
        			);				
			}
            else{
	            ga_storage._trackEvent('AdmobL', 'DontshowL', deviceName);				
            }			
		};
		
		//AdMob.prepareInterstitial('ca-app-pub-7925487268042880/6932118769');
        //AdMob.showInterstitial();
		//window.admob.cacheInterstitial();
		//window.admob.showInterstitial();
		//admob.requestInterstitialAd();
		//AdMob.showInterstitialAd();
		
		$scope.showAds = function()
		{
			//window.admob.cacheInterstitial();
			//window.admob.showInterstitial();
			/* admob.requestInterstitialAd();
			admob.showInterstitialAd(); */
			
			/* AdMob.prepareInterstitial({
				adId: admobid.interstitial,
				autoShow: true
			}); */
		}
    })

    .controller('NdeshjetCtrl', function($scope, $sce, $timeout, $ionicLoading, $ionicBackdrop, $ionicPopover, $ionicScrollDelegate, $location, NdeshjetService, ProjectService) {
      ga_storage._trackPageview('#/app/ndeshjet', 'Vllaznia App Ndeshjet');

      $scope.clubId = 13;
      $scope.start_val_id = 0;
      $scope.SezoneListS = [
	    { text: "Superliga 2016-17", value: 111 },
        { text: "Superliga 2015-16", value: 105 },
        { text: "Superliga 2014-15", value: 100 },
        { text: "Superliga 2013-14", value: 97 },
        { text: "Superliga 2012-13", value: 86 },
        { text: "Superliga 2011-12", value: 79 },
        { text: "Superliga 2010-11", value: 15 },
        { text: "Superliga 2009-10", value: 10 }
       ]; 
	   
	  $scope.sezoni_id = $scope.SezoneListS[$scope.start_val_id].value;
      $scope.sezoni_text = $scope.SezoneListS[$scope.start_val_id].text;
	  
	  /**ProjectService.getSuperligaProjects(function(data) {
		  $scope.SezoneListS = data;
	  });
	  **/
	  $scope.$on('$ionicView.Enter', function(){
	    //console.log("enter view");
		$ionicBackdrop.retain();
		$ionicLoading.show();
		ProjectService.getSuperligaProjects(function(data) {
		  $scope.SezoneListS = data;
		  $scope.sezoni_id = $scope.SezoneListS[$scope.start_val_id].value;
          $scope.sezoni_text = $scope.SezoneListS[$scope.start_val_id].text;
		  NdeshjetService.getAllNdeshjet($scope.sezoni_id, $scope.clubId, function(data) {
            $scope.items = data;
			var current = data[0].current_round - 1;
			//var scrollto = current *130;
            $ionicLoading.hide();
			$ionicBackdrop.release();
			
			//location = $location.hash(location);
			//$ionicScrollDelegate.$getByHandle('mainScroll').anchorScroll("#"+location);
			//console.log($location.hash(location));
			//$ionicScrollDelegate.scrollBy(0,(current *130), true);
			$scope.ScrollTo("ndeshja-"+current);
		  });
	    });
	   });

        $scope.ScrollTo = function(location) {
              location = $location.hash(location);
              //console.log('scrolling to: '+location);
              $ionicScrollDelegate.$getByHandle('mainScroll').anchorScroll("#"+location);
        };

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

      $scope.changeSezoni = function(item, index) {
		$scope.start_val_id = index;
        $scope.sezoni_text = item.text;
        $scope.sezoni_id = item.value;
        $scope.popover.hide();
		$ionicLoading.show();
        //$scope.loadingIndicator.show;
        $ionicBackdrop.retain();
        NdeshjetService.getAllNdeshjet($scope.sezoni_id, $scope.clubId, function(data) {
            $scope.items = data;
			var current = data[0].current_round - 1;
			//console.log(data.length);
            //selectPopup.close();
			$ionicLoading.hide();
            $scope.popover.hide();
            $ionicBackdrop.release();
			//$ionicScrollDelegate.scrollBy(0,(current *130), true);
			$scope.ScrollTo("ndeshja-"+current);
        });
      };

     NdeshjetService.getAllNdeshjet($scope.sezoni_id, $scope.clubId, function(data) {
            $scope.items = data;
            $ionicLoading.hide();
        });
     $timeout(function(){
          $ionicLoading.hide();
        },15000);
      })

	.controller('KupaCtrl', function($scope, $sce, $timeout, $ionicLoading, $ionicBackdrop, $ionicPopover, $ionicScrollDelegate, $location, NdeshjetService, ProjectService) {
      ga_storage._trackPageview('#/app/ndeshjet', 'Vllaznia App Ndeshjet Kupa');

      $scope.clubId = 13;
      $scope.start_val_id = 0;
      $scope.SezoneList = [
	    { text: "Kupa e Shqiperise 2016-17", value: 113 },
        { text: "Kupa e Shqiperise 2015-16", value: 106 },
        { text: "Kupa e Shqiperise 2014-15", value: 104 },
        { text: "Kupa e Shqiperise 2013-14", value: 99 },
        { text: "Kupa e Shqiperise 2011-12", value: 83 },
        { text: "Kupa e Shqiperise 2010-11", value: 13 },
        { text: "Kupa e Shqiperise 2009-10", value: 8 },
       ];
	  
	  $scope.sezoni_id = $scope.SezoneList[$scope.start_val_id].value;
      $scope.sezoni_text = $scope.SezoneList[$scope.start_val_id].text;
	  
	  /**ProjectService.getKupaProjects(function(data) {
		  $scope.SezoneList = data;
	  });**/
	  
	 $scope.$on('$ionicView.beforeEnter', function(){
	    //console.log("enter view");
		$ionicBackdrop.retain();
		$ionicLoading.show();
		ProjectService.getKupaProjects(function(data) {
		  $scope.SezoneList = data;
		  $scope.sezoni_id = $scope.SezoneList[$scope.start_val_id].value;
          $scope.sezoni_text = $scope.SezoneList[$scope.start_val_id].text;
		  NdeshjetService.getAllNdeshjet($scope.sezoni_id, $scope.clubId, function(data) {
            $scope.items = data;
			if(data.length)
			{
				var current = data[0].current_round - 1;
			}
		    else{
				var current = 0;
			}
            $ionicLoading.hide();
			$ionicBackdrop.release();
			$scope.ScrollTo("ndeshja-"+current);
		  });
	    });
	   });

        $scope.ScrollTo = function(location) {
            location = $location.hash(location);
            //console.log('scrolling to: '+location);
            $ionicScrollDelegate.$getByHandle('mainScrollK').anchorScroll("#"+location);
        };

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

      $scope.changeSezoni = function(item, index) {
		$scope.start_val_id = index;
        $scope.sezoni_text = item.text;
        $scope.sezoni_id = item.value;
        $scope.popover.hide();
        //$scope.loadingIndicator.show;
        $ionicBackdrop.retain();
		$ionicLoading.show();
        NdeshjetService.getAllNdeshjet($scope.sezoni_id, $scope.clubId, function(data) {
            $scope.items = data;
			if(data.length)
			{
				var current = data[0].current_round - 1;
			}
		    else{
				var current = 0;
			}
			//console.log(data.length);
            //selectPopup.close();
			$ionicLoading.hide();
            $scope.popover.hide();
            $ionicBackdrop.release();
			$scope.ScrollTo("ndeshja-"+current);
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
		  window.plugins.OneSignal.getTags(function(tag)
		  {
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
		 AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
		 //console.log("show");
		});
		
		$scope.$on('$ionicView.enter', function(){
	    	console.log("enter view");
			var counter = 0;
			var update = function update() {
				timer = $timeout(update, 59000);
				counter ++;
				//console.log(counter);
				isSubscribed(tags);
				if(counter%2)
				{
					AdMob.hideBanner();
					//console.log("hide");					
				}
			    else
				{
					//console.log("show");
					AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
				}
				
				NdeshjaService.getReport($stateParams.ndeshjaId, function(data) {
					$scope.item = data;
					$scope.content = data.kronika;
					$scope.percent = data.percent;
					ga_storage._trackPageview('#/app/ndeshja/'+ $stateParams.ndeshjaId+'', $scope.item.team1+' - '+$scope.item.team2 );
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


    .controller('KlasifikimiCtrl', function($scope, $stateParams, $timeout, $ionicLoading, $ionicBackdrop, KlasifikimiService, ProjectService, $ionicPopover) {
     ga_storage._trackPageview('#/app/klasifikimi', 'Vllaznia App Klasifikimi');
     var titulliPop = "Zgjidh kampionatin";
	 $scope.start_val_id = 0;
     $scope.SezoneList = [
	   { text: "Superliga 2016-17", value: 111 },
       { text: "Superliga 2015-16", value: 105 },
       { text: "Superliga 2014-15", value: 100 },
       { text: "Superliga 2013-14", value: 97 },
       { text: "Superliga 2012-13", value: 86 },
       { text: "Superliga 2011-12", value: 79 },
       { text: "Superliga 2010-11", value: 15 },
       { text: "Superliga 2009-10", value: 10 },
      ];

	  $scope.sezoni_id = $scope.SezoneList[$scope.start_val_id].value;
      $scope.sezoni_text = $scope.SezoneList[$scope.start_val_id].text;
	  
	 /**ProjectService.getSuperligaProjects(function(data) {
		  $scope.SezoneList = data;
	 });
	 **/
	 
	  $scope.$on('$ionicView.Enter', function(){
	    //console.log("enter view 12");
		$ionicBackdrop.retain();
		$ionicLoading.show();
		ProjectService.getSuperligaProjects(function(data) {
		  $scope.SezoneList = data;
		  $scope.sezoni_id = $scope.SezoneList[$scope.start_val_id].value;
          $scope.sezoni_text = $scope.SezoneList[$scope.start_val_id].text;
		  KlasifikimiService.getAllKlasifikimi($scope.sezoni_id,function(data) {
            $scope.items = data;
			$scope.note = data[0].note;
			$scope.legend = data[0].legend;
            $ionicLoading.hide();
			$ionicBackdrop.release();
		  });
	    });
	   });
	  
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

       KlasifikimiService.getAllKlasifikimi($scope.sezoni_id,function(data) {
            $scope.items = data;
			$scope.note = data[0].note;
			$scope.legend = data[0].legend;
			//console.log(data[0]);
            $ionicLoading.hide();
        });

      $scope.changeSezoni = function(item, index) {
		$scope.start_val_id = index;
		//console.log(index);
        $scope.sezoni_text = item.text;
        $scope.sezoni_id = item.value;
        $scope.popover.hide();
        $ionicBackdrop.retain();
		$ionicLoading.show();
        KlasifikimiService.getAllKlasifikimi($scope.sezoni_id,function(data) {
            $scope.items = data;
			$scope.note = data[0].note;
			$scope.legend = data[0].legend;
            //selectPopup.close();
            $scope.popover.hide();
			$ionicLoading.hide();
            $ionicBackdrop.release();
        });
      };
       
	  $timeout(function(){
        $ionicLoading.hide();
        //selectPopup.close();
        $scope.popover.hide();
        $ionicBackdrop.release();
      },160000);
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
		var maxlen = 25;
        $scope.anim="zoomInDown";
        $scope.loadingIndicator = $ionicLoading.show({
	         content: 'Loading Data',
	         animation: 'fade-in',
	         showBackdrop: true,
	         maxWidth: 200,
	         showDelay: 50
	      });
        EkipiService.get($stateParams.lojtariId, function(data){$scope.item = data[$stateParams.lojtariId-1]; maxlen=Object.keys(data).length;});
        $ionicLoading.hide();
        //console.log($scope.item.pid);
        $scope.lojtariN = function(numri){
          if($scope.anim === "zoomInDown")
		  { $scope.anim = "zoomInUp";}
          else
		  { $scope.anim = "zoomInDown";}
           // $scope.anim="slideLeft";
           numri = $scope.item.pid +1;
		   //console.log(maxlen);
           if(numri>maxlen){numri=1;
            $scope.item.pid=1;}
           EkipiService.get(numri,function(data){$scope.item = data[numri-1]; maxlen=Object.keys(data).length;});
		   //console.log($scope.item);
           $ionicLoading.hide();
           //console.log($scope.item.pid);
           //numri = $scope.item.pid;
          // $scope.playerID = index+1;
         }
         $scope.lojtariP = function(numri){
           if($scope.anim === "zoomInUp")
              $scope.anim = "zoomInDown";
           else
            $scope.anim = "zoomInUp";
            numri = $scope.item.pid - 1;
           if(numri<1){numri=maxlen;
           $scope.item.pid=25;}
           EkipiService.get(numri,function(data){$scope.item = data[numri-1]; maxlen=Object.keys(data).length;});
           $ionicLoading.hide();
           // console.log($scope.item.pid);
           //numri = $scope.item.pid;
           // $scope.playerID = index+1;
         }
         $timeout(function(){
           $ionicLoading.hide();
         },10000);
    })


  .controller('KlubiCtrl', function($scope, $ionicLoading, $ionicSlideBoxDelegate, $ionicScrollDelegate) {
        ga_storage._trackPageview('#/app/klubi', 'Vllaznia App Klubi');
        $scope.title="Klubi";
		$scope.selected = 0;
        $scope.slideHasChanged = function(index){
		  $scope.selected = index;
          $ionicScrollDelegate.resize();
          $ionicSlideBoxDelegate.update();
          //$ionicScrollDelegate.scrollTop(true);
		  //$ionicScrollDelegate.scrollBy(0, 100);
         }
        $scope.slideTo = function(index) {
          if(index){
		  $scope.selected = 1;
          $scope.title="Trofetë";
          $ionicSlideBoxDelegate.slide(index);
          $ionicScrollDelegate.resize();
          $ionicSlideBoxDelegate.update();
		  //$ionicScrollDelegate.scrollBy(0, 100);
          //$ionicScrollDelegate.scrollTop(true);
          }
          else{
          $scope.title="Historia";
		  $scope.selected = 0;
          $ionicSlideBoxDelegate.slide(index);
          $ionicScrollDelegate.resize();
          $ionicSlideBoxDelegate.update();
		  //$ionicScrollDelegate.scrollBy(0, 100);
          //$ionicScrollDelegate.scrollTop(true);
          }
          $ionicSlideBoxDelegate.slide(index);
		  $scope.selected = index;
          $ionicScrollDelegate.resize();
          $ionicSlideBoxDelegate.update();
		  //$ionicScrollDelegate.scrollBy(0, 100);
          //$ionicScrollDelegate.scrollTop(true);
       }
    })


    .controller('TvCtrl', function($scope) {
		ga_storage._trackPageview('#/app/tv', 'Vllaznia App TV');
     /* AdMob.prepareInterstitial({
			adId: 'ca-app-pub-7925487268042880/6932118769',
			autoShow: true
		});
        AdMob.showInterstitialAd(); */
		
		//window.admob.cacheInterstitial();
		//window.adMob.showInterstitial();
		//AdMob.requestInterstitialAd();
		//AdMob.showInterstitialAd();
		
        $scope.browse = function(v){
          ga_storage._trackEvent('TV', 'Play', v);
            window.open(v, "_blank", "location=no");
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
          cordova.InAppBrowser.open(v, "_blank", "location=no");
        }
        $timeout(function(){
          $ionicLoading.hide();
        },6000);
    });
