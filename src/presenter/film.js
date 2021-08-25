import FilmCardView from '../view/film-card.js';
import { render, replace, remove, RenderPosition } from '../utils.js';

export default class Film {
  constructor(container, changeData, createPopup) {
    this._filmContainer = container;
    this._changeData = changeData;
    this._createPopup = createPopup;

    this._filmComponent = null;

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmComponent = this._filmComponent;
    this._filmComponent = new FilmCardView(this._film);
    this._setFilmHandlers();

    if (prevFilmComponent === null) {
      render(this._filmContainer, this._filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._filmContainer.contains(prevFilmComponent.getElement())) {
      replace(this._filmComponent, prevFilmComponent);
    }

    remove(prevFilmComponent);
  }

  get film() {
    return this._film;
  }

  destroy() {
    remove(this._filmComponent);
  }

  _handleFilmCardClick() {
    this._createPopup(this._film);
  }

  _handleWatchlistClick() {
    this._changeData({
      ...this._film, userDetails: {...this._film.userDetails, isInWatchlist: !this._film.userDetails.isInWatchlist},
    });
  }

  _handleWatchedClick() {
    this._changeData({
      ...this._film, userDetails: {...this._film.userDetails, isWatched: !this._film.userDetails.isWatched},
    });
  }

  _handleFavoriteClick() {
    this._changeData({
      ...this._film, userDetails: {...this._film.userDetails, isFavorite: !this._film.userDetails.isFavorite},
    });
  }

  _setFilmHandlers() {
    this._filmComponent.setOpenClickHandler(this._handleFilmCardClick);
    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);
  }
}
