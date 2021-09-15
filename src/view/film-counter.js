import AbstractView from './abstract.js';
import { UpdateType } from '../consts.js';

const createFilmCounterTemplate = (films) => (
  `<p>${films.length} movies inside</p>`
);

export default class FilmCounter extends AbstractView{
  constructor(filmsModel) {
    super();
    this._filmsModel = filmsModel;
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
  }

  getTemplate() {
    return createFilmCounterTemplate(this._filmsModel.getFilms());
  }

  // updateElement ?

  _handleModelEvent(updateType) {
    if (updateType === UpdateType.INIT) {
      this.getElement().innerText = `${this._filmsModel.getFilms().length} movies inside`;
    }
  }
}
