<!DOCTYPE html>
<html>
<head>
    <title>Earthquake Visualization</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/leaflet.css" />
    <style>
        #map {
            height: 500px;
        }
        .legend {
            position: absolute;
            bottom: 30px;
            left: 30px;
            background-color: #fff;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 1px 5px rgba(0,0,0,0.4);
        }
        .legend-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .legend-item {
            margin-bottom: 5px;
        }
        .legend-color {
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-right: 5px;
        }
    </style>
</head>
<body>
    <div id="map"></div>

    <script src="https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/leaflet.js"></script>
    <script src="https://d3js.org/d3.v7.min.js"></script>

    <script>
        // Fetch earthquake data
        fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson')
            .then(response => response.json())
            .then(data => {
                // Create Leaflet map
                const map = L.map('map').setView([0, 0], 2);

                // Add tile layer to the map (e.g., OpenStreetMap)
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
                    maxZoom: 18
                }).addTo(map);

                // Create legend control
                const legend = L.control({ position: 'bottomleft' });
                legend.onAdd = function (map) {
                    const div = L.DomUtil.create('div', 'legend');
                    div.innerHTML = `
                        <div class="legend-title">Legend</div>
                        <div class="legend-item">
                            <div class="legend-color" style="background-color: #ff0000;"></div>
                            Magnitude > 5
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background-color: #00ff00;"></div>
                            Magnitude <= 5
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background-color: rgba(0, 0, 0, 0.7);"></div>
                            Depth
                        </div>
                    `;
                    return div;
                };
                legend.addTo(map);

                // Iterate over earthquake data and create markers
                data.features.forEach(feature => {
                    const magnitude = feature.properties.mag;
                    const depth = feature.geometry.coordinates[2];
                    const lat = feature.geometry.coordinates[1];
                    const lng = feature.geometry.coordinates[0];

                    // Customize marker size based on magnitude
                    const markerOptions = {
                        radius: magnitude * 2,
                        fillColor: magnitude > 5 ? '#ff0000' : '#00ff00',
                        color: '#000',
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 
