getModule().controller("MainCtrl", ["$scope", "dataFactory", "$http", "asyncService", "$timeout", "$interval", "asyncData",
		function ($scope, dataFactory, $http, asyncService, $timeout, $interval, asyncData) {
			$scope.shareData = asyncData;
			$scope.showLeftPanel = false;
			$scope.showRightPanel = true;
			$scope.ActivateTool = function (toolName) {
				$scope.currentTool = toolName;
				$scope.leftPanelView = dataFactory.getViewUrl(toolName);
				$scope.showLeftPanel = true;

				if ($scope.shareData.width != "25%") {
					document.getElementById("LeftPanel").style.width = $scope.shareData.width.left;
					document.getElementById("RightPanel").style.left = $scope.shareData.width.left;
					document.getElementById("sidebar-resizer").style.left = $scope.shareData.width.width;
				}
				else {
					document.getElementById("LeftPanel").style.width = "25.2%";
					document.getElementById("RightPanel").style.left = "25.2%";
					document.getElementById("sidebar-resizer").style.left = "25%";
				}

				SendResizeEvent();
			};
			function SendResizeEvent() {
				$scope.$broadcast("Global.ResizeUI");
			};
			$(window).resize(function (e) {
				SendResizeEvent();
				//console.log("window resize is: ", e);
			});
			$scope.hidePanel = function () {
				document.getElementById("LeftPanel").style.width = "0px";
				document.getElementById("RightPanel").style.left = "0px";
				SendResizeEvent();
			};

			require([
				"esri/layers/ArcGISDynamicMapServiceLayer",
			   "esri/map",
			   "esri/dijit/Search",
			   "esri/dijit/HomeButton",
			   "dojo/domReady!"

			], function (ArcGISDynamicMapServiceLayer,Map, Search, HomeButton) {
				var map = new Map("RightPanel", {
					basemap: "topo",
					center: [-98, 37.2],
					//slider: false,
					zoom: 5
				});
				
				var url = "https://vharcgis.pro.coil/server/rest/services/TEST_TG/MapServer";
				//https://vharcgis.pro.coil/server/rest/services/TEST_XGZ/MapServer
				var dLayer = new ArcGISDynamicMapServiceLayer(url);
				map.addLayer(dLayer);

				//dLayer.on("load", function (e) {
				//	var fLayer = new FeatureLayer(url, {
				//		//id: layerInfo.name,
				//		outFields: ["*"],
				//		mode: FeatureLayer.MODE_SELECTION,
				//	});
				//	map.addLayer(fLayer);
				//});

				var home = new HomeButton({
					map: map
				}, "HomeButton");
				home.startup();
				
			});



			(function () {
				$scope.$on("MainCtrl.ActivateTool", function (event, args) {
					////console.log("activat tool event caught", event, args);
					event.stopPropagation();
				});
				angular.element($(window)).bind('resize', function () {
					SendResizeEvent();
				});
				$scope.$watch('showLeftPanel', function (e) {
					SendResizeEvent();
				});
				$scope.$on("GridCtl:getLeftWidth", function (event, args) {
					console.log("get width: ", args);
					$scope.shareData.width.width = args.width;
					$scope.shareData.width.left = args.left;
				});
			}());
		}]);