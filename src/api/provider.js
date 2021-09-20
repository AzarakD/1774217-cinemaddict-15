import FilmsModel from '../model/films.js';
import { isOnline } from '../utils/utils.js';

const StoreKey = {
  FILMS: 'films',
  COMMENTS: 'comments',
};

const createStoreStructure = (items) =>
  items
    .reduce((acc, current) => Object.assign({}, acc, {
      [current.id]: current,
    }), {});

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSyncNeeded = false;
    this._filmsToSync = new Map();
  }

  get isSyncNeeded() {
    return this._isSyncNeeded;
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = createStoreStructure(films.map(FilmsModel.adaptToServer));
          this._store.setItem(StoreKey.FILMS, items);

          return films;
        });
    }

    const storeFilms = Object.values(this._store.getItems()[StoreKey.FILMS]);

    return Promise.resolve(storeFilms.map(FilmsModel.adaptToClient));
  }

  getComments(filmId) {
    if (isOnline()) {
      return this._api.getComments(filmId)
        .then((comments) => {
          const item = {[filmId]: createStoreStructure(comments)};
          this._store.setItem(StoreKey.COMMENTS, item);

          return comments;
        });
    }

    const subStore = this._store.getItems()[StoreKey.COMMENTS];

    if (!subStore || !subStore[filmId]) {
      return Promise.reject(new Error('Failed to get comments'));
    }

    const storeComments = subStore[filmId];
    return Promise.resolve(Object.values(storeComments));
  }

  updateFilm(film) {
    if (isOnline()) {
      return this._api.updateFilm(film)
        .then((updatedFilm) => {
          this._store.setItem(StoreKey.FILMS, {[updatedFilm.id]: FilmsModel.adaptToServer(updatedFilm)});

          return updatedFilm;
        });
    }
    this._isSyncNeeded = true;
    const filmToSync = FilmsModel.adaptToServer(film);

    this._filmsToSync.set(film.id, filmToSync);
    this._store.setItem(StoreKey.FILMS, {[film.id]: filmToSync});

    return Promise.resolve(film);
  }

  addComment(film, commentId) {
    if (isOnline()) {
      return this._api.addComment(film, commentId)
        .then((response) => {
          const comments = {[film.id]: createStoreStructure(response.detailedComments)};
          this._store.setItem(StoreKey.COMMENTS, comments);

          return response;
        });
    }

    return Promise.reject(new Error('Failed to add new comment'));
  }

  deleteComment(filmId, commentId) {
    if (isOnline()) {
      return this._api.deleteComment(commentId)
        .then(() => this._store.removeItem(StoreKey.COMMENTS, filmId, commentId));
    }

    return Promise.reject(new Error('Failed to delete a comment'));
  }

  sync() {
    if (isOnline()) {
      const filmsToSync = [...this._filmsToSync.values()];

      return this._api.sync(filmsToSync)
        .then((response) => {
          const updatedFilms = response.updated;
          const items = createStoreStructure(updatedFilms);

          this._filmsToSync.clear();
          this._store.setItem(StoreKey.FILMS, items);

          this._isSyncNeeded = false;
        });
    }

    return Promise.reject(new Error('Failed to sync data'));
  }
}
