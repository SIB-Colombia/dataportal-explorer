define(["jquery", "knockout", "underscore", "app/models/baseViewModel", "app/map-initialize", "app/models/occurrence", "app/models/resumeInfo", "app/models/resumeCount", "app/models/resumeScientificName", "app/models/resumeCommonName", "app/models/resumeKingdomName", "app/models/resumePhylumName", "app/models/resumeClassName", "app/models/resumeOrderName", "app/models/resumeFamilyName", "app/models/resumeGenusName", "app/models/resumeSpecieName", "app/models/resumeDataProvider", "app/models/resumeDataResource", "app/models/resumeInstitutionCode", "app/models/resumeCollectionCode", "app/models/resumeCountry", "app/models/resumeDepartment", "app/models/resumeCounty", "app/models/resumeParamo", "app/models/resumeMarineZone", "app/models/county", "app/models/paramo", "app/models/marineZone", "app/models/coordinate", "app/models/radialCoordinate", "app/models/filterSelected", "app/config/urlDataMapping", "select2", "knockoutKendoUI", "Leaflet", "jqueryUI", "bootstrap", "kendoSpanishCulture", "range-slider", "LeafletMarkerCluster", "LeafletMapboxVectorTile"], function($, ko, _, BaseViewModel, map, Occurrence, ResumeInfo, ResumeCount, ResumeScientificName, ResumeCommonName, ResumeKingdomName, ResumePhylumName, ResumeClassName, ResumeOrderName, ResumeFamilyName, ResumeGenusName, ResumeSpecieName, ResumeDataProvider, ResumeDataResource, ResumeInstitutionCode, ResumeCollectionCode, ResumeCountry, ResumeDepartment, ResumeCounty, ResumeParamo, ResumeMarineZone, County, Paramo, MarineZone, Coordinate, RadialCoordinate, FilterSelected, UrlDataMapping, select2) {
	var OccurrenceSearchViewModel = function() {
		var self = this;

		self.densityCells = new L.FeatureGroup();
		self.densityCellsCache = new L.FeatureGroup();

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

		// Download data
		self.downloadEmail = "";
		self.downloadEmailFocused = true;
		self.downloadEmailVerification = "";
		self.downloadEmailVerificationFocused = true;
		self.downloadReason = "";
		self.downloadType = "all";
		self.downloadFormValidationError = false;
		self.downloadFormValidationErrorMessage = "";

		// Total occurrences data
		self.totalOccurrences = 0;
		self.totalGeoOccurrences = 0;
		self.totalOccurrencesCache = 0;
		self.totalGeoOccurrencesCache = 0;

		// Arrays for dropdowns
		self.countyDropdown = [];

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
		self.isObjectNameHelpSelected = false;
		self.predicateOptions = "[{value: 'eq', name: 'es'}]";

		// Arrays of selected filters by kind
		self.selectedScientificNames = [];
		self.selectedCommonNames = [];
		self.selectedTaxonNames = [];
		self.selectedCountriesIDs = [];
		self.selectedDepartmentsIDs = [];
		self.selectedCountiesIDs = [];
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
		self.selectedCollectionNames = [];
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

	_.extend(OccurrenceSearchViewModel.prototype, BaseViewModel.prototype, self.densityCellsPointOneDegree, {
		initialize: function() {
			var self = this;

			this.loadCountyDropdownData();
			this.changeFilterHelp();
			this.getSearchResumeData();
			this.loadCellDensity();

			markers = new L.MarkerClusterGroup({
				spiderfyOnMaxZoom: true,
				showCoverageOnHover: true,
				zoomToBoundsOnClick: true,
				removeOutsideVisibleBounds: true
			});

			map.on('zoomend', function(e) {
				if(e.target._zoom >= 13) {
					$("#densityInstructionsCellSelection").removeClass("occult-element");
					map.removeLayer(self.densityCells());
				} else {
					if(map.hasLayer(markers)) {
						map.removeLayer(markers);
					}
					$("#distributionCells").prop('checked', false);
					$("#occurrenceRecord").prop('checked', true);
					$("#densityInstructionsCellSelection").addClass("occult-element");

					map.addLayer(self.densityCells());
				}
		  });

		  map.on('moveend', function(e) {
		  	var data = ko.toJSON(self.fillSearchConditions());
		  	/*if(e.target._zoom >= 13 && !sidebar.isVisible()) {
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
								marker.bindPopup("<strong>Nombre científico</strong></br><strong><a href=\"http://maps.sibcolombia.net/occurrences/"+occurrence._source.id+"\" target=\"_blank\">"+occurrence._source.canonical.toUpperCase()+"</a></strong></br></br><strong>Ubicación:</strong></br>Latitud: "+occurrence._source.location.lat+"</br>Longitud: "+occurrence._source.location.lon);
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
		  	}*/
		  });

			$('#distributionCells').click(function () {
				if(this.checked) {
					map.addLayer(self.densityCellsPointOneDegree());
				} else {
					map.removeLayer(self.densityCellsPointOneDegree());
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

			// Event change search text subscription
			self.objectNameValue.subscribe(function (newValue) {
				debounce(searchParamsResume, 500)();
			});

			self.downloadEmailFocused.subscribe(function(newValue) {
				self.validateDownloadForm(newValue);
			});

			self.downloadEmailVerificationFocused.subscribe(function(newValue) {
				self.validateDownloadForm(newValue);
			});

			// Reset captcha before modal form load
			$('#modalDownloadAll').on('show.bs.modal', function (event) {
				Recaptcha.reload();
			});

			//searchParamsResume();
			//
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
							self.objectNameValue(e.added.text.toLowerCase());
							//self.hideResumeContainer();
							//self.getSearchResumeData();
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
							self.objectNameValue(e.added.text.toLowerCase());
							//self.hideResumeContainer();
							//self.getSearchResumeData();
							//self.enableFilterHelp();
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
						}
					});
				},
				update: function(element) {
					$(element).trigger('change');
				}
			};

		},
		loadCountyDropdownData: function() {
			var self = this;
			$.getJSON("http://api.biodiversidad.co/api/v1.5/registry/county", function(allData) {
				var newCounties = ko.utils.arrayMap(allData, function(county) {
					return new County({departmentName: county.department_name, countyName: county.county_name, isoCountyCode: county.iso_county_code});
				});
				self.countyDropdown.push.apply(self.countyDropdown, newCounties);
			});
		},
		formatNumber: function(n) {
    	return n.toFixed(0).replace(/./g, function(c, i, a) {
    		return i > 0 && c !== "," && (a.length - i) % 3 === 0 ? "." + c : c;
    	});
    },
		loadCellDensity: function() {
			var debug = {};
			var self = this;
			var totalOccurrences = 0;

			$.getJSON('http://api.biodiversidad.co/api/v1.5/occurrence/search?departmentName=Vichada&departmentName=VICHADA&size=1&facetLimit=10', function(allData) {
				self.totalOccurrences(self.formatNumber(allData.count));
				self.totalOccurrencesCache(self.formatNumber(allData.count));
			});

			$.ajax({
				contentType: 'application/json',
				type: 'GET',
				url: 'http://api.biodiversidad.co/api/v1.5/occurrence/grid?departmentName=Vichada&departmentName=VICHADA&precision=5&responseType=geojson&scale=logarithmic&color=%23ff2600&colorMethod=gradient',
				beforeSend: function() {
					self.hideMapAreaWithSpinner();
				},
				complete: function() {
					//self.showMapAreaWithSpinner();
				},
				success: function(returnedData) {
					//map.removeLayer(self.densityCells());
					self.densityCells(new L.geoJson(returnedData, {
						style: function(feature) {
							return {
								color: feature.properties.fill,
								fillOpacity: feature.properties['fill-opacity'],
								weight: 1,
								opacity: feature.properties['fill-opacity']
							};
						},
						onEachFeature: function(feature, layer) {
							// does this feature have a properties
							if (feature.properties) {
								layer.bindPopup("<strong>No. registros: </strong>" + feature.properties.count + "</br></br>");
								totalOccurrences = totalOccurrences + feature.properties.count;
							}
						}
					}));
					self.densityCells().on('click', function (a) {
						if (a.layer.feature.properties) {
							$.ajax({
								contentType: 'application/json',
								type: 'GET',
								url: 'http://api.biodiversidad.co/api/v1.5/occurrence/search?departmentName=Vichada&departmentName=VICHADA&latitudeTopLeft='+a.layer._latlngs[1].lat+'&longitudeTopLeft='+a.layer._latlngs[1].lng+'&latitudeBottomRight='+a.layer._latlngs[3].lat+'&longitudeBottomRight='+a.layer._latlngs[3].lng+'&size=10&facet%5B%5D=provider_name&facet%5B%5D=resource_name&facet%5B%5D=basis_of_record&facet%5B%5D=collection_name&facetLimit=1000',
								success: function(results) {
									var resources = "";
									var providers = "";
									var basisOfRecords = "";
									var collections = "";
									_.each(results.facets, function(data) {
										if (data.field === "resource_name") {
											_.each(data.counts, function(resource) {
												resources = (resources === "") ? "<ul><li>" + resource.key + ": " + resource.doc_count + "</li>" : resources + "<li>" + resource.key + ": " + resource.doc_count + "</li>";
											});
											if (resources !== "") {
												resources = resources + "</ul>";
											}
										} else if (data.field === "provider_name") {
											_.each(data.counts, function(provider) {
												providers = (providers === "") ? "<ul><li>" + provider.key + ": " + provider.doc_count + "</li>" : providers + "<li>" + provider.key + ": " + provider.doc_count + "</li>";
											});
											if (providers !== "") {
												providers = providers + "</ul>";
											}
										} else if (data.field === "basis_of_record") {
											_.each(data.counts, function(basisOfRecord) {
												basisOfRecords = (basisOfRecords === "") ? "<ul><li>" + basisOfRecord.key + ": " + basisOfRecord.doc_count + "</li>" : basisOfRecords + "<li>" + basisOfRecord.key + ": " + basisOfRecord.doc_count + "</li>";
											});
											if (basisOfRecords !== "") {
												basisOfRecords = basisOfRecords + "</ul>";
											}
										} else if (data.field === "collection_name") {
											_.each(data.counts, function(collection) {
												collections = (collections === "") ? "<ul><li>" + collection.key + ": " + collection.doc_count + "</li>" : collections + "<li>" + collection.key + ": " + collection.doc_count + "</li>";
											});
											if (collections !== "") {
												collections = collections + "</ul>";
											}
										}
									});
									a.layer.bindPopup("<strong>No. registros: </strong>" + a.layer.feature.properties.count + "</br></br>" + ((resources !== "")?"<strong>Conjuntos de datos:</strong></br>"+resources:"") + ((providers !== "")?"</br><strong>Publicadores:</strong></br>"+providers:"") + ((basisOfRecords !== "")?"</br><strong>Base del registro:</strong></br>"+basisOfRecords:"") + ((collections !== "")?"</br><strong>Colecciones:</strong></br>"+collections:"") );
								}
							});
						}
					});
					map.addLayer(self.densityCells());
					self.totalGeoOccurrences(self.formatNumber(totalOccurrences));
					self.totalGeoOccurrencesCache(self.formatNumber(totalOccurrences));
					self.showMapAreaWithSpinner();
					jQuery.extend(self.densityCellsCache(),self.densityCells());
				}
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
				$("#dropDownCounty").select2({
					placeholder: "Seleccione un municipio"
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
			switch(self.selectedSubject()) {
				case "0":
					self.helpSearchText("<p>Escriba un nombre científico y pulse en Agregar filtro.</p><p>Este filtro devolverá cualquier registro que posea un nombre que concuerde con el identificador dado del organismo, sin importar como está clasificado el organismo.</p>");
					break;
				case "31":
					self.helpSearchText("<p>Escriba un nombre común y pulse en Agregar filtro.</p><p>Este filtro devolverá cualquier registro que posea un nombre común que concuerde con el identificador dado del organismo, sin importar como está clasificado el organismo.</p>");
					break;
				case "100":
					self.helpSearchText("<p>Escriba un nombre de reino y pulse en Agregar filtro.</p><p>Este filtro devolverá cualquier registro que posea un reino que concuerde con el organismo.</p>");
					break;
				case "101":
					self.helpSearchText("<p>Escriba un nombre de filo y pulse en Agregar filtro.</p><p>Este filtro devolverá cualquier registro que posea un filo que concuerde con el organismo.</p>");
					break;
				case "102":
					self.helpSearchText("<p>Escriba un nombre de clase y pulse en Agregar filtro.</p><p>Este filtro devolverá cualquier registro que posea una clase que concuerde con el organismo.</p>");
					break;
				case "103":
					self.helpSearchText("<p>Escriba un nombre de orden y pulse en Agregar filtro.</p><p>Este filtro devolverá cualquier registro que posea un orden que concuerde con el organismo.</p>");
					break;
				case "104":
					self.helpSearchText("<p>Escriba un nombre de familia y pulse en Agregar filtro.</p><p>Este filtro devolverá cualquier registro que posea una familia que concuerde con el organismo.</p>");
					break;
				case "105":
					self.helpSearchText("<p>Escriba un nombre de género y pulse en Agregar filtro.</p><p>Este filtro devolverá cualquier registro que posea un género que concuerde con el organismo.</p>");
					break;
				case "106":
					self.helpSearchText("<p>Escriba un nombre de especie y pulse en Agregar filtro.</p><p>Este filtro devolverá cualquier registro que posea una especie que concuerde con el organismo.</p>");
					break;
				case "5":
					self.helpSearchText("<p>Seleccione un país de la lista y dar clic en Agregar filtro para filtrar su búsqueda a uno o más paises.</p><p>Este filtro retornará registros del país identificado, sin importar si poseen coordenadas; pero note que al agregar un filtro de coordenadas (Bounding box, Latitud o Longitud) limitará los resultados a registros georreferenciados.</p>");
					break;
				case "38":
					self.helpSearchText("<p>Seleccione un departamento de la lista y oprima en Agregar filtro para acotar su búsqueda a uno o más departamentos.</p><p>Este filtro retorna los registros que pertenecen al departamento, independientemente de si estos tienen o no coordenadas; tenga en cuenta que al adicionar un filtro de coordenadas (Condición de selección, Latitud o Longitud) limitará los resultados a los registros georeferenciados.</p>");
					break;
				case "39":
					self.helpSearchText("<p>Seleccione un municipio de la lista y oprima en Agregar filtro para acotar su búsqueda a uno o más municipios.</p><p>Este filtro retorna los registros que pertenecen al municipio, independientemente de si estos tienen o no coordenadas; tenga en cuenta que al adicionar un filtro de coordenadas (Condición de selección, Latitud o Longitud) limitará los resultados a los registros georeferenciados.</p>");
					break;
				case "40":
					self.helpSearchText("<p>Seleccione un páramo de la lista y dar clic en Agregar filtro para filtrar su búsqueda a uno o más páramos.</p><p>Este filtro retornará registros del páramo identificado, sin importar si poseen coordenadas; pero note que al agregar un filtro de coordenadas (Bounding box, Latitud o Longitud) limitará los resultados a registros georreferenciados.</p>");
					break;
				case "41":
					self.helpSearchText("<p>Seleccione una área marítima de la lista y dar clic en Agregar filtro para filtrar su búsqueda a una o más áreas marítimas.</p><p>Este filtro retornará registros de la área marítima identificada, sin importar si poseen coordenadas; pero note que al agregar un filtro de coordenadas (Bounding box, Latitud o Longitud) limitará los resultados a registros georreferenciados.</p>");
					break;
				case "1":
					self.helpSearchText("<p></p><p>Ingrese una latitud en formato decimal (ej. -1.1) y escoja entre \"es\", \"mayor que\" y \"menor que\". Este filtro retornará solo registros georreferenciados que concuerdan con la selección.</p>");
					break;
				case "2":
					self.helpSearchText("<p></p><p>Ingrese una longitud en formato decimal (ej. -73.2) y escoja entre \"es\", \"mayor que\" y \"menor que\". Este filtro retornará solo registros georreferenciados que concuerdan con la selección.</p>");
					break;
				case "34":
					self.helpSearchText("<p>Ingrese una altitud en metros y escoja entre \"es\", \"mayor que\" y \"menor que\". Este filtro retornará solo registros con un valor de altitud que coincida con la selección. Este filtro sólo es compatible con los valores de números enteros.</p><p>Por favor tenga en cuenta que los valores de altitud subyacentes se supone que se indican en metros por las fuentes originales de datos, pero que no todas las fuentes de datos se ajustan a esta norma todavía. La conversión automática sólo puede ser suministrada en los casos donde se conoce la unidad de medida. Si planea cualquier análisis basado en los valores de altitud, se recomienda ponerse en contacto directamente con los propietarios de los datos relacionados y verificar las unidades de medida utilizadas en sus conjuntos de datos.</p>");
					break;
				case "35":
					self.helpSearchText("<p>Ingrese una profundidad en metros y escoja entre \"es\", \"mayor que\" y \"menor que\". Este filtro retornará solo registros con un valor de profundidad que coincida con la selección. Este filtro admite valores decimales a 2 decimales.</p><p>Por favor tenga en cuenta que los valores de profundidad subyacentes se supone que se indican en metros por las fuentes originales de datos, pero que no todas las fuentes de datos se ajustan a esta norma todavía. La conversión automática sólo puede ser suministrada en los casos donde se conoce la unidad de medida. Si planea cualquier análisis basado en los valores de profundidad, se recomienda ponerse en contacto directamente con los propietarios de los datos relacionados y verificar las unidades de medida utilizadas en sus conjuntos de datos.</p>");
					break;
				case "28":
					self.helpSearchText("<p></p><p>Seleccione \"incluye coordenadas\" para filtrar aquellos registros que no están georreferenciados; alternativamente, seleccione \"no incluye coordenadas\" para excluir registros georreferenciados. Para ver todos los registros, no utilize este filtro.</p>");
					break;
				case "25":
					self.helpSearchText("<p>Seleccione un publicador de datos de la lista y haga clic en Agregar filtro.</p><p>Este filtro retornará registros de los publicadores especificados.</p>");
					break;
				case "24":
					self.helpSearchText("<p>Seleccione un recurso de datos de la lista y haga clic en Agregar filtro.</p><p>Este filtro retornará registros de los recursos especificados.</p>");
					break;
				case "4":
					self.helpSearchText("<p></p><p>Seleccione un rango de fecha y haga clic en Agregar filtro.</p>");
					break;
				case "33":
					self.helpSearchText("<p></p><p>Seleccione un rango de años y haga clic en Agregar filtro..</p>");
					break;
				case "21":
					self.helpSearchText("<p></p><p>Ingrese un año y haga clic en Agregar filtro. Este filtro retornará registros del año (o años) que concuerdan con la selección.</p>");
					break;
				case "22":
					self.helpSearchText("<p></p><p>Seleccione un mes de la lista y haga clic en Agregar filtro. Este filtro retornará registros del mes especificado, sin importar el año.</p>");
					break;
				case "12":
					self.helpSearchText("<p></p><p>Ingrese un código de institución y \"es\". Este filtro retornará registros con el código de institución dado.</p>");
					break;
				case "13":
					self.helpSearchText("<p></p><p>Ingrese un código de colección y \"es\". El filtro retornará registros con el código de colección.</p>");
					break;
				case "14":
					self.helpSearchText("<p></p><p>Ingrese un número de catálogo y pulse en Agregar filtro. Este filtro retornará registros con el número de catálogo especificado.</p>");
					break;
			}
			$("#helpPopOver").attr("data-content", self.helpSearchText());
		},
		enableFilterHelp: function() {
			var self = this;
			self.disableResumeDetail();
			if((self.isObjectNameHelpSelected() === false || $("#filtersContainerHelp").is(':hidden')) && self.selectedSubject() != 1 && self.selectedSubject() != 2 && self.selectedSubject() != 34 && self.selectedSubject() != 35 && self.selectedSubject() != 39 && self.selectedSubject() != 21 && self.selectedSubject() != 14) {
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
				} else if(self.selectedSubject() == 12) {
					// Adding data institution name filter
					self.addDataInstitutionCode();
				} else if(self.selectedSubject() == 13) {
					// Adding data collection name filter
					self.addDataCollectionName();
				}
			}
		},
		fillSearchConditions: function() {
			var response = {};
			var urlParams = "departmentName=Vichada&departmentName=VICHADA";
			var self = this;
			if(self.selectedScientificNames().length !== 0) {
				response['scientificNames'] = self.selectedScientificNames();
				self.selectedScientificNames().forEach(function(element, index, array) {
					urlParams = urlParams + ((urlParams.length == 0)?"":"&") + "scientificName=" + element.textObject;
				});
			}
			if(self.selectedCommonNames().length !== 0)
				response['commonNames'] = self.selectedCommonNames();
			if(self.selectedTaxonNames().length !== 0) {
				response['taxons'] = self.selectedTaxonNames();
				self.selectedTaxonNames().forEach(function(element, index, array) {
					switch (element.textName) {
						case "reino":
							urlParams = urlParams + ((urlParams.length == 0)?"":"&") + "kingdomName=" + element.textObject;
							break;
						case "clase":
							urlParams = urlParams + ((urlParams.length == 0)?"":"&") + "className=" + element.textObject;
							break;
						case "filo":
							urlParams = urlParams + ((urlParams.length == 0)?"":"&") + "phylumName=" + element.textObject;
							break;
						case "orden":
							urlParams = urlParams + ((urlParams.length == 0)?"":"&") + "orderName=" + element.textObject;
							break;
						case "familia":
							urlParams = urlParams + ((urlParams.length == 0)?"":"&") + "familyName=" + element.textObject;
							break;
						case "género":
							urlParams = urlParams + ((urlParams.length == 0)?"":"&") + "genusName=" + element.textObject;
							break;
						case "especie":
							urlParams = urlParams + ((urlParams.length == 0)?"":"&") + "speciesName=" + element.textObject;
							break;
					}
				});
			}
			if(self.selectedCountriesIDs().length !== 0) {
				response['countries'] = self.selectedCountriesIDs();
				self.selectedCountriesIDs().forEach(function(element, index, array) {
					urlParams = urlParams + ((urlParams.length == 0)?"":"&") + "countryName=" + element.textName;
				});
			}
			if(self.selectedDepartmentsIDs().length !== 0) {
				response['departments'] = self.selectedDepartmentsIDs();
				self.selectedDepartmentsIDs().forEach(function(element, index, array) {
					urlParams = urlParams + ((urlParams.length == 0)?"":"&") + "departmentName=" + element.textName;
				});
			}
			if(self.selectedCountiesIDs().length !== 0) {
				response['counties'] = self.selectedCountiesIDs();
				self.selectedCountiesIDs().forEach(function(element, index, array) {
					var countyAndDepartment = element.textName.split(" - ");
					urlParams = urlParams + ((urlParams.length == 0)?"":"&") + "departmentName=" + countyAndDepartment[1];
					urlParams = urlParams + ((urlParams.length == 0)?"":"&") + "countyName=" + countyAndDepartment[0];
				});
			}
			if(self.selectedLatitudes().length !== 0) {
				response['latitudes'] = self.selectedLatitudes();
			}
			if(self.selectedLongitudes().length !== 0) {
				response['longitudes'] = self.selectedLongitudes();
			}
			if(self.selectedAltitudes().length !== 0) {
				var altitudeEq = "";
				var altitudeGTE = "";
				var altitudeLTE = "";
				response['altitudes'] = self.selectedAltitudes();
				self.selectedAltitudes().forEach(function(element, index, array) {
					switch (element.predicate) {
						case 'eq':
							altitudeEq = altitudeEq + ((altitudeEq.length == 0)?"":",") + element.textObject;
							break;
						case 'gt':
							altitudeGTE = altitudeGTE + ((altitudeGTE.length == 0)?"":",") + element.textObject;
							break;
						case 'lt':
							altitudeLTE = altitudeLTE + ((altitudeLTE.length == 0)?"":",") + element.textObject;
							break;
					}
				});
				if(altitudeEq) {
					urlParams = urlParams + ((urlParams.length == 0)?"":"&") + "elevationEqual=" + "[" + altitudeEq + "]";
				}
				if(altitudeGTE) {
					urlParams = urlParams + ((urlParams.length == 0)?"":"&") + "elevationGreaterOrEqualTo=" + "[" + altitudeGTE + "]";
				}
				if(altitudeLTE) {
					urlParams = urlParams + ((urlParams.length == 0)?"":"&") + "elevationLessOrEqualTo=" + "[" + altitudeLTE + "]";
				}
			}
			if(self.selectedDeeps().length !== 0) {
				var depthEq = "";
				var depthGTE = "";
				var depthLTE = "";
				response['deeps'] = self.selectedDeeps();
				self.selectedDeeps().forEach(function(element, index, array) {
					switch (element.predicate) {
						case 'eq':
							depthEq = depthEq + ((depthEq.length == 0)?"":",") + element.textObject;
							break;
						case 'gt':
							depthGTE = depthGTE + ((depthGTE.length == 0)?"":",") + element.textObject;
							break;
						case 'lt':
							depthLTE = depthLTE + ((depthLTE.length == 0)?"":",") + element.textObject;
							break;
					}
				});
				if(depthEq) {
					urlParams = urlParams + ((urlParams.length == 0)?"":"&") + "depthEqual=" + "[" + depthEq + "]";
				}
				if(depthGTE) {
					urlParams = urlParams + ((urlParams.length == 0)?"":"&") + "depthGreaterOrEqualTo=" + "[" + depthGTE + "]";
				}
				if(depthLTE) {
					urlParams = urlParams + ((urlParams.length == 0)?"":"&") + "depthLessOrEqualTo=" + "[" + depthLTE + "]";
				}
			}
			if(self.selectedCoordinate().length !== 0) {
				response['coordinates'] = self.selectedCoordinate();
			}
			if(self.selectedProviders().length !== 0) {
				response['providers'] = self.selectedProviders();
				self.selectedProviders().forEach(function(element, index, array) {
					urlParams = urlParams + ((urlParams.length == 0)?"":"&") + "providerName=" + element.textObject;
				});
			}
			if(self.selectedResources().length !== 0) {
				response['resources'] = self.selectedResources();
				self.selectedResources().forEach(function(element, index, array) {
					urlParams = urlParams + ((urlParams.length == 0)?"":"&") + "resourceName=" + element.textObject;
				});
			}
			if(self.selectedInstitutionCodes().length !== 0) {
				response['institutions'] = self.selectedInstitutionCodes();
				self.selectedInstitutionCodes().forEach(function(element, index, array) {
					urlParams = urlParams + ((urlParams.length == 0)?"":"&") + "institutionCode=" + element.textObject;
				});
			}
			if(self.selectedCollectionNames().length !== 0) {
				response['collections'] = self.selectedCollectionNames();
				self.selectedCollectionNames().forEach(function(element, index, array) {
					urlParams = urlParams + ((urlParams.length == 0)?"":"&") + "collectionName=" + element.textObject;
				});
			}
			if(self.selectedOnMapPoligonCoordinates().length !== 0) {
				response['poligonalCoordinates'] = self.selectedOnMapPoligonCoordinates();
			}
			if(self.selectedOnMapRadialCoordinates().length !== 0) {
				response['radialCoordinates'] = self.selectedOnMapRadialCoordinates();
			}
			return {
				response: response,
				url: urlParams
			};
		},
		startSearch: function() {
			var self = this;
			var result = self.fillSearchConditions();
			var data = ko.toJSON(result.response);
			var urlParams = result.url;
			var totalOccurrences = 0;

			$.ajax({
				contentType: 'application/json',
				type: 'GET',
				url: 'http://api.biodiversidad.co/api/v1.5/occurrence/grid?'+urlParams+'&precision=5&responseType=geojson&scale=logarithmic&color=%23ff2600&colorMethod=gradient',
				beforeSend: function() {
					self.hideMapAreaWithSpinner();
				},
				complete: function() {
					self.showMapAreaWithSpinner();
				},
				success: function(returnedData) {
					map.removeLayer(self.densityCells());
					self.densityCells(new L.geoJson(returnedData, {
						style: function(feature) {
							return {
								color: feature.properties.fill,
								fillOpacity: feature.properties['fill-opacity'],
								weight: 1,
								opacity: feature.properties['fill-opacity']
							};
						},
						onEachFeature: function(feature, layer) {
							// does this feature have a properties
							if (feature.properties) {
								layer.bindPopup("<strong>No. registros: </strong>" + feature.properties.count + "</br></br>");
								totalOccurrences = totalOccurrences + feature.properties.count;
							}
						}
					}));
					self.densityCells().on('click', function (a) {
						if (a.layer.feature.properties) {
							$.ajax({
								contentType: 'application/json',
								type: 'GET',
								url: 'http://api.biodiversidad.co/api/v1.5/occurrence/search?'+urlParams+'&latitudeTopLeft='+a.layer._latlngs[1].lat+'&longitudeTopLeft='+a.layer._latlngs[1].lng+'&latitudeBottomRight='+a.layer._latlngs[3].lat+'&longitudeBottomRight='+a.layer._latlngs[3].lng+'&size=10&facet%5B%5D=provider_name&facet%5B%5D=resource_name&facet%5B%5D=basis_of_record&facet%5B%5D=collection_name&facetLimit=1000',
								success: function(results) {
									var resources = "";
									var providers = "";
									var basisOfRecords = "";
									var collections = "";
									_.each(results.facets, function(data) {
										if (data.field === "resource_name") {
											_.each(data.counts, function(resource) {
												resources = (resources === "") ? "<ul><li>" + resource.key + ": " + resource.doc_count + "</li>" : resources + "<li>" + resource.key + ": " + resource.doc_count + "</li>";
											});
											if (resources !== "") {
												resources = resources + "</ul>";
											}
										} else if (data.field === "provider_name") {
											_.each(data.counts, function(provider) {
												providers = (providers === "") ? "<ul><li>" + provider.key + ": " + provider.doc_count + "</li>" : providers + "<li>" + provider.key + ": " + provider.doc_count + "</li>";
											});
											if (providers !== "") {
												providers = providers + "</ul>";
											}
										} else if (data.field === "basis_of_record") {
											_.each(data.counts, function(basisOfRecord) {
												basisOfRecords = (basisOfRecords === "") ? "<ul><li>" + basisOfRecord.key + ": " + basisOfRecord.doc_count + "</li>" : basisOfRecords + "<li>" + basisOfRecord.key + ": " + basisOfRecord.doc_count + "</li>";
											});
											if (basisOfRecords !== "") {
												basisOfRecords = basisOfRecords + "</ul>";
											}
										} else if (data.field === "collection_name") {
											_.each(data.counts, function(collection) {
												collections = (collections === "") ? "<ul><li>" + collection.key + ": " + collection.doc_count + "</li>" : collections + "<li>" + collection.key + ": " + collection.doc_count + "</li>";
											});
											if (collections !== "") {
												collections = collections + "</ul>";
											}
										}
									});
									a.layer.bindPopup("<strong>No. registros: </strong>" + a.layer.feature.properties.count + "</br></br>" + ((resources !== "")?"<strong>Conjuntos de datos:</strong></br>"+resources:"") + ((providers !== "")?"</br><strong>Publicadores:</strong></br>"+providers:"") + ((basisOfRecords !== "")?"</br><strong>Base del registro:</strong></br>"+basisOfRecords:"") + ((collections !== "")?"</br><strong>Colecciones:</strong></br>"+collections:"") );
								}
							});
						}
					});
					map.addLayer(self.densityCells());
					self.totalGeoOccurrences(self.formatNumber(totalOccurrences));

					$.getJSON('http://api.biodiversidad.co/api/v1.5/occurrence/search?' +urlParams+ '&size=1&facetLimit=10', function(allData) {
						self.totalOccurrences(self.formatNumber(allData.count));
					});

					self.isFiltered(true);

					// Enable download links
					self.generateURLSpreadsheet();
				}
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
				$.getJSON('http://api.biodiversidad.co/api/v1.5/occurrence/search?departmentName=Vichada&departmentName=VICHADA&size=2&facet%5B%5D=scientificName&facet%5B%5D=kingdom&facet%5B%5D=phylum&facet%5B%5D=class&facet%5B%5D=order&facet%5B%5D=family&facet%5B%5D=genus&facet%5B%5D=specie&facet%5B%5D=country&facet%5B%5D=department&facet%5B%5D=county&facet%5B%5D=provider_name&facet%5B%5D=resource_name&facet%5B%5D=institution_code&facet%5B%5D=collection_name&facetLimit=10'+((self.objectNameValue())?"&"+UrlDataMapping.filterSubject[self.selectedSubject()].resumeApi15Condition+"="+self.objectNameValue():""), function(allData) {
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
					var commons = ko.observableArray();

					_.each(allData.facets, function(data) {
						switch(data.field) {
							case "scientificName":
								self.resumeScientificNames.removeAll();
								_.each(data.counts, function(facet) {
									canonicals.push(new ResumeCount({name: facet.key, count: facet.doc_count}));
									if(facet.key == "") {
										self.resumeScientificNames.push(new ResumeScientificName({canonical: facet.key, occurrences: facet.doc_count, name: 'No documentado'}));
									} else {
										self.resumeScientificNames.push(new ResumeScientificName({canonical: facet.key, occurrences: facet.doc_count, name: facet.key}));	
									}
								});
								break;
							case "kingdom":
								self.resumeKingdomNames.removeAll();
								_.each(data.counts, function(facet) {
									kingdoms.push(new ResumeCount({name: facet.key, count: facet.doc_count}));
									if(facet.key == "") {
										self.resumeKingdomNames.push(new ResumeKingdomName({kingdom: facet.key, occurrences: facet.doc_count, name: 'No documentado'}));
									} else {
										self.resumeKingdomNames.push(new ResumeKingdomName({kingdom: facet.key, occurrences: facet.doc_count, name: facet.key}));
									}
								});
								break;
							case "provider_name":
								self.resumeDataProviders.removeAll();
								_.each(data.counts, function(facet) {
									providers.push(new ResumeCount({name: facet.key, count: facet.doc_count}));
									if(facet.key == "") {
										self.resumeDataProviders.push(new ResumeDataProvider({providerName: facet.key, occurrences: facet.doc_count, name: 'No documentado'}));
									} else {
										self.resumeDataProviders.push(new ResumeDataProvider({providerName: facet.key, occurrences: facet.doc_count, name: facet.key}));
									}
								});
								break;
							case "resource_name":
								self.resumeDataResources.removeAll();
								_.each(data.counts, function(facet) {
									resources.push(new ResumeCount({name: facet.key, count: facet.doc_count}));
									if(facet.key == "") {
										self.resumeDataResources.push(new ResumeDataResource({resourceName: facet.key, occurrences: facet.doc_count, name: 'No documentado'}));
									} else {
										self.resumeDataResources.push(new ResumeDataResource({resourceName: facet.key, occurrences: facet.doc_count, name: facet.key}));
									}
								});
								break;
							case "phylum":
								self.resumePhylumNames.removeAll();
								_.each(data.counts, function(facet) {
									phylums.push(new ResumeCount({name: facet.key, count: facet.doc_count}));
									if(facet.key == "") {
										self.resumePhylumNames.push(new ResumePhylumName({phylum: facet.key, occurrences: facet.doc_count, name: 'No documentado'}));
									} else {
										self.resumePhylumNames.push(new ResumePhylumName({phylum: facet.key, occurrences: facet.doc_count, name: facet.key}));
									}
								});
								break;
							case "class":
								self.resumeClassNames.removeAll();
								_.each(data.counts, function(facet) {
									taxonClasses.push(new ResumeCount({name: facet.key, count: facet.doc_count}));
									if(facet.key == "") {
										self.resumeClassNames.push(new ResumeClassName({nameClass: facet.key, occurrences: facet.doc_count, name: 'No documentado'}));
									} else {
										self.resumeClassNames.push(new ResumeClassName({nameClass: facet.key, occurrences: facet.doc_count, name: facet.key}));
									}
								});
								break;
							case "order":
								self.resumeOrderNames.removeAll();
								_.each(data.counts, function(facet) {
									order_ranks.push(new ResumeCount({name: facet.key, count: facet.doc_count}));
									if(facet.key == "") {
										self.resumeOrderNames.push(new ResumeOrderName({order_rank: facet.key, occurrences: facet.doc_count, name: 'No documentado'}));
									} else {
										self.resumeOrderNames.push(new ResumeOrderName({order_rank: facet.key, occurrences: facet.doc_count, name: facet.key}));
									}
								});
								break;
							case "family":
								self.resumeFamilyNames.removeAll();
								_.each(data.counts, function(facet) {
									families.push(new ResumeCount({name: facet.key, count: facet.doc_count}));
									if(facet.key == "") {
										self.resumeFamilyNames.push(new ResumeFamilyName({family: facet.key, occurrences: facet.doc_count, name: 'No documentado'}));
									} else {
										self.resumeFamilyNames.push(new ResumeFamilyName({family: facet.key, occurrences: facet.doc_count, name: facet.key}));
									}
								});
								break;
							case "genus":
								self.resumeGenusNames.removeAll();
								_.each(data.counts, function(facet) {
									genuses.push(new ResumeCount({name: facet.key, count: facet.doc_count}));
									if(facet.key == "") {
										self.resumeGenusNames.push(new ResumeGenusName({genus: facet.key, occurrences: facet.doc_count, name: 'No documentado'}));
									} else {
										self.resumeGenusNames.push(new ResumeGenusName({genus: facet.key, occurrences: facet.doc_count, name: facet.key}));
									}
								});
								break;
							case "specie":
								self.resumeSpeciesNames.removeAll();
								_.each(data.counts, function(facet) {
									species.push(new ResumeCount({name: facet.key, count: facet.doc_count}));
									if(facet.key == "") {
										self.resumeSpeciesNames.push(new ResumeSpecieName({species: facet.key, occurrences: facet.doc_count, name: 'No documentado'}));
									} else {
										self.resumeSpeciesNames.push(new ResumeSpecieName({species: facet.key, occurrences: facet.doc_count, name: facet.key}));
									}
								});
								break;
							case "country":
								self.resumeCountries.removeAll();
								_.each(data.counts, function(facet) {
									countries.push(new ResumeCount({name: facet.key, count: facet.doc_count}));
									if(facet.key == "") {
										self.resumeCountries.push(new ResumeCountry({countryName: facet.key, occurrences: facet.doc_count, name: 'No documentado'}));
									} else {
										self.resumeCountries.push(new ResumeCountry({countryName: facet.key, occurrences: facet.doc_count, name: facet.key}));
									}
								});
								break;
							case "department":
								self.resumeDepartments.removeAll();
								_.each(data.counts, function(facet) {
									departments.push(new ResumeCount({name: facet.key, count: facet.doc_count}));
									if(facet.key == "") {
										self.resumeDepartments.push(new ResumeDepartment({departmentName: facet.key, occurrences: facet.doc_count, name: 'No documentado'}));
									} else {
										self.resumeDepartments.push(new ResumeDepartment({departmentName: facet.key, occurrences: facet.doc_count, name: facet.key}));
									}
								});
								break;
							case "institution_code":
								self.resumeInstitutionCodes.removeAll();
								_.each(data.counts, function(facet) {
									if(facet.key == "") {
										self.resumeInstitutionCodes.push(new ResumeInstitutionCode({institutionCode: facet.key, occurrences: facet.doc_count, name: 'No documentado'}));
									} else {
										self.resumeInstitutionCodes.push(new ResumeInstitutionCode({institutionCode: facet.key, occurrences: facet.doc_count, name: facet.key}));
									}
								});
								break;
							case "collection_name":
								self.resumeCollectionCodes.removeAll();
								_.each(data.counts, function(facet) {
									if(facet.key == "") {
										self.resumeCollectionCodes.push(new ResumeCollectionCode({collectionCode: facet.key, occurrences: facet.doc_count, name: 'No documentado'}));
									} else {
										self.resumeCollectionCodes.push(new ResumeCollectionCode({collectionCode: facet.key, occurrences: facet.doc_count, name: facet.key}));
									}
								});
								break;
						}
					});

					/*_.each(allData.aggregations.common_names.common.buckets, function(data) {
						commons.push(new ResumeCount({name: data.key, count: data.doc_count}));
					});*/

					switch(self.selectedSubject()) {
						case "0":
							canonicals.removeAll();
							break;
						case "100":
							kingdoms.removeAll();
							break;
						case "101":
							phylums.removeAll();
							break;
						case "102":
							taxonClasses.removeAll();
							break;
						case "103":
							order_ranks.removeAll();
							break;
						case "104":
							families.removeAll();
							break;
						case "105":
							genuses.removeAll();
							break;
						case "106":
							species.removeAll();
							break;
						case "25":
							providers.removeAll();
							break;
						case "24":
							resources.removeAll();
							break;
						case "5":
							countries.removeAll();
							break;
						case "38":
							departments.removeAll();
							break;
					}

					/*switch(self.selectedSubject()) {
						case "31":
							self.resumeCommonNames.removeAll();
							_.each(allData.aggregations.common_names.common.buckets, function(data) {
								self.resumeCommonNames.push(new ResumeCommonName({canonical: data.key, occurrences: data.doc_count}));
							});
							commons.removeAll();
							break;
						case "39":
							self.resumeCounties.removeAll();
							_.each(allData.aggregations.iso_county_code.buckets, function(data) {
								self.resumeCounties.push(new ResumeCounty({isoCountyCode: data.key, countyName: data.county_name.buckets[0].key, occurrences: data.doc_count, departmentAndCountyName: data.county_name.buckets[0].key + " - " + data.county_name.buckets[0].department_name.buckets[0].key}));
							});
							counties.removeAll();
							break;
					}*/

					self.resumesInfoFilter.removeAll();
					self.resumesInfoFilter.push(new ResumeInfo({canonicals: canonicals, commons: commons, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, countries: countries, departments: departments, counties: counties}));
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
				self.selectedTaxonNames.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.kingdom, textName: "reino", id: selectedFilter.id}));
			if(self.selectedSubject() == 101)
				self.selectedTaxonNames.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.phylum, textName: "filo", id: selectedFilter.id}));
			if(self.selectedSubject() == 102)
				self.selectedTaxonNames.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.nameClass, textName: "clase", id: selectedFilter.id}));
			if(self.selectedSubject() == 103)
				self.selectedTaxonNames.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.order_rank, textName: "orden", id: selectedFilter.id}));
			if(self.selectedSubject() == 104)
				self.selectedTaxonNames.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.family, textName: "familia", id: selectedFilter.id}));
			if(self.selectedSubject() == 105)
				self.selectedTaxonNames.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.genus, textName: "género", id: selectedFilter.id}));
			if(self.selectedSubject() == 106)
				self.selectedTaxonNames.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.species, textName: "especie", id: selectedFilter.id}));
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
			self.selectedCountiesIDs.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.isoCountyCode, textName: selectedFilter.countyDropdown}));
			self.totalFilters(self.totalFilters()+1);
		},
		// Removes County filter
		removeCountyID: function(parent, selectedFilter) {
			var self = this;
			self.selectedCountiesIDs.remove(selectedFilter);
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
		// Add data of institution name
		addDataInstitutionCode: function() {
			var self = this;
			self.selectedInstitutionCodes.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: self.objectNameValue(), textName: "Institution code"}));
			self.totalFilters(self.totalFilters()+1);
		},
		addDataInstitutionCodeFromHelp: function(parent, selectedFilter) {
			var self = parent;
			self.selectedInstitutionCodes.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.name, textName: "Institution code", id: selectedFilter.institutionCode}));
			self.totalFilters(self.totalFilters()+1);
		},
		// Remove data of institution name
		removeDataInstitutionCode: function(parent, selectedFilter) {
			var self = parent;
			self.selectedInstitutionCodes.remove(selectedFilter);
			self.totalFilters(self.totalFilters()-1);
		},
		// Add data of collection name
		addDataCollectionName: function() {
			var self = this;
			self.selectedCollectionNames.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: self.objectNameValue(), textName: "Collection name"}));
			self.totalFilters(self.totalFilters()+1);
		},
		addDataCollectionNameFromHelp: function(parent, selectedFilter) {
			var self = parent;
			self.selectedCollectionNames.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.name, textName: "Collection name", id: selectedFilter.collectionCode}));
			self.totalFilters(self.totalFilters()+1);
		},
		// Remove data of collection name
		removeDataCollectionName: function(parent, selectedFilter) {
			var self = parent;
			self.selectedCollectionNames.remove(selectedFilter);
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
			var commons = ko.observableArray();

			_.each(allData.aggregations.canonical.buckets, function(data) {
				canonicals.push(new ResumeCount({name: data.key, count: data.doc_count}));
			});

			_.each(allData.aggregations.kingdom.buckets, function(data) {
				kingdoms.push(new ResumeCount({id: ((typeof data.id.buckets[0] !== 'undefined') ? data.id.buckets[0].key : ''), url: ((typeof data.id.buckets[0] !== 'undefined') ? "http://maps.sibcolombia.net/species/"+data.id.buckets[0].key : ''), name: data.key, count: data.doc_count}));
			});

			_.each(allData.aggregations.data_provider_id.buckets, function(data) {
				providers.push(new ResumeCount({id: data.key, url: "http://maps.sibcolombia.net/publicadores/provider/"+data.key, name: data.data_provider_name.buckets[0].key, count: data.doc_count}));
			});

					_.each(allData.aggregations.data_resource_id.buckets, function(data) {
				resources.push(new ResumeCount({id: data.key, url: "http://maps.sibcolombia.net/conjuntos/resource/"+data.key, name: data.data_provider_id.buckets[0].data_resource_name.buckets[0].key, count: data.doc_count}));
			});

			_.each(allData.aggregations.phylum.buckets, function(data) {
				phylums.push(new ResumeCount({id: ((typeof data.id.buckets[0] !== 'undefined') ? data.id.buckets[0].key : ''), url: ((typeof data.id.buckets[0] !== 'undefined') ? "http://maps.sibcolombia.net/species/"+data.id.buckets[0].key : ''), name: data.key, count: data.doc_count}));
			});

			_.each(allData.aggregations.class.buckets, function(data) {
				taxonClasses.push(new ResumeCount({id: ((typeof data.id.buckets[0] !== 'undefined') ? data.id.buckets[0].key : ''), url: ((typeof data.id.buckets[0] !== 'undefined') ? "http://maps.sibcolombia.net/species/"+data.id.buckets[0].key : ''), name: data.key, count: data.doc_count}));
			});

			_.each(allData.aggregations.order.buckets, function(data) {
				order_ranks.push(new ResumeCount({id: ((typeof data.id.buckets[0] !== 'undefined') ? data.id.buckets[0].key : ''), url: ((typeof data.id.buckets[0] !== 'undefined') ? "http://maps.sibcolombia.net/species/"+data.id.buckets[0].key : ''), name: data.key, count: data.doc_count}));
			});

			_.each(allData.aggregations.family.buckets, function(data) {
				families.push(new ResumeCount({id: ((typeof data.id.buckets[0] !== 'undefined') ? data.id.buckets[0].key : ''), url: ((typeof data.id.buckets[0] !== 'undefined') ? "http://maps.sibcolombia.net/species/"+data.id.buckets[0].key : ''), name: data.key, count: data.doc_count}));
			});

			_.each(allData.aggregations.genus.buckets, function(data) {
				genuses.push(new ResumeCount({id: ((typeof data.id.buckets[0] !== 'undefined') ? data.id.buckets[0].key : ''), url: ((typeof data.id.buckets[0] !== 'undefined') ? "http://maps.sibcolombia.net/species/"+data.id.buckets[0].key : ''), name: data.key, count: data.doc_count}));
			});

			_.each(allData.aggregations.species.buckets, function(data) {
				species.push(new ResumeCount({id: ((typeof data.id.buckets[0] !== 'undefined') ? data.id.buckets[0].key : ''), url: ((typeof data.id.buckets[0] !== 'undefined') ? "http://maps.sibcolombia.net/species/"+data.id.buckets[0].key : ''), name: data.key, count: data.doc_count}));
			});

			_.each(allData.aggregations.iso_country_code.buckets, function(data) {
				countries.push(new ResumeCount({id: data.key, url: "http://maps.sibcolombia.net/countries/"+data.key, name: data.country_name.buckets[0].key, count: data.doc_count}));
			});

			_.each(allData.aggregations.iso_department_code.buckets, function(data) {
				departments.push(new ResumeCount({id: data.key, url: "http://maps.sibcolombia.net/departments/"+data.key, name: data.department_name.buckets[0].key, count: data.doc_count}));
			});

			_.each(allData.aggregations.iso_county_code.buckets, function(data) {
				counties.push(new ResumeCount({id: data.key, name: data.county_name.buckets[0].department_name.buckets[0].key + " - " + data.county_name.buckets[0].key, count: data.doc_count}));
			});

			_.each(allData.aggregations.common_names.common.buckets, function(data) {
				commons.push(new ResumeCount({name: data.key, count: data.doc_count}));
			});

			self.resumesInfo.removeAll();
			self.resumesInfo.push(new ResumeInfo({cellID: a.layer.options.cellID, canonicals: canonicals, commons: commons, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, counties: counties}));
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
			map.removeLayer(self.densityCells());

			jQuery.extend(self.densityCells(),self.densityCellsCache());

			map.addLayer(self.densityCells());
			self.totalGeoOccurrences(self.totalGeoOccurrencesCache());
			self.totalOccurrences(self.totalOccurrencesCache());

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
			var url = "http://maps.sibcolombia.net/occurrences/downloadSpreadsheet.htm?";
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
			if(self.selectedOnMapRadialCoordinates().length != 0 || self.selectedOnMapPoligonCoordinates().length != 0 || self.isRectangle()) {
				counter++;
			}
			self.urlDownloadSpreadsheet(url);
			self.urlDownloadSpreadsheetWithURL(url+"&c["+counter+"].s=28&c["+counter+"].p=0&c["+counter+"].o=0");
			//if( counter !== 0 )
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
		},
		validateEmail: function(email) {
			var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
			return re.test(email);
		},
		validateDownloadForm: function(newValue) {
			var self = this;
			if (!newValue) {
				if(self.downloadEmail() !== "") {
					if(!self.validateEmail(self.downloadEmail())) {
						self.downloadFormValidationError(true);
						self.downloadFormValidationErrorMessage("La dirección de correo electrónico es erronea.")
						$("#inputEmail").parent().parent().addClass("has-error");
					} else {
						$("#inputEmail").parent().parent().removeClass("has-error");
						$("#inputEmail").parent().parent().addClass("has-success");
						self.downloadFormValidationError(false);
						if(self.downloadEmail() !== "" && self.downloadEmailVerification() !== "") {
							if(self.downloadEmail().toLowerCase() !== self.downloadEmailVerification().toLowerCase()) {
								self.downloadFormValidationError(true);
								self.downloadFormValidationErrorMessage("La dirección de correo electrónico y la dirección de confirmación deben ser iguales.")
								$("#inputEmailConfirmation").parent().parent().addClass("has-error");
							} else {
								self.downloadFormValidationError(false);
								$("#inputEmailConfirmation").parent().parent().removeClass("has-error");
								$("#inputEmailConfirmation").parent().parent().addClass("has-success");
							}
						}
					}
				}
			}
		},
		startDataDownload: function() {
			var self = this;
			var query = self.fillSearchConditions();
			var urlParams = query.url;

			self.validateDownloadForm(false);
			if(!self.downloadFormValidationError() && self.downloadEmail() !== "" && self.downloadEmailVerification() !== "") {
				if($('#recaptcha_response_field').val() !== "") {
					// Form is valid a we have a filled captcha
					var request = {
						"email": self.downloadEmail(),
						"reason": self.downloadReason(),
						"type": self.downloadType(),
						"query": query,
						"queryUrlParameters": urlParams,
						"challenge": $('#recaptcha_challenge_field').val(),
						"response": $('#recaptcha_response_field').val(),
						"date": Date.now()/1000
					};
					var data = ko.toJSON(request);
					$.ajax({
						contentType: 'application/json',
						type: 'POST',
						url: '/occurrences/download',
						data: data,
						beforeSend: function() {
							$(".modal-body").addClass("hide-element");
							$(".modal-content").addClass("loading3");
						},
						success: function(returnedData) {
							$(".modal-body").removeClass("hide-element");
							$(".modal-content").removeClass("loading3");
							$('#modalDownloadAll').modal('hide');
							$('#modalDownloadAllSuccess').modal('show');
						},
						error: function(error) {
							console.log(error);
							$(".modal-body").removeClass("hide-element");
							$(".modal-content").removeClass("loading3");
							if(error.status == 401) {
								Recaptcha.reload();
								self.downloadFormValidationError(true);
								self.downloadFormValidationErrorMessage("Error al completar el número en el captcha.");
							} else {
								$('#modalDownloadAll').modal('hide');
								$('#modalDownloadAllFail').modal('show');
							}
						},
						dataType: 'jsonp'
					});
				} else {
					self.downloadFormValidationError(true);
					self.downloadFormValidationErrorMessage("Por favor complete los campos obligatorios para iniciar la descarga.");
				}
			} else {
				self.downloadFormValidationError(true);
				self.downloadFormValidationErrorMessage("Por favor complete los campos obligatorios para iniciar la descarga.");
			}
		}
	});

	return OccurrenceSearchViewModel;
});
