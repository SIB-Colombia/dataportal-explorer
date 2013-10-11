define(["knockout"], function(ko) {
	var County = function(data) {
		this.departmentName = data.departmentName;
		this.countyName = data.countyName;
		this.isoCountyCode = data.isoCountyCode;

		this.departmentAndCountyName = ko.computed(function() {
			return this.departmentName + " - " + this.countyName;
		}, this);
	};

	return County;
});