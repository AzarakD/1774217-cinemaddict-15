import { createMenuTemplate } from './view/menu.js';
import { createSortingTemplate } from './view/sorting.js';
import { createFilmBoardTemplate } from './view/film-board.js';
import { createFilmCardTemplate } from './view/film-card.js';
import { createUserProfileTemplate } from './view/user-profile.js';
import { createShowMoreButtonTemplate } from './view/show-more-button.js';
import { createFilmCounterTemplate } from './view/film-counter.js';
import { createFilmPopupTemplate } from './view/film-popup.js';
import { generateFilmCard } from './mock/film.js';

const CARD_COUNT = 20;
const CARD_COUNT_PER_STEP = 5;

const films = new Array(CARD_COUNT).fill().map(generateFilmCard);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

render(siteMainElement, createMenuTemplate(films), 'beforeend');
render(siteMainElement, createSortingTemplate(), 'beforeend');
render(siteMainElement, createFilmBoardTemplate(films), 'beforeend');
render(siteHeaderElement, createUserProfileTemplate(films), 'beforeend');

const filmsSectionElement = siteMainElement.querySelector('.films');
const filmsListContainer = filmsSectionElement.querySelector('.films-list__container');
const topRatedFilmsContainer = filmsSectionElement.querySelector('.top-rated');
const topCommentedFilmsContainer = filmsSectionElement.querySelector('.top-commented');

for (let i = 0; i < Math.min(films.length, CARD_COUNT_PER_STEP); i++) {
  render(filmsListContainer, createFilmCardTemplate(films[i]), 'beforeend');
}

if (films.length > CARD_COUNT_PER_STEP) {
  let renderedCardCount = CARD_COUNT_PER_STEP;

  render(filmsListContainer, createShowMoreButtonTemplate(), 'afterend');

  const showMoreButton = filmsSectionElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedCardCount, renderedCardCount + CARD_COUNT_PER_STEP)
      .forEach((film) => render(filmsListContainer, createFilmCardTemplate(film), 'beforeend'));

    renderedCardCount += CARD_COUNT_PER_STEP;

    if (renderedCardCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

const topRatedFilms = [...films].sort((a, b) => b.filmInfo.rating - a.filmInfo.rating);
const topCommentedFilms = [...films].sort((a, b) => b.comments.length - a.comments.length);

render(topRatedFilmsContainer, createFilmCardTemplate(topRatedFilms[0]), 'beforeend');
render(topRatedFilmsContainer, createFilmCardTemplate(topRatedFilms[1]), 'beforeend');
render(topCommentedFilmsContainer, createFilmCardTemplate(topCommentedFilms[0]), 'beforeend');
render(topCommentedFilmsContainer, createFilmCardTemplate(topCommentedFilms[1]), 'beforeend');

const footerContainer = siteFooterElement.querySelector('.footer__statistics');

render(footerContainer, createFilmCounterTemplate(films), 'beforeend');
render(siteFooterElement, createFilmPopupTemplate(films[0]), 'afterend');
