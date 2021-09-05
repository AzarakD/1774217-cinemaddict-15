import SiteMenuView from '../view/site-menu.js';
import { render, remove, replace, FilterStrategy } from '../utils';
import { RenderPosition, FilterType, UpdateType } from '../consts';

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

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterMenuComponent;

    this._filterMenuComponent = new SiteMenuView(filters, this._filterModel.getFilter());
    this._filterMenuComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterMenuContainer, this._filterMenuComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterMenuComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        // count: FilterStrategy[FilterType.ALL](films).length,
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
    // Не будет обновлять при нажатии на уже выбранный фильтр
    // if (this._filterModel.getFilter() === filterType) {
    //   return;
    // }
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}
