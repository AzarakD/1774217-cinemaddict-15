import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import UserProfileView from './view/user-profile.js';
import StatsView from './view/stats.js';
import FilmCounterView from './view/film-counter.js';
import FilterMenuPresenter from './presenter/filter-menu.js';
import FilmBoardPresenter from './presenter/film-board.js';
import { remove, render } from './utils.js';
import { RenderPosition, PageState, UpdateType } from './consts.js';
import Api from './api.js';

const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';
const AUTHORIZATION = 'Basic BBziUcTOvPtL7Qy';

const api = new Api(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel(api);
const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatistic = document.querySelector('.footer__statistics');

const filterMenuPresenter = new FilterMenuPresenter(siteMainElement, filmsModel, filterModel);
const filmBoardPresenter = new FilmBoardPresenter(siteMainElement, filmsModel, filterModel);
const filmCounterComponent = new FilmCounterView(filmsModel.getFilms());
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

render(footerStatistic, filmCounterComponent, RenderPosition.BEFOREEND);

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    render(siteHeaderElement, new UserProfileView(films), RenderPosition.BEFOREEND);
    filmCounterComponent.updateElement(films);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });
