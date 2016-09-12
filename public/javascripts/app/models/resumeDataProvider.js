define(["knockout"], function(ko) {
	var ResumeDataProvider = function(data) {
		this.providerName = data.providerName;
		this.providerID = data.providerID;
		this.occurrences = data.occurrences;
		this.name = data.name;

		this.providerNameWithBold = ko.computed(function() {
			if($("#statesInput").val()) {
				var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' );
				return this.name.replace(regex, "<strong>$1</strong>");
			} else {
				return this.name;
			}
		}, this);
	};

	return ResumeDataProvider;
});