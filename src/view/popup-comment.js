import SmartView from './smart.js';
import { getCurrentDate } from '../utils.js';

const createNewComment = (element) => (
  `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${element.emotion}.png" width="55" height="55" alt="emoji-${element.emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${element.comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${element.author}</span>
        <span class="film-details__comment-day">${element.date}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`
);

const createPopupCommentTemplate = ({comments, newCommentEmotion, newCommentMessage}) => (
  `<section class="film-details__comments-wrap">
  <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

  <ul class="film-details__comments-list">${comments.map((element) => createNewComment(element)).join('')}</ul>

  <div class="film-details__new-comment">
    <div class="film-details__add-emoji-label">${newCommentEmotion ? `<img src="images/emoji/${newCommentEmotion}.png" width="55" height="55" alt="emoji-${newCommentEmotion}">` : ''}</div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${newCommentMessage ? newCommentMessage : ''}</textarea>
    </label>

    <div class="film-details__emoji-list">
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${newCommentEmotion === 'smile' ? 'checked' : ''}>
      <label class="film-details__emoji-label" for="emoji-smile">
        <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${newCommentEmotion === 'sleeping' ? 'checked' : ''}>
      <label class="film-details__emoji-label" for="emoji-sleeping">
        <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${newCommentEmotion === 'puke' ? 'checked' : ''}>
      <label class="film-details__emoji-label" for="emoji-puke">
        <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${newCommentEmotion === 'angry' ? 'checked' : ''}>
      <label class="film-details__emoji-label" for="emoji-angry">
        <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
      </label>
    </div>
  </div>
</section>`
);

export default class PopupComment extends SmartView {
  constructor(film) {
    super();
    this._data = PopupComment.parseFilmToData(film);

    this._emotionChangeHandler = this._emotionChangeHandler.bind(this);
    this._textInputHandler = this._textInputHandler.bind(this);
    this._newCommentSubmitHandler = this._newCommentSubmitHandler.bind(this);

    this._setInnerHandlers();
    this._setNewCommentSubmitHandler();
  }

  getTemplate() {
    return createPopupCommentTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setNewCommentSubmitHandler();
  }

  _setInnerHandlers() {
    this.getElement().querySelectorAll('.film-details__emoji-item').
      forEach((emoji) => emoji.addEventListener('change', this._emotionChangeHandler));

    this.getElement().querySelector('.film-details__comment-input')
      .addEventListener('input', this._textInputHandler);
  }

  _emotionChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      newCommentEmotion: evt.target.value,
    });
  }

  _textInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      newCommentMessage: evt.target.value,
    }, true);
  }

  _newCommentSubmitHandler(evt) {
    if (evt.key === 'Enter' && evt.ctrlKey) {
      if (this._data.newCommentEmotion && this._data.newCommentMessage) {
        this._newComment = {
          emotion: this._data.newCommentEmotion,
          date: getCurrentDate(),
          author: document.querySelector('.profile__rating').textContent,
          comment: this._data.newCommentMessage,
        };
        this._data.comments.push(this._newComment);
        this._data = PopupComment.parseDataToFilm(this._data);
        this.updateElement();
      }
    }
  }

  _setNewCommentSubmitHandler() {
    this.getElement().addEventListener('keydown', this._newCommentSubmitHandler);
  }

  static parseFilmToData(film) {
    return {
      ...film,
      newCommentEmotion: null,
      newCommentMessage: null,
    };
  }

  static parseDataToFilm(data) {
    data = Object.assign({}, data);

    delete data.newCommentEmotion;
    delete data.newCommentMessage;
    return data;
  }
}
