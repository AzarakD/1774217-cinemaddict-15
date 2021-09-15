import AbstractView from './abstract.js';
import { PageState } from '../consts.js';

const createFilterButton = ({type, name, count}, currentFilter, menuItem) => (
  `<a href="#${type}" class="main-navigation__item${menuItem === PageState.FILMS && type === currentFilter ? ' main-navigation__item--active' : ''}" data-filter-type="${type}">${name}${count > -1 ? ` <span class="main-navigation__item-count" data-filter-type="${type}">${count}</span>` : ''}</a>`
);

const createSiteMenuTemplate = (filters, currentFilter, menuItem) => (
  `<nav class="main-navigation">
    <div class="main-navigation__items">${filters.map((filter) => createFilterButton(filter, currentFilter, menuItem)).join(' ')}</div>
    <a href="#stats" class="main-navigation__additional${menuItem === PageState.STATS ? ' main-navigation__item--active' : ''}" data-filter-type="Stats">Stats</a>
  </nav>`
);

export default class SiteMenu extends AbstractView {
  constructor(filters, currentFilter, menuItem) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilter;
    this._menuItem = menuItem;

    this._mainNavigationButtons = this.getElement().querySelectorAll('.main-navigation__item');

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._menuItemClickHandler = this._menuItemClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate(this._filters, this._currentFilter, this._menuItem);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  }

  _menuItemClickHandler(evt) {
    evt.preventDefault();
    if (!evt.target.dataset.filterType) {
      return;
    }
    this._menuItem = evt.target.dataset.filterType.toUpperCase();
    this._callback.menuItemClick(this._menuItem === PageState.STATS ? this._menuItem : PageState.FILMS);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this._mainNavigationButtons.forEach((element) => element.addEventListener('click', this._filterTypeChangeHandler));
  }

  setMenuItemClickHandler(callback) {
    this._callback.menuItemClick = callback;
    this.getElement().addEventListener('click', this._menuItemClickHandler);
  }
}
