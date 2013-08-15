require(["knockout", "app/viewModels/OccurrenceSearchViewModel", "bootstrap"], function(ko, OccurrenceSearchViewModel) {
	ko.applyBindings(new OccurrenceSearchViewModel(), $("#map-filter-area")[0]);
});