import AbstractView from './abstract.js';

const createFilmCounterTemplate = (films) => (
  `<p>${films.length} movies inside</p>`
);

export default class FilmCounter extends AbstractView{
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createFilmCounterTemplate(this._films);
  }
}
