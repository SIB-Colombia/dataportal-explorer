define(["knockout", "app/viewModels/OccurrenceSearchViewModel", "bootstrap", "app/map-initialize"], function(ko, OccurrenceSearchViewModel, bootstrap, map) {
	ko.applyBindings(new OccurrenceSearchViewModel(), $("#map-filter-area")[0]);
});