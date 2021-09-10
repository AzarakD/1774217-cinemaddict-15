import SiteMenuView from '../view/site-menu.js';
import { render, remove, replace, FilterStrategy } from '../utils';
import { RenderPosition, FilterType, UpdateType, PageState } from '../consts';

import { handleSiteMenuClick } from '../main.js';

export default class FilterMenu {
  constructor(container, filmsModel, filterModel) {
    this._filterMenuContainer = container;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;

    this._filterMenuComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init(menuItem = PageState.FILMS) {
    const filters = this._getFilters();
    const prevFilterMenuComponent = this._filterMenuComponent;

    this._filterMenuComponent = new SiteMenuView(filters, this._filterModel.getFilter(), menuItem);
    this._filterMenuComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);
    this._filterMenuComponent.setMenuItemClickHandler(handleSiteMenuClick);

    if (prevFilterMenuComponent === null) {
      render(this._filterMenuContainer, this._filterMenuComponent, RenderPosition.BEFOREEND);
      return;
    }
    replace(this._filterMenuComponent, prevFilterMenuComponent);
    remove(prevFilterMenuComponent);
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: FilterStrategy[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: FilterStrategy[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: FilterStrategy[FilterType.FAVORITES](films).length,
      },
    ];
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}
