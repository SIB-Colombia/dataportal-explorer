kendo.culture("es-CO");

$(function() {
	$("#filterZone").draggable({handle: "#top-filterZone"});
});
  
$(".minimize-maximize-button").click(function() {
	if($("#filtersContainer").is(':visible')) {
		$("#filterZone").removeClass("open")
	} else {
		$("#filterZone").addClass("open");
	}
	$("#filtersContainer").slideToggle();
	$("#filtersContainerHelp").css({display: 'none'});

});

$("#mapa").height($(window).height()-$("#header").height()-53);
$(window).resize(function(){
	$("#mapa").height($(window).height()-$("#header").height()-53);
});

var cmAttr = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';
var cmUrl = 'http://{s}.tile.cloudmade.com/83ad4e2c1ff74ab78a23d7d249673c39/{styleId}/256/{z}/{x}/{y}.png';
	
var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmUrlCycle='http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png';
var osmAttrib='Map data © OpenStreetMap contributors';
var osmCycleAttrib='Map data © OpenCycleMap contributors';
var mapQuest='http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.png';
var mapQuestAttrib='Map data © Mapquest contributors';

var googleTerrain = new L.Google('TERRAIN');
var googleRoadmap = new L.Google('ROADMAP');
var googleSatellite = new L.Google('SATELLITE');
var googleHibrido = new L.Google('HYBRID');
var bingAereo = new L.BingLayer("Aj1S-ygOy4XFeEGY4GhvY9ydALrxiuRv6X4s0-yQwavRTzR1NQObd8DpGYyN-gJS");
var bingRoads = new L.BingLayer("Aj1S-ygOy4XFeEGY4GhvY9ydALrxiuRv6X4s0-yQwavRTzR1NQObd8DpGYyN-gJS", {type: 'Road'});
var bingAerialWithLabels = new L.BingLayer("Aj1S-ygOy4XFeEGY4GhvY9ydALrxiuRv6X4s0-yQwavRTzR1NQObd8DpGYyN-gJS", {type: 'AerialWithLabels'});
var openStreetMap = L.tileLayer(osmUrl, {attribution: osmAttrib});
var openStreetMapCycle = L.tileLayer(osmUrlCycle, {attribution: osmCycleAttrib});
var openMapQuest = L.tileLayer(mapQuest, {attribution: osmCycleAttrib, type: 'osm', subdomains: '1234'});
var minimal = L.tileLayer(cmUrl, {styleId: 997, attribution: cmAttr});
var midnight = L.tileLayer(cmUrl, {styleId: 999,   attribution: cmAttr});

// Servicio WMS del INVEMAR del Mapa Ecosistemas Continentales Costeros y Marinos 1:500.000 MECCM500k 
var invemarEcoregiones = L.tileLayer.wms("http://gis.invemar.org.co/arcgis/services/MECCM/1_TM_MECCM500k_EcosistemasMarinoCosteros/MapServer/WMSServer", 
	{
		layers: 'Ecorregiones',
		format: 'image/png',
		transparent: true,
		attribution: "Fuente: Invemar - Colombia"
	}
);
var invemarAreaRegimenComun = L.tileLayer.wms("http://gis.invemar.org.co/arcgis/services/MECCM/1_TM_MECCM500k_EcosistemasMarinoCosteros/MapServer/WMSServer", 
	{
		layers: 'Área de régimen común',
		format: 'image/png',
		transparent: true,
		attribution: "Fuente: Invemar - Colombia"
	}
);
var invemarLimiteDepartamental = L.tileLayer.wms("http://gis.invemar.org.co/arcgis/services/MECCM/1_TM_MECCM500k_EcosistemasMarinoCosteros/MapServer/WMSServer", 
	{
		layers: 'Límite departamental',
		format: 'image/png',
		transparent: true,
		attribution: "Fuente: Invemar - Colombia"
	}
);
var invemarEcozonas = L.tileLayer.wms("http://gis.invemar.org.co/arcgis/services/MECCM/1_TM_MECCM500k_EcosistemasMarinoCosteros/MapServer/WMSServer", 
	{
		layers: 'Ecozonas',
		format: 'image/png',
		transparent: true,
		attribution: "Fuente: Invemar - Colombia"
	}
);
var invemarEcosistemasCosteros = L.tileLayer.wms("http://gis.invemar.org.co/arcgis/services/MECCM/1_TM_MECCM500k_EcosistemasMarinoCosteros/MapServer/WMSServer", 
	{
		layers: 'Ecosistemas Costeros',
		format: 'image/png',
		transparent: true,
		attribution: "Fuente: Invemar - Colombia"
	}
);

// WMS Server GeoSIB
var humboldtComplejosParamos = L.tileLayer.wms("http://hermes.humboldt.org.co/visoruniversal2010/php/amfphp/services/com/gkudos/WmsService.php", 
	{
		layers: 'ComplejosParamos2012',
		format: 'image/png',
		transparent: true,
		attribution: "Fuente: Instituto Alexander Von Humboldt - Colombia",
		srs: 'EPSG:4326',
	}
);
var humboldtGrilla = L.tileLayer.wms("http://hermes.humboldt.org.co/visoruniversal2010/php/amfphp/services/com/gkudos/WmsService.php", 
	{
		layers: 'Grilla',
		format: 'image/png',
		transparent: true,
		attribution: "Fuente: Instituto Alexander Von Humboldt - Colombia",
		srs: 'EPSG:4326',
	}
);
var humboldtEmbalses = L.tileLayer.wms("http://hermes.humboldt.org.co/visoruniversal2010/php/amfphp/services/com/gkudos/WmsService.php", 
	{
		layers: 'embalse',
		format: 'image/png',
		transparent: true,
		attribution: "Fuente: Instituto Alexander Von Humboldt - Colombia",
		srs: 'EPSG:4326',
	}
);
var humboldtAreasProtegidasRunap = L.tileLayer.wms("http://hermes.humboldt.org.co/visoruniversal2010/php/amfphp/services/com/gkudos/WmsService.php", 
	{
		layers: 'AreasProtegidas_RUNAP',
		format: 'image/png',
		transparent: true,
		attribution: "Fuente: Instituto Alexander Von Humboldt - Colombia",
		srs: 'EPSG:4326',
	}
);
var humboldtLagunas = L.tileLayer.wms("http://hermes.humboldt.org.co/visoruniversal2010/php/amfphp/services/com/gkudos/WmsService.php", 
	{
		layers: 'laguna',
		format: 'image/png',
		transparent: true,
		attribution: "Fuente: Instituto Alexander Von Humboldt - Colombia",
		srs: 'EPSG:4326',
	}
);
var humboldtCentrosPoblados = L.tileLayer.wms("http://hermes.humboldt.org.co/visoruniversal2010/php/amfphp/services/com/gkudos/WmsService.php", 
	{
		layers: 'centros_poblados',
		format: 'image/png',
		transparent: true,
		attribution: "Fuente: Instituto Alexander Von Humboldt - Colombia",
		srs: 'EPSG:4326',
	}
);
var humboldtCuencasHidrograficas = L.tileLayer.wms("http://hermes.humboldt.org.co/visoruniversal2010/php/amfphp/services/com/gkudos/WmsService.php", 
	{
		layers: 'cuencas_hidrograficas',
		format: 'image/png',
		transparent: true,
		attribution: "Fuente: Instituto Alexander Von Humboldt - Colombia",
		srs: 'EPSG:4326',
	}
);
var humboldtCars = L.tileLayer.wms("http://hermes.humboldt.org.co/visoruniversal2010/php/amfphp/services/com/gkudos/WmsService.php", 
	{
		layers: 'Jurisdiccion_CARs',
		format: 'image/png',
		transparent: true,
		attribution: "Fuente: Instituto Alexander Von Humboldt - Colombia",
		srs: 'EPSG:4326',
	}
);
var humboldtParquesNacionalesNaturales = L.tileLayer.wms("http://hermes.humboldt.org.co/visoruniversal2010/php/amfphp/services/com/gkudos/WmsService.php", 
	{
		layers: 'ParquesNacionalesNaturales',
		format: 'image/png',
		transparent: true,
		attribution: "Fuente: Instituto Alexander Von Humboldt - Colombia",
		srs: 'EPSG:4326',
	}
);
var humboldtAicas = L.tileLayer.wms("http://hermes.humboldt.org.co/visoruniversal2010/php/amfphp/services/com/gkudos/WmsService.php", 
	{
		layers: 'aicas',
		format: 'image/png',
		transparent: true,
		attribution: "Fuente: Instituto Alexander Von Humboldt - Colombia",
		srs: 'EPSG:4326',
	}
);
var humboldtEcosistemasGenerales = L.tileLayer.wms("http://hermes.humboldt.org.co/visoruniversal2010/php/amfphp/services/com/gkudos/WmsService.php", 
	{
		layers: 'ecosistemas_generales',
		format: 'image/png',
		transparent: true,
		attribution: "Fuente: Instituto Alexander Von Humboldt - Colombia",
		srs: 'EPSG:4326',
	}
);
var humboldtResguardosIndigenas = L.tileLayer.wms("http://hermes.humboldt.org.co/visoruniversal2010/php/amfphp/services/com/gkudos/WmsService.php", 
	{
		layers: 'resguardos_indigenas',
		format: 'image/png',
		transparent: true,
		attribution: "Fuente: Instituto Alexander Von Humboldt - Colombia",
		srs: 'EPSG:4326',
	}
);
var humboldtComunidadesAfro = L.tileLayer.wms("http://hermes.humboldt.org.co/visoruniversal2010/php/amfphp/services/com/gkudos/WmsService.php", 
	{
		layers: 'comunidades_negras',
		format: 'image/png',
		transparent: true,
		attribution: "Fuente: Instituto Alexander Von Humboldt - Colombia",
		srs: 'EPSG:4326',
	}
);
var gbifGrid = L.tileLayer.wms("http://data.sibcolombia.net/geoserver/wms", 
	{
		layers: 'gbif:country_borders,gbif:tabDensityLayer',
		format: 'image/png',
		transparent: true,
		attribution: "GBIF, Density layer",
		srs: 'EPSG:4326',
		filter: '()(<Filter><PropertyIsEqualTo><PropertyName>url</PropertyName><Literal><![CDATA[http://50.19.34.70/maplayer/country/48]]></Literal></PropertyIsEqualTo></Filter>)()()'
	}
);

/* Disabled baseLayers
"Cloudmate": minimal,
"Cloud mate vision nocturna": midnight,
"OpenStreetMap Default": L.tileLayer.provider('OpenStreetMap.Mapnik'),
"OpenStreetMap German Style": L.tileLayer.provider('OpenStreetMap.DE'),
"OpenStreetMap Black and White": L.tileLayer.provider('OpenStreetMap.BlackAndWhite'),
"Thunderforest OpenCycleMap": L.tileLayer.provider('Thunderforest.OpenCycleMap'),
"Thunderforest Transport": L.tileLayer.provider('Thunderforest.Transport'),
"Thunderforest Landscape": L.tileLayer.provider('Thunderforest.Landscape'),
"MapQuest OSM": L.tileLayer.provider('MapQuestOpen.OSM'),
"MapQuest Aerial": L.tileLayer.provider('MapQuestOpen.Aerial'),
"MapBox Example": L.tileLayer.provider('MapBox.examples.map-zr0njcqy'),
"Stamen Toner": L.tileLayer.provider('Stamen.Toner'),
"Stamen Terrain": L.tileLayer.provider('Stamen.Terrain'),
"Esri WorldStreetMap": L.tileLayer.provider('Esri.WorldStreetMap'),
"Esri DeLorme": L.tileLayer.provider('Esri.DeLorme'),
"Esri WorldTopoMap": L.tileLayer.provider('Esri.WorldTopoMap'),
"Esri WorldImagery": L.tileLayer.provider('Esri.WorldImagery'),
"Esri WorldTerrain": L.tileLayer.provider('Esri.WorldTerrain'),
"Esri WorldShadedRelief": L.tileLayer.provider('Esri.WorldShadedRelief'),
"Nokia Terrain": L.tileLayer.provider('Nokia.terrainDay'),
"Nokia Satellite": L.tileLayer.provider('Nokia.satelliteNoLabelsDay'),
"Nokia Satellite (Labeled)": L.tileLayer.provider('Nokia.satelliteYesLabelsDay'),
"Nokia Normal Day": L.tileLayer.provider('Nokia.normalDay'),
"Nokia Normal Day Grey": L.tileLayer.provider('Nokia.normalGreyDay'),
"Esri WorldPhysical": L.tileLayer.provider('Esri.WorldPhysical'),
"Esri OceanBasemap": L.tileLayer.provider('Esri.OceanBasemap'),
"Esri NatGeoWorldMap": L.tileLayer.provider('Esri.NatGeoWorldMap'),
"Esri WorldGrayCanvas": L.tileLayer.provider('Esri.WorldGrayCanvas')
*/
	
var baseLayers = {
	'Google terreno': googleTerrain,
	'Google mapa carreteras': googleRoadmap,
	'Google satélite': googleSatellite,
	'Google híbrido': googleHibrido,
	'Bing aereo': bingAereo,
	'Bing mapa carreteras': bingRoads,
	'Bing aereo con etiquetas': bingAerialWithLabels,
	"Stamen Watercolor": L.tileLayer.provider('Stamen.Watercolor'),
	"Acetate": L.tileLayer.provider('Acetate.all')
};
	
var map = L.map('mapa', {
	center: [4.781505, -79.804687],
	zoom: 6,
	layers: [googleTerrain],
	crs: L.CRS.EPSG4326,
});

var wmsLayers = {
	'Invemar: Ecorregiones': invemarEcoregiones,
	'Invemar: Ecozonas': invemarEcozonas,
	'Invemar: Ecosistemas costeros': invemarEcosistemasCosteros,
	'Invemar: Área de régimen común': invemarAreaRegimenComun,
	'Invemar: Límite departamental': invemarLimiteDepartamental,
	'IAVH: Complejos páramos': humboldtComplejosParamos,
	'IAVH: Grilla': humboldtGrilla,
	'IAVH: Embalses': humboldtEmbalses,
	'IAVH: Áreas protegidas - RUNAP': humboldtAreasProtegidasRunap,
	'IAVH: Lagunas': humboldtLagunas,
	'IAVH: Centros poblados': humboldtCentrosPoblados,
	'IAVH: Cuencas hidrográficas': humboldtCuencasHidrograficas,
	'IAVH: Jurisdicciones CAR': humboldtCars,
	'IAVH: Parques nacionales naturales': humboldtParquesNacionalesNaturales,
	'IAVH: AICAS': humboldtAicas,
	'IAVH: Ecosistemas generales': humboldtEcosistemasGenerales,
	'IAVH: Resguardos indígenas': humboldtResguardosIndigenas,
	'IAVH: Comunidades afrodescendientes': humboldtComunidadesAfro,
	"OpenWeatherMap: Clouds": L.tileLayer.provider('OpenWeatherMap.Clouds'),
	"OpenWeatherMap: CloudsClassic": L.tileLayer.provider('OpenWeatherMap.CloudsClassic'),
	"OpenWeatherMap: Precipitation": L.tileLayer.provider('OpenWeatherMap.Precipitation'),
	'GBIF: Density layer': gbifGrid
}

// From new GBIF web site
// The map layers can be controlled
var LAYER_OBSERVATION = ["OBS_NO_YEAR","OBS_PRE_1900","OBS_1900_1910","OBS_1910_1920","OBS_1920_1930","OBS_1930_1940","OBS_1940_1950","OBS_1950_1960","OBS_1960_1970","OBS_1970_1980","OBS_1980_1990","OBS_1990_2000","OBS_2000_2010","OBS_2010_2020"];
var LAYER_LIVING = ["LIVING"];
var LAYER_FOSSIL = ["FOSSIL"];
var LAYER_SPECIMEN = ["SP_NO_YEAR","SP_PRE_1900","SP_1900_1910","SP_1910_1920","SP_1920_1930","SP_1930_1940","SP_1940_1950","SP_1950_1960","SP_1960_1970","SP_1970_1980","SP_1980_1990","SP_1990_2000","SP_2000_2010","SP_2010_2020"];
var LAYER_OTHER = ["OTH_NO_YEAR","OTH_PRE_1900","OTH_1900_1910","OTH_1910_1920","OTH_1920_1930","OTH_1930_1940","OTH_1940_1950","OTH_1950_1960","OTH_1960_1970","OTH_1970_1980","OTH_1980_1990","OTH_1990_2000","OTH_2000_2010","OTH_2010_2020"];
var LAYER_ALL = [
  "OBS_NO_YEAR","OBS_PRE_1900","OBS_1900_1910","OBS_1910_1920","OBS_1920_1930","OBS_1930_1940","OBS_1940_1950","OBS_1950_1960","OBS_1960_1970","OBS_1970_1980","OBS_1980_1990","OBS_1990_2000","OBS_2000_2010","OBS_2010_2020",
  "LIVING",
  "FOSSIL",
  "SP_NO_YEAR","SP_PRE_1900","SP_1900_1910","SP_1910_1920","SP_1920_1930","SP_1930_1940","SP_1940_1950","SP_1950_1960","SP_1960_1970","SP_1970_1980","SP_1980_1990","SP_1990_2000","SP_2000_2010","SP_2010_2020",
  "OTH_NO_YEAR","OTH_PRE_1900","OTH_1900_1910","OTH_1910_1920","OTH_1920_1930","OTH_1930_1940","OTH_1940_1950","OTH_1950_1960","OTH_1960_1970","OTH_1970_1980","OTH_1980_1990","OTH_1990_2000","OTH_2000_2010","OTH_2010_2020"  
];

var overlays = {
};

// builds the layer parameters from the input array
function _buildLayer(layers) {
	var s="";
	$.each(layers, function() {
		s += "&layer=" + this;
	});
	return s;
};

function _initDensityMap(key, type) {
	var gbifUrl = 'http://api.gbif.org/map' + '/density/tile?key=' + key + '&x={x}&y={y}&z={z}&type=' + type,
		l_all    = gbifUrl+ _buildLayer(LAYER_ALL) + "&palette=yellow_reds",
		l_obs    = gbifUrl+ _buildLayer(LAYER_OBSERVATION)  + "&palette=blues",
		l_liv    = gbifUrl+ _buildLayer(LAYER_LIVING)  + "&palette=greens",
		l_fos    = gbifUrl+ _buildLayer(LAYER_FOSSIL)  + "&palette=purples",
		l_spe    = gbifUrl+ _buildLayer(LAYER_SPECIMEN)  + "&palette=reds",
		l_oth    = gbifUrl+ _buildLayer(LAYER_OTHER)  + "&palette=orange",
		minZoom = 0,
		maxZoom= 14,
		gbifAttrib = 'GBIF contributors',
		gbifAll       = new L.TileLayer(l_all, { minZoom: minZoom, maxZoom: maxZoom , attribution: gbifAttrib }),
		gbifObs       = new L.TileLayer(l_obs, { minZoom: minZoom, maxZoom: maxZoom , attribution: gbifAttrib }),
		gbifLiv       = new L.TileLayer(l_liv, { minZoom: minZoom, maxZoom: maxZoom , attribution: gbifAttrib }),
		gbifFos       = new L.TileLayer(l_fos, { minZoom: minZoom, maxZoom: maxZoom , attribution: gbifAttrib }),
		gbifSpe       = new L.TileLayer(l_spe, { minZoom: minZoom, maxZoom: maxZoom , attribution: gbifAttrib }),
		gbifOth       = new L.TileLayer(l_oth, { minZoom: minZoom, maxZoom: maxZoom , attribution: gbifAttrib });

	overlays = {
		"All types": gbifAll,
		"Preserved specimens": gbifSpe,
		"Observations": gbifObs,
		"Living specimens": gbifLiv,
		"Fossils": gbifFos,
		"Other types": gbifOth
	};

    map.addLayer(gbifAll);

    $(".tileControl").on("click", function(e) {
    	e.preventDefault();
    	if ($(this).attr("data-action") == 'show-specimens') {
    		gbifUrl = cfg.tileServerBaseUrl + '/density/tile?key=' + key + '&x={x}&y={y}&z={z}&type=' + type + _buildLayer(LAYER_SPECIMEN);
    	} else if ($(this).attr("data-action") == 'show-observations') {
    		gbifUrl = cfg.tileServerBaseUrl + '/density/tile?key=' + key + '&x={x}&y={y}&z={z}&type=' + type + _buildLayer(LAYER_OBSERVATION);
    	} else if ($(this).attr("data-action") == 'show-all') {
    		gbifUrl = cfg.tileServerBaseUrl + '/density/tile?key=' + key + '&x={x}&y={y}&z={z}&type=' + type + _buildLayer(LAYER_ALL);
    	}
    	gbif.setUrl(gbifUrl);
    });

    // modify the "view all records in visibile area" with the bounds of the map
    $('.viewableAreaLink').bind('click', function(e) {
    	var target = $(this).attr("href");
    	var bounds=map.getBounds();
    	var sw=bounds.getSouthWest(); // south west
    	var ne=bounds.getNorthEast();
    	var se=bounds.getSouthEast();
    	var nw=bounds.getNorthWest();

    	var separator = target.indexOf('?') !== -1 ? "&" : "?";

    	// limit bounds or SOLR barfs
    	sw.lng = sw.lng<-180 ? -180 : sw.lng;
    	sw.lat = sw.lat<-90 ? -90 : sw.lat;
    	nw.lng = nw.lng<-180 ? -180 : nw.lng;
    	nw.lat = nw.lat>90 ? 90 : nw.lat;
    	ne.lng = ne.lng>180 ? 180 : ne.lng;
    	ne.lat = ne.lat>90 ? 90 : ne.lat;
    	se.lng = se.lng>180 ? 180 : se.lng;
    	se.lat = se.lat<-90 ? -90 : se.lat;

    	$(this).attr("href", target + separator + "GEOMETRY=" + sw.lng + " " + sw.lat + "," + nw.lng + " " + nw.lat + "," + ne.lng + " " + ne.lat + "," + se.lng + " " + se.lat + "," + sw.lng + " " + sw.lat);
    });
};

_initDensityMap("CO", "PUBLISHING_COUNTRY");
	
baseAndFirstOverlays = L.control.layers(baseLayers, overlays).addTo(map)
L.control.layers({}, wmsLayers).addTo(map)