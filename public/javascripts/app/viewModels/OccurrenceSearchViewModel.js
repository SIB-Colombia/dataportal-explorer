define(["jquery", "knockout", "underscore", "app/models/baseViewModel", "app/map-initialize", "app/models/occurrence", "app/models/resumeInfo", "app/models/resumeCount", "app/models/resumeScientificName", "app/models/resumeKingdomName", "app/models/resumePhylumName", "app/models/resumeClassName", "app/models/resumeOrderName", "app/models/resumeFamilyName", "app/models/resumeGenusName", "app/models/resumeSpecieName", "app/models/resumeDataProvider", "app/models/resumeDataResource", "app/models/resumeInstitutionCode", "app/models/resumeCollectionCode", "app/models/resumeCountry", "app/models/resumeDepartment", "app/models/resumeCounty", "app/models/county", "app/models/coordinate", "app/models/radialCoordinate", "app/models/filterSelected", "select2", "knockoutKendoUI", "Leaflet", "jqueryUI", "bootstrap", "customScrollBar"], function($, ko, _, BaseViewModel, map, Occurrence, ResumeInfo, ResumeCount, ResumeScientificName, ResumeKingdomName, ResumePhylumName, ResumeClassName, ResumeOrderName, ResumeFamilyName, ResumeGenusName, ResumeSpecieName, ResumeDataProvider, ResumeDataResource, ResumeInstitutionCode, ResumeCollectionCode, ResumeCountry, ResumeDepartment, ResumeCounty, County, Coordinate, RadialCoordinate, FilterSelected, select2) {
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

		// Arrays for resume help windows
		self.resumeScientificNames = [];
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
		self.selectedCoordinateState = "";

		// Download URLs
		self.urlDownloadSpreadsheet = "";
		self.urlDownloadSpreadsheetWithURL = "";

		// Resume info
		self.resumesInfo = [];
		self.resumesInfoFilter = [];

		BaseViewModel.apply( this, arguments );
	};

	_.extend(OccurrenceSearchViewModel.prototype, BaseViewModel.prototype, self.densityCellsOneDegree, {
		initialize: function() {
			var self = this;
			this.loadCountyDropdownData();
			this.loadGridData();
			this.loadCellDensityOneDegree();
			this.loadCellDensityPointFiveDegree();
			this.loadCellDensityPointTwoDegree();
			this.loadCellDensityPointOneDegree();

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
				if(self.selectedSubject() == "0") {
					// Load new scientific name data
					self.hideResumeContainer();
					self.getScientificNamesData();
				} else if(self.selectedSubject() == 100) {
					// Get resume kingdom data
					self.hideResumeContainer();
					self.getKingdomNamesData();
				} else if(self.selectedSubject() == 101) {
					// Get resume phylum data
					self.hideResumeContainer();
					self.getPhylumNamesData();
				} else if(self.selectedSubject() == 102) {
					// Get resume class data
					self.hideResumeContainer();
					self.getClassNamesData();
				} else if(self.selectedSubject() == 103) {
					// Get resume order data
					self.hideResumeContainer();
					self.getOrderNamesData();
				} else if(self.selectedSubject() == 104) {
					// Get resume family data
					self.hideResumeContainer();
					self.getFamilyNamesData();
				} else if(self.selectedSubject() == 105) {
					// Get resume genus data
					self.hideResumeContainer();
					self.getGenusNamesData();
				} else if(self.selectedSubject() == 106) {
					// Get resume species data
					self.hideResumeContainer();
					self.getSpeciesNamesData();
				} else if(self.selectedSubject() == 25) {
					// Get resume data providers data
					self.hideResumeContainer();
					self.getDataProvidersData();
				} else if(self.selectedSubject() == 24) {
					// Get resume data resources data}
					self.hideResumeContainer();
					self.getDataResourcesData();
				} else if(self.selectedSubject() == 12) {
					// Get institution codes data
					self.hideResumeContainer();
					self.getInstitutionCodesData();
				} else if(self.selectedSubject() == 13) {
					// Get collection codes data
					self.hideResumeContainer();
					self.getCollectionCodesData();
				}
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
							self.getCountriesData();
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
							self.getDepartmentsData();
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
							self.getCountiesData();
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
								self.gridItems.push(new Occurrence({id: occurrence.fields.id, canonical: occurrence.fields.canonical, data_resource_name: occurrence.fields.data_resource_name, institution_code: occurrence.fields.institution_code, collection_code: occurrence.fields.collection_code, catalogue_number: occurrence.fields.catalogue_number, occurrence_date: occurrence.fields.occurrence_date, latitude: occurrence.fields.location.lat, longitude: occurrence.fields.location.lon, country_name: occurrence.fields.country_name, department_name: occurrence.fields.department_name, basis_of_record_name_spanish: occurrence.fields.basis_of_record_name_spanish}));
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
						empty: "Arrastre un encabezado de calumna a esta zona para agrupar por dicha columna."
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
					{ field: "location()", title: "Coordenadas", width: "8%", sortable: false },
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
			}

			function basisOfRecordFilter(element) {
				var data = [
					{ text: "Desconocido", value: "desconocido" },
					{ text: "Espécimen", value: "espécimen" },
					{ text: "Espécimen Fosilizado", value: "espécimen fosilizado" },
					{ text: "Espécimen Preservado", value: "espécimen preservado" },
					{ text: "Espécimen Vivo", value: "espécimen vivo" },
					{ text: "Fosil", value: "fosil" },
					{ text: "Germoplasmo", value: "germoplasmo" },
					{ text: "Grabación de Sonido", value: "grabación de sonido" },
					{ text: "Imagen en Movimiento", value: "imagen en movimiento" },
					{ text: "Imagen Fija", value: "imagen fija" },
					{ text: "Lista legislativa", value: "lista legislativa" },
					{ text: "Lista regional", value: "lista regional" },
					{ text: "Literatura", value: "literatura" },
					{ text: "Nomenclaturador", value: "nomenclaturador" },
					{ text: "Observación", value: "observación" },
					{ text: "Observación con Máquina", value: "observación con máquina" },
					{ text: "Observación Humana", value: "observación humana" },
					{ text: "Otro Espécimen", value: "otro espécimen" },
					{ text: "Taxonomía", value: "taxonomía" },
					{ text: "Viviendo", value: "viviendo" }
				];
				element.kendoDropDownList({
					dataTextField: "text",
					dataValueField: "value",
					dataSource: data,
					optionLabel: "-- Seleccione --"
				});
			}
		},
		loadCountyDropdownData: function() {
			var self = this;
			$.ajax({
				contentType: 'application/json',
				type: 'GET',
				url: '/rest/occurrences/counties/list',
				success: function(allData) {
					$.each(allData.facets.counties.terms, function(i, county) {
						var countyData = county.term.split("~~~");
						self.countyDropdown.push(new County({departmentName: countyData[0], countyName: countyData[1], isoCountyCode: countyData[2]}));
					});
				},
				dataType: 'jsonp'
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
					var bounds = [[cell.fields.location_cell.lat, cell.fields.location_cell.lon], [cell.fields.location_cell.lat+1, cell.fields.location_cell.lon+1]];
					var color = "#ff7800";
					if (cell.fields.count > 0 && cell.fields.count < 10) {
						color = "#FFFF00";
					} else if(cell.fields.count > 9 && cell.fields.count < 100) {
						color = "#FFCC00";
					} else if(cell.fields.count > 99 && cell.fields.count < 1000) {
						color = "#FF9900";
					} else if(cell.fields.count > 999 && cell.fields.count < 10000) {
						color = "#FF6600";
					} else if(cell.fields.count > 9999 && cell.fields.count < 100000) {
						color = "#FF3300";
					} else if(cell.fields.count > 99999) {
						color = "#CC0000";
					}
					var densityCell = new L.rectangle(bounds, {color: color, weight: 1, fill: true, fillOpacity: 0.5, cellID: cell.fields.cell_id});
					densityCell.on('click', function (a) {
						a.target.bindPopup("<strong>No. registros: </strong>" + cell.fields.count + "</br></br><strong>Ubicación:</strong></br>[" + cell.fields.location_cell.lat + ", " + cell.fields.location_cell.lon + "] [" + (cell.fields.location_cell.lat+1) + ", " + (cell.fields.location_cell.lon+1) + "]").openPopup();
					});
					self.densityCellsOneDegree().addLayer(densityCell);
				});
				self.totalGeoOccurrences(allData.facets.stats.total);
				self.totalGeoOccurrencesCache(allData.facets.stats.total);

				self.densityCellsOneDegree().on('click', function (a) {
					// Hide map area
					//self.disableFilterHelp();
					self.hideMapAreaWithSpinner();
					$.getJSON("/rest/distribution/onedegree/stats/"+a.layer.options.cellID, function(allData) {
						self.fillCellDensityOneDegreeData(allData, a);
					});
				});
				jQuery.extend(self.densityCellsOneDegreeCache(),self.densityCellsOneDegree());
			});
		},
		loadCellDensityPointOneDegree: function() {
			var self = this;
			// Initialize default cell density distribution (one degree)
			var densityCellsPointOneDegree = new L.FeatureGroup();
			$.getJSON("/rest/distribution/centidegree/list", function(allData) {
				$.each(allData.hits.hits, function(i, cell) {
					var bounds = [[cell.fields.location_centi_cell.lat, cell.fields.location_centi_cell.lon], [cell.fields.location_centi_cell.lat+0.1, cell.fields.location_centi_cell.lon+0.1]];
					var color = "#ff7800";
					if (cell.fields.count > 0 && cell.fields.count < 10) {
						color = "#FFFF00";
					} else if(cell.fields.count > 9 && cell.fields.count < 100) {
						color = "#FFCC00";
					} else if(cell.fields.count > 99 && cell.fields.count < 1000) {
						color = "#FF9900";
					} else if(cell.fields.count > 999 && cell.fields.count < 10000) {
						color = "#FF6600";
					} else if(cell.fields.count > 9999 && cell.fields.count < 100000) {
						color = "#FF3300";
					} else if(cell.fields.count > 99999) {
						color = "#CC0000";
					}
					var densityCell = new L.rectangle(bounds, {color: color, weight: 1, fill: true, fillOpacity: 0.5, cellID: cell.fields.cell_id, centicellID: cell.fields.centi_cell_id});
					densityCell.on('click', function (a) {
						a.target.bindPopup("<strong>No. registros: </strong>" + cell.fields.count + "</br></br><strong>Ubicación:</strong></br>[" + cell.fields.location_centi_cell.lat + ", " + cell.fields.location_centi_cell.lon + "] [" + (((cell.fields.location_centi_cell.lat*10)+1)/10) + ", " + (((cell.fields.location_centi_cell.lon*10)+1)/10) + "]").openPopup();
					});
					self.densityCellsPointOneDegree().addLayer(densityCell);
				});

				self.densityCellsPointOneDegree().on('click', function (a) {
					// Hide map area
					self.hideMapAreaWithSpinner();
					$.getJSON("/rest/distribution/centidegree/stats/"+a.layer.options.cellID+"/"+a.layer.options.centicellID, function(allData) {
						self.fillCellDensityPointOneDegreeData(allData, a);
					});
				});
				// Show map area
				self.showMapAreaWithSpinner();
				$("#oneDegree").button('toggle');
				self.currentActiveDistribution("oneDegree");
				//$("#oneDegree").button('self');
				//toggle.currentActiveDistribution("oneDegree");
				jQuery.extend(self.densityCellsPointOneDegreeCache(),self.densityCellsPointOneDegree());
			});
		},
		loadCellDensityPointFiveDegree: function() {
			var self = this;
			// Initialize default cell density distribution (five degrees)
			var densityCellsPointFiveDegree = new L.FeatureGroup();
			$.getJSON("/rest/distribution/pointfivedegree/list", function(allData) {
				$.each(allData.hits.hits, function(i, cell) {
					var bounds = [[cell.fields.location_pointfive_cell.lat, cell.fields.location_pointfive_cell.lon], [cell.fields.location_pointfive_cell.lat+0.5, cell.fields.location_pointfive_cell.lon+0.5]];
					var color = "#ff7800";
					if (cell.fields.count > 0 && cell.fields.count < 10) {
						color = "#FFFF00";
					} else if(cell.fields.count > 9 && cell.fields.count < 100) {
						color = "#FFCC00";
					} else if(cell.fields.count > 99 && cell.fields.count < 1000) {
						color = "#FF9900";
					} else if(cell.fields.count > 999 && cell.fields.count < 10000) {
						color = "#FF6600";
					} else if(cell.fields.count > 9999 && cell.fields.count < 100000) {
						color = "#FF3300";
					} else if(cell.fields.count > 99999) {
						color = "#CC0000";
					}
					var densityCell = new L.rectangle(bounds, {color: color, weight: 1, fill: true, fillOpacity: 0.5, cellID: cell.fields.cell_id, pointfivecellID: cell.fields.pointfive_cell_id});
					densityCell.on('click', function (a) {
						a.target.bindPopup("<strong>No. registros: </strong>" + cell.fields.count + "</br></br><strong>Ubicación:</strong></br>[" + cell.fields.location_pointfive_cell.lat + ", " + cell.fields.location_pointfive_cell.lon + "] [" + (((cell.fields.location_pointfive_cell.lat*10)+5)/10) + ", " + (((cell.fields.location_pointfive_cell.lon*10)+5)/10) + "]").openPopup();
					});
					self.densityCellsPointFiveDegree().addLayer(densityCell);
				});

				self.densityCellsPointFiveDegree().on('click', function (a) {
					// Hide map area
					self.hideMapAreaWithSpinner();
					$.getJSON("/rest/distribution/pointfivedegree/stats/"+a.layer.options.cellID+"/"+a.layer.options.pointfivecellID, function(allData) {
						self.fillCellDensityPointFiveDegreeData(allData, a);
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
					var bounds = [[cell.fields.location_pointtwo_cell.lat, cell.fields.location_pointtwo_cell.lon], [cell.fields.location_pointtwo_cell.lat+0.2, cell.fields.location_pointtwo_cell.lon+0.2]];
					var color = "#ff7800";
					if (cell.fields.count > 0 && cell.fields.count < 10) {
						color = "#FFFF00";
					} else if(cell.fields.count > 9 && cell.fields.count < 100) {
						color = "#FFCC00";
					} else if(cell.fields.count > 99 && cell.fields.count < 1000) {
						color = "#FF9900";
					} else if(cell.fields.count > 999 && cell.fields.count < 10000) {
						color = "#FF6600";
					} else if(cell.fields.count > 9999 && cell.fields.count < 100000) {
						color = "#FF3300";
					} else if(cell.fields.count > 99999) {
						color = "#CC0000";
					}
					var densityCell = new L.rectangle(bounds, {color: color, weight: 1, fill: true, fillOpacity: 0.5, cellID: cell.fields.cell_id, pointtwocellID: cell.fields.pointtwo_cell_id});
					densityCell.on('click', function (a) {
						a.target.bindPopup("<strong>No. registros: </strong>" + cell.fields.count + "</br></br><strong>Ubicación:</strong></br>[" + cell.fields.location_pointtwo_cell.lat + ", " + cell.fields.location_pointtwo_cell.lon + "] [" + (((cell.fields.location_pointtwo_cell.lat*10)+2)/10) + ", " + (((cell.fields.location_pointtwo_cell.lon*10)+2)/10) + "]").openPopup();
					});
					self.densityCellsPointTwoDegree().addLayer(densityCell);
				});

				self.densityCellsPointTwoDegree().on('click', function (a) {
					// Hide map area
					self.hideMapAreaWithSpinner();
					$.getJSON("/rest/distribution/pointtwodegree/stats/"+a.layer.options.cellID+"/"+a.layer.options.pointtwocellID, function(allData) {
						self.fillCellDensityPointTwoDegreeData(allData, a);
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
			$("#filtersContainerHelp").css({display: 'none'});
			// Clear actual resume filter
			self.objectNameValue("");

			self.isObjectNameHelpSelected = ko.observable(false);
			// Default filters predicate
			self.predicateOptions([{value: 'eq', name: 'es'}]);
			if(self.selectedSubject() == "0") {
				// Get Scientific Name resume data
				self.getScientificNamesData();
			} else if(self.selectedSubject() == 100) {
				// Get kingdom resume data
				self.getKingdomNamesData();
			} else if(self.selectedSubject() == 101) {
				// Get phylum resume data
				self.getPhylumNamesData();
			} else if(self.selectedSubject() == 102) {
				// Get class resume data
				self.getClassNamesData();
			} else if(self.selectedSubject() == 103) {
				// Get order resume data
				self.getOrderNamesData();
			} else if(self.selectedSubject() == 104) {
				// Get family resume data
				self.getFamilyNamesData();
			} else if(self.selectedSubject() == 105) {
				// Get genus resume data
				self.getGenusNamesData();
			} else if(self.selectedSubject() == 106) {
				// Get species resume data
				self.getSpeciesNamesData();
			} else if(self.selectedSubject() == 25) {
				// Get data providers resume data
				self.getDataProvidersData();
			} else if(self.selectedSubject() == 24) {
				// Get data resources resume data
				self.getDataResourcesData();
			} else if(self.selectedSubject() == 12) {
				// Get institution codes resume data
				self.getInstitutionCodesData();
			} else if(self.selectedSubject() == 13) {
				// Get collection codes resume data
				self.getCollectionCodesData();
			} else if(self.selectedSubject() == 1 || self.selectedSubject() == 2 || self.selectedSubject() == 34 || self.selectedSubject() == 35) {
				self.predicateOptions([{value: 'eq', name: 'es'},{value: 'gt', name: 'mayor que'},{value: 'lt', name: 'menor que'}]);
			} else if(self.selectedSubject() == 5) {
				// Get countries resume data
				self.getCountriesData();
				self.isObjectNameHelpSelected = ko.observable(true);
				$("#filtersContainerHelp").animate({width: 'toggle'}, 500, "swing", function() {
					if(self.firstScrollRun) {
						$("#contentFiltersContainerHelp").mCustomScrollbar({
							theme:"dark"
						});
						self.firstScrollRun = false;
					} else {
						$("#contentFiltersContainerHelp").mCustomScrollbar("update");
					}
				});
				$("#dropDownCountry").select2();
				$(".select2-input").on("click", function(event) {
					self.enableFilterHelp();
				});
			} else if(self.selectedSubject() == 38) {
				// Get countries resume data
				self.getDepartmentsData();
				self.isObjectNameHelpSelected = ko.observable(true);
				$("#filtersContainerHelp").animate({width: 'toggle'}, 500, "swing", function() {
					if(self.firstScrollRun) {
						$("#contentFiltersContainerHelp").mCustomScrollbar({
							theme:"dark"
						});
						self.firstScrollRun = false;
					} else {
						$("#contentFiltersContainerHelp").mCustomScrollbar("update");
					}
				});
				$("#dropDownDepartment").select2();
				$(".select2-input").on("click", function(event) {
					self.enableFilterHelp();
				});
			} else if(self.selectedSubject() == 39) {
				// Get countries resume data
				self.getCountiesData();
				self.isObjectNameHelpSelected = ko.observable(true);
				$("#filtersContainerHelp").animate({width: 'toggle'}, 500, "swing", function() {
					if(self.firstScrollRun) {
						$("#contentFiltersContainerHelp").mCustomScrollbar({
							theme:"dark"
						});
						self.firstScrollRun = false;
					} else {
						$("#contentFiltersContainerHelp").mCustomScrollbar("update");
					}
				});
				$("#dropDownCounty").select2();
				$(".select2-input").on("click", function(event) {
					self.enableFilterHelp();
				});
			}
			self.getHelpSearchText();
		},
		getHelpSearchText: function() {
			var self = this;
			$.getJSON("/rest/occurrences/searchhelptext/name/"+self.selectedSubject(), function(allData) {
				self.helpSearchText(allData.hits.hits[0].fields.text);
			});
		},
		enableFilterHelp: function() {
			var self = this;
			self.disableResumeDetail();
			if((self.isObjectNameHelpSelected() === false || $("#filtersContainerHelp").is(':hidden')) && self.selectedSubject() != 1 && self.selectedSubject() != 2 && self.selectedSubject() != 34 && self.selectedSubject() != 35 && self.selectedSubject() != 21 && self.selectedSubject() != 14) {
				self.isObjectNameHelpSelected = ko.observable(true);
				$("#filtersContainerHelp").animate({width: 'toggle'}, 500, "swing", function() {
					if(self.firstScrollRun) {
						$("#contentFiltersContainerHelp").mCustomScrollbar({
							theme:"dark"
						});
						self.firstScrollRun = false;
					} else {
						$("#contentFiltersContainerHelp").mCustomScrollbar("update");
					}
				});
			}
		},
		addFilterItem: function() {
			var self = this;
			if(self.objectNameValue() !== "") {
				if(self.selectedSubject() == "0") {
					// Adding scientific name filter
					self.addScientificName();
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
			if(self.selectedTaxonNames().length !== 0)
				response['taxons'] = self.selectedTaxonNames();
			if(self.selectedCountriesIDs().length !== 0)
				response['countries'] = self.selectedCountriesIDs();
			if(self.selectedDepartmentsIDs().length !== 0)
				response['departments'] = self.selectedDepartmentsIDs();
			if(self.selectedCountiesIDs().length !== 0)
				response['counties'] = self.selectedCountiesIDs();
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
					$.each(returnedData.facets.cellgroup.terms, function(i, cell) {
						var idAndLocation = cell.term.split("~~~");
						var bounds = [[parseFloat(idAndLocation[1]), parseFloat(idAndLocation[2])], [parseFloat(idAndLocation[1])+1, parseFloat(idAndLocation[2])+1]];
						var color = "#ff7800";
						if (cell.count > 0 && cell.count < 10) {
							color = "#FFFF00";
						} else if(cell.count > 9 && cell.count < 100) {
							color = "#FFCC00";
						} else if(cell.count > 99 && cell.count < 1000) {
							color = "#FF9900";
						} else if(cell.count > 999 && cell.count < 10000) {
							color = "#FF6600";
						} else if(cell.count > 9999 && cell.count < 100000) {
							color = "#FF3300";
						} else if(cell.count > 99999) {
							color = "#CC0000";
						}
						var densityCell = new L.rectangle(bounds, {color: color, weight: 1, fill: true, fillOpacity: 0.5, cellID: idAndLocation[0]});
						densityCell.on('click', function (a) {
							a.target.bindPopup("<strong>No. registros: </strong>" + cell.count + "</br></br><strong>Ubicación:</strong></br>[" + idAndLocation[1] + ", " + idAndLocation[2] + "] [" + (parseFloat(idAndLocation[1])+1) + ", " + (parseFloat(idAndLocation[2])+1) + "]").openPopup();
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
								self.fillCellDensityOneDegreeData(allData, a);
							},
							dataType: 'jsonp'
						});
					});

					$.each(returnedData.facets.pointfivegroup.terms, function(i, cell) {
						var idAndLocation = cell.term.split("~~~");
						var bounds = [[parseFloat(idAndLocation[2]), parseFloat(idAndLocation[3])], [parseFloat(idAndLocation[2])+0.5, parseFloat(idAndLocation[3])+0.5]];
						var color = "#ff7800";
						if (cell.count > 0 && cell.count < 10) {
							color = "#FFFF00";
						} else if(cell.count > 9 && cell.count < 100) {
							color = "#FFCC00";
						} else if(cell.count > 99 && cell.count < 1000) {
							color = "#FF9900";
						} else if(cell.count > 999 && cell.count < 10000) {
							color = "#FF6600";
						} else if(cell.count > 9999 && cell.count < 100000) {
							color = "#FF3300";
						} else if(cell.count > 99999) {
							color = "#CC0000";
						}
						var densityCell = new L.rectangle(bounds, {color: color, weight: 1, fill: true, fillOpacity: 0.5, cellID: idAndLocation[0], pointfivecellID: idAndLocation[1]});
						densityCell.on('click', function (a) {
							a.target.bindPopup("<strong>No. registros: </strong>" + cell.count + "</br></br><strong>Ubicación:</strong></br>[" + idAndLocation[2] + ", " + idAndLocation[3] + "] [" + (((parseFloat(idAndLocation[2])*10)+5)/10) + ", " + (((parseFloat(idAndLocation[3])*10)+5)/10) + "]").openPopup();
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
								self.fillCellDensityPointFiveDegreeData(allData, a);
							},
							dataType: 'jsonp'
						});
					});

					$.each(returnedData.facets.pointtwogroup.terms, function(i, cell) {
						var idAndLocation = cell.term.split("~~~");
						var bounds = [[parseFloat(idAndLocation[2]), parseFloat(idAndLocation[3])], [parseFloat(idAndLocation[2])+0.2, parseFloat(idAndLocation[3])+0.2]];
						var color = "#ff7800";
						if (cell.count > 0 && cell.count < 10) {
							color = "#FFFF00";
						} else if(cell.count > 9 && cell.count < 100) {
							color = "#FFCC00";
						} else if(cell.count > 99 && cell.count < 1000) {
							color = "#FF9900";
						} else if(cell.count > 999 && cell.count < 10000) {
							color = "#FF6600";
						} else if(cell.count > 9999 && cell.count < 100000) {
							color = "#FF3300";
						} else if(cell.count > 99999) {
							color = "#CC0000";
						}
						var densityCell = new L.rectangle(bounds, {color: color, weight: 1, fill: true, fillOpacity: 0.5, cellID: idAndLocation[0], pointtwocellID: idAndLocation[1]});
						densityCell.on('click', function (a) {
							a.target.bindPopup("<strong>No. registros: </strong>" + cell.count + "</br></br><strong>Ubicación:</strong></br>[" + idAndLocation[2] + ", " + idAndLocation[3] + "] [" + (((parseFloat(idAndLocation[2])*10)+2)/10) + ", " + (((parseFloat(idAndLocation[3])*10)+2)/10) + "]").openPopup();
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
								self.fillCellDensityPointTwoDegreeData(allData, a);
							},
							dataType: 'jsonp'
						});
					});

					$.each(returnedData.facets.centigroup.terms, function(i, cell) {
						var idAndLocation = cell.term.split("~~~");
						var bounds = [[parseFloat(idAndLocation[2]), parseFloat(idAndLocation[3])], [parseFloat(idAndLocation[2])+0.1, parseFloat(idAndLocation[3])+0.1]];
						var color = "#ff7800";
						if (cell.count > 0 && cell.count < 10) {
							color = "#FFFF00";
						} else if(cell.count > 9 && cell.count < 100) {
							color = "#FFCC00";
						} else if(cell.count > 99 && cell.count < 1000) {
							color = "#FF9900";
						} else if(cell.count > 999 && cell.count < 10000) {
							color = "#FF6600";
						} else if(cell.count > 9999 && cell.count < 100000) {
							color = "#FF3300";
						} else if(cell.count > 99999) {
							color = "#CC0000";
						}
						var densityCell = new L.rectangle(bounds, {color: color, weight: 1, fill: true, fillOpacity: 0.5, cellID: idAndLocation[0], pointonecellID: idAndLocation[1]});
						densityCell.on('click', function (a) {
							a.target.bindPopup("<strong>No. registros: </strong>" + cell.count + "</br></br><strong>Ubicación:</strong></br>[" + idAndLocation[2] + ", " + idAndLocation[3] + "] [" + (((parseFloat(idAndLocation[2])*10)+1)/10) + ", " + (((parseFloat(idAndLocation[3])*10)+1)/10) + "]").openPopup();
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
								self.fillCellDensityPointOneDegreeData(allData, a);
							},
							dataType: 'jsonp'
						});
					});

					self.totalGeoOccurrences(returnedData.hits.total);
					// Show map area
					//self.showMapAreaWithSpinner();
					if(self.currentActiveDistribution() != "none") {
						$("#"+self.currentActiveDistribution()).button('toggle');
					}
					$("#oneDegree").button('toggle');
					self.currentActiveDistribution("oneDegree");
					self.isFiltered(true);

					// Enable download links
					self.generateURLSpreadsheet();
				},
				dataType: 'jsonp'
			});
		},
		toggleDistribution: function(data, event) {
			var self = this;
			var target = event.srcElement || event.target;

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
			if(self.currentActiveDistribution() != target.id) {
				$("#"+self.currentActiveDistribution()).button('toggle');
				switch(target.id) {
					case "oneDegree":
						map.addLayer(self.densityCellsOneDegree());
						self.currentActiveDistribution("oneDegree");
						break;
					case "pointOneDegree":
						map.addLayer(self.densityCellsPointOneDegree());
						self.currentActiveDistribution("pointOneDegree");
						break;
					case "pointFiveDegree":
						map.addLayer(self.densityCellsPointFiveDegree());
						self.currentActiveDistribution("pointFiveDegree");
						break;
					case "pointTwoDegree":
						map.addLayer(self.densityCellsPointTwoDegree());
						self.currentActiveDistribution("pointTwoDegree");
						break;
				}
				$(target.id).button('toggle');
			} else {
				self.currentActiveDistribution("none");
			}
		},
		disableResumeDetail: function() {
			if(!$("#resumeDetail").is(':hidden')) {
				$("#resumeDetail").animate({width: 'toggle'});
			}
		},
		// Ajax get data functions
		getScientificNamesData: function() {
			var self = this;
			$.getJSON("/rest/occurrences/resume/scientificname/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
				self.resumeScientificNames.removeAll();
				_.each(allData.facets.canonical.terms, function(data) {
					self.resumeScientificNames.push(new ResumeScientificName({canonical: data.term, occurrences: data.count}));
				});
				var canonicals = ko.observableArray();
				var kingdoms = ko.observableArray();
				_.each(allData.facets.kingdom.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						kingdoms.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						kingdoms.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var count = 0;
				var providers = ko.observableArray();
				_.each(allData.facets.data_provider_name.terms, function(data) {
					providers.push(new ResumeCount({id: allData.facets.data_provider_id.terms[count].term, url: "http://data.sibcolombia.net/publicadores/provider/"+allData.facets.data_provider_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var resources = ko.observableArray();
				_.each(allData.facets.data_resource_name.terms, function(data) {
					resources.push(new ResumeCount({id: allData.facets.data_resource_id.terms[count].term, url: "http://data.sibcolombia.net/conjuntos/resource/"+allData.facets.data_resource_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				var phylums = ko.observableArray();
				_.each(allData.facets.phylum.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						phylums.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						phylums.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var taxonClasses = ko.observableArray();
				_.each(allData.facets.taxonClass.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						taxonClasses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						taxonClasses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var order_ranks = ko.observableArray();
				_.each(allData.facets.order_rank.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						order_ranks.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						order_ranks.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var families = ko.observableArray();
				_.each(allData.facets.family.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						families.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						families.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var genuses = ko.observableArray();
				_.each(allData.facets.genus.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						genuses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						genuses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var species = ko.observableArray();
				_.each(allData.facets.species.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						species.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						species.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				count = 0;
				var countries = ko.observableArray();
				_.each(allData.facets.country_name.terms, function(data) {
					countries.push(new ResumeCount({id: allData.facets.iso_country_code.terms[count].term, url: "http://data.sibcolombia.net/countries/"+allData.facets.iso_country_code.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var departments = ko.observableArray();
				_.each(allData.facets.department_name.terms, function(data) {
					departments.push(new ResumeCount({id: allData.facets.iso_department_code.terms[count].term, url: "http://data.sibcolombia.net/departments/"+allData.facets.iso_department_code.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				var counties = ko.observableArray();
				_.each(allData.facets.county_group.terms, function(data) {
					var countyData = data.term.split("~~~");
					counties.push(new ResumeCount({id: countyData[2], name: countyData[0] + " - " + countyData[1], count: data.count}));
				});
				self.resumesInfoFilter.removeAll();
				self.resumesInfoFilter.push(new ResumeInfo({canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, countries: countries, departments: departments, counties: counties}));
				$("#contentFiltersContainerHelp").mCustomScrollbar("update");
				self.showResumeContainer();
			});
		},
		getKingdomNamesData: function() {
			var self = this;
			$.getJSON("/rest/occurrences/resume/kingdom/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
				self.resumeKingdomNames.removeAll();
				_.each(allData.facets.kingdom.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					self.resumeKingdomNames.push(new ResumeKingdomName({kingdom: nameAndID[0], occurrences: data.count, id: nameAndID[1]}));
				});
				var kingdoms = ko.observableArray();
				var count = 0;
				var canonicals = ko.observableArray();
				_.each(allData.facets.canonical.terms, function(data) {
					canonicals.push(new ResumeCount({name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var providers = ko.observableArray();
				_.each(allData.facets.data_provider_name.terms, function(data) {
					providers.push(new ResumeCount({id: allData.facets.data_provider_id.terms[count].term, url: "http://data.sibcolombia.net/publicadores/provider/"+allData.facets.data_provider_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var resources = ko.observableArray();
				_.each(allData.facets.data_resource_name.terms, function(data) {
					resources.push(new ResumeCount({id: allData.facets.data_resource_id.terms[count].term, url: "http://data.sibcolombia.net/conjuntos/resource/"+allData.facets.data_resource_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				var phylums = ko.observableArray();
				_.each(allData.facets.phylum.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						phylums.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						phylums.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var taxonClasses = ko.observableArray();
				_.each(allData.facets.taxonClass.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						taxonClasses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						taxonClasses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var order_ranks = ko.observableArray();
				_.each(allData.facets.order_rank.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						order_ranks.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						order_ranks.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var families = ko.observableArray();
				_.each(allData.facets.family.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						families.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						families.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var genuses = ko.observableArray();
				_.each(allData.facets.genus.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						genuses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						genuses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var species = ko.observableArray();
				_.each(allData.facets.species.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						species.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						species.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				count = 0;
				var countries = ko.observableArray();
				_.each(allData.facets.country_name.terms, function(data) {
					countries.push(new ResumeCount({id: allData.facets.iso_country_code.terms[count].term, url: "http://data.sibcolombia.net/countries/"+allData.facets.iso_country_code.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var departments = ko.observableArray();
				_.each(allData.facets.department_name.terms, function(data) {
					departments.push(new ResumeCount({id: allData.facets.iso_department_code.terms[count].term, url: "http://data.sibcolombia.net/departments/"+allData.facets.iso_department_code.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				var counties = ko.observableArray();
				_.each(allData.facets.county_group.terms, function(data) {
					var countyData = data.term.split("~~~");
					counties.push(new ResumeCount({id: countyData[2], name: countyData[0] + " - " + countyData[1], count: data.count}));
				});
				self.resumesInfoFilter.removeAll();
				self.resumesInfoFilter.push(new ResumeInfo({canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, countries: countries, departments: departments, counties: counties}));
				$("#contentFiltersContainerHelp").mCustomScrollbar("update");
				self.showResumeContainer();
			});
		},
		getPhylumNamesData: function() {
			var self = this;
			$.getJSON("/rest/occurrences/resume/phylum/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
				self.resumePhylumNames.removeAll();
				_.each(allData.facets.phylum.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					self.resumePhylumNames.push(new ResumePhylumName({phylum: nameAndID[0], occurrences: data.count, id: nameAndID[1]}));
				});
				var phylums = ko.observableArray();
				var count = 0;
				var canonicals = ko.observableArray();
				_.each(allData.facets.canonical.terms, function(data) {
					canonicals.push(new ResumeCount({name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var providers = ko.observableArray();
				_.each(allData.facets.data_provider_name.terms, function(data) {
					providers.push(new ResumeCount({id: allData.facets.data_provider_id.terms[count].term, url: "http://data.sibcolombia.net/publicadores/provider/"+allData.facets.data_provider_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var resources = ko.observableArray();
				_.each(allData.facets.data_resource_name.terms, function(data) {
					resources.push(new ResumeCount({id: allData.facets.data_resource_id.terms[count].term, url: "http://data.sibcolombia.net/conjuntos/resource/"+allData.facets.data_resource_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				var kingdoms = ko.observableArray();
				_.each(allData.facets.kingdom.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						kingdoms.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						kingdoms.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var taxonClasses = ko.observableArray();
				_.each(allData.facets.taxonClass.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						taxonClasses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						taxonClasses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var order_ranks = ko.observableArray();
				_.each(allData.facets.order_rank.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						order_ranks.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						order_ranks.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var families = ko.observableArray();
				_.each(allData.facets.family.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						families.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						families.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var genuses = ko.observableArray();
				_.each(allData.facets.genus.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						genuses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						genuses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var species = ko.observableArray();
				_.each(allData.facets.species.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						species.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						species.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				count = 0;
				var countries = ko.observableArray();
				_.each(allData.facets.country_name.terms, function(data) {
					countries.push(new ResumeCount({id: allData.facets.iso_country_code.terms[count].term, url: "http://data.sibcolombia.net/countries/"+allData.facets.iso_country_code.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var departments = ko.observableArray();
				_.each(allData.facets.department_name.terms, function(data) {
					departments.push(new ResumeCount({id: allData.facets.iso_department_code.terms[count].term, url: "http://data.sibcolombia.net/departments/"+allData.facets.iso_department_code.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				var counties = ko.observableArray();
				_.each(allData.facets.county_group.terms, function(data) {
					var countyData = data.term.split("~~~");
					counties.push(new ResumeCount({id: countyData[2], name: countyData[0] + " - " + countyData[1], count: data.count}));
				});
				self.resumesInfoFilter.removeAll();
				self.resumesInfoFilter.push(new ResumeInfo({canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, countries: countries, departments: departments, counties: counties}));
				$("#contentFiltersContainerHelp").mCustomScrollbar("update");
				self.showResumeContainer();
			});
		},
		getClassNamesData: function() {
			var self = this;
			$.getJSON("/rest/occurrences/resume/class/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
				self.resumeClassNames.removeAll();
				_.each(allData.facets.taxonClass.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					self.resumeClassNames.push(new ResumeClassName({nameClass: nameAndID[0], occurrences: data.count, id: nameAndID[1]}));
				});
				var taxonClasses = ko.observableArray();
				var count = 0;
				var canonicals = ko.observableArray();
				_.each(allData.facets.canonical.terms, function(data) {
					canonicals.push(new ResumeCount({name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var providers = ko.observableArray();
				_.each(allData.facets.data_provider_name.terms, function(data) {
					providers.push(new ResumeCount({id: allData.facets.data_provider_id.terms[count].term, url: "http://data.sibcolombia.net/publicadores/provider/"+allData.facets.data_provider_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var resources = ko.observableArray();
				_.each(allData.facets.data_resource_name.terms, function(data) {
					resources.push(new ResumeCount({id: allData.facets.data_resource_id.terms[count].term, url: "http://data.sibcolombia.net/conjuntos/resource/"+allData.facets.data_resource_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				var kingdoms = ko.observableArray();
				_.each(allData.facets.kingdom.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						kingdoms.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						kingdoms.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var phylums = ko.observableArray();
				_.each(allData.facets.phylum.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						phylums.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						phylums.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var order_ranks = ko.observableArray();
				_.each(allData.facets.order_rank.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						order_ranks.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						order_ranks.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var families = ko.observableArray();
				_.each(allData.facets.family.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						families.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						families.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var genuses = ko.observableArray();
				_.each(allData.facets.genus.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						genuses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						genuses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var species = ko.observableArray();
				_.each(allData.facets.species.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						species.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						species.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				count = 0;
				var countries = ko.observableArray();
				_.each(allData.facets.country_name.terms, function(data) {
					countries.push(new ResumeCount({id: allData.facets.iso_country_code.terms[count].term, url: "http://data.sibcolombia.net/countries/"+allData.facets.iso_country_code.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var departments = ko.observableArray();
				_.each(allData.facets.department_name.terms, function(data) {
					departments.push(new ResumeCount({id: allData.facets.iso_department_code.terms[count].term, url: "http://data.sibcolombia.net/departments/"+allData.facets.iso_department_code.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				var counties = ko.observableArray();
				_.each(allData.facets.county_group.terms, function(data) {
					var countyData = data.term.split("~~~");
					counties.push(new ResumeCount({id: countyData[2], name: countyData[0] + " - " + countyData[1], count: data.count}));
				});
				self.resumesInfoFilter.removeAll();
				self.resumesInfoFilter.push(new ResumeInfo({canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, countries: countries, departments: departments, counties: counties}));
				$("#contentFiltersContainerHelp").mCustomScrollbar("update");
				self.showResumeContainer();
			});
		},
		getOrderNamesData: function() {
			var self = this;
			$.getJSON("/rest/occurrences/resume/order/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
				self.resumeOrderNames.removeAll();
				_.each(allData.facets.order_rank.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					self.resumeOrderNames.push(new ResumeOrderName({order_rank: nameAndID[0], occurrences: data.count, id: nameAndID[1]}));
				});
				var order_ranks = ko.observableArray();
				var count = 0;
				var canonicals = ko.observableArray();
				_.each(allData.facets.canonical.terms, function(data) {
					canonicals.push(new ResumeCount({name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var providers = ko.observableArray();
				_.each(allData.facets.data_provider_name.terms, function(data) {
					providers.push(new ResumeCount({id: allData.facets.data_provider_id.terms[count].term, url: "http://data.sibcolombia.net/publicadores/provider/"+allData.facets.data_provider_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var resources = ko.observableArray();
				_.each(allData.facets.data_resource_name.terms, function(data) {
					resources.push(new ResumeCount({id: allData.facets.data_resource_id.terms[count].term, url: "http://data.sibcolombia.net/conjuntos/resource/"+allData.facets.data_resource_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				var kingdoms = ko.observableArray();
				_.each(allData.facets.kingdom.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						kingdoms.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						kingdoms.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var phylums = ko.observableArray();
				_.each(allData.facets.phylum.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						phylums.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						phylums.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var taxonClasses = ko.observableArray();
				_.each(allData.facets.taxonClass.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						taxonClasses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						taxonClasses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var families = ko.observableArray();
				_.each(allData.facets.family.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						families.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						families.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var genuses = ko.observableArray();
				_.each(allData.facets.genus.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						genuses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						genuses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var species = ko.observableArray();
				_.each(allData.facets.species.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						species.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						species.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				count = 0;
				var countries = ko.observableArray();
				_.each(allData.facets.country_name.terms, function(data) {
					countries.push(new ResumeCount({id: allData.facets.iso_country_code.terms[count].term, url: "http://data.sibcolombia.net/countries/"+allData.facets.iso_country_code.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var departments = ko.observableArray();
				_.each(allData.facets.department_name.terms, function(data) {
					departments.push(new ResumeCount({id: allData.facets.iso_department_code.terms[count].term, url: "http://data.sibcolombia.net/departments/"+allData.facets.iso_department_code.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				var counties = ko.observableArray();
				_.each(allData.facets.county_group.terms, function(data) {
					var countyData = data.term.split("~~~");
					counties.push(new ResumeCount({id: countyData[2], name: countyData[0] + " - " + countyData[1], count: data.count}));
				});
				self.resumesInfoFilter.removeAll();
				self.resumesInfoFilter.push(new ResumeInfo({canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, countries: countries, departments: departments, counties: counties}));
				$("#contentFiltersContainerHelp").mCustomScrollbar("update");
				self.showResumeContainer();
			});
		},
		getFamilyNamesData: function() {
			var self = this;
			$.getJSON("/rest/occurrences/resume/family/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
				self.resumeFamilyNames.removeAll();
				_.each(allData.facets.family.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					self.resumeFamilyNames.push(new ResumeFamilyName({family: nameAndID[0], occurrences: data.count, id: nameAndID[1]}));
				});
				var families = ko.observableArray();
				var count = 0;
				var canonicals = ko.observableArray();
				_.each(allData.facets.canonical.terms, function(data) {
					canonicals.push(new ResumeCount({name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var providers = ko.observableArray();
				_.each(allData.facets.data_provider_name.terms, function(data) {
					providers.push(new ResumeCount({id: allData.facets.data_provider_id.terms[count].term, url: "http://data.sibcolombia.net/publicadores/provider/"+allData.facets.data_provider_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var resources = ko.observableArray();
				_.each(allData.facets.data_resource_name.terms, function(data) {
					resources.push(new ResumeCount({id: allData.facets.data_resource_id.terms[count].term, url: "http://data.sibcolombia.net/conjuntos/resource/"+allData.facets.data_resource_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				var kingdoms = ko.observableArray();
				_.each(allData.facets.kingdom.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						kingdoms.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						kingdoms.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var phylums = ko.observableArray();
				_.each(allData.facets.phylum.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						phylums.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						phylums.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var taxonClasses = ko.observableArray();
				_.each(allData.facets.taxonClass.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						taxonClasses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						taxonClasses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var order_ranks = ko.observableArray();
				_.each(allData.facets.order_rank.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						order_ranks.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						order_ranks.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var genuses = ko.observableArray();
				_.each(allData.facets.genus.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						genuses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						genuses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var species = ko.observableArray();
				_.each(allData.facets.species.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						species.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						species.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				count = 0;
				var countries = ko.observableArray();
				_.each(allData.facets.country_name.terms, function(data) {
					countries.push(new ResumeCount({id: allData.facets.iso_country_code.terms[count].term, url: "http://data.sibcolombia.net/countries/"+allData.facets.iso_country_code.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var departments = ko.observableArray();
				_.each(allData.facets.department_name.terms, function(data) {
					departments.push(new ResumeCount({id: allData.facets.iso_department_code.terms[count].term, url: "http://data.sibcolombia.net/departments/"+allData.facets.iso_department_code.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				var counties = ko.observableArray();
				_.each(allData.facets.county_group.terms, function(data) {
					var countyData = data.term.split("~~~");
					counties.push(new ResumeCount({id: countyData[2], name: countyData[0] + " - " + countyData[1], count: data.count}));
				});
				self.resumesInfoFilter.removeAll();
				self.resumesInfoFilter.push(new ResumeInfo({canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, countries: countries, departments: departments, counties: counties}));
				$("#contentFiltersContainerHelp").mCustomScrollbar("update");
				self.showResumeContainer();
			});
		},
		getGenusNamesData: function() {
			var self = this;
			$.getJSON("/rest/occurrences/resume/genus/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
				self.resumeGenusNames.removeAll();
				_.each(allData.facets.genus.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					self.resumeGenusNames.push(new ResumeGenusName({genus: nameAndID[0], occurrences: data.count, id: nameAndID[1]}));
				});
				var genuses = ko.observableArray();
				var count = 0;
				var canonicals = ko.observableArray();
				_.each(allData.facets.canonical.terms, function(data) {
					canonicals.push(new ResumeCount({name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var providers = ko.observableArray();
				_.each(allData.facets.data_provider_name.terms, function(data) {
					providers.push(new ResumeCount({id: allData.facets.data_provider_id.terms[count].term, url: "http://data.sibcolombia.net/publicadores/provider/"+allData.facets.data_provider_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var resources = ko.observableArray();
				_.each(allData.facets.data_resource_name.terms, function(data) {
					resources.push(new ResumeCount({id: allData.facets.data_resource_id.terms[count].term, url: "http://data.sibcolombia.net/conjuntos/resource/"+allData.facets.data_resource_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				var kingdoms = ko.observableArray();
				_.each(allData.facets.kingdom.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						kingdoms.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						kingdoms.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var phylums = ko.observableArray();
				_.each(allData.facets.phylum.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						phylums.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						phylums.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var taxonClasses = ko.observableArray();
				_.each(allData.facets.taxonClass.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						taxonClasses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						taxonClasses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var order_ranks = ko.observableArray();
				_.each(allData.facets.order_rank.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						order_ranks.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						order_ranks.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var families = ko.observableArray();
				_.each(allData.facets.family.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						families.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						families.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var species = ko.observableArray();
				_.each(allData.facets.species.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						species.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						species.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				count = 0;
				var countries = ko.observableArray();
				_.each(allData.facets.country_name.terms, function(data) {
					countries.push(new ResumeCount({id: allData.facets.iso_country_code.terms[count].term, url: "http://data.sibcolombia.net/countries/"+allData.facets.iso_country_code.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var departments = ko.observableArray();
				_.each(allData.facets.department_name.terms, function(data) {
					departments.push(new ResumeCount({id: allData.facets.iso_department_code.terms[count].term, url: "http://data.sibcolombia.net/departments/"+allData.facets.iso_department_code.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				var counties = ko.observableArray();
				_.each(allData.facets.county_group.terms, function(data) {
					var countyData = data.term.split("~~~");
					counties.push(new ResumeCount({id: countyData[2], name: countyData[0] + " - " + countyData[1], count: data.count}));
				});
				self.resumesInfoFilter.removeAll();
				self.resumesInfoFilter.push(new ResumeInfo({canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, countries: countries, departments: departments, counties: counties}));
				$("#contentFiltersContainerHelp").mCustomScrollbar("update");
				self.showResumeContainer();
			});
		},
		getSpeciesNamesData: function() {
			var self = this;
			$.getJSON("/rest/occurrences/resume/species/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
				self.resumeSpeciesNames.removeAll();
				_.each(allData.facets.species.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					self.resumeSpeciesNames.push(new ResumeSpecieName({species: nameAndID[0], occurrences: data.count, id: nameAndID[1]}));
				});
				var species = ko.observableArray();
				var count = 0;
				var canonicals = ko.observableArray();
				_.each(allData.facets.canonical.terms, function(data) {
					canonicals.push(new ResumeCount({name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var providers = ko.observableArray();
				_.each(allData.facets.data_provider_name.terms, function(data) {
					providers.push(new ResumeCount({id: allData.facets.data_provider_id.terms[count].term, url: "http://data.sibcolombia.net/publicadores/provider/"+allData.facets.data_provider_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var resources = ko.observableArray();
				_.each(allData.facets.data_resource_name.terms, function(data) {
					resources.push(new ResumeCount({id: allData.facets.data_resource_id.terms[count].term, url: "http://data.sibcolombia.net/conjuntos/resource/"+allData.facets.data_resource_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				var kingdoms = ko.observableArray();
				_.each(allData.facets.kingdom.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						kingdoms.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						kingdoms.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var phylums = ko.observableArray();
				_.each(allData.facets.phylum.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						phylums.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						phylums.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var taxonClasses = ko.observableArray();
				_.each(allData.facets.taxonClass.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						taxonClasses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						taxonClasses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var order_ranks = ko.observableArray();
				_.each(allData.facets.order_rank.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						order_ranks.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						order_ranks.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var families = ko.observableArray();
				_.each(allData.facets.family.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						families.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						families.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var genuses = ko.observableArray();
				_.each(allData.facets.genus.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						genuses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						genuses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				count = 0;
				var countries = ko.observableArray();
				_.each(allData.facets.country_name.terms, function(data) {
					countries.push(new ResumeCount({id: allData.facets.iso_country_code.terms[count].term, url: "http://data.sibcolombia.net/countries/"+allData.facets.iso_country_code.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var departments = ko.observableArray();
				_.each(allData.facets.department_name.terms, function(data) {
					departments.push(new ResumeCount({id: allData.facets.iso_department_code.terms[count].term, url: "http://data.sibcolombia.net/departments/"+allData.facets.iso_department_code.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				var counties = ko.observableArray();
				_.each(allData.facets.county_group.terms, function(data) {
					var countyData = data.term.split("~~~");
					counties.push(new ResumeCount({id: countyData[2], name: countyData[0] + " - " + countyData[1], count: data.count}));
				});
				self.resumesInfoFilter.removeAll();
				self.resumesInfoFilter.push(new ResumeInfo({canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, countries: countries, departments: departments, counties: counties}));
				$("#contentFiltersContainerHelp").mCustomScrollbar("update");
				self.showResumeContainer();
			});
		},
		getDataProvidersData: function() {
			var self = this;
			$.getJSON("/rest/occurrences/resume/dataproviders/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
				self.resumeDataProviders.removeAll();
				var count = 0;
				_.each(allData.facets.data_provider_name.terms, function(data) {
					self.resumeDataProviders.push(new ResumeDataProvider({providerID: allData.facets.data_provider_id.terms[count].term, providerName: data.term, occurrences: data.count}));
					count++;
				});
				var providers = ko.observableArray();
				count = 0;
				var canonicals = ko.observableArray();
				_.each(allData.facets.canonical.terms, function(data) {
					canonicals.push(new ResumeCount({name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var resources = ko.observableArray();
				_.each(allData.facets.data_resource_name.terms, function(data) {
					resources.push(new ResumeCount({id: allData.facets.data_resource_id.terms[count].term, url: "http://data.sibcolombia.net/conjuntos/resource/"+allData.facets.data_resource_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				var kingdoms = ko.observableArray();
				_.each(allData.facets.kingdom.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						kingdoms.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						kingdoms.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var phylums = ko.observableArray();
				_.each(allData.facets.phylum.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						phylums.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						phylums.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var taxonClasses = ko.observableArray();
				_.each(allData.facets.taxonClass.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						taxonClasses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						taxonClasses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var order_ranks = ko.observableArray();
				_.each(allData.facets.order_rank.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						order_ranks.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						order_ranks.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var families = ko.observableArray();
				_.each(allData.facets.family.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						families.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						families.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var genuses = ko.observableArray();
				_.each(allData.facets.genus.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						genuses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						genuses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var species = ko.observableArray();
				_.each(allData.facets.species.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						species.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						species.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				count = 0;
				var countries = ko.observableArray();
				_.each(allData.facets.country_name.terms, function(data) {
					countries.push(new ResumeCount({id: allData.facets.iso_country_code.terms[count].term, url: "http://data.sibcolombia.net/countries/"+allData.facets.iso_country_code.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var departments = ko.observableArray();
				_.each(allData.facets.department_name.terms, function(data) {
					departments.push(new ResumeCount({id: allData.facets.iso_department_code.terms[count].term, url: "http://data.sibcolombia.net/departments/"+allData.facets.iso_department_code.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				var counties = ko.observableArray();
				_.each(allData.facets.county_group.terms, function(data) {
					var countyData = data.term.split("~~~");
					counties.push(new ResumeCount({id: countyData[2], name: countyData[0] + " - " + countyData[1], count: data.count}));
				});
				self.resumesInfoFilter.removeAll();
				self.resumesInfoFilter.push(new ResumeInfo({canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, countries: countries, departments: departments, counties: counties}));
				$("#contentFiltersContainerHelp").mCustomScrollbar("update");
				self.showResumeContainer();
			});
		},
		getDataResourcesData: function() {
			var self = this;
			$.getJSON("/rest/occurrences/resume/dataresources/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
				self.resumeDataResources.removeAll();
				var count = 0;
				_.each(allData.facets.data_resource_name.terms, function(data) {
					self.resumeDataResources.push(new ResumeDataResource({providerID: allData.facets.data_provider_id.terms[count].term, resourceID: allData.facets.data_resource_id.terms[count].term, resourceName: data.term, occurrences: data.count}));
					count++;
				});
				var resources = ko.observableArray();
				count = 0;
				var canonicals = ko.observableArray();
				_.each(allData.facets.canonical.terms, function(data) {
					canonicals.push(new ResumeCount({name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var providers = ko.observableArray();
				_.each(allData.facets.data_provider_name.terms, function(data) {
					providers.push(new ResumeCount({id: allData.facets.data_provider_id.terms[count].term, url: "http://data.sibcolombia.net/publicadores/provider/"+allData.facets.data_provider_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				var kingdoms = ko.observableArray();
				_.each(allData.facets.kingdom.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						kingdoms.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						kingdoms.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var phylums = ko.observableArray();
				_.each(allData.facets.phylum.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						phylums.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						phylums.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var taxonClasses = ko.observableArray();
				_.each(allData.facets.taxonClass.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						taxonClasses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						taxonClasses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var order_ranks = ko.observableArray();
				_.each(allData.facets.order_rank.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						order_ranks.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						order_ranks.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var families = ko.observableArray();
				_.each(allData.facets.family.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						families.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						families.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var genuses = ko.observableArray();
				_.each(allData.facets.genus.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						genuses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						genuses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var species = ko.observableArray();
				_.each(allData.facets.species.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						species.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						species.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				count = 0;
				var countries = ko.observableArray();
				_.each(allData.facets.country_name.terms, function(data) {
					countries.push(new ResumeCount({id: allData.facets.iso_country_code.terms[count].term, url: "http://data.sibcolombia.net/countries/"+allData.facets.iso_country_code.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var departments = ko.observableArray();
				_.each(allData.facets.department_name.terms, function(data) {
					departments.push(new ResumeCount({id: allData.facets.iso_department_code.terms[count].term, url: "http://data.sibcolombia.net/departments/"+allData.facets.iso_department_code.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				var counties = ko.observableArray();
				_.each(allData.facets.county_group.terms, function(data) {
					var countyData = data.term.split("~~~");
					counties.push(new ResumeCount({id: countyData[2], name: countyData[0] + " - " + countyData[1], count: data.count}));
				});
				self.resumesInfoFilter.removeAll();
				self.resumesInfoFilter.push(new ResumeInfo({canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, countries: countries, departments: departments, counties: counties}));
				$("#contentFiltersContainerHelp").mCustomScrollbar("update");
				self.showResumeContainer();
			});
		},
		getInstitutionCodesData: function() {
			var self = this;
			$.getJSON("/rest/occurrences/resume/institutioncodes/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
				self.resumeInstitutionCodes.removeAll();
				var count = 0;
				_.each(allData.facets.institution_code.terms, function(data) {
					self.resumeInstitutionCodes.push(new ResumeInstitutionCode({institutionCodeID: allData.facets.institution_code_id.terms[count].term, institutionCode: data.term, occurrences: data.count}));
					count++;
				});
				count = 0;
				var canonicals = ko.observableArray();
				_.each(allData.facets.canonical.terms, function(data) {
					canonicals.push(new ResumeCount({name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var providers = ko.observableArray();
				_.each(allData.facets.data_provider_name.terms, function(data) {
					providers.push(new ResumeCount({id: allData.facets.data_provider_id.terms[count].term, url: "http://data.sibcolombia.net/publicadores/provider/"+allData.facets.data_provider_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var resources = ko.observableArray();
				_.each(allData.facets.data_resource_name.terms, function(data) {
					resources.push(new ResumeCount({id: allData.facets.data_resource_id.terms[count].term, url: "http://data.sibcolombia.net/conjuntos/resource/"+allData.facets.data_resource_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				var kingdoms = ko.observableArray();
				_.each(allData.facets.kingdom.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						kingdoms.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						kingdoms.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var phylums = ko.observableArray();
				_.each(allData.facets.phylum.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						phylums.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						phylums.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var taxonClasses = ko.observableArray();
				_.each(allData.facets.taxonClass.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						taxonClasses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						taxonClasses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var order_ranks = ko.observableArray();
				_.each(allData.facets.order_rank.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						order_ranks.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						order_ranks.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var families = ko.observableArray();
				_.each(allData.facets.family.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						families.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						families.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var genuses = ko.observableArray();
				_.each(allData.facets.genus.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						genuses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						genuses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var species = ko.observableArray();
				_.each(allData.facets.species.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						species.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						species.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				count = 0;
				var countries = ko.observableArray();
				_.each(allData.facets.country_name.terms, function(data) {
					countries.push(new ResumeCount({id: allData.facets.iso_country_code.terms[count].term, url: "http://data.sibcolombia.net/countries/"+allData.facets.iso_country_code.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var departments = ko.observableArray();
				_.each(allData.facets.department_name.terms, function(data) {
					departments.push(new ResumeCount({id: allData.facets.iso_department_code.terms[count].term, url: "http://data.sibcolombia.net/departments/"+allData.facets.iso_department_code.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				var counties = ko.observableArray();
				_.each(allData.facets.county_group.terms, function(data) {
					var countyData = data.term.split("~~~");
					counties.push(new ResumeCount({id: countyData[2], name: countyData[0] + " - " + countyData[1], count: data.count}));
				});
				self.resumesInfoFilter.removeAll();
				self.resumesInfoFilter.push(new ResumeInfo({canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, countries: countries, departments: departments, counties: counties}));
				$("#contentFiltersContainerHelp").mCustomScrollbar("update");
				self.showResumeContainer();
			});
		},
		getCollectionCodesData: function() {
			var self = this;
			$.getJSON("/rest/occurrences/resume/collectioncodes/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
				self.resumeCollectionCodes.removeAll();
				var count = 0;
				_.each(allData.facets.collection_code.terms, function(data) {
					self.resumeCollectionCodes.push(new ResumeCollectionCode({collectionCodeID: allData.facets.collection_code_id.terms[count].term, collectionCode: data.term, occurrences: data.count}));
					count++;
				});
				count = 0;
				var canonicals = ko.observableArray();
				_.each(allData.facets.canonical.terms, function(data) {
					canonicals.push(new ResumeCount({name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var providers = ko.observableArray();
				_.each(allData.facets.data_provider_name.terms, function(data) {
					providers.push(new ResumeCount({id: allData.facets.data_provider_id.terms[count].term, url: "http://data.sibcolombia.net/publicadores/provider/"+allData.facets.data_provider_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var resources = ko.observableArray();
				_.each(allData.facets.data_resource_name.terms, function(data) {
					resources.push(new ResumeCount({id: allData.facets.data_resource_id.terms[count].term, url: "http://data.sibcolombia.net/conjuntos/resource/"+allData.facets.data_resource_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				var kingdoms = ko.observableArray();
				_.each(allData.facets.kingdom.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						kingdoms.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						kingdoms.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var phylums = ko.observableArray();
				_.each(allData.facets.phylum.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						phylums.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						phylums.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var taxonClasses = ko.observableArray();
				_.each(allData.facets.taxonClass.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						taxonClasses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						taxonClasses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var order_ranks = ko.observableArray();
				_.each(allData.facets.order_rank.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						order_ranks.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						order_ranks.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var families = ko.observableArray();
				_.each(allData.facets.family.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						families.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						families.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var genuses = ko.observableArray();
				_.each(allData.facets.genus.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						genuses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						genuses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var species = ko.observableArray();
				_.each(allData.facets.species.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						species.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						species.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				count = 0;
				var countries = ko.observableArray();
				_.each(allData.facets.country_name.terms, function(data) {
					countries.push(new ResumeCount({id: allData.facets.iso_country_code.terms[count].term, url: "http://data.sibcolombia.net/countries/"+allData.facets.iso_country_code.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var departments = ko.observableArray();
				_.each(allData.facets.department_name.terms, function(data) {
					departments.push(new ResumeCount({id: allData.facets.iso_department_code.terms[count].term, url: "http://data.sibcolombia.net/departments/"+allData.facets.iso_department_code.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				var counties = ko.observableArray();
				_.each(allData.facets.county_group.terms, function(data) {
					var countyData = data.term.split("~~~");
					counties.push(new ResumeCount({id: countyData[2], name: countyData[0] + " - " + countyData[1], count: data.count}));
				});
				self.resumesInfoFilter.removeAll();
				self.resumesInfoFilter.push(new ResumeInfo({canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, countries: countries, departments: departments, counties: counties}));
				$("#contentFiltersContainerHelp").mCustomScrollbar("update");
				self.showResumeContainer();
			});
		},
		getCountriesData: function() {
			var self = this;
			$.getJSON("/rest/occurrences/resume/countries/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
				self.resumeCountries.removeAll();
				var count = 0;
				_.each(allData.facets.country_name.terms, function(data) {
					self.resumeCountries.push(new ResumeCountry({isoCountryCode: allData.facets.iso_country_code.terms[count].term, countryName: data.term, occurrences: data.count}));
					count++;
				});
				var countries = ko.observableArray();
				count = 0;
				var canonicals = ko.observableArray();
				_.each(allData.facets.canonical.terms, function(data) {
					canonicals.push(new ResumeCount({name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var providers = ko.observableArray();
				_.each(allData.facets.data_provider_name.terms, function(data) {
					providers.push(new ResumeCount({id: allData.facets.data_provider_id.terms[count].term, url: "http://data.sibcolombia.net/publicadores/provider/"+allData.facets.data_provider_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var resources = ko.observableArray();
				_.each(allData.facets.data_resource_name.terms, function(data) {
					resources.push(new ResumeCount({id: allData.facets.data_resource_id.terms[count].term, url: "http://data.sibcolombia.net/conjuntos/resource/"+allData.facets.data_resource_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				var kingdoms = ko.observableArray();
				_.each(allData.facets.kingdom.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						kingdoms.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						kingdoms.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var phylums = ko.observableArray();
				_.each(allData.facets.phylum.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						phylums.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						phylums.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var taxonClasses = ko.observableArray();
				_.each(allData.facets.taxonClass.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						taxonClasses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						taxonClasses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var order_ranks = ko.observableArray();
				_.each(allData.facets.order_rank.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						order_ranks.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						order_ranks.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var families = ko.observableArray();
				_.each(allData.facets.family.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						families.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						families.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var genuses = ko.observableArray();
				_.each(allData.facets.genus.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						genuses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						genuses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var species = ko.observableArray();
				_.each(allData.facets.species.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						species.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						species.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				count = 0;
				var departments = ko.observableArray();
				_.each(allData.facets.department_name.terms, function(data) {
					departments.push(new ResumeCount({id: allData.facets.iso_department_code.terms[count].term, url: "http://data.sibcolombia.net/departments/"+allData.facets.iso_department_code.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				var counties = ko.observableArray();
				_.each(allData.facets.county_group.terms, function(data) {
					var countyData = data.term.split("~~~");
					counties.push(new ResumeCount({id: countyData[2], name: countyData[0] + " - " + countyData[1], count: data.count}));
				});
				self.resumesInfoFilter.removeAll();
				self.resumesInfoFilter.push(new ResumeInfo({canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, countries: countries, departments: departments, counties: counties}));
				$("#contentFiltersContainerHelp").mCustomScrollbar("update");
				self.showResumeContainer();
			});
		},
		getDepartmentsData: function() {
			var self = this;
			$.getJSON("/rest/occurrences/resume/departments/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
				self.resumeDepartments.removeAll();
				var count = 0;
				_.each(allData.facets.department_name.terms, function(data) {
					self.resumeDepartments.push(new ResumeDepartment({isoDepartmentCode: allData.facets.iso_department_code.terms[count].term, departmentName: data.term, occurrences: data.count}));
					count++;
				});
				var departments = ko.observableArray();
				count = 0;
				var canonicals = ko.observableArray();
				_.each(allData.facets.canonical.terms, function(data) {
					canonicals.push(new ResumeCount({name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var providers = ko.observableArray();
				_.each(allData.facets.data_provider_name.terms, function(data) {
					providers.push(new ResumeCount({id: allData.facets.data_provider_id.terms[count].term, url: "http://data.sibcolombia.net/publicadores/provider/"+allData.facets.data_provider_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var resources = ko.observableArray();
				_.each(allData.facets.data_resource_name.terms, function(data) {
					resources.push(new ResumeCount({id: allData.facets.data_resource_id.terms[count].term, url: "http://data.sibcolombia.net/conjuntos/resource/"+allData.facets.data_resource_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				var kingdoms = ko.observableArray();
				_.each(allData.facets.kingdom.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						kingdoms.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						kingdoms.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var phylums = ko.observableArray();
				_.each(allData.facets.phylum.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						phylums.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						phylums.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var taxonClasses = ko.observableArray();
				_.each(allData.facets.taxonClass.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						taxonClasses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						taxonClasses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var order_ranks = ko.observableArray();
				_.each(allData.facets.order_rank.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						order_ranks.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						order_ranks.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var families = ko.observableArray();
				_.each(allData.facets.family.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						families.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						families.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var genuses = ko.observableArray();
				_.each(allData.facets.genus.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						genuses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						genuses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var species = ko.observableArray();
				_.each(allData.facets.species.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						species.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						species.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				count = 0;
				var countries = ko.observableArray();
				_.each(allData.facets.country_name.terms, function(data) {
					countries.push(new ResumeCount({id: allData.facets.iso_country_code.terms[count].term, url: "http://data.sibcolombia.net/countries/"+allData.facets.iso_country_code.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				var counties = ko.observableArray();
				_.each(allData.facets.county_group.terms, function(data) {
					var countyData = data.term.split("~~~");
					counties.push(new ResumeCount({id: countyData[2], name: countyData[0] + " - " + countyData[1], count: data.count}));
				});
				self.resumesInfoFilter.removeAll();
				self.resumesInfoFilter.push(new ResumeInfo({canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, countries: countries, departments: departments, counties: counties}));
				$("#contentFiltersContainerHelp").mCustomScrollbar("update");
				self.showResumeContainer();
			});
		},
		getCountiesData: function() {
			var self = this;
			$.getJSON("/rest/occurrences/resume/counties/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
				self.resumeCounties.removeAll();
				_.each(allData.facets.county_group.terms, function(data) {
					var countyData = data.term.split("~~~");
					self.resumeCounties.push(new ResumeCounty({isoCountyCode: countyData[2], countyName: countyData[1], occurrences: data.count, departmentAndCountyName: countyData[0] + " - " + countyData[1]}));
				});
				var counties = ko.observableArray();
				var canonicals = ko.observableArray();
				_.each(allData.facets.canonical.terms, function(data) {
					canonicals.push(new ResumeCount({name: data.term, count: data.count}));
				});
				var count = 0;
				var providers = ko.observableArray();
				_.each(allData.facets.data_provider_name.terms, function(data) {
					providers.push(new ResumeCount({id: allData.facets.data_provider_id.terms[count].term, url: "http://data.sibcolombia.net/publicadores/provider/"+allData.facets.data_provider_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var resources = ko.observableArray();
				_.each(allData.facets.data_resource_name.terms, function(data) {
					resources.push(new ResumeCount({id: allData.facets.data_resource_id.terms[count].term, url: "http://data.sibcolombia.net/conjuntos/resource/"+allData.facets.data_resource_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				var kingdoms = ko.observableArray();
				_.each(allData.facets.kingdom.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						kingdoms.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						kingdoms.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var phylums = ko.observableArray();
				_.each(allData.facets.phylum.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						phylums.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						phylums.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var taxonClasses = ko.observableArray();
				_.each(allData.facets.taxonClass.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						taxonClasses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						taxonClasses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var order_ranks = ko.observableArray();
				_.each(allData.facets.order_rank.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						order_ranks.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						order_ranks.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var families = ko.observableArray();
				_.each(allData.facets.family.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						families.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						families.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var genuses = ko.observableArray();
				_.each(allData.facets.genus.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						genuses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						genuses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				var species = ko.observableArray();
				_.each(allData.facets.species.terms, function(data) {
					var nameAndID = data.term.split("~~~");
					if(nameAndID[1] != "null") {
						species.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
					} else {
						species.push(new ResumeCount({name: nameAndID[0], count: data.count}));
					}
				});
				count = 0;
				var countries = ko.observableArray();
				_.each(allData.facets.country_name.terms, function(data) {
					countries.push(new ResumeCount({id: allData.facets.iso_country_code.terms[count].term, url: "http://data.sibcolombia.net/countries/"+allData.facets.iso_country_code.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var departments = ko.observableArray();
				_.each(allData.facets.department_name.terms, function(data) {
					departments.push(new ResumeCount({id: allData.facets.iso_department_code.terms[count].term, url: "http://data.sibcolombia.net/departments/"+allData.facets.iso_department_code.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				self.resumesInfoFilter.removeAll();
				self.resumesInfoFilter.push(new ResumeInfo({canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, countries: countries, departments: departments, counties: counties}));
				$("#contentFiltersContainerHelp").mCustomScrollbar("update");
				self.showResumeContainer();
			});
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
			self.selectedCountriesIDs.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: self.selectedCountry(), textName: $("#dropDownCountry").select2('data').text}));
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
			self.selectedDepartmentsIDs.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: self.selectedDepartment(), textName: $("#dropDownDepartment").select2('data').text}));
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
			self.selectedCountiesIDs.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: self.selectedDepartment(), textName: $("#dropDownCounty").select2('data').text}));
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
		fillCellDensityOneDegreeData: function(allData, a) {
			var self = this;
			var canonicals = ko.observableArray();
			_.each(allData.facets.canonical.terms, function(data) {
				canonicals.push(new ResumeCount({name: data.term, count: data.count}));
			});
			var kingdoms = ko.observableArray();
			_.each(allData.facets.kingdom.terms, function(data) {
				var nameAndID = data.term.split("~~~");
				if(nameAndID[1] != "null") {
					kingdoms.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
				} else {
					kingdoms.push(new ResumeCount({name: nameAndID[0], count: data.count}));
				}
			});
			var count = 0;
			var providers = ko.observableArray();
			_.each(allData.facets.data_provider_name.terms, function(data) {
				providers.push(new ResumeCount({id: allData.facets.data_provider_id.terms[count].term, url: "http://data.sibcolombia.net/publicadores/provider/"+allData.facets.data_provider_id.terms[count].term, name: data.term, count: data.count}));
				count++;
			});
			count = 0;
			var resources = ko.observableArray();
			_.each(allData.facets.data_resource_name.terms, function(data) {
				resources.push(new ResumeCount({id: allData.facets.data_resource_id.terms[count].term, url: "http://data.sibcolombia.net/conjuntos/resource/"+allData.facets.data_resource_id.terms[count].term, name: data.term, count: data.count}));
				count++;
			});
			var phylums = ko.observableArray();
			_.each(allData.facets.phylum.terms, function(data) {
				var nameAndID = data.term.split("~~~");
				if(nameAndID[1] != "null") {
					phylums.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
				} else {
					phylums.push(new ResumeCount({name: nameAndID[0], count: data.count}));
				}
			});
			var taxonClasses = ko.observableArray();
			_.each(allData.facets.taxonClass.terms, function(data) {
				var nameAndID = data.term.split("~~~");
				if(nameAndID[1] != "null") {
					taxonClasses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
				} else {
					taxonClasses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
				}
			});
			var order_ranks = ko.observableArray();
			_.each(allData.facets.order_rank.terms, function(data) {
				var nameAndID = data.term.split("~~~");
				if(nameAndID[1] != "null") {
					order_ranks.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
				} else {
					order_ranks.push(new ResumeCount({name: nameAndID[0], count: data.count}));
				}
			});
			var families = ko.observableArray();
			_.each(allData.facets.family.terms, function(data) {
				var nameAndID = data.term.split("~~~");
				if(nameAndID[1] != "null") {
					families.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
				} else {
					families.push(new ResumeCount({name: nameAndID[0], count: data.count}));
				}
			});
			var genuses = ko.observableArray();
			_.each(allData.facets.genus.terms, function(data) {
				var nameAndID = data.term.split("~~~");
				if(nameAndID[1] != "null") {
					genuses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
				} else {
					genuses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
				}
			});
			var species = ko.observableArray();
			_.each(allData.facets.species.terms, function(data) {
				var nameAndID = data.term.split("~~~");
				if(nameAndID[1] != "null") {
					species.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
				} else {
					species.push(new ResumeCount({name: nameAndID[0], count: data.count}));
				}
			});
			var counties = ko.observableArray();
			_.each(allData.facets.county_name.terms, function(data) {
				counties.push(new ResumeCount({name: data.term, count: data.count}));
			});
			self.resumesInfo.removeAll();
			self.resumesInfo.push(new ResumeInfo({cellID: a.layer.options.cellID, canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, counties: counties}));
			if($("#resumeDetail").is(':hidden')) {
				$("#resumeDetail").animate({width: 'toggle'}, 500, "swing", function() {
					if(self.resumeFirstScrollRun) {
						$("#resumeInfoDetailContainer").mCustomScrollbar({
							theme:"dark"
						});
						self.resumeFirstScrollRun = false;
					} else {
						$("#resumeInfoDetailContainer").mCustomScrollbar("update");
					}
				});
			} else {
				$("#resumeInfoDetailContainer").mCustomScrollbar("update");
			}
			// Show map area
			self.showMapAreaWithSpinner();
		},
		fillCellDensityPointFiveDegreeData: function(allData, a) {
			var self = this;
			var canonicals = ko.observableArray();
			_.each(allData.facets.canonical.terms, function(data) {
				canonicals.push(new ResumeCount({name: data.term, count: data.count}));
			});
			var kingdoms = ko.observableArray();
			_.each(allData.facets.kingdom.terms, function(data) {
				var nameAndID = data.term.split("~~~");
				if(nameAndID[1] != "null") {
					kingdoms.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
				} else {
					kingdoms.push(new ResumeCount({name: nameAndID[0], count: data.count}));
				}
			});
			var count = 0;
			var providers = ko.observableArray();
			_.each(allData.facets.data_provider_name.terms, function(data) {
				providers.push(new ResumeCount({id: allData.facets.data_provider_id.terms[count].term, url: "http://data.sibcolombia.net/publicadores/provider/"+allData.facets.data_provider_id.terms[count].term, name: data.term, count: data.count}));
				count++;
			});
			count = 0;
			var resources = ko.observableArray();
			_.each(allData.facets.data_resource_name.terms, function(data) {
				resources.push(new ResumeCount({id: allData.facets.data_resource_id.terms[count].term, url: "http://data.sibcolombia.net/conjuntos/resource/"+allData.facets.data_resource_id.terms[count].term, name: data.term, count: data.count}));
				count++;
			});
			var phylums = ko.observableArray();
			_.each(allData.facets.phylum.terms, function(data) {
				var nameAndID = data.term.split("~~~");
				if(nameAndID[1] != "null") {
					phylums.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
				} else {
					phylums.push(new ResumeCount({name: nameAndID[0], count: data.count}));
				}
			});
			var taxonClasses = ko.observableArray();
			_.each(allData.facets.taxonClass.terms, function(data) {
				var nameAndID = data.term.split("~~~");
				if(nameAndID[1] != "null") {
					taxonClasses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
				} else {
					taxonClasses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
				}
			});
			var order_ranks = ko.observableArray();
			_.each(allData.facets.order_rank.terms, function(data) {
				var nameAndID = data.term.split("~~~");
				if(nameAndID[1] != "null") {
					order_ranks.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
				} else {
					order_ranks.push(new ResumeCount({name: nameAndID[0], count: data.count}));
				}
			});
			var families = ko.observableArray();
			_.each(allData.facets.family.terms, function(data) {
				var nameAndID = data.term.split("~~~");
				if(nameAndID[1] != "null") {
					families.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
				} else {
					families.push(new ResumeCount({name: nameAndID[0], count: data.count}));
				}
			});
			var genuses = ko.observableArray();
			_.each(allData.facets.genus.terms, function(data) {
				var nameAndID = data.term.split("~~~");
				if(nameAndID[1] != "null") {
					genuses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
				} else {
					genuses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
				}
			});
			var species = ko.observableArray();
			_.each(allData.facets.species.terms, function(data) {
				var nameAndID = data.term.split("~~~");
				if(nameAndID[1] != "null") {
					species.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
				} else {
					species.push(new ResumeCount({name: nameAndID[0], count: data.count}));
				}
			});
			var counties = ko.observableArray();
			_.each(allData.facets.county_name.terms, function(data) {
				counties.push(new ResumeCount({name: data.term, count: data.count}));
			});
			self.resumesInfo.removeAll();
			self.resumesInfo.push(new ResumeInfo({cellID: a.layer.options.cellID, canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, counties: counties}));

			if($("#resumeDetail").is(':hidden')) {
				$("#resumeDetail").animate({width: 'toggle'}, 500, "swing", function() {
					if(self.resumeFirstScrollRun) {
						$("#resumeInfoDetailContainer").mCustomScrollbar({
							theme:"dark"
						});
						self.resumeFirstScrollRun = false;
					} else {
						$("#resumeInfoDetailContainer").mCustomScrollbar("update");
					}
				});
			} else {
				$("#resumeInfoDetailContainer").mCustomScrollbar("update");
			}
			// Show map area
			self.showMapAreaWithSpinner();
		},
		fillCellDensityPointTwoDegreeData: function(allData, a) {
			var self = this;
			var canonicals = ko.observableArray();
			_.each(allData.facets.canonical.terms, function(data) {
				canonicals.push(new ResumeCount({name: data.term, count: data.count}));
			});
			var kingdoms = ko.observableArray();
			_.each(allData.facets.kingdom.terms, function(data) {
				var nameAndID = data.term.split("~~~");
				if(nameAndID[1] != "null") {
					kingdoms.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
				} else {
					kingdoms.push(new ResumeCount({name: nameAndID[0], count: data.count}));
				}
			});
			var count = 0;
			var providers = ko.observableArray();
			_.each(allData.facets.data_provider_name.terms, function(data) {
				providers.push(new ResumeCount({id: allData.facets.data_provider_id.terms[count].term, url: "http://data.sibcolombia.net/publicadores/provider/"+allData.facets.data_provider_id.terms[count].term, name: data.term, count: data.count}));
				count++;
			});
			count = 0;
			var resources = ko.observableArray();
			_.each(allData.facets.data_resource_name.terms, function(data) {
				resources.push(new ResumeCount({id: allData.facets.data_resource_id.terms[count].term, url: "http://data.sibcolombia.net/conjuntos/resource/"+allData.facets.data_resource_id.terms[count].term, name: data.term, count: data.count}));
				count++;
			});
			var phylums = ko.observableArray();
			_.each(allData.facets.phylum.terms, function(data) {
				var nameAndID = data.term.split("~~~");
				if(nameAndID[1] != "null") {
					phylums.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
				} else {
					phylums.push(new ResumeCount({name: nameAndID[0], count: data.count}));
				}
			});
			var taxonClasses = ko.observableArray();
			_.each(allData.facets.taxonClass.terms, function(data) {
				var nameAndID = data.term.split("~~~");
				if(nameAndID[1] != "null") {
					taxonClasses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
				} else {
					taxonClasses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
				}
			});
			var order_ranks = ko.observableArray();
			_.each(allData.facets.order_rank.terms, function(data) {
				var nameAndID = data.term.split("~~~");
				if(nameAndID[1] != "null") {
					order_ranks.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
				} else {
					order_ranks.push(new ResumeCount({name: nameAndID[0], count: data.count}));
				}
			});
			var families = ko.observableArray();
			_.each(allData.facets.family.terms, function(data) {
				var nameAndID = data.term.split("~~~");
				if(nameAndID[1] != "null") {
					families.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
				} else {
					families.push(new ResumeCount({name: nameAndID[0], count: data.count}));
				}
			});
			var genuses = ko.observableArray();
			_.each(allData.facets.genus.terms, function(data) {
				var nameAndID = data.term.split("~~~");
				if(nameAndID[1] != "null") {
					genuses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
				} else {
					genuses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
				}
			});
			var species = ko.observableArray();
			_.each(allData.facets.species.terms, function(data) {
				var nameAndID = data.term.split("~~~");
				if(nameAndID[1] != "null") {
					species.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
				} else {
					species.push(new ResumeCount({name: nameAndID[0], count: data.count}));
				}
			});
			var counties = ko.observableArray();
			_.each(allData.facets.county_name.terms, function(data) {
				counties.push(new ResumeCount({name: data.term, count: data.count}));
			});
			self.resumesInfo.removeAll();
			self.resumesInfo.push(new ResumeInfo({cellID: a.layer.options.cellID, canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, counties: counties}));

			if($("#resumeDetail").is(':hidden')) {
				$("#resumeDetail").animate({width: 'toggle'}, 500, "swing", function() {
					if(self.resumeFirstScrollRun) {
						$("#resumeInfoDetailContainer").mCustomScrollbar({
							theme:"dark"
						});
						self.resumeFirstScrollRun = false;
					} else {
						$("#resumeInfoDetailContainer").mCustomScrollbar("update");
					}
				});
			} else {
				$("#resumeInfoDetailContainer").mCustomScrollbar("update");
			}
			// Show map area
			self.showMapAreaWithSpinner();
		},
		fillCellDensityPointOneDegreeData: function(allData, a) {
			var self = this;
			var canonicals = ko.observableArray();
			_.each(allData.facets.canonical.terms, function(data) {
				canonicals.push(new ResumeCount({name: data.term, count: data.count}));
			});
			var kingdoms = ko.observableArray();
			_.each(allData.facets.kingdom.terms, function(data) {
				var nameAndID = data.term.split("~~~");
				if(nameAndID[1] != "null") {
					kingdoms.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
				} else {
					kingdoms.push(new ResumeCount({name: nameAndID[0], count: data.count}));
				}
			});
			var count = 0;
			var providers = ko.observableArray();
			_.each(allData.facets.data_provider_name.terms, function(data) {
				providers.push(new ResumeCount({id: allData.facets.data_provider_id.terms[count].term, url: "http://data.sibcolombia.net/publicadores/provider/"+allData.facets.data_provider_id.terms[count].term, name: data.term, count: data.count}));
				count++;
			});
			count = 0;
			var resources = ko.observableArray();
			_.each(allData.facets.data_resource_name.terms, function(data) {
				resources.push(new ResumeCount({id: allData.facets.data_resource_id.terms[count].term, url: "http://data.sibcolombia.net/conjuntos/resource/"+allData.facets.data_resource_id.terms[count].term, name: data.term, count: data.count}));
				count++;
			});
			var phylums = ko.observableArray();
			_.each(allData.facets.phylum.terms, function(data) {
				var nameAndID = data.term.split("~~~");
				if(nameAndID[1] != "null") {
					phylums.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
				} else {
					phylums.push(new ResumeCount({name: nameAndID[0], count: data.count}));
				}
			});
			var taxonClasses = ko.observableArray();
			_.each(allData.facets.taxonClass.terms, function(data) {
				var nameAndID = data.term.split("~~~");
				if(nameAndID[1] != "null") {
					taxonClasses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
				} else {
					taxonClasses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
				}
			});
			var order_ranks = ko.observableArray();
			_.each(allData.facets.order_rank.terms, function(data) {
				var nameAndID = data.term.split("~~~");
				if(nameAndID[1] != "null") {
					order_ranks.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
				} else {
					order_ranks.push(new ResumeCount({name: nameAndID[0], count: data.count}));
				}
			});
			var families = ko.observableArray();
			_.each(allData.facets.family.terms, function(data) {
				var nameAndID = data.term.split("~~~");
				if(nameAndID[1] != "null") {
					families.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
				} else {
					families.push(new ResumeCount({name: nameAndID[0], count: data.count}));
				}
			});
			var genuses = ko.observableArray();
			_.each(allData.facets.genus.terms, function(data) {
				var nameAndID = data.term.split("~~~");
				if(nameAndID[1] != "null") {
					genuses.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
				} else {
					genuses.push(new ResumeCount({name: nameAndID[0], count: data.count}));
				}
			});
			var species = ko.observableArray();
			_.each(allData.facets.species.terms, function(data) {
				var nameAndID = data.term.split("~~~");
				if(nameAndID[1] != "null") {
					species.push(new ResumeCount({id: nameAndID[1], url: "http://data.sibcolombia.net/species/"+nameAndID[1], name: nameAndID[0], count: data.count}));
				} else {
					species.push(new ResumeCount({name: nameAndID[0], count: data.count}));
				}
			});
			var counties = ko.observableArray();
			_.each(allData.facets.county_name.terms, function(data) {
				counties.push(new ResumeCount({name: data.term, count: data.count}));
			});
			self.resumesInfo.removeAll();
			self.resumesInfo.push(new ResumeInfo({cellID: a.layer.options.cellID, canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, counties: counties}));

			if($("#resumeDetail").is(':hidden')) {
				$("#resumeDetail").animate({width: 'toggle'}, 500, "swing", function() {
					if(self.resumeFirstScrollRun) {
						$("#resumeInfoDetailContainer").mCustomScrollbar({
							theme:"dark"
						});
						self.resumeFirstScrollRun = false;
					} else {
						$("#resumeInfoDetailContainer").mCustomScrollbar("update");
					}
				});
			} else {
				$("#resumeInfoDetailContainer").mCustomScrollbar("update");
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
			if(self.currentActiveDistribution() != "none") {
				$("#"+self.currentActiveDistribution()).button('toggle');
			}
			$("#oneDegree").button('toggle');
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
				url += "&c["+counter+"].s=2&c["+counter+"].p=1&c["+counter+"].o="+self.selectedOnMapPoligonCoordinates()[2].lng;
				counter++;
				url += "&c["+counter+"].s=2&c["+counter+"].p=2&c["+counter+"].o="+self.selectedOnMapPoligonCoordinates()[0].lng;
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