(function ($) {

	$.fn.choropleth_map = function(){

		return this.each(function() {

      var $el = jQuery( this );

      // CREATE ELEMENTS ON THE FLY
      function createElements(){

        var $loader = jQuery( document.createElement( 'div' ) );
        $loader.addClass( 'loader' );
        $loader.html( "<h3 class='loadtext'><i class='fa fa-spinner fa-spin'></i> Loading data, please wait..</h3>" );
        $loader.appendTo( $el );

        var $map = jQuery( document.createElement( 'div' ) );
        $map.attr('id', 'map');
        $map.appendTo( $el );

				/*
        var $title = jQuery( document.createElement( 'div' ) );
        $title.html( '<h1>A Simple Choropleth</h1>' );
        $title.appendTo( $el );
				*/
      }

      function drawMap(){

        // HIDE THE LOADER
        $el.find('.loader').hide();

        //SETUP BASEMAP
        var map = L.map('map').setView( [12.27, 10.37], 2 );

        //var hybUrl='https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ3VuZWV0bmFydWxhIiwiYSI6IldYQUNyd0UifQ.EtQC56soqWJ-KBQqHwcpuw';
        var hybUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
        var hybAttrib = 'ESRI World Light Gray | Map data © <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors & <a href="http://datameet.org" target="_blank">Data{Meet}</a>';
        var hyb = new L.TileLayer(hybUrl, {minZoom: 1, maxZoom: 18, attribution: hybAttrib, opacity:1}).addTo(map);


				var gjLayerCountries = L.geoJson( geoCountries, { style: styleCountry, onEachFeature: onEachCountry, filter: matchCountries } );
        gjLayerCountries.addTo(map);

				console.log( data );

				//ONLY ADD DISTRICTS THAT ARE AVAILABLE IN THE DATA
				function matchCountries( feature ) {
					if( data[ feature.properties.SOVEREIGNT ] ) return true;
					return false;
				}

				//ADD COUNTRY BOUNDARIES
				var gjLayerCountryLines = L.geoJson( geoCountries, { style: {
					"color"		: "#000",
					"weight"	: 1,
					"opacity"	: 1,
					"fill"		: false
				} } );
				gjLayerCountryLines.addTo(map);

				map.setMaxBounds( gjLayerCountryLines.getBounds() );


      }

      function styleCountry( feature ){

				var colors = [ '#311B92', '#5E35B1', '#7E57C2', '#B39DDB', '#EDE7F6' ];

				var color = colors[ Math.floor( Math.random() * colors.length ) ];

				return {
          fillColor: color,
          weight: 1,
          opacity: 0.4,
          color: 'black',
          dashArray: '1',
          fillOpacity: 0.8
        };
			}

			function onEachCountry( feature, layer ) {
        //CONNECTING TOOLTIP AND POPUPS TO DISTRICTS
        layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight
          //click: zoomToFeature
        });


        layer.bindTooltip( feature.properties.SOVEREIGNT, {
          direction : 'auto',
          className : 'countrylabel',
          permanent : false,
          sticky    : true
        } );

        layer.bindPopup( popContent( feature ), { maxWidth:600 } );
      }

			function popContent( feature ) {
				var content = data[ feature.properties.SOVEREIGNT ] ['popup'];
				return content;
      }

      function highlightFeature(e) {
        //DISTRICT HIGHLIGHT ON MOUSEOVER
        var layer = e.target;

        layer.setStyle( {
          weight: 3,
          color: 'yellow',
          opacity: 0.9
        } );
        if ( !L.Browser.ie && !L.Browser.opera ) {
          layer.bringToFront();
        }
      }

      function resetHighlight(e) {
          //RESET HIGHLIGHT ON MOUSEOUT
          var layer = e.target;
          layer.setStyle({
            weight: 1,
            color: 'black',
            opacity: 0.4
          });
      }

      function zoomToFeature(e) {
        // PROBABLY THE MAP VARIABLE NEEDS TO BE A GLOBAL VARIABLE HERE
        map.fitBounds(e.target.getBounds());
      }

      // INITIALIZE FUNCTION
      function init(){

        // CREATE ALL THE DOM ELEMENTS FIRST
        createElements();

        // RENDER THE MAP IN THE CORRECT DOM
        drawMap();
      }

      init();

    });
  };
}(jQuery));

jQuery(document).ready(function(){

  jQuery( '[data-behaviour~=choropleth-map]' ).choropleth_map();

});
