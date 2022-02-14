let markerList = [];
let popupList = [];

const INITIAL_ZOOM = 3;
const INITIAL_COORDINATES = [-0.127758, 51.507351];
const TARGET_ZOOM = 7;
const ACCESS_TOKEN = 'ADD_ACCESS_TOKEN_HERE';

mapboxgl.accessToken = ACCESS_TOKEN;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: INITIAL_COORDINATES,
    zoom: INITIAL_ZOOM
});


const coordinateList = [
    [2.349014, 48.864716],
    [-0.127758, 51.507351],
    [12.496365, 41.902782],
];

let currentMarkerID, currentZoom;

map.on('zoomstart', function (evt) {
    console.log('1- CURRENTMAPZOOM', map.getZoom());
    console.log('1- CURRENTZOOM', currentZoom);
    // Zoomed out
    if (map.getZoom() > currentZoom) {
        if (currentMarkerID) {
            setTimeout(function () {
                popupList[+currentMarkerID] = popupList[+currentMarkerID].remove();
            }, 700);
        }
    }
    currentZoom = map.getZoom();
});
map.on('zoomend', function (evt) {
    console.log('CURRENTZOOM', currentZoom);
    if (map.getZoom() > currentZoom) {
        // Zoomed in
        if (currentMarkerID) {
            popupList[+currentMarkerID] = popupList[+currentMarkerID].addTo(map);

        }
    }


});

function closePopup() {
    const popups = document.querySelectorAll('.marker-popup');
    popups.forEach(function (popup) {
        popup.classList.remove('visible');
    });
    map.flyTo({center: INITIAL_COORDINATES, zoom: INITIAL_ZOOM});
}

const popupOffsets = {
    'top': [500, 0],
    'top-left': [300, 0],
    'top-right': [300, 0],
};


coordinateList.forEach(function (coordinate, index) {


    popupList[index] = new mapboxgl.Popup({
        offset: new mapboxgl.Point(177, -150),
        className: 'marker-popup',
        closeButton: false
    })
        .setHTML('<div data-popup-index="' + index + '">' +
            '<div class="thumbnail"><img src="popup-image.jpeg" alt=""></div>' +
            '<div class="text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse id luctus nisi, ac venenatis ipsum. Etiam fringilla metus justo, ac commodo leo hendrerit id. Praesent rutrum elit metus, a facilisis enim dapibus nec. Phasellus a enim eu lacus rutrum facilisis ac nec leo. In et sapien eget massa viverra accumsan. Suspendisse ullamcorper nunc sed mattis fringilla.</div>' +
            '<div><button id="popup-close" onclick="closePopup()">CLOSE</button></div>' +
            '</div>')
        .setLngLat(coordinate)
        .addTo(map);

    const el = document.createElement('div');
    el.className = 'marker';
    el.setAttribute('data-index', index.toString());

    markerList[index] = new mapboxgl.Marker(el)
        .setLngLat(coordinate)
        .addTo(map);

    popupList[index] = popupList[index].remove();
    // popupList[index] = popupList[index].addTo(map);


    // Marker event Listener
    el.addEventListener('click', function (evt) {
        evt.preventDefault();
        currentMarkerID = evt.target.getAttribute('data-index');
        map.flyTo(
            {
                center: markerList[currentMarkerID].getLngLat(),
                zoom: TARGET_ZOOM
            }
        );
    })

});


