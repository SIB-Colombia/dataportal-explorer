define(["knockout"], function(ko) {
	var Paramo = function(data) {
		this.paramoName = data.paramoName;
		this.paramoCode = data.paramoCode;
	};

	return Paramo;
});