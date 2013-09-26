define(["knockout"], function(ko) {
	var ResumeSpecieName = function(data) {
		this.species = data.species;
		this.occurrences = data.occurrences;

		this.speciesWithBold = ko.computed(function() {
			if($("#statesInput").val()) {
				var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' );
				return this.species.replace(regex, "<strong>$1</strong>");
			} else {
				return this.species;
			}
		}, this);
	};

	return ResumeSpecieName;
});