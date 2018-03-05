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

		$scope.currentLocation = function () {
			var location = {};
			location.x = -95.600887;
			location.y = 29.633012;
			$scope.search.locationString = String(location.x) + "," + String(location.y);
		};

		$scope.$on("Global.ResizeUI", function (event, args) {
			setTimeout(function () {
			}, 100);
		});
	}())

}]);