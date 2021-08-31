import FilmPopupView from '../view/film-popup.js';
import PopupCommentView from '../view/popup-comment.js';
import PopupControlsView from '../view/film-popup-controls.js';
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
    this._popupCommentComponent = new PopupCommentView(this._film, this._changeData);
    this._popupControlsComponent = new PopupControlsView(this._film, this._changeData);

    this._setFilmPopupHandler();
    this._renderPopup();
  }

  destroy() {
    this._closePopup();
  }

  _renderPopup() {
    this._filmPopupContainer.classList.add('hide-overflow');

    render(this._filmPopupContainer, this._filmPopupComponent, RenderPosition.BEFOREEND);
    render(this._filmPopupComponent.bottomContainer, this._popupCommentComponent, RenderPosition.BEFOREEND);
    render(this._filmPopupComponent.topContainer, this._popupControlsComponent, RenderPosition.BEFOREEND);

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

  _setFilmPopupHandler() {
    this._filmPopupComponent.setCloseClickHandler(this._closePopup);
  }
}
