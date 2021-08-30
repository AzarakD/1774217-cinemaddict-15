import AbstractView from './abstract.js';

const createFilmPopupTemplate = ({filmInfo}) => {
  const genres = filmInfo.genres.map((element) => `<span class="film-details__genre">${element}</span>`);

  // const userComments = comments.map((element) => (
  //   `<li class="film-details__comment">
  //     <span class="film-details__comment-emoji">
  //       <img src="./images/emoji/${element.emotion}.png" width="55" height="55" alt="emoji-${element.emotion}">
  //     </span>
  //     <div>
  //       <p class="film-details__comment-text">${element.comment}</p>
  //       <p class="film-details__comment-info">
  //         <span class="film-details__comment-author">${element.author}</span>
  //         <span class="film-details__comment-day">${element.date}</span>
  //         <button class="film-details__comment-delete">Delete</button>
  //       </p>
  //     </div>
  //   </li>`
  // ));

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="./${filmInfo.poster}" alt="">

            <p class="film-details__age">${filmInfo.ageRating}</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${filmInfo.title}</h3>
                <p class="film-details__title-original">Original: ${filmInfo.alternativeTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${filmInfo.rating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${filmInfo.director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${filmInfo.writers.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${filmInfo.actors.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${filmInfo.releaseDate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${filmInfo.runtime}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${filmInfo.country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${filmInfo.genres.length > 1 ? 'Genres' : 'Genre'}</td>
                <td class="film-details__cell">${genres.join('')}</td>
              </tr>
            </table>

            <p class="film-details__film-description">${filmInfo.description}</p>
          </div>
        </div>
      </div>

      <div class="film-details__bottom-container"></div>
    </form>
  </section>`;
};

export default class FilmPopup extends AbstractView {
  constructor(film) {
    super();
    this._film = film;

    this._closeClickHandler = this._closeClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmPopupTemplate(this._film);
  }

  get topContainer() {
    return this.getElement().querySelector('.film-details__top-container');
  }

  get bottomContainer() {
    return this.getElement().querySelector('.film-details__bottom-container');
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeClickHandler);
  }
}
