import AbstractView from './abstract.js';

const createFilmEmptyListTemplate = () => (
  `<section class="films-list">
    <h2 class="films-list__title">There are no movies in our database</h2>
  </section>`
);

export default class FilmEmptyList extends AbstractView {
  getTemplate() {
    return createFilmEmptyListTemplate();
  }
}
