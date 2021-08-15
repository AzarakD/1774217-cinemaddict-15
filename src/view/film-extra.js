import AbstractView from './abstract.js';

const createFilmExtraTemplate = (films) => (
  films.length > 0 ? `<section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container top-rated"></div>
    </section>
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container top-commented"></div>
    </section>` : ''
);

export default class FilmExtra extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createFilmExtraTemplate(this._films);
  }

  getTopRatedFilmContainer() {
    if (!this._element) {
      this.getElement();
    }

    return this._element.querySelector('.top-rated');
  }

  getTopCommentedFilmContainer() {
    if (!this._element) {
      this.getElement();
    }

    return this._element.querySelector('.top-commented');
  }
}
