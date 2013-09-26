define(["knockout"], function(ko) {
	var ResumeFamilyName = function(data) {
		this.family = data.family;
		this.occurrences = data.occurrences;

		this.familyWithBold = ko.computed(function() {
			if($("#statesInput").val()) {
				var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' );
				return this.family.replace(regex, "<strong>$1</strong>");
			} else {
				return this.family;
			}
		}, this);
	};

	return ResumeFamilyName;
});