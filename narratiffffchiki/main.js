let now_playing = document.querySelector(".now-playing");
let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");

let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");

let track_index = 0;
let isPlaying = false;
let updateTimer;

let cur_time_visible = false;

let language = "ru"

// Create new audio element
let curr_track = document.createElement('audio');

// Define the tracks that have to be played
let track_list = [
  {
    name: "Правды больше нет!",
    artist: "New Sylveon",
    path: "./audio/01. New Sylveon - Правды больше нет!.mp3",
    duration: 120,
    stems: "https://drive.google.com/file/d/1vzZcA4hofagZ0uPkCaU5vMwO_oBm9sL4/view?usp=drive_link"
  },
  {
    name: "Завтрашнее настоящее",
    artist: "New Sylveon",
    path: "./audio/02. New Sylveon - Завтрашнее настоящее.mp3",
    duration: 130,
    stems: "https://drive.google.com/file/d/1ZyYLLg7al0BU0FYJ5k56YeIW8XyhK5tH/view?usp=drive_link"
  },
  {
    name: "Bakugan Fight Club",
    artist: "New Sylveon",
    path: "./audio/03. New Sylveon - Bakugan Fight Club.mp3",
    duration: 193,
    stems: "https://drive.google.com/file/d/13eVEtwZeCt5WL8bNzU6FQSQOWijaxhGR/view?usp=drive_link"
  },
  {
    name: "Прокрастинация",
    artist: "New Sylveon",
    path: "./audio/04. New Sylveon - Прокрастинация.mp3",
    duration: 126,
    stems: "https://drive.google.com/file/d/1FQvYBObvKP5KPTfl98cIKaTGh-nShPSQ/view?usp=drive_link"
  },
  {
    name: "Ковёр",
    artist: "New Sylveon",
    path: "./audio/05. New Sylveon - Ковёр.mp3",
    duration: 97,
    stems: "https://drive.google.com/file/d/16opWmMNIQuBGFlLpbjxSyLfdicLTw6fH/view?usp=drive_link"
  },
  {
    name: "Black pill",
    artist: "New Sylveon, дима фефилов",
    path: "./audio/06. New Sylveon feat. дима фефилов - Black pill.mp3",
    duration: 158,
    stems: "https://drive.google.com/file/d/1CZkaJqrpiIs80pXtlM4i6Z5hy1DK2ScZ/view?usp=drive_link"
  },
  {
    name: "Ты не получишь ничего!",
    artist: "New Sylveon",
    path: "./audio/07_New_Sylveon_Ты_не_получишь_ничего!.mp3",
    duration: 122,
    stems: "https://drive.google.com/file/d/1hsXDeyRuX-dXflYfUycTkIm3BqWbAarT/view?usp=drive_link"
  },
  {
    name: "Мы вам перезвоним",
    artist: "New Sylveon, кот курит",
    path: "./audio/08_New_Sylveon_feat_кот_курит_Мы_вам_перезвоним.mp3",
    duration: 121,
    stems: "https://drive.google.com/file/d/1NXJy70mJbajVQcVDPOwnOdKbZdb20XhA/view?usp=drive_link"
  },
  {
    name: "Как нас съели этим летом",
    artist: "New Sylveon",
    path: "./audio/09_New_Sylveon_Как_нас_съели_этим_летом.mp3",
    duration: 126,
    stems: "https://drive.google.com/file/d/1kxhiy7nz6-cv5pnFIyFvDEejElLqBKUb/view?usp=drive_link"
  },
  {
    name: "Жить (Казалось че-то понял)",
    artist: "New Sylveon",
    path: "./audio/10_New_Sylveon_Жить_Казалось_че_то_понял.mp3",
    duration: 166,
    stems: "https://drive.google.com/file/d/18cCp9Ush1YOna07Owo_ECLpbCidGbjM4/view?usp=drive_link"
  },
  {
    name: "Дуров верни детство(((",
    artist: "New Sylveon",
    path: "./audio/11. New Sylveon - Дуров верни детство(((.mp3",
    duration: 158,
    stems: "https://drive.google.com/file/d/1LV_-6wefsXBn1W1pXCzE_iiT7KkhAipa/view?usp=drive_link"
  },
];

let total_duration = 0;
let cur_duration = 0;

let completion_time = [0];

const duration_element = document.querySelector('.list-duration');

function loadTrack(track_index) {

  const details = document.querySelector('.track-details-inside');

  const stemsElement = document.querySelector('.stems');

  clearInterval(updateTimer);
  resetValues();
  curr_track.src = track_list[track_index].path;
  curr_track.load();
  
  track_name.textContent = track_list[track_index].name;
  track_artist.textContent = track_list[track_index].artist;
  
  seekUpdate();
  updateTimer = setInterval(seekUpdate, 1000);
  curr_track.addEventListener("ended", nextTrack);

  cur_time_visible = true;
  changeTimeVisibility();

  details.classList.remove("marquee");
  setTimeout(function(){
    details.classList.add("marquee");
  }, 1);

  stemsElement.innerHTML = '<a href=\"' + track_list[track_index].stems + '\" target=\"_blank\">Stems</a>';
}

function changeTimeVisibility(){
  const icon = document.querySelector('.player-playpause');
  const audio_visual = document.querySelector('.audio-visual')

  if(cur_time_visible) icon.classList.add('visible')
    else icon.classList.remove('visible');

  if(isPlaying) {
    icon.innerHTML = '<img class="playpause-icon" src="img/player/player-play-red.png" alt="">';
    audio_visual.innerHTML = '<img class="playpause-icon" src="img/player/playerplaying.gif" alt="">';
  } else{
      icon.innerHTML = '<img class="playpause-icon" src="img/player/player-pause-red.png" alt="">';
      audio_visual.innerHTML = '<img class="playpause-icon" src="img/player/notplaying.png" alt="">';
    };
};

function resetValues() {
  curr_time.textContent = "00:00";
  seek_slider.value = 0;
}

// Load the first track in the tracklist
loadTrack(track_index);
loadTrackList();
fetchLyrics();
seekUpdate();

function loadTrackList(){
  let listElement = document.querySelector('.track-list');

  for (let i = 0; i < track_list.length; i++) {
    const fragment = document.createDocumentFragment();
    let digits = '0'

    let trackDiv = document.createElement("div")
    trackDiv.classList.add('track')

    if (i > 8) digits = '';

    let trackNameDiv = document.createElement("div")
    trackNameDiv.classList.add('track-name')
    trackNameDiv.textContent = digits + (i + 1).toString() + ". " + track_list[i].name;

    let trackDurationDiv = document.createElement("div")
    trackDurationDiv.classList.add('track-duration')

    let durationDigits = '0';
    let completionDigits = '0';
    
    if(track_list[i].duration % 60 >= 10) durationDigits = '';
    
    total_duration += track_list[i].duration
    trackDurationDiv.textContent = Math.floor(track_list[i].duration/60) + ':' + durationDigits +  track_list[i].duration % 60;
    
    completion_time[i] =  ~~completion_time[i - 1] + track_list[i].duration;
    
    fragment.appendChild(trackDiv).appendChild(trackNameDiv).parentElement.appendChild(trackDurationDiv);
    
    listElement.appendChild(fragment);
  }
  setCurTrack();
}

function setCurTrack(){
  let trackList = document.querySelectorAll('.track');

  trackList.forEach((a) => {
    if (Array.from(trackList).indexOf(a) == track_index) a.classList.add('cur-playing')
    else a.classList.remove('cur-playing');
  });
}

let trackListElements = document.querySelectorAll('.track');

trackListElements.forEach((button, index) => {
  button.addEventListener("click", (event) => {
    track_index = index
    loadTrack(track_index);
    playTrack();
  });
});

function playTrack() {
  curr_track.play();
  isPlaying = true;

  fetchLyrics();
  setCurTrack();
  cur_time_visible = true;
  changeTimeVisibility();
}

function pauseTrack() {
  curr_track.pause();
  isPlaying = false;
  playpause_btn.innerHTML = '<img src="img/player/player-play.png" alt="">';
  cur_time_visible = false;
  changeTimeVisibility();
}

function stopTrack(){
  loadTrack(track_index);
  isPlaying = false;
  seekUpdate();
  cur_time_visible = false;
  changeTimeVisibility();
} 

function dropDown(a){
  console.log(a);
}

function shuffleTrack(){
  let num = Math.floor(Math.random() * track_list.length)
  if(num != track_index) track_index = num
  else shuffleTrack();
}

function nextTrack() {
  if (track_index < track_list.length - 1){
    if (shuffle.checked && !repeat.checked){
      shuffleTrack();
    } else track_index += 1 * !repeat.checked;
  }
  else track_index = 0;
  loadTrack(track_index);
  playTrack();
}

function prevTrack() {
  if (track_index > 0)
    track_index -= 1;
  else track_index = track_list.length - 1;
  loadTrack(track_index);
  playTrack();
}

function fetchLyrics(){
  fetch("lyrics/" + track_index + "_" + language + ".txt")
  .then((res) => res.text())
  .then((text) => {
    document.querySelector('.lyrics').innerHTML = text
  })
}

function changeLang(lang){
  language = lang;
  fetchLyrics();
}

function seekTo() {
  let seekto = curr_track.duration * (seek_slider.value / 100);
  curr_track.currentTime = seekto;
}

function setVolume() {
  const volume_meter = document.querySelector('.volume-meter');
  let volume = volume_slider.value / 100;

  curr_track.volume = volume;
  volume_meter.textContent = 'Volume: ' + Math.floor(volume * 100) + '%';
}

function seekUpdate() {
  let seekPosition = 0;

  if (!isPlaying){
    if (cur_time_visible) cur_time_visible = false
    else cur_time_visible = true;
  } else cur_time_visible;

  changeTimeVisibility();

  if (!isNaN(curr_track.duration)) {
    seekPosition = curr_track.currentTime * (100 / curr_track.duration);

    seek_slider.value = seekPosition;

    let currentMinutes = Math.floor(curr_track.currentTime / 60);
    let currentSeconds = Math.floor(curr_track.currentTime % 60);
    let durationMinutes = Math.floor(curr_track.duration / 60);
    let durationSeconds = Math.floor(curr_track.duration % 60);

    if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
    if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
    if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
    if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

    curr_time.textContent = currentMinutes + ":" + currentSeconds;
  }

  let duration_cur_time = ~~completion_time[track_index -1] + curr_track.currentTime;

  let digits = '0'

  if ((duration_cur_time % 60) >= 10) digits = ''

  duration_element.textContent = Math.floor(duration_cur_time/60) + ':' + digits + Math.floor((duration_cur_time % 60)) + '/' + Math.floor(total_duration / 60) + ':' + (total_duration % 60);
}

if (!('ontouchstart' in window)) {
  const cursor = document.createElement('div');
  cursor.id = 'cursor';
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
  });

  document.body.style.cursor = 'none';

  document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
  });

  const pointerElements = document.querySelectorAll('button, [cursor="pointer"], .clickable');
    pointerElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('pointer'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('pointer'));
  })
}