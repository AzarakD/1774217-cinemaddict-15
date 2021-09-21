import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import StatsView from './view/stats.js';
import FilmCounterView from './view/film-counter.js';
import FilterMenuPresenter from './presenter/filter-menu.js';
import FilmBoardPresenter from './presenter/film-board.js';
import UserProfilePresenter from './presenter/user-profile.js';
import { toast, removeToast } from './utils/toast.js';
import { isOnline, remove, render } from './utils/utils.js';
import { RenderPosition, PageState, UpdateType } from './consts.js';
import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';

const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';
const AUTHORIZATION = 'Basic BBziUcTOvPtL7Qy';
const STORE_PREFIX = 'cinemaddict-localstorage';
const STORE_VER = 'v1';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const filmsModel = new FilmsModel(apiWithProvider);
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

if (!isOnline()) {
  toast('You are in offline mode');
}

apiWithProvider.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    const userProfilePresenter = new UserProfilePresenter(siteHeaderElement, filmsModel);

    userProfilePresenter.init();
    filmCounterComponent.updateElement(films);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  removeToast();

  if (apiWithProvider.isSyncNeeded) {
    apiWithProvider.sync();
  }
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
  toast('You are in offline mode');
});
