import { createElement } from '../utils';

const createFilmCardTemplate = ({filmInfo, comments, userDetails}) => (
  `<article class="film-card">
    <h3 class="film-card__title">${filmInfo.title}</h3>
    <p class="film-card__rating">${filmInfo.rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${filmInfo.releaseDate.substr(-4)}</span>
      <span class="film-card__duration">${filmInfo.runtime}</span>
      <span class="film-card__genre">${filmInfo.genres.join(', ')}</span>
    </p>
    <img src="./${filmInfo.poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${filmInfo.description.length < 140 ? filmInfo.description : `${filmInfo.description.slice(0, 140)}...`}</p>
    <a class="film-card__comments">${comments.length} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist${userDetails.isInWatchlist ? ' film-card__controls-item--active' : ''}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched${userDetails.isWatched ? ' film-card__controls-item--active' : ''}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite${userDetails.isFavorite ? ' film-card__controls-item--active' : ''}" type="button">Mark as favorite</button>
    </div>
  </article>`
);

export default class FilmCard {
  constructor(film) {
    this._element = null;
    this._film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
