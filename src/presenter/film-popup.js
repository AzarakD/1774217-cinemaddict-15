import FilmPopupView from '../view/film-popup.js';
import PopupCommentView from '../view/popup-comment.js';
import PopupControlsView from '../view/popup-controls.js';
import { render, remove } from '../utils.js';
import { RenderPosition, UpdateType } from '../consts.js';

export default class FilmPopup {
  constructor(container, changeData) {
    this._filmPopupContainer = container;
    this._changeData = changeData;

    this._profileName = this._profileName = document.querySelector('.profile__rating').textContent;

    this._closePopup = this._closePopup.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  init(film, comments) {
    this._film = film;
    this._comments = comments;

    this._filmPopupComponent = new FilmPopupView(this._film, this._comments);
    this._popupControlsComponent = new PopupControlsView(this._film, this._changeData);
    if (this._comments) {
      this._popupCommentComponent = new PopupCommentView(this._film, this._comments, this._changeData);
    }

    this._setFilmPopupHandler();
    this._renderPopup();
  }

  destroy() {
    this._closePopup();
  }

  updatePopup(updateType, data) {
    if (updateType === UpdateType.MINOR && this._film.id === data.id) {
      this._popupControlsComponent.updateData(data);
    } else if (updateType === UpdateType.PATCH && this._film.id === data.id) {
      this._popupCommentComponent.updateData(data);
    }
  }

  _renderPopup() {
    this._filmPopupContainer.classList.add('hide-overflow');

    render(this._filmPopupContainer, this._filmPopupComponent, RenderPosition.BEFOREEND);
    if (this._popupCommentComponent) {
      render(this._filmPopupComponent.bottomContainer, this._popupCommentComponent, RenderPosition.BEFOREEND);
    }
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
