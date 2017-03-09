angular.module('vllaznia.services', [])



.factory('LoaderService', function($rootScope, $ionicLoading) {
  // Trigger the loading indicator
  return {
        show : function() { //code from the ionic framework doc
            // Show the loading overlay and text
            $rootScope.loading = $ionicLoading.show({
              // The text to display in the loading indicator
              content: 'Loading',
              // The animation to use
              animation: 'fade-in',
              // Will a dark overlay or backdrop cover the entire view
              showBackdrop: true,
              // The maximum width of the loading indicator
              // Text will be wrapped if longer than maxWidth
              maxWidth: 400,
              // The delay in showing the indicator
              showDelay: 20
            });
        },
        hide : function(){
            $rootScope.loading.hide();
        }
    }
})


	.factory('ProjectService', function($http) {
        var SuperligaProjects = [];
		var KupaProjects = [];
        return {
            getSuperligaProjects: function(callback){
				$http.get(URL_APP+'projects.php?id=1&app_id='+APP_ID).success(
                    function(data) {
						SuperligaProjects = data;
						window.localStorage["superligaP"] = JSON.stringify(SuperligaProjects);
						callback(SuperligaProjects);
					}
				)
                .error(function(data) {
					console.log("ERROR loading" + data);
					if(window.localStorage["superligaP"] !== undefined) {
                    SuperligaProjects = JSON.parse(window.localStorage["superligaP"]);
                    callback(SuperligaProjects);
					}
				});
            },
			getKupaProjects: function(callback) {
                $http.get(URL_APP+'projects.php?id=2&app_id'+APP_ID).success(
                    function(data) {
                        KupaProjects = data;
                        window.localStorage["kupaP"] = JSON.stringify(KupaProjects);
                        callback(KupaProjects);
                    }
                )
                .error(function(data) {
                   console.log("ERROR:" + data);
                   if(window.localStorage["kupaP"] !== undefined) {
                    KupaProjects = JSON.parse(window.localStorage["kupaP"]);
                    callback(KupaProjects);
                }
              });

            }
        }
    })

   .factory('NdeshjetService', function($http) {
        var ndeshjet = [];
        return {
            getSuperligaVllaznia: function(callback) {
                $http.get(URL_APP+'ndeshjet.php?id=superliga&ekipi=13&app_id='+APP_ID).success(
                    function(data) {
                        ndeshjet = data;
                        window.localStorage["ndeshjet"] = JSON.stringify(data);
                        callback(data);
                    }
                )
                .error(function(data) {
                   console.log("ERROR:" + data);
                if(window.localStorage["ndeshjet"] !== undefined) {
                    ndeshjet = JSON.parse(window.localStorage["ndeshjet"]);
                    callback(ndeshjet);
                }
              });

            },
            getAllNdeshjet: function(sezoniId, clubId, callback) {
                $http.get(URL_APP+'ndeshjet.php',{params:{id: sezoniId, ekipi: clubId, app_id: APP_ID}}).success(
                    function(data) {
                        allndeshje = data;
                        window.localStorage["allNdeshje"] = JSON.stringify(data);
                        callback(data);
                    }
                )
                .error(function(data) {
                   console.log("ERROR: " + data);
                if(window.localStorage["allNdeshje"] !== undefined) {
                    allndeshje = JSON.parse(window.localStorage["allNdeshje"]);
                    callback(allndeshje);
                }
              });
            },
            getSuperligaLastNdeshje: function(callback) {
                $http.get(URL_APP+'ndeshjet.php?id=superliga1&ekipi=13&app_id='+APP_ID).success(
                    function(data) {
                        ndeshjet = data;
                        window.localStorage["lastNdeshjet"] = JSON.stringify(data);
                        callback(data);
                    }
                )
                .error(function(data) {
                   console.log("ERROR: last ndeshje" + data);
                if(window.localStorage["lastNdeshjet"] !== undefined) {
                    lastndeshjet = JSON.parse(window.localStorage["lastNdeshjet"]);
                    callback(lastndeshjet);
                }
              });
            },
            getSuperligaVllazniaId: function(ndeshjaId) {
                return ndeshjet[ndeshjaId - 1];
            },
            getReport: function(ndeshjaId, callback) {
                $http.get(URL_APP+'ndeshja.php',{params:{id: 'superliga', ndeshja: ndeshjaId, app_id: APP_ID}}).success(
                    function(data) {
                        console.log(ndeshjaId);
                        console.log(data);
                        ndeshja = data;
                        callback(data);
                    }
                );
            }
        }
    })

   .factory('NdeshjaService', function($http) {
        var ndeshja = [];
        return {
            getReport: function(ndeshjaId, callback) {
                $http.get(URL_APP+'/ndeshja.php',{params:{id: 'superliga', ndeshja: ndeshjaId, app_id: APP_ID}}).success(
                    function(data) {
                        ndeshja = data;
                        callback(data);
                    }
                );
            }
        }
    })

   .factory('LajmeService', function($http) {
        var lajmet = [];
        return {
            getAll: function(callback) {
                $http.get('http://www.fkvllaznia.net/main/app/lajme.php').success(
                    function(data) {
                        lajmet = data;
                        window.localStorage["lajmet"] = JSON.stringify(data);
                        callback(data);
                    }
                )
                .error(function(data) {
                   console.log("ERROR: " + data);
                if(window.localStorage["lajmet"] !== undefined) {
                    lajmet = JSON.parse(window.localStorage["lajmet"]);
                    callback(lajmet);
                }
              });
            },
           getSlider: function(callback) {
                $http.get('http://www.fkvllaznia.net/main/app/lajme.php?nr=3').success(
                    function(data) {
                        lajmet = data;
                        window.localStorage["lajmetSlider"] = JSON.stringify(data);
                        callback(data);
                    }
                )
                .error(function(data) {
                   console.log("ERROR: " + data);
                if(window.localStorage["lajmetSlider"] !== undefined) {
                    lajmetSlider = JSON.parse(window.localStorage["lajmetSlider"]);
                    callback(lajmetSlider);
                }
              });

            },
            getId: function(lajmiId) {
                return lajmet[lajmiId - 1];
            }
        }
    })

   .factory('KlasifikimiService', function($http) {
        var klasifikimi = [];

        return {
            getAllKlasifikimi: function(sezoniId, callback) {
                $http.get(URL_APP+'klasifikimi.php',{params:{id: sezoniId, app_id: APP_ID}}).success(
                    function(data) {
                        ndeshja = data;
                        window.localStorage["klasifikimi"] = JSON.stringify(data);
                        callback(data);
                    }
                )
                .error(function(data) {
                   console.log("ERROR: " + data);
                if(window.localStorage["klasifikimi"] !== undefined) {
                    klasifikimi = JSON.parse(window.localStorage["klasifikimi"]);
                    callback(klasifikimi);
                }
              });
            }
        }

       /** return {
            getAllKlasifikimi: function(callback) {
                $http.get('http://www.ingalb.com/as/klasifikimi.php?id=superliga').success(
                    function(data) {
                        klasifikimi = data;
                        callback(data);
                    }
                );
            },
            get: function(klasifikimiId) {
              return klasifikimi[klasifikimiId - 1];
            }
        } **/
    })

   .factory('EkipiService', function($http) {
        var ekipi = [];
        return {
            getAllEkipi: function(sezoniId, ekipiId, callback) {
                $http.get(URL_APP+'ekipi.php',{params:{id: sezoniId, ekipi: ekipiId, app_id: APP_ID}}).success(
                    function(data) {
                        ekipi = data;
                        window.localStorage["ekipi"] = JSON.stringify(data);
                        callback(data);
                    }
                )
                .error(function(data) {
                   console.log("ERROR: " + data);
                if(window.localStorage["ekipi"] !== undefined) {
                    ekipi = JSON.parse(window.localStorage["ekipi"]);
                    callback(ekipi);
                  }
                });
            },
            get: function(lojtariId, callback) {
				$http.get(URL_APP+'ekipi.php',{params:{id: 111, ekipi: 13, app_id: APP_ID}}).success(
                    function(data) {
                        ekipi1 = data;
                        window.localStorage["ekipi1"] = JSON.stringify(data);
                        callback(ekipi1);
                    }
                );
                //return ekipi1[lojtariId - 1];
            }
        }
    })

   .factory('ForumiService', function($http) {
        var postimet = [];
        return {
            getAllPostimet: function(callback) {
                $http.get('http://www.fkvllaznia.net/main/forum/json.php').success(
                    function(data) {
                        postimet = data;
                        window.localStorage["postimet"] = JSON.stringify(data);
                        callback(data);
                    }
                )
                .error(function(data) {
                   console.log("ERROR: " + data);
                if(window.localStorage["postimet"] !== undefined) {
                    postimet = JSON.parse(window.localStorage["postimet"]);
                    callback(postimet);
                }
            });
            },
            get: function(postId) {
                return postimet[postId - 1];
            }
        }
    });
