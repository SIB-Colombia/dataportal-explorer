define(["knockout"], function(ko) {
	var ResumeSpecieName = function(data) {
		this.id = data.id;
		this.species = data.species;
		this.occurrences = data.occurrences;
		this.name = data.name;

		this.speciesWithBold = ko.computed(function() {
			if($("#statesInput").val()) {
				var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' );
				return this.name.replace(regex, "<strong>$1</strong>");
			} else {
				return this.name;
			}
		}, this);
	};

	return ResumeSpecieName;
});