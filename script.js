const pianoKeys = document.querySelectorAll(".piano-keys .key");
volumeSlider = document.querySelector(".volume-slider input");
keysCheckbox = document.querySelector(".keys-checkbox input");
const instrumentSelector = document.querySelector('.instrument-selector');
const displaySongs = document.querySelector('.show-song-list');
const songList = document.querySelector('.song-list');
const btnRecord = document.querySelector('.btn-record');
const btnStopRecord = document.querySelector('.btn-stop-record');

let defaultPath = "/tunes/acoustic_grand_piano/"; // By default the instrument is "Acoustic Grand Piano"

let allKeys = [];
let audio = new Audio(defaultPath);

const playTune = (key) => {
    audio.src = defaultPath + `${key}.wav`; // Passing audio src based on key pressed 
    audio.play(); // Playing audio

    const clickedKey = document.querySelector(`[data-key="${key}"]`); // Getting clicked key element
    clickedKey.classList.add("active"); // Adding active class to the clicked key element
    setTimeout(() => { // Removing active class after 150 ms from the clicked key element
        clickedKey.classList.remove("active");
    }, 150);
}

pianoKeys.forEach(key => {
    allKeys.push(key.dataset.key); // Adding data-key value to the allKeys array
    // Calling playTune function with passing data-key value as an argument
    key.addEventListener("click", () => playTune(key.dataset.key));
});

const handleVolume = (e) => {
    audio.volume = e.target.value; // Passing the range slider value as an audio volume
}

const showHideKeys = () => {
    // Toggling hide class from each key on the checkbox click
    pianoKeys.forEach(key => key.classList.toggle("hide"));
}

const pressedKey = (e) => {
    // If the pressed key is in the allKeys array, only call the playTune function
    if(allKeys.includes(e.key)) playTune(e.key);
}

const chosenInstrument = (e) => {
    // Chosen instrument based on selected input
    defaultPath = '/tunes/' + e.target.value + "/";
}

const displaySong = () => {
    songList.classList.toggle('active'); 
    // Toggling active class from songList when we click the button displaySongs
}

const record = () => {
    btnRecord.classList.add('record'); // Start recording by pressing the btnRecord
}

const stopRecord = () => {
    btnRecord.classList.remove('record'); // Stop recording by pressing the btnStopRecord
}

keysCheckbox.addEventListener("click", showHideKeys);
volumeSlider.addEventListener("input", handleVolume);
document.addEventListener("keydown", pressedKey);
instrumentSelector.addEventListener('change', chosenInstrument);
displaySongs.addEventListener('click', displaySong);
btnRecord.addEventListener('click', record);
btnStopRecord.addEventListener('click', stopRecord);