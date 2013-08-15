requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: '/javascripts/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        'app': '../app',
        'jquery': 'jquery/jquery-1.10.2.min',
        'jqueryUI': 'jquery-ui/jquery-ui-1.10.3.custom.min',
        'underscore': 'underscore/underscore-min',
        'Leaflet': 'leaflet/leaflet',
        'LeafletProviders': 'leaflet/plugins/leaflet-providers',
        'LeafletControlFullScreen': 'leaflet/plugins/fullscreen/Control.FullScreen',
        'LeafletGoogleTiles': 'leaflet/plugins/layer/tile/Google',
        'LeafletBingTiles': 'leaflet/plugins/layer/tile/Bing',
        'bootstrap': 'bootstrap/bootstrap.min',
        'knockout': 'knockout/knockout-2.3.0',
        'knockoutKendoUI': 'knockout-kendoui/knockout-kendo.min',
        'customScrollBar': 'custom-scrollbar/jquery.mCustomScrollbar.min',
        'customScrollBarMouseWheel': 'custom-scrollbar/jquery.mousewheel.min',
        'kendo': 'kendo/kendo.web.min',
        'kendoGrid': 'kendo/kendo.grid.min'
    },
    shim: {
        'Leaflet': {
            exports: 'L'
        },
        'LeafletProviders': {
            deps: ['Leaflet']
        },
        'LeafletBingTiles': {
            deps: ['Leaflet']
        },
        'LeafletGoogleTiles': {
            deps: ['Leaflet']
        },
        'LeafletControlFullScreen': {
            deps: ['Leaflet']
        },
        "bootstrap": {
            deps: ["jquery"]
        },
        "underscore": {
            exports: "_"
        }
    }
});

// Initialize leaflet map with layers and overlays
//requirejs(["app/map-initialize"]);

// Load the main app module to start the app
requirejs(["app/main"]);