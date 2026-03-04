// Create a new map with a fullscreen button:
window.map = new L.Map('map');

// FR: variable globale pour stocker le marker de l'ISS
window.currentISSMarker;

// Center
// FR: définit la position initiale sur la carte: Coordonnées de la Rochelle
map.setView([46.157302200462, -1.15357247663001], 2);


// FR: Initialisation la carte en ajoutant une couche de tuile
const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20, // le valeur maximum permetant de zoomer
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' // copyright
}).addTo(map);

// FR: initialisation d'une icone marker personnalisée
const LeafIcon = L.Icon.extend({
    options: {
        // FR: taille de l'icône
        iconSize: [30, 30],

        // FR: point de l'icône qui correspondra à l'emplacement du marqueur
        iconAnchor : [0, 30],

        // FR: point à partir duquel la fenêtre popup doit s'ouvrir par rapport à l'iconAnchor
        popupAnchor: [10, -50],
    }
});
// FR: créer le marker
window.IssIcon = new LeafIcon({
    iconUrl: "./assets/image/iss.png"
});


// Add Fullscreen to an existing map:
map.addControl(new L.Control.Fullscreen({
    title: {
        'false': 'View Fullscreen',
        'true': 'Exit Fullscreen'
    }
}));

/**
 * FR: fonction pour récupérer la position de l'ISS
 */
function getISSLocation()
{
    // Loading
    let loading = document.getElementById("loading");
    loading.style.display = "block";

    fetch('http://api.open-notify.org/iss-now.json')
        
        .then( response => response.json() )
        .then( data => {
            // Hide loading
            loading.style.display = "none";

            // Debug
            console.log("🗺️ Position de l'ISS: " + data.iss_position.latitude);
            output = false;

            let map = window.map;
            let currentISSMarker = window.currentISSMarker;
            let IssIcon = window.IssIcon;

            if (data.message == "success")
            {
                output = data.iss_position;

                updateISSMarker( data.iss_position );
            }

            return output;
        });
}

/**
 * FR: fonction pour mettre à jour le marker de l'ISS
 * @param {*} iss_position 
 */
function updateISSMarker( iss_position )
{
    let longitude = iss_position.longitude;
    let latitude = iss_position.latitude;

    // Retrait du marker
    if (window.currentISSMarker != undefined) {
        map.removeLayer(currentISSMarker);
    }
    // FR: placement du marker
    currentISSMarker = L.marker(
        [latitude, longitude],
        {icon: window.IssIcon}
    )
        .addTo(map)
        // FR: ajout d'une popup avec les coordonnées de l'ISS
        .bindPopup("<b>Position de l'ISS</b><br>Latitude: " + latitude + "<br>Longitude: " + longitude).openPopup();
}

// timer mise à jour
const intervalID = setInterval(getISSLocation, 5000, );