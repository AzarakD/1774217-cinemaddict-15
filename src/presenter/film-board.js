import FilmPresenter from './film.js';
import FilmPopupPresenter from './film-popup.js';
import FilmBoardView from '../view/film-board.js';
import FilmListView from '../view/film-list.js';
import FilmEmptyListView from '../view/film-empty-list.js';
import SortView from '../view/sort.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import ExtraTopRatedView from '../view/extra-top-rated.js';
import ExtraTopCommentedView from '../view/extra-top-commented.js';
import { render, remove, updateItem, RenderPosition, Sort, SortType } from '../utils.js';

const FILM_COUNT_PER_STEP = 5;

export default class FilmBoard {
  constructor(container) {
    this._filmBoardContainer = container;
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._filmPresenterMap = new Map();
    this._extraTopRatedPresenterMap = new Map();
    this._extraTopCommentedPresenterMap = new Map();

    this._presenterMaps = [
      this._filmPresenterMap,
      this._extraTopRatedPresenterMap,
      this._extraTopCommentedPresenterMap,
    ];

    this._filmBoardComponent = new FilmBoardView();
    this._filmListComponent = new FilmListView();
    this._sortComponent = new SortView();
    this._showMoreBtnComponent = new ShowMoreButtonView();

    this._filmListContainer = this._filmListComponent.getFilmContainer();

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleShowMoreBtnClick = this._handleShowMoreBtnClick.bind(this);
    this._handleSortClick = this._handleSortClick.bind(this);
  }

  init(films) {
    this._films = films.slice();
    this._sourcedFilms = films.slice();
    this._filmPopupPresenter = new FilmPopupPresenter(this._handleFilmChange);

    render(this._filmBoardContainer, this._filmBoardComponent, RenderPosition.BEFOREEND);
    this._renderFilmBoard();
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._sourcedFilms = updateItem(this._sourcedFilms, updatedFilm);

    this._presenterMaps.forEach((presenterMap) => {
      const film = presenterMap.get(updatedFilm.id);
      return film && film.init(updatedFilm);
    });

    if (this._filmPopupPresenter.filmPopupComponent && this._filmPopupPresenter.film === updatedFilm.id) {
      this._filmPopupPresenter.init(updatedFilm);
    }
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

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.BY_DATE:
        this._films.sort(Sort.byDate);
        break;
      case SortType.BY_RATING:
        this._films.sort(Sort.byRating);
        break;
      default:
        this._films = this._sourcedFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortClick(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearFilmList();
    this._renderFilmList();
    this._renderExtra();
  }

  _renderSort() {
    render(this._filmBoardContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortClickHandler(this._handleSortClick);
  }

  _renderFilmListContainer() {
    render(this._filmBoardComponent, this._filmListComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEmptyFilmList() {
    const filmEmptyListComponent = new FilmEmptyListView();
    render(this._filmBoardComponent, filmEmptyListComponent, RenderPosition.AFTERBEGIN);
  }

  _handleFilmCardClick(film, presenterMap) {
    this._filmPopupPresenter.init(presenterMap.get(film.id).film);
  }

  _renderFilm(container, film, presenterMap) {
    const filmPresenter = new FilmPresenter(container, this._handleFilmChange, () => this._handleFilmCardClick(film, presenterMap));
    filmPresenter.init(film);
    presenterMap.set(film.id, filmPresenter);
  }

  _renderFilms(from, to) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderFilm(this._filmListContainer, film, this._filmPresenterMap));
  }

  _clearPresenter(presenterMap) {
    presenterMap.forEach((element) => element.destroy());
    presenterMap.clear();
    // if (this._showMoreBtnComponent) {
    //   remove(this._showMoreBtnComponent);
    // }
  }

  _clearFilmList() {
    this._renderedFilmCount = FILM_COUNT_PER_STEP;

    this._presenterMaps.forEach((presenterMap) => this._clearPresenter(presenterMap));

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
      this._renderFilm(this._extraTopRatedComponent.getExtraContainer(), films.sort(Sort.byRating)[0], this._extraTopRatedPresenterMap);
      this._renderFilm(this._extraTopRatedComponent.getExtraContainer(), films.sort(Sort.byRating)[1], this._extraTopRatedPresenterMap);
      this._renderFilm(this._extraTopCommentedComponent.getExtraContainer(), films.sort(Sort.byCommentAmount)[0], this._extraTopCommentedPresenterMap);
      this._renderFilm(this._extraTopCommentedComponent.getExtraContainer(), films.sort(Sort.byCommentAmount)[1], this._extraTopCommentedPresenterMap);
    } else if (this._films.length === 1) {
      this._renderFilm(this._extraTopRatedComponent.getExtraContainer(), films[0], this._extraTopRatedPresenterMap);
      this._renderFilm(this._extraTopCommentedComponent.getExtraContainer(), films[0], this._extraTopCommentedPresenterMap);
    }
  }
}
