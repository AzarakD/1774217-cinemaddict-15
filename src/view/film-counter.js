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

  updateElement(films) {
    this._films = films;

    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
  }
}
