import SiteMenuView from './view/site-menu.js';
import SortView from './view/sort.js';
import UserProfileView from './view/user-profile.js';
import ShowMoreButtonView from './view/show-more-button.js';
import FilmBoardView from './view/film-board.js';
import FilmListView from './view/film-list.js';
import FilmCardView from './view/film-card.js';
import FilmCounterView from './view/film-counter.js';
import FilmPopupView from './view/film-popup.js';
import { generateFilmCard } from './mock/film.js';
import { render, remove, RenderPosition, Sort } from './utils.js';

const CARD_COUNT = 20;
const CARD_COUNT_PER_STEP = 5;

const films = new Array(CARD_COUNT).fill().map(generateFilmCard);

const bodyElement = document.querySelector('body');
const siteHeaderElement = bodyElement.querySelector('.header');
const siteMainElement = bodyElement.querySelector('.main');
const footerStatistic = bodyElement.querySelector('.footer__statistics');

const createFilmPopup = (film) => {
  const popupComponent = new FilmPopupView(film);

  bodyElement.classList.add('hide-overflow');
  render(bodyElement, popupComponent, RenderPosition.BEFOREEND);

  const closePopup = () => {
    bodyElement.classList.remove('hide-overflow');
    remove(popupComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      closePopup();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  popupComponent.setClickHandler(() => {
    closePopup();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  document.addEventListener('keydown', onEscKeyDown);
};

const renderFilm = (filmContainer, film) => {
  const filmComponent = new FilmCardView(film);
  filmComponent.setClickHandler(() => createFilmPopup(film));

  render(filmContainer, filmComponent, RenderPosition.BEFOREEND);
};

const filmBoardComponent = new FilmBoardView(films);
const filmListComponent = new FilmListView(films);

render(siteHeaderElement, new UserProfileView(films), RenderPosition.BEFOREEND);
render(siteMainElement, new SiteMenuView(films), RenderPosition.BEFOREEND);
render(siteMainElement, new SortView(), RenderPosition.BEFOREEND);
render(siteMainElement, filmBoardComponent, RenderPosition.BEFOREEND);
render(filmBoardComponent, filmListComponent, RenderPosition.AFTERBEGIN);

for (let i = 0; i < Math.min(films.length, CARD_COUNT_PER_STEP); i++) {
  renderFilm(filmListComponent.getFilmContainer(), films[i]);
}

if (films.length > CARD_COUNT_PER_STEP) {
  let renderedCardCount = CARD_COUNT_PER_STEP;

  const showMoreButtonComponent = new ShowMoreButtonView();
  render(filmListComponent, showMoreButtonComponent, RenderPosition.BEFOREEND);

  showMoreButtonComponent.setClickHandler(() => {
    films
      .slice(renderedCardCount, renderedCardCount + CARD_COUNT_PER_STEP)
      .forEach((film) => renderFilm(filmListComponent.getFilmContainer(), film));

    renderedCardCount += CARD_COUNT_PER_STEP;

    if (renderedCardCount >= films.length) {
      remove(showMoreButtonComponent);
    }
  });
}

const renderExtra = (container, elements, sortFunction) => {
  if (elements.length > 1) {
    const sortedElements = [...elements].sort(sortFunction);

    renderFilm(container, sortedElements[0]);
    renderFilm(container, sortedElements[1]);
  } else if (films.length === 1) {
    renderFilm(container, elements[0]);
  }
};

renderExtra(filmBoardComponent.getTopRatedFilmContainer(), films, Sort.byRating);
renderExtra(filmBoardComponent.getTopCommentedFilmContainer(), films, Sort.byCommentAmount);

render(footerStatistic, new FilmCounterView(films), RenderPosition.BEFOREEND);
