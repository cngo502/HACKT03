getModule().controller("UserCtrl", ["$scope", "dataFactory", function ($scope, dataFactory) {
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
					$scope.$emit("user:getLocation", search);
				}
				else {
					alert("Please enter location.");
				}
			}

		};

		$scope.formatNumber = function (i) {
			return Math.round(i * 100) / 100;
		};

		$scope.currentLocation = function () {
			var location = {};
			location.x = -95.600887;
			location.y = 29.633012;
			$scope.search.locationString = String(location.x) + "," + String(location.y);
		};

		$scope.getDirection = function (supplier) {
			console.log("user is: ", supplier);
			$scope.$emit("user:getDirection", supplier);
		};

		$scope.clearSearch = function (search) {
			$scope.search = {};
			$scope.search.items = [];
			$scope.finishSearch = false;

		};

		$scope.$on("Global.ResizeUI", function (event, args) {
			setTimeout(function () {
			}, 100);
		});

		//$scope.$broadcast("supplier:returnSuppliers", response.data);
		$scope.$on("user:returnSuppliers", function (event, args) {
			console.log("returnSuppliers is: ", args);
			$scope.finishSearch = true;
			var results = [];
			results.push(args);
			results.push(args);

			$scope.suppliers = results;
		});

	}())

}]);