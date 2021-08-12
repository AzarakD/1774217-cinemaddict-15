import SiteMenuView from './view/site-menu.js';
import SortView from './view/sort.js';
import FilmBoardView from './view/film-board.js';
import FilmCardView from './view/film-card.js';
import UserProfileView from './view/user-profile.js';
import ShowMoreButtonView from './view/show-more-button.js';
import FilmCounteView from './view/film-counter.js';
import FilmPopupView from './view/film-popup.js';
import { generateFilmCard } from './mock/film.js';
import { render, RenderPosition } from './utils.js';

const CARD_COUNT = 20;
const CARD_COUNT_PER_STEP = 5;

const films = new Array(CARD_COUNT).fill().map(generateFilmCard);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const renderFilm = (filmContainer, film) => {
  const filmComponent = new FilmCardView(film);

  const createFilmPopup = () => {
    const popupComponent = new FilmPopupView(film);

    document.querySelector('body').classList.add('hide-overflow');
    siteFooterElement.appendChild(popupComponent.getElement());

    const closePopup = () => {
      document.querySelector('body').classList.remove('hide-overflow');
      siteFooterElement.removeChild(popupComponent.getElement());
    };

    popupComponent.getElement().querySelector('.film-details__close-btn').addEventListener('click', closePopup);
  };

  filmComponent.getElement().querySelectorAll('.film-card__poster, .film-card__title')
    .forEach((element) => element.style.cursor = 'pointer');

  filmComponent.getElement().querySelectorAll('.film-card__poster, .film-card__title, .film-card__comments')
    .forEach((element) => element.addEventListener('click', createFilmPopup));

  render(filmContainer, filmComponent.getElement(), RenderPosition.BEFOREEND);
};

render(siteMainElement, new SiteMenuView(films).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SortView().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilmBoardView(films).getElement(), RenderPosition.BEFOREEND);
render(siteHeaderElement, new UserProfileView(films).getElement(), RenderPosition.BEFOREEND);

const filmListSectionElement = siteMainElement.querySelector('.films-list');
const filmListContainer = siteMainElement.querySelector('.films-list__container');
const topRatedFilmContainer = siteMainElement.querySelector('.top-rated');
const topCommentedFilmContainer = siteMainElement.querySelector('.top-commented');

for (let i = 0; i < Math.min(films.length, CARD_COUNT_PER_STEP); i++) {
  renderFilm(filmListContainer, films[i]);
}

if (films.length > CARD_COUNT_PER_STEP) {
  let renderedCardCount = CARD_COUNT_PER_STEP;

  const showMoreButtonComponent = new ShowMoreButtonView();
  render(filmListSectionElement, showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

  showMoreButtonComponent.getElement().addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedCardCount, renderedCardCount + CARD_COUNT_PER_STEP)
      .forEach((film) => renderFilm(filmListContainer, film));

    renderedCardCount += CARD_COUNT_PER_STEP;

    if (renderedCardCount >= films.length) {
      showMoreButtonComponent.getElement().remove();
      showMoreButtonComponent.removeElement();
    }
  });
}

const topRatedFilms = [...films].sort((a, b) => b.filmInfo.rating - a.filmInfo.rating);
const topCommentedFilms = [...films].sort((a, b) => b.comments.length - a.comments.length);

renderFilm(topRatedFilmContainer, topRatedFilms[0]);
renderFilm(topRatedFilmContainer, topRatedFilms[1]);
renderFilm(topCommentedFilmContainer, topCommentedFilms[0]);
renderFilm(topCommentedFilmContainer, topCommentedFilms[1]);

const footerContainer = siteFooterElement.querySelector('.footer__statistics');

render(footerContainer, new FilmCounteView(films).getElement(), RenderPosition.BEFOREEND);
