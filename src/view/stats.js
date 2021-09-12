import SmartView from './smart.js';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);
// import Chart from 'chart.js';
// import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FilterPeriod } from '../consts.js';
import { getWatchedFilms, getRank } from '../utils.js';


const getTotalDuration = (films) => {
  let totalDuration = 0;

  films.forEach((film) => {
    totalDuration += film.filmInfo.runtime;
  });

  return totalDuration;
};

const getTopGenre = (films) => {
  const genresList = [];
  const genresCountMap = new Map();

  let topGenre = '';
  let count = 0;

  films.forEach((film) => genresList.push(...film.filmInfo.genres));
  genresList.forEach((genre) => genresCountMap.set(genre, genresCountMap.get(genre) ? genresCountMap.get(genre) + 1 : 1));

  for (const entry of genresCountMap) {
    if (entry[1] > count) {
      topGenre = entry[0];
      count = entry[1];
    }
  }

  return topGenre;
};

const createStatsTemplate = (films, profileRank, filter) => {
  const totalDuration = getTotalDuration(films);

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${profileRank}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time"${filter === FilterPeriod.ALL_TIME ? ' checked' : ''}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today"${filter === FilterPeriod.TODAY ? ' checked' : ''}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week"${filter === FilterPeriod.WEEK ? ' checked' : ''}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month"${filter === FilterPeriod.MONTH ? ' checked' : ''}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year"${filter === FilterPeriod.YEAR ? ' checked' : ''}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${films.length} <span class="statistic__item-description">${films.length > 1 ? 'movies' : 'movie'}</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${(totalDuration - totalDuration % 60) / 60} <span class="statistic__item-description">h</span> ${totalDuration % 60} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${getTopGenre(films)}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};

export default class Stats extends SmartView {
  constructor(films) {
    super();
    this._films = getWatchedFilms(films);
    this._allWatchedFilms = this._films.slice();
    this._profileRank = getRank(this._films);

    this._currentFilter = FilterPeriod.ALL_TIME;

    this._filterClickHandler = this._filterClickHandler.bind(this);
    this._filterFilmsByPeriod = this._filterFilmsByPeriod.bind(this);

    this._setFilterClickHandler();
  }

  getTemplate() {
    return createStatsTemplate(this._films, this._profileRank, this._currentFilter);
  }

  restoreHandlers() {
    this._setFilterClickHandler();
  }

  _setFilterClickHandler() {
    this.getElement().querySelector('.statistic__filters').
      addEventListener('input', this._filterClickHandler);
  }

  _filterClickHandler(evt) {
    this._currentFilter = evt.target.value;
    this._films = this._filterFilmsByPeriod(this._allWatchedFilms, this._currentFilter);

    this.updateElement();
  }

  _filterFilmsByPeriod(films, period) {
    if (period === FilterPeriod.ALL_TIME) {
      return films;
    } else if (period === FilterPeriod.TODAY) {
      return films.filter((film) => dayjs(film.userDetails.watchingDate).isSame(dayjs(), 'day'));
    } else if (period === FilterPeriod.WEEK) {
      return films.filter((film) => dayjs(film.userDetails.watchingDate).isBetween(dayjs().add(-7, 'day'), dayjs(), 'day'));
    } else if (period === FilterPeriod.MONTH) {
      return films.filter((film) => dayjs(film.userDetails.watchingDate).isBetween(dayjs().add(-30, 'day'), dayjs(), 'day'));
    } else if (period === FilterPeriod.YEAR) {
      return films.filter((film) => dayjs(film.userDetails.watchingDate).isBetween(dayjs().add(-365, 'day'), dayjs(), 'day'));
    }
  }
}
