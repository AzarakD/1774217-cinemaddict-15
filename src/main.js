import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import UserProfileView from './view/user-profile.js';
import StatsView from './view/stats.js';
import FilmCounterView from './view/film-counter.js';
import FilterMenuPresenter from './presenter/filter-menu.js';
import FilmBoardPresenter from './presenter/film-board.js';
import { generateFilmCard } from './mock/film.js';
import { remove, render } from './utils.js';
import { RenderPosition, PageState } from './consts.js';

const FILM_COUNT = 20;

const films = new Array(FILM_COUNT).fill().map(generateFilmCard);

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatistic = document.querySelector('.footer__statistics');

render(siteHeaderElement, new UserProfileView(filmsModel.getFilms()), RenderPosition.BEFOREEND);

const filterMenuPresenter = new FilterMenuPresenter(siteMainElement, filmsModel, filterModel);
const filmBoardPresenter = new FilmBoardPresenter(siteMainElement, filmsModel, filterModel);
let statsComponent = null;

export const handleSiteMenuClick = (menuItem) => {
  if (menuItem === PageState.STATS) {
    filmBoardPresenter.destroy();
    filterMenuPresenter.init(menuItem);

    statsComponent = new StatsView(filmsModel.getFilms());
    render(siteMainElement, statsComponent, RenderPosition.BEFOREEND);
    return;
  }

  if (siteMainElement.contains(filmBoardPresenter.getNode())) {
    return;
  }
  remove(statsComponent);

  filterMenuPresenter.init();
  filmBoardPresenter.init();
};

filterMenuPresenter.init();
filmBoardPresenter.init();

render(footerStatistic, new FilmCounterView(films), RenderPosition.BEFOREEND);
