import { nanoid } from 'nanoid';
import {
  getRandomInteger,
  getRandomFloat,
  getRandomElement,
  getRandomUniqueSequenceFrom,
  generateReleaseDate,
  generateDate
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
  const generatedDescriptions = getRandomUniqueSequenceFrom(DESCRIPTIONS, sentenceCount);

  return generatedDescriptions.join(' ');
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
    genres: getRandomUniqueSequenceFrom(GENRES),
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
  id: nanoid(),
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
  id: nanoid(),
  comments: generateComments(),
  filmInfo: generateFilmInfo(),
  userDetails: generateUserDetails(),
});
