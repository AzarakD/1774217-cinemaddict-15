import AbstractObserver from './abstract-observer.js';

export default class Films extends AbstractObserver {
  constructor(api) {
    super();
    this._api = api;
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();

    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  getComments(filmId) {
    return this._api.getComments(filmId);
  }

  _findIndexById(element) {
    return this._films.findIndex((elem) => elem.id === element.id);
  }

  updateFilm(updateType, update) {
    return this._api.updateFilm(update).then((response) => {
      const index = this._findIndexById(response);

      if (index === -1) {
        throw new Error('Can\'t update unexisting film');
      }

      this._films = [
        ...this._films.slice(0, index),
        response,
        ...this._films.slice(index + 1),
      ];

      this._notify(updateType, response);

      return response;
    });
  }

  addComment(updateType, updatedFilm, comment) {
    return this._api.addComment(updatedFilm, comment).then((response) => {
      const filmIndex = this._findIndexById(response);

      if (filmIndex === -1) {
        throw new Error('Can\'t add comment to unexisting film');
      }
      this._films[filmIndex] = response;
      this._notify(updateType, response);

      return response;
    });
  }

  deleteComment(updateType, updatedFilm, commentId) {
    return this._api.deleteComment(updatedFilm.id, commentId).then(() => {
      const filmIndex = this._findIndexById(updatedFilm);

      if (filmIndex === -1) {
        throw new Error('Can\'t delete comment of unexisting film');
      }
      const commentIndex = updatedFilm.comments.findIndex((comment) => comment === commentId);
      const detailedCommentIndex = updatedFilm.detailedComments.findIndex((comment) => comment.id === commentId);

      updatedFilm.comments = [
        ...updatedFilm.comments.slice(0, commentIndex),
        ...updatedFilm.comments.slice(commentIndex + 1),
      ];

      updatedFilm.detailedComments = [
        ...updatedFilm.detailedComments.slice(0, detailedCommentIndex),
        ...updatedFilm.detailedComments.slice(detailedCommentIndex + 1),
      ];

      this._films[filmIndex].comments = [...updatedFilm.comments];
      this._notify(updateType, updatedFilm);

      return updatedFilm;
    });
  }

  static adaptToClient(film) {
    return {
      id: film.id,
      comments: film.comments,
      detailedComments: film.detailedComments ? film.detailedComments : [],
      filmInfo: {
        poster: film.film_info.poster,
        title: film.film_info.title,
        alternativeTitle: film.film_info.alternative_title,
        rating: film.film_info.total_rating,
        director: film.film_info.director,
        writers: film.film_info.writers,
        actors: film.film_info.actors,
        releaseDate: film.film_info.release.date,
        runtime: film.film_info.runtime,
        country: film.film_info.release.release_country,
        genres: film.film_info.genre,
        description: film.film_info.description,
        ageRating: film.film_info.age_rating,
      },
      userDetails: {
        isInWatchlist: film.user_details.watchlist,
        isWatched: film.user_details.already_watched,
        isFavorite: film.user_details.favorite,
        watchingDate: film.user_details.watching_date,
      },
    };
  }

  static adaptToServer(film) {
    return {
      'id': film.id,
      'comments': film.comments,
      'film_info': {
        'title': film.filmInfo.title,
        'alternative_title': film.filmInfo.alternativeTitle,
        'total_rating': film.filmInfo.rating,
        'poster': film.filmInfo.poster,
        'age_rating': film.filmInfo.ageRating,
        'director': film.filmInfo.director,
        'writers': film.filmInfo.writers,
        'actors': film.filmInfo.actors,
        'release': {
          'date': film.filmInfo.releaseDate,
          'release_country': film.filmInfo.country,
        },
        'runtime': film.filmInfo.runtime,
        'genre': film.filmInfo.genres,
        'description': film.filmInfo.description,
      },
      'user_details': {
        'watchlist': film.userDetails.isInWatchlist,
        'already_watched': film.userDetails.isWatched,
        'watching_date': film.userDetails.watchingDate,
        'favorite': film.userDetails.isFavorite,
      },
    };
  }
}
