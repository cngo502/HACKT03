﻿getModule().controller("AgencyCtrl", ["$scope", "dataFactory", function ($scope, dataFactory) {
	(function () {
		$scope.$on("Global.ResizeUI", function (event, args) {
			setTimeout(function () {
			}, 100);
		});
	}())

}]);