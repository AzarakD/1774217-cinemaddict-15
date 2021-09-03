import FilmPresenter from './film.js';
import FilmPopupPresenter from './film-popup.js';
import SiteMenuView from '../view/site-menu.js';
import FilmBoardView from '../view/film-board.js';
import FilmListView from '../view/film-list.js';
import FilmEmptyListView from '../view/film-empty-list.js';
import SortView from '../view/sort.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import ExtraTopRatedView from '../view/extra-top-rated.js';
import ExtraTopCommentedView from '../view/extra-top-commented.js';
import { render, remove, updateItem, RenderPosition, SortStrategy, SortType, UserAction, UpdateType } from '../utils.js';

const FILM_COUNT_PER_STEP = 5;

export default class FilmBoard {
  constructor(container, filmsModel) {
    this._filmBoardContainer = container;
    this._filmsModel = filmsModel;
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
    this._sortComponent = null;
    this._showMoreBtnComponent = null;
    // this._sortComponent = new SortView();
    // this._showMoreBtnComponent = new ShowMoreButtonView();

    this._filmListContainer = this._filmListComponent.getFilmContainer();
    this._filmPopupContainer = document.querySelector('body');
    this._profileName = document.querySelector('.profile__rating').textContent;

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    // this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleShowMoreBtnClick = this._handleShowMoreBtnClick.bind(this);
    this._handleSortClick = this._handleSortClick.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
  }

  // init(films) {
  //   this._films = films.slice();
  //   this._sourcedFilms = films.slice();

  //   this._renderSiteMenu();
  //   this._renderFilmBoard();
  // }

  init() {
    // this._renderSiteMenu();
    this._renderSort();
    this._renderFilmListContainer();
    this._renderFilmBoard();
  }

  _getFilms() {
    // switch (this._currentSortType) {
    //   case SortType.BY_DATE:
    //     return this._filmsModel.getFilms().slice().sort(SortStrategy[SortType.BY_DATE]);
    //   case SortType.BY_RATING:
    //     return this._filmsModel.getFilms().slice().sort(SortStrategy[SortType.BY_RATING]);
    // }

    // return this._filmsModel.getFilms();

    if (this._currentSortType === SortType.DEFAULT) {
      return this._filmsModel.getFilms();
    }
    return this._filmsModel.getFilms().slice().sort(SortStrategy[this._currentSortType]);
  }

  // _handleFilmChange(updatedFilm) {
  //   this._films = updateItem(this._films, updatedFilm);
  //   this._sourcedFilms = updateItem(this._sourcedFilms, updatedFilm);

  //   this._presenterMaps.forEach((presenterMap) => {
  //     const film = presenterMap.get(updatedFilm.id);
  //     return film && film.init(updatedFilm);
  //   });

  //   if (this._filmPopupContainer.classList.contains('hide-overflow')) {
  //     this._filmPopupPresenter.updatePopup(updatedFilm);
  //   }

  //   // Пока не работает
  //   remove(this._siteMenuComponent);
  //   this._renderSiteMenu();
  // }

  _updateSiteMenu() {
    remove(this._siteMenuComponent);
    this._renderSiteMenu();
  }

  _handleViewAction(actionType, updateType, update) {
    console.log(actionType, updateType, update);
    if (actionType === UserAction.UPDATE_FILM) {
      this._filmsModel.updateFilm(updateType, update);
    }
  }

  _handleModelEvent(updateType, data) {
    console.log(updateType, data);
    if (updateType === UpdateType.PATCH) {
      this._filmPresenterMap.get(data.id).init(data);
      this._updateSiteMenu();
    } else if (updateType === UpdateType.MINOR) {
      this._clearFilmBoard();
      this._renderFilmBoard();
    } else if (updateType === UpdateType.MAJOR) {
      this._clearFilmBoard({resetRenderedFilmCount: true, resetSortType: true});
      this._renderFilmBoard();
    }
  }

  _handleShowMoreBtnClick() {
    // this._renderFilms(this._renderedFilmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP);
    // this._renderedFilmCount += FILM_COUNT_PER_STEP;

    const filmCount = this._getFilms().length;
    const newRenderedfilmCount = Math.min(filmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmCount, newRenderedfilmCount);

    // if (this._renderedFilmCount >= this._films.length) {
    //   remove(this._showMoreBtnComponent);
    // }

    this._renderFilms(films);
    this._renderedFilmCount = newRenderedfilmCount;

    if (this._renderedFilmCount >= filmCount) {
      remove(this._showMoreBtnComponent);
    }
  }

  _renderFilmBoard() {
    const films = this._getFilms();
    const filmCount = films.length;

    if (filmCount === 0) {
      this._renderEmptyFilmList();
      return;
    }

    // this._renderSort();
    // this._renderFilmList();
    this._renderSiteMenu();
    this._renderFilms(films.slice(0, Math.min(filmCount, this._renderedFilmCount)));

    if (filmCount > this._renderedFilmCount) {
      this._renderShowMoreBtn();
    }

    this._renderExtra();
  }

  _clearFilmBoard({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    const filmCount = this._getFilms().length;

    this._presenterMaps.forEach((presenterMap) => this._clearPresenter(presenterMap));

    if (this._filmEmptyListComponent) {
      remove(this._filmEmptyListComponent);
    }
    // remove(this._sortComponent);
    remove(this._siteMenuComponent);
    remove(this._showMoreBtnComponent);
    remove(this._extraTopRatedComponent);
    remove(this._extraTopCommentedComponent);

    if (resetRenderedFilmCount) {
      this._renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this._renderedFilmCount = Math.min(filmCount, this._renderedFilmCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  // _sortFilms(sortType) {
  //   if (sortType === SortType.DEFAULT) {
  //     this._films = this._sourcedFilms.slice();
  //     return;
  //   }
  //   this._films.sort(SortStrategy[sortType]);
  //   this._currentSortType = sortType;
  // }

  _handleSortClick(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    // this._sortFilms(sortType);
    this._currentSortType = sortType;
    // this._clearFilmList();
    // this._renderFilmList();
    this._clearFilmBoard({resetRenderedFilmCount:true});
    this._renderFilmBoard();
    this._renderExtra();
  }

  _renderSiteMenu() {
    this._siteMenuComponent = new SiteMenuView(this._getFilms()); // this._films
    render(this._filmBoardContainer, this._siteMenuComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView();
    this._sortComponent.setSortClickHandler(this._handleSortClick);

    render(this._filmBoardContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmListContainer() {
    render(this._filmBoardContainer, this._filmBoardComponent, RenderPosition.BEFOREEND);
    render(this._filmBoardComponent, this._filmListComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEmptyFilmList() {
    this._filmEmptyListComponent = new FilmEmptyListView();
    render(this._filmBoardContainer, this._filmBoardComponent, RenderPosition.BEFOREEND);
    render(this._filmBoardComponent, this._filmEmptyListComponent, RenderPosition.AFTERBEGIN);
  }

  _handleFilmCardClick(film, presenterMap) {
    if (this._filmPopupPresenter) {
      this._filmPopupPresenter.destroy();
    }
    // this._filmPopupPresenter = new FilmPopupPresenter(this._filmPopupContainer, this._handleFilmChange, this._profileName);
    this._filmPopupPresenter = new FilmPopupPresenter(this._filmPopupContainer, this._handleViewAction, this._profileName);

    this._filmPopupPresenter.init(presenterMap.get(film.id).film);
  }

  _renderFilm(container, film, presenterMap) {
    // const filmPresenter = new FilmPresenter(container, this._handleFilmChange, () => this._handleFilmCardClick(film, presenterMap));
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, () => this._handleFilmCardClick(film, presenterMap));
    filmPresenter.init(film);
    presenterMap.set(film.id, filmPresenter);
  }

  // _renderFilms(from, to) {
  //   this._films
  //     .slice(from, to)
  //     .forEach((film) => this._renderFilm(this._filmListContainer, film, this._filmPresenterMap));
  // }

  _renderFilms(films) {
    films.forEach((film) => this._renderFilm(this._filmListContainer, film, this._filmPresenterMap));
  }

  _clearPresenter(presenterMap) {
    presenterMap.forEach((element) => element.destroy());
    presenterMap.clear();
  }

  _clearFilmList() {
    this._renderedFilmCount = FILM_COUNT_PER_STEP;

    this._presenterMaps.forEach((presenterMap) => this._clearPresenter(presenterMap));

    remove(this._showMoreBtnComponent);
    remove(this._extraTopRatedComponent);
    remove(this._extraTopCommentedComponent);
  }

  _renderFilmList() {
    // this._renderFilms(0, Math.min(this._films.length, FILM_COUNT_PER_STEP));

    const filmCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmCount, FILM_COUNT_PER_STEP));

    this._renderFilms(films);

    // if (this._films.length > FILM_COUNT_PER_STEP) {
    //   this._renderShowMoreBtn();
    // }

    if (filmCount > FILM_COUNT_PER_STEP) {
      this._renderShowMoreBtn();
    }
  }

  _renderShowMoreBtn() {
    if (this._showMoreBtnComponent !== null) {
      this._showMoreBtnComponent = null;
    }

    this._showMoreBtnComponent = new ShowMoreButtonView();
    this._showMoreBtnComponent.setClickHandler(this._handleShowMoreBtnClick);

    render(this._filmListComponent, this._showMoreBtnComponent, RenderPosition.BEFOREEND);
  }

  _renderExtra() {
    const films = this._getFilms().slice(); // this._films.slice()

    this._extraTopRatedComponent = new ExtraTopRatedView();
    this._extraTopCommentedComponent = new ExtraTopCommentedView();
    const extraTopRatedContainer = this._extraTopRatedComponent.getExtraContainer();
    const extraTopCommentedContainer = this._extraTopCommentedComponent.getExtraContainer();
    const sortByRating = SortStrategy[SortType.BY_RATING];
    const sortByCommentAmount = SortStrategy[SortType.BY_COMMENT_AMOUNT];

    render(this._filmBoardComponent, this._extraTopRatedComponent, RenderPosition.BEFOREEND);
    render(this._filmBoardComponent, this._extraTopCommentedComponent, RenderPosition.BEFOREEND);

    if (films.length > 1) { // this._films.length
      this._renderFilm(extraTopRatedContainer, films.sort(sortByRating)[0], this._extraTopRatedPresenterMap);
      this._renderFilm(extraTopRatedContainer, films.sort(sortByRating)[1], this._extraTopRatedPresenterMap);
      this._renderFilm(extraTopCommentedContainer, films.sort(sortByCommentAmount)[0], this._extraTopCommentedPresenterMap);
      this._renderFilm(extraTopCommentedContainer, films.sort(sortByCommentAmount)[1], this._extraTopCommentedPresenterMap);
    } else if (films.length === 1) { // this._films.length
      this._renderFilm(extraTopRatedContainer, films[0], this._extraTopRatedPresenterMap);
      this._renderFilm(extraTopCommentedContainer, films[0], this._extraTopCommentedPresenterMap);
    }
  }
}
