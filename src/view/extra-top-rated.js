import AbstractView from './abstract.js';

const createExtraTopRatedTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Top rated</h2>
    <div class="films-list__container top-rated"></div>
  </section>`
);

export default class ExtraTopRated extends AbstractView {
  getTemplate() {
    return createExtraTopRatedTemplate();
  }

  getExtraContainer() {
    if (!this._element) {
      this.getElement();
    }

    return this._element.querySelector('.top-rated');
  }
}
