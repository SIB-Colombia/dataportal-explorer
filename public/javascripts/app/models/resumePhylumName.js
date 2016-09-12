define(["knockout"], function(ko) {
	var ResumePhylumName = function(data) {
		this.id = data.id;
		this.phylum = data.phylum;
		this.occurrences = data.occurrences;
		this.name = data.name;

		this.phylumWithBold = ko.computed(function() {
			if($("#statesInput").val()) {
				var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' );
				return this.name.replace(regex, "<strong>$1</strong>");
			} else {
				return this.name;
			}
		}, this);
	};

	return ResumePhylumName;
});