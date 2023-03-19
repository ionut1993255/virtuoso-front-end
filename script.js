const pianoKeys = document.querySelectorAll(".piano-keys .key");
volumeSlider = document.querySelector(".volume-slider input");
keysCheckbox = document.querySelector(".keys-checkbox input");
const instrumentSelector = document.querySelector('.instrument-selector');
const displaySongs = document.querySelector('.show-song-list');
const songList = document.querySelector('.song-list');
const btnRecord = document.querySelector('.btn-record');
const btnStopRecord = document.querySelector('.btn-stop-record');
const form = document.querySelector('form');
const input = form.querySelector('input[type="text"]');
const overlay = document.querySelector('.overlay');
const btnSave = document.querySelector('.btn-save');
const btnCancel = document.querySelector('.btn-cancel');
const songUList = document.querySelector('.song-list ul');

let defaultPath = "/tunes/acoustic_grand_piano/"; // By default the instrument is "Acoustic Grand Piano"

let allKeys = [];
let audio = new Audio(defaultPath);

let startTime = 0;
let elapsedTime = 0;
let intervalId;
let notesPlayed = [];

const startChronometer = () => { // Start chronometer
  startTime = new Date().getTime();
  intervalId = setInterval(updateElapsedTime, 100);
}

const stopChronometer = () => { // Stop chronometer
    clearInterval(intervalId);
}

const updateElapsedTime = () => { // Update elapsed time
  const currentTime = new Date().getTime();
  elapsedTime = Math.floor((currentTime - startTime) / 100);
}

const playTune = (key) => {
    audio.src = defaultPath + `${key}.wav`; // Passing audio src based on key pressed 
    audio.play(); // Playing audio

    if(btnRecord.classList.contains('record')) {
        notesPlayed.push(
            {
                "instrument": instrumentSelector.value,
                "note": key,
                "time": elapsedTime
            }
        )
    }

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

const getSongs = () => { // Get the songs from the database through an API call
    fetch("http://127.0.0.1:8000/songs")
    .then((response) => response.text())
    .then((data) =>  
        buildSongList(JSON.parse(data))
    );
}

const buildSongList = (data) => { // Build the song list
    songUList.innerHTML = '';
    data.forEach((song, index) => {
        songUList.appendChild(
            buildSongItem(song['id'], ++index, song['name'], song['length'])
        );
    });
}

let pbStartTime = 0;
let pbElapsedTime = 0;
let pbIntervalId;

const pbStartChronometer = (data) =>{ // Playback start chronometer
  pbStartTime = new Date().getTime();
  pbIntervalId = setInterval(() => pbUpdateElapsedTime(data), 100);
}

const pbStopChronometer = () => { // Playback stop chronometer
    clearInterval(pbIntervalId);
}

const pbUpdateElapsedTime = (data) => { 
  const currentTime = new Date().getTime();
  pbElapsedTime = Math.floor((currentTime - pbStartTime) / 100);
  data.forEach((noteObject, index) => {
    if (noteObject.time === pbElapsedTime) {
        instrumentSelector.value = noteObject.instrument;
        playTune(noteObject.note)
    }
  });
}

const playback = (songId) => {
    fetch(`http://127.0.0.1:8000/notes/${songId}`)
    .then((response) => response.json())
    .then((data) => playSong(data));
}

const playSong = (data) => {
    resetValues();
    pbStartChronometer(data);
}

const buildSongItem = (id, index, name, length) => { // Build the song item
    let child = document.createElement("li");
    child.classList.add("song");
    child.innerHTML =  `<span class="song-title">${index}. ${name}: ${length / 10}s</span>
        <input type="hidden" value=${id}></input>
        <div class="btns-song">
        <button class="btn-play" onClick={playback(${id})}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 24 24"
                strokeWidth="{1.5}"
                stroke="rgb(63, 183, 63)"
                className="w-6 h-6"
                width="0.8rem"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                />
            </svg></button
        ><button class="btn-stop" onClick={pbStopChronometer()}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 24 24"
                strokeWidth="{1.5}"
                stroke="red"
                className="w-6 h-6"
                width="0.8rem"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
                />
            </svg></button
        ><button class="btn-remove" onClick={deleteSong(${id})}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="{1.5}"
                stroke="red"
                className="w-6 h-6"
                width="0.8rem"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
            />
            </svg>
        </button>
    </div>`;

    return child;
}

const displaySong = () => {
    songList.classList.toggle('active'); 
    // Toggling active class from songList when we click the button displaySongs
    getSongs();
}

const record = () => {
    btnRecord.classList.add('record'); // Start recording by pressing the btnRecord
    startChronometer();
}

const stopRecord = () => {
    btnRecord.classList.remove('record'); // Stop recording by pressing the btnStopRecord
    stopChronometer();
}

const showForm = () => {
    form.classList.add('active'); // Display the form after pressing the btnStopRecord
    overlay.classList.add('active'); // Display the overlay between the form & keyboard
    document.removeEventListener("keydown", pressedKey);
}

const saveSong = (e) => { // Save the song by pressing the button Save
    e.preventDefault(); // We prevent the browser default behavior
    if (input.value === "") {
        alert("Name must be filled out");
        return false;
      }

    sendCreateSongRequest(input.value, elapsedTime);
    closePopup();
}

const resetValues = () => {
    input.value='';
    elapsedTime = 0;
    notesPlayed = [];
}

const saveNotes = () => {
    fetch("http://127.0.0.1:8000/notes", {
        method: "POST",
        body: JSON.stringify(notesPlayed),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        }
    });
}

const sendCreateSongRequest = (name, length) => { // Sending create song request through an API call
    fetch("http://127.0.0.1:8000/songs", {
        method: "POST",
        body: JSON.stringify({
            name,
            length
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        }
    })
    .then( saveNotes )
    .then( displaySong() )
    .then( resetValues );
}

const cancelSong = (e) => { // Cancel the song by pressing the button Cancel
    e.preventDefault(); // We prevent the browser default behavior
    closePopup();
    resetValues();
}

const deleteSong = (songId) => {
    resetValues();
    pbStopChronometer();
    fetch(`http://127.0.0.1:8000/songs/${songId}`, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        }
    });
    getSongs()
}

const closePopup = () => {
    form.classList.remove('active'); // Remove the form after pressing the btnCancel
    overlay.classList.remove('active'); // Remove the overlay
    document.addEventListener("keydown", pressedKey);
}

keysCheckbox.addEventListener("click", showHideKeys);
volumeSlider.addEventListener("input", handleVolume);
document.addEventListener("keydown", pressedKey);
instrumentSelector.addEventListener('change', chosenInstrument);
displaySongs.addEventListener('click', displaySong);
btnRecord.addEventListener('click', record);
btnStopRecord.addEventListener('click', stopRecord);
btnStopRecord.addEventListener('click', showForm);
btnSave.addEventListener('click', saveSong);
btnCancel.addEventListener('click', cancelSong);