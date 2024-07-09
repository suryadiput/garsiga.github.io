document.addEventListener("DOMContentLoaded", function() {
    // Include Leaflet CSS and JS
    const leafletCSS = document.createElement('link');
    leafletCSS.rel = 'stylesheet';
    leafletCSS.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
    document.head.appendChild(leafletCSS);

    const leafletJS = document.createElement('script');
    leafletJS.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
    document.head.appendChild(leafletJS);

    // Include Leaflet Search CSS and JS
    const leafletSearchCSS = document.createElement('link');
    leafletSearchCSS.rel = 'stylesheet';
    leafletSearchCSS.href = 'https://unpkg.com/leaflet-search@3.0.0/dist/leaflet-search.min.css';
    document.head.appendChild(leafletSearchCSS);

    const leafletSearchJS = document.createElement('script');
    leafletSearchJS.src = 'https://unpkg.com/leaflet-search@3.0.0/dist/leaflet-search.min.js';
    document.head.appendChild(leafletSearchJS);

    // Initialize the map
    leafletJS.onload = function() {
        const map = L.map('map', {
            zoomControl: false // Disable the default zoom control
        }).setView([-7.347874, 107.807295], 9.5); // Centered on Garut

        // Add custom zoom control at the bottom left
        L.control.zoom({
            position: 'bottomleft'
        }).addTo(map);
    

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Define image bounds
        const imageBounds = [[-7.740660, 107.419968], [-6.946055, 108.135926]];

        // Layers for kerentanan, risiko, and bahaya with 50% opacity
        const kerentananLayer = L.imageOverlay('Peta/kerentanan_gempabumi.png', imageBounds, { opacity: 0.5 });
        const risikoLayer = L.imageOverlay('Peta/risiko_gempabumi.png', imageBounds, { opacity: 0.5 });
        const bahayaLayer = L.imageOverlay('Peta/indeks_gempabumi.png', imageBounds, { opacity: 0.5 });

        const kerentananLandslideLayer = L.imageOverlay('Peta/kerentanan_tanahlongsor.png', imageBounds, { opacity: 0.5 });
        const risikoLandslideLayer = L.imageOverlay('Peta/risiko_tanahlongsor.png', imageBounds, { opacity: 0.5 });
        const bahayaLandslideLayer = L.imageOverlay('Peta/indeks_tanahlongsor.png', imageBounds, { opacity: 0.5 });

        const kerentananTsunamiLayer = L.imageOverlay('Peta/kerentanan_tsunami.png', imageBounds, { opacity: 0.5 });
        const risikoTsunamiLayer = L.imageOverlay('Peta/risiko_tsunami.png', imageBounds, { opacity: 0.5 });
        const bahayaTsunamiLayer = L.imageOverlay('Peta/indeks_tsunami.png', imageBounds, { opacity: 0.5 });

        let selectedLayerType = '';

        function hideLegendAndOpacity() {
            const legendContainer = document.querySelector('.legend-container');
            legendContainer.style.display = 'none';
            map.removeControl(legend);
        }

        function showLegendAndOpacity(layerName) {
            const legendContainer = document.querySelector('.legend-container');
            const legend = document.getElementById('legend');
            legend.innerHTML = `
                <h4>${layerName} Gempa Bumi</h4>
                <i style="background: #006100"></i> Rendah<br>
                <i style="background: #ffff00"></i> Sedang<br>
                <i style="background: #ff2200"></i> Tinggi<br>
            `;
            legendContainer.style.display = 'block';
            if (!map.hasLayer(legend)) {
                legend.addTo(map);
            }
        }

        function updateLayers(type) {
            map.removeLayer(kerentananLayer);
            map.removeLayer(risikoLayer);
            map.removeLayer(bahayaLayer);
            map.removeLayer(kerentananLandslideLayer);
            map.removeLayer(risikoLandslideLayer);
            map.removeLayer(bahayaLandslideLayer);
            map.removeLayer(kerentananTsunamiLayer);
            map.removeLayer(risikoTsunamiLayer);
            map.removeLayer(bahayaTsunamiLayer);
            hideLegendAndOpacity();

            if (type === 'Kerentanan') {
                if (selectedLayerType === 'Earthquake') {
                    map.addLayer(kerentananLayer);
                    showLegendAndOpacity('Kerentanan');
                } else if (selectedLayerType === 'Landslide') {
                    map.addLayer(kerentananLandslideLayer);
                    showLegendAndOpacity('Kerentanan');
                } else if (selectedLayerType === 'Tsunami') {
                    map.addLayer(kerentananTsunamiLayer);
                    showLegendAndOpacity('Kerentanan');
                }
            } else if (type === 'Risiko') {
                if (selectedLayerType === 'Earthquake') {
                    map.addLayer(risikoLayer);
                    showLegendAndOpacity('Risiko');
                } else if (selectedLayerType === 'Landslide') {
                    map.addLayer(risikoLandslideLayer);
                    showLegendAndOpacity('Risiko');
                } else if (selectedLayerType === 'Tsunami') {
                    map.addLayer(risikoTsunamiLayer);
                    showLegendAndOpacity('Risiko');
                }
            } else if (type === 'Bahaya') {
                if (selectedLayerType === 'Earthquake') {
                    map.addLayer(bahayaLayer);
                    showLegendAndOpacity('Bahaya');
                } else if (selectedLayerType === 'Landslide') {
                    map.addLayer(bahayaLandslideLayer);
                    showLegendAndOpacity('Bahaya');
                } else if (selectedLayerType === 'Tsunami') {
                    map.addLayer(bahayaTsunamiLayer);
                    showLegendAndOpacity('Bahaya');
                }
            }
        }

        function handleLayerToggle(event, layerType, dropdownId) {
            selectedLayerType = layerType;
            const dropdown = document.getElementById(dropdownId);

            const otherDropdowns = ['earthquakeLayerDropdown', 'landslideLayerDropdown', 'tsunamiLayerDropdown'];
            otherDropdowns.forEach(id => {
                if (id !== dropdownId) {
                    document.getElementById(id).style.display = 'none';
                }
            });

            map.removeLayer(kerentananLayer);
            map.removeLayer(risikoLayer);
            map.removeLayer(bahayaLayer);
            map.removeLayer(kerentananLandslideLayer);
            map.removeLayer(risikoLandslideLayer);
            map.removeLayer(bahayaLandslideLayer);
            map.removeLayer(kerentananTsunamiLayer);
            map.removeLayer(risikoTsunamiLayer);
            map.removeLayer(bahayaTsunamiLayer);
            hideLegendAndOpacity();

            if (event.target.classList.contains('active')) {
                event.target.classList.remove('active');
                dropdown.style.display = 'none';
            } else {
                document.querySelectorAll('.sidebar-menu a').forEach(link => link.classList.remove('active'));
                event.target.classList.add('active');
                dropdown.style.display = 'block';
            }
        }

        document.getElementById('toggle-earthquake').addEventListener('click', function(event) {
            handleLayerToggle(event, 'Earthquake', 'earthquakeLayerDropdown');
        });

        document.getElementById('toggle-landslide').addEventListener('click', function(event) {
            handleLayerToggle(event, 'Landslide', 'landslideLayerDropdown');
        });

        document.getElementById('toggle-tsunami').addEventListener('click', function(event) {
            handleLayerToggle(event, 'Tsunami', 'tsunamiLayerDropdown');
        });

        document.getElementById('earthquakeLayerDropdown').addEventListener('change', function(event) {
            updateLayers(event.target.value);
        });

        document.getElementById('landslideLayerDropdown').addEventListener('change', function(event) {
            updateLayers(event.target.value);
        });

        document.getElementById('tsunamiLayerDropdown').addEventListener('change', function(event) {
            updateLayers(event.target.value);
        });

        // Define legend
        const legend = L.control({ position: 'bottomright' });

        legend.onAdd = function(map) {
            const div = L.DomUtil.create('div', 'legend');
            return div;
        };

        // Handle opacity slider
        const opacitySlider = document.getElementById('opacityRange');
        opacitySlider.addEventListener('input', function() {
            const opacityValue = opacitySlider.value / 100;
            if (map.hasLayer(kerentananLayer)) {
                kerentananLayer.setOpacity(opacityValue);
            } else if (map.hasLayer(risikoLayer)) {
                risikoLayer.setOpacity(opacityValue);
            } else if (map.hasLayer(bahayaLayer)) {
                bahayaLayer.setOpacity(opacityValue);
            } else if (map.hasLayer(kerentananLandslideLayer)) {
                kerentananLandslideLayer.setOpacity(opacityValue);
            } else if (map.hasLayer(risikoLandslideLayer)) {
                risikoLandslideLayer.setOpacity(opacityValue);
            } else if (map.hasLayer(bahayaLandslideLayer)) {
                bahayaLandslideLayer.setOpacity(opacityValue);
            } else if (map.hasLayer(kerentananTsunamiLayer)) {
                kerentananTsunamiLayer.setOpacity(opacityValue);
            } else if (map.hasLayer(risikoTsunamiLayer)) {
                risikoTsunamiLayer.setOpacity(opacityValue);
            } else if (map.hasLayer(bahayaTsunamiLayer)) {
                bahayaTsunamiLayer.setOpacity(opacityValue);
            }
        });

        // Geocoding function to get address
        function getAddress(lat, lng, callback) {
            const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    callback(data.display_name);
                })
                .catch(() => {
                    callback('Address not found');
                });
        }

        // Handle map click events
        map.on('click', function(e) {
            // Check if the click is within the image bounds
            if (
                map.hasLayer(kerentananLayer) || map.hasLayer(risikoLayer) || map.hasLayer(bahayaLayer) ||
                map.hasLayer(kerentananLandslideLayer) || map.hasLayer(risikoLandslideLayer) || map.hasLayer(bahayaLandslideLayer) ||
                map.hasLayer(kerentananTsunamiLayer) || map.hasLayer(risikoTsunamiLayer) || map.hasLayer(bahayaTsunamiLayer)
            ) {
                const latlng = e.latlng;
                if (
                    latlng.lat >= imageBounds[0][0] &&
                    latlng.lat <= imageBounds[1][0] &&
                    latlng.lng >= imageBounds[0][1] &&
                    latlng.lng <= imageBounds[1][1]
                ) {
                    // Convert latlng to pixel coordinates relative to the image
                    const img = new Image();
                    img.src = map.hasLayer(kerentananLayer) ? 'Peta/kerentanan_gempabumi.png' :
                              map.hasLayer(risikoLayer) ? 'Peta/risiko_gempabumi.png' :
                              map.hasLayer(bahayaLayer) ? 'Peta/indeks_gempabumi.png' :
                              map.hasLayer(kerentananLandslideLayer) ? 'Peta/kerentanan_tanahlongsor.png' :
                              map.hasLayer(risikoLandslideLayer) ? 'Peta/risiko_tanahlongsor.png' :
                              map.hasLayer(bahayaLandslideLayer) ? 'Peta/indeks_tanahlongsor.png' :
                              map.hasLayer(kerentananTsunamiLayer) ? 'Peta/kerentanan_tsunami.png' :
                              map.hasLayer(risikoTsunamiLayer) ? 'Peta/risiko_tsunami.png' :
                              'Peta/indeks_tsunami.png';
                    img.onload = function() {
                        const imgWidth = img.width;
                        const imgHeight = img.height;

                        const x = ((latlng.lng - imageBounds[0][1]) / (imageBounds[1][1] - imageBounds[0][1])) * imgWidth;
                        const y = ((imageBounds[1][0] - latlng.lat) / (imageBounds[1][0] - imageBounds[0][0])) * imgHeight;

                        const canvas = document.createElement('canvas');
                        canvas.width = imgWidth;
                        canvas.height = imgHeight;
                        const context = canvas.getContext('2d');
                        context.drawImage(img, 0, 0, imgWidth, imgHeight);

                        const pixel = context.getImageData(x, y, 1, 1).data;
                        const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;

                        let colorName = '';
                        if (color === 'rgb(0, 97, 0)') {
                            colorName = 'Rendah';
                        } else if (color === 'rgb(255, 255, 0)') {
                            colorName = 'Sedang';
                        } else if (color === 'rgb(255, 34, 0)') {
                            colorName = 'Tinggi';
                        }

                        if (colorName) {
                            getAddress(latlng.lat, latlng.lng, function(address) {
                                const colorStyle = (colorName) => {
                                    switch (colorName) {
                                        case 'Rendah':
                                            return 'background-color: rgb(0, 97, 0); color: white;';
                                        case 'Sedang':
                                            return 'background-color: rgb(255, 255, 0); color: black;';
                                        case 'Tinggi':
                                            return 'background-color: rgb(255, 34, 0); color: white;';
                                        default:
                                            return '';
                                    }
                                };
                        
                                const popupContent = `
                                    <div style="font-family: 'Poppins', sans-serif; font-size: 14px; color: #333;">
                                        <div style="margin-bottom: 8px; border-bottom: 1px solid #ddd; padding-bottom: 4px;">
                                            <strong style="font-size: 16px; color: #0056b3;">${selectedLayerType}:</strong>
                                            <span style="display: inline-block; padding: 2px 6px; ${colorStyle(colorName)} font-weight: bold;">${colorName}</span>
                                        </div>
                                        <div style="margin-bottom: 4px;">
                                            <strong style="color: #0056b3;">Coordinates:</strong>
                                            <span>${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}</span>
                                        </div>
                                        <div>
                                            <strong style="color: #0056b3;">Address:</strong>
                                            <span>${address}</span>
                                        </div>
                                    </div>
                                `;
                                L.popup()
                                    .setLatLng(latlng)
                                    .setContent(popupContent)
                                    .openOn(map);
                            });
                        }
                        
                    };
                }
            }
        });

        // Handle admin boundaries toggle
        const toggleAdminBoundariesBtn = document.getElementById('toggle-admin-boundaries');
        const adminLayerDropdown = document.getElementById('adminLayerDropdown');
        let adminBoundariesLayer;
        let adminLayers = [];

        toggleAdminBoundariesBtn.addEventListener('click', function() {
            if (adminBoundariesLayer) {
                map.removeLayer(adminBoundariesLayer);
                adminBoundariesLayer = null;
                toggleAdminBoundariesBtn.classList.remove('active');
                adminLayerDropdown.style.display = 'none';
                adminLayerDropdown.innerHTML = '<option value="">Pilih Kecamatan</option>';
            } else {
                fetch('Kecamatan_Garut_Fixed/mygeodata/Kecamatan_Garut_Fixed.geojson')
                    .then(response => response.json())
                    .then(data => {
                        adminBoundariesLayer = L.geoJSON(data, {
                            style: function(feature) {
                                return { color: '#e41e23', weight: 4 }; // Color from provided image
                            },
                            onEachFeature: function (feature, layer) {
                                adminLayers.push(layer);
                                if (feature.properties && feature.properties.NAME_3) {
                                    const option = document.createElement('option');
                                    option.value = feature.properties.NAME_3;
                                    option.text = feature.properties.NAME_3;
                                    adminLayerDropdown.add(option);

                                    layer.on('mouseover', function() {
                                        layer.bindTooltip(feature.properties.NAME_3, {
                                            permanent: false,
                                            direction: 'center',
                                            className: 'label-tooltip'
                                        }).openTooltip();
                                    });

                                    layer.on('mouseout', function() {
                                        layer.closeTooltip();
                                    });
                                }
                            }
                        }).addTo(map);
                        toggleAdminBoundariesBtn.classList.add('active');
                        adminLayerDropdown.style.display = 'block';
                        map.fitBounds(adminBoundariesLayer.getBounds()); // Zoom to admin boundaries
                    });
            }
        });

        // Zoom to selected district and hide others
        adminLayerDropdown.addEventListener('change', function() {
            const selectedKecamatan = adminLayerDropdown.value;
            if (selectedKecamatan === "") {
                map.fitBounds(adminBoundariesLayer.getBounds());
                adminLayers.forEach(function(layer) {
                    layer.addTo(map);
                });
            } else {
                adminLayers.forEach(function(layer) {
                    if (layer.feature.properties.NAME_3 === selectedKecamatan) {
                        map.fitBounds(layer.getBounds());
                        layer.setStyle({ color: '#e41e23' });
                        map.addLayer(layer);
                    } else {
                        map.removeLayer(layer);
                    }
                });
            }
        });
    };
});