import AbstractView from './abstract.js';
import { SortType } from '../utils.js';

const createSortButton = (sortType) => (
  `<li><a href="#" class="sort__button" data-sort-type="${sortType}">Sort by ${sortType}</a></li>`
);

const createSortTemplate = () => (
  `<ul class="sort">
    ${Object.values(SortType).map((sortType) => createSortButton(sortType)).join(' ')}
  </ul>`
);

export default class Sort extends AbstractView{
  constructor() {
    super();

    this._activeButton = this.getElement().querySelectorAll('A')[0];
    this._activeButton.classList.add('sort__button--active');

    this._sortClickHandler = this._sortClickHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate();
  }

  _sortClickHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._activeButton.classList.remove('sort__button--active');
    this._activeButton = evt.target;
    this._activeButton.classList.add('sort__button--active');
    this._callback.click(evt.target.dataset.sortType);
  }

  setSortClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener('click', this._sortClickHandler);
  }
}
