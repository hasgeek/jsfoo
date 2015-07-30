var map = L.map('map').setView([12.8918869, 77.5841651], 13);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([12.8918869, 77.5841651]).addTo(map)
    