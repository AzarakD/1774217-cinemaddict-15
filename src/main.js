import FilmsModel from './model/films.js';
import UserProfileView from './view/user-profile.js';
import FilmCounterView from './view/film-counter.js';
import FilmBoardPresenter from './presenter/film-board.js';
import { generateFilmCard } from './mock/film.js';
import { render, RenderPosition } from './utils.js';

const FILM_COUNT = 20;

const films = new Array(FILM_COUNT).fill().map(generateFilmCard);

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatistic = document.querySelector('.footer__statistics');

render(siteHeaderElement, new UserProfileView(films), RenderPosition.BEFOREEND);

new FilmBoardPresenter(siteMainElement, filmsModel).init();

render(footerStatistic, new FilmCounterView(films), RenderPosition.BEFOREEND);
