define(["knockout"], function(ko) {
	var resumeCount = function(data) {
		this.id = data.id || null;
		this.url = data.url || null;
		this.name = data.name;
		this.count = data.count;
	};

	return resumeCount;
});