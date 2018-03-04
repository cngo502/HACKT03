getModule().controller("SupplierCtrl", ["$scope", "dataFactory", function ($scope, dataFactory) {
	(function () {
		$scope.searchLocation = function (location) {
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
	}())

}]);