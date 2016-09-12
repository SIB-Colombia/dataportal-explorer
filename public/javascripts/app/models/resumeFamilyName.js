define(["knockout"], function(ko) {
	var ResumeFamilyName = function(data) {
		this.id = data.id;
		this.family = data.family;
		this.occurrences = data.occurrences;
		this.name = data.name;

		this.familyWithBold = ko.computed(function() {
			if($("#statesInput").val()) {
				var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' );
				return this.name.replace(regex, "<strong>$1</strong>");
			} else {
				return this.name;
			}
		}, this);
	};

	return ResumeFamilyName;
});