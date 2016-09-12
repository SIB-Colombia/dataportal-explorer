define(["knockout"], function(ko) {
	var ResumeKingdomName = function(data) {
		this.id = data.id || null;
		this.kingdom = data.kingdom;
		this.occurrences = data.occurrences;
		this.name = data.name

		this.kingdomWithBold = ko.computed(function() {
			if($("#statesInput").val()) {
				var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' );
				return this.name.replace(regex, "<strong>$1</strong>");
			} else {
				return this.name;
			}
		}, this);
	};

	return ResumeKingdomName;
});