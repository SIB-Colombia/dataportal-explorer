define(["knockout"], function(ko) {
	var ResumeMarineZone = function(data) {
		this.marineZoneName = data.marineZoneName;
		this.marineZoneCode = data.marineZoneCode;
		this.occurrences = data.occurrences;

		this.marineZoneNameWithBold = ko.computed(function() {
			if($("#statesInput").val()) {
				var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' );
				return this.marineZoneName.replace(regex, "<strong>$1</strong>");
			} else {
				return this.marineZoneName;
			}
		}, this);
	};

	return ResumeMarineZone;
});