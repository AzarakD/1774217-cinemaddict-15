import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import UserProfileView from './view/user-profile.js';
import FilmCounterView from './view/film-counter.js';
import FilterMenuPresenter from './presenter/filter-menu.js';
import FilmBoardPresenter from './presenter/film-board.js';
import { generateFilmCard } from './mock/film.js';
import { render } from './utils.js';
import { RenderPosition, PageState } from './consts.js';

const FILM_COUNT = 20;

const films = new Array(FILM_COUNT).fill().map(generateFilmCard);

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatistic = document.querySelector('.footer__statistics');

render(siteHeaderElement, new UserProfileView(films), RenderPosition.BEFOREEND);

const filterMenuPresenter = new FilterMenuPresenter(siteMainElement, filmsModel, filterModel);
const filmBoardPresenter = new FilmBoardPresenter(siteMainElement, filmsModel, filterModel);

export const handleSiteMenuClick = (menuItem) => {
  if (menuItem === PageState.FILMS) {
    if (siteMainElement.contains(filmBoardPresenter.getNode())) {
      return;
    }
    filterMenuPresenter.init();
    filmBoardPresenter.init();
  } else if (menuItem === PageState.STATS) {
    filmBoardPresenter.destroy();
    filterMenuPresenter.init(menuItem);
  }
};

filterMenuPresenter.init();
filmBoardPresenter.init();

render(footerStatistic, new FilmCounterView(films), RenderPosition.BEFOREEND);
