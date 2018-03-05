getModule().controller("UserCtrl", ["$scope", "dataFactory", function ($scope, dataFactory) {
	(function () {
		$scope.searchLocation = function (location) {
			$scope.$emit("user:getLocation", location);
		};

		$scope.$on("Global.ResizeUI", function (event, args) {
			setTimeout(function () {
			}, 100);
		});
	}())

}]);