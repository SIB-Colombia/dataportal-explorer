define(["knockout"], function(ko) {
	var ResumeGenusName = function(data) {
		this.id = data.id;
		this.genus = data.genus;
		this.occurrences = data.occurrences;
		this.name = data.name;

		this.genusWithBold = ko.computed(function() {
			if($("#statesInput").val()) {
				var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' );
				return this.name.replace(regex, "<strong>$1</strong>");
			} else {
				return this.name;
			}
		}, this);
	};

	return ResumeGenusName;
});