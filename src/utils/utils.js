import { UserProfileRatings } from '../consts.js';
import Abstract from '../view/abstract.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(duration);
dayjs.extend(relativeTime);

export const render = (container, element, place) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (element instanceof Abstract) {
    element = element.getElement();
  }

  if (container) {
    container.insertAdjacentElement(place, element);
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const replace = (newChild, oldChild) => {
  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  parent.replaceChild(newChild, oldChild);
};

export const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};

export const getRandomInteger = (a = 0, b = 1) => {
  const min = Math.ceil(Math.min(a, b));
  const max = Math.floor(Math.max(a, b));

  return Math.floor(min + Math.random() * (max - min + 1));
};

export const getWatchedFilms = (films) => films.filter((film) => film.userDetails.isWatched);

export const getRank = (watchedFilms) => {
  const watchedFilmsCount = watchedFilms.length;

  if (watchedFilmsCount < 1) {
    return '';
  } else if (watchedFilmsCount < 11) {
    return UserProfileRatings.NOVICE;
  } else if (watchedFilmsCount < 21) {
    return UserProfileRatings.FAN;
  }

  return UserProfileRatings.MOVIE_BUFF;
};

export const getHoursAndMinutes = (time) => time < 60 ? `${time}m` : dayjs.duration(time, 'm').format('H[h] mm[m]');

export const humanizeDate = (date) => dayjs(date).fromNow();

export const formatDate = (date, format='DD MMMM YYYY') => date ? dayjs(date).format(format) : null;

export const shake = (element, callback, animationTimeout=600) => {
  element.style.animation = `shake ${animationTimeout / 1000}s`;
  setTimeout(() => {
    element.style.animation = '';

    if (callback) {
      callback();
    }
  }, animationTimeout);
};
