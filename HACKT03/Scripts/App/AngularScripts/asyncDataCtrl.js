getModule().factory('asyncData', ["$http", "$q", "dataFactory", function ($http, $q, dataFactory) {
	var dataObj = {}
	dataObj.gridName = {};
	dataObj.gridName.mainGrid = "mainGrid";

	dataObj.width = {};
	dataObj.width.width = "25%";
	dataObj.width.left = "25.2%";
	dataObj.uiconfig = {};

	return dataObj;
}]);