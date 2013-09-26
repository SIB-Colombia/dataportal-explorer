define(["knockout"], function(ko) {
	var ResumeScientificName = function(data) {
		this.canonical = data.canonical;
		this.occurrences = data.occurrences;

		this.canonicalWithBold = ko.computed(function() {
			if($("#statesInput").val()) {
				var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' );
				return this.canonical.replace(regex, "<strong>$1</strong>");
			} else {
				return this.canonical;
			}
		}, this);
	};

	return ResumeScientificName;
});