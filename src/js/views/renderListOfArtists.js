import {
  listArtists,
  audio,
  discContainerBox,
  discContainer,
  artistName,
  artistTrack,
  trackAlbum,
  artistTrackList,
  collection,
  slideContainer,
  CORS_S,
  next,
  prev,
  audioIcon,
  btnSet,
} from '../config';
import {
  playAudio,
  currentSong,
  controlInitialDataReturn,
  defineNextSong,
  definePrevSong,
  playAudioStatus,
} from '../script';
import { currentSongMarker, chooseSong } from '../model';

const currentSlide = {
  slide: 0,
};

export function renderListOfArtists(data) {
  if (data) {
    listArtists.innerHTML = '';
    [...data].reverse().forEach(item => {
      const markUp = `
          <div class="listArtists__item">
            <div class="poster bg--hidden">
                <img src= "${item.albumCover}">
            </div>
            <div class="textInfo">
                <div class="artistName bg--hidden">
                <p class = "placeTitle">${item.name}</p>
                </div>
                <div class="songTitle bg--hidden ">
                <p class = "placeTitle">${item.trackTitle}</p>
                </div>
            </div>
          </div>
          `;
      listArtists.insertAdjacentHTML('afterbegin', markUp);
      renderArtistTrackList(item.name);
    });
  }
}

export function musicSwitcher(artist) {
  const listItems = document.querySelectorAll('.listArtists__item');
  listItems.forEach((item, i) => {
    item.addEventListener('click', function () {
      audio.setAttribute('src', artist[i].track);
      discContainer.style.background = `url("${artist[i].albumCover}")`;
      artistName.textContent = `${artist[i].name}`;
      artistTrack.textContent = `${artist[i].trackTitle}`;
      trackAlbum.textContent = `From the album: ${artist[i].album}`;
      currentSong.current = i;
      currentSongMarker(currentSong.current);
      stopDiscRotation();
      setTimeout(() => {
        playAudio();
      }, 500);
    });
  });
}

export function renderGrid() {
  collection.classList.add('collection--active');
  listArtists.classList.add('listArtists--active');
}

export function renderArtistTrackList(data) {
  artistTrackList.textContent = `More from ${data}`;
}

export function renderDiscRotation() {
  discContainerBox.classList.add('discContainerBox--active');
}
export function stopDiscRotation() {
  discContainerBox.classList.remove('discContainerBox--active');
}

export function renderSlides(artist) {
  slideContainer.classList.add('slideContainer--active');
  slideContainer.innerHTML = '';
  artist.forEach(item => {
    const markUp = `
      <div class = "slide">
        <img src = "${item.poster}" alt = "poster">
        <div class = "slide__title">${item.name}</div>
      </div>
    `;
    slideContainer.insertAdjacentHTML('afterbegin', markUp);
  });
  const slides = slideContainer.querySelectorAll('.slide');
  renderSlidePosition(slides, currentSlide.slide);
  getDataFromSlide(slides, [...artist].reverse());
}

function renderSlidePosition(slides, current) {
  slides.forEach((item, i) => {
    item.style.transform = `translateX(${100 * (i - current)}%)`;
    item.setAttribute('data-num', i);
  });
}

function nextSlide(slides) {
  currentSlide.slide++;
  if (currentSlide.slide > slides.length - 3) {
    currentSlide.slide = 0;
  }
  renderSlidePosition(slides, currentSlide.slide);
}
function prevSlide(slides) {
  currentSlide.slide--;
  if (currentSlide.slide < 0) {
    currentSlide.slide = slides.length - 2;
  }
  renderSlidePosition(slides, currentSlide.slide);
}

function handleSlidePosition(e) {
  const slides = slideContainer.querySelectorAll('.slide');
  if (slides.length <= 3) return;
  if (e.target.closest('.slide__next')) {
    nextSlide(slides);
  }
  if (e.target.closest('.slide__prev')) {
    prevSlide(slides);
  }
}

// export function renderNewBtns(artistTop, artistAllTracks) {
//   btnSet.innerHTML = '';
//   const markUp = `
//   <div class="btnSet__prev">
//     <i class="fas fa-backward"></i>
//     </div>
//     <div class="btnSet__play">
//       <i class="fas fa-play audioIcon"></i>
//     </div>
//     <div class="btnSet__next">
//       <i class="fas fa-forward"></i>
//     </div>
//   `;
//   btnSet.insertAdjacentHTML('afterbegin', markUp);
//   const audioIcon = btnSet.querySelector('.audioIcon');

//   const next = document.querySelector('.btnSet__next');
//   const prev = document.querySelector('.btnSet__prev');
//   next.addEventListener('click', () => {
//     console.log(playAudioStatus.play);
//     defineNextSong(currentSong, artistTop, artistAllTracks);
//   });
//   prev.addEventListener('click', () => {
//     definePrevSong(currentSong, artistTop, artistAllTracks);
//   });
// }
function getDataFromSlide(slides, artist) {
  slides.forEach((item, i) => {
    item.addEventListener('click', () => {
      slideContainer.classList.remove('slideContainer--active');
      const urlTop = `${CORS_S}${artist[i].trackList.replace(
        'limit=50',
        'limit=5'
      )}`;
      const urlAllTracks = `${CORS_S}${artist[i].trackList.replace(
        'limit=50',
        'limit=15'
      )}`;
      controlInitialDataReturn(urlTop, urlAllTracks);
    });
  });
}

document.body.addEventListener('click', handleSlidePosition);
