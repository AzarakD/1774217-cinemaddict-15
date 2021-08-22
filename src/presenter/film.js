import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';
import { render, replace, remove, RenderPosition } from '../utils.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  DETAILED: 'DETAILED',
};

export default class Film {
  constructor(container, changeData, changeMode) {
    this._filmContainer = container;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmComponent = null;
    this._popupComponent = null;
    this._mode = Mode.DEFAULT;

    this._bodyElement = document.querySelector('body');

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handleClosePopupClick = this._handleClosePopupClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmComponent = this._filmComponent;
    this._filmComponent = new FilmCardView(this._film);

    this._filmComponent.setOpenClickHandler(this._handleFilmCardClick);
    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevFilmComponent === null) {
      render(this._filmContainer, this._filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._filmContainer.contains(prevFilmComponent.getElement())) {
      replace(this._filmComponent, prevFilmComponent);
    }

    remove(prevFilmComponent);
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._popupComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
  }

  _createPopup() {
    if (this._popupComponent) {
      this._closePopup();
    }

    this._popupComponent = new FilmPopupView(this._film);

    this._popupComponent.setCloseClickHandler(this._handleClosePopupClick);

    this._popupComponent.setWatchlistClickHandler(() => {
      this._handleWatchlistClick();
      this._popupComponent.getElement().querySelector('.film-details__control-button--watchlist')
        .classList.toggle('film-details__control-button--active');
    });

    this._popupComponent.setWatchedClickHandler(() => {
      this._handleWatchedClick();
      this._popupComponent.getElement().querySelector('.film-details__control-button--watched')
        .classList.toggle('film-details__control-button--active');
    });

    this._popupComponent.setFavoriteClickHandler(() => {
      this._handleFavoriteClick();
      this._popupComponent.getElement().querySelector('.film-details__control-button--favorite')
        .classList.toggle('film-details__control-button--active');
    });

    this._renderPopup();
  }

  _renderPopup() {
    this._bodyElement.classList.add('hide-overflow');
    render(this._bodyElement, this._popupComponent, RenderPosition.BEFOREEND);
    document.addEventListener('keydown', this._onEscKeyDown);

    this._changeMode();
    this._mode = Mode.DETAILED;
  }

  _closePopup() {
    this._bodyElement.classList.remove('hide-overflow');
    remove(this._popupComponent);
    document.removeEventListener('keydown', this._onEscKeyDown);

    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closePopup();
    }
  }

  _handleFilmCardClick() {
    this._createPopup();
  }

  _handleClosePopupClick() {
    this._closePopup();
    document.removeEventListener('keydown', this._onEscKeyDown);
  }

  _handleWatchlistClick() {
    this._changeData(
      Object.assign({}, this._film, {
        userDetails: {
          isInWatchlist: !this._film.userDetails.isInWatchlist,
          isWatched: this._film.userDetails.isWatched,
          isFavorite: this._film.userDetails.isFavorite,
        },
      }),
    );
  }

  _handleWatchedClick() {
    this._changeData(
      Object.assign({}, this._film, {
        userDetails: {
          isInWatchlist: this._film.userDetails.isInWatchlist,
          isWatched: !this._film.userDetails.isWatched,
          isFavorite: this._film.userDetails.isFavorite,
        },
      }),
    );
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign({}, this._film, {
        userDetails: {
          isInWatchlist: this._film.userDetails.isInWatchlist,
          isWatched: this._film.userDetails.isWatched,
          isFavorite: !this._film.userDetails.isFavorite,
        },
      }),
    );
  }
}
