import UserProfileView from '../view/user-profile.js';
import { render, remove, replace, getWatchedFilms } from '../utils/utils';
import { RenderPosition } from '../consts';

export default class UserProfile {
  constructor(container, filmsModel) {
    this._userProfileContainer = container;
    this._filmsModel = filmsModel;
    this._userProfileComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const films = this._filmsModel.getFilms();
    const watchedFilms = getWatchedFilms(films);

    const prevUserProfileComponent = this._userProfileComponent;
    this._userProfileComponent = new UserProfileView(watchedFilms);

    if (prevUserProfileComponent === null) {
      render(this._userProfileContainer, this._userProfileComponent, RenderPosition.BEFOREEND);
      return;
    }
    replace(this._userProfileComponent, prevUserProfileComponent);
    remove(prevUserProfileComponent);
  }

  _handleModelEvent() {
    this.init();
  }
}
