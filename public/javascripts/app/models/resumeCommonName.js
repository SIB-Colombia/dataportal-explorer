define(["knockout"], function(ko) {
	var ResumeCommonName = function(data) {
		this.canonical = data.canonical;
		this.occurrences = data.occurrences;
		this.name = data.name;

		this.canonicalWithBold = ko.computed(function() {
			if($("#statesInput").val()) {
				var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' );
				return this.name.replace(regex, "<strong>$1</strong>");
			} else {
				return this.name;
			}
		}, this);
	};

	return ResumeCommonName;
});