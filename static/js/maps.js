$(function initLeaflets() {
    $('.leaflet-map').each(function initLeafletMap () {
        var   $container = $(this)
            , defaults = {
                  zoom: 5
                , marker: [12.9833, 77.5833] // bangalore
                , label: null
                , maxZoom: 18
                , attribution: '<a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a>'
                , subdomains: ['a','b','c']
                , scrollWheelZoom: false
            }
            , args
            , options
            , map
            , marker
            ;
        
        // remove any child elements from the container
        $container.empty();
        
        args = $container.data();
        if (args.marker) { args.marker = args.marker.split(','); }
        options = $.extend({}, defaults, args);
        
        map = new L.Map($container[0], {
              center: options.center || options.marker
            , zoom: options.zoom
            , scrollWheelZoom: options.scrollWheelZoom
        });
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: options.maxZoom
            , attribution: options.attribution
            , subdomains: options.subdomains
        }).addTo(map);
        
        
        marker = new L.marker(options.marker).addTo(map);
        if (options.label) marker.bindPopup(options.label).openPopup();
    })
});
