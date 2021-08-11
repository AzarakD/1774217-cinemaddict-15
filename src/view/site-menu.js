import { createElement } from '../utils';

const createSiteMenuTemplate = (films) => {
  let watchListNumber = 0;
  let historyNumber = 0;
  let favoritesNumber = 0;

  films.forEach((film) => {
    watchListNumber += film.userDetails.isInWatchlist ? 1 : 0;
    historyNumber += film.userDetails.isWatched ? 1 : 0;
    favoritesNumber += film.userDetails.isFavorite ? 1 : 0;
  });

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchListNumber}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${historyNumber}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favoritesNumber}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class SiteMenu {
  constructor(films) {
    this._element = null;
    this._films = films;
  }

  getTemplate() {
    return createSiteMenuTemplate(this._films);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
