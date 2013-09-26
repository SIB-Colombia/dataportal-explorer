define(["knockout"], function(ko) {
	var ResumeInstitutionCode = function(data) {
		this.institutionCode = data.institutionCode;
		this.institutionCodeID = data.institutionCodeID;
		this.occurrences = data.occurrences;

		this.institutionCodeWithBold = ko.computed(function() {
			if($("#statesInput").val()) {
				var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' );
				return this.institutionCode.replace(regex, "<strong>$1</strong>");
			} else {
				return this.institutionCode;
			}
		}, this);
	};

	return ResumeInstitutionCode;
});