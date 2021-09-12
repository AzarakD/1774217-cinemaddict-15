import FilmPresenter from './film.js';
import FilmPopupPresenter from './film-popup.js';
import FilmBoardView from '../view/film-board.js';
import FilmListView from '../view/film-list.js';
import FilmEmptyListView from '../view/film-empty-list.js';
import SortView from '../view/sort.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import ExtraTopRatedView from '../view/extra-top-rated.js';
import ExtraTopCommentedView from '../view/extra-top-commented.js';
import { render, remove, SortStrategy, FilterStrategy } from '../utils.js';
import { RenderPosition, SortType, UserAction, UpdateType, FilterType } from '../consts.js';

const FILM_COUNT_PER_STEP = 5;

export default class FilmBoard {
  constructor(container, filmsModel, filterModel) {
    this._filmBoardContainer = container;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._filterType = FilterType.ALL;

    this._filmPresenterMap = new Map();
    this._extraTopRatedPresenterMap = new Map();
    this._extraTopCommentedPresenterMap = new Map();

    this._presenterMaps = [
      this._filmPresenterMap,
      this._extraTopRatedPresenterMap,
      this._extraTopCommentedPresenterMap,
    ];

    this._filmBoardComponent = new FilmBoardView();
    this._filmListComponent = null;
    this._sortComponent = null;
    this._showMoreBtnComponent = null;
    this._filmEmptyListComponent = null;

    this._filmPopupContainer = document.querySelector('body');
    this._profileName = document.querySelector('.profile__rating').textContent;

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handleShowMoreBtnClick = this._handleShowMoreBtnClick.bind(this);
    this._handleSortClick = this._handleSortClick.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
  }

  init() {
    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    render(this._filmBoardContainer, this._filmBoardComponent, RenderPosition.BEFOREEND);
    this._renderFilmBoard();
  }

  getNode() {
    return this._filmBoardComponent.getElement();
  }

  destroy() {
    this._clearFilmBoard({resetRenderedFilmCount: true, resetSortType: true});
    remove(this._filmBoardComponent);

    this._filmsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _getFilms() {
    this._filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = FilterStrategy[this._filterType](films);

    if (this._currentSortType === SortType.DEFAULT) {
      return filteredFilms;
    }
    return filteredFilms.slice().sort(SortStrategy[this._currentSortType]);
  }

  _handleViewAction(actionType, updateType, update) {
    if (actionType === UserAction.UPDATE_FILM) {
      this._filmsModel.updateFilm(updateType, update);
    } else if (actionType === UserAction.ADD_COMMENT) {
      this._filmsModel.addComment(updateType, update);
    } else if (actionType === UserAction.DELETE_COMMENT) {
      this._filmsModel.deleteComment(updateType, update);
    }
  }

  _handleModelEvent(updateType, data) {
    if (updateType === UpdateType.PATCH) {
      this._presenterMaps.forEach((presenterMap) => {
        const film = presenterMap.get(data.id);
        return film && film.init(data);
      });
    } else if (updateType === UpdateType.MINOR) {
      this._clearFilmBoard({resetRenderedFilmCount: true}); // false - уточнить в ТЗ
      this._renderFilmBoard();
      if (this._filmPopupPresenter) {
        this._filmPopupPresenter.updatePopup(data);
      }
    } else if (updateType === UpdateType.MAJOR) {
      this._clearFilmBoard({resetRenderedFilmCount: true, resetSortType: true});
      this._renderFilmBoard();
    }
  }

  _renderFilmBoard() {
    this._films = this._getFilms();
    const filmCount = this._films.length;

    if (filmCount === 0) {
      this._renderEmptyFilmListComponent();
      return;
    }

    this._renderSort();
    this._renderFilmListComponent();
    this._renderFilms(this._films.slice(0, Math.min(filmCount, this._renderedFilmCount)));

    if (filmCount > this._renderedFilmCount) {
      this._renderShowMoreBtn();
    }

    this._renderExtra();
  }

  _clearFilmBoard({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    const filmCount = this._films.length;

    this._presenterMaps.forEach((presenterMap) => this._clearPresenter(presenterMap));

    if (this._filmEmptyListComponent) {
      remove(this._filmEmptyListComponent);
    }

    remove(this._sortComponent);
    remove(this._showMoreBtnComponent);
    remove(this._filmListComponent);

    if (this._extraTopRatedComponent) {
      remove(this._extraTopRatedComponent);
      remove(this._extraTopCommentedComponent);
    }

    if (resetRenderedFilmCount) {
      this._renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this._renderedFilmCount = Math.min(filmCount, this._renderedFilmCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _clearPresenter(presenterMap) {
    presenterMap.forEach((element) => element.destroy());
    presenterMap.clear();
  }

  _handleSortClick(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearFilmBoard({resetRenderedFilmCount:true});
    this._renderFilmBoard();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortClickHandler(this._handleSortClick);

    render(this._filmBoardComponent, this._sortComponent, RenderPosition.BEFOREBEGIN);
  }

  _renderFilmListComponent() {
    this._filmListComponent = new FilmListView();
    this._filmListContainer = this._filmListComponent.getFilmContainer();
    render(this._filmBoardComponent, this._filmListComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEmptyFilmListComponent() {
    this._filmEmptyListComponent = new FilmEmptyListView(this._filterType);
    render(this._filmBoardComponent, this._filmEmptyListComponent, RenderPosition.AFTERBEGIN);
  }

  _handleFilmCardClick(film, presenterMap) {
    if (this._filmPopupPresenter) {
      this._filmPopupPresenter.destroy();
    }
    this._filmPopupPresenter = new FilmPopupPresenter(this._filmPopupContainer, this._handleViewAction, this._profileName);

    this._filmPopupPresenter.init(presenterMap.get(film.id).film);
  }

  _renderFilm(container, film, presenterMap) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, () => this._handleFilmCardClick(film, presenterMap));
    filmPresenter.init(film);
    presenterMap.set(film.id, filmPresenter);
  }

  _renderFilms(films) {
    films.forEach((film) => this._renderFilm(this._filmListContainer, film, this._filmPresenterMap));
  }

  _handleShowMoreBtnClick() {
    const filmCount = this._getFilms().length;
    const newRenderedfilmCount = Math.min(filmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmCount, newRenderedfilmCount);

    this._renderFilms(films);
    this._renderedFilmCount = newRenderedfilmCount;

    if (this._renderedFilmCount >= filmCount) {
      remove(this._showMoreBtnComponent);
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
    const films = this._films.slice();

    this._extraTopRatedComponent = new ExtraTopRatedView();
    this._extraTopCommentedComponent = new ExtraTopCommentedView();
    const extraTopRatedContainer = this._extraTopRatedComponent.getExtraContainer();
    const extraTopCommentedContainer = this._extraTopCommentedComponent.getExtraContainer();
    const sortByRating = SortStrategy[SortType.BY_RATING];
    const sortByCommentAmount = SortStrategy[SortType.BY_COMMENT_AMOUNT];

    render(this._filmBoardComponent, this._extraTopRatedComponent, RenderPosition.BEFOREEND);
    render(this._filmBoardComponent, this._extraTopCommentedComponent, RenderPosition.BEFOREEND);

    if (films.length > 1) {
      this._renderFilm(extraTopRatedContainer, films.sort(sortByRating)[0], this._extraTopRatedPresenterMap);
      this._renderFilm(extraTopRatedContainer, films.sort(sortByRating)[1], this._extraTopRatedPresenterMap);
      this._renderFilm(extraTopCommentedContainer, films.sort(sortByCommentAmount)[0], this._extraTopCommentedPresenterMap);
      this._renderFilm(extraTopCommentedContainer, films.sort(sortByCommentAmount)[1], this._extraTopCommentedPresenterMap);
    } else if (films.length === 1) {
      this._renderFilm(extraTopRatedContainer, films[0], this._extraTopRatedPresenterMap);
      this._renderFilm(extraTopCommentedContainer, films[0], this._extraTopCommentedPresenterMap);
    }
  }
}
