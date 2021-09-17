import SmartView from './smart.js';
import { UserAction, UpdateType } from '../consts.js';

const createPopupControlsTemplate = ({userDetails}) => (
  `<section class="film-details__controls">
    <button type="button" class="film-details__control-button film-details__control-button--watchlist${userDetails.isInWatchlist ? ' film-details__control-button--active' : ''}" id="watchlist" name="watchlist">Add to watchlist</button>
    <button type="button" class="film-details__control-button film-details__control-button--watched${userDetails.isWatched ? ' film-details__control-button--active' : ''}" id="watched" name="watched">Already watched</button>
    <button type="button" class="film-details__control-button film-details__control-button--favorite${userDetails.isFavorite ? ' film-details__control-button--active' : ''}" id="favorite" name="favorite">Add to favorites</button>
  </section>`
);

export default class PopupControls extends SmartView {
  constructor(film, updateCard) {
    super();
    this._data = film;
    this._updateCard = updateCard;

    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createPopupControlsTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
  }

  _setInnerHandlers() {
    this._watchlistButton = this.getElement().querySelector('.film-details__control-button--watchlist');
    this._watchedButton = this.getElement().querySelector('.film-details__control-button--watched');
    this._favoriteButton = this.getElement().querySelector('.film-details__control-button--favorite');

    this._watchlistButton.addEventListener('click', this._watchlistClickHandler);
    this._watchedButton.addEventListener('click', this._watchedClickHandler);
    this._favoriteButton.addEventListener('click', this._favoriteClickHandler);
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();

    this._data.userDetails.isInWatchlist = !this._data.userDetails.isInWatchlist;

    this._updateCard(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      this._data,
    );
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();

    this._data.userDetails.isWatched = !this._data.userDetails.isWatched;

    this._updateCard(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      this._data,
    );
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();

    this._data.userDetails.isFavorite = !this._data.userDetails.isFavorite;

    this._updateCard(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      this._data,
    );
  }
}
