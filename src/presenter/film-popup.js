import FilmPopupView from '../view/film-popup.js';
import PopupCommentView from '../view/popup-comment.js';
import { render, remove, RenderPosition } from '../utils.js';

export default class FilmPopup {
  constructor(changeData) {
    this._changeData = changeData;

    this._filmPopupContainer = document.querySelector('body');

    this._closePopup = this._closePopup.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  init(film) {
    this._film = film;

    this._filmPopupComponent = new FilmPopupView(this._film);
    this._popupCommentComponent = new PopupCommentView(this._film);

    this._setFilmPopupHandlers();
    this._renderPopup();
  }

  destroy() {
    this._closePopup();
  }

  _renderPopup() {
    this._filmPopupContainer.classList.add('hide-overflow');

    render(this._filmPopupContainer, this._filmPopupComponent, RenderPosition.BEFOREEND);
    render(this._filmPopupComponent.commentContainer, this._popupCommentComponent, RenderPosition.BEFOREEND);

    document.addEventListener('keydown', this._onEscKeyDown);
  }

  _closePopup() {
    remove(this._filmPopupComponent);
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
    this._film = {
      ...this._film, userDetails: {...this._film.userDetails, isInWatchlist: !this._film.userDetails.isInWatchlist},
    };
    this._changeData(this._film);
  }

  _handleWatchedClick() {
    this._film = {
      ...this._film, userDetails: {...this._film.userDetails, isWatched: !this._film.userDetails.isWatched},
    };
    this._changeData(this._film);
  }

  _handleFavoriteClick() {
    this._film = {
      ...this._film, userDetails: {...this._film.userDetails, isFavorite: !this._film.userDetails.isFavorite},
    };
    this._changeData(this._film);
  }

  _setFilmPopupHandlers() {
    this._filmPopupComponent.setCloseClickHandler(this._closePopup);

    this._filmPopupComponent.setWatchlistClickHandler(() => {
      this._handleWatchlistClick();
      this._filmPopupComponent.getElement().querySelector('.film-details__control-button--watchlist')
        .classList.toggle('film-details__control-button--active');
    });

    this._filmPopupComponent.setWatchedClickHandler(() => {
      this._handleWatchedClick();
      this._filmPopupComponent.getElement().querySelector('.film-details__control-button--watched')
        .classList.toggle('film-details__control-button--active');
    });

    this._filmPopupComponent.setFavoriteClickHandler(() => {
      this._handleFavoriteClick();
      this._filmPopupComponent.getElement().querySelector('.film-details__control-button--favorite')
        .classList.toggle('film-details__control-button--active');
    });
  }
}
