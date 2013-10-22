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
        'LeafletDraw': 'leaflet/plugins/draw/leaflet.draw',
        'bootstrap': 'bootstrap/bootstrap.min',
        'knockout': 'knockout/knockout-2.3.0',
        'knockoutKendoUI': 'knockout-kendoui/knockout-kendo.min',
        'customScrollBar': 'custom-scrollbar/jquery.mCustomScrollbar.min',
        'customScrollBarMouseWheel': 'custom-scrollbar/jquery.mousewheel.min',
        'kendo': 'kendo/kendo.web.min',
        'kendoGrid': 'kendo/kendo.grid.min',
        'kendoSpanishCulture': 'kendo/cultures/kendo.culture.es-CO.min',
        'select2': 'select2/select2.min'
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
        'LeafletDraw': {
            deps: ['Leaflet']
        },
        'jqueryUI': {
            deps: ['jquery']
        },
        'bootstrap': {
            deps: ['jquery', 'jqueryUI']
        },
        'customScrollBar': {
            deps: ['jquery']
        },
        'underscore': {
            exports: '_'
        },
        'select2': {
            deps: ['jquery']
        },
        'kendoSpanishCulture': {
            deps: ['kendo']
        }
    }
});

// Load the main app module to start the app
require(["app/main"], function() {
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-1418857-10']);
    _gaq.push(['_setDomainName', 'sibcolombia.net']);
    _gaq.push(['_trackPageview']);

    (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();

    $('a[data-toggle="tab"]').on('shown', function (e) {
        // Map Height
        $("#mapa").height($(window).height()-$("header").height());
        // Table view height
        $("#reportGrid").height($(window).height()-$("header").height()-$("#actual-search-stats-data").height()-60);
        $("#reportGrid .k-grid-content").height($(window).height()-$("header").height()-$("#actual-search-stats-data").height()-60-91);
    });
});