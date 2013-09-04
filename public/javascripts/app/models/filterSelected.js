define(["knockout"], function(ko) {
	var FilterSelected = function(data) {
		this.subject = data.subject;
		this.predicate = data.predicate;
		this.textName = data.textName;
		this.textObject = data.textObject;

		this.parsedLatitudeText = ko.computed(function() {
			var value = parseFloat(this.textObject);
			if (value >= 0) {
				return value + " Norte";
			} else {
				return (value*-1) + " Sur";
			}
		}, this);

		this.parsedLongitudeText = ko.computed(function() {
			var value = parseFloat(this.textObject);
			if (value >= 0) {
				return value + " Este";
			} else {
				return (value*-1) + " Oeste";
			}
		}, this);

		this.parsedAltitudeText = ko.computed(function() {
			return this.textObject + "m";
		}, this);

		this.parsedDeepText = ko.computed(function() {
			return this.textObject + "m";
		}, this);
	};

	return FilterSelected;
});