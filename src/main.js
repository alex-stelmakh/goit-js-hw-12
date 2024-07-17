import {
  inputPictures,
  errorParams,
  showLoading,
  hideLoading,
  hideLoadMore,
  showLoadMore,
  disableLoadMore,
  enableLoadMore,
} from './js/render-functions';
import { fetchParams } from './js/pixabay-api';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const formSearch = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery-container');
const loading = document.querySelector('.loading');
const btnLoad = document.querySelector('.btn-load');

const params = {
  q: '',
  page: 1,
  per_page: 15,
  maxPage: 0,
};
hideLoadMore(btnLoad);

formSearch.addEventListener('submit', getPictureByValue);

async function getPictureByValue(evt) {
  evt.preventDefault();
  gallery.innerHTML = '';
  params.page = 1;
  const form = evt.currentTarget;

  params.q = form.elements.insert.value.toLowerCase().trim();

  if (!params.q) {
    hideLoading();
    return errorParams();
    form.reset();
  }

  showLoading();
  showLoadMore(btnLoad);
  disableLoadMore(btnLoad);

  try {
    const { hits, totalHits } = await fetchParams(params);
    inputPictures(hits);

    params.maxPage = Math.ceil(totalHits / params.per_page);
    if (hits.length > 0 && hits.length !== totalHits) {
      enableLoadMore(btnLoad);
      btnLoad.addEventListener('click', handleBtnLoad);
    } else {
      hideLoadMore(btnLoad);
    }

    const itemsScroll = gallery.getBoundingClientRect().height * 2;
    window.scrollBy({
      top: itemsScroll,
      behavior: 'smooth',
    });
  } catch (err) {
    errorParams(err);
  }
  form.reset();
}

async function handleBtnLoad() {
  params.page += 1;
  disableLoadMore(btnLoad);
  showLoading();

  try {
    const { hits } = await fetchParams(params);
    inputPictures(hits);
  } catch (err) {
    errorParams(err);
  } finally {
    hideLoading();
    enableLoadMore(btnLoad);

    if (params.page === params.maxPage) {
      hideLoadMore(btnLoad);
      btnLoad.removeEventListener('click', handleBtnLoad);
      iziToast.info({
        position: 'topRight',
        title: '',
        message:
          'We are sorry, but you have reached the end of search results.',
      });
    }
  }
}

