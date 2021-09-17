import FilmsModel from './model/films.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getFilms() {
    return this._load({url: 'movies'})
      .then(Api.toJSON)
      .then((films) => films.map(FilmsModel.adaptToClient));
  }

  getComments(filmId) {
    return this._load({url: `comments/${filmId}`})
      .then(Api.toJSON);
  }

  updateFilm(film) {
    return this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(FilmsModel.adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(FilmsModel.adaptToClient);
  }

  addComment(film, comment) {
    return this._load({
      url: `comments/${film.id}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then((response) => FilmsModel.adaptToClient({...response.movie, comments: [...response.comments]}));
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorization);

    return fetch(
      `${this._endPoint}/${url}`,
      {method, body, headers},
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static toJSON(response) {
    return response.json();
  }

  static checkStatus(response) {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static catchError(error) {
    throw error;
  }
}
