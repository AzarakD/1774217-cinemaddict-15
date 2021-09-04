import SiteMenuView from '../view/site-menu.js';
import { render } from '../utils';
import { RenderPosition } from '../consts';

export default class FilterMenu {
  constructor(container, filmsModel) {
    this._filterMenuContainer = container;
    this._filmsModel = filmsModel;

    this._filterMenuComponent = new SiteMenuView(this._filmsModel.getFilms());
  }

  init() {
    this._renderFilterMenu();
  }

  _renderFilterMenu() {
    render(this._filterMenuContainer, this._filterMenuComponent, RenderPosition.BEFOREEND);
  }
}
