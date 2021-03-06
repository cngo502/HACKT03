﻿getModule().controller("MainCtrl", ["$scope", "dataFactory", "$http", "asyncService", "$timeout", "$interval", "asyncData",
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

			$scope.ActivateTool('Supplier');

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
				 "dojo/dom",
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

			"esri/tasks/RouteTask",
			"esri/tasks/RouteParameters",

			"esri/tasks/FeatureSet",
			"esri/symbols/SimpleMarkerSymbol",
			"esri/symbols/SimpleLineSymbol",
			"dijit/registry",
			"esri/urlUtils",
			"esri/dijit/Measurement",
			"dojo/parser",			
			"dojo/domReady!"

			], function (dom,ArcGISDynamicMapServiceLayer, Map, Search, HomeButton, Font, Point,
				SpatialReference, SimpleMarkerSymbol, PictureMarkerSymbol, SimpleLineSymbol,
				Color, TextSymbol, GraphicsLayer, Graphic, LocateButton,
				RouteTask, RouteParameters, FeatureSet, SimpleMarkerSymbol, SimpleLineSymbol, registry, urlUtils, Measurement) {

				urlUtils.addProxyRule({
					urlPrefix: "route.arcgis.com",
					proxyUrl: "/sproxy/"
				});

				var map = new Map("RightPanel", {
					basemap: "topo",
					center: [-98, 37.2],
					//slider: false,
					zoom: 5
				});

				//map.on("click", addStop);
				
				var url = "https://vharcgis.pro.coil/server/rest/services/HACKT03_WORLDVILLE/MapServer";
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

				//var measurement = new Measurement({
				//	map: map
				//}, dom.byId("measurementID"));
				//measurement.startup();

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
					map.setExtent(zoomExtent, true);

					var stop = map.graphics.add(graphic);
					console.log("stop point is: ", stop);
					routeParams.stops.features.push(stop);
				};

				//$scope.$emit("supplier:getLocation", location);
				$scope.$on("supplier:getLocation", function (event, search) {
					searchLayer.clear();
					if (map.graphics != null) {
						map.graphics.clear();
					}					
					routeParams.stops.features = [];
					console.log("graphics  is: ", map.graphics, searchLayer);

					doSearchGeo(search.location, 'content/images/point.png');
					$http({
						method: 'POST',
						url: "supplier/getSupplierLocation",
						//data: $scope.cal,
						data: 'search=' + encodeURIComponent(JSON.stringify(search)),
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
					}).then(function successCallback(response) {
						doSearchGeo(response.data, 'content/images/supplierlocation.png');
						console.log("routeParams is: ", routeParams);
						if (routeParams.stops.features.length >= 2) {
							routeTask.solve(routeParams);
							lastStop = routeParams.stops.features.splice(0, 1)[0];
							console.log("routeParams.stops.features is: ", routeParams.stops.features, lastStop);
						}

						$scope.$broadcast("supplier:returnSuppliers", response.data);

					}, function () {
					});

				});

				//$scope.$emit("supplier:getDirection", supplier);
				$scope.$on("supplier:getDirection", function (event, args) {
					console.log("supplier args and routeParams are: ", args, routeParams);

					if (routeParams.stops.features.length >= 2) {
						console.log("routeParams.stops.features is: ", routeParams.stops.features);
						routeTask.solve(routeParams);
						lastStop = routeParams.stops.features.splice(0, 1)[0];
					}
				});

				$scope.$on("user:getDirection", function (event, args) {
					console.log("args and routeParams are: ", args, routeParams);
					if (routeParams.stops.features.length >= 2) {
						console.log("routeParams.stops.features is: ", routeParams.stops.features);
						routeTask.solve(routeParams);
						lastStop = routeParams.stops.features.splice(0, 1)[0];
					}
				});



				$scope.$on("user:getLocation", function (event, search) {
					console.log("user location is: ", search);
					searchLayer.clear();
					if (map.graphics != null) {
						map.graphics.clear();
					}
					routeParams.stops.features = [];
					doSearchGeo(search.location, 'content/images/point.png');


					$http({
						method: 'POST',
						url: "userNeedHelp/getUserNeedHelpLocation",
						//data: $scope.cal,
						data: 'search=' + encodeURIComponent(JSON.stringify(search)),
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
					}).then(function successCallback(response) {
						console.log("location is: ", response);
						doSearchGeo(response.data, 'content/images/supplierlocation.png');
						
						console.log("routeParams is: ", routeParams);
						if (routeParams.stops.features.length >= 2) {
							routeTask.solve(routeParams);
							lastStop = routeParams.stops.features.splice(0, 1)[0];
						}
						$scope.$broadcast("user:returnSuppliers", response.data);

					}, function () {
					});
				});


				////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				var routeTask, routeParams;
				var stopSymbol, routeSymbol, lastStop;
				//routeTask = new RouteTask("https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World");
				var routeTask = new RouteTask("https://vharcgis.pro.coil/portal/sharing/servers/72f35d922678482a9378c53c20b79dab/rest/services/World/Route/NAServer/Route_World");

				//setup the route parameters
				routeParams = new RouteParameters();
				routeParams.stops = new FeatureSet();
				routeParams.outSpatialReference = {
					"wkid": 4326
				};

				routeTask.on("solve-complete", showRoute);
				routeTask.on("error", errorHandler);

				//define the symbology used to display the route
				stopSymbol = new SimpleMarkerSymbol().setStyle(SimpleMarkerSymbol.STYLE_CROSS).setSize(15);
				stopSymbol.outline.setWidth(4);
				routeSymbol = new SimpleLineSymbol().setColor(new dojo.Color([0, 0, 255, 0.5])).setWidth(5);

				//Adds a graphic when the user clicks the map. If 2 or more points exist, route is solved.
				function addStop(evt) {
					var stop = map.graphics.add(new Graphic(evt.mapPoint, stopSymbol));
					console.log("stop point is: ", stop);
					routeParams.stops.features.push(stop);

					if (routeParams.stops.features.length >= 2) {
						routeTask.solve(routeParams);
						lastStop = routeParams.stops.features.splice(0, 1)[0];
					}
				}

				//Adds the solved route to the map as a graphic
				function showRoute(evt) {
					console.log("showRoute is: ", evt);
					map.graphics.add(evt.result.routeResults[0].route.setSymbol(routeSymbol));

				}

				//Displays any error returned by the Route Task
				function errorHandler(err) {
					alert("An error occured\n" + err.message + "\n" + err.details.join("\n"));

					routeParams.stops.features.splice(0, 0, lastStop);
					map.graphics.remove(routeParams.stops.features.splice(1, 1)[0]);
				}

				
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