define(["knockout"], function(ko) {
	var ResumeCountry = function(data) {
		this.countryName = data.countryName;
		this.isoCountryCode = data.isoCountryCode;
		this.occurrences = data.occurrences;

		this.countryNameWithBold = ko.computed(function() {
			if($("#statesInput").val()) {
				var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' );
				return this.countryName.replace(regex, "<strong>$1</strong>");
			} else {
				return this.countryName;
			}
		}, this);
	};

	return ResumeCountry;
});