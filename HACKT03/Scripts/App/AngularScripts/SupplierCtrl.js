getModule().controller("SupplierCtrl", ["$scope", "dataFactory", "$location", function ($scope, dataFactory, $location) {
	(function () {
		$scope.searchLocation = function (search) {
			var locationList = search.location.split(",");
			var location = {};
			location.x = Number(locationList[0]);
			location.y = Number(locationList[1]);
			$scope.$emit("supplier:getLocation", location);
		};

		$scope.search = {};
		$scope.search.items = [];



		$scope.suppliers = [
		{
			"Name": "Suger Land",
			"Address": "2619 Highway 6, Houston, Tx, 77084"
		}];

		
		$scope.currentLocation = function () {
			var location = {};
			location.x = -95.600887;
			location.y = 29.633012;
			$scope.$emit("supplier:getLocation", location);
		};

		function setGridGridOption() {
			var grid = $("#supplierGridID").data("kendoGrid");			
			$scope.GridGridOptions = {
				dataSource: {
					schema: {
						data: "data",
						total: "total",
						groups: "groups"
					},
					transport: {
						read: {
							url: url.getSupplier,
							type: "POST",							
						},
						parameterMap: function (options, type) {
							return options;
						}
					},
					//batch:true,
					pageSize: 40,
					serverGrouping: true,
					serverPaging: true,
					serverFiltering: true,
					serverSorting: true,
					requestEnd: function (e) {
					},

				},				
				columns: ["NAME"],				
				pageable: true,
				resizable: true,
				filterable: true,
			};

			if (grid) {
				//console.log("set options of grid", grid, $scope.GridGridOptions);
				grid.setOptions($scope.GridGridOptions);				
			}
		};

		setGridGridOption();
		$scope.$on("Global.ResizeUI", function (event, args) {
			setTimeout(function () {			
			}, 100);
		});
		$scope.$on("main:currentLocation", function (event, args) {
			console.log("current locaiton is: ", args);
		});
	}())

}]);