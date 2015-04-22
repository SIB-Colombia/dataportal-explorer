define(["jquery", "knockout", "underscore", "app/models/baseViewModel", "app/map-initialize", "app/models/occurrence", "app/models/resumeInfo", "app/models/resumeCount", "app/models/resumeScientificName", "app/models/resumeCommonName", "app/models/resumeKingdomName", "app/models/resumePhylumName", "app/models/resumeClassName", "app/models/resumeOrderName", "app/models/resumeFamilyName", "app/models/resumeGenusName", "app/models/resumeSpecieName", "app/models/resumeDataProvider", "app/models/resumeDataResource", "app/models/resumeInstitutionCode", "app/models/resumeCollectionCode", "app/models/resumeCountry", "app/models/resumeDepartment", "app/models/resumeCounty", "app/models/resumeParamo", "app/models/resumeMarineZone", "app/models/county", "app/models/paramo", "app/models/marineZone", "app/models/coordinate", "app/models/radialCoordinate", "app/models/filterSelected", "app/config/urlDataMapping", "select2", "knockoutKendoUI", "Leaflet", "jqueryUI", "bootstrap", "kendoSpanishCulture", "range-slider", "LeafletMarkerCluster"], function($, ko, _, BaseViewModel, map, Occurrence, ResumeInfo, ResumeCount, ResumeScientificName, ResumeCommonName, ResumeKingdomName, ResumePhylumName, ResumeClassName, ResumeOrderName, ResumeFamilyName, ResumeGenusName, ResumeSpecieName, ResumeDataProvider, ResumeDataResource, ResumeInstitutionCode, ResumeCollectionCode, ResumeCountry, ResumeDepartment, ResumeCounty, ResumeParamo, ResumeMarineZone, County, Paramo, MarineZone, Coordinate, RadialCoordinate, FilterSelected, UrlDataMapping, select2) {
	var OccurrenceSearchViewModel = function() {
		var self = this;
		self.densityCellsOneDegree = new L.FeatureGroup();
		self.densityCellsPointOneDegree = new L.FeatureGroup();
		self.densityCellsPointFiveDegree = new L.FeatureGroup();
		self.densityCellsPointTwoDegree = new L.FeatureGroup();

		self.densityCellsOneDegreeCache = new L.FeatureGroup();
		self.densityCellsPointOneDegreeCache = new L.FeatureGroup();
		self.densityCellsPointFiveDegreeCache = new L.FeatureGroup();
		self.densityCellsPointTwoDegreeCache = new L.FeatureGroup();

		// Grid table data
		self.gridItems = [];

		// Active distribution
		self.currentActiveDistribution = "none";

		// Help variables
		self.firstScrollRun = true;
		self.detailsFirstScrollRun = true;
		self.resumeFirstScrollRun = true;
		self.isFiltered = false;
		self.helpSearchText = "<p>Escriba un nombre científico y pulse en Agregar filtro.</p><p>Este filtro devolverá cualquier registro que posea un nombre que concuerde con el identificador dado del organismo, sin importar como está clasificado el organismo.</p>";
		self.totalFilters = 0;
		self.isRectangle = false;

		// Total occurrences data
		self.totalOccurrences = 0;
		self.totalGeoOccurrences = 0;
		self.totalOccurrencesCache = 0;
		self.totalGeoOccurrencesCache = 0;

		// Arrays for dropdowns
		self.countyDropdown = [];
		self.paramoDropdown = [];
		self.marineZoneDropdown = [];

		// Arrays for resume help windows
		self.resumeScientificNames = [];
		self.resumeCommonNames = [];
		self.resumeKingdomNames = [];
		self.resumePhylumNames = [];
		self.resumeClassNames = [];
		self.resumeOrderNames = [];
		self.resumeFamilyNames = [];
		self.resumeGenusNames = [];
		self.resumeSpeciesNames = [];
		self.resumeDataProviders = [];
		self.resumeDataResources = [];
		self.resumeInstitutionCodes = [];
		self.resumeCollectionCodes = [];
		self.resumeCountries = [];
		self.resumeDepartments = [];
		self.resumeCounties = [];
		self.resumeParamos = [];
		self.resumeMarineZones = [];
		self.isObjectNameHelpSelected = false;
		self.predicateOptions = "[{value: 'eq', name: 'es'}]";

		// Arrays of selected filters by kind
		self.selectedScientificNames = [];
		self.selectedCommonNames = [];
		self.selectedTaxonNames = [];
		self.selectedCountriesIDs = [];
		self.selectedDepartmentsIDs = [];
		self.selectedCountiesIDs = [];
		self.selectedParamosIDs = [];
		self.selectedMarineZonesIDs = [];
		self.selectedLatitudes = [];
		self.selectedLongitudes = [];
		self.selectedAltitudes = [];
		self.selectedDeeps = [];
		self.selectedCoordinate = [];
		self.selectedProviders = [];
		self.selectedResources = [];
		self.selectedDateRanges = [];
		self.selectedYearRanges = [];
		self.selectedYears = [];
		self.selectedMonths = [];
		self.selectedInstitutionCodes = [];
		self.selectedCollectionCodes = [];
		self.selectedCatalogNumbers = [];
		self.selectedOnMapPoligonCoordinates = [];
		self.selectedOnMapRadialCoordinates = [];

		// Array of current occurrences details
		self.occurrencesDetails = [];

		// Filter variables
		self.selectedSubject = 0;
		self.selectedPredicate = "";
		self.objectNameValue = "";
		self.selectedCountry = "";
		self.selectedDepartment = "";
		self.selectedCounty = "";
		self.selectedParamo = "";
		self.selectedMarineZone = "";
		self.selectedCoordinateState = "";

		// Download URLs
		self.urlDownloadSpreadsheet = "";
		self.urlDownloadSpreadsheetWithURL = "";

		// Resume info
		self.resumesInfo = [];
		self.resumesInfoFilter = [];

		self.occurrence = {};

		BaseViewModel.apply( this, arguments );
	};

	_.extend(OccurrenceSearchViewModel.prototype, BaseViewModel.prototype, self.densityCellsOneDegree, {
		initialize: function() {
			var self = this;
			this.loadCountyDropdownData();
			this.loadParamoDropdownData();
			this.loadMarineZoneDropdownData();
			this.loadGridData();
			this.loadCellDensityOneDegree();
			this.loadCellDensityPointFiveDegree();
			this.loadCellDensityPointTwoDegree();
			this.loadCellDensityPointOneDegree();

			markers = new L.MarkerClusterGroup({
				spiderfyOnMaxZoom: true,
				showCoverageOnHover: true,
				zoomToBoundsOnClick: true,
				removeOutsideVisibleBounds: true
			});

			map.on('zoomend', function(e) {
				if(e.target._zoom >= 13) {
					$("#densityInstructionsCellSelection").removeClass("occult-element");
					switch(self.currentActiveDistribution()) {
						case "oneDegree":
							map.removeLayer(self.densityCellsOneDegree());
							break;
						case "pointOneDegree":
							map.removeLayer(self.densityCellsPointOneDegree());
							break;
						case "pointFiveDegree":
							map.removeLayer(self.densityCellsPointFiveDegree());
							break;
						case "pointTwoDegree":
							map.removeLayer(self.densityCellsPointTwoDegree());
							break;
					}
				} else {
					if(map.hasLayer(markers)) {
						map.removeLayer(markers);
					}
					$("#distributionCells").prop('checked', false);
					$("#occurrenceRecord").prop('checked', true);
					$("#densityInstructionsCellSelection").addClass("occult-element");
					switch(self.currentActiveDistribution()) {
						case "oneDegree":
							map.addLayer(self.densityCellsOneDegree());
							break;
						case "pointOneDegree":
							map.addLayer(self.densityCellsPointOneDegree());
							break;
						case "pointFiveDegree":
							map.addLayer(self.densityCellsPointFiveDegree());
							break;
						case "pointTwoDegree":
							map.addLayer(self.densityCellsPointTwoDegree());
							break;
					}
				}
		  });

		  map.on('moveend', function(e) {
		  	var data = ko.toJSON(self.fillSearchConditions());
		  	if(e.target._zoom >= 13 && !sidebar.isVisible()) {
		  		if(map.hasLayer(markers)) {
						map.removeLayer(markers);
						markers.clearLayers();
					}
					$.ajax({
						contentType: 'application/json',
						type: 'POST',
						url: '/rest/occurrences/boundingbox/'+map.getBounds()._northEast.lat+'/'+map.getBounds()._southWest.lat+'/'+map.getBounds()._southWest.lng+'/'+map.getBounds()._northEast.lng,
						data: data,
						beforeSend: function() {
							//self.hideMapAreaWithSpinner();
						},
						complete: function() {
							//self.showMapAreaWithSpinner();
						},
						success: function(allData) {
							$.each(allData.hits.hits, function(i, occurrence) {
								var marker = new L.Marker([occurrence._source.location.lat, occurrence._source.location.lon], {clickable: true, zIndexOffset: 1000, title: occurrence._source.canonical});
								marker.bindPopup("<strong>Nombre científico</strong></br><strong><a href=\"http://data.sibcolombia.net/occurrences/"+occurrence._source.id+"\" target=\"_blank\">"+occurrence._source.canonical.toUpperCase()+"</a></strong></br></br><strong>Ubicación:</strong></br>Latitud: "+occurrence._source.location.lat+"</br>Longitud: "+occurrence._source.location.lon);
								marker.on('click', function (a) {
									$.getJSON("/rest/occurrences/id/"+occurrence._source.id, function(allData) {
										self.occurrence(new Occurrence(allData.hits.hits[0]._source));
									});
								});
								marker.on('popupopen', function (a) {
									$("#contentDetails").removeClass("occult-element");
									sidebar.show();
								});
								marker.on('popupclose', function (a) {
									$("#contentDetails").addClass("occult-element");
									sidebar.hide();
								});
								markers.addLayer(marker);
							});
							if($("#occurrenceRecord").is(':checked')) {
								map.addLayer(markers);
							}
						},
						dataType: 'jsonp'
					});
		  	}
		  });

			$('#distributionCells').click(function () {
				if(this.checked) {
					switch(self.currentActiveDistribution()) {
						case "oneDegree":
							map.addLayer(self.densityCellsOneDegree());
							break;
						case "pointOneDegree":
							map.addLayer(self.densityCellsPointOneDegree());
							break;
						case "pointFiveDegree":
							map.addLayer(self.densityCellsPointFiveDegree());
							break;
						case "pointTwoDegree":
							map.addLayer(self.densityCellsPointTwoDegree());
							break;
					}
				} else {
					switch(self.currentActiveDistribution()) {
						case "oneDegree":
							map.removeLayer(self.densityCellsOneDegree());
							break;
						case "pointOneDegree":
							map.removeLayer(self.densityCellsPointOneDegree());
							break;
						case "pointFiveDegree":
							map.removeLayer(self.densityCellsPointFiveDegree());
							break;
						case "pointTwoDegree":
							map.removeLayer(self.densityCellsPointTwoDegree());
							break;
					}
				}
			});

			$('#occurrenceRecord').click(function () {
				if(this.checked) {
					map.addLayer(markers);
				} else {
					map.removeLayer(markers);
				}
			});

			map.on('draw:created', function(e) {
				self.isRectangle(false);
				var type = e.layerType;
				if(featureGroup.getLayers().length > 0)
					self.totalFilters(self.totalFilters()-1);
				featureGroup.clearLayers();
				self.selectedOnMapPoligonCoordinates.removeAll();
				self.selectedOnMapRadialCoordinates.removeAll();
				if(type === 'circle') {
					self.selectedOnMapRadialCoordinates.push(new RadialCoordinate({lat: e.layer._latlng.lat, lng: e.layer._latlng.lng, radius: e.layer._mRadius}));
				} else {
					_.each(e.layer._latlngs, function(location) {
						self.selectedOnMapPoligonCoordinates.push(new Coordinate({lat: location.lat, lng: location.lng}));
					});
					if(type === "rectangle")
						self.isRectangle(true);
				}
				featureGroup.addLayer(e.layer);
				self.totalFilters(self.totalFilters()+1);
			});

			map.on('draw:edited', function (e) {
				var layers = e.layers;
				self.selectedOnMapPoligonCoordinates.removeAll();
				self.selectedOnMapRadialCoordinates.removeAll();
				layers.eachLayer(function (layer) {
					if(typeof layer._mRadius !== 'undefined') {
						self.selectedOnMapRadialCoordinates.push(new RadialCoordinate({lat: layer._latlng.lat, lng: layer._latlng.lng, radius: layer._mRadius}));
					} else {
						_.each(layer._latlngs, function(location) {
							self.selectedOnMapPoligonCoordinates.push(new Coordinate({lat: location.lat, lng: location.lng}));
						});
					}
				});
			});

			map.on('draw:deleted', function (e) {
				self.selectedOnMapPoligonCoordinates.removeAll();
				self.selectedOnMapRadialCoordinates.removeAll();
				self.totalFilters(self.totalFilters()-1);
				self.isRectangle(false);
			});

			var timeout;

			var searchParamsResume = function() {
				self.predicateOptions([{value: 'eq', name: 'es'}]);
				self.hideResumeContainer();
				self.getSearchResumeData();
			};

			// Underscore.js implementation
			var debounce = function (func, wait, immediate) {
				var result;
				return function () {
					var context = this, args = arguments;
					var later = function () {
						timeout = null;
						if (!immediate) result = func.apply(context, args);
					};
					var callNow = immediate && !timeout;
					clearTimeout(timeout);
					timeout = setTimeout(later, wait);
					if (callNow) result = func.apply(context, args);
					return result;
				};
			};

			// Event subscription
			self.objectNameValue.subscribe(function (newValue) {
				debounce(searchParamsResume, 500)();
			});

			searchParamsResume();
			// Selected department filter name
			self.dropDownCoordinateStateText = ko.computed(function() {
				return $("#dropDownCoordinateState option[value='" + self.selectedCoordinateState() + "']").text();
			});

			ko.bindingHandlers.selectCountry = {
				init: function(element, valueAccessor, allBindingsAccessor) {
					var obj = valueAccessor();
					$(element).select2(obj);

					ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
						$(element).select2('destroy');
					});

					$(element).on("change", function(e) {
						if(typeof e.val !== 'undefined') {
							self.objectNameValue(e.val);
							self.hideResumeContainer();
							self.getSearchResumeData();
							self.enableFilterHelp();
						}
					});
				},
				update: function(element) {
					$(element).trigger('change');
				}
			};

			ko.bindingHandlers.selectDepartment = {
				init: function(element, valueAccessor, allBindingsAccessor) {
					var obj = valueAccessor();
					$(element).select2(obj);

					ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
						$(element).select2('destroy');
					});

					$(element).on("change", function(e) {
						if(typeof e.val !== 'undefined') {
							self.objectNameValue(e.val);
							self.hideResumeContainer();
							self.getSearchResumeData();
							self.enableFilterHelp();
						}
					});
				},
				update: function(element) {
					$(element).trigger('change');
				}
			};

			ko.bindingHandlers.selectCounty = {
				init: function(element, valueAccessor, allBindingsAccessor) {
					var obj = valueAccessor();
					$(element).select2(obj);

					ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
						$(element).select2('destroy');
					});

					$(element).on("change", function(e) {
						if(typeof e.val !== 'undefined') {
							self.objectNameValue(e.val);
							self.hideResumeContainer();
							self.getSearchResumeData();
							self.enableFilterHelp();
						}
					});
				},
				update: function(element) {
					$(element).trigger('change');
				}
			};

			ko.bindingHandlers.selectParamo = {
				init: function(element, valueAccessor, allBindingsAccessor) {
					var obj = valueAccessor();
					$(element).select2(obj);

					ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
						$(element).select2('destroy');
					});

					$(element).on("change", function(e) {
						if(typeof e.val !== 'undefined') {
							self.objectNameValue(e.val);
							self.hideResumeContainer();
							self.getSearchResumeData();
							self.enableFilterHelp();
						}
					});
				},
				update: function(element) {
					$(element).trigger('change');
				}
			};

			ko.bindingHandlers.selectMarineZone = {
				init: function(element, valueAccessor, allBindingsAccessor) {
					var obj = valueAccessor();
					$(element).select2(obj);

					ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
						$(element).select2('destroy');
					});

					$(element).on("change", function(e) {
						if(typeof e.val !== 'undefined') {
							self.objectNameValue(e.val);
							self.hideResumeContainer();
							self.getSearchResumeData();
							self.enableFilterHelp();
						}
					});
				},
				update: function(element) {
					$(element).trigger('change');
				}
			};

			$(".leaflet-control-layers-overlays" ).prepend('<div id="unselect_all_layers"><button class="btn btn-info btn-mini" type="button" id="unselectLayersButton">Desmarcar todas las capas elegidas</button></div>');
			$("#unselectLayersButton").click(function() {
				$(".leaflet-control-layers-overlays > label > input").each(function(i) {
					if ($(this).is(":checked")) {
						$(this).click();
					}
				});
			});

			kendo.culture("es-CO");


		},
		loadGridData: function() {
			var self = this;
			self.gridOptions = {
				data: false,
				dataSource: {
					type: "jsonp",
					serverPaging: true,
					serverSorting: true,
					serverFiltering: true,
					allowUnsort: true,
					pageSize: 20,
					transport: {
						read: {
							url: "/occurrences/PagedData",
							type: "GET",
							dataType: "jsonp",
							contentType: "application/json; charset=utf-8"
						}
					},
					schema: {
						data: function(data) {
							self.gridItems = ko.observableArray();
							$.each(data.hits.hits, function(i, occurrence) {
								self.gridItems.push(new Occurrence(occurrence._source));
							});
							self.totalOccurrences(data.hits.total);
							return self.gridItems();
						},
						total: function(data) {
							return data.hits.total;
						},
						model: {
							fields: {
								id: {type: "string"},
								canonical: {type: "string"},
								data_resource_name: {type: "string"},
								institution_code: {type: "string"},
								collection_code: {type: "string"},
								catalogue_number: {type: "string"},
								basis_of_record_name_spanish: {type: "string"},
								occurrence_date: {type: "date", format: "{0:yyyy-MM-dd}"},
								country_name: {type: "string"},
								department_name: {type: "string"}
							}
						}
					}
				},
				filterable: {
					messages: {
						or: "o",
						and: "y",
						info: "Filtrar con condición:",
						filter: "Aplicar filtros",
						clear: "Quitar filtros"
					},
					operators: {
						string: {
							contains: "Contiene",
							doesnotcontain: "No contiene",
							eq: "Igual a",
							neq: "No igual a",
							startswith: "Comienza con",
							endswith: "Termina con"
						},
						date: {
							eq: "Igual a",
							neq: "No igual a",
							gte: "Después o igual a",
							lte: "Antes o igual a",
							gt: "Después de",
							lt: "Antes de"
						}
					}
				},
				reorderable: true,
				resizable: true,
				sortable: true,
				scrollable: true,
				pageable: {
					pageSize: 20,
					pageSizes: [20, 30, 50, 100],
					buttonCount: 5,
					input: true,
					messages: {
						display: "{0}-{1} de {2} registros biológicos",
						empty: "No hay registros biológicos",
						page: "Página",
						of: "de {0}",
						itemsPerPage: "registros biológicos por página",
						first: "Primera página",
						last: "Última página",
						next: "Siguiente página",
						previous: "Anterior página"
					}
				},
				groupable: {
					messages: {
						empty: "Arrastre un encabezado de columna a esta zona para agrupar por dicha columna."
					}
				},
				columns: [
					{ field: "id", title: "ID", width: "5%", filterable: {operators: {string: {eq: "Igual a", neq: "No igual a"}}} },
					{ field: "canonical", title: "Nombre científico", width: "13%",  template: '<a target="_blank" href="http://data.sibcolombia.net/occurrences/#=id#">#=canonical#</a>' },
					{ field: "data_resource_name", title: "Recurso de datos", width: "13%" },
					{ field: "institution_code", title: "Cód. institución", width: "11%" },
					{ field: "collection_code", title: "Cód. colección", width: "10%" },
					{ field: "catalogue_number", title: "Núm. catálogo", width: "10%" },
					{ field: "basis_of_record_name_spanish", title: "Base registro", width: "10%", filterable: {ui: basisOfRecordFilter} },
					{ field: "occurrence_date", title: "Fecha", width: "8%", template: '#= kendo.toString(occurrence_date, "yyyy-MM-dd") #', filterable: {ui: dateTimeEditor} },
					{ field: "location()", title: "Coordenadas", width: "8%", sortable: false, filterable: false },
					{ field: "country_name", title: "País", width: "6%", sortable: true },
					{ field: "department_name", title: "Dept.", width: "8%", sortable: true }
				]
			};

			function dateTimeEditor(element) {
				element.kendoDatePicker({
					format:"yyyy-MM-dd",
					min: new Date(1000, 0, 1),
					max: new Date(10000, 0, 1)
				});
			};

			function basisOfRecordFilter(element) {
				var data = [
					{ text: "Espécimen Preservado", value: "espécimen preservado" },
					{ text: "Espécimen Fosilizado", value: "espécimen fosilizado" },
					{ text: "Espécimen Vivo", value: "espécimen vivo" },
					{ text: "Observación Humana", value: "observación humana" },
					{ text: "Observación con Máquina", value: "observación con máquina" },
					{ text: "Imagen Fija", value: "imagen fija" },
					{ text: "Imagen en Movimiento", value: "imagen en movimiento" },
					{ text: "Grabación de Sonido", value: "grabación de sonido" },
					{ text: "Otro Espécimen", value: "otro espécimen" },
					{ text: "Desconocido", value: "desconocido" }
				];
				element.kendoDropDownList({
					dataTextField: "text",
					dataValueField: "value",
					dataSource: data,
					optionLabel: "-- Seleccione --"
				});
			};

			$('input[type=range]').rangeslider({
				polyfill: false,
				onInit: function() {
					var actualDensity = "1.0° x 1.0°";
				},
				onSlideEnd: function(position, value) {
					if(self.currentActiveDistribution() != "none") {
						// Disable current active button
						switch(self.currentActiveDistribution()) {
							case "oneDegree":
								map.removeLayer(self.densityCellsOneDegree());
								break;
							case "pointOneDegree":
								map.removeLayer(self.densityCellsPointOneDegree());
								break;
							case "pointFiveDegree":
								map.removeLayer(self.densityCellsPointFiveDegree());
								break;
							case "pointTwoDegree":
								map.removeLayer(self.densityCellsPointTwoDegree());
								break;
						}
					}
					switch(value) {
						case 0:
							map.addLayer(self.densityCellsPointOneDegree());
							self.currentActiveDistribution("pointOneDegree");
							$("#distributionCells").prop('checked', true);
							break;
						case 1:
							map.addLayer(self.densityCellsPointTwoDegree());
							self.currentActiveDistribution("pointTwoDegree");
							$("#distributionCells").prop('checked', true);
							break;
						case 2:
							map.addLayer(self.densityCellsPointFiveDegree());
							self.currentActiveDistribution("pointFiveDegree");
							$("#distributionCells").prop('checked', true);
							break;
						case 3:
							map.addLayer(self.densityCellsOneDegree());
							self.currentActiveDistribution("oneDegree");
							$("#distributionCells").prop('checked', true);
							break;
					}
				}
			});

		},
		loadCountyDropdownData: function() {
			var self = this;
			$.getJSON("/rest/occurrences/counties/list", function(allData) {
				var newCounties = ko.utils.arrayMap(allData.aggregations.county_name.buckets, function(county) {
					return new County({departmentName: county.iso_county_code.buckets[0].department_name.buckets[0].key, countyName: county.key, isoCountyCode: county.iso_county_code.buckets[0].key});
				});
				self.countyDropdown.push.apply(self.countyDropdown, newCounties);
			});
		},
		loadParamoDropdownData: function() {
			var self = this;
			$.getJSON("/rest/occurrences/paramos/list", function(allData) {
				var newParamos = ko.utils.arrayMap(allData.aggregations.paramo_name.buckets, function(paramo) {
					return new Paramo({paramoName: paramo.key, paramoCode: paramo.paramo_code.buckets[0].key});
				});
				self.paramoDropdown.push.apply(self.paramoDropdown, newParamos);
			});
		},
		loadMarineZoneDropdownData: function() {
			var self = this;
			$.getJSON("/rest/occurrences/marinezones/list", function(allData) {
				var newMarineZones = ko.utils.arrayMap(allData.aggregations.marine_zone_name.buckets, function(marinezone) {
					return new MarineZone({marineZoneName: marinezone.key, marineZoneCode: marinezone.marine_zone_code.buckets[0].key});
				});
				self.marineZoneDropdown.push.apply(self.marineZoneDropdown, newMarineZones);
			});
		},
		loadCellDensityOneDegree: function() {
			var self = this;
			// Hide map area
			self.hideMapAreaWithSpinner();
			// Initialize default cell density distribution (one degree)
			map.addLayer(self.densityCellsOneDegree());
			$.getJSON("/rest/distribution/onedegree/list", function(allData) {
				$.each(allData.hits.hits, function(i, cell) {
					var bounds = [[cell._source.location_cell.lat, cell._source.location_cell.lon], [cell._source.location_cell.lat+1, cell._source.location_cell.lon+1]];
					var color = "#ff7800";
					if (cell._source.count > 0 && cell._source.count < 10) {
						color = "#FFFF00";
					} else if(cell._source.count > 9 && cell._source.count < 100) {
						color = "#FFCC00";
					} else if(cell._source.count > 99 && cell._source.count < 1000) {
						color = "#FF9900";
					} else if(cell._source.count > 999 && cell._source.count < 10000) {
						color = "#FF6600";
					} else if(cell._source.count > 9999 && cell._source.count < 100000) {
						color = "#FF3300";
					} else if(cell._source.count > 99999) {
						color = "#CC0000";
					}
					var densityCell = new L.rectangle(bounds, {color: color, weight: 1, fill: true, fillOpacity: 0.5, cellID: cell._source.cell_id});
					densityCell.on('click', function (a) {
						a.target.bindPopup("<strong>No. registros: </strong>" + cell._source.count + "</br></br><strong>Ubicación:</strong></br>[" + cell._source.location_cell.lat + ", " + cell._source.location_cell.lon + "] [" + (cell._source.location_cell.lat+1) + ", " + (cell._source.location_cell.lon+1) + "]").openPopup();
					});
					self.densityCellsOneDegree().addLayer(densityCell);
				});
				self.totalGeoOccurrences(allData.aggregations.stats.sum);
				self.totalGeoOccurrencesCache(allData.aggregations.stats.sum);

				self.densityCellsOneDegree().on('click', function (a) {
					// Hide map area
					self.hideMapAreaWithSpinner();
					$.getJSON("/rest/distribution/onedegree/stats/"+a.layer.options.cellID, function(allData) {
						self.fillCellDensityData(allData, a);
					});
				});
				self.showMapAreaWithSpinner();
				self.currentActiveDistribution("oneDegree");
				jQuery.extend(self.densityCellsOneDegreeCache(),self.densityCellsOneDegree());
			});
		},
		loadCellDensityPointOneDegree: function() {
			var self = this;
			// Initialize default cell density distribution (one degree)
			var densityCellsPointOneDegree = new L.FeatureGroup();
			$.getJSON("/rest/distribution/centidegree/list", function(allData) {
				$.each(allData.hits.hits, function(i, cell) {
					var bounds = [[cell._source.location_centi_cell.lat, cell._source.location_centi_cell.lon], [cell._source.location_centi_cell.lat+0.1, cell._source.location_centi_cell.lon+0.1]];
					var color = "#ff7800";
					if (cell._source.count > 0 && cell._source.count < 10) {
						color = "#FFFF00";
					} else if(cell._source.count > 9 && cell._source.count < 100) {
						color = "#FFCC00";
					} else if(cell._source.count > 99 && cell._source.count < 1000) {
						color = "#FF9900";
					} else if(cell._source.count > 999 && cell._source.count < 10000) {
						color = "#FF6600";
					} else if(cell._source.count > 9999 && cell._source.count < 100000) {
						color = "#FF3300";
					} else if(cell._source.count > 99999) {
						color = "#CC0000";
					}
					var densityCell = new L.rectangle(bounds, {color: color, weight: 1, fill: true, fillOpacity: 0.5, cellID: cell._source.cell_id, centicellID: cell._source.centi_cell_id});
					densityCell.on('click', function (a) {
						a.target.bindPopup("<strong>No. registros: </strong>" + cell._source.count + "</br></br><strong>Ubicación:</strong></br>[" + cell._source.location_centi_cell.lat + ", " + cell._source.location_centi_cell.lon + "] [" + (((cell._source.location_centi_cell.lat*10)+1)/10) + ", " + (((cell._source.location_centi_cell.lon*10)+1)/10) + "]").openPopup();
					});
					self.densityCellsPointOneDegree().addLayer(densityCell);
				});

				self.densityCellsPointOneDegree().on('click', function (a) {
					// Hide map area
					self.hideMapAreaWithSpinner();
					$.getJSON("/rest/distribution/centidegree/stats/"+a.layer.options.cellID+"/"+a.layer.options.centicellID, function(allData) {
						self.fillCellDensityData(allData, a);
					});
				});
				// Show map area
				jQuery.extend(self.densityCellsPointOneDegreeCache(),self.densityCellsPointOneDegree());
			});
		},
		loadCellDensityPointFiveDegree: function() {
			var self = this;
			// Initialize default cell density distribution (five degrees)
			var densityCellsPointFiveDegree = new L.FeatureGroup();
			$.getJSON("/rest/distribution/pointfivedegree/list", function(allData) {
				$.each(allData.hits.hits, function(i, cell) {
					var bounds = [[cell._source.location_pointfive_cell.lat, cell._source.location_pointfive_cell.lon], [cell._source.location_pointfive_cell.lat+0.5, cell._source.location_pointfive_cell.lon+0.5]];
					var color = "#ff7800";
					if (cell._source.count > 0 && cell._source.count < 10) {
						color = "#FFFF00";
					} else if(cell._source.count > 9 && cell._source.count < 100) {
						color = "#FFCC00";
					} else if(cell._source.count > 99 && cell._source.count < 1000) {
						color = "#FF9900";
					} else if(cell._source.count > 999 && cell._source.count < 10000) {
						color = "#FF6600";
					} else if(cell._source.count > 9999 && cell._source.count < 100000) {
						color = "#FF3300";
					} else if(cell._source.count > 99999) {
						color = "#CC0000";
					}
					var densityCell = new L.rectangle(bounds, {color: color, weight: 1, fill: true, fillOpacity: 0.5, cellID: cell._source.cell_id, pointfivecellID: cell._source.pointfive_cell_id});
					densityCell.on('click', function (a) {
						a.target.bindPopup("<strong>No. registros: </strong>" + cell._source.count + "</br></br><strong>Ubicación:</strong></br>[" + cell._source.location_pointfive_cell.lat + ", " + cell._source.location_pointfive_cell.lon + "] [" + (((cell._source.location_pointfive_cell.lat*10)+5)/10) + ", " + (((cell._source.location_pointfive_cell.lon*10)+5)/10) + "]").openPopup();
					});
					self.densityCellsPointFiveDegree().addLayer(densityCell);
				});

				self.densityCellsPointFiveDegree().on('click', function (a) {
					// Hide map area
					self.hideMapAreaWithSpinner();
					$.getJSON("/rest/distribution/pointfivedegree/stats/"+a.layer.options.cellID+"/"+a.layer.options.pointfivecellID, function(allData) {
						self.fillCellDensityData(allData, a);
					});
				});
				jQuery.extend(self.densityCellsPointFiveDegreeCache(),self.densityCellsPointFiveDegree());
			});
		},
		loadCellDensityPointTwoDegree: function() {
			var self = this;
			// Initialize default cell density distribution (two degrees)
			var densityCellsPointTwoDegree = new L.FeatureGroup();
			$.getJSON("/rest/distribution/pointtwodegree/list", function(allData) {
				$.each(allData.hits.hits, function(i, cell) {
					var bounds = [[cell._source.location_pointtwo_cell.lat, cell._source.location_pointtwo_cell.lon], [cell._source.location_pointtwo_cell.lat+0.2, cell._source.location_pointtwo_cell.lon+0.2]];
					var color = "#ff7800";
					if (cell._source.count > 0 && cell._source.count < 10) {
						color = "#FFFF00";
					} else if(cell._source.count > 9 && cell._source.count < 100) {
						color = "#FFCC00";
					} else if(cell._source.count > 99 && cell._source.count < 1000) {
						color = "#FF9900";
					} else if(cell._source.count > 999 && cell._source.count < 10000) {
						color = "#FF6600";
					} else if(cell._source.count > 9999 && cell._source.count < 100000) {
						color = "#FF3300";
					} else if(cell._source.count > 99999) {
						color = "#CC0000";
					}
					var densityCell = new L.rectangle(bounds, {color: color, weight: 1, fill: true, fillOpacity: 0.5, cellID: cell._source.cell_id, pointtwocellID: cell._source.pointtwo_cell_id});
					densityCell.on('click', function (a) {
						a.target.bindPopup("<strong>No. registros: </strong>" + cell._source.count + "</br></br><strong>Ubicación:</strong></br>[" + cell._source.location_pointtwo_cell.lat + ", " + cell._source.location_pointtwo_cell.lon + "] [" + (((cell._source.location_pointtwo_cell.lat*10)+2)/10) + ", " + (((cell._source.location_pointtwo_cell.lon*10)+2)/10) + "]").openPopup();
					});
					self.densityCellsPointTwoDegree().addLayer(densityCell);
				});

				self.densityCellsPointTwoDegree().on('click', function (a) {
					// Hide map area
					self.hideMapAreaWithSpinner();
					$.getJSON("/rest/distribution/pointtwodegree/stats/"+a.layer.options.cellID+"/"+a.layer.options.pointtwocellID, function(allData) {
						self.fillCellDensityData(allData, a);
					});
				});
				jQuery.extend(self.densityCellsPointTwoDegreeCache(),self.densityCellsPointTwoDegree());
			});
		},
		disableOccurrencesDetail: function() {
			if(!$("#occurrenceDetail").is(':hidden')) {
				$("#occurrenceDetail").animate({width: 'toggle'});
			}
		},
		disableFilterHelp: function() {
			if(this.isObjectNameHelpSelected() === true || !$("#filtersContainerHelp").is(':hidden')) {
				this.isObjectNameHelpSelected = ko.observable(false);
				$("#filtersContainerHelp").animate({width: 'toggle'});
			}
		},
		changeFilterHelp: function() {
			var self = this;
			if($("#s2id_dropDownCountry").length && self.selectedSubject() != 5) {
				$("#dropDownCountry").select2('destroy');
				$("#dropDownCountry").css({display: 'none'});
			}
			if($("#s2id_dropDownDepartment").length && self.selectedSubject() != 38) {
				$("#dropDownDepartment").select2('destroy');
				$("#dropDownDepartment").css({display: 'none'});
			}
			if($("#s2id_dropDownCounty").length && self.selectedSubject() != 39) {
				$("#dropDownCounty").select2('destroy');
				$("#dropDownCounty").css({display: 'none'});
			}
			if($("#s2id_dropDownParamo").length && self.selectedSubject() != 40) {
				$("#dropDownParamo").select2('destroy');
				$("#dropDownParamo").css({display: 'none'});
			}
			if($("#s2id_dropDownMarineZone").length && self.selectedSubject() != 41) {
				$("#dropDownMarineZone").select2('destroy');
				$("#dropDownMarineZone").css({display: 'none'});
			}
			$("#filtersContainerHelp").css({display: 'none'});
			// Clear actual resume filter
			self.objectNameValue("");

			self.isObjectNameHelpSelected = ko.observable(false);
			self.hideResumeContainer();
			// Default filters predicate
			self.predicateOptions([{value: 'eq', name: 'es'}]);
			if(self.selectedSubject() == 1 || self.selectedSubject() == 2 || self.selectedSubject() == 34 || self.selectedSubject() == 35) {
				self.predicateOptions([{value: 'eq', name: 'es'},{value: 'gt', name: 'mayor que'},{value: 'lt', name: 'menor que'}]);
			} else if(self.selectedSubject() == 5) {
				// Get countries resume data
				self.getSearchResumeData();
				self.isObjectNameHelpSelected = ko.observable(true);
				$("#filtersContainerHelp").animate({width: 'toggle'}, 500, "swing");
				$("#dropDownCountry").select2({
					placeholder: "Seleccione un país"
				});
				$(".select2-input").on("click", function(event) {
					self.enableFilterHelp();
				});
			} else if(self.selectedSubject() == 38) {
				// Get countries resume data
				self.getSearchResumeData();
				self.isObjectNameHelpSelected = ko.observable(true);
				$("#filtersContainerHelp").animate({width: 'toggle'}, 500, "swing");
				$("#dropDownDepartment").select2({
					placeholder: "Seleccione un departamento"
				});
				$(".select2-input").on("click", function(event) {
					self.enableFilterHelp();
				});
			} else if(self.selectedSubject() == 39) {
				// Get countries resume data
				self.getSearchResumeData();
				self.isObjectNameHelpSelected = ko.observable(true);
				$("#filtersContainerHelp").animate({width: 'toggle'}, 500, "swing");
				$("#dropDownCounty").select2({
					placeholder: "Seleccione un municipio"
				});
				$(".select2-input").on("click", function(event) {
					self.enableFilterHelp();
				});
			} else if(self.selectedSubject() == 40) {
				// Get countries resume data
				self.getSearchResumeData();
				self.isObjectNameHelpSelected = ko.observable(true);
				$("#filtersContainerHelp").animate({width: 'toggle'}, 500, "swing");
				$("#dropDownParamo").select2({
					placeholder: "Seleccione un páramo"
				});
				$(".select2-input").on("click", function(event) {
					self.enableFilterHelp();
				});
			} else if(self.selectedSubject() == 41) {
				// Get countries resume data
				self.getSearchResumeData();
				self.isObjectNameHelpSelected = ko.observable(true);
				$("#filtersContainerHelp").animate({width: 'toggle'}, 500, "swing");
				$("#dropDownMarineZone").select2({
					placeholder: "Seleccione una zona marina"
				});
				$(".select2-input").on("click", function(event) {
					self.enableFilterHelp();
				});
			} else {
				self.getSearchResumeData();
			}
			self.getHelpSearchText();
		},
		getHelpSearchText: function() {
			var self = this;
			$.getJSON("/rest/occurrences/searchhelptext/name/"+self.selectedSubject(), function(allData) {
				self.helpSearchText(allData.hits.hits[0]._source.text);
			});
		},
		enableFilterHelp: function() {
			var self = this;
			self.disableResumeDetail();
			if((self.isObjectNameHelpSelected() === false || $("#filtersContainerHelp").is(':hidden')) && self.selectedSubject() != 1 && self.selectedSubject() != 2 && self.selectedSubject() != 34 && self.selectedSubject() != 35 && self.selectedSubject() != 21 && self.selectedSubject() != 14) {
				self.isObjectNameHelpSelected = ko.observable(true);
				$("#filtersContainerHelp").animate({width: 'toggle'}, 500, "swing");
			}
		},
		addFilterItem: function() {
			var self = this;
			if(self.objectNameValue() !== "") {
				if(self.selectedSubject() == "0") {
					// Adding scientific name filter
					self.addScientificName();
				} else if(self.selectedSubject() == 31) {
					// Adding common name filter
					self.addCommonName();
				} else if(self.selectedSubject() == 100) {
					self.addTaxonName(self.selectedSubject(), "kingdom");
				} else if(self.selectedSubject() == 101) {
					self.addTaxonName(self.selectedSubject(), "phylum");
				} else if(self.selectedSubject() == 102) {
					self.addTaxonName(self.selectedSubject(), "class");
				} else if(self.selectedSubject() == 103) {
					self.addTaxonName(self.selectedSubject(), "order");
				} else if(self.selectedSubject() == 104) {
					self.addTaxonName(self.selectedSubject(), "family");
				} else if(self.selectedSubject() == 105) {
					self.addTaxonName(self.selectedSubject(), "genus");
				} else if(self.selectedSubject() == 106) {
					self.addTaxonName(self.selectedSubject(), "species");
				} else if(self.selectedSubject() == 5) {
					// Adding cuntry filter
					self.addCountryID();
				} else if(self.selectedSubject() == 38) {
					// Adding department filter
					self.addDepartmentID();
				} else if(self.selectedSubject() == 39) {
					// Adding county filter
					self.addCountyID();
				} else if(self.selectedSubject() == 40) {
					// Adding paramo filter
					self.addParamoID();
				} else if(self.selectedSubject() == 41) {
					// Adding paramo filter
					self.addMarineZoneID();
				} else if(self.selectedSubject() == 1) {
					// Adding latitude filter
					self.addLatitudeNumber();
				} else if(self.selectedSubject() == 2) {
					// Adding longitude filter
					self.addLongitudeNumber();
				} else if(self.selectedSubject() == 34) {
					// Adding altitude filter
					self.addAltitudeNumber();
				} else if(self.selectedSubject() == 35) {
					// Adding deep filter
					self.addDeepNumber();
				} else if(self.selectedSubject() == 28) {
					// Adding coordinate state filter
					self.addCoordinateState();
				} else if(self.selectedSubject() == 25) {
					// Adding data provider filter
					self.addDataProviderName();
				} else if(self.selectedSubject() == 24) {
					// Adding data resource filter
					self.addDataResourceName();
				}
			}
		},
		fillSearchConditions: function() {
			var response = {};
			var self = this;
			if(self.selectedScientificNames().length !== 0)
				response['scientificNames'] = self.selectedScientificNames();
			if(self.selectedCommonNames().length !== 0)
				response['commonNames'] = self.selectedCommonNames();
			if(self.selectedTaxonNames().length !== 0)
				response['taxons'] = self.selectedTaxonNames();
			if(self.selectedCountriesIDs().length !== 0)
				response['countries'] = self.selectedCountriesIDs();
			if(self.selectedDepartmentsIDs().length !== 0)
				response['departments'] = self.selectedDepartmentsIDs();
			if(self.selectedCountiesIDs().length !== 0)
				response['counties'] = self.selectedCountiesIDs();
			if(self.selectedParamosIDs().length !== 0)
				response['paramos'] = self.selectedParamosIDs();
			if(self.selectedMarineZonesIDs().length !== 0)
				response['marineZones'] = self.selectedMarineZonesIDs();
			if(self.selectedLatitudes().length !== 0)
				response['latitudes'] = self.selectedLatitudes();
			if(self.selectedLongitudes().length !== 0)
				response['longitudes'] = self.selectedLongitudes();
			if(self.selectedAltitudes().length !== 0)
				response['altitudes'] = self.selectedAltitudes();
			if(self.selectedDeeps().length !== 0)
				response['deeps'] = self.selectedDeeps();
			if(self.selectedCoordinate().length !== 0)
				response['coordinates'] = self.selectedCoordinate();
			if(self.selectedProviders().length !== 0)
				response['providers'] = self.selectedProviders();
			if(self.selectedResources().length !== 0)
				response['resources'] = self.selectedResources();
			if(self.selectedOnMapPoligonCoordinates().length !== 0)
				response['poligonalCoordinates'] = self.selectedOnMapPoligonCoordinates();
			if(self.selectedOnMapRadialCoordinates().length !== 0)
				response['radialCoordinates'] = self.selectedOnMapRadialCoordinates();
			return response;
		},
		startSearch: function() {
			var self = this;
			var data = ko.toJSON(self.fillSearchConditions());
			console.log(data);
			$.ajax({
				contentType: 'application/json',
				type: 'POST',
				url: '/distribution/search',
				data: data,
				beforeSend: function() {
					self.hideMapAreaWithSpinner();
				},
				complete: function() {
					self.showMapAreaWithSpinner();
				},
				success: function(returnedData) {
					map.removeLayer(self.densityCellsOneDegree());
					map.removeLayer(self.densityCellsPointOneDegree());
					map.removeLayer(self.densityCellsPointFiveDegree());
					map.removeLayer(self.densityCellsPointTwoDegree());

					self.densityCellsOneDegree(new L.FeatureGroup());
					self.densityCellsPointOneDegree(new L.FeatureGroup());
					self.densityCellsPointFiveDegree(new L.FeatureGroup());
					self.densityCellsPointTwoDegree(new L.FeatureGroup());

					map.addLayer(self.densityCellsOneDegree());
					$.each(returnedData.aggregations.cellgroup.buckets, function(i, cell) {
						var idAndLocation = cell.key.split("~~~");
						var bounds = [[parseFloat(idAndLocation[1]), parseFloat(idAndLocation[2])], [parseFloat(idAndLocation[1])+1, parseFloat(idAndLocation[2])+1]];
						var color = "#ff7800";
						if (cell.doc_count > 0 && cell.doc_count < 10) {
							color = "#FFFF00";
						} else if(cell.doc_count > 9 && cell.doc_count < 100) {
							color = "#FFCC00";
						} else if(cell.doc_count > 99 && cell.doc_count < 1000) {
							color = "#FF9900";
						} else if(cell.doc_count > 999 && cell.doc_count < 10000) {
							color = "#FF6600";
						} else if(cell.doc_count > 9999 && cell.doc_count < 100000) {
							color = "#FF3300";
						} else if(cell.doc_count > 99999) {
							color = "#CC0000";
						}
						var densityCell = new L.rectangle(bounds, {color: color, weight: 1, fill: true, fillOpacity: 0.5, cellID: idAndLocation[0]});
						densityCell.on('click', function (a) {
							a.target.bindPopup("<strong>No. registros: </strong>" + cell.doc_count + "</br></br><strong>Ubicación:</strong></br>[" + idAndLocation[1] + ", " + idAndLocation[2] + "] [" + (parseFloat(idAndLocation[1])+1) + ", " + (parseFloat(idAndLocation[2])+1) + "]").openPopup();
						});
						self.densityCellsOneDegree().addLayer(densityCell);
					});
					self.densityCellsOneDegree().on('click', function (a) {
						data = self.fillSearchConditions();
						data["cellid"] = a.layer.options.cellID;
						data = ko.toJSON(data);
						$.ajax({
							contentType: 'application/json',
							type: 'POST',
							url: '/distribution/onedegree/stats',
							data: data,
							beforeSend: function() {
								self.hideMapAreaWithSpinner();
							},
							complete: function() {
								self.showMapAreaWithSpinner();
							},
							success: function(allData) {
								self.fillCellDensityData(allData, a);
							},
							dataType: 'jsonp'
						});
					});

					$.each(returnedData.aggregations.pointfivegroup.buckets, function(i, cell) {
						var idAndLocation = cell.key.split("~~~");
						var bounds = [[parseFloat(idAndLocation[2]), parseFloat(idAndLocation[3])], [parseFloat(idAndLocation[2])+0.5, parseFloat(idAndLocation[3])+0.5]];
						var color = "#ff7800";
						if (cell.doc_count > 0 && cell.doc_count < 10) {
							color = "#FFFF00";
						} else if(cell.doc_count > 9 && cell.doc_count < 100) {
							color = "#FFCC00";
						} else if(cell.doc_count > 99 && cell.doc_count < 1000) {
							color = "#FF9900";
						} else if(cell.doc_count > 999 && cell.doc_count < 10000) {
							color = "#FF6600";
						} else if(cell.doc_count > 9999 && cell.doc_count < 100000) {
							color = "#FF3300";
						} else if(cell.doc_count > 99999) {
							color = "#CC0000";
						}
						var densityCell = new L.rectangle(bounds, {color: color, weight: 1, fill: true, fillOpacity: 0.5, cellID: idAndLocation[0], pointfivecellID: idAndLocation[1]});
						densityCell.on('click', function (a) {
							a.target.bindPopup("<strong>No. registros: </strong>" + cell.doc_count + "</br></br><strong>Ubicación:</strong></br>[" + idAndLocation[2] + ", " + idAndLocation[3] + "] [" + (((parseFloat(idAndLocation[2])*10)+5)/10) + ", " + (((parseFloat(idAndLocation[3])*10)+5)/10) + "]").openPopup();
						});
						self.densityCellsPointFiveDegree().addLayer(densityCell);
					});
					self.densityCellsPointFiveDegree().on('click', function (a) {
						data = self.fillSearchConditions();
						data["cellid"] = a.layer.options.cellID;
						data["pointfivecellid"] = a.layer.options.pointfivecellID;
						data = ko.toJSON(data);
						$.ajax({
							contentType: 'application/json',
							type: 'POST',
							url: '/distribution/pointfivedegree/stats',
							data: data,
							beforeSend: function() {
								self.hideMapAreaWithSpinner();
							},
							complete: function() {
								self.showMapAreaWithSpinner();
							},
							success: function(allData) {
								self.fillCellDensityData(allData, a);
							},
							dataType: 'jsonp'
						});
					});

					$.each(returnedData.aggregations.pointtwogroup.buckets, function(i, cell) {
						var idAndLocation = cell.key.split("~~~");
						var bounds = [[parseFloat(idAndLocation[2]), parseFloat(idAndLocation[3])], [parseFloat(idAndLocation[2])+0.2, parseFloat(idAndLocation[3])+0.2]];
						var color = "#ff7800";
						if (cell.doc_count > 0 && cell.doc_count < 10) {
							color = "#FFFF00";
						} else if(cell.doc_count > 9 && cell.doc_count < 100) {
							color = "#FFCC00";
						} else if(cell.doc_count > 99 && cell.doc_count < 1000) {
							color = "#FF9900";
						} else if(cell.doc_count > 999 && cell.doc_count < 10000) {
							color = "#FF6600";
						} else if(cell.doc_count > 9999 && cell.doc_count < 100000) {
							color = "#FF3300";
						} else if(cell.doc_count > 99999) {
							color = "#CC0000";
						}
						var densityCell = new L.rectangle(bounds, {color: color, weight: 1, fill: true, fillOpacity: 0.5, cellID: idAndLocation[0], pointtwocellID: idAndLocation[1]});
						densityCell.on('click', function (a) {
							a.target.bindPopup("<strong>No. registros: </strong>" + cell.doc_count + "</br></br><strong>Ubicación:</strong></br>[" + idAndLocation[2] + ", " + idAndLocation[3] + "] [" + (((parseFloat(idAndLocation[2])*10)+2)/10) + ", " + (((parseFloat(idAndLocation[3])*10)+2)/10) + "]").openPopup();
						});
						self.densityCellsPointTwoDegree().addLayer(densityCell);
					});
					self.densityCellsPointTwoDegree().on('click', function (a) {
						data = self.fillSearchConditions();
						data["cellid"] = a.layer.options.cellID;
						data["pointtwocellid"] = a.layer.options.pointtwocellID;
						data = ko.toJSON(data);
						$.ajax({
							contentType: 'application/json',
							type: 'POST',
							url: '/distribution/pointtwodegree/stats',
							data: data,
							beforeSend: function() {
								self.hideMapAreaWithSpinner();
							},
							complete: function() {
								self.showMapAreaWithSpinner();
							},
							success: function(allData) {
								self.fillCellDensityData(allData, a);
							},
							dataType: 'jsonp'
						});
					});

					$.each(returnedData.aggregations.centigroup.buckets, function(i, cell) {
						var idAndLocation = cell.key.split("~~~");
						var bounds = [[parseFloat(idAndLocation[2]), parseFloat(idAndLocation[3])], [parseFloat(idAndLocation[2])+0.1, parseFloat(idAndLocation[3])+0.1]];
						var color = "#ff7800";
						if (cell.doc_count > 0 && cell.doc_count < 10) {
							color = "#FFFF00";
						} else if(cell.doc_count > 9 && cell.doc_count < 100) {
							color = "#FFCC00";
						} else if(cell.doc_count > 99 && cell.doc_count < 1000) {
							color = "#FF9900";
						} else if(cell.doc_count > 999 && cell.doc_count < 10000) {
							color = "#FF6600";
						} else if(cell.doc_count > 9999 && cell.doc_count < 100000) {
							color = "#FF3300";
						} else if(cell.doc_count > 99999) {
							color = "#CC0000";
						}
						var densityCell = new L.rectangle(bounds, {color: color, weight: 1, fill: true, fillOpacity: 0.5, cellID: idAndLocation[0], pointonecellID: idAndLocation[1]});
						densityCell.on('click', function (a) {
							a.target.bindPopup("<strong>No. registros: </strong>" + cell.doc_count + "</br></br><strong>Ubicación:</strong></br>[" + idAndLocation[2] + ", " + idAndLocation[3] + "] [" + (((parseFloat(idAndLocation[2])*10)+1)/10) + ", " + (((parseFloat(idAndLocation[3])*10)+1)/10) + "]").openPopup();
						});
						self.densityCellsPointOneDegree().addLayer(densityCell);
					});
					self.densityCellsPointOneDegree().on('click', function (a) {
						data = self.fillSearchConditions();
						data["cellid"] = a.layer.options.cellID;
						data["pointonecellid"] = a.layer.options.pointonecellID;
						data = ko.toJSON(data);
						$.ajax({
							contentType: 'application/json',
							type: 'POST',
							url: '/distribution/pointonedegree/stats',
							data: data,
							beforeSend: function() {
								self.hideMapAreaWithSpinner();
							},
							complete: function() {
								self.showMapAreaWithSpinner();
							},
							success: function(allData) {
								self.fillCellDensityData(allData, a);
							},
							dataType: 'jsonp'
						});
					});

					self.totalGeoOccurrences(returnedData.hits.total);

					$('input[type=range]').rangeslider('setPosition', 3*100);

					self.isFiltered(true);

					// Enable download links
					self.generateURLSpreadsheet();

					// Set current active distribution
					self.currentActiveDistribution("oneDegree");
				},
				dataType: 'jsonp'
			});
		},
		disableResumeDetail: function() {
			if(!$("#resumeDetail").is(':hidden')) {
				$("#resumeDetail").animate({width: 'toggle'});
			}
		},
		// Ajax get data functions
		getSearchResumeData: function() {
			var self = this;
			if(typeof UrlDataMapping.filterSubject[self.selectedSubject()] !== "undefined") {
				$.getJSON(UrlDataMapping.filterSubject[self.selectedSubject()].resumeApiURL+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
					var canonicals = ko.observableArray();
					var kingdoms = ko.observableArray();
					var providers = ko.observableArray();
					var resources = ko.observableArray();
					var phylums = ko.observableArray();
					var taxonClasses = ko.observableArray();
					var order_ranks = ko.observableArray();
					var families = ko.observableArray();
					var genuses = ko.observableArray();
					var species = ko.observableArray();
					var countries = ko.observableArray();
					var departments = ko.observableArray();
					var counties = ko.observableArray();
					var paramos = ko.observableArray();
					var marineZones = ko.observableArray();
					var commons = ko.observableArray();

					_.each(allData.aggregations.canonical.buckets, function(data) {
						canonicals.push(new ResumeCount({name: data.key, count: data.doc_count}));
					});

					_.each(allData.aggregations.kingdom.buckets, function(data) {
						kingdoms.push(new ResumeCount({id: ((typeof data.id.buckets[0] !== 'undefined') ? data.id.buckets[0].key : ''), url: ((typeof data.id.buckets[0] !== 'undefined') ? "http://data.sibcolombia.net/species/"+data.id.buckets[0].key : ''), name: data.key, count: data.doc_count}));
					});

					_.each(allData.aggregations.data_provider_id.buckets, function(data) {
						providers.push(new ResumeCount({id: data.key, url: "http://data.sibcolombia.net/publicadores/provider/"+data.key, name: data.data_provider_name.buckets[0].key, count: data.doc_count}));
					});

					_.each(allData.aggregations.data_resource_id.buckets, function(data) {
						resources.push(new ResumeCount({id: data.key, url: "http://data.sibcolombia.net/conjuntos/resource/"+data.key, name: data.data_provider_id.buckets[0].data_resource_name.buckets[0].key, count: data.doc_count}));
					});

					_.each(allData.aggregations.phylum.buckets, function(data) {
						phylums.push(new ResumeCount({id: ((typeof data.id.buckets[0] !== 'undefined') ? data.id.buckets[0].key : ''), url: ((typeof data.id.buckets[0] !== 'undefined') ? "http://data.sibcolombia.net/species/"+data.id.buckets[0].key : ''), name: data.key, count: data.doc_count}));
					});

					_.each(allData.aggregations.class.buckets, function(data) {
						taxonClasses.push(new ResumeCount({id: ((typeof data.id.buckets[0] !== 'undefined') ? data.id.buckets[0].key : ''), url: ((typeof data.id.buckets[0] !== 'undefined') ? "http://data.sibcolombia.net/species/"+data.id.buckets[0].key : ''), name: data.key, count: data.doc_count}));
					});

					_.each(allData.aggregations.order.buckets, function(data) {
						order_ranks.push(new ResumeCount({id: ((typeof data.id.buckets[0] !== 'undefined') ? data.id.buckets[0].key : ''), url: ((typeof data.id.buckets[0] !== 'undefined') ? "http://data.sibcolombia.net/species/"+data.id.buckets[0].key : ''), name: data.key, count: data.doc_count}));
					});

					_.each(allData.aggregations.family.buckets, function(data) {
						families.push(new ResumeCount({id: ((typeof data.id.buckets[0] !== 'undefined') ? data.id.buckets[0].key : ''), url: ((typeof data.id.buckets[0] !== 'undefined') ? "http://data.sibcolombia.net/species/"+data.id.buckets[0].key : ''), name: data.key, count: data.doc_count}));
					});

					_.each(allData.aggregations.genus.buckets, function(data) {
						genuses.push(new ResumeCount({id: ((typeof data.id.buckets[0] !== 'undefined') ? data.id.buckets[0].key : ''), url: ((typeof data.id.buckets[0] !== 'undefined') ? "http://data.sibcolombia.net/species/"+data.id.buckets[0].key : ''), name: data.key, count: data.doc_count}));
					});

					_.each(allData.aggregations.species.buckets, function(data) {
						species.push(new ResumeCount({id: ((typeof data.id.buckets[0] !== 'undefined') ? data.id.buckets[0].key : ''), url: ((typeof data.id.buckets[0] !== 'undefined') ? "http://data.sibcolombia.net/species/"+data.id.buckets[0].key : ''), name: data.key, count: data.doc_count}));
					});

					_.each(allData.aggregations.iso_country_code.buckets, function(data) {
						countries.push(new ResumeCount({id: data.key, url: "http://data.sibcolombia.net/countries/"+data.key, name: data.country_name.buckets[0].key, count: data.doc_count}));
					});

					_.each(allData.aggregations.iso_department_code.buckets, function(data) {
						departments.push(new ResumeCount({id: data.key, url: "http://data.sibcolombia.net/departments/"+data.key, name: data.department_name.buckets[0].key, count: data.doc_count}));
					});

					_.each(allData.aggregations.iso_county_code.buckets, function(data) {
						counties.push(new ResumeCount({id: data.key, name: data.county_name.buckets[0].department_name.buckets[0].key + " - " + data.county_name.buckets[0].key, count: data.doc_count}));
					});

					_.each(allData.aggregations.paramo_code.buckets, function(data) {
						paramos.push(new ResumeCount({id: data.key, name: data.paramo_name.buckets[0].key, count: data.doc_count}));
					});

					_.each(allData.aggregations.marine_zone_code.buckets, function(data) {
						marineZones.push(new ResumeCount({id: data.key, name: data.marine_zone_name.buckets[0].key, count: data.doc_count}));
					});

					_.each(allData.aggregations.common_names.common.buckets, function(data) {
						commons.push(new ResumeCount({name: data.key, count: data.doc_count}));
					});

					switch(self.selectedSubject()) {
						case "0":
							self.resumeScientificNames.removeAll();
							_.each(allData.aggregations.canonical.buckets, function(data) {
								self.resumeScientificNames.push(new ResumeScientificName({canonical: data.key, occurrences: data.doc_count}));
							});
							canonicals.removeAll();
							break;
						case "100":
							self.resumeKingdomNames.removeAll();
							_.each(allData.aggregations.kingdom.buckets, function(data) {
								self.resumeKingdomNames.push(new ResumeKingdomName({kingdom: data.key, occurrences: data.doc_count, id: ((typeof data.id.buckets[0] !== 'undefined') ? data.id.buckets[0].key : '')}));
							});
							kingdoms.removeAll();
							break;
						case "101":
							self.resumePhylumNames.removeAll();
							_.each(allData.aggregations.phylum.buckets, function(data) {
								self.resumePhylumNames.push(new ResumePhylumName({phylum: data.key, occurrences: data.doc_count, id: ((typeof data.id.buckets[0] !== 'undefined') ? data.id.buckets[0].key : '')}));
							});
							phylums.removeAll();
							break;
						case "102":
							self.resumeClassNames.removeAll();
							_.each(allData.aggregations.class.buckets, function(data) {
								self.resumeClassNames.push(new ResumeClassName({nameClass: data.key, occurrences: data.doc_count, id: ((typeof data.id.buckets[0] !== 'undefined') ? data.id.buckets[0].key : '')}));
							});
							taxonClasses.removeAll();
							break;
						case "103":
							self.resumeOrderNames.removeAll();
							_.each(allData.aggregations.order.buckets, function(data) {
								self.resumeOrderNames.push(new ResumeOrderName({order_rank: data.key, occurrences: data.doc_count, id: ((typeof data.id.buckets[0] !== 'undefined') ? data.id.buckets[0].key : '')}));
							});
							order_ranks.removeAll();
							break;
						case "104":
							self.resumeFamilyNames.removeAll();
							_.each(allData.aggregations.family.buckets, function(data) {
								self.resumeFamilyNames.push(new ResumeFamilyName({family: data.key, occurrences: data.doc_count, id: ((typeof data.id.buckets[0] !== 'undefined') ? data.id.buckets[0].key : '')}));
							});
							families.removeAll();
							break;
						case "105":
							self.resumeGenusNames.removeAll();
							_.each(allData.aggregations.genus.buckets, function(data) {
								self.resumeGenusNames.push(new ResumeGenusName({genus: data.key, occurrences: data.doc_count, id: ((typeof data.id.buckets[0] !== 'undefined') ? data.id.buckets[0].key : '')}));
							});
							genuses.removeAll();
							break;
						case "106":
							self.resumeSpeciesNames.removeAll();
							_.each(allData.aggregations.species.buckets, function(data) {
								self.resumeSpeciesNames.push(new ResumeSpecieName({species: data.key, occurrences: data.doc_count, id: ((typeof data.id.buckets[0] !== 'undefined') ? data.id.buckets[0].key : '')}));
							});
							species.removeAll();
							break;
						case "31":
							self.resumeCommonNames.removeAll();
							_.each(allData.aggregations.common_names.common.buckets, function(data) {
								self.resumeCommonNames.push(new ResumeCommonName({canonical: data.key, occurrences: data.doc_count}));
							});
							commons.removeAll();
							break;
						case "25":
							self.resumeDataProviders.removeAll();
							_.each(allData.aggregations.data_provider_id.buckets, function(data) {
								self.resumeDataProviders.push(new ResumeDataProvider({providerID: data.key, providerName: data.data_provider_name.buckets[0].key, occurrences: data.doc_count}));
							});
							providers.removeAll();
							break;
						case "24":
							self.resumeDataResources.removeAll();
							_.each(allData.aggregations.data_resource_id.buckets, function(data) {
								self.resumeDataResources.push(new ResumeDataResource({providerID: data.data_provider_id.buckets[0].key, resourceID: data.key, resourceName: data.data_provider_id.buckets[0].data_resource_name.buckets[0].key, occurrences: data.doc_count}));
							});
							resources.removeAll();
							break;
						case "12":
							self.resumeInstitutionCodes.removeAll();
							_.each(allData.aggregations.institution_code_id.buckets, function(data) {
								self.resumeInstitutionCodes.push(new ResumeInstitutionCode({institutionCodeID: data.key, institutionCode: data.institution_code.buckets[0].key, occurrences: data.doc_count}));
							});
							break;
						case "13":
							self.resumeCollectionCodes.removeAll();
							_.each(allData.aggregations.collection_code_id.buckets, function(data) {
								self.resumeCollectionCodes.push(new ResumeCollectionCode({collectionCodeID: data.key, collectionCode: data.collection_code.buckets[0].key, occurrences: data.doc_count}));
							});
							break;
						case "5":
							self.resumeCountries.removeAll();
							_.each(allData.aggregations.iso_country_code.buckets, function(data) {
								self.resumeCountries.push(new ResumeCountry({isoCountryCode: data.key, countryName: data.country_name.buckets[0].key, occurrences: data.doc_count}));
							});
							countries.removeAll();
							break;
						case "38":
							self.resumeDepartments.removeAll();
							_.each(allData.aggregations.iso_department_code.buckets, function(data) {
								self.resumeDepartments.push(new ResumeDepartment({isoDepartmentCode: data.key, departmentName: data.department_name.buckets[0].key, occurrences: data.doc_count}));
							});
							departments.removeAll();
							break;
						case "39":
							self.resumeCounties.removeAll();
							_.each(allData.aggregations.iso_county_code.buckets, function(data) {
								self.resumeCounties.push(new ResumeCounty({isoCountyCode: data.key, countyName: data.county_name.buckets[0].key, occurrences: data.doc_count, departmentAndCountyName: data.county_name.buckets[0].department_name.buckets[0].key + " - " + data.county_name.buckets[0].key}));
							});
							counties.removeAll();
							break;
						case "40":
							self.resumeParamos.removeAll();
							_.each(allData.aggregations.paramo_code.buckets, function(data) {
								self.resumeParamos.push(new ResumeParamo({paramoCode: data.key, paramoName: data.paramo_name.buckets[0].key, occurrences: data.doc_count}));
							});
							paramos.removeAll();
							break;
						case "41":
							self.resumeMarineZones.removeAll();
							_.each(allData.aggregations.marine_zone_code.buckets, function(data) {
								self.resumeMarineZones.push(new ResumeMarineZone({marineZoneCode: data.key, marineZoneName: data.marine_zone_name.buckets[0].key, occurrences: data.doc_count}));
							});
					}

					self.resumesInfoFilter.removeAll();
					self.resumesInfoFilter.push(new ResumeInfo({canonicals: canonicals, commons: commons, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, countries: countries, departments: departments, counties: counties, paramos: paramos, marineZones: marineZones}));
					self.showResumeContainer();
				});
			}
		},
		// Operations
		// Add ScientificName filter
		addScientificName: function() {
			var self = this;
			self.selectedScientificNames.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: self.objectNameValue(), textName: "ScientificName"}));
			self.totalFilters(self.totalFilters()+1);
		},
		addScientificNameFromHelp: function(parent, selectedFilter) {
			var self = parent;
			self.selectedScientificNames.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.canonical, textName: "ScientificName"}));
			self.totalFilters(self.totalFilters()+1);
		},
		// Removes ScientificName filter
		removeScientificName: function(parent, selectedFilter) {
			var self = parent;
			self.selectedScientificNames.remove(selectedFilter);
			self.totalFilters(self.totalFilters()-1);
		},
		// Add CommonName filter
		addCommonName: function() {
			var self = this;
			self.selectedCommonNames.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: self.objectNameValue(), textName: "CommonName"}));
			self.totalFilters(self.totalFilters()+1);
		},
		addCommonNameFromHelp: function(parent, selectedFilter) {
			var self = parent;
			self.selectedCommonNames.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.canonical, textName: "CommonName"}));
			self.totalFilters(self.totalFilters()+1);
		},
		// Removes CommonName filter
		removeCommonName: function(parent, selectedFilter) {
			var self = parent;
			self.selectedCommonNames.remove(selectedFilter);
			self.totalFilters(self.totalFilters()-1);
		},
		// Add Taxon filter
		addTaxonName: function(id, name) {
			var self = this;
			self.selectedTaxonNames.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: self.objectNameValue(), textName: name}));
			self.totalFilters(self.totalFilters()+1);
		},
		addTaxonNameFromHelp: function(parent, selectedFilter) {
			var self = parent;
			if(self.selectedSubject() == 100)
				self.selectedTaxonNames.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.kingdom, textName: "kingdom", id: selectedFilter.id}));
			if(self.selectedSubject() == 101)
				self.selectedTaxonNames.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.phylum, textName: "phylum", id: selectedFilter.id}));
			if(self.selectedSubject() == 102)
				self.selectedTaxonNames.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.nameClass, textName: "class", id: selectedFilter.id}));
			if(self.selectedSubject() == 103)
				self.selectedTaxonNames.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.order_rank, textName: "order", id: selectedFilter.id}));
			if(self.selectedSubject() == 104)
				self.selectedTaxonNames.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.family, textName: "family", id: selectedFilter.id}));
			if(self.selectedSubject() == 105)
				self.selectedTaxonNames.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.genus, textName: "genus", id: selectedFilter.id}));
			if(self.selectedSubject() == 106)
				self.selectedTaxonNames.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.species, textName: "species", id: selectedFilter.id}));
			self.totalFilters(self.totalFilters()+1);
		},
		// Removes Taxon filter
		removeTaxonName: function(parent, selectedFilter) {
			var self = parent;
			self.selectedTaxonNames.remove(selectedFilter);
			self.totalFilters(self.totalFilters()-1);
		},
		// Add Country filter
		addCountryID: function() {
			var self = this;
			self.selectedCountriesIDs.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: $("#dropDownCountry").select2('data').id, textName: $("#dropDownCountry").select2('data').text}));
			self.totalFilters(self.totalFilters()+1);
		},
		addCountryIDFromHelp: function(parent, selectedFilter) {
			var self = parent;
			self.selectedCountriesIDs.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.isoCountryCode, textName: selectedFilter.countryName}));
			self.totalFilters(self.totalFilters()+1);
		},
		// Removes Country filter
		removeCountryID: function(parent, selectedFilter) {
			var self = parent;
			self.selectedCountriesIDs.remove(selectedFilter);
			self.totalFilters(self.totalFilters()-1);
		},
		// Add Department filter
		addDepartmentID: function() {
			var self = this;
			self.selectedDepartmentsIDs.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: $("#dropDownDepartment").select2('data').id, textName: $("#dropDownDepartment").select2('data').text}));
			self.totalFilters(self.totalFilters()+1);
		},
		addDepartmentIDFromHelp: function(parent, selectedFilter) {
			var self = parent;
			self.selectedDepartmentsIDs.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.isoDepartmentCode, textName: selectedFilter.departmentName}));
			self.totalFilters(self.totalFilters()+1);
		},
		// Removes Department filter
		removeDepartmentID: function(parent, selectedFilter) {
			var self = this;
			self.selectedDepartmentsIDs.remove(selectedFilter);
			self.totalFilters(self.totalFilters()-1);
		},
		// Add County filter
		addCountyID: function() {
			var self = this;
			self.selectedCountiesIDs.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: $("#dropDownCounty").select2('data').id, textName: $("#dropDownCounty").select2('data').text}));
			self.totalFilters(self.totalFilters()+1);
		},
		addCountyIDFromHelp: function(parent, selectedFilter) {
			var self = parent;
			self.selectedCountiesIDs.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.isoCountyCode, textName: selectedFilter.departmentAndCountyName}));
			self.totalFilters(self.totalFilters()+1);
		},
		// Removes County filter
		removeCountyID: function(parent, selectedFilter) {
			var self = this;
			self.selectedCountiesIDs.remove(selectedFilter);
			self.totalFilters(self.totalFilters()-1);
		},
		// Add paramo filter
		addParamoID: function() {
			var self = this;
			self.selectedParamosIDs.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: $("#dropDownParamo").select2('data').id, textName: $("#dropDownParamo").select2('data').text}));
			self.totalFilters(self.totalFilters()+1);
		},
		addParamoIDFromHelp: function(parent, selectedFilter) {
			var self = parent;
			self.selectedParamosIDs.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.paramoCode, textName: selectedFilter.paramoName}));
			self.totalFilters(self.totalFilters()+1);
		},
		// Removes paramo filter
		removeParamoID: function(parent, selectedFilter) {
			var self = this;
			self.selectedParamosIDs.remove(selectedFilter);
			self.totalFilters(self.totalFilters()-1);
		},
		// Add marineZone filter
		addMarineZoneID: function() {
			var self = this;
			self.selectedMarineZonesIDs.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: $("#dropDownMarineZone").select2('data').id, textName: $("#dropDownMarineZone").select2('data').text}));
			self.totalFilters(self.totalFilters()+1);
		},
		addMarineZoneIDFromHelp: function(parent, selectedFilter) {
			var self = parent;
			self.selectedMarineZonesIDs.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.marineZoneCode, textName: selectedFilter.marineZoneName}));
			self.totalFilters(self.totalFilters()+1);
		},
		// Removes paramo filter
		removeMarineZoneID: function(parent, selectedFilter) {
			var self = this;
			self.selectedMarineZonesIDs.remove(selectedFilter);
			self.totalFilters(self.totalFilters()-1);
		},
		// Add Latitude filter
		addLatitudeNumber: function() {
			var self = this;
			self.selectedLatitudes.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: self.objectNameValue(), textName: "Latitude"}));
			self.totalFilters(self.totalFilters()+1);
		},
		// Removes Latitude filter
		removeLatitudeNumber: function(parent, selectedFilter) {
			var self = parent;
			self.selectedLatitudes.remove(selectedFilter);
			self.totalFilters(self.totalFilters()-1);
		},
		// Add Longitude filter
		addLongitudeNumber: function() {
			var self = this;
			self.selectedLongitudes.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: self.objectNameValue(), textName: "Longitude"}));
			self.totalFilters(self.totalFilters()+1);
		},
		// Removes Longitude filter
		removeLongitudeNumber: function(parent, selectedFilter) {
			var self = parent;
			self.selectedLongitudes.remove(selectedFilter);
			self.totalFilters(self.totalFilters()-1);
		},
		// Add altitude filter
		addAltitudeNumber: function() {
			var self = this;
			self.selectedAltitudes.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: self.objectNameValue(), textName: "Altitude"}));
			self.totalFilters(self.totalFilters()+1);
		},
		// Removes altitude filter
		removeAltitudeNumber: function(parent, selectedFilter) {
			var self = parent;
			self.selectedAltitudes.remove(selectedFilter);
			self.totalFilters(self.totalFilters()-1);
		},
		// Add deep filter
		addDeepNumber: function() {
			var self = this;
			self.selectedDeeps.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: self.objectNameValue(), textName: "Deep"}));
			self.totalFilters(self.totalFilters()+1);
		},
		// Removes deep filter
		removeDeepNumber: function(parent, selectedFilter) {
			var self = parent;
			self.selectedDeeps.remove(selectedFilter);
			self.totalFilters(self.totalFilters()-1);
		},
		// Add coordinate state filter
		addCoordinateState: function() {
			var self = this;
			if(self.selectedCoordinate().length == "0")
				self.totalFilters(self.totalFilters()+1);
			self.selectedCoordinate.removeAll();
			self.selectedCoordinate.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: self.selectedCoordinateState(), textName: self.dropDownCoordinateStateText()}));
		},
		// Removes coordinate state filter
		removeCoordinateState: function(parent, selectedFilter) {
			var self = parent;
			self.selectedCoordinate.remove(selectedFilter);
			self.totalFilters(self.totalFilters()-1);
		},
		// Add data provider name
		addDataProviderName: function() {
			var self = this;
			self.selectedProviders.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: self.objectNameValue(), textName: "Data provider"}));
			self.totalFilters(self.totalFilters()+1);
		},
		addDataProviderNameFromHelp: function(parent, selectedFilter) {
			var self = parent;
			self.selectedProviders.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.providerName, textName: "Data provider", id: selectedFilter.providerID}));
			self.totalFilters(self.totalFilters()+1);
		},
		// Removes data provider name
		removeDataProviderName: function(parent, selectedFilter) {
			var self = parent;
			self.selectedProviders.remove(selectedFilter);
			self.totalFilters(self.totalFilters()-1);
		},
		// Add data resource name
		addDataResourceName: function() {
			var self = this;
			self.selectedResources.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: self.objectNameValue(), textName: "Data resource"}));
			self.totalFilters(self.totalFilters()+1);
		},
		addDataResourceNameFromHelp: function(parent, selectedFilter) {
			var self = parent;
			self.selectedResources.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.resourceName, textName: "Data resource", id: selectedFilter.resourceID}));
			self.totalFilters(self.totalFilters()+1);
		},
		// Removes data resource name
		removeDataResourceName: function(parent, selectedFilter) {
			var self = parent;
			self.selectedResources.remove(selectedFilter);
			self.totalFilters(self.totalFilters()-1);
		},
		// Latitude filter parsed text
		parsedLatitudeText: function(latitude) {
			var value = parseFloat(latitude.textObject);
			if (value >= 0) {
				value = value + " Norte";
			} else {
				value = (value*-1) + " Sur";
			}
			return ko.computed(function () {
				return value;
			});
		},
		// Longitude filter parsed text
		parsedLongitudeText: function(longitude) {
			var value = parseFloat(longitude.textObject);
			if (value >= 0) {
				value = value + " Este";
			} else {
				value = (value*-1) + " Oeste";
			}
			return ko.computed(function () {
				return value;
			});
		},
		// height filter parsed text
		parsedHeightText: function(height) {
			return ko.computed(function () {
				return height.textObject + "m";
			});
		},
		hideMapAreaWithSpinner: function() {
			var self = this;
			self.disableFilterHelp();
			$("#mapa").addClass("hide-element");
			$("#map-filter-area").addClass("hiding");
			$("#processing-request").removeClass("hide-element");
		},
		showMapAreaWithSpinner: function() {
			$("#map-filter-area").removeClass("hiding");
			$("#mapa").removeClass("hide-element");
			$("#processing-request").addClass("hide-element");
		},
		fillCellDensityData: function(allData, a) {
			var self = this;
			var canonicals = ko.observableArray();
			var kingdoms = ko.observableArray();
			var providers = ko.observableArray();
			var resources = ko.observableArray();
			var phylums = ko.observableArray();
			var taxonClasses = ko.observableArray();
			var order_ranks = ko.observableArray();
			var families = ko.observableArray();
			var genuses = ko.observableArray();
			var species = ko.observableArray();
			var countries = ko.observableArray();
			var departments = ko.observableArray();
			var counties = ko.observableArray();
			var paramos = ko.observableArray();
			var marineZones = ko.observableArray();
			var commons = ko.observableArray();

			_.each(allData.aggregations.canonical.buckets, function(data) {
				canonicals.push(new ResumeCount({name: data.key, count: data.doc_count}));
			});

			_.each(allData.aggregations.kingdom.buckets, function(data) {
				kingdoms.push(new ResumeCount({id: ((typeof data.id.buckets[0] !== 'undefined') ? data.id.buckets[0].key : ''), url: ((typeof data.id.buckets[0] !== 'undefined') ? "http://data.sibcolombia.net/species/"+data.id.buckets[0].key : ''), name: data.key, count: data.doc_count}));
			});

			_.each(allData.aggregations.data_provider_id.buckets, function(data) {
				providers.push(new ResumeCount({id: data.key, url: "http://data.sibcolombia.net/publicadores/provider/"+data.key, name: data.data_provider_name.buckets[0].key, count: data.doc_count}));
			});

					_.each(allData.aggregations.data_resource_id.buckets, function(data) {
				resources.push(new ResumeCount({id: data.key, url: "http://data.sibcolombia.net/conjuntos/resource/"+data.key, name: data.data_provider_id.buckets[0].data_resource_name.buckets[0].key, count: data.doc_count}));
			});

			_.each(allData.aggregations.phylum.buckets, function(data) {
				phylums.push(new ResumeCount({id: ((typeof data.id.buckets[0] !== 'undefined') ? data.id.buckets[0].key : ''), url: ((typeof data.id.buckets[0] !== 'undefined') ? "http://data.sibcolombia.net/species/"+data.id.buckets[0].key : ''), name: data.key, count: data.doc_count}));
			});

			_.each(allData.aggregations.class.buckets, function(data) {
				taxonClasses.push(new ResumeCount({id: ((typeof data.id.buckets[0] !== 'undefined') ? data.id.buckets[0].key : ''), url: ((typeof data.id.buckets[0] !== 'undefined') ? "http://data.sibcolombia.net/species/"+data.id.buckets[0].key : ''), name: data.key, count: data.doc_count}));
			});

			_.each(allData.aggregations.order.buckets, function(data) {
				order_ranks.push(new ResumeCount({id: ((typeof data.id.buckets[0] !== 'undefined') ? data.id.buckets[0].key : ''), url: ((typeof data.id.buckets[0] !== 'undefined') ? "http://data.sibcolombia.net/species/"+data.id.buckets[0].key : ''), name: data.key, count: data.doc_count}));
			});

			_.each(allData.aggregations.family.buckets, function(data) {
				families.push(new ResumeCount({id: ((typeof data.id.buckets[0] !== 'undefined') ? data.id.buckets[0].key : ''), url: ((typeof data.id.buckets[0] !== 'undefined') ? "http://data.sibcolombia.net/species/"+data.id.buckets[0].key : ''), name: data.key, count: data.doc_count}));
			});

			_.each(allData.aggregations.genus.buckets, function(data) {
				genuses.push(new ResumeCount({id: ((typeof data.id.buckets[0] !== 'undefined') ? data.id.buckets[0].key : ''), url: ((typeof data.id.buckets[0] !== 'undefined') ? "http://data.sibcolombia.net/species/"+data.id.buckets[0].key : ''), name: data.key, count: data.doc_count}));
			});

			_.each(allData.aggregations.species.buckets, function(data) {
				species.push(new ResumeCount({id: ((typeof data.id.buckets[0] !== 'undefined') ? data.id.buckets[0].key : ''), url: ((typeof data.id.buckets[0] !== 'undefined') ? "http://data.sibcolombia.net/species/"+data.id.buckets[0].key : ''), name: data.key, count: data.doc_count}));
			});

			_.each(allData.aggregations.iso_country_code.buckets, function(data) {
				countries.push(new ResumeCount({id: data.key, url: "http://data.sibcolombia.net/countries/"+data.key, name: data.country_name.buckets[0].key, count: data.doc_count}));
			});

			_.each(allData.aggregations.iso_department_code.buckets, function(data) {
				departments.push(new ResumeCount({id: data.key, url: "http://data.sibcolombia.net/departments/"+data.key, name: data.department_name.buckets[0].key, count: data.doc_count}));
			});

			_.each(allData.aggregations.iso_county_code.buckets, function(data) {
				counties.push(new ResumeCount({id: data.key, name: data.county_name.buckets[0].department_name.buckets[0].key + " - " + data.county_name.buckets[0].key, count: data.doc_count}));
			});

			_.each(allData.aggregations.paramo_code.buckets, function(data) {
				paramos.push(new ResumeCount({id: data.key, name: data.paramo_name.buckets[0].key, count: data.doc_count}));
			});

			_.each(allData.aggregations.marine_zone_code.buckets, function(data) {
				marineZones.push(new ResumeCount({id: data.key, name: data.marine_zone_name.buckets[0].key, count: data.doc_count}));
			});

			_.each(allData.aggregations.common_names.common.buckets, function(data) {
				commons.push(new ResumeCount({name: data.key, count: data.doc_count}));
			});

			self.resumesInfo.removeAll();
			self.resumesInfo.push(new ResumeInfo({cellID: a.layer.options.cellID, canonicals: canonicals, commons: commons, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, counties: counties, paramos: paramos, marineZones: marineZones}));
			if($("#resumeDetail").is(':hidden')) {
				$("#resumeDetail").animate({width: 'toggle'}, 500, "swing");
			}
			// Show map area
			self.showMapAreaWithSpinner();
		},
		hideResumeContainer: function() {
			$("#topFiltersContainerHelp").addClass("loading2");
			$("#contentFiltersContainerHelp").addClass("opacity-element");
		},
		showResumeContainer: function() {
			$("#topFiltersContainerHelp").removeClass("loading2");
			$("#contentFiltersContainerHelp").removeClass("opacity-element");
		},
		removeFilter: function() {
			var self = this;
			map.removeLayer(self.densityCellsOneDegree());
			map.removeLayer(self.densityCellsPointOneDegree());
			map.removeLayer(self.densityCellsPointFiveDegree());
			map.removeLayer(self.densityCellsPointTwoDegree());

			jQuery.extend(self.densityCellsOneDegree(),self.densityCellsOneDegreeCache());
			jQuery.extend(self.densityCellsPointOneDegree(),self.densityCellsPointOneDegreeCache());
			jQuery.extend(self.densityCellsPointFiveDegree(),self.densityCellsPointFiveDegreeCache());
			jQuery.extend(self.densityCellsPointTwoDegree(),self.densityCellsPointTwoDegreeCache());

			map.addLayer(self.densityCellsOneDegree());
			self.totalGeoOccurrences(self.totalGeoOccurrencesCache());
			$('input[type=range]').rangeslider('setPosition', 3*100);
			self.currentActiveDistribution("oneDegree");

			self.isFiltered(false);
			self.isRectangle(false);

			// Disable download options
			self.hideAdditionalInfoPane();
		},
		removePoligonalCoordinateFilter: function() {
			var self = this;
			featureGroup.clearLayers();
			self.selectedOnMapPoligonCoordinates.removeAll();
			self.totalFilters(self.totalFilters()-1);
		},
		removeRadialCoordinateFilter: function() {
			var self = this;
			featureGroup.clearLayers();
			self.selectedOnMapRadialCoordinates.removeAll();
			self.totalFilters(self.totalFilters()-1);
		},
		showAdditionalInfoPane: function() {
			$("#additionalInfoPane").removeClass("occult-element");
		},
		hideAdditionalInfoPane: function() {
			$("#additionalInfoPane").addClass("occult-element");
		},
		generateURLSpreadsheet: function() {
			var self = this;
			var counter = 0;
			self.hideAdditionalInfoPane();
			var url = "http://data.sibcolombia.net/occurrences/downloadSpreadsheet.htm?";
			_.each(self.selectedScientificNames(), function(scientificName) {
				url += ((counter > 0) ? "&" : "")+"c["+counter+"].s="+scientificName.subject+"&"+"c["+counter+"].p="+self.dataPortalConditionCodes(scientificName.predicate)+"&"+"c["+counter+"].o="+scientificName.textObject;
				counter++;
			});
			_.each(self.selectedCommonNames(), function(commonName) {
				url += ((counter > 0) ? "&" : "")+"c["+counter+"].s="+commonName.subject+"&"+"c["+counter+"].p="+self.dataPortalConditionCodes(commonName.predicate)+"&"+"c["+counter+"].o="+commonName.textObject;
				counter++;
			});
			_.each(self.selectedTaxonNames(), function(taxonName) {
				if(taxonName.id !== "null") {
					url += ((counter > 0) ? "&" : "")+"c["+counter+"].s=20&"+"c["+counter+"].p="+self.dataPortalConditionCodes(taxonName.predicate)+"&"+"c["+counter+"].o="+taxonName.id;
					counter++;
				}
			});
			_.each(self.selectedCountriesIDs(), function(country) {
				url += ((counter > 0) ? "&" : "")+"c["+counter+"].s="+country.subject+"&"+"c["+counter+"].p="+self.dataPortalConditionCodes(country.predicate)+"&"+"c["+counter+"].o="+country.textObject;
				counter++;
			});
			_.each(self.selectedDepartmentsIDs(), function(department) {
				url += ((counter > 0) ? "&" : "")+"c["+counter+"].s="+department.subject+"&"+"c["+counter+"].p="+self.dataPortalConditionCodes(department.predicate)+"&"+"c["+counter+"].o="+department.textObject;
				counter++;
			});
			_.each(self.selectedCountiesIDs(), function(county) {
				url += ((counter > 0) ? "&" : "")+"c["+counter+"].s="+county.subject+"&"+"c["+counter+"].p="+self.dataPortalConditionCodes(county.predicate)+"&"+"c["+counter+"].o="+county.textObject;
				counter++;
			});
			_.each(self.selectedParamosIDs(), function(paramo) {
				url += ((counter > 0) ? "&" : "")+"c["+counter+"].s="+paramo.subject+"&"+"c["+counter+"].p="+self.dataPortalConditionCodes(paramo.predicate)+"&"+"c["+counter+"].o="+paramo.textObject;
				counter++;
			});
			_.each(self.selectedMarineZonesIDs(), function(marineZone) {
				url += ((counter > 0) ? "&" : "")+"c["+counter+"].s="+marineZone.subject+"&"+"c["+counter+"].p="+self.dataPortalConditionCodes(marineZone.predicate)+"&"+"c["+counter+"].o="+marineZone.textObject;
				counter++;
			});
			_.each(self.selectedProviders(), function(provider) {
				url += ((counter > 0) ? "&" : "")+"c["+counter+"].s="+provider.subject+"&"+"c["+counter+"].p="+self.dataPortalConditionCodes(provider.predicate)+"&"+"c["+counter+"].o="+provider.id;
				counter++;
			});
			_.each(self.selectedResources(), function(resource) {
				url += ((counter > 0) ? "&" : "")+"c["+counter+"].s="+resource.subject+"&"+"c["+counter+"].p="+self.dataPortalConditionCodes(resource.predicate)+"&"+"c["+counter+"].o="+resource.id;
				counter++;
			});
			_.each(self.selectedLatitudes(), function(latitude) {
				url += ((counter > 0) ? "&" : "")+"c["+counter+"].s="+latitude.subject+"&"+"c["+counter+"].p="+self.dataPortalConditionCodes(latitude.predicate)+"&"+"c["+counter+"].o="+latitude.textObject;
				counter++;
			});
			_.each(self.selectedLongitudes(), function(longitude) {
				url += ((counter > 0) ? "&" : "")+"c["+counter+"].s="+longitude.subject+"&"+"c["+counter+"].p="+self.dataPortalConditionCodes(longitude.predicate)+"&"+"c["+counter+"].o="+longitude.textObject;
				counter++;
			});
			_.each(self.selectedAltitudes(), function(altitude) {
				url += ((counter > 0) ? "&" : "")+"c["+counter+"].s="+altitude.subject+"&"+"c["+counter+"].p="+self.dataPortalConditionCodes(altitude.predicate)+"&"+"c["+counter+"].o="+altitude.textObject;
				counter++;
			});
			_.each(self.selectedDeeps(), function(deep) {
				url += ((counter > 0) ? "&" : "")+"c["+counter+"].s="+deep.subject+"&"+"c["+counter+"].p="+self.dataPortalConditionCodes(deep.predicate)+"&"+"c["+counter+"].o="+deep.textObject;
				counter++;
			});
			if(self.isRectangle()) {
				url += ((counter > 0) ? "&" : "")+"c["+counter+"].s=1&c["+counter+"].p=1&c["+counter+"].o="+self.selectedOnMapPoligonCoordinates()[0].lat;
				counter++;
				url += "&c["+counter+"].s=1&c["+counter+"].p=2&c["+counter+"].o="+self.selectedOnMapPoligonCoordinates()[1].lat;
				counter++;
				url += "&c["+counter+"].s=2&c["+counter+"].p=2&c["+counter+"].o="+self.selectedOnMapPoligonCoordinates()[2].lng;
				counter++;
				url += "&c["+counter+"].s=2&c["+counter+"].p=1&c["+counter+"].o="+self.selectedOnMapPoligonCoordinates()[0].lng;
				counter++;
			}
			self.urlDownloadSpreadsheet(url);
			self.urlDownloadSpreadsheetWithURL(url+"&c["+counter+"].s=28&c["+counter+"].p=0&c["+counter+"].o=0");
			if( (counter !== 0 && self.selectedOnMapRadialCoordinates().length === 0 && self.selectedOnMapPoligonCoordinates().length === 0) || (counter !== 0 && self.selectedOnMapPoligonCoordinates().length !== 0 && self.isRectangle()) )
				self.showAdditionalInfoPane();
		},
		dataPortalConditionCodes: function(condition) {
			if(condition=="eq") {
				return 0;
			} else if(condition=="gt") {
				return 1;
			} else if(condition=="lt") {
				return 2;
			}
		}
	});

	return OccurrenceSearchViewModel;
});
