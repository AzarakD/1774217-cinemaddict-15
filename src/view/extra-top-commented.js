import AbstractView from './abstract.js';

const createExtraTopCommentedTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Most commented</h2>
    <div class="films-list__container top-commented"></div>
  </section>`
);

export default class ExtraTopCommented extends AbstractView {
  getTemplate() {
    return createExtraTopCommentedTemplate();
  }

  getExtraContainer() {
    if (!this._element) {
      this.getElement();
    }

    return this._element.querySelector('.top-commented');
  }
}
