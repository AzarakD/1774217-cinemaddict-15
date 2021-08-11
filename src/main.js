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
  const popupComponent = new FilmPopupView(film);

  const showPopup = () => {
    document.querySelector('body').classList.add('hide-overflow');
    siteFooterElement.appendChild(popupComponent.getElement());
  };

  const closePopup = () => {
    document.querySelector('body').classList.remove('hide-overflow');
    siteFooterElement.removeChild(popupComponent.getElement());
  };

  filmComponent.getElement().querySelector('.film-card__poster').style.cursor = 'pointer';
  filmComponent.getElement().querySelector('.film-card__poster').addEventListener('click', () => {
    showPopup();
  });

  filmComponent.getElement().querySelector('.film-card__title').style.cursor = 'pointer';
  filmComponent.getElement().querySelector('.film-card__title').addEventListener('click', () => {
    showPopup();
  });

  filmComponent.getElement().querySelector('.film-card__comments').addEventListener('click', () => {
    showPopup();
  });

  popupComponent.getElement().querySelector('.film-details__close-btn').addEventListener('click', () => {
    closePopup();
  });

  render(filmContainer, filmComponent.getElement(), RenderPosition.BEFOREEND);
};

render(siteMainElement, new SiteMenuView(films).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SortView().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilmBoardView(films).getElement(), RenderPosition.BEFOREEND);
render(siteHeaderElement, new UserProfileView(films).getElement(), RenderPosition.BEFOREEND);

const filmsListSectionElement = siteMainElement.querySelector('.films-list');
const filmsListContainer = siteMainElement.querySelector('.films-list__container');
const topRatedFilmsContainer = siteMainElement.querySelector('.top-rated');
const topCommentedFilmsContainer = siteMainElement.querySelector('.top-commented');

for (let i = 0; i < Math.min(films.length, CARD_COUNT_PER_STEP); i++) {
  renderFilm(filmsListContainer, films[i]);
}

if (films.length > CARD_COUNT_PER_STEP) {
  let renderedCardCount = CARD_COUNT_PER_STEP;

  const showMoreButtonComponent = new ShowMoreButtonView();
  render(filmsListSectionElement, showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

  showMoreButtonComponent.getElement().addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedCardCount, renderedCardCount + CARD_COUNT_PER_STEP)
      .forEach((film) => renderFilm(filmsListContainer, film));

    renderedCardCount += CARD_COUNT_PER_STEP;

    if (renderedCardCount >= films.length) {
      showMoreButtonComponent.getElement().remove();
      showMoreButtonComponent.removeElement();
    }
  });
}

const topRatedFilms = [...films].sort((a, b) => b.filmInfo.rating - a.filmInfo.rating);
const topCommentedFilms = [...films].sort((a, b) => b.comments.length - a.comments.length);

renderFilm(topRatedFilmsContainer, topRatedFilms[0]);
renderFilm(topRatedFilmsContainer, topRatedFilms[1]);
renderFilm(topCommentedFilmsContainer, topCommentedFilms[0]);
renderFilm(topCommentedFilmsContainer, topCommentedFilms[1]);

const footerContainer = siteFooterElement.querySelector('.footer__statistics');

render(footerContainer, new FilmCounteView(films).getElement(), RenderPosition.BEFOREEND);
