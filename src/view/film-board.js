import { createElement } from '../utils';

const createFilmBoardTemplate = (films) => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title${films.length > 1 ? ' visually-hidden' : ''}">All movies. Upcoming</h2>
      <div class="films-list__container"></div>
    </section>

    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container top-rated"></div>
    </section>

    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container top-commented"></div>
    </section>
  </section>`
);

export default class FilmBoard {
  constructor(films) {
    this._element = null;
    this._films = films;
  }

  getTemplate() {
    return createFilmBoardTemplate(this._films);
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
