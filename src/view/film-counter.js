import { createElement } from '../utils';

const createFilmCounterTemplate = (films) => (
  `<p>${films.length} movies inside</p>`
);

export default class FilmCounter {
  constructor(films) {
    this._element = null;
    this._films = films;
  }

  getTemplate() {
    return createFilmCounterTemplate(this._films);
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
