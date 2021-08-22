import FilmPresenter from './film.js';
import FilmBoardView from '../view/film-board.js';
import FilmListView from '../view/film-list.js';
import FilmEmptyListView from '../view/film-empty-list.js';
import SortView from '../view/sort.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import ExtraTopRatedView from '../view/extra-top-rated.js';
import ExtraTopCommentedView from '../view/extra-top-commented.js';
import { render, remove, updateItem, RenderPosition, Sort } from '../utils.js';

const FILM_COUNT_PER_STEP = 5;

export default class FilmBoard {
  constructor(container) {
    this._filmBoardContainer = container;
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._filmPresenter = new Map();
    this._extraTopRatedPresenter = new Map();
    this._extraTopCommentedPresenter = new Map();

    this._filmBoardComponent = new FilmBoardView();
    this._filmListComponent = new FilmListView();
    this._sortComponent = new SortView();
    this._showMoreBtnComponent = new ShowMoreButtonView();

    this._filmListContainer = this._filmListComponent.getFilmContainer();

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowMoreBtnClick = this._handleShowMoreBtnClick.bind(this);
  }

  init(films) {
    this._films = films.slice();

    render(this._filmBoardContainer, this._filmBoardComponent, RenderPosition.BEFOREEND);
    this._renderFilmBoard();
  }

  _handleModeChange() {
    this._filmPresenter.forEach((element) => element.resetView());
    this._extraTopRatedPresenter.forEach((element) => element.resetView());
    this._extraTopCommentedPresenter.forEach((element) => element.resetView());
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);

    const presenters = [
      this._filmPresenter.get(updatedFilm.id),
      this._extraTopRatedPresenter.get(updatedFilm.id),
      this._extraTopCommentedPresenter.get(updatedFilm.id),
    ];

    presenters.forEach((element) => element && element.init(updatedFilm));
  }

  _handleShowMoreBtnClick() {
    this._renderFilms(this._renderedFilmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP);
    this._renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this._renderedFilmCount >= this._films.length) {
      remove(this._showMoreBtnComponent);
    }
  }

  _renderFilmBoard() {
    if (this._films.length > 0) {
      this._renderSort();
      this._renderFilmListContainer();
      this._renderFilmList();
      this._renderExtra();
    } else {
      this._renderEmptyFilmList();
    }
  }

  _renderSort() {
    render(this._filmBoardContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderFilmListContainer() {
    render(this._filmBoardComponent, this._filmListComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEmptyFilmList() {
    const filmEmptyListComponent = new FilmEmptyListView();
    render(this._filmBoardComponent, filmEmptyListComponent, RenderPosition.AFTERBEGIN);
  }

  _renderFilm(container, film, presenter) {
    const filmPresenter = new FilmPresenter(container, this._handleFilmChange, this._handleModeChange);
    filmPresenter.init(film);
    presenter.set(film.id, filmPresenter);
  }

  _renderFilms(from, to) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderFilm(this._filmListContainer, film, this._filmPresenter));
  }

  _clearPresenter(presenter) {
    presenter.forEach((element) => element.destroy());
    presenter.clear();
  }

  _clearFilmList() {
    this._renderedFilmCount = FILM_COUNT_PER_STEP;

    this._clearPresenter(this._filmPresenter);
    this._clearPresenter(this._extraTopRatedPresenter);
    this._clearPresenter(this._extraTopCommentedPresenter);

    remove(this._showMoreBtnComponent);
    remove(this._extraTopRatedComponent);
    remove(this._extraTopCommentedComponent);
  }

  _renderFilmList() {
    this._renderFilms(0, Math.min(this._films.length, FILM_COUNT_PER_STEP));

    if (this._films.length > FILM_COUNT_PER_STEP) {
      this._renderShowMoreBtn();
    }
  }

  _renderShowMoreBtn() {
    render(this._filmListComponent, this._showMoreBtnComponent, RenderPosition.BEFOREEND);
    this._showMoreBtnComponent.setClickHandler(this._handleShowMoreBtnClick);
  }

  _renderExtra() {
    const films = this._films.slice();

    this._extraTopRatedComponent = new ExtraTopRatedView();
    this._extraTopCommentedComponent = new ExtraTopCommentedView();

    render(this._filmBoardComponent, this._extraTopRatedComponent, RenderPosition.BEFOREEND);
    render(this._filmBoardComponent, this._extraTopCommentedComponent, RenderPosition.BEFOREEND);

    if (this._films.length > 1) {
      this._renderFilm(this._extraTopRatedComponent.getExtraContainer(), films.sort(Sort.byRating)[0], this._extraTopRatedPresenter);
      this._renderFilm(this._extraTopRatedComponent.getExtraContainer(), films.sort(Sort.byRating)[1], this._extraTopRatedPresenter);
      this._renderFilm(this._extraTopCommentedComponent.getExtraContainer(), films.sort(Sort.byCommentAmount)[0], this._extraTopCommentedPresenter);
      this._renderFilm(this._extraTopCommentedComponent.getExtraContainer(), films.sort(Sort.byCommentAmount)[1], this._extraTopCommentedPresenter);
    } else if (this._films.length === 1) {
      this._renderFilm(this._extraTopRatedComponent.getExtraContainer(), films[0], this._extraTopRatedPresenter);
      this._renderFilm(this._extraTopCommentedComponent.getExtraContainer(), films[0], this._extraTopCommentedPresenter);
    }
  }
}
