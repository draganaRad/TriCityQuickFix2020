var centerCoord = [49.254667, -122.825015]
if (L.Browser.mobile) {
    // increase tolerance for tapping (it was hard to tap on line exactly), zoom out a bit, and remove zoom control
    var myRenderer = L.canvas({ padding: 0.1, tolerance: 5 });
    var map = L.map("map", { center: centerCoord, zoom: 11, renderer: myRenderer, zoomControl: false });
} else {
    var map = L.map("map", { center: centerCoord, zoom: 12 });
}

L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}
).addTo(map);

// colors and styles -------------------
var portMoodyColor = "#2D699B" // 'darkblue'
var coquitlamColor = "#563B68" // 'darkpurple'
var portCoqColor = "#878E39" // 'darkgreen'
var metroVanColor = "#516B7A" // 'cadetblue'

// icon colors
var portMoodyIconColor = "darkblue"
var coquitlamIconColor = "darkpurple"
var portCoqIconColor = "darkgreen"
var metroVanIconColor = "cadetblue"

// icon light colors (add 100 to regular colors in rgb "Pages" color format dialog)
var portMoodyIconLight = "#91CDFF" // lighter blue
var coquitlamIconLight = "#BA9FCC" // lighter purple
var portCoqIconLight = "#EBF29D" // lighter green
var metroVanIconLight = "#B5CFDE" // lighter blue grey

lineWeight = 5
if (L.Browser.mobile) {
    lineWeight = 6
}

var styleOpacity = 0.6
var portMoodyStyle = {
    "color": portMoodyColor,
    "weight": lineWeight,
    "opacity": styleOpacity
};
var coquitlamStyle = {
    "color": coquitlamColor,
    "weight": lineWeight,
    "opacity": styleOpacity
};
var portCoqStyle = {
    "color": portCoqColor,
    "weight": lineWeight,
    "opacity": styleOpacity
};
var metroVanStyle = {
    "color": metroVanColor,
    "weight": lineWeight,
    "opacity": styleOpacity
};

// map code -------------------------
function onEachFeature(feature, layer) {
    var popupContent = ""
    if (feature.properties) {
        // add city (id)
        if (feature.properties.city) {
            popupContent += "<b>" + feature.properties.city + "</b>";
            if (feature.id) {
                popupContent += " (Quick fix id: <b>" + feature.id + "</b>)";
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
        // add photo(s)
        // remove white spaces in city if exist. no white spaces in photo names
        var city = feature.properties.city.replace(/\s/g, "");
        if (feature.properties.photo) {
            //console.log(city)
            popupContent += "<br>"
            imageSrc = "img/" + city + "/" + feature.properties.photo
            popupContent += "<a href='" + imageSrc + "' target='_blank'><img src='" + imageSrc + "' width='148' height='100'></img></a>"
            if (feature.properties.photo_1) {
                // two photos. show side by side (note: width has to be 148 or less. othrewise second show below not next to first one)
                imageSrc1 = "img/" + city + "/" + feature.properties.photo_1
                popupContent += "<span> "
                popupContent += "<a href='" + imageSrc1 + "' target='_blank'><img src='" + imageSrc1 + "' width='148' height='100'></img></a>"
                popupContent += "</span>"
            }
        }
        // add municipality answer
        if (feature.properties.municipality) {
            popupContent += "<br><b>Municipality response: </b>";
            popupContent += feature.properties.municipality;
        }
        // add fixed photo(s)
        if (feature.properties.photo_fixed) {
            //console.log(city)
            popupContent += "<br>"
            imageSrc = "img/" + city + "/Fixed/" + feature.properties.photo_fixed
            popupContent += "<a href='" + imageSrc + "' target='_blank'><img src='" + imageSrc + "' width='148' height='100'></img></a>"
            if (feature.properties.photo_fixed_1) {
                // two photos. show side by side (note: width has to be 148 or less. othrewise second show below not next to first one)
                imageSrc1 = "img/" + city + "/Fixed/" + feature.properties.photo_fixed_1
                popupContent += "<span> "
                popupContent += "<a href='" + imageSrc1 + "' target='_blank'><img src='" + imageSrc1 + "' width='148' height='100'></img></a>"
                popupContent += "</span>"
            }
        }
    }
    layer.bindPopup(popupContent);
}

// add port moody layer --------------
var portMoodyMarkers = L.markerClusterGroup({
    maxClusterRadius: 60,
    disableClusteringAtZoom: 17,
    iconCreateFunction: function (cluster) {
        var childCount = cluster.getChildCount();
        return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster marker-pmcluster', iconSize: new L.Point(40, 40) });
    },
    //Disable all of the defaults:
    spiderfyOnMaxZoom: false, showCoverageOnHover: false, zoomToBoundsOnClick: false
});
var portMoodyMarker = L.AwesomeMarkers.icon({
    icon: 'circle',
    markerColor: portMoodyIconColor,
    prefix: 'fa',
    iconColor: portMoodyIconLight
});

var portMoodyLayer = new L.geoJSON(portMoodyData, {
    style: portMoodyStyle,
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: portMoodyMarker
        });
    }
});
portMoodyMarkers.addLayer(portMoodyLayer);
map.addLayer(portMoodyMarkers);
//portMoodyLayer.addTo(map);  //without clusters

//add coquitlam layer --------------
var coquitlamMarkers = L.markerClusterGroup({
    maxClusterRadius: 60,
    disableClusteringAtZoom: 17,
    iconCreateFunction: function (cluster) {
        var childCount = cluster.getChildCount();
        return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster marker-coqcluster', iconSize: new L.Point(40, 40) });
    },
    spiderfyOnMaxZoom: false, showCoverageOnHover: false, zoomToBoundsOnClick: false
});
var coquitlamMarker = L.AwesomeMarkers.icon({
    icon: 'circle',
    markerColor: coquitlamIconColor,
    prefix: 'fa',
    iconColor: coquitlamIconLight
});

var coquitlamLayer = new L.geoJSON(coquitlamData, {
    style: coquitlamStyle,
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: coquitlamMarker
        });
    }
});
coquitlamMarkers.addLayer(coquitlamLayer);
map.addLayer(coquitlamMarkers);

// add port coquitlam layer --------------
var portCoqMarkers = L.markerClusterGroup({
    maxClusterRadius: 60,
    disableClusteringAtZoom: 17,
    iconCreateFunction: function (cluster) {
        var childCount = cluster.getChildCount();
        return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster marker-pccluster', iconSize: new L.Point(40, 40) });
    },
    spiderfyOnMaxZoom: false, showCoverageOnHover: false, zoomToBoundsOnClick: false
});
var portCoqMarker = L.AwesomeMarkers.icon({
    icon: 'circle',
    markerColor: portCoqIconColor,
    prefix: 'fa',
    iconColor: portCoqIconLight
});

var portCoqLayer = new L.geoJSON(poCoData, {
    style: portCoqStyle,
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: portCoqMarker
        });
    }
});
portCoqMarkers.addLayer(portCoqLayer);
map.addLayer(portCoqMarkers);

// add metro van layer --------------
var metroVanMarkers = L.markerClusterGroup({
    maxClusterRadius: 60,
    disableClusteringAtZoom: 17,
    iconCreateFunction: function (cluster) {
        var childCount = cluster.getChildCount();
        return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster marker-mvcluster', iconSize: new L.Point(40, 40) });
    },
    spiderfyOnMaxZoom: false, showCoverageOnHover: false, zoomToBoundsOnClick: false
});
var metroVanMarker = L.AwesomeMarkers.icon({
    icon: 'circle',
    markerColor: metroVanIconColor,
    prefix: 'fa',
    iconColor: metroVanIconLight
});

var metroVanLayer = new L.geoJSON(metroVanData, {
    style: metroVanStyle,
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: metroVanMarker
        });
    }
});
metroVanMarkers.addLayer(metroVanLayer);
map.addLayer(metroVanMarkers);

// add legend -----------------
let legend = L.control({ position: "topright" });
legend.onAdd = function () {
    let div = L.DomUtil.create("div", "legend");
    div.innerHTML =
        '<b>Quick Fix Campaign</b><br>' +
        '<b>Tri-Cities 2020</b><br>' +
        '<i class="circle" style="background-color: ' + portMoodyColor + '"></i>Port Moody<br>' +
        '<i class="circle" style="background-color: ' + coquitlamColor + '"></i>Coquitlam<br>' +
        '<i class="circle" style="background-color: ' + portCoqColor + '"></i>Port Coquitlam<br>' +
        '<i class="circle" style="background-color: ' + metroVanColor + '"></i>Metro Vancouver<br>';
    return div;
};
legend.addTo(map)
