import dayjs from 'dayjs';
import {
  getRandomInteger,
  getRandomUniqElement,
  getRandomFloat,
  getRandomElement,
  getRandomArray
} from '../utils';

import {
  POSTERS,
  TITLES,
  FIRST_NAMES,
  SECOND_NAMES,
  COUNTRIES,
  GENRES,
  DESCRIPTIONS,
  AGES,
  COMMENTS,
  EMOTIONS
} from './consts';

const generateDescription = () => {
  const sentenceCount = getRandomInteger(1, 5);

  const newArray = [...DESCRIPTIONS];
  const descriptionArray = [];

  for (let i = 0; i < sentenceCount; i++) {
    descriptionArray.push(getRandomUniqElement(newArray));
  }

  return descriptionArray.join(' ');
};

const generatePerson = () => `${getRandomElement(FIRST_NAMES)} ${getRandomElement(SECOND_NAMES)}`;

const generatePeople = () => {
  const people = [];
  const peopleCount = getRandomInteger(1, 5);

  for (let i = 0; i < peopleCount; i++) {
    people.push(generatePerson());
  }

  return people;
};

const generateReleaseDate = () => {
  const maxDaysGap = 10000;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);

  return dayjs('1950-01-01').add(daysGap, 'day').format('DD MMMM YYYY');
};

const generateDate = () => {
  const maxDaysGap = 1000;
  const maxMinuteGap = 720;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
  const minuteGap = getRandomInteger(-maxMinuteGap, maxMinuteGap);

  return dayjs('2015-01-01').add(daysGap, 'day').add(minuteGap, 'minute').format('YYYY/MM/DD hh:mm');
};

const generateRuntime = () => {
  const hour = getRandomInteger(0, 3);
  const minute = getRandomInteger(0, 59);

  let runtimeStr = hour > 0 ? `${hour}h` : '';
  runtimeStr += minute > 0 ? ` ${minute}m` : '';

  return runtimeStr;
};

const generateFilmInfo = () => {
  const sameTitleIndex = getRandomInteger(0, TITLES.length - 1);

  return {
    poster: POSTERS[sameTitleIndex],
    title: TITLES[sameTitleIndex],
    alternativeTitle: TITLES[sameTitleIndex],
    rating: getRandomFloat(0, 10),
    director: generatePerson(),
    writers: generatePeople(),
    actors: generatePeople(),
    releaseDate: generateReleaseDate(),
    runtime: generateRuntime(),
    country: getRandomElement(COUNTRIES),
    genres: getRandomArray(GENRES),
    description: generateDescription(),
    ageRating: getRandomElement(AGES),
  };
};

const generateUserDetails = () => ({
  isInWatchlist: Boolean(getRandomInteger(0, 1)),
  isWatched: Boolean(getRandomInteger(0, 1)),
  isFavorite: Boolean(getRandomInteger(0, 1)),
  watchingDate: generateDate(),
});

const generateComment = () => ({
  id: getRandomInteger(0, 100),
  author: generatePerson(),
  comment: getRandomElement(COMMENTS),
  date: generateDate(),
  emotion: getRandomElement(EMOTIONS),
});

const generateComments = () => {
  const commentCount = getRandomInteger(0, 5);

  return new Array(commentCount).fill().map(generateComment);
};

export const generateFilmCard = () => ({
  id: getRandomInteger(0, 100),
  comments: generateComments(),
  filmInfo: generateFilmInfo(),
  userDetails: generateUserDetails(),
});
