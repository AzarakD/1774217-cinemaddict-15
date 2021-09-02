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

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

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

  // Эксперимент
  addComment(updateType, updatedFilm, comment) {
    const index = this._films.findIndex((film) => film.id === updatedFilm.id);

    if (index === -1) {
      throw new Error('Can\'t add comment to unexisting film');
    }

    this._films[index].comments.push(comment);
    this._notify(updateType, updatedFilm);
  }

  // Эксперимент
  deleteComment(updateType, updatedFilm, comment) {
    const index = this._films.findIndex((task) => task.id === updatedFilm.id);

    if (index === -1) {
      throw new Error('Can\'t delete comment of unexisting film');
    }

    this._films[index].comments.splice(this._films[index].comments.indexOf(comment), 1);

    this._notify(updateType);
  }
}
