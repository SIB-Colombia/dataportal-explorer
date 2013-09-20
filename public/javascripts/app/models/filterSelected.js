define(["knockout"], function(ko) {
	var FilterSelected = function(data) {
		this.subject = data.subject;
		this.predicate = data.predicate;
		this.textName = data.textName;
		this.textObject = data.textObject;
	};

	return FilterSelected;
});