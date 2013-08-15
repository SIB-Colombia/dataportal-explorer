require(["knockout", "app/viewModels/OccurrenceSearchViewModel", "bootstrap", "app/map-initialize"], function(ko, OccurrenceSearchViewModel) {
	ko.applyBindings(new OccurrenceSearchViewModel(), $("#map-filter-area")[0]);
});