import 'regenerator-runtime/runtime';
import 'core-js/stable';
import {
  searchField,
  audio,
  prev,
  next,
  artistTrackList,
  slideContainer,
  API_TOP_URL,
  API_TRACKLIST,
  searchForm,
  closeIcon,
} from './config';
import {
  data,
  getSearchFieldValues,
  getDataFromApi,
  getTopTrack,
  setAudioAttr,
  closeInputValue,
} from './model';
import {
  renderListOfArtists,
  musicSwitcher,
  renderDiscRotation,
  stopDiscRotation,
  renderSlides,
  renderNewBtns,
} from './views/renderListOfArtists';

export const playAudioStatus = {
  play: false,
};

export const currentSong = {
  current: 0,
  list: false,
  slideOpen: false,
};

async function controlPlayListOnInput(e) {
  e.preventDefault();
  const value = searchField.value;
  const response = await getDataFromApi(data, value.toLowerCase());
  const { newData } = response;
  searchField.value = '';
  closeIcon.classList.remove('closeIcon--active');
  renderSlides([...newData.artist].reverse());
}

searchForm.addEventListener('submit', controlPlayListOnInput);

audio.addEventListener('ended', stopDiscRotation);

export async function controlInitialDataReturn(url1, url2) {
  const { artistTop, artistAllTracks } = await getTopTrack(data, url1, url2);
  renderListOfArtists(artistTop);
  musicSwitcher(artistTop);
  setAudioAttr(artistTop, currentSong.current);
  artistTrackList.addEventListener('click', e => {
    currentSong.list = true;
    e.preventDefault();
    renderListOfArtists(artistAllTracks);
    musicSwitcher(artistAllTracks);
    setAudioAttr(artistAllTracks, currentSong.current);
    stopDiscRotation();
  });
  chooseSong(artistTop, artistAllTracks);
}
controlInitialDataReturn(API_TOP_URL, API_TRACKLIST);

export function chooseSong(artistTop, artistAllTracks) {
  next.addEventListener('click', () => {
    defineNextSong(currentSong, artistTop, artistAllTracks);
  });
  prev.addEventListener('click', () => {
    definePrevSong(currentSong, artistTop, artistAllTracks);
  });
  audio.addEventListener('ended', function () {
    setTimeout(() => {
      defineNextSong(currentSong, artistTop, artistAllTracks);
    }, 800);
  });
}

export function defineNextSong(obj, listTop, listAll) {
  return obj.list ? nextSong(obj, listAll) : nextSong(obj, listTop);
}
export function definePrevSong(obj, listTop, listAll) {
  return obj.list ? prevSong(obj, listAll) : prevSong(obj, listTop);
}

const slides = document.querySelectorAll('.slide');
const audioIcon = document.querySelector('.audioIcon');
const progressBarContainer = document.querySelector('.progressBarContainer');
const progressBar = progressBarContainer.querySelector('.progressBar');
const timeContainer = document.querySelector('.timeContainer');

const slideMid = Math.floor(slides.length / 2);
function displaySlide(num) {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i - num)}%)`;
  });
}
displaySlide(slideMid);

export function playAudio() {
  playAudioStatus.play = true;
  renderDiscRotation();
  audio.play();
  audioIcon.classList.replace('fa-play', 'fa-pause');
}
export function pauseAudio() {
  playAudioStatus.play = false;
  stopDiscRotation();
  audio.pause();
  audioIcon.classList.replace('fa-pause', 'fa-play');
}
export function handleClickAudioPlay(e) {
  if (e.target.closest('.btnSet__play')) {
    playAudioStatus.play ? pauseAudio() : playAudio();
  }
}

function getCurrentDurationTime(elem) {
  const minutes = `${Math.floor(elem / 60)}`.padStart(2, '0');
  const seconds = `${Math.floor(elem % 60)}`.padStart(2, '0');
  return { minutes, seconds };
}

function trackAudioProgress(e) {
  const { currentTime, duration } = e.srcElement;

  const width = (currentTime / duration) * 100;
  progressBar.style.width = `${width}%`;
  const [current_time, duration_time] = Array.from(timeContainer.children);
  const currObj = getCurrentDurationTime(currentTime);
  const durObj = getCurrentDurationTime(duration);
  current_time.innerText = `${currObj.minutes}:${currObj.seconds}`;
  if (durObj.minutes !== 'NaN') {
    duration_time.innerText = `${durObj.minutes}:${durObj.seconds}`;
  }
}
function handleTimeUpdate(e) {
  if (playAudioStatus.play) {
    trackAudioProgress(e);
  }
}
function handleClickPogressBar(e) {
  const width = this.clientWidth;
  const { duration } = audio;
  const pointWidth = e.offsetX;
  const time = (pointWidth / width) * duration;
  audio.currentTime = time;
}

export function nextSong(obj, data) {
  obj.current++;
  if (obj.current > data.length - 1) {
    obj.current = 0;
  }

  setAudioAttr(data, obj.current);
  if (playAudioStatus.play) {
    stopDiscRotation();
    setTimeout(() => {
      playAudio();
    });
  }
}
export function prevSong(obj, data) {
  obj.current--;
  if (obj.current < 0) {
    obj.current = data.length - 1;
  }
  setAudioAttr(data, obj.current);
  if (playAudioStatus.play) {
    stopDiscRotation();
    setTimeout(() => {
      playAudio();
    });
  }
}

document.body.addEventListener('click', handleClickAudioPlay);
audio.addEventListener('timeupdate', handleTimeUpdate);
progressBarContainer.addEventListener('click', handleClickPogressBar);
searchField.addEventListener('input', closeInputValue);
