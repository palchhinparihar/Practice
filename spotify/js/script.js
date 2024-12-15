console.log("Starting with JS!");
let currentSong = new Audio();
let songs, currFolder;

// Converts seconds to "MM:SS" format
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// Fetches songs from the specified folder and populates the playlist
async function getSongs(folder) {
    currFolder = folder;

    // Fetch folder contents
    let a = await fetch(`http://127.0.0.1:5500/spotify/${folder}/`);
    let response = await a.text();

    // Parse the response to extract song links
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');

    // Filter out .mp3 files and store them in the songs array
    songs = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

    // Populate the song list in the UI
    let songUL = document.querySelector('.songList').getElementsByTagName('ul')[0];
    songUL.innerHTML = "";

    for (const song of songs) {
        songUL.innerHTML +=
        `
        <li>
            <img class="invert" src="img/music.svg" alt="music">
            <div class="info">
                <div>${song}</div>
                <div>Harry</div>
            </div>
            <div class="playnow flex justify-center items-center">
                <span>Play Now</span>
                <img class="invert" src="img/play.svg" alt="music">
            </div>
        </li>
        `;
    }

    // Attach event listeners to each song for playing on click
    Array.from(document.querySelector('.songList').getElementsByTagName("li")).forEach(e => {
        e.addEventListener('click', element => {
            music = e.querySelector(".info").firstElementChild.innerHTML.trim();
            playMusic(music);
        });     
    }); 

    return songs;
}

// Plays the selected track
const playMusic = (track, pause = false) => {
    currentSong.src = `http://127.0.0.1:5500/spotify/${currFolder}/` + track;

    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg";
    } 
    
    // Update song information on the UI
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
}

// Displays album cards on the page
async function displayAlbums() {
    // Fetch album folders
    let a = await fetch(`http://127.0.0.1:5500/spotify/songs/`);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    // Parse album folders and populate the card UI
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");

    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
        if (e.href.includes("/songs/")) {
            let folder = e.href.split("/").slice(-2)[1];

            // Fetch metadata for each folder
            let a = await fetch(`http://127.0.0.1:5500/spotify/songs/${folder}/info.json`);
            let response = await a.json();

            // Add album card to the UI
            cardContainer.innerHTML += `
                <div data-folder="${folder}" class="card">
                    <div class="play">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5" stroke-linejoin="round"></path>
                        </svg>
                    </div>

                    <img src="/spotify/songs/${folder}/cover.jpg" alt="${folder}-playlist">
                    <h3>${response.title}</h3>
                    <p>${response.description}</p>
                </div>    
            `;
        }
    }

    // Attach event listeners to each album card to load its playlist
    Array.from(document.getElementsByClassName('card')).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0]);
        });
    });
}

// Main function to initialize the player and event listeners
async function main() {
    // Load initial playlist and play the first song
    await getSongs("songs/ncs");
    playMusic(songs[0], true);

    // Display all albums on the page
    displayAlbums();

    // Play/Pause button functionality
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
        } else {
            currentSong.pause();
            play.src = "img/play.svg";
        }
    });

    // Update song progress bar and time
    currentSong.addEventListener("timeupdate", (a) => {
        document.querySelector(".songtime").innerHTML =
        `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;

        let circle = document.querySelector(".circle");
        circle.style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    // Seek functionality
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100 ;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    // Hamburger menu functionality
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    // Previous song functionality
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        let previousIndex = index - 1;

        if (previousIndex >= 0) {
            playMusic(songs[previousIndex]);
        }
    });

    // Next song functionality
    next.addEventListener("click", () => {
        currentSong.pause();
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        let nextIndex = index + 1;

        if (nextIndex < songs.length) {
            playMusic(songs[nextIndex]);
        }
    });

    // Volume control functionality
    document.querySelector(".range").getElementsByTagName('input')[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
    });

    // Mute/Unmute functionality
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes('img/volume.svg')) {
            e.target.src = "img/mute.svg";
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName('input')[0].value = 0;
        } else {
            e.target.src = "img/volume.svg";
            currentSong.volume = 0.1;
            document.querySelector(".range").getElementsByTagName('input')[0].value = 10;
        }
    });
}

main();
