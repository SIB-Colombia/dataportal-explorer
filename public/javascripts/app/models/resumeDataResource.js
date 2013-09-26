define(["knockout"], function(ko) {
	var ResumeDataResource = function(data) {
		this.resourceName = data.resourceName;
		this.resourceID = data.resourceID;
		this.providerID = data.providerID;
		this.occurrences = data.occurrences;

		this.resourceNameWithBold = ko.computed(function() {
			if($("#statesInput").val()) {
				var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' );
				return this.resourceName.replace(regex, "<strong>$1</strong>");
			} else {
				return this.resourceName;
			}
		}, this);
	};

	return ResumeDataResource;
});