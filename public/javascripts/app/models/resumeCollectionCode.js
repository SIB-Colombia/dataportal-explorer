define(["knockout"], function(ko) {
	var ResumeCollectionCode = function(data) {
		this.collectionCode = data.collectionCode;
		this.collectionCodeID = data.collectionCodeID;
		this.occurrences = data.occurrences;
		this.name = data.name;

		this.collectionCodeWithBold = ko.computed(function() {
			if($("#statesInput").val()) {
				var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' );
				return this.name.replace(regex, "<strong>$1</strong>");
			} else {
				return this.name;
			}
		}, this);
	};

	return ResumeCollectionCode;
});