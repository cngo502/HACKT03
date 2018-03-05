getModule().controller("SupplierCtrl", ["$scope", "dataFactory", "$location", function ($scope, dataFactory, $location) {
	(function () {

		$scope.search = {};
		$scope.search.items = [];

		$scope.searchLocation = function (search) {
			console.log("search model is: ", search);
			if (search.locationString != undefined) {
				var locationList = search.locationString.split(",");
				var location = {};
				location.x = Number(locationList[0]);
				location.y = Number(locationList[1]);
				search.location = location;
				if (locationList.length >= 2) {
					$scope.$emit("supplier:getLocation", search);
				}
				else {
					alert("Please enter location.");
				}
			}
			
		};

	

		$scope.suppliers = [];

		
		$scope.currentLocation = function () {
			var location = {};
			location.x = -95.600887;
			location.y = 29.633012;
			$scope.search.locationString = String(location.x) + "," + String(location.y);			
		};

		$scope.getDirection = function (supplier) {
			console.log("supplier is: ", supplier);
			$scope.$emit("supplier:getDirection", supplier);
		};

		$scope.formatNumber = function (i) {
			return Math.round(i * 100) / 100;
		};

		function myFunction() { };

		$scope.clearSearch = function (search) {
			$scope.search = {};
			$scope.search.items = [];
			$scope.finishSearch = false;

		};

		$scope.$on("Global.ResizeUI", function (event, args) {
			setTimeout(function () {			
			}, 100);
		});
		$scope.$on("main:currentLocation", function (event, args) {
			console.log("current locaiton is: ", args);
		});

		//$scope.$broadcast("supplier:returnSuppliers", response.data);
		$scope.$on("supplier:returnSuppliers", function (event, args) {
			console.log("returnSuppliers is: ", args);
			$scope.finishSearch = true;
			$scope.suppliers = args;
		});
	}())

}]);