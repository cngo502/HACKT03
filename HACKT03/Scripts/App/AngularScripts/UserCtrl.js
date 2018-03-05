getModule().controller("UserCtrl", ["$scope", "dataFactory", function ($scope, dataFactory) {
	(function () {

		$scope.search = {};
		$scope.search.items = [];

		$scope.searchLocation = function (search) {
			$scope.$emit("user:getLocation", search.location);
		};

		$scope.$on("Global.ResizeUI", function (event, args) {
			setTimeout(function () {
			}, 100);
		});
	}())

}]);