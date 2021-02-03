import { async } from 'regenerator-runtime';

import {
  searchField,
  audio,
  discContainer,
  artistName,
  artistTrack,
  trackAlbum,
  API_URL,
  closeIcon,
} from './config';
import { getJSON } from './helpers';
import { chooseSong, currentSong } from './script';

export const data = {
  artistTop: [],
  artistAllTracks: [],
  artist: [],
};

export async function getDataFromApi(data, value) {
  const apiData = await getJSON(`${API_URL}${value}`);
  const newData = { ...data };
  const filteredData = apiData.data.filter(item => {
    return item.nb_album > 0 && item.nb_fan > 1000;
  });
  filteredData.forEach(elem => {
    newData.artist = [
      ...newData.artist,
      {
        id: elem.id,
        name: elem.name,
        poster: elem.picture_big,
        fans: elem.nb_fan,
        trackList: elem.tracklist,
      },
    ];
  });
  return {
    newData,
  };
}

export async function getTopTrack(data, urlTop, urlList) {
  const newData = { ...data };
  const [topFive, artistTrackList] = await Promise.all([
    await getJSON(urlTop),
    await getJSON(urlList),
  ]);

  topFive.data.forEach(item => {
    newData.artistTop = [
      ...newData.artistTop,
      {
        id: item.artist.id,
        album: item.album.title,
        albumCover: item.album.cover_medium,
        name: item.artist.name,
        trackTitle: item.title_short,
        track: item.preview,
      },
    ];
  });
  artistTrackList.data.forEach(item => {
    newData.artistAllTracks = [
      ...newData.artistAllTracks,
      {
        id: item.artist.id,
        album: item.album.title,
        albumCover: item.album.cover_medium,
        name: item.artist.name,
        trackTitle: item.title_short,
        track: item.preview,
      },
    ];
  });
  return newData;
}
export async function getDataInputChange(data) {}
getDataInputChange(data);
export function currentSongMarker(current) {
  const artistItems = document.querySelectorAll('.listArtists__item');
  artistItems.forEach((item, i) => {
    item.classList.remove('listArtists__item--active');
  });
  artistItems[current].classList.add('listArtists__item--active');
}

export function setAudioAttr(artist, current) {
  const newArtistList = [...artist];
  audio.setAttribute('src', newArtistList[current].track);
  discContainer.style.background = `url("${newArtistList[current].albumCover}")`;
  artistName.textContent = `${newArtistList[current].name}`;
  artistTrack.textContent = `${newArtistList[current].trackTitle}`;
  trackAlbum.textContent = `From the album: ${newArtistList[current].album}`;
  currentSongMarker(current);

  return newArtistList;
}

export function closeInputValue() {
  closeIcon.classList.add('closeIcon--active');
  closeIcon.addEventListener('click', () => {
    this.value = '';
    closeIcon.classList.remove('closeIcon--active');
  });
}
