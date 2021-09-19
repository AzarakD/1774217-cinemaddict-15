import FilmsModel from '../model/films.js';

const createStoreStructure = (items) =>
  items
    .reduce((acc, current) => Object.assign({}, acc, {
      [current.id]: current,
    }), {});

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getFilms() {
    if (this._isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = createStoreStructure(films.map(FilmsModel.adaptToServer));
          this._store.setItem('films', items);

          return films;
        });
    }

    const storeFilms = Object.values(this._store.getItems()['films']);

    return Promise.resolve(storeFilms.map(FilmsModel.adaptToClient));
  }

  getComments(filmId) {
    if (this._isOnline()) {
      return this._api.getComments(filmId)
        .then((comments) => {
          const item = {[filmId]: createStoreStructure(comments)};
          this._store.setItem('comments', item);

          return comments;
        });
    }

    const storeComments = this._store.getItems()['comments'][filmId];

    return Promise.resolve(storeComments ? Object.values(storeComments) : null);
  }

  updateFilm(film) {
    if (this._isOnline()) {
      return this._api.updateFilm(film)
        .then((updatedFilm) => {
          this._store.setItem('films', {[updatedFilm.id]: FilmsModel.adaptToServer(updatedFilm)});

          return updatedFilm;
        });
    }

    this._store.setItem(this._store.setItem('films', {[film.id]: FilmsModel.adaptToServer(film)}));

    return Promise.resolve(film);
  }

  addComment(film, commentId) {
    if (this._isOnline()) {
      return this._api.addComment(film, commentId)
        .then((response) => {
          const comments = {[film.id]: createStoreStructure(response.detailedComments)};
          this._store.setItem('comments', comments);

          return response;
        });
    }

    return Promise.reject(new Error('Failed to add new comment'));
  }

  deleteComment(filmId, commentId) {
    if (this._isOnline()) {
      return this._api.deleteComment(commentId)
        .then(() => this._store.removeItem('comments', filmId, commentId));
    }

    return Promise.reject(new Error('Failed to delete a comment'));
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}
