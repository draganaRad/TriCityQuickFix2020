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

map.attributionControl.addAttribution('<a href="http://wiki.bikehub.ca/committees/index.php?title=Tri-Cities_Committee_Wiki">Tri-Cities HUB Committee</a>');

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

// functions -------------------------

// popup dialog function 
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
                // two photos. show side by side (note: width has to be 148 or less. othrewise second shows below not next to first one)
                imageSrc1 = "img/" + city + "/Fixed/" + feature.properties.photo_fixed_1
                popupContent += "<span> "
                popupContent += "<a href='" + imageSrc1 + "' target='_blank'><img src='" + imageSrc1 + "' width='148' height='100'></img></a>"
                popupContent += "</span>"
            }
        }
    }
    layer.bindPopup(popupContent);
}

function createClusterGroup(clusterStyle) {

    var newClusterGroup = L.markerClusterGroup({
        maxClusterRadius: 60,
        disableClusteringAtZoom: 17,
        iconCreateFunction: function (cluster) {
            var childCount = cluster.getChildCount();
            var styleClassName = 'marker-cluster marker-' + clusterStyle
            return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: styleClassName, iconSize: new L.Point(40, 40)});
        },
        //Disable all of the defaults:
        spiderfyOnMaxZoom: false, showCoverageOnHover: false, zoomToBoundsOnClick: false
    });
    return newClusterGroup
}

function createIconMarker(iconName, iconColor, markerColor){

    var newIconMarker = L.AwesomeMarkers.icon({
        icon: iconName,
        markerColor: iconColor,
        prefix: 'fa',
        iconColor: markerColor
    }); 
    return newIconMarker
}

function createLayer(data, style, iconColor, markerColor) {
    
    var cityLayer = new L.geoJSON(data, {
        style: style,
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            var iconName = 'circle'
            // change icon if fixed
            switch (feature.properties.fixed) {
                case 'yes': iconName = 'check'
            }
            return L.marker(latlng, {
                icon: createIconMarker(iconName, iconColor, markerColor)
            });
        }
    });
    return cityLayer
}

// map code -------------------------

// add port moody layer 
var portMoodyMarkers = createClusterGroup('pmcluster')  //style name is defined in quickFix.css
portMoodyLayer = createLayer(portMoodyData, portMoodyStyle, portMoodyIconColor, portMoodyIconLight)
portMoodyMarkers.addLayer(portMoodyLayer);
map.addLayer(portMoodyMarkers);

// add coquitlam layer
var coquitlamMarkers = createClusterGroup('coqcluster')  //style name is defined in quickFix.css
coquitlamLayer = createLayer(coquitlamData, coquitlamStyle, coquitlamIconColor, coquitlamIconLight)
coquitlamMarkers.addLayer(coquitlamLayer);
map.addLayer(coquitlamMarkers);

// add port coquitlam layer
var portCoqMarkers = createClusterGroup('pccluster')  //style name is defined in quickFix.css
portCoqLayer = createLayer(poCoData, portCoqStyle, portCoqIconColor, portCoqIconLight)
portCoqMarkers.addLayer(portCoqLayer);
map.addLayer(portCoqMarkers);

var metroVanMarkers = createClusterGroup('mvcluster')  //style name is defined in quickFix.css
metroVanLayer = createLayer(metroVanData, metroVanStyle, metroVanIconColor, metroVanIconLight)
metroVanMarkers.addLayer(metroVanLayer);
map.addLayer(metroVanMarkers);

// add legend -----------------
let legend = L.control({ position: "topright" });
legend.onAdd = function () {
    let div = L.DomUtil.create("div", "legend");

    //var legendNote = 'Tap map item for more info'
    var legendNote = 'Click on map item for more info'
    if (L.Browser.mobile) {
        legendNote = 'Tap map item for more info'
    }

    div.innerHTML =
        '<b>Quick Fix Campaign</b><br>' +
        '<b>Tri-Cities 2020</b><br>' +
        '<i class="circle" style="background-color: ' + portMoodyColor + '"></i>Port Moody<br>' +
        '<i class="circle" style="background-color: ' + coquitlamColor + '"></i>Coquitlam<br>' +
        '<i class="circle" style="background-color: ' + portCoqColor + '"></i>Port Coquitlam<br>' +
        '<i class="circle" style="background-color: ' + metroVanColor + '"></i>Metro Vancouver<br>' +
        legendNote + '<br>';
    return div;
};
legend.addTo(map)
