import FilmPopupView from '../view/film-popup.js';
import PopupCommentView from '../view/popup-comment.js';
import PopupControlsView from '../view/popup-controls.js';
import { render, remove, shake } from '../utils/utils.js';
import { RenderPosition, UpdateType, PopupState } from '../consts.js';

export default class FilmPopup {
  constructor(container, changeData) {
    this._filmPopupContainer = container;
    this._changeData = changeData;

    this._closePopup = this._closePopup.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._resetPopupState = this._resetPopupState.bind(this);
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
      this._popupCommentComponent.updateData({
        userDetails: {...data.userDetails},
      }, true);
    } else if (updateType === UpdateType.PATCH && this._film.id === data.id) {
      this._popupCommentComponent.updateData({
        ...data,
        isAdding: false,
        isDeleting: false,
        deletingCommentId: null,
      });
    }
  }

  setPopupState(state, commentId) {
    if (state === PopupState.ADDING) {
      this._popupCommentComponent.updateData({
        isAdding: true,
      });
    } else if (state === PopupState.DELETING) {
      this._popupCommentComponent.updateData({
        isDeleting: true,
        deletingCommentId: commentId,
      });
    } else if (state === PopupState.FORM_ABORTING) {
      shake(this._popupCommentComponent.getNewCommentForm(), this._resetPopupState);
    } else if (state === PopupState.COMMENT_ABORTING) {
      shake(this._popupCommentComponent.getCurrentComment(commentId), this._resetPopupState);
    }
  }

  _resetPopupState() {
    this._popupCommentComponent.updateData({
      isAdding: false,
      isDeleting: false,
      deletingCommentId: null,
    });
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
