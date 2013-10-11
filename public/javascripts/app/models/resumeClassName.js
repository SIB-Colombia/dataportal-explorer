define(["knockout"], function(ko) {
	var ResumeClassName = function(data) {
		this.id = data.id;
		this.nameClass = data.nameClass;
		this.occurrences = data.occurrences;

		this.nameClassWithBold = ko.computed(function() {
			if($("#statesInput").val()) {
				var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' );
				return this.nameClass.replace(regex, "<strong>$1</strong>");
			} else {
				return this.nameClass;
			}
		}, this);
	};

	return ResumeClassName;
});