import AbstractView from './abstract.js';

const sortTypes = [
  'default',
  'date',
  'rating',
];

const createSortButton = (sortType) => (
  `<li><a href="#" class="sort__button" data-sort-type="${sortType}">Sort by ${sortType}</a></li>`
);

// sort__button--active

const createSortTemplate = () => (
  `<ul class="sort">
    ${sortTypes.map((sortType) => createSortButton(sortType)).join(' ')}
  </ul>`
);

export default class Sort extends AbstractView{
  constructor() {
    super();

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
    this._callback.click(evt.target.dataset.sortType);
  }

  setSortClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener('click', this._sortClickHandler);
  }
}
