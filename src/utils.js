﻿import Abstract from './view/abstract.js';

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  AFTEREND: 'afterend',
  BEFOREEND: 'beforeend',
};

export const Sort = {
  byRating: (a, b) => b.filmInfo.rating - a.filmInfo.rating,
  byCommentAmount: (a, b) => b.comments.length - a.comments.length,
};

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
  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export const getRandomInteger = (a = 0, b = 1) => {
  const min = Math.ceil(Math.min(a, b));
  const max = Math.floor(Math.max(a, b));

  return Math.floor(min + Math.random() * (max - min + 1));
};

export const getRandomFloat = (a = 0, b = 1, signs = 1) => {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  const divider = Math.pow(10, signs);

  return Math.floor((Math.random() * (max - min + (1 / divider)) + min) * divider) / divider;
};

export const getRandomElement = (array) => array[getRandomInteger(0, array.length - 1)];

export const getRandomUniqueSequenceFrom = (array, length) => {
  const sliceTo = length === undefined ? getRandomInteger(1, array.length) : length;
  const newArray = Array.from(new Set(array))
    .sort(() => Math.random() - 0.5)
    .slice(0, sliceTo);

  return newArray;
};
