import AbstractView from './abstract.js';

const createFilterButton = ({type, name, count}, currentFilter) => (
  `<a href="#${type}" class="main-navigation__item ${type === currentFilter ? 'main-navigation__item--active' : ''}" data-filter-type="${type}">${name}${count ? ` <span class="main-navigation__item-count" data-filter-type="${type}">${count}</span>` : ''}</a>`
);

const createSiteMenuTemplate = (filters, currentFilter) => (
  `<nav class="main-navigation">
    <div class="main-navigation__items">${filters.map((filter) => createFilterButton(filter, currentFilter)).join(' ')}</div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
);

export default class SiteMenu extends AbstractView {
  constructor(filters, currentFilter) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilter;

    this._mainNavigationButtons = this.getElement().querySelectorAll('.main-navigation__item');

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this._mainNavigationButtons.forEach((element) => element.addEventListener('click', this._filterTypeChangeHandler));
  }
}
