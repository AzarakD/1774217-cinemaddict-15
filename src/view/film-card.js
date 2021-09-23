import AbstractView from './abstract.js';
import { getHoursAndMinutes, formatDate } from '../utils/utils.js';

const LAST_CHAR_NUMBER = 4;
const TextLength = {
  MIN: 0,
  MAX: 140,
};

const createFilmCardTemplate = ({filmInfo, comments, userDetails}) => (
  `<article class="film-card">
    <h3 class="film-card__title">${filmInfo.title}</h3>
    <p class="film-card__rating">${filmInfo.rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${formatDate(filmInfo.releaseDate).slice(-LAST_CHAR_NUMBER)}</span>
      <span class="film-card__duration">${getHoursAndMinutes(filmInfo.runtime)}</span>
      <span class="film-card__genre">${filmInfo.genres[0]}</span>
    </p>
    <img src="./${filmInfo.poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${filmInfo.description.length < TextLength.MAX ? filmInfo.description : `${filmInfo.description.slice(TextLength.MIN, TextLength.MAX)}...`}</p>
    <a class="film-card__comments">${comments.length} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist${userDetails.isInWatchlist ? ' film-card__controls-item--active' : ''}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched${userDetails.isWatched ? ' film-card__controls-item--active' : ''}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite${userDetails.isFavorite ? ' film-card__controls-item--active' : ''}" type="button">Mark as favorite</button>
    </div>
  </article>`
);

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;

    this._openClickHandler = this._openClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _openClickHandler(evt) {
    evt.preventDefault();
    this._callback.openClick();
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setOpenClickHandler(callback) {
    this._callback.openClick = callback;
    this.getElement().querySelectorAll('.film-card__poster, .film-card__title, .film-card__comments')
      .forEach((element) => element.addEventListener('click', this._openClickHandler));
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._watchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._favoriteClickHandler);
  }
}
