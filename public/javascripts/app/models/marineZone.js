define(["knockout"], function(ko) {
	var MarineZone = function(data) {
		this.marineZoneName = data.marineZoneName;
		this.marineZoneCode = data.marineZoneCode;
	};

	return MarineZone;
});