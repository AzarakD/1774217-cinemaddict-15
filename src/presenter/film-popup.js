import FilmPopupView from '../view/film-popup.js';
import { render, replace, remove, RenderPosition } from '../utils.js';

export default class FilmPopup {
  constructor(changeData) {
    this._changeData = changeData;

    this._filmPopupContainer = document.querySelector('body');
    this._filmPopupComponent = null;

    this._closePopup = this._closePopup.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmPopupComponent = this._filmPopupComponent;
    this._filmPopupComponent = new FilmPopupView(this._film);
    this._setFilmPopupHandlers();

    if (prevFilmPopupComponent === null) {
      this._renderPopup();
      return;
    }

    if (this._filmPopupContainer.contains(prevFilmPopupComponent.getElement())) {
      replace(this._filmPopupComponent, prevFilmPopupComponent);
    }

    remove(prevFilmPopupComponent);
  }

  get filmPopupComponent() {
    return this._filmPopupComponent;
  }

  get filmId() {
    return this._film.id;
  }

  destroy() {
    this._closePopup();
  }

  _renderPopup() {
    this._filmPopupContainer.classList.add('hide-overflow');
    render(this._filmPopupContainer, this._filmPopupComponent, RenderPosition.BEFOREEND);
    document.addEventListener('keydown', this._onEscKeyDown);
  }

  _closePopup() {
    remove(this._filmPopupComponent);
    this._filmPopupComponent = null;
    this._filmPopupContainer.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closePopup();
    }
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

  _setFilmPopupHandlers() {
    this._filmPopupComponent.setCloseClickHandler(this._closePopup);

    this._filmPopupComponent.setWatchlistClickHandler(() => {
      this._handleWatchlistClick();
    });

    this._filmPopupComponent.setWatchedClickHandler(() => {
      this._handleWatchedClick();
    });

    this._filmPopupComponent.setFavoriteClickHandler(() => {
      this._handleFavoriteClick();
    });
  }
}
