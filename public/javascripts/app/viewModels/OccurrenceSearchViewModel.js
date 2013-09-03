define(["jquery", "knockout", "underscore", "app/models/baseViewModel", "app/map-initialize", "app/models/occurrence", "app/models/resumeInfo", "app/models/resumeCount", "app/models/resumeScientificName", "app/models/resumeKingdomName", "app/models/resumePhylumName", "app/models/resumeClassName", "app/models/resumeOrderName", "app/models/resumeFamilyName", "app/models/resumeGenusName", "app/models/resumeSpecieName", "app/models/resumeDataProvider", "app/models/resumeDataResource", "app/models/resumeInstitutionCode", "app/models/resumeCollectionCode", "app/models/resumeCountry", "app/models/resumeDepartment", "select2", "knockoutKendoUI", "Leaflet", "jqueryUI", "bootstrap", "customScrollBar"], function($, ko, _, BaseViewModel, map, Occurrence, ResumeInfo, ResumeCount, ResumeScientificName, ResumeKingdomName, ResumePhylumName, ResumeClassName, ResumeOrderName, ResumeFamilyName, ResumeGenusName, ResumeSpecieName, ResumeDataProvider, ResumeDataResource, ResumeInstitutionCode, ResumeCollectionCode, ResumeCountry, ResumeDepartment, select2) {
	var OccurrenceSearchViewModel = function() {
		var self = this;
		self.densityCellsOneDegree = new L.FeatureGroup();
		self.densityCellsPointOneDegree = new L.FeatureGroup();
		self.densityCellsPointFiveDegree = new L.FeatureGroup();
		self.densityCellsPointTwoDegree = new L.FeatureGroup();

		// Grid table data
		self.gridItems = [];

		// Active distribution
		self.currentActiveDistribution = "none";

		// Help variables
		self.firstScrollRun = true;
		self.detailsFirstScrollRun = true;
		self.resumeFirstScrollRun = true;
		self.helpSearchText = "<p>Escriba un nombre científico y pulse en Agregar filtro.</p><p>Este filtro devolverá cualquier registro que posea un nombre que concuerde con el identificador dado del organismo, sin importar como está clasificado el organismo.</p>";
		self.totalFilters = 0;

		// Total occurrences data
		self.totalOccurrences = 0;
		self.totalGeoOccurrences = 0;

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
		self.isObjectNameHelpSelected = false;
		self.predicateOptions = "[{value: 0, name: 'es'}]";

		// Arrays of selected filters by kind
		self.selectedScientificNames = [];
		self.selectedTaxonNames = [];
		self.selectedCountriesIDs = [];
		self.selectedDepartmentsIDs = [];
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

		// Array of current occurrences details
		self.occurrencesDetails = [];

		// Filter variables
		self.selectedSubject = 0;
		self.selectedPredicate = "";
		self.objectNameValue = "";
		self.selectedCountry = "";
		self.selectedDepartment = "";
		self.selectedCoordinateState = "";

		// Resume info
		self.resumesInfo = [];
		self.resumesInfoFilter = [];

		BaseViewModel.apply( this, arguments );
	};

	_.extend(OccurrenceSearchViewModel.prototype, BaseViewModel.prototype, self.densityCellsOneDegree, {
		initialize: function() {
			var self = this;
			this.loadGridData();
			this.loadCellDensityOneDegree();
			this.loadCellDensityPointOneDegree();
			this.loadCellDensityPointFiveDegree();
			this.loadCellDensityPointTwoDegree();

			// Event subscription
			self.objectNameValue.subscribe(function (newValue) {
				if(self.selectedSubject() == "0") {
					// Load new scientific name data
					self.getScientificNamesData();
				} else if(self.selectedSubject() == 100) {
					// Get resume kingdom data
					self.getKingdomNamesData();
				} else if(self.selectedSubject() == 101) {
					// Get resume phylum data
					self.getPhylumNamesData();
				} else if(self.selectedSubject() == 102) {
					// Get resume class data
					self.getClassNamesData();
				} else if(self.selectedSubject() == 103) {
					// Get resume order data
					self.getOrderNamesData();
				} else if(self.selectedSubject() == 104) {
					// Get resume family data
					self.getFamilyNamesData();
				} else if(self.selectedSubject() == 105) {
					// Get resume genus data
					self.getGenusNamesData();
				} else if(self.selectedSubject() == 106) {
					// Get resume species data
					self.getSpeciesNamesData();
				} else if(self.selectedSubject() == 25) {
					// Get resume data providers data
					self.getDataProvidersData();
				} else if(self.selectedSubject() == 24) {
					// Get resume data resources data}
					self.getDataResourcesData();
				} else if(self.selectedSubject() == 12) {
					// Get institution codes data
					self.getInstitutionCodesData();
				} else if(self.selectedSubject() == 13) {
					// Get collection codes data
					self.getCollectionCodesData();
				}
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
							self.getDepartmentsData();
							self.enableFilterHelp();
						}
					});
				},
				update: function(element) {
					$(element).trigger('change');
				}
			};
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
		loadCellDensityOneDegree: function() {
			var self = this;
			// Initialize default cell density distribution (one degree)
			map.addLayer(self.densityCellsOneDegree());
			$.getJSON("/distribution/onedegree/list", function(allData) {
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
				$("#oneDegree").button('toggle');
				self.currentActiveDistribution("oneDegree");

				self.densityCellsOneDegree().on('click', function (a) {
					$.getJSON("/distribution/onedegree/stats/"+a.layer.options.cellID, function(allData) {
						var canonicals = ko.observableArray();
						_.each(allData.facets.canonical.terms, function(data) {
							canonicals.push(new ResumeCount({name: data.term, count: data.count}));
						});
						var count = 0;
						var kingdoms = ko.observableArray();
						_.each(allData.facets.kingdom.terms, function(data) {
							kingdoms.push(new ResumeCount({id: allData.facets.kingdom_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.kingdom_concept_id.terms[count].term, name: data.term, count: data.count}));
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
						count = 0;
						var phylums = ko.observableArray();
						_.each(allData.facets.phylum.terms, function(data) {
							phylums.push(new ResumeCount({id: allData.facets.phylum_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.phylum_concept_id.terms[count].term, name: data.term, count: data.count}));
							count++;
						});
						count = 0;
						var taxonClasses = ko.observableArray();
						_.each(allData.facets.taxonClass.terms, function(data) {
							taxonClasses.push(new ResumeCount({id: allData.facets.class_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.class_concept_id.terms[count].term, name: data.term, count: data.count}));
							count++;
						});
						count = 0;
						var order_ranks = ko.observableArray();
						_.each(allData.facets.order_rank.terms, function(data) {
							order_ranks.push(new ResumeCount({id: allData.facets.order_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.order_concept_id.terms[count].term, name: data.term, count: data.count}));
							count++;
						});
						count = 0;
						var families = ko.observableArray();
						_.each(allData.facets.family.terms, function(data) {
							families.push(new ResumeCount({id: allData.facets.family_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.family_concept_id.terms[count].term, name: data.term, count: data.count}));
							count++;
						});
						count = 0;
						var genuses = ko.observableArray();
						_.each(allData.facets.genus.terms, function(data) {
							genuses.push(new ResumeCount({id: allData.facets.genus_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.genus_concept_id.terms[count].term, name: data.term, count: data.count}));
							count++;
						});
						count = 0;
						var species = ko.observableArray();
						_.each(allData.facets.species.terms, function(data) {
							species.push(new ResumeCount({id: allData.facets.species_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.species_concept_id.terms[count].term, name: data.term, count: data.count}));
							count++;
						});
						self.resumesInfo.removeAll();
						self.resumesInfo.push(new ResumeInfo({cellID: a.layer.options.cellID, canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species}));

						self.disableFilterHelp();

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
					});
				});
			});
		},
		loadCellDensityPointOneDegree: function() {
			var self = this;
			// Initialize default cell density distribution (one degree)
			var densityCellsPointOneDegree = new L.FeatureGroup();
			$.getJSON("/distribution/centidegree/list", function(allData) {
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
					$.getJSON("/distribution/centidegree/stats/"+a.layer.options.cellID+"/"+a.layer.options.centicellID, function(allData) {
						var canonicals = ko.observableArray();
						_.each(allData.facets.canonical.terms, function(data) {
							canonicals.push(new ResumeCount({name: data.term, count: data.count}));
						});
						var count = 0;
						var kingdoms = ko.observableArray();
						_.each(allData.facets.kingdom.terms, function(data) {
							kingdoms.push(new ResumeCount({id: allData.facets.kingdom_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.kingdom_concept_id.terms[count].term, name: data.term, count: data.count}));
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
						count = 0;
						var phylums = ko.observableArray();
						_.each(allData.facets.phylum.terms, function(data) {
							phylums.push(new ResumeCount({id: allData.facets.phylum_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.phylum_concept_id.terms[count].term, name: data.term, count: data.count}));
							count++;
						});
						count = 0;
						var taxonClasses = ko.observableArray();
						_.each(allData.facets.taxonClass.terms, function(data) {
							taxonClasses.push(new ResumeCount({id: allData.facets.class_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.class_concept_id.terms[count].term, name: data.term, count: data.count}));
							count++;
						});
						count = 0;
						var order_ranks = ko.observableArray();
						_.each(allData.facets.order_rank.terms, function(data) {
							order_ranks.push(new ResumeCount({id: allData.facets.order_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.order_concept_id.terms[count].term, name: data.term, count: data.count}));
							count++;
						});
						count = 0;
						var families = ko.observableArray();
						_.each(allData.facets.family.terms, function(data) {
							families.push(new ResumeCount({id: allData.facets.family_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.family_concept_id.terms[count].term, name: data.term, count: data.count}));
							count++;
						});
						count = 0;
						var genuses = ko.observableArray();
						_.each(allData.facets.genus.terms, function(data) {
							genuses.push(new ResumeCount({id: allData.facets.genus_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.genus_concept_id.terms[count].term, name: data.term, count: data.count}));
							count++;
						});
						count = 0;
						var species = ko.observableArray();
						_.each(allData.facets.species.terms, function(data) {
							species.push(new ResumeCount({id: allData.facets.species_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.species_concept_id.terms[count].term, name: data.term, count: data.count}));
							count++;
						});
						self.resumesInfo.removeAll();
						self.resumesInfo.push(new ResumeInfo({cellID: a.layer.options.cellID, canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species}));

						self.disableFilterHelp();

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
					});
				});
			});
		},
		loadCellDensityPointFiveDegree: function() {
			var self = this;
			// Initialize default cell density distribution (five degrees)
			var densityCellsPointFiveDegree = new L.FeatureGroup();
			$.getJSON("/distribution/pointfivedegree/list", function(allData) {
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
					$.getJSON("/distribution/pointfivedegree/stats/"+a.layer.options.cellID+"/"+a.layer.options.pointfivecellID, function(allData) {
						var canonicals = ko.observableArray();
						_.each(allData.facets.canonical.terms, function(data) {
							canonicals.push(new ResumeCount({name: data.term, count: data.count}));
						});
						var count = 0;
						var kingdoms = ko.observableArray();
						_.each(allData.facets.kingdom.terms, function(data) {
							kingdoms.push(new ResumeCount({id: allData.facets.kingdom_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.kingdom_concept_id.terms[count].term, name: data.term, count: data.count}));
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
						count = 0;
						var phylums = ko.observableArray();
						_.each(allData.facets.phylum.terms, function(data) {
							phylums.push(new ResumeCount({id: allData.facets.phylum_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.phylum_concept_id.terms[count].term, name: data.term, count: data.count}));
							count++;
						});
						count = 0;
						var taxonClasses = ko.observableArray();
						_.each(allData.facets.taxonClass.terms, function(data) {
							taxonClasses.push(new ResumeCount({id: allData.facets.class_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.class_concept_id.terms[count].term, name: data.term, count: data.count}));
							count++;
						});
						count = 0;
						var order_ranks = ko.observableArray();
						_.each(allData.facets.order_rank.terms, function(data) {
							order_ranks.push(new ResumeCount({id: allData.facets.order_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.order_concept_id.terms[count].term, name: data.term, count: data.count}));
							count++;
						});
						count = 0;
						var families = ko.observableArray();
						_.each(allData.facets.family.terms, function(data) {
							families.push(new ResumeCount({id: allData.facets.family_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.family_concept_id.terms[count].term, name: data.term, count: data.count}));
							count++;
						});
						count = 0;
						var genuses = ko.observableArray();
						_.each(allData.facets.genus.terms, function(data) {
							genuses.push(new ResumeCount({id: allData.facets.genus_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.genus_concept_id.terms[count].term, name: data.term, count: data.count}));
							count++;
						});
						count = 0;
						var species = ko.observableArray();
						_.each(allData.facets.species.terms, function(data) {
							species.push(new ResumeCount({id: allData.facets.species_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.species_concept_id.terms[count].term, name: data.term, count: data.count}));
							count++;
						});
						self.resumesInfo.removeAll();
						self.resumesInfo.push(new ResumeInfo({cellID: a.layer.options.cellID, canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species}));

						self.disableFilterHelp();

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
					});
				});
			});
		},
		loadCellDensityPointTwoDegree: function() {
			var self = this;
			// Initialize default cell density distribution (two degrees)
			var densityCellsPointTwoDegree = new L.FeatureGroup();
			$.getJSON("/distribution/pointtwodegree/list", function(allData) {
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
					$.getJSON("/distribution/pointtwodegree/stats/"+a.layer.options.cellID+"/"+a.layer.options.pointtwocellID, function(allData) {
						var canonicals = ko.observableArray();
						_.each(allData.facets.canonical.terms, function(data) {
							canonicals.push(new ResumeCount({name: data.term, count: data.count}));
						});
						var count = 0;
						var kingdoms = ko.observableArray();
						_.each(allData.facets.kingdom.terms, function(data) {
							kingdoms.push(new ResumeCount({id: allData.facets.kingdom_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.kingdom_concept_id.terms[count].term, name: data.term, count: data.count}));
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
						count = 0;
						var phylums = ko.observableArray();
						_.each(allData.facets.phylum.terms, function(data) {
							phylums.push(new ResumeCount({id: allData.facets.phylum_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.phylum_concept_id.terms[count].term, name: data.term, count: data.count}));
							count++;
						});
						count = 0;
						var taxonClasses = ko.observableArray();
						_.each(allData.facets.taxonClass.terms, function(data) {
							taxonClasses.push(new ResumeCount({id: allData.facets.class_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.class_concept_id.terms[count].term, name: data.term, count: data.count}));
							count++;
						});
						count = 0;
						var order_ranks = ko.observableArray();
						_.each(allData.facets.order_rank.terms, function(data) {
							order_ranks.push(new ResumeCount({id: allData.facets.order_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.order_concept_id.terms[count].term, name: data.term, count: data.count}));
							count++;
						});
						count = 0;
						var families = ko.observableArray();
						_.each(allData.facets.family.terms, function(data) {
							families.push(new ResumeCount({id: allData.facets.family_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.family_concept_id.terms[count].term, name: data.term, count: data.count}));
							count++;
						});
						count = 0;
						var genuses = ko.observableArray();
						_.each(allData.facets.genus.terms, function(data) {
							genuses.push(new ResumeCount({id: allData.facets.genus_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.genus_concept_id.terms[count].term, name: data.term, count: data.count}));
							count++;
						});
						count = 0;
						var species = ko.observableArray();
						_.each(allData.facets.species.terms, function(data) {
							species.push(new ResumeCount({id: allData.facets.species_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.species_concept_id.terms[count].term, name: data.term, count: data.count}));
							count++;
						});
						self.resumesInfo.removeAll();
						self.resumesInfo.push(new ResumeInfo({cellID: a.layer.options.cellID, canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species}));

						self.disableFilterHelp();

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
					});
				});
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
			$("#filtersContainerHelp").css({display: 'none'});
			// Clear actual resume filter
			self.objectNameValue("");

			self.isObjectNameHelpSelected = ko.observable(false);
			// Default filters predicate
			self.predicateOptions([{value: 0, name: 'es'}]);
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
				self.predicateOptions([{value: 0, name: 'es'},{value: 1, name: 'mayor que'},{value: 2, name: 'menor que'}]);
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
			}
			self.getHelpSearchText();
		},
		getHelpSearchText: function() {
			var self = this;
			$.getJSON("/occurrences/searchhelptext/name/"+self.selectedSubject(), function(allData) {
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
			if(self.selectedSubject() === 0) {
				// Adding scientific name filter
				self.addScientificName();
			} else if(self.selectedSubject() == 100) {
				self.addTaxonName(self.selectedSubject(), "Reino");
			} else if(self.selectedSubject() == 101) {
				self.addTaxonName(self.selectedSubject(), "Filo");
			} else if(self.selectedSubject() == 102) {
				self.addTaxonName(self.selectedSubject(), "Clase");
			} else if(self.selectedSubject() == 103) {
				self.addTaxonName(self.selectedSubject(), "Orden");
			} else if(self.selectedSubject() == 104) {
				self.addTaxonName(self.selectedSubject(), "Familia");
			} else if(self.selectedSubject() == 105) {
				self.addTaxonName(self.selectedSubject(), "Género");
			} else if(self.selectedSubject() == 106) {
				self.addTaxonName(self.selectedSubject(), "Especie");
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
		},
		startSearch: function() {
			var response = {};
			var self = this;
			if(self.selectedScientificNames().length !== 0);
				response['scientificNames'] = self.selectedScientificNames();
			if(self.selectedTaxonNames().length !== 0)
				response['taxons'] = self.selectedTaxonNames();
			if(self.selectedCountriesIDs().length !== 0)
				response['countries'] = self.selectedCountriesIDs();
			if(self.selectedDepartmentsIDs().length !== 0)
				response['departments'] = self.selectedDepartmentsIDs();
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
			var data = ko.toJSON(response);
			$.ajax({
				contentType: 'application/json',
				type: 'POST',
				url: '/occurrences/search',
				data: data,
				beforeSend: function() {
					self.disableFilterHelp();
					$(".tab-content").addClass("hide-element");
					$("#map-filter-area").addClass("loading");
				},
				complete: function() {
					$("#map-filter-area").removeClass("loading");
					$(".tab-content").removeClass("hide-element");
				},
				success: function(returnedData) {
					//markers.clearLayers();
					var totalGeoOccurrences = 0;
					$.each(returnedData, function(i, geooccurrence) {
						//var marker = new L.Marker(new L.LatLng(geooccurrence.latitude, geooccurrence.longitude), { title: geooccurrence.canonical})
						//marker.bindPopup(geooccurrence.canonical + ' (' + geooccurrence.num_occurrences + ')')
						//markers.addLayer(marker)
						//totalGeoOccurrences = totalGeoOccurrences + geooccurrence.num_occurrences
					});
					markers.on('click', function (a) {
						if(a.layer._preSpiderfyLatlng) {
							var latitude = a.layer._preSpiderfyLatlng.lat;
							var longitude = a.layer._preSpiderfyLatlng.lng;
						} else {
							var latitude = a.layer.getLatLng().lat;
							var longitude = a.layer.getLatLng().lng;
						}
						$.getJSON("/occurrences/details/search?canonical="+a.layer.options.title+"&latitude="+latitude+"&longitude="+longitude, function(allData) {
							var mappedOccurrences = $.map(allData, function(item) {
								return new Occurrence(item);
							});
							self.occurrencesDetails(mappedOccurrences);
							self.disableFilterHelp();
							if($("#occurrenceDetail").is(':hidden')) {
								$("#occurrenceDetail").animate({width: 'toggle'}, 500, "swing", function() {
									if(self.detailsFirstScrollRun) {
										$("#occurrenceDetailContainer").mCustomScrollbar({
											theme:"dark"
										});
										self.detailsFirstScrollRun = false;
									} else {
										$("#occurrenceDetailContainer").mCustomScrollbar("update");
									}
								});
							} else {
								$("#occurrenceDetailContainer").mCustomScrollbar("update");
							}
						});
					});
					self.totalGeoOccurrences(totalGeoOccurrences);
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
			$.getJSON("/occurrences/resume/scientificname/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
				self.resumeScientificNames.removeAll();
				_.each(allData.facets.canonical.terms, function(data) {
					self.resumeScientificNames.push(new ResumeScientificName({canonical: data.term, occurrences: data.count}));
				});
				var canonicals = ko.observableArray();
				var count = 0;
				var kingdoms = ko.observableArray();
				_.each(allData.facets.kingdom.terms, function(data) {
					kingdoms.push(new ResumeCount({id: allData.facets.kingdom_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.kingdom_concept_id.terms[count].term, name: data.term, count: data.count}));
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
				count = 0;
				var phylums = ko.observableArray();
				_.each(allData.facets.phylum.terms, function(data) {
					phylums.push(new ResumeCount({id: allData.facets.phylum_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.phylum_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var taxonClasses = ko.observableArray();
				_.each(allData.facets.taxonClass.terms, function(data) {
					taxonClasses.push(new ResumeCount({id: allData.facets.class_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.class_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var order_ranks = ko.observableArray();
				_.each(allData.facets.order_rank.terms, function(data) {
					order_ranks.push(new ResumeCount({id: allData.facets.order_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.order_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var families = ko.observableArray();
				_.each(allData.facets.family.terms, function(data) {
					families.push(new ResumeCount({id: allData.facets.family_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.family_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var genuses = ko.observableArray();
				_.each(allData.facets.genus.terms, function(data) {
					genuses.push(new ResumeCount({id: allData.facets.genus_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.genus_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var species = ko.observableArray();
				_.each(allData.facets.species.terms, function(data) {
					species.push(new ResumeCount({id: allData.facets.species_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.species_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
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
				self.resumesInfoFilter.push(new ResumeInfo({canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, countries: countries, departments: departments}));
				$("#contentFiltersContainerHelp").mCustomScrollbar("update");
			});
		},
		getKingdomNamesData: function() {
			var self = this;
			$.getJSON("/occurrences/resume/kingdom/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
				self.resumeKingdomNames.removeAll();
				_.each(allData.facets.kingdom.terms, function(data) {
					self.resumeKingdomNames.push(new ResumeKingdomName({kingdom: data.term, occurrences: data.count}));
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
				count = 0;
				var phylums = ko.observableArray();
				_.each(allData.facets.phylum.terms, function(data) {
					phylums.push(new ResumeCount({id: allData.facets.phylum_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.phylum_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var taxonClasses = ko.observableArray();
				_.each(allData.facets.taxonClass.terms, function(data) {
					taxonClasses.push(new ResumeCount({id: allData.facets.class_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.class_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var order_ranks = ko.observableArray();
				_.each(allData.facets.order_rank.terms, function(data) {
					order_ranks.push(new ResumeCount({id: allData.facets.order_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.order_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var families = ko.observableArray();
				_.each(allData.facets.family.terms, function(data) {
					families.push(new ResumeCount({id: allData.facets.family_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.family_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var genuses = ko.observableArray();
				_.each(allData.facets.genus.terms, function(data) {
					genuses.push(new ResumeCount({id: allData.facets.genus_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.genus_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var species = ko.observableArray();
				_.each(allData.facets.species.terms, function(data) {
					species.push(new ResumeCount({id: allData.facets.species_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.species_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
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
				self.resumesInfoFilter.push(new ResumeInfo({canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, countries: countries, departments: departments}));
				$("#contentFiltersContainerHelp").mCustomScrollbar("update");
			});
		},
		getPhylumNamesData: function() {
			var self = this;
			$.getJSON("/occurrences/resume/phylum/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
				self.resumePhylumNames.removeAll();
				_.each(allData.facets.phylum.terms, function(data) {
					self.resumePhylumNames.push(new ResumePhylumName({phylum: data.term, occurrences: data.count}));
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
				count = 0;
				var kingdoms = ko.observableArray();
				_.each(allData.facets.kingdom.terms, function(data) {
					kingdoms.push(new ResumeCount({id: allData.facets.kingdom_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.kingdom_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var taxonClasses = ko.observableArray();
				_.each(allData.facets.taxonClass.terms, function(data) {
					taxonClasses.push(new ResumeCount({id: allData.facets.class_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.class_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var order_ranks = ko.observableArray();
				_.each(allData.facets.order_rank.terms, function(data) {
					order_ranks.push(new ResumeCount({id: allData.facets.order_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.order_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var families = ko.observableArray();
				_.each(allData.facets.family.terms, function(data) {
					families.push(new ResumeCount({id: allData.facets.family_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.family_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var genuses = ko.observableArray();
				_.each(allData.facets.genus.terms, function(data) {
					genuses.push(new ResumeCount({id: allData.facets.genus_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.genus_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var species = ko.observableArray();
				_.each(allData.facets.species.terms, function(data) {
					species.push(new ResumeCount({id: allData.facets.species_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.species_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
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
				self.resumesInfoFilter.push(new ResumeInfo({canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, countries: countries, departments: departments}));
				$("#contentFiltersContainerHelp").mCustomScrollbar("update");
			});
		},
		getClassNamesData: function() {
			var self = this;
			$.getJSON("/occurrences/resume/class/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
				self.resumeClassNames.removeAll();
				_.each(allData.facets.taxonClass.terms, function(data) {
					self.resumeClassNames.push(new ResumeClassName({nameClass: data.term, occurrences: data.count}));
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
				count = 0;
				var kingdoms = ko.observableArray();
				_.each(allData.facets.kingdom.terms, function(data) {
					kingdoms.push(new ResumeCount({id: allData.facets.kingdom_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.kingdom_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var phylums = ko.observableArray();
				_.each(allData.facets.phylum.terms, function(data) {
					phylums.push(new ResumeCount({id: allData.facets.phylum_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.phylum_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var order_ranks = ko.observableArray();
				_.each(allData.facets.order_rank.terms, function(data) {
					order_ranks.push(new ResumeCount({id: allData.facets.order_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.order_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var families = ko.observableArray();
				_.each(allData.facets.family.terms, function(data) {
					families.push(new ResumeCount({id: allData.facets.family_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.family_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var genuses = ko.observableArray();
				_.each(allData.facets.genus.terms, function(data) {
					genuses.push(new ResumeCount({id: allData.facets.genus_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.genus_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var species = ko.observableArray();
				_.each(allData.facets.species.terms, function(data) {
					species.push(new ResumeCount({id: allData.facets.species_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.species_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
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
				self.resumesInfoFilter.push(new ResumeInfo({canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, countries: countries, departments: departments}));
				$("#contentFiltersContainerHelp").mCustomScrollbar("update");
			});
		},
		getOrderNamesData: function() {
			var self = this;
			$.getJSON("/occurrences/resume/order/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
				self.resumeOrderNames.removeAll();
				_.each(allData.facets.order_rank.terms, function(data) {
					self.resumeOrderNames.push(new ResumeOrderName({order_rank: data.term, occurrences: data.count}));
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
				count = 0;
				var kingdoms = ko.observableArray();
				_.each(allData.facets.kingdom.terms, function(data) {
					kingdoms.push(new ResumeCount({id: allData.facets.kingdom_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.kingdom_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var phylums = ko.observableArray();
				_.each(allData.facets.phylum.terms, function(data) {
					phylums.push(new ResumeCount({id: allData.facets.phylum_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.phylum_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var taxonClasses = ko.observableArray();
				_.each(allData.facets.taxonClass.terms, function(data) {
					taxonClasses.push(new ResumeCount({id: allData.facets.class_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.class_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var families = ko.observableArray();
				_.each(allData.facets.family.terms, function(data) {
					families.push(new ResumeCount({id: allData.facets.family_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.family_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var genuses = ko.observableArray();
				_.each(allData.facets.genus.terms, function(data) {
					genuses.push(new ResumeCount({id: allData.facets.genus_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.genus_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var species = ko.observableArray();
				_.each(allData.facets.species.terms, function(data) {
					species.push(new ResumeCount({id: allData.facets.species_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.species_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
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
				self.resumesInfoFilter.push(new ResumeInfo({canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, countries: countries, departments: departments}));
				$("#contentFiltersContainerHelp").mCustomScrollbar("update");
			});
		},
		getFamilyNamesData: function() {
			var self = this;
			$.getJSON("/occurrences/resume/family/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
				self.resumeFamilyNames.removeAll();
				_.each(allData.facets.family.terms, function(data) {
					self.resumeFamilyNames.push(new ResumeFamilyName({family: data.term, occurrences: data.count}));
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
				count = 0;
				var kingdoms = ko.observableArray();
				_.each(allData.facets.kingdom.terms, function(data) {
					kingdoms.push(new ResumeCount({id: allData.facets.kingdom_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.kingdom_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var phylums = ko.observableArray();
				_.each(allData.facets.phylum.terms, function(data) {
					phylums.push(new ResumeCount({id: allData.facets.phylum_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.phylum_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var taxonClasses = ko.observableArray();
				_.each(allData.facets.taxonClass.terms, function(data) {
					taxonClasses.push(new ResumeCount({id: allData.facets.class_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.class_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var order_ranks = ko.observableArray();
				_.each(allData.facets.order_rank.terms, function(data) {
					order_ranks.push(new ResumeCount({id: allData.facets.order_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.order_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var genuses = ko.observableArray();
				_.each(allData.facets.genus.terms, function(data) {
					genuses.push(new ResumeCount({id: allData.facets.genus_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.genus_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var species = ko.observableArray();
				_.each(allData.facets.species.terms, function(data) {
					species.push(new ResumeCount({id: allData.facets.species_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.species_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
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
				self.resumesInfoFilter.push(new ResumeInfo({canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, countries: countries, departments: departments}));
				$("#contentFiltersContainerHelp").mCustomScrollbar("update");
			});
		},
		getGenusNamesData: function() {
			var self = this;
			$.getJSON("/occurrences/resume/genus/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
				self.resumeGenusNames.removeAll();
				_.each(allData.facets.genus.terms, function(data) {
					self.resumeGenusNames.push(new ResumeGenusName({genus: data.term, occurrences: data.count}));
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
				count = 0;
				var kingdoms = ko.observableArray();
				_.each(allData.facets.kingdom.terms, function(data) {
					kingdoms.push(new ResumeCount({id: allData.facets.kingdom_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.kingdom_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var phylums = ko.observableArray();
				_.each(allData.facets.phylum.terms, function(data) {
					phylums.push(new ResumeCount({id: allData.facets.phylum_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.phylum_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var taxonClasses = ko.observableArray();
				_.each(allData.facets.taxonClass.terms, function(data) {
					taxonClasses.push(new ResumeCount({id: allData.facets.class_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.class_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var order_ranks = ko.observableArray();
				_.each(allData.facets.order_rank.terms, function(data) {
					order_ranks.push(new ResumeCount({id: allData.facets.order_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.order_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var families = ko.observableArray();
				_.each(allData.facets.family.terms, function(data) {
					families.push(new ResumeCount({id: allData.facets.family_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.family_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var species = ko.observableArray();
				_.each(allData.facets.species.terms, function(data) {
					species.push(new ResumeCount({id: allData.facets.species_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.species_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
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
				self.resumesInfoFilter.push(new ResumeInfo({canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, countries: countries, departments: departments}));
				$("#contentFiltersContainerHelp").mCustomScrollbar("update");
			});
		},
		getSpeciesNamesData: function() {
			var self = this;
			$.getJSON("/occurrences/resume/species/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
				self.resumeSpeciesNames.removeAll();
				_.each(allData.facets.species.terms, function(data) {
					self.resumeSpeciesNames.push(new ResumeSpecieName({species: data.term, occurrences: data.count}));
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
				count = 0;
				var kingdoms = ko.observableArray();
				_.each(allData.facets.kingdom.terms, function(data) {
					kingdoms.push(new ResumeCount({id: allData.facets.kingdom_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.kingdom_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var phylums = ko.observableArray();
				_.each(allData.facets.phylum.terms, function(data) {
					phylums.push(new ResumeCount({id: allData.facets.phylum_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.phylum_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var taxonClasses = ko.observableArray();
				_.each(allData.facets.taxonClass.terms, function(data) {
					taxonClasses.push(new ResumeCount({id: allData.facets.class_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.class_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var order_ranks = ko.observableArray();
				_.each(allData.facets.order_rank.terms, function(data) {
					order_ranks.push(new ResumeCount({id: allData.facets.order_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.order_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var families = ko.observableArray();
				_.each(allData.facets.family.terms, function(data) {
					families.push(new ResumeCount({id: allData.facets.family_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.family_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var genuses = ko.observableArray();
				_.each(allData.facets.genus.terms, function(data) {
					genuses.push(new ResumeCount({id: allData.facets.genus_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.genus_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
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
				self.resumesInfoFilter.push(new ResumeInfo({canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, countries: countries, departments: departments}));
				$("#contentFiltersContainerHelp").mCustomScrollbar("update");
			});
		},
		getDataProvidersData: function() {
			var self = this;
			$.getJSON("/occurrences/resume/dataproviders/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
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
				count = 0;
				var kingdoms = ko.observableArray();
				_.each(allData.facets.kingdom.terms, function(data) {
					kingdoms.push(new ResumeCount({id: allData.facets.kingdom_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.kingdom_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var phylums = ko.observableArray();
				_.each(allData.facets.phylum.terms, function(data) {
					phylums.push(new ResumeCount({id: allData.facets.phylum_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.phylum_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var taxonClasses = ko.observableArray();
				_.each(allData.facets.taxonClass.terms, function(data) {
					taxonClasses.push(new ResumeCount({id: allData.facets.class_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.class_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var order_ranks = ko.observableArray();
				_.each(allData.facets.order_rank.terms, function(data) {
					order_ranks.push(new ResumeCount({id: allData.facets.order_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.order_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var families = ko.observableArray();
				_.each(allData.facets.family.terms, function(data) {
					families.push(new ResumeCount({id: allData.facets.family_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.family_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var genuses = ko.observableArray();
				_.each(allData.facets.genus.terms, function(data) {
					genuses.push(new ResumeCount({id: allData.facets.genus_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.genus_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var species = ko.observableArray();
				_.each(allData.facets.species.terms, function(data) {
					species.push(new ResumeCount({id: allData.facets.species_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.species_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
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
				self.resumesInfoFilter.push(new ResumeInfo({canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, countries: countries, departments: departments}));
				$("#contentFiltersContainerHelp").mCustomScrollbar("update");
			});
		},
		getDataResourcesData: function() {
			var self = this;
			$.getJSON("/occurrences/resume/dataresources/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
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
				count = 0;
				var kingdoms = ko.observableArray();
				_.each(allData.facets.kingdom.terms, function(data) {
					kingdoms.push(new ResumeCount({id: allData.facets.kingdom_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.kingdom_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var phylums = ko.observableArray();
				_.each(allData.facets.phylum.terms, function(data) {
					phylums.push(new ResumeCount({id: allData.facets.phylum_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.phylum_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var taxonClasses = ko.observableArray();
				_.each(allData.facets.taxonClass.terms, function(data) {
					taxonClasses.push(new ResumeCount({id: allData.facets.class_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.class_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var order_ranks = ko.observableArray();
				_.each(allData.facets.order_rank.terms, function(data) {
					order_ranks.push(new ResumeCount({id: allData.facets.order_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.order_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var families = ko.observableArray();
				_.each(allData.facets.family.terms, function(data) {
					families.push(new ResumeCount({id: allData.facets.family_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.family_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var genuses = ko.observableArray();
				_.each(allData.facets.genus.terms, function(data) {
					genuses.push(new ResumeCount({id: allData.facets.genus_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.genus_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var species = ko.observableArray();
				_.each(allData.facets.species.terms, function(data) {
					species.push(new ResumeCount({id: allData.facets.species_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.species_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
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
				self.resumesInfoFilter.push(new ResumeInfo({canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, countries: countries, departments: departments}));
				$("#contentFiltersContainerHelp").mCustomScrollbar("update");
			});
		},
		getInstitutionCodesData: function() {
			var self = this;
			$.getJSON("/occurrences/resume/institutioncodes/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
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
				count = 0;
				var kingdoms = ko.observableArray();
				_.each(allData.facets.kingdom.terms, function(data) {
					kingdoms.push(new ResumeCount({id: allData.facets.kingdom_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.kingdom_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var phylums = ko.observableArray();
				_.each(allData.facets.phylum.terms, function(data) {
					phylums.push(new ResumeCount({id: allData.facets.phylum_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.phylum_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var taxonClasses = ko.observableArray();
				_.each(allData.facets.taxonClass.terms, function(data) {
					taxonClasses.push(new ResumeCount({id: allData.facets.class_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.class_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var order_ranks = ko.observableArray();
				_.each(allData.facets.order_rank.terms, function(data) {
					order_ranks.push(new ResumeCount({id: allData.facets.order_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.order_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var families = ko.observableArray();
				_.each(allData.facets.family.terms, function(data) {
					families.push(new ResumeCount({id: allData.facets.family_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.family_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var genuses = ko.observableArray();
				_.each(allData.facets.genus.terms, function(data) {
					genuses.push(new ResumeCount({id: allData.facets.genus_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.genus_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var species = ko.observableArray();
				_.each(allData.facets.species.terms, function(data) {
					species.push(new ResumeCount({id: allData.facets.species_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.species_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
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
				self.resumesInfoFilter.push(new ResumeInfo({canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, countries: countries, departments: departments}));
				$("#contentFiltersContainerHelp").mCustomScrollbar("update");
			});
		},
		getCollectionCodesData: function() {
			var self = this;
			$.getJSON("/occurrences/resume/collectioncodes/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
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
				count = 0;
				var kingdoms = ko.observableArray();
				_.each(allData.facets.kingdom.terms, function(data) {
					kingdoms.push(new ResumeCount({id: allData.facets.kingdom_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.kingdom_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var phylums = ko.observableArray();
				_.each(allData.facets.phylum.terms, function(data) {
					phylums.push(new ResumeCount({id: allData.facets.phylum_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.phylum_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var taxonClasses = ko.observableArray();
				_.each(allData.facets.taxonClass.terms, function(data) {
					taxonClasses.push(new ResumeCount({id: allData.facets.class_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.class_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var order_ranks = ko.observableArray();
				_.each(allData.facets.order_rank.terms, function(data) {
					order_ranks.push(new ResumeCount({id: allData.facets.order_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.order_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var families = ko.observableArray();
				_.each(allData.facets.family.terms, function(data) {
					families.push(new ResumeCount({id: allData.facets.family_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.family_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var genuses = ko.observableArray();
				_.each(allData.facets.genus.terms, function(data) {
					genuses.push(new ResumeCount({id: allData.facets.genus_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.genus_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var species = ko.observableArray();
				_.each(allData.facets.species.terms, function(data) {
					species.push(new ResumeCount({id: allData.facets.species_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.species_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
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
				self.resumesInfoFilter.push(new ResumeInfo({canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, countries: countries, departments: departments}));
				$("#contentFiltersContainerHelp").mCustomScrollbar("update");
			});
		},
		getCountriesData: function() {
			var self = this;
			$.getJSON("/occurrences/resume/countries/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
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
				count = 0;
				var kingdoms = ko.observableArray();
				_.each(allData.facets.kingdom.terms, function(data) {
					kingdoms.push(new ResumeCount({id: allData.facets.kingdom_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.kingdom_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var phylums = ko.observableArray();
				_.each(allData.facets.phylum.terms, function(data) {
					phylums.push(new ResumeCount({id: allData.facets.phylum_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.phylum_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var taxonClasses = ko.observableArray();
				_.each(allData.facets.taxonClass.terms, function(data) {
					taxonClasses.push(new ResumeCount({id: allData.facets.class_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.class_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var order_ranks = ko.observableArray();
				_.each(allData.facets.order_rank.terms, function(data) {
					order_ranks.push(new ResumeCount({id: allData.facets.order_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.order_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var families = ko.observableArray();
				_.each(allData.facets.family.terms, function(data) {
					families.push(new ResumeCount({id: allData.facets.family_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.family_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var genuses = ko.observableArray();
				_.each(allData.facets.genus.terms, function(data) {
					genuses.push(new ResumeCount({id: allData.facets.genus_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.genus_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var species = ko.observableArray();
				_.each(allData.facets.species.terms, function(data) {
					species.push(new ResumeCount({id: allData.facets.species_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.species_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var departments = ko.observableArray();
				_.each(allData.facets.department_name.terms, function(data) {
					departments.push(new ResumeCount({id: allData.facets.iso_department_code.terms[count].term, url: "http://data.sibcolombia.net/departments/"+allData.facets.iso_department_code.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				self.resumesInfoFilter.removeAll();
				self.resumesInfoFilter.push(new ResumeInfo({canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, countries: countries, departments: departments}));
				$("#contentFiltersContainerHelp").mCustomScrollbar("update");
			});
		},
		getDepartmentsData: function() {
			var self = this;
			$.getJSON("/occurrences/resume/departments/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
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
				count = 0;
				var kingdoms = ko.observableArray();
				_.each(allData.facets.kingdom.terms, function(data) {
					kingdoms.push(new ResumeCount({id: allData.facets.kingdom_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.kingdom_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var phylums = ko.observableArray();
				_.each(allData.facets.phylum.terms, function(data) {
					phylums.push(new ResumeCount({id: allData.facets.phylum_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.phylum_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var taxonClasses = ko.observableArray();
				_.each(allData.facets.taxonClass.terms, function(data) {
					taxonClasses.push(new ResumeCount({id: allData.facets.class_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.class_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var order_ranks = ko.observableArray();
				_.each(allData.facets.order_rank.terms, function(data) {
					order_ranks.push(new ResumeCount({id: allData.facets.order_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.order_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var families = ko.observableArray();
				_.each(allData.facets.family.terms, function(data) {
					families.push(new ResumeCount({id: allData.facets.family_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.family_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var genuses = ko.observableArray();
				_.each(allData.facets.genus.terms, function(data) {
					genuses.push(new ResumeCount({id: allData.facets.genus_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.genus_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var species = ko.observableArray();
				_.each(allData.facets.species.terms, function(data) {
					species.push(new ResumeCount({id: allData.facets.species_concept_id.terms[count].term, url: "http://data.sibcolombia.net/species/"+allData.facets.species_concept_id.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				count = 0;
				var countries = ko.observableArray();
				_.each(allData.facets.country_name.terms, function(data) {
					countries.push(new ResumeCount({id: allData.facets.iso_country_code.terms[count].term, url: "http://data.sibcolombia.net/countries/"+allData.facets.iso_country_code.terms[count].term, name: data.term, count: data.count}));
					count++;
				});
				self.resumesInfoFilter.removeAll();
				self.resumesInfoFilter.push(new ResumeInfo({canonicals: canonicals, kingdoms: kingdoms, providers: providers, resources: resources, phylums: phylums, taxonClasses: taxonClasses, order_ranks: order_ranks, families: families, genuses: genuses, species: species, countries: countries, departments: departments}));
				$("#contentFiltersContainerHelp").mCustomScrollbar("update");
			});
		}
	});

	return OccurrenceSearchViewModel;
});