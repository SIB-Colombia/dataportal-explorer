define(["knockout"], function(ko) {
	var ResumeDataResource = function(data) {
		this.resourceName = data.resourceName;
		this.resourceID = data.resourceID;
		this.providerID = data.providerID;
		this.occurrences = data.occurrences;
		this.name = data.name;

		this.resourceNameWithBold = ko.computed(function() {
			if($("#statesInput").val()) {
				var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' );
				return this.name.replace(regex, "<strong>$1</strong>");
			} else {
				return this.name;
			}
		}, this);
	};

	return ResumeDataResource;
});