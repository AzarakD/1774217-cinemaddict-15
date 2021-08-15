import AbstractView from './abstract.js';

const createFilmListTemplate = (films) => (
  `<section class="films-list">
    <h2 class="films-list__title${films.length > 0 ? ' visually-hidden' : ''}">There are no movies in our database</h2>
    <div class="films-list__container"></div>
  </section>`
);

export default class FilmList extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createFilmListTemplate(this._films);
  }

  getFilmContainer() {
    if (!this._element) {
      this.getElement();
    }

    return this._element.querySelector('.films-list__container');
  }
}
