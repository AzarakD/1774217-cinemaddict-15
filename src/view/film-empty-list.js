import AbstractView from './abstract.js';
import { FilterType } from '../consts.js';

const createFilmEmptyListTemplate = (filterType) => {
  const noFilmsText = {
    [FilterType.ALL]: 'There are no movies in our database',
    [FilterType.WATCHLIST]: 'There are no movies to watch now',
    [FilterType.HISTORY]: 'There are no watched movies now',
    [FilterType.FAVORITES]: 'There are no favorite movies now',
  };

  return `<section class="films-list">
    <h2 class="films-list__title">${noFilmsText[filterType]}</h2>
  </section>`;
};

export default class FilmEmptyList extends AbstractView {
  constructor(filterType) {
    super();
    this._filterType = filterType;
  }

  getTemplate() {
    return createFilmEmptyListTemplate(this._filterType);
  }
}
