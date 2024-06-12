
//Create map object
let myMap = L.map("map", {
    center: [0.3027, 21.5076], 
    zoom: 2
  });

// Adding tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Store API endpoint
let link = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

// Getting GeoJSON Data
d3.json(link).then(function(data) {

    data = data.features;

    // Retrieving magnitude and depth data
    for (let i = 0; i < data.length; i++) {
        let earthquake = data[i]
        let magnitude = earthquake.properties.mag;
        let depth = earthquake.geometry.coordinates[2];

        // Define marker size based on magnitude
        let markerSize = magnitude * 2.5;

        // Define marker color based on depth
        let markerColor = depth > 90 ? 'darkred' : depth >= 70 ? 'orangered' : depth >= 50 ? 'orange' : depth >= 30 ? 'gold' : depth > 10 ? 'yellow' : 'limegreen';


        //Create a circle marker
        L.circleMarker([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
            radius: markerSize,
            color: markerColor,
            weight: 1,
            fillColor: markerColor,
            fillOpacity: 0.75
        }).bindPopup(`<h3> ${earthquake.properties.place}</h3><hr><strong>Magnitude:</strong> ${magnitude}<br><strong>Depth:</strong> ${depth}`).addTo(myMap);
    }

    let legend = L.control({position: 'bottomright'})
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");

    // Define the legend content
    let legendInfo = "<h3>Earthquake Depth</h3>" ;
    let depthRanges = ['0-10', '10-30', '30-50', '50-70', '70-90','90+']
    let colors = ['limegreen', 'yellow', 'gold', 'orange', 'orangered', 'darkred']
    
    // Create legend labels based on depth ranges and colors
    for (let i = 0; i < depthRanges.length; i++) {
        let start = depthRanges[i];
        let color = colors[i];
        legendInfo += "<div><div class='legend-color' style='background-color: " + color + "'></div>" +
        "<div class='legend-text'>" + start + "</div></div>";
    }

    // Set the legend content
    div.innerHTML = legendInfo;
    
    return div;
};
legend.addTo(myMap);



}); 

  