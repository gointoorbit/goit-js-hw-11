import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash.throttle';

const searcher = document.querySelector('input');
const searchBtn = document.querySelector('button');
const gallery = document.querySelector('.gallery');
// const loadMoreBtn = document.querySelector('.load-more-button');
// const buttonWrapper = document.querySelector('.button-wrapper');
let searchValue;
let pageNumber = 1;
let numberOfPages;
let photosArray;

const fetchPhotos = async event => {
  event.preventDefault();
  // buttonWrapper.classList.add('invisible');
  searchValue = searcher.value;
  console.log(searchValue);
  let searchParams = new URLSearchParams({
    key: '40029765-d3979f765e8685f4729db0a6b',
    q: searchValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: pageNumber,
  });
  const response = await axios.get(`https://pixabay.com/api/?${searchParams}`);
  photosArray = response.data.hits;
  if (photosArray.length >= 1) {
    Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
    pageNumber += 1;
    numberOfPages = Math.ceil(response.data.totalHits / 40);
    renderGallery(photosArray);
    // buttonWrapper.classList.remove('invisible');
    return { searchValue, pageNumber, numberOfPages };
  } else {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
};

const renderGallery = photosArray => {
  for (let photo of photosArray) {
    const markup = `<div class="photo-card"><a class="gallery-item" href="${photo.largeImageURL}"><img src="${photo.webformatURL}" data-source="${photo.largeImageURL}" alt="${photo.tags}" loading="lazy"/><div class="info"><p class="info-item"><b class="info-label">Likes</b>${photo.likes}</p><p class="info-item"><b class="info-label">Views</b>${photo.views}</p><p class="info-item"><b class="info-label">Comments</b>${photo.comments}</p><p class="info-item"><b class="info-label">Downloads</b>${photo.downloads}</p></div></a></div>`;
    gallery.insertAdjacentHTML('beforeend', markup);
  }
  const modalBox = new SimpleLightbox('.gallery-item', {
    nav: true,
    close: true,
  });
};

const fetchMorePhotos = async event => {
  if (pageNumber <= numberOfPages) {
    let searchParams = new URLSearchParams({
      key: '40029765-d3979f765e8685f4729db0a6b',
      q: searchValue,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: pageNumber,
    });
    const response = await axios.get(
      `https://pixabay.com/api/?${searchParams}`
    );
    pageNumber += 1;
    photosArray = response.data.hits;
    renderGallery(photosArray);

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    return pageNumber;
  } else {
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
};

const resetGallery = () => {
  gallery.innerHTML = '';
};

const infiniteScroll = () => {
  let windowRelativeBottom =
    document.documentElement.getBoundingClientRect().bottom;
  if (windowRelativeBottom <= document.documentElement.clientHeight + 100) {
    fetchMorePhotos();
  }
};

searchBtn.addEventListener('click', fetchPhotos);
// loadMoreBtn.addEventListener('click', fetchMorePhotos);
searchBtn.addEventListener('click', resetGallery);
searcher.addEventListener('input', () => {
  return (pageNumber = 1);
});
window.addEventListener('scroll', throttle(infiniteScroll, 250));
