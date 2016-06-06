// Editable data
// Filter data
function Filter(data) {
	this.subject = data.subject
	this.predicate = data.predicate
	this.objectName = data.objectName
}

function Occurrence(data) {
	this.id = data.id;
	this.canonical = data.canonical;
	this.latitude = data.latitude;
	this.longitude = data.longitude;
	this.data_provider_id = data.data_provider_id;
	this.data_provider_name = data.data_provider_name;
	this.data_resource_id = data.data_resource_id;
	this.data_resource_name = data.data_resource_name;
	this.institution_code_id = data.institution_code_id;
	this.institution_code = data.institution_code;
	this.collection_code_id = data.collection_code_id;
	this.collection_code = data.collection_code;
	this.catalogue_number_id = data.catalogue_number_id;
	this.catalogue_number = data.catalogue_number;
	this.created = data.created;
	this.occurrence_date = data.occurrence_date;
	this.iso_country_code = data.iso_country_code;
	this.iso_department_code = data.iso_department_code;
	this.country_name = data.country_name;
	this.department_name = data.department_name;
	this.altitude_metres = data.altitude_metres;
	this.depth_centimetres = data.depth_centimetres;
	this.kingdom = data.kingdom;
	this.phylum = data.phylum;
	this.taxonClass = data.taxonClass;
	this.order_rank = data.order_rank;
	this.family = data.family;
	this.genus = data.genus;
	this.species = data.species;
	this.basis_of_record_name_spanish = data.basis_of_record_name_spanish;

	this.url = ko.computed(function() {
		return "http://maps.sibcolombia.net/occurrences/"+this.id;
	}, this);

	this.fullSpecieName = ko.computed(function() {
		if(this.species)
			return this.genus+" "+this.species;
		return "";
	}, this);

	this.location = ko.computed(function() {
		if(this.latitude)
			return "Lat: "+this.latitude+", Lon: "+this.longitude;
		return "";
	}, this);

	this.canonicalWithURL = ko.computed(function() {
		if(this.canonical)
			return "<a href=\"http://maps.sibcolombia.net/occurrences/"+this.id+"\">"+this.canonical+"</a>";
		return "";
	}, this);
}

// ScientificName resume
function ResumeScientificName(data) {
	this.canonical = data.canonical
	this.occurrences = data.occurrences

	this.canonicalWithBold = ko.computed(function() {
		if($("#statesInput").val()) {
			var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' )
			return this.canonical.replace(regex, "<strong>$1</strong>")
		} else {
			return this.canonical
		}
	}, this)
}

// KingdomNames resume
function ResumeKingdomName(data) {
	this.kingdom = data.kingdom
	this.occurrences = data.occurrences

	this.kingdomWithBold = ko.computed(function() {
		if($("#statesInput").val()) {
			var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' )
			return this.kingdom.replace(regex, "<strong>$1</strong>")
		} else {
			return this.kingdom
		}
	}, this)
}

// PhylumNames resume
function ResumePhylumName(data) {
	this.phylum = data.phylum
	this.occurrences = data.occurrences

	this.phylumWithBold = ko.computed(function() {
		if($("#statesInput").val()) {
			var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' )
			return this.phylum.replace(regex, "<strong>$1</strong>")
		} else {
			return this.phylum
		}
	}, this)
}

// ClassNames resume
function ResumeClassName(data) {
	this.nameClass = data.nameClass
	this.occurrences = data.occurrences

	this.nameClassWithBold = ko.computed(function() {
		if($("#statesInput").val()) {
			var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' )
			return this.nameClass.replace(regex, "<strong>$1</strong>")
		} else {
			return this.nameClass
		}
	}, this)
}

// OrderRankNames resume
function ResumeOrderName(data) {
	this.order_rank = data.order_rank
	this.occurrences = data.occurrences

	this.order_rankWithBold = ko.computed(function() {
		if($("#statesInput").val()) {
			var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' )
			return this.order_rank.replace(regex, "<strong>$1</strong>")
		} else {
			return this.order_rank
		}
	}, this)
}

// FamilyNames resume
function ResumeFamilyName(data) {
	this.family = data.family
	this.occurrences = data.occurrences

	this.familyWithBold = ko.computed(function() {
		if($("#statesInput").val()) {
			var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' )
			return this.family.replace(regex, "<strong>$1</strong>")
		} else {
			return this.family
		}
	}, this)
}

// GenusNames resume
function ResumeGenusName(data) {
	this.genus = data.genus
	this.occurrences = data.occurrences

	this.genusWithBold = ko.computed(function() {
		if($("#statesInput").val()) {
			var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' )
			return this.genus.replace(regex, "<strong>$1</strong>")
		} else {
			return this.genus
		}
	}, this)
}

// SpeciesNames resume
function ResumeSpeciesName(data) {
	this.species = data.species
	this.occurrences = data.occurrences

	this.speciesWithBold = ko.computed(function() {
		if($("#statesInput").val()) {
			var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' )
			return this.species.replace(regex, "<strong>$1</strong>")
		} else {
			return this.species
		}
	}, this)
}

// DataProviders resume
function ResumeDataProviders(data) {
	this.providerName = data.providerName
	this.providerID = data.providerID
	this.occurrences = data.occurrences

	this.providerNameWithBold = ko.computed(function() {
		if($("#statesInput").val()) {
			var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' )
			return this.providerName.replace(regex, "<strong>$1</strong>")
		} else {
			return this.providerName
		}
	}, this)
}

// DataResources resume
function ResumeDataResources(data) {
	this.resourceName = data.resourceName
	this.resourceID = data.resourceID
	this.providerID = data.providerID
	this.occurrences = data.occurrences

	this.resourceNameWithBold = ko.computed(function() {
		if($("#statesInput").val()) {
			var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' )
			return this.resourceName.replace(regex, "<strong>$1</strong>")
		} else {
			return this.resourceName
		}
	}, this)
}

// InstitutionCodes resume
function ResumeInstitutionCodes(data) {
	this.institutionCode = data.institutionCode
	this.institutionCodeID = data.institutionCodeID
	this.occurrences = data.occurrences

	this.institutionCodeWithBold = ko.computed(function() {
		if($("#statesInput").val()) {
			var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' )
			return this.institutionCode.replace(regex, "<strong>$1</strong>")
		} else {
			return this.institutionCode
		}
	}, this)
}

// CollectionCodes resume
function ResumeCollectionCodes(data) {
	this.collectionCode = data.collectionCode
	this.collectionCodeID = data.collectionCodeID
	this.occurrences = data.occurrences

	this.collectionCodeWithBold = ko.computed(function() {
		if($("#statesInput").val()) {
			var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' )
			return this.collectionCode.replace(regex, "<strong>$1</strong>")
		} else {
			return this.collectionCode
		}
	}, this)
}

// Countries resume
function ResumeCountries(data) {
	this.countryName = data.countryName
	this.isoCountryCode = data.isoCountryCode
	this.occurrences = data.occurrences

	this.countryNameWithBold = ko.computed(function() {
		if($("#statesInput").val()) {
			var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' )
			return this.countryName.replace(regex, "<strong>$1</strong>")
		} else {
			return this.countryName
		}
	}, this)
}

// Departments resume
function ResumeDepartments(data) {
	this.departmentName = data.departmentName
	this.isoDepartmentCode = data.isoDepartmentCode
	this.occurrences = data.occurrences

	this.departmentNameWithBold = ko.computed(function() {
		if($("#statesInput").val()) {
			var regex = new RegExp( '(' + $("#statesInput").val() + ')', 'gi' )
			return this.departmentName.replace(regex, "<strong>$1</strong>")
		} else {
			return this.departmentName
		}
	}, this)
}

// Current selected filter
function FilterSelected(data) {
	this.subject = data.subject
	this.predicate = data.predicate
	this.textName = data.textName
	this.textObject = data.textObject

	this.parsedLatitudeText = ko.computed(function() {
		var value = parseFloat(this.textObject)
		if (value >= 0) {
			return value + " Norte"
		} else {
			return (value*-1) + " Sur"
		}
	}, this)

	this.parsedLongitudeText = ko.computed(function() {
		var value = parseFloat(this.textObject)
		if (value >= 0) {
			return value + " Este"
		} else {
			return (value*-1) + " Oeste"
		}
	}, this)

	this.parsedAltitudeText = ko.computed(function() {
		return this.textObject + "m"
	}, this)

	this.parsedDeepText = ko.computed(function() {
		return this.textObject + "m"
	}, this)
}