let audio=new Audio("bus_trial_music.mp3");
function playAudio(){
    audio.play();
}
function pauseAudio(){
    audio.pause();
   setTimeout(()=>{
    if(true){
        playAudio();
    }
   },2000)
}
