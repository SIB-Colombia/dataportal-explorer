define(["knockout"], function(ko) {
	var ResumeCounty = function(data) {
		this.departmentAndCountyName = data.departmentAndCountyName;
		this.countyName = data.countyName;
		this.isoCountyCode = data.isoCountyCode;
		this.occurrences = data.occurrences;

		this.countyNameWithBold = ko.computed(function() {
			if($("#statesInput").val()) {
				var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' );
				return this.countyName.replace(regex, "<strong>$1</strong>");
			} else {
				return this.countyName;
			}
		}, this);

		this.departmentAndCountyNameWithBold = ko.computed(function() {
			if($("#statesInput").val()) {
				var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' );
				return this.departmentAndCountyName.replace(regex, "<strong>$1</strong>");
			} else {
				return this.departmentAndCountyName;
			}
		}, this);
	};

	return ResumeCounty;
});