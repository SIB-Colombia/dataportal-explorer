define(["knockout"], function(ko) {
	var ResumePhylumName = function(data) {
		this.id = data.id;
		this.phylum = data.phylum;
		this.occurrences = data.occurrences;

		this.phylumWithBold = ko.computed(function() {
			if($("#statesInput").val()) {
				var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' );
				return this.phylum.replace(regex, "<strong>$1</strong>");
			} else {
				return this.phylum;
			}
		}, this);
	};

	return ResumePhylumName;
});