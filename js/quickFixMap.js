var map = L.map("map", { center: [49.254667, -122.825015], zoom: 12 });

L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}
).addTo(map);

var portMoodyColor = "#2D699B" // 'darkblue'
var coquitlamColor = "#563B68" // 'darkpurple'
var portCoqColor = "#878E39" // 'darkgreen'
var metroVanColor = "#516B7A" // 'cadetblue'
// 516B7A - MetroVan (dark grey)
// 563B68 - Coquitlam (dark purple)
// 878E39 - Port Coquitlam (dark green)
// 2D699B - Port Moody (dark blue)

var coquitlamStyle = {
    "color": coquitlamColor,
    "weight": 5,
    "opacity": 0.8
};

function onEachFeature(feature, layer) {
    var popupContent = ""
    if (feature.properties) {
        // add city (id)
        if (feature.properties.city) {
            popupContent += "<b>" + feature.properties.city + "</b>";
            if (feature.id) {
                popupContent += " (Quick fix id: " + feature.id + ")";
            }
        }
        // add type
        if (feature.properties.type) {
            popupContent += "<br><b>Type: </b>";
            popupContent += feature.properties.type;
        }

        // add location
        if (feature.properties.location) {
            popupContent += "<br><b>Location: </b>";
            popupContent += feature.properties.location;
        }
        // add description
        if (feature.properties.description) {
            popupContent += "<br><b>Description: </b>";
            popupContent += feature.properties.description;
        }
        // add photo
        if (feature.properties.photo) {
            popupContent += "<br>"
            var imageSrc = "/img/" + feature.properties.city + "/" + feature.properties.photo
            popupContent += "<a href='" + imageSrc + "' target='_blank'><img src='" + imageSrc + "' width='150' height='100'></img></a>"
            // add second photo
            if (feature.properties.photo_1) {
                imageSrc = "/img/" + feature.properties.city + "/" + feature.properties.photo_1
                popupContent += "<br>"
                popupContent += "<a href='" + imageSrc + "' target='_blank'><img src='" + imageSrc + "' width='150' height='100'></img></a>"
                //popupContent += "<a href='/img/coquitlam/4.PNG' target='_blank'><img src='/img/coquitlam/4.PNG' width='150' height='100'></img></a>"
            }
        }
    }
    layer.bindPopup(popupContent);
}

var circleMarker = L.AwesomeMarkers.icon({
    icon: 'circle',
    markerColor: 'darkpurple',
    prefix: 'fa',
    iconColor: '#BA9FCC' // lighter purple
});

var coquitlamLayer = new L.geoJSON(coquitlamData, {
    style: coquitlamStyle,
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: circleMarker
        });
    }
});

coquitlamLayer.addTo(map);

// add legend
let legend = L.control({ position: "topright" });
legend.onAdd = function () {
    let div = L.DomUtil.create("div", "legend");
    div.innerHTML =
        '<b>Tri-Cities Quick Fix 2020</b><br>' +
        '<i class="circle" style="background-color: ' + portMoodyColor + '"></i>Port Moody<br>' +
        '<i class="circle" style="background-color: ' + coquitlamColor + '"></i>Coquitlam<br>' +
        '<i class="circle" style="background-color: ' + portCoqColor + '"></i>Port Coquitlam<br>' +
        '<i class="circle" style="background-color: ' + metroVanColor + '"></i>Metro Vancouver<br>';
    return div;
};
legend.addTo(map)


  //L.marker([51.927913,4.521303], {icon: L.AwesomeMarkers.icon({icon: 'map-marker', prefix: 'fa', markerColor: 'red', iconColor: '#f28f82'}) }).addTo(map);

// L.geoJSON([bicycleRental, campus], {

// 	style: function (feature) {
// 		return feature.properties && feature.properties.style;
// 	},

// 	onEachFeature: onEachFeature,

// 	pointToLayer: function (feature, latlng) {
// 		return L.circleMarker(latlng, {
// 			radius: 8,
// 			fillColor: "#ff7800",
// 			color: "#000",
// 			weight: 1,
// 			opacity: 1,
// 			fillOpacity: 0.8
// 		});
// 	}
// }).addTo(map);

// L.geoJSON(freeBus, {

// 	filter: function (feature, layer) {
// 		if (feature.properties) {
// 			// If the property "underConstruction" exists and is true, return false (don't render features under construction)
// 			return feature.properties.underConstruction !== undefined ? !feature.properties.underConstruction : true;
// 		}
// 		return false;
// 	},

// 	onEachFeature: onEachFeature
// }).addTo(map);

// var coorsLayer = L.geoJSON(coorsField, {

// 	pointToLayer: function (feature, latlng) {
// 		return L.marker(latlng, {icon: baseballIcon});
// 	},

// 	onEachFeature: onEachFeature
// }).addTo(map);