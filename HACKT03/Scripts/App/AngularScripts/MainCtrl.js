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
			"esri/symbols/Font",
			"esri/geometry/Point",
			"esri/SpatialReference",
			"esri/symbols/SimpleMarkerSymbol",
			"esri/symbols/PictureMarkerSymbol",
			"esri/symbols/SimpleLineSymbol",
			"esri/Color",
			"esri/symbols/TextSymbol",
			"esri/layers/GraphicsLayer",
			"esri/graphic",
			"esri/dijit/LocateButton",
			"dojo/parser",			
			"dojo/domReady!"

			], function (ArcGISDynamicMapServiceLayer, Map, Search, HomeButton, Font, Point,
				SpatialReference, SimpleMarkerSymbol, PictureMarkerSymbol, SimpleLineSymbol, Color, TextSymbol, GraphicsLayer, Graphic, LocateButton) {
				var map = new Map("RightPanel", {
					basemap: "topo",
					center: [-98, 37.2],
					//slider: false,
					zoom: 5
				});
				
				var url = "https://vharcgis.pro.coil/server/rest/services/TEST_TG/MapServer";
				var dLayer = new ArcGISDynamicMapServiceLayer(url);
				map.addLayer(dLayer);
				var home = new HomeButton({
					map: map
				}, "HomeButton");
				home.startup();

				var searchLayer = new GraphicsLayer();
				map.addLayer(searchLayer);

				var search = new Search({
					enableLabel: true,
					enableInfoWindow: false,
					map: map
				}, "");

				search.startup();

				//var geoLocate = new LocateButton({
				//	map: map
				//}, "LocateButton");
				//geoLocate.startup();

				//$scope.$broadcast("main:currentLocation", geoLocate);

				function doSearchGeo(location, pointpng) {
					//create point from x/y and perform the search on it
					var geo = new Point(location.x, location.y, new SpatialReference({
						wkid: 4326
					}));
					//highlight symbol
					var symbol = new PictureMarkerSymbol(pointpng, 20, 20);
					//labeling text symbol
					var ls = new TextSymbol().setColor(new Color([181, 56, 46, 0.9])).setFont(new Font("24px", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_BOLD, "Arial")).setOffset(11, -5).setAlign(TextSymbol.ALIGN_START);
					//No sources are explicitely set so will default to ArcGIS Online World geocoding service
					search.sources[0].highlightSymbol = symbol; //set the symbol for the highlighted symbol
					search.sources[0].labelSymbol = ls; //set the text symbol for the label
					//performs a reverse geocode 
					//search.search(geo);			
					//var attr = {"Xcoord":evt.mapPoint.x,"Ycoord":evt.mapPoint.y,"Plant":"Mesa Mint"};
					//var infoTemplate = new InfoTemplate("Vernal Pool Locations","Latitude: ${Ycoord} Longitude: ${Xcoord}Plant Name:${Plant}");
					var graphic = new Graphic(geo, symbol);
					searchLayer.add(graphic);
					console.log("search graphic layer is: ", searchLayer, search);

					var zoomExtent = esri.graphicsExtent(searchLayer.graphics);
					console.log("zoom extent is: ", zoomExtent);
					map.setExtent(zoomExtent,true);
				};

				//$scope.$emit("supplier:getLocation", location);
				$scope.$on("supplier:getLocation", function (event, location) {
					console.log("location is: ", location);
					searchLayer.clear();
					
					doSearchGeo(location, 'content/images/point.png');


					$http({
						method: 'POST',
						url: "supplier/getSupplierLocation",
						//data: $scope.cal,
						data: 'currentLocation=' + encodeURIComponent(JSON.stringify(location)),
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
					}).then(function successCallback(response) {
						console.log("location is: ", response);
						doSearchGeo(response.data, 'content/images/supplierlocation.png');

						

					}, function () {
					});

				});

				$scope.$on("user:getLocation", function (event, args) {
					console.log("location is: ", args);
					searchLayer.clear();
					var locationList = args.split(",");
					var location = {};
					////-117.195646, 34.056397
					location.x = Number(locationList[0]);
					location.y = Number(locationList[1]);
					doSearchGeo(location, 'content/images/point.png');


					$http({
						method: 'POST',
						url: "userNeedHelp/getUserNeedHelpLocation",
						//data: $scope.cal,
						data: 'currentLocation=' + encodeURIComponent(JSON.stringify(location)),
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
					}).then(function successCallback(response) {
						console.log("location is: ", response);
						doSearchGeo(response.data, 'content/images/supplierlocation.png');
					}, function () {
					});
				});


				
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