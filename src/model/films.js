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

  addComment(updateType, updatedFilm, update) {
    const index = this._films.findIndex((film) => film.id === updatedFilm.id);

    if (index === -1) {
      throw new Error('Can\'t add comment to unexisting film');
    }

    this._films[index].comments = [...this._films[index].comments, update];

    this._notify(updateType, update);
  }

  deleteComment(updateType, updatedFilm, update) {
    const filmIndex = this._films.findIndex((film) => film.id === updatedFilm.id);

    if (filmIndex === -1) {
      throw new Error('Can\'t delete comment of unexisting film');
    }
    const commentIndex = this._films[filmIndex].comments.findIndex((comment) => comment.id === update);
    this._films[filmIndex].comments.splice(commentIndex, 1);

    this._notify(updateType, updatedFilm);
  }
}
