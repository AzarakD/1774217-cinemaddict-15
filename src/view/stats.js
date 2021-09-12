import SmartView from './smart.js';
import { FilterPeriod } from '../consts.js';
import { PeriodStrategy, getWatchedFilms, getRank } from '../utils.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

const renderChart = (statsCtx, {scoredGenres}) => {
  const BAR_HEIGHT = 50;

  statsCtx.height = BAR_HEIGHT * scoredGenres.length;

  return new Chart(statsCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: scoredGenres.map((pair) => pair[0]),
      datasets: [{
        data: scoredGenres.map((pair) => pair[1]),
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
        barThickness: 24,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatsTemplate = ({films, profileRank, filter, totalDuration, scoredGenres}) => (
  `<section class="statistic">
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
        <p class="statistic__item-text">${scoredGenres[0] ? scoredGenres[0][0] : ''}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`
);

export default class Stats extends SmartView {
  constructor(films) {
    super();
    this._films = getWatchedFilms(films);
    this._profileRank = getRank(this._films);
    this._currentFilter = FilterPeriod.ALL_TIME;

    this._data = this._parseFilmsToData(this._films);

    this._filterClickHandler = this._filterClickHandler.bind(this);

    this._setFilterClickHandler();
    this._setChart();
  }

  getTemplate() {
    return createStatsTemplate(this._data);
  }

  restoreHandlers() {
    this._setFilterClickHandler();
    this._setChart();
  }

  _setFilterClickHandler() {
    this.getElement().querySelector('.statistic__filters').
      addEventListener('input', this._filterClickHandler);
  }

  _setChart() {
    if (this._chart !== null) {
      this._chart = null;
    }

    const statsChart = this.getElement().querySelector('.statistic__chart');

    this._chart = renderChart(statsChart, this._data);
  }

  _filterClickHandler(evt) {
    this._currentFilter = evt.target.value;
    const filteredFilms = this._filterFilmsByPeriod(this._films);

    this.updateData(this._parseFilmsToData(filteredFilms));
  }

  _filterFilmsByPeriod(films) {
    if (this._currentFilter === FilterPeriod.ALL_TIME) {
      return films;
    }

    return films.filter((film) => dayjs(film.userDetails.watchingDate).isBetween(PeriodStrategy[this._currentFilter](), dayjs().toDate()));
  }

  _getTotalDuration(films) {
    let totalDuration = 0;

    films.forEach((film) => {
      totalDuration += film.filmInfo.runtime;
    });

    return totalDuration;
  }

  _getScoredGenres(films) {
    const genresList = [];
    const genresCountMap = new Map();

    films.forEach((film) => genresList.push(...film.filmInfo.genres));
    genresList.forEach((genre) => genresCountMap.set(genre, genresCountMap.get(genre) ? genresCountMap.get(genre) + 1 : 1));

    const scoredGenres = Array.from(genresCountMap);
    scoredGenres.sort((a, b) => b[1] - a[1]);

    return scoredGenres;
  }

  _parseFilmsToData(films) {
    return {
      films: films.slice(),
      profileRank: this._profileRank,
      filter: this._currentFilter,
      totalDuration: this._getTotalDuration(films),
      scoredGenres: this._getScoredGenres(films),
    };
  }
}
