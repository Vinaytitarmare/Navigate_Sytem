let stop = document.querySelector(".stop");
var map;
var marker1, marker2; // Markers for the two selected locations
var latlng1, latlng2; // LatLng objects for the two locations

function initMap() {
    // Initialize the map
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 20.5937, lng: 78.9629 }, // Centering the map at India's coordinates
        zoom: 5
    });

    // Start tracking location
    trackCurrentLocationOnce();
    trackLocationEvery30Seconds();

    // Handle click event to select destination
    map.addListener('click', function(e) {
        if (!latlng1) {
            alert("Waiting for your current location...");
        } else if (!marker2) {
            // Get the clicked location (destination)
            latlng2 = e.latLng;
            marker2 = new google.maps.Marker({
                position: latlng2,
                map: map,
                title: 'Selected Location'
            });

            calculateDistance(latlng1, latlng2);
        }
    });
}

function trackCurrentLocationOnce() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;

            latlng1 = new google.maps.LatLng(lat, lng);
            map.setCenter(latlng1);

            if (marker1) {
                marker1.setMap(null);
            }
            marker1 = new google.maps.Marker({
                position: latlng1,
                map: map,
                title: 'You are here!'
            });

            console.log("Initial position: ", lat, lng);
        }, function(error) {
            console.error('Error fetching location:', error.message);
            alert('Unable to retrieve your location.');
        }, {
            enableHighAccuracy: true,
            timeout: 60000, 
            maximumAge: 60000 
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

function trackLocationEvery30Seconds() {
    if (navigator.geolocation) {
        setInterval(function() {
            navigator.geolocation.getCurrentPosition(function(position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;

                latlng1 = new google.maps.LatLng(lat, lng);
                map.setCenter(latlng1);

                if (marker1) {
                    marker1.setMap(null);
                }
                marker1 = new google.maps.Marker({
                    position: latlng1,
                    map: map,
                    title: 'You are here!'
                });

                console.log("Updated position: ", lat, lng);
            }, function(error) {
                console.error('Error fetching location:', error.message);
            }, {
                enableHighAccuracy: true,
                timeout: 10000, 
                maximumAge: 0 
            });
        }, 30000);
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

function calculateDistance(latlng1, latlng2) {
    var distance = google.maps.geometry.spherical.computeDistanceBetween(latlng1, latlng2) / 1000; // distance in kilometers
    document.getElementById("distance").innerText = "Distance: " + distance.toFixed(2) + " km";

    if (distance < 1) {
        let audio = new Audio("request.mp3");
        audio.play();

        setTimeout(() => {
            if (confirm("Do you want to stop the alarm?")) {
                audio.pause();
            }
        }, 5000);
    }

    // Draw a line between the two points
    var line = new google.maps.Polyline({
        path: [latlng1, latlng2],
        geodesic: true,
        strokeColor: '#0000FF',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map
    });
}
