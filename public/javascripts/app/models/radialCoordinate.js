define(["knockout"], function(ko) {
	var RadialCoordinate = function(data) {
		this.lat = data.lat;
		this.lng = data.lng;
		this.radius = data.radius;

		this.coodinateText = ko.computed(function() {
			return "centro en lat "+parseFloat(this.lat).toFixed(3)+", lng "+parseFloat(this.lng).toFixed(3)+" con radio "+parseFloat(this.radius).toFixed(3)+" metros.";
		}, this);
	};

	return RadialCoordinate;
});