define(["knockout"], function(ko) {
	var resumeInfo = function(data) {
		this.cellID = data.cellID || null;
		this.latitudeMin = data.latitudeMin || null;
		this.latitudeMax = data.latitudeMax || null;
		this.longitudeMin = data.longitudeMin || null;
		this.longitudeMax = data.longitudeMax || null;
		this.providers = data.providers || null;
		this.resources = data.resources || null;
		this.canonicals = data.canonicals || null;
		this.kingdoms = data.kingdoms || null;
		this.phylums = data.phylums || null;
		this.taxonClasses = data.taxonClasses || null;
		this.order_ranks = data.order_ranks || null;
		this.families = data.families || null;
		this.genuses = data.genuses || null;
		this.species = data.species || null;
		this.countries = data.countries || null;
		this.counties = data.counties || null;
		this.departments = data.departments || null;
	};

	return resumeInfo;
});