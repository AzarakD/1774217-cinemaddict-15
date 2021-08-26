import AbstractView from './abstract.js';

const sortTypes = [
  'default',
  'date',
  'rating',
];

const createSortButton = (sortType) => (
  `<li><a href="#" class="sort__button" data-sort-type="${sortType}">Sort by ${sortType}</a></li>`
);

// sort__button--active

const createSortTemplate = () => (
  `<ul class="sort">
    ${sortTypes.map((sortType) => createSortButton(sortType)).join(' ')}
  </ul>`
);

export default class Sort extends AbstractView{
  getTemplate() {
    return createSortTemplate();
  }
}
