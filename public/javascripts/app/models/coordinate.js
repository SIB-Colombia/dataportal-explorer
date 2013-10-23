define(["knockout"], function(ko) {
	var Coordinate = function(data) {
		this.lat = data.lat;
		this.lng = data.lng;

		this.coodinateText = ko.computed(function() {
			return "(lat "+parseFloat(this.lat).toFixed(3)+", lng "+parseFloat(this.lng).toFixed(3)+"); ";
		}, this);
	};

	return Coordinate;
});