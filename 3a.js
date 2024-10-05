let stop = document.querySelector(".stop");
var map = new MapmyIndia.Map('map', {
    center: [20.5937, 78.9629], 
    zoomControl: true,
    hybrid: true,
    zoom: 5
});

var marker1, marker2; // Markers for the two selected locations
var latlng1, latlng2; // LatLng objects for the two locations

// Function to track user's current location once
function trackCurrentLocationOnce() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;

            latlng1 = L.latLng(lat, lng);
            map.setView(latlng1, 15); 

            if (marker1) {
                map.removeLayer(marker1);
            }
            marker1 = L.marker(latlng1).addTo(map)
                .bindPopup('You are here!').openPopup();

            console.log("Initial position: ", lat, lng);
        }, function(error) {
            console.error('Error fetching location:', error.message);
            alert('Unable to retrieve your location.');
        }, {
            enableHighAccuracy: true,
            timeout: 10000, 
            maximumAge: 0 
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

// Function to track location every 30 seconds
function trackLocationEvery30Seconds() {
    if (navigator.geolocation) {
        setInterval(function() {
            navigator.geolocation.getCurrentPosition(function(position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;

                latlng1 = L.latLng(lat, lng);
                map.setView(latlng1, 15);

                if (marker1) {
                    map.removeLayer(marker1);
                }
                marker1 = L.marker(latlng1).addTo(map)
                    .bindPopup('You are here!').openPopup();

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

trackCurrentLocationOnce(); 
trackLocationEvery30Seconds(); 

// Function to select destination by clicking on the map
map.on('click', function(e) {
    if (!latlng1) {
        alert("Waiting for your current location...");
    } else if (!marker2) {
        latlng2 = e.latlng;
        marker2 = L.marker(latlng2).addTo(map)
            .bindPopup("Selected Location").openPopup();

        calculateDistance(latlng1, latlng2);
    }
});

// Function to calculate distance between two locations
function calculateDistance(latlng1, latlng2) {
    var distance = latlng1.distanceTo(latlng2) / 1000; //km
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

    L.polyline([latlng1, latlng2], { color: 'blue' }).addTo(map)
        .bindPopup("Distance: " + distance.toFixed(2) + " km").openPopup();
}

// Function to geocode the destination typed in the input box
function geocodeDestination() {
    var destination = document.getElementById("destination").value;
    
    // Call the MapMyIndia Geocoding API
    fetch(`https://apis.mapmyindia.com/advancedmaps/v1/aa06433767d34b57c709747cbaded46d /geo_code?addr=${encodeURIComponent(destination)}`)
    .then(response => response.json())
    .then(data => {
        if (data.copResults && data.copResults.length > 0) {
            var lat = data.copResults[0].latitude;
            var lng = data.copResults[0].longitude;
            
            latlng2 = L.latLng(lat, lng);
            
            if (marker2) {
                map.removeLayer(marker2);
            }
            marker2 = L.marker(latlng2).addTo(map)
                .bindPopup("Selected Location").openPopup();

            map.setView(latlng2, 15); 

            // Calculate the distance between current location and the typed destination
            calculateDistance(latlng1, latlng2);
        } else {
            alert("Location not found!");
        }
    })
    .catch(error => {
        console.error("Error in geocoding:", error);
        alert("Failed to geocode the destination.");
    });
}