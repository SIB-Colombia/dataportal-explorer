define(["knockout"], function(ko) {
	var ResumeCountry = function(data) {
		this.countryName = data.countryName;
		this.isoCountryCode = data.isoCountryCode;
		this.occurrences = data.occurrences;
		this.name = data.name;

		this.countryNameWithBold = ko.computed(function() {
			if($("#statesInput").val()) {
				var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' );
				return this.name.replace(regex, "<strong>$1</strong>");
			} else {
				return this.name;
			}
		}, this);
	};

	return ResumeCountry;
});