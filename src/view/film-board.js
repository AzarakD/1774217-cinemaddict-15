import AbstractView from './abstract.js';

const createFilmBoardTemplate = () => (
  '<section class="films"></section>'
);

export default class FilmBoard extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createFilmBoardTemplate(this._films);
  }
}
