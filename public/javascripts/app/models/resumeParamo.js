define(["knockout"], function(ko) {
	var ResumeParamo = function(data) {
		this.paramoName = data.paramoName;
		this.paramoCode = data.paramoCode;
		this.occurrences = data.occurrences;

		this.paramoNameWithBold = ko.computed(function() {
			if($("#statesInput").val()) {
				var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' );
				return this.paramoName.replace(regex, "<strong>$1</strong>");
			} else {
				return this.paramoName;
			}
		}, this);
	};

	return ResumeParamo;
});