export const container = document.querySelector('.container');
export const [searchBlock, playerContainer] = Array.from(container.children);
export const searchForm = searchBlock.querySelector('.searchForm');
export const searchField = searchForm.querySelector('.searchField');
export const collection = document.querySelector('.collection');
export const listArtists = collection.querySelector('.listArtists');
export const listArtistsItem = listArtists.querySelectorAll(
  '.listArtists__item'
);
export const discContainerBox = collection.querySelector('.discContainer-box');
export const discContainer = discContainerBox.querySelector('.discContainer');
export const audio = document.querySelector('audio');
export const artistName = collection.querySelector('.artistInfo__name');
export const artistTrack = collection.querySelector('.artistInfo__track');
export const trackAlbum = collection.querySelector('.artistInfo__album');
export const next = collection.querySelector('.btnSet__next');
export const prev = collection.querySelector('.btnSet__prev');
export const trackList = collection.querySelector('.openTrackList');
export const artistTrackList = trackList.children[0];
export const slideContainer = container.querySelector('.slideContainer');
export const btnSet = document.querySelector('.btnSet');
export const audioIcon = btnSet.querySelector('.audioIcon');
export const closeIcon = searchBlock.querySelector('.closeIcon');
export const currentSlide = {
  slide: 0,
};
export const artistsPreloadArr = [
  13,
  412,
  47,
  25,
  81,
  4,
  52,
  1,
  8706544,
  1678249,
  92,
  163,
  11,
  2,
  3,
  7,
  8,
  9,
  14,
  17,
  7890702,
  27,
];
export const random = Math.floor(Math.random() * artistsPreloadArr.length);

export const API_URL =
  'https://cors-anywhere.herokuapp.com/https://api.deezer.com/search/artist?q=';
export const CORS_S = 'https://cors-anywhere.herokuapp.com/';

export const API_TOP_URL = `https://cors-anywhere.herokuapp.com/https://api.deezer.com/artist/${artistsPreloadArr[random]}/top`;
export const API_TRACKLIST = `https://cors-anywhere.herokuapp.com/https://api.deezer.com/artist/${artistsPreloadArr[random]}/top?limit=15`;
