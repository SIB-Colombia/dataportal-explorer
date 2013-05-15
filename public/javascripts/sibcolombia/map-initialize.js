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

$("#mapa").height($(window).height()-$("#header").height()-85);
$(window).resize(function(){
	$("#mapa").height($(window).height()-$("#header").height()-85);
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
	
var baseLayers = {
	'Google terreno': googleTerrain,
	'Google mapa carreteras': googleRoadmap,
	'Google satélite': googleSatellite,
	'Google híbrido': googleHibrido,
	"Cloudmate": minimal,
	"Cloud mate vision nocturna": midnight,
	'Bing aereo': bingAereo,
	'Bing mapa carreteras': bingRoads,
	'Bing aereo con etiquetas': bingAerialWithLabels,
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
	"Stamen Watercolor": L.tileLayer.provider('Stamen.Watercolor'),
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
	"Esri WorldGrayCanvas": L.tileLayer.provider('Esri.WorldGrayCanvas'),
};
	
var map = L.map('mapa', {
	center: [4.781505, -79.804687],
	zoom: 6,
	layers: [googleTerrain],
});
	
L.control.layers(baseLayers).addTo(map);