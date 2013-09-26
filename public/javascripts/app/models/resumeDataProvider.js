define(["knockout"], function(ko) {
	var ResumeDataProvider = function(data) {
		this.providerName = data.providerName;
		this.providerID = data.providerID;
		this.occurrences = data.occurrences;

		this.providerNameWithBold = ko.computed(function() {
			if($("#statesInput").val()) {
				var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' );
				return this.providerName.replace(regex, "<strong>$1</strong>");
			} else {
				return this.providerName;
			}
		}, this);
	};

	return ResumeDataProvider;
});