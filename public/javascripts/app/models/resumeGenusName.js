define(["knockout"], function(ko) {
	var ResumeGenusName = function(data) {
		this.genus = data.genus;
		this.occurrences = data.occurrences;

		this.genusWithBold = ko.computed(function() {
			if($("#statesInput").val()) {
				var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' );
				return this.genus.replace(regex, "<strong>$1</strong>");
			} else {
				return this.genus;
			}
		}, this);
	};

	return ResumeGenusName;
});