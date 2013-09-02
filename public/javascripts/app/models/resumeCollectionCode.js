define(["knockout"], function(ko) {
	var ResumeCollectionCode = function(data) {
		this.collectionCode = data.collectionCode;
		this.collectionCodeID = data.collectionCodeID;
		this.occurrences = data.occurrences;

		this.collectionCodeWithBold = ko.computed(function() {
			if($("#statesInput").val()) {
				var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' );
				return this.collectionCode.replace(regex, "<strong>$1</strong>");
			} else {
				return this.collectionCode;
			}
		}, this);
	};

	return ResumeCollectionCode;
});