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
    'jquery': '../../components/jquery/dist/jquery.min',
    'jqueryUI': 'jquery-ui/jquery-ui-1.10.3.custom.min',
    'underscore': 'underscore/underscore-min',
    'Leaflet': '../../components/leaflet/dist/leaflet',
    'LeafletProviders': 'leaflet/plugins/leaflet-providers',
    'LeafletControlFullScreen': 'leaflet/plugins/fullscreen/Control.FullScreen',
    'LeafletGoogleTiles': 'leaflet/plugins/layer/tile/Google',
    'LeafletBingTiles': 'leaflet/plugins/layer/tile/Bing',
    'LeafletDraw': 'leaflet/plugins/draw/leaflet.draw',
    'LeafletMarkerCluster': '../../components/leaflet.markercluster/dist/leaflet.markercluster',
    'LeafletSidebar': '../../components/leaflet-sidebar/src/L.Control.Sidebar',
    'bootstrap': '../../components/bootstrap/dist/js/bootstrap.min',
    'knockout': '../../components/knockoutjs/dist/knockout',
    'knockoutKendoUI': 'knockout-kendoui/knockout-kendo.min',
    'kendo': 'kendo/kendo.web.min',
    'kendoGrid': 'kendo/kendo.grid.min',
    'kendoSpanishCulture': 'kendo/cultures/kendo.culture.es-CO.min',
    'select2': '../../components/select2/select2.min',
    'range-slider': '../../components/rangeslider.js/dist/rangeslider.min',
    'LeafletZoomSlider': 'leaflet/plugins/zoomslider/zoomslider'
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
    'LeafletZoomSlider': {
      deps: ['Leaflet']
    },
    'LeafletMarkerCluster': {
      deps: ['Leaflet']
    },
    'LeafletSidebar': {
      deps: ['Leaflet']
    },
    'jqueryUI': {
      deps: ['jquery']
    },
    'bootstrap': {
      deps: ['jquery', 'jqueryUI']
    },
    'underscore': {
      exports: '_'
    },
    'select2': {
      deps: ['jquery']
    },
    'kendoSpanishCulture': {
      deps: ['kendo']
    },
    'range-slider': {
      deps: ['jquery']
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

  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    // Map Height
    $("#mapa").height($(window).height()-$("header").height());
    // Table view height
    $("#reportGrid").height($(window).height()-$("header").height()-$("#actual-search-stats-data").height()-60);
    $("#reportGrid .k-grid-content").height($(window).height()-$("header").height()-$("#actual-search-stats-data").height()-60-91);
  });

  $(function () {
    $('[data-toggle="popover"]').popover();
  });

});
