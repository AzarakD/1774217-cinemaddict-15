import { createSiteMenuTemplate } from './view/menu.js';
import { createSortingTemplate } from './view/sorting.js';
import { createFilmsBoardTemplate } from './view/films-board.js';
import { createFilmCardTemplate } from './view/film-card.js';
import { createUserProfileTemplate } from './view/user-profile.js';
import { createShowMoreButtonTemplate } from './view/show-more-button.js';
import { createFilmsCounterTemplate } from './view/films-counter.js';
import { createFilmPopupTemplate } from './view/film-popup.js';

const CARDS = 5;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

render(siteMainElement, createSiteMenuTemplate(), 'beforeend');
render(siteMainElement, createSortingTemplate(), 'beforeend');
render(siteMainElement, createFilmsBoardTemplate(), 'beforeend');
render(siteHeaderElement, createUserProfileTemplate(), 'beforeend');

const filmsSectionElement = siteMainElement.querySelector('.films');
const filmsListContainer = filmsSectionElement.querySelector('.films-list__container');
const topRatedFilmsContainer = filmsSectionElement.querySelector('.top-rated');
const topCommentedFilmsContainer = filmsSectionElement.querySelector('.top-commented');

for (let i = 0; i < CARDS; i++) {
  render(filmsListContainer, createFilmCardTemplate(), 'beforeend');
}

render(filmsSectionElement, createShowMoreButtonTemplate(), 'beforeend');

render(topRatedFilmsContainer, createFilmCardTemplate(), 'beforeend');
render(topRatedFilmsContainer, createFilmCardTemplate(), 'beforeend');
render(topCommentedFilmsContainer, createFilmCardTemplate(), 'beforeend');
render(topCommentedFilmsContainer, createFilmCardTemplate(), 'beforeend');

const footerContainer = siteFooterElement.querySelector('.footer__statistics');

render(footerContainer, createFilmsCounterTemplate(), 'beforeend');
render(siteFooterElement, createFilmPopupTemplate(), 'afterend');
