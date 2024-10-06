var received_min=0.5;
var distance,src;
src='ocean.mp3';
var audio,signal;
var stop_signal='false';
var thank_page=document.querySelector('.thank');
let stop = document.querySelector(".stop");
var info_remaining=document.querySelector('.info_remaining')
var map = new MapmyIndia.Map('map', {
    center: [20.5937, 78.9629], 
    zoomControl: true,
    hybrid: true,
    zoom: 5
});

var marker1, marker2;
var latlng1, latlng2;


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
            timeout: 60000, 
            maximumAge: 0 
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

                
                latlng1 = L.latLng(lat, lng);
                map.setView(latlng1, 15);

                
                if (marker1) {
                    map.removeLayer(marker1);
                }
                marker1 = L.marker(latlng1).addTo(map)
                    .bindPopup('You are here!').openPopup();
                    marker1.setLatLng(latlng1);

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


map.on('click', function(e) {
    if (!latlng1) {
        alert("Waiting for your current location...");
    } else if (!marker2) {
       
        latlng2 = e.latlng;
        marker2 = L.marker(latlng2).addTo(map)
            .bindPopup("Selected Location").openPopup();
            setTimeout(()=>{
                scrollToPart();
            },1000);

       
  
    }
});

var polylineLayer;
function calculateDistance() {
    if(stop_signal=='false'){ distance = latlng1.distanceTo(latlng2) / 1000;
  
// setInterval(()=>{
// if(stop_signal=='false'){
//     calculateDistance();
//     console.log(distance);
// }
// },10000)
console.log(distance);

    if (distance < received_min) {
      

         audio = new Audio(src);
        audio.play();
        stop_signal='true';

        setTimeout(() => {
            signal=document.querySelector(".alert_alarm_bar")
           signal.classList.toggle('hidden');
        }, 1000);
    }
if(polylineLayer){
    map.removeLayer(polylineLayer);
}
   
    polylineLayer=L.polyline([latlng1, latlng2], { color: 'blue' }).addTo(map)
        .bindPopup("Distance: " + distance.toFixed(2) + " km").openPopup();
}}

let stop_alarm=document.querySelector(".stop_alarm");
let snooze_alarm=document.querySelector(".snooze_alarm");
stop_alarm.addEventListener("click",()=>{
  audio.pause();
  setTimeout(() => {
    signal.classList.toggle('hidden');
    //
    scrollTop();
    thank_page.classList.toggle('hidden');
   

    
  },500);
})
snooze_alarm.addEventListener("click",()=>{
    audio.pause();
    setTimeout(() => {
        signal.classList.toggle('hidden');
        
      },500);
    setTimeout(() => {
        audio.load();
        audio.play();
      signal.classList.toggle('hidden');
      
    },30000);
  })

// alarm ringtone part hereeee
const options = document.querySelectorAll(".play-pause-icon");
options.forEach((item) => {
  item.addEventListener("click", () => {
    let pause = item.querySelector(".pause");
    let audio = item.querySelector(".audio-file"); // Assuming the audio tag has class "audio-file"

    if (pause.classList.contains("hidden")) {
      audio.play();
    } else {
      audio.pause();
    }
    item.querySelector(".pause").classList.toggle("hidden");
    item.querySelector(".play").classList.toggle("hidden");
  });
});

function scrollToPart() {
    
    let part = document.querySelector('.set_ringtone');
    
    part.scrollIntoView({ behavior: 'smooth' });
}
function scrollTop() {
    
    let part = document.querySelector('.top');
    
    part.scrollIntoView({ behavior: 'smooth' });
}
function scroll_distance() {
    
    let part = document.querySelector('.distance_part');
    
    part.scrollIntoView({ behavior: 'smooth' });
}
function scroll_set_alarm() {
    
    let part = document.querySelector('.submit');
    
    part.scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
    let radios = document.querySelectorAll('input[name="distance"]');
    radios.forEach((radio) => {
        radio.addEventListener('change', () => {
            
            received_min = document.querySelector('input[name="distance"]:checked').value;
            // console.log('Selected distance:', received_min);
            scroll_set_alarm();

        });
    });
});

let submit=document.querySelector(".submit");
submit.addEventListener('click',()=>{
    scrollTop();
    calculateDistance(latlng1, latlng2);
    setInterval(calculateDistance,30000);
    if(distance > received_min){
        info_remaining.classList.toggle('hidden');
        setTimeout(()=>{
            info_remaining.classList.toggle('hidden');
        },3000)
    }
    // if(stop_signal=="true"){
    //     set
    // }
});
let set_ringtone = document.querySelectorAll('.select_ringtone');
set_ringtone.forEach((ringtone) => {
    ringtone.addEventListener('click', () => {
        
        let parentDiv = ringtone.closest('.parent_ring');
        set_ringtone.forEach((otherRingtone) => {
            otherRingtone.classList.remove('bg-cyan-500');
            otherRingtone.classList.remove('shadow-lg');
        });

        ringtone.classList.add('bg-cyan-500');
        ringtone.classList.add('shadow-lg');
        setTimeout(()=>{
            scroll_distance();
        },1000);

        
        if (!parentDiv) {
            console.error('Parent div with class "parent_ring" not found.');
            return; 
        }

       
        let audio = parentDiv.querySelector('.audio-file');
        
       
        if (!audio) {
            console.error('Audio element not found in the parent div.');
            return; 
        }
         src = audio.src.substring(audio.src.lastIndexOf('/') + 1);
        console.log(src); 
    });
});
 document.querySelector(".home_button").addEventListener("click", function() {
   
    setTimeout(()=>{
        thank_page.classList.toggle('hidden');
        scrollTop();
        location.reload();
    },500);
  });























// }
// function expandMap() {
//     let map = document.getElementById("map");

//     if (map.classList.contains("expand")) {
//         // Collapse map back to its original size
//         map.classList.remove("expand");
//         map.style.width = "";  // Reset width to CSS defaults
//         map.style.height = ""; // Reset height to CSS defaults
//         map.style.position = "";
//         map.style.top = "";
//         map.style.left = "";
//         map.style.zIndex = "";

//         // Call map's resize method (for libraries like Leaflet or Mapbox)
//         if (window.mapInstance) {
//             setTimeout(() => {
//                 window.mapInstance.invalidateSize();
//             }, 200); // Slight delay to let styles update
//         }
//     } else {
//         // Expand the map to take full screen
//         map.classList.add("expand");
//         map.style.width = "100vw";
//         map.style.height = "100vh";
//         map.style.position = "fixed";
//         map.style.top = "0";
//         map.style.left = "0";
//         // map.style.zIndex = "9999"; // Bring to top

//         // Resize map for full screen
//         if (window.mapInstance) {
//             setTimeout(() => {
//                 window.mapInstance.invalidateSize();
//             }, 200);
//         }
//     }
// }
    // let remaining=distance-received_min;
    // alert("you are "+remaining+" km away from alarming distance");
    // if(distance<received_min){
    //     alert("you are already closer to destination")
    // }


// let set_ringtone = document.querySelectorAll('.set_ringtone');
// set_ringtone.forEach((ringtone) => {
//     ringtone.addEventListener('click', () => {
//         let parentDiv = ringtone.closest('.parent_ring');
       
//         let audio = parentDiv.querySelector('.audio-file');
       
//             let url = new URL(audio.src);
//             let src = url.pathname.split('/').pop();
//             console.log(src); // Use this variable as needed
       
//     });
// });