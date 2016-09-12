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
    'LeafletZoomSlider': 'leaflet/plugins/zoomslider/zoomslider',
    'LeafletMapboxVectorTile': 'leafletMapboxVectorTile/Leaflet.MapboxVectorTile'
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
    },
    'LeafletMapboxVectorTile': {
      deps: ['Leaflet']
    }
  }
});

// Load the main app module to start the app
require(["app/main"], function() {
  // GOOGLE ANALYTICS CODE
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-1418857-10', 'auto');
  ga('send', 'pageview');
  // ------ END GOOGLE ANALYTICS CODE

  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    // Map Height
    $("#mapa").height($(window).height()-$("header").height());
  });

  $(function () {
    $('[data-toggle="popover"]').popover();
  });

});
