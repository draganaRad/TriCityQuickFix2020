var centerCoord = [49.254667, -122.825015]
if (L.Browser.mobile) {
    // increase tolerance for tapping (it was hard to tap on line exactly), zoom out a bit, and remove zoom control
    var myRenderer = L.canvas({ padding: 0.1, tolerance: 5 });
    var map = L.map("map", { center: centerCoord, zoom: 11, renderer: myRenderer, zoomControl: false});
}else{
    var map = L.map("map", { center: centerCoord, zoom: 12}); 
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
        // add municipality answer
        if (feature.properties.municipality) {
            popupContent += "<br><b>Municipality response: </b>";
            popupContent += feature.properties.municipality;
        }
        // add photo
        if (feature.properties.photo) {
            // remove white spaces in city if exist
            var city = feature.properties.city.replace(/\s/g, "");
            //console.log(city)
            popupContent += "<br>"
            var imageSrc = "img/" + city + "/" + feature.properties.photo
            popupContent += "<a href='" + imageSrc + "' target='_blank'><img src='" + imageSrc + "' width='150' height='100'></img></a>"
            // add second photo
            if (feature.properties.photo_1) {
                imageSrc = "img/" + city + "/" + feature.properties.photo_1
                popupContent += "<br>"
                popupContent += "<a href='" + imageSrc + "' target='_blank'><img src='" + imageSrc + "' width='150' height='100'></img></a>"
                //popupContent += "<a href='/img/Coquitlam/4.PNG' target='_blank'><img src='/img/Coquitlam/4.PNG' width='150' height='100'></img></a>"
            }
        }
    }
    layer.bindPopup(popupContent);
}

// add port moody layer --------------
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
portMoodyLayer.addTo(map);

//add coquitlam layer --------------
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
coquitlamLayer.addTo(map);

// add port coquitlam layer --------------
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
portCoqLayer.addTo(map);

// add metro van layer --------------
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
metroVanLayer.addTo(map);

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
