function OccurrenceSearchViewModel() {
	// Data
	var self = this;

	self.gridOptions = {
		data: false,
		//data: self.gridItems,
		//schema: { data: self.gridItems, total: initialGridOccurrences.hits.total },
		dataSource: {
			type: "jsonp",
			serverPaging: true,
			serverSorting: true,
			serverFiltering: true,
			allowUnsort: true,
			//height: 500,
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
			//schema: { data: "data", total: "totalOccurrences" }
		},
		filterable: {
			messages: {
				or: "o",
				and: "y",
				info: "Filtrar con condición:",
				filter: "Aplicar filtro",
				clear: "Quitar filtro"
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
		//height: 500,
		reorderable: true,
		resizable: true,
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
		sortable: true,
		groupable: {
			messages: {
				empty: "Arrastre un encabezado de calumna a esta zona para agrupar por dicha columna."
			}
		},
		scrollable: true,
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
    };

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
    };

	var markers = new L.MarkerClusterGroup()
	// Help variables
	self.firstScrollRun = true
	self.detailsFirstScrollRun = true
	self.helpSearchText = ko.observable("<p>Escriba un nombre científico y pulse en Agregar filtro.</p><p>Este filtro devolverá cualquier registro que posea un nombre que concuerde con el identificador dado del organismo, sin importar como está clasificado el organismo.</p>");
	self.totalFilters = ko.observable(0)

	// Basic stats data
	//self.totalOccurrences = ko.observable(totalOccurrences)
	//self.totalGeoOccurrences = ko.observable(totalGeoOccurrences)
	self.totalOccurrences = ko.observable();
	self.totalGeoOccurrences = ko.observable();

	// Arrays for resume help windows
	self.resumeScientificNames = ko.observableArray([])
	self.resumeKingdomNames = ko.observableArray([])
	self.resumePhylumNames = ko.observableArray([])
	self.resumeClassNames = ko.observableArray([])
	self.resumeOrderNames = ko.observableArray([])
	self.resumeFamilyNames = ko.observableArray([])
	self.resumeGenusNames = ko.observableArray([])
	self.resumeSpeciesNames = ko.observableArray([])
	self.resumeDataProviders = ko.observableArray([])
	self.resumeDataResources = ko.observableArray([])
	self.resumeInstitutionCodes = ko.observableArray([])
	self.resumeCollectionCodes = ko.observableArray([])
	self.resumeCountries = ko.observableArray([])
	self.resumeDepartments = ko.observableArray([])
	self.isObjectNameHelpSelected = ko.observable(false)
	self.predicateOptions = ko.observable([{value: 0, name: 'es'}])

	// Arrays of selected filters by kind
	self.selectedScientificNames = ko.observableArray([])
	self.selectedTaxonNames = ko.observableArray([])
	self.selectedCountriesIDs = ko.observableArray([])
	self.selectedDepartmentsIDs = ko.observableArray([])
	self.selectedLatitudes = ko.observableArray([])
	self.selectedLongitudes = ko.observableArray([])
	self.selectedAltitudes = ko.observableArray([])
	self.selectedDeeps = ko.observableArray([])
	self.selectedCoordinate = ko.observableArray([])
	self.selectedProviders = ko.observableArray([])
	self.selectedResources = ko.observableArray([])
	self.selectedDateRanges = ko.observableArray([])
	self.selectedYearRanges = ko.observableArray([])
	self.selectedYears = ko.observableArray([])
	self.selectedMonths = ko.observableArray([])
	self.selectedInstitutionCodes = ko.observableArray([])
	self.selectedCollectionCodes = ko.observableArray([])
	self.selectedCatalogNumbers = ko.observableArray([])

	// Array of current occurrences details
	self.occurrencesDetails = ko.observableArray([])	

	// Filter variables
	self.selectedSubject = ko.observable(0)
	self.selectedPredicate = ko.observable()
	self.objectNameValue = ko.observable()
	self.selectedCountry = ko.observable()
	self.selectedDepartment = ko.observable()
	self.selectedCoordinateState = ko.observable()

	// Selected country filter name
	self.dropDownCountryText = ko.computed(function() {
		return $("#dropDownCountry option[value='" + self.selectedCountry() + "']").text()
	})
	// Selected department filter name
	self.dropDownDepartmentText = ko.computed(function() {
		return $("#dropDownDepartment option[value='" + self.selectedDepartment() + "']").text()
	})
	// Selected department filter name
	self.dropDownCoordinateStateText = ko.computed(function() {
		return $("#dropDownCoordinateState option[value='" + self.selectedCoordinateState() + "']").text()
	})

	/*$.getJSON("/occurrences/list", function(allData) {
		$.each(allData, function(i, occurrence) {
			var marker = new L.Marker(new L.LatLng(occurrence.latitude, occurrence.longitude), { title: occurrence.canonical})
			marker.bindPopup(occurrence.canonical + ' ' + occurrence.num_occurrences)
			markers.addLayer(marker)
		})
		markers.on('click', function (a) {
			if(a.layer._preSpiderfyLatlng) {
				var latitude = a.layer._preSpiderfyLatlng.lat
				var longitude = a.layer._preSpiderfyLatlng.lng
			} else {
				var latitude = a.layer.getLatLng().lat
				var longitude = a.layer.getLatLng().lng
			}
			$.getJSON("/occurrences/details/search?canonical="+a.layer.options.title+"&latitude="+latitude+"&longitude="+longitude, function(allData) {
				var mappedOccurrences = $.map(allData, function(item) {
					return new Occurrence(item)
				})
				self.occurrencesDetails(mappedOccurrences)
				self.disableFilterHelp()
				if($("#occurrenceDetail").is(':hidden')) {
					$("#occurrenceDetail").animate({width: 'toggle'}, 500, "swing", function() {
						if(self.detailsFirstScrollRun) {
							$("#occurrenceDetailContainer").mCustomScrollbar({
								theme:"dark"
							})
							self.detailsFirstScrollRun = false
						} else {
							$("#occurrenceDetailContainer").mCustomScrollbar("update")
						}
					})
				} else {
					$("#occurrenceDetailContainer").mCustomScrollbar("update")
				}
				//$("#contentFiltersContainerHelp").mCustomScrollbar("update")
			})
		})

		var anotherLayers = {
			'Puntos densidad': map.addLayer(markers)
		}
		baseAndFirstOverlays.addOverlay(markers, 'Puntos densidad')
		//L.control.layers({}, anotherLayers).addTo(map)
	})*/

	// Initialize default cell density distribution (one degree)
	var densityCellsOneDegree = new L.FeatureGroup();
	var densityCells2 = new L.FeatureGroup();
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
			var densityCell = new L.rectangle(bounds, {color: color, weight: 1, fill: true, fillOpacity: 0.5});
			densityCell.on('mouseover', function (a) {
				a.target.bindPopup("<strong>No. registros: </strong>" + cell.fields.count + "</br></br><strong>Ubicación:</strong></br>[" + cell.fields.location_cell.lat + ", " + cell.fields.location_cell.lon + "] [" + (cell.fields.location_cell.lat+1) + ", " + (cell.fields.location_cell.lon+1) + "]").openPopup();
			});
			densityCellsOneDegree.addLayer(densityCell);
		});
		self.totalGeoOccurrences(allData.facets.stats.total);
		$("#oneDegreeButton").button('toggle');
		map.addLayer(densityCellsOneDegree);

		/*var anotherLayers = {
			'Distribución 1 grado': map.addLayer(densityCells)
		};*/
		//baseAndFirstOverlays.addOverlay(densityCells, 'Distribución 1 grado');
	});

	/*$.getJSON("/distribution/centidegree/list", function(allData) {
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
			var densityCell = new L.rectangle(bounds, {color: color, weight: 1, fill: true, fillOpacity: 0.5});
			densityCell.on('mouseover', function (a) {
				a.target.bindPopup("<strong>No. registros: </strong>" + cell.fields.count + "</br></br><strong>Ubicación:</strong></br>[" + cell.fields.location_centi_cell.lat + ", " + cell.fields.location_centi_cell.lon + "] [" + (((cell.fields.location_centi_cell.lat*10)+1)/10) + ", " + (((cell.fields.location_centi_cell.lon*10)+1)/10) + "]").openPopup();
			});
			densityCells2.addLayer(densityCell);
		});

		var anotherLayers = {
			'Distribución 0.1 grado': map.addLayer(densityCells2)
		};
		//baseAndFirstOverlays.addOverlay(densityCells2, 'Distribución 0.1 grado');
	});*/

	// Operations
	// Add ScientificName filter
	self.addScientificName = function() {
		self.selectedScientificNames.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: self.objectNameValue(), textName: "ScientificName"}))
		self.totalFilters(self.totalFilters()+1)
	}
	self.addScientificNameFromHelp = function(selectedFilter) {
		self.selectedScientificNames.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.canonical, textName: "ScientificName"}))
		self.totalFilters(self.totalFilters()+1)
	}
	// Removes ScientificName filter
	self.removeScientificName = function(selectedFilter) { 
		self.selectedScientificNames.remove(selectedFilter)
		self.totalFilters(self.totalFilters()-1)
	}
	// Add Taxon filter
	self.addTaxonName = function(id, name) {
		self.selectedTaxonNames.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: self.objectNameValue(), textName: name}))
		self.totalFilters(self.totalFilters()+1)
	}
	self.addTaxonNameFromHelp = function(selectedFilter) {
		if(self.selectedSubject() == 100)
			self.selectedTaxonNames.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.kingdom, textName: "Reino"}))
		if(self.selectedSubject() == 101)
			self.selectedTaxonNames.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.phylum, textName: "Filo"}))
		if(self.selectedSubject() == 102)
			self.selectedTaxonNames.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.nameClass, textName: "Clase"}))
		if(self.selectedSubject() == 103)
			self.selectedTaxonNames.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.order_rank, textName: "Orden"}))
		if(self.selectedSubject() == 104)
			self.selectedTaxonNames.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.family, textName: "Familia"}))
		if(self.selectedSubject() == 105)
			self.selectedTaxonNames.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.genus, textName: "Genero"}))
		if(self.selectedSubject() == 106)
			self.selectedTaxonNames.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.species, textName: "Especie"}))
		self.totalFilters(self.totalFilters()+1)
	}
	// Removes Taxon filter
	self.removeTaxonName = function(selectedFilter) { 
		self.selectedTaxonNames.remove(selectedFilter)
		self.totalFilters(self.totalFilters()-1)
	}
	// Add Country filter
	self.addCountryID = function() {
		self.selectedCountriesIDs.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: self.selectedCountry(), textName: self.dropDownCountryText()}))
		self.totalFilters(self.totalFilters()+1)
	}
	self.addCountryIDFromHelp = function(selectedFilter) {
		self.selectedCountriesIDs.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.isoCountryCode, textName: selectedFilter.countryName}))
		self.totalFilters(self.totalFilters()+1)
	}
	// Removes Country filter
	self.removeCountryID = function(selectedFilter) { 
		self.selectedCountriesIDs.remove(selectedFilter)
		self.totalFilters(self.totalFilters()-1)
	}
	// Add Department filter
	self.addDepartmentID = function() {
		self.selectedDepartmentsIDs.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: self.selectedDepartment(), textName: self.dropDownDepartmentText()}))
		self.totalFilters(self.totalFilters()+1)
	}
	self.addDepartmentIDFromHelp = function(selectedFilter) {
		self.selectedDepartmentsIDs.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.isoDepartmentCode, textName: selectedFilter.departmentName}))
		self.totalFilters(self.totalFilters()+1)
	}
	// Removes Department filter
	self.removeDepartmentID = function(selectedFilter) { 
		self.selectedDepartmentsIDs.remove(selectedFilter)
		self.totalFilters(self.totalFilters()-1)
	}
	// Add Latitude filter
	self.addLatitudeNumber = function() {
		self.selectedLatitudes.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: self.objectNameValue(), textName: "Latitude"}))
		self.totalFilters(self.totalFilters()+1)
	}
	// Removes Latitude filter
	self.removeLatitudeNumber = function(selectedFilter) { 
		self.selectedLatitudes.remove(selectedFilter)
		self.totalFilters(self.totalFilters()-1)
	}
	// Add Longitude filter
	self.addLongitudeNumber = function() {
		self.selectedLongitudes.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: self.objectNameValue(), textName: "Longitude"}))
		self.totalFilters(self.totalFilters()+1)
	}
	// Removes Longitude filter
	self.removeLongitudeNumber = function(selectedFilter) { 
		self.selectedLongitudes.remove(selectedFilter)
		self.totalFilters(self.totalFilters()-1)
	}
	// Add altitude filter
	self.addAltitudeNumber = function() {
		self.selectedAltitudes.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: self.objectNameValue(), textName: "Altitude"}))
		self.totalFilters(self.totalFilters()+1)
	}
	// Removes altitude filter
	self.removeAltitudeNumber = function(selectedFilter) { 
		self.selectedAltitudes.remove(selectedFilter)
		self.totalFilters(self.totalFilters()-1)
	}
	// Add deep filter
	self.addDeepNumber = function() {
		self.selectedDeeps.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: self.objectNameValue(), textName: "Deep"}))
		self.totalFilters(self.totalFilters()+1)
	}
	// Removes deep filter
	self.removeDeepNumber = function(selectedFilter) { 
		self.selectedDeeps.remove(selectedFilter)
		self.totalFilters(self.totalFilters()-1)
	}
	// Add coordinate state filter
	self.addCoordinateState = function() {
		if(self.selectedCoordinate().length == 0)
			self.totalFilters(self.totalFilters()+1)
		self.selectedCoordinate.removeAll()
		self.selectedCoordinate.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: self.selectedCoordinateState(), textName: self.dropDownCoordinateStateText()}))
	}
	// Removes coordinate state filter
	self.removeCoordinateState = function(selectedFilter) { 
		self.selectedCoordinate.remove(selectedFilter)
		self.totalFilters(self.totalFilters()-1)
	}
	// Add data provider name
	self.addDataProviderName = function() {
		self.selectedProviders.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: self.objectNameValue(), textName: "Data provider"}))
		self.totalFilters(self.totalFilters()+1)
	}
	self.addDataProviderNameFromHelp = function(selectedFilter) {
		self.selectedProviders.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.providerName, textName: "Data provider"}))
		self.totalFilters(self.totalFilters()+1)
	}
	// Removes data provider name
	self.removeDataProviderName = function(selectedFilter) { 
		self.selectedProviders.remove(selectedFilter)
		self.totalFilters(self.totalFilters()-1)
	}
	// Add data resource name
	self.addDataResourceName = function() {
		self.selectedResources.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: self.objectNameValue(), textName: "Data resource"}))
		self.totalFilters(self.totalFilters()+1)
	}
	self.addDataResourceNameFromHelp = function(selectedFilter) {
		self.selectedResources.push(new FilterSelected({subject: self.selectedSubject(), predicate: self.selectedPredicate(), textObject: selectedFilter.resourceName, textName: "Data resource"}))
		self.totalFilters(self.totalFilters()+1)
	}
	// Removes data resource name
	self.removeDataResourceName = function(selectedFilter) { 
		self.selectedResources.remove(selectedFilter)
		self.totalFilters(self.totalFilters()-1)
	}

	self.addFilterItem = function() {
		if(self.selectedSubject() == 0) {
			// Adding scientific name filter
			self.addScientificName()
		} else if(self.selectedSubject() == 100) {
			self.addTaxonName(self.selectedSubject(), "Reino")
		} else if(self.selectedSubject() == 101) {
			self.addTaxonName(self.selectedSubject(), "Filo")
		} else if(self.selectedSubject() == 102) {
			self.addTaxonName(self.selectedSubject(), "Clase")
		} else if(self.selectedSubject() == 103) {
			self.addTaxonName(self.selectedSubject(), "Orden")
		} else if(self.selectedSubject() == 104) {
			self.addTaxonName(self.selectedSubject(), "Familia")
		} else if(self.selectedSubject() == 105) {
			self.addTaxonName(self.selectedSubject(), "Género")
		} else if(self.selectedSubject() == 106) {
			self.addTaxonName(self.selectedSubject(), "Especie")
		} else if(self.selectedSubject() == 5) {
			// Adding cuntry filter
			self.addCountryID()
		} else if(self.selectedSubject() == 38) {
			// Adding department filter
			self.addDepartmentID()
		} else if(self.selectedSubject() == 1) {
			// Adding latitude filter
			self.addLatitudeNumber()
		} else if(self.selectedSubject() == 2) {
			// Adding longitude filter
			self.addLongitudeNumber()
		} else if(self.selectedSubject() == 34) {
			// Adding altitude filter
			self.addAltitudeNumber()
		} else if(self.selectedSubject() == 35) {
			// Adding deep filter
			self.addDeepNumber()
		} else if(self.selectedSubject() == 28) {
			// Adding coordinate state filter
			self.addCoordinateState()
		} else if(self.selectedSubject() == 25) {
			// Adding data provider filter
			self.addDataProviderName()
		} else if(self.selectedSubject() == 24) {
			// Adding data resource filter
			self.addDataResourceName()
		}
	}

	self.changeFilterHelp = function() {
		$("#filtersContainerHelp").css({display: 'none'})
		self.isObjectNameHelpSelected = ko.observable(false)
		// Default filters predicate
		self.predicateOptions([{value: 0, name: 'es'}])
		if(self.selectedSubject() == 0) {
			// Get Scientific Name resume data
			self.getScientificNamesData()
		} else if(self.selectedSubject() == 100) {
			// Get kingdom resume data
			self.getKingdomNamesData()
		} else if(self.selectedSubject() == 101) {
			// Get phylum resume data
			self.getPhylumNamesData()
		} else if(self.selectedSubject() == 102) {
			// Get class resume data
			self.getClassNamesData()
		} else if(self.selectedSubject() == 103) {
			// Get order resume data
			self.getOrderNamesData()
		} else if(self.selectedSubject() == 104) {
			// Get family resume data
			self.getFamilyNamesData()
		} else if(self.selectedSubject() == 105) {
			// Get genus resume data
			self.getGenusNamesData()
		} else if(self.selectedSubject() == 106) {
			// Get species resume data
			self.getSpeciesNamesData()
		} else if(self.selectedSubject() == 25) {
			// Get data providers resume data
			self.getDataProvidersData()
		} else if(self.selectedSubject() == 24) {
			// Get data resources resume data
			self.getDataResourcesData()
		} else if(self.selectedSubject() == 12) {
			// Get institution codes resume data
			self.getInstitutionCodesData()
		} else if(self.selectedSubject() == 13) {
			// Get collection codes resume data
			self.getCollectionCodesData()
		} else if(self.selectedSubject() == 1 || self.selectedSubject() == 2 || self.selectedSubject() == 34 || self.selectedSubject() == 35) {
			self.predicateOptions([{value: 0, name: 'es'},{value: 1, name: 'mayor que'},{value: 2, name: 'menor que'}])
		} else if(self.selectedSubject() == 5) {
			// Get countries resume data
			self.getCountriesData()
			self.isObjectNameHelpSelected = ko.observable(true)
			$("#filtersContainerHelp").animate({width: 'toggle'}, 500, "swing", function() {
				if(self.firstScrollRun) {
					$("#contentFiltersContainerHelp").mCustomScrollbar({
						theme:"dark"
					})
					self.firstScrollRun = false
				} else {
					$("#contentFiltersContainerHelp").mCustomScrollbar("update")
				}
			})
		} else if(self.selectedSubject() == 38) {
			// Get countries resume data
			self.getDepartmentsData()
			self.isObjectNameHelpSelected = ko.observable(true)
			$("#filtersContainerHelp").animate({width: 'toggle'}, 500, "swing", function() {
				if(self.firstScrollRun) {
					$("#contentFiltersContainerHelp").mCustomScrollbar({
						theme:"dark"
					})
					self.firstScrollRun = false
				} else {
					$("#contentFiltersContainerHelp").mCustomScrollbar("update")
				}
			})
		}
		self.getHelpSearchText()
	}

	self.enableFilterHelp = function() {
		if((self.isObjectNameHelpSelected() === false || $("#filtersContainerHelp").is(':hidden')) && self.selectedSubject() != 1 && self.selectedSubject() != 2 && self.selectedSubject() != 34 && self.selectedSubject() != 35 && self.selectedSubject() != 21 && self.selectedSubject() != 14) {
			self.isObjectNameHelpSelected = ko.observable(true)
			$("#filtersContainerHelp").animate({width: 'toggle'}, 500, "swing", function() {
				if(self.firstScrollRun) {
					$("#contentFiltersContainerHelp").mCustomScrollbar({
						theme:"dark"
					})
					self.firstScrollRun = false
				} else {
					$("#contentFiltersContainerHelp").mCustomScrollbar("update")
				}
			})
		}
	}

	self.disableFilterHelp = function() {
		if(self.isObjectNameHelpSelected() === true || !$("#filtersContainerHelp").is(':hidden')) {
			self.isObjectNameHelpSelected = ko.observable(false)
			$("#filtersContainerHelp").animate({width: 'toggle'})
		}
	}

	self.disableOccurrencesDetail = function() {
		if(!$("#occurrenceDetail").is(':hidden')) {
			$("#occurrenceDetail").animate({width: 'toggle'})
		}
	}

	// Start search operation
	self.startSearch = function() {
		var response = {}
		if(self.selectedScientificNames().length != 0)
			response['scientificNames'] = self.selectedScientificNames()
		if(self.selectedTaxonNames().length != 0)
			response['taxons'] = self.selectedTaxonNames()
		if(self.selectedCountriesIDs().length != 0)
			response['countries'] = self.selectedCountriesIDs()
		if(self.selectedDepartmentsIDs().length != 0)
			response['departments'] = self.selectedDepartmentsIDs()
		if(self.selectedLatitudes().length != 0)
			response['latitudes'] = self.selectedLatitudes()
		if(self.selectedLongitudes().length != 0)
			response['longitudes'] = self.selectedLongitudes()
		if(self.selectedAltitudes().length != 0)
			response['altitudes'] = self.selectedAltitudes()
		if(self.selectedDeeps().length != 0)
			response['deeps'] = self.selectedDeeps()
		if(self.selectedCoordinate().length != 0)
			response['coordinates'] = self.selectedCoordinate()
		if(self.selectedProviders().length != 0)
			response['providers'] = self.selectedProviders()
		if(self.selectedResources().length != 0)
			response['resources'] = self.selectedResources()
		var data = ko.toJSON(response)
		$.ajax({
			contentType: 'application/json',
			type: 'POST',
			url: '/occurrences/search',
			data: data,
			beforeSend: function() {
				self.disableFilterHelp()
				$(".tab-content").addClass("hide-element");
				$("#map-filter-area").addClass("loading");
			},
			complete: function() {
				$("#map-filter-area").removeClass("loading");
				$(".tab-content").removeClass("hide-element");
			},
			success: function(returnedData) {
				markers.clearLayers()
				var totalGeoOccurrences = 0;
				$.each(returnedData, function(i, geooccurrence) {
					var marker = new L.Marker(new L.LatLng(geooccurrence.latitude, geooccurrence.longitude), { title: geooccurrence.canonical})
					marker.bindPopup(geooccurrence.canonical + ' (' + geooccurrence.num_occurrences + ')')
					markers.addLayer(marker)
					totalGeoOccurrences = totalGeoOccurrences + geooccurrence.num_occurrences
				})
				markers.on('click', function (a) {
					if(a.layer._preSpiderfyLatlng) {
						var latitude = a.layer._preSpiderfyLatlng.lat
						var longitude = a.layer._preSpiderfyLatlng.lng
					} else {
						var latitude = a.layer.getLatLng().lat
						var longitude = a.layer.getLatLng().lng
					}
					$.getJSON("/occurrences/details/search?canonical="+a.layer.options.title+"&latitude="+latitude+"&longitude="+longitude, function(allData) {
						var mappedOccurrences = $.map(allData, function(item) {
							return new Occurrence(item)
						})
						self.occurrencesDetails(mappedOccurrences)
						self.disableFilterHelp()
						if($("#occurrenceDetail").is(':hidden')) {
							$("#occurrenceDetail").animate({width: 'toggle'}, 500, "swing", function() {
								if(self.detailsFirstScrollRun) {
									$("#occurrenceDetailContainer").mCustomScrollbar({
										theme:"dark"
									})
									self.detailsFirstScrollRun = false
								} else {
									$("#occurrenceDetailContainer").mCustomScrollbar("update")
								}
							})
						} else {
							$("#occurrenceDetailContainer").mCustomScrollbar("update")
						}
						//$("#contentFiltersContainerHelp").mCustomScrollbar("update")
					})
				})
				self.totalGeoOccurrences(totalGeoOccurrences)
			},
			dataType: 'jsonp'
		})
	}

	// Event subscription
	self.objectNameValue.subscribe(function (newValue) {
		if(self.selectedSubject() === "0") {
			// Load new scientific name data
			self.getScientificNamesData()
		} else if(self.selectedSubject() == 100) {
			// Get resume kingdom data
			self.getKingdomNamesData()
		} else if(self.selectedSubject() == 101) {
			// Get resume phylum data
			self.getPhylumNamesData()
		} else if(self.selectedSubject() == 102) {
			// Get resume class data
			self.getClassNamesData()
		} else if(self.selectedSubject() == 103) {
			// Get resume order data
			self.getOrderNamesData()
		} else if(self.selectedSubject() == 104) {
			// Get resume family data
			self.getFamilyNamesData()
		} else if(self.selectedSubject() == 105) {
			// Get resume genus data
			self.getGenusNamesData()
		} else if(self.selectedSubject() == 106) {
			// Get resume species data
			self.getSpeciesNamesData()
		} else if(self.selectedSubject() == 25) {
			// Get resume data providers data
			self.getDataProvidersData()
		} else if(self.selectedSubject() == 24) {
			// Get resume data resources data
			self.getDataResourcesData()
		} else if(self.selectedSubject() == 12) {
			// Get institution codes data
			self.getInstitutionCodesData()
		} else if(self.selectedSubject() == 13) {
			// Get collection codes data
			self.getCollectionCodesData()
		}
	})

	// Ajax get data functions
	self.getScientificNamesData = function() {
		$.getJSON("/occurrences/resume/scientificname/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
			var mappedScientificNames = $.map(allData, function(item) {
				return new ResumeScientificName(item)
			})
			self.resumeScientificNames(mappedScientificNames)
			$("#contentFiltersContainerHelp").mCustomScrollbar("update")
		})
	}
	self.getKingdomNamesData = function() {
		$.getJSON("/occurrences/resume/kingdom/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
			var mappedKingdomNames = $.map(allData, function(item) {
				return new ResumeKingdomName(item)
			})
			self.resumeKingdomNames(mappedKingdomNames)
			$("#contentFiltersContainerHelp").mCustomScrollbar("update")
		})
	}
	self.getPhylumNamesData = function() {
		$.getJSON("/occurrences/resume/phylum/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
			var mappedPhylumNames = $.map(allData, function(item) {
				return new ResumePhylumName(item)
			})
			self.resumePhylumNames(mappedPhylumNames)
			$("#contentFiltersContainerHelp").mCustomScrollbar("update")
		})
	}
	self.getClassNamesData = function() {
		$.getJSON("/occurrences/resume/class/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
			var mappedClassNames = $.map(allData, function(item) {
				return new ResumeClassName(item)
			})
			self.resumeClassNames(mappedClassNames)
			$("#contentFiltersContainerHelp").mCustomScrollbar("update")
		})
	}
	self.getOrderNamesData = function() {
		$.getJSON("/occurrences/resume/order/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
			var mappedOrderNames = $.map(allData, function(item) {
				return new ResumeOrderName(item)
			})
			self.resumeOrderNames(mappedOrderNames)
			$("#contentFiltersContainerHelp").mCustomScrollbar("update")
		})
	}
	self.getFamilyNamesData = function() {
		$.getJSON("/occurrences/resume/family/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
			var mappedFamilyNames = $.map(allData, function(item) {
				return new ResumeFamilyName(item)
			})
			self.resumeFamilyNames(mappedFamilyNames)
			$("#contentFiltersContainerHelp").mCustomScrollbar("update")
		})
	}
	self.getGenusNamesData = function() {
		$.getJSON("/occurrences/resume/genus/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
			var mappedGenusNames = $.map(allData, function(item) {
				return new ResumeGenusName(item)
			})
			self.resumeGenusNames(mappedGenusNames)
			$("#contentFiltersContainerHelp").mCustomScrollbar("update")
		})
	}
	self.getSpeciesNamesData = function() {
		$.getJSON("/occurrences/resume/species/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
			var mappedSpeciesNames = $.map(allData, function(item) {
				return new ResumeSpeciesName(item)
			})
			self.resumeSpeciesNames(mappedSpeciesNames)
			$("#contentFiltersContainerHelp").mCustomScrollbar("update")
		})
	}
	self.getDataProvidersData = function() {
		$.getJSON("/occurrences/resume/dataproviders/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
			var mappedDataProviders = $.map(allData, function(item) {
				return new ResumeDataProviders(item)
			})
			self.resumeDataProviders(mappedDataProviders)
			$("#contentFiltersContainerHelp").mCustomScrollbar("update")
		})
	}
	self.getDataResourcesData = function() {
		$.getJSON("/occurrences/resume/dataresources/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
			var mappedDataResources = $.map(allData, function(item) {
				return new ResumeDataResources(item)
			})
			self.resumeDataResources(mappedDataResources)
			$("#contentFiltersContainerHelp").mCustomScrollbar("update")
		})
	}
	self.getCollectionCodesData = function() {
		$.getJSON("/occurrences/resume/collectioncodes/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
			var mappedCollectionCodes = $.map(allData, function(item) {
				return new ResumeCollectionCodes(item)
			})
			self.resumeCollectionCodes(mappedCollectionCodes)
			$("#contentFiltersContainerHelp").mCustomScrollbar("update")
		})
	}
	self.getInstitutionCodesData = function() {
		$.getJSON("/occurrences/resume/institutioncodes/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
			var mappedInstitutionCodes = $.map(allData, function(item) {
				return new ResumeInstitutionCodes(item)
			})
			self.resumeInstitutionCodes(mappedInstitutionCodes)
			$("#contentFiltersContainerHelp").mCustomScrollbar("update")
		})
	}
	self.getCountriesData = function() {
		$.getJSON("/occurrences/resume/countries/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
			var mappedCountries = $.map(allData, function(item) {
				return new ResumeCountries(item)
			})
			self.resumeCountries(mappedCountries)
			$("#contentFiltersContainerHelp").mCustomScrollbar("update")
		})
	}
	self.getDepartmentsData = function() {
		$.getJSON("/occurrences/resume/departments/name/"+((typeof self.objectNameValue() === "undefined")?"":self.objectNameValue()), function(allData) {
			var mappedDepartments = $.map(allData, function(item) {
				return new ResumeDepartments(item)
			})
			self.resumeDepartments(mappedDepartments)
			$("#contentFiltersContainerHelp").mCustomScrollbar("update")
		})
	}
	self.getHelpSearchText = function() {
		$.getJSON("/occurrences/searchhelptext/name/"+self.selectedSubject(), function(allData) {
			self.helpSearchText(allData.text)
		})
	}

	// Start search operation
	self.toggleDistribution = function(data, event) {
		console.log(data);
		console.log(event);
	};


	// Initialize default markercluster layer
	/*var markers = new L.MarkerClusterGroup()
	$.each(occurrences, function(i, occurrence) {
		var marker = new L.Marker(new L.LatLng(occurrence.latitude, occurrence.longitude), { title: occurrence.canonical})
		marker.bindPopup(occurrence.canonical + ' ' + occurrence.num_occurrences)
		markers.addLayer(marker)
	})

	markers.on('click', function (a) {
		if(a.layer._preSpiderfyLatlng) {
			var latitude = a.layer._preSpiderfyLatlng.lat
			var longitude = a.layer._preSpiderfyLatlng.lng
		} else {
			var latitude = a.layer.getLatLng().lat
			var longitude = a.layer.getLatLng().lng
		}
		$.getJSON("/occurrences/details/search?canonical="+a.layer.options.title+"&latitude="+latitude+"&longitude="+longitude, function(allData) {
			var mappedOccurrences = $.map(allData, function(item) {
				return new Occurrence(item)
			})
			self.occurrencesDetails(mappedOccurrences)
			self.disableFilterHelp()
			if($("#occurrenceDetail").is(':hidden')) {
				$("#occurrenceDetail").animate({width: 'toggle'}, 500, "swing", function() {
					if(self.detailsFirstScrollRun) {
						$("#occurrenceDetailContainer").mCustomScrollbar({
							theme:"dark"
						})
						self.detailsFirstScrollRun = false
					} else {
						$("#occurrenceDetailContainer").mCustomScrollbar("update")
					}
				})
			} else {
				$("#occurrenceDetailContainer").mCustomScrollbar("update")
			}
			//$("#contentFiltersContainerHelp").mCustomScrollbar("update")
		})
	})

	var anotherLayers = {
		'Puntos densidad': map.addLayer(markers)
	}
	L.control.layers(anotherLayers).addTo(map)*/
}

ko.applyBindings(new OccurrenceSearchViewModel(), $("#map-filter-area")[0])