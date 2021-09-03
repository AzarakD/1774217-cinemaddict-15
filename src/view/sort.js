import AbstractView from './abstract.js';
import { SortType } from '../utils.js';

const createSortButton = (sortType, currentSortType) => (
  `<li><a href="#" class="sort__button ${currentSortType === sortType ? 'sort__button--active' : ''}" data-sort-type="${sortType}">Sort by ${sortType}</a></li>`
);

const createSortTemplate = (currentSortType) => (
  `<ul class="sort">
    ${Object.values(SortType).slice(0, 3).map((sortType) => createSortButton(sortType, currentSortType)).join(' ')}
  </ul>`
);

export default class Sort extends AbstractView{
  constructor(currentSortType) {
    super();
    this._currentSortType = currentSortType;

    this._sortClickHandler = this._sortClickHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  _sortClickHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.click(evt.target.dataset.sortType);
  }

  setSortClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener('click', this._sortClickHandler);
  }
}
