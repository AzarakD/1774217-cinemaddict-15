import AbstractObserver from './abstract-observer.js';

export default class Films extends AbstractObserver {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(films) {
    this._films = films.slice();
  }

  getFilms() {
    return this._films;
  }

  _findIndexById(element) {
    return this._films.findIndex((elem) => elem.id === element.id);
  }

  updateFilm(updateType, update) {
    const index = this._findIndexById(update);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addComment(updateType, updatedFilm) {
    const filmIndex = this._findIndexById(updatedFilm);

    if (filmIndex === -1) {
      throw new Error('Can\'t add comment to unexisting film');
    }

    this._films[filmIndex].comments = [...updatedFilm.comments];

    this._notify(updateType, updatedFilm);
  }

  deleteComment(updateType, updatedFilm) {
    const filmIndex = this._findIndexById(updatedFilm);

    if (filmIndex === -1) {
      throw new Error('Can\'t delete comment of unexisting film');
    }

    this._films[filmIndex].comments = [...updatedFilm.comments];

    this._notify(updateType, updatedFilm);
  }
}
