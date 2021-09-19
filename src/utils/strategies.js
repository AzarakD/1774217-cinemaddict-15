import { SortType, FilterType, FilterPeriod } from '../consts.js';
import dayjs from 'dayjs';

export const PeriodStrategy = {
  [FilterPeriod.TODAY]: () => dayjs().subtract(1, 'day').toDate(),
  [FilterPeriod.WEEK]: () => dayjs().subtract(1, 'week').toDate(),
  [FilterPeriod.MONTH]: () => dayjs().subtract(1, 'month').toDate(),
  [FilterPeriod.YEAR]: () => dayjs().subtract(1, 'year').toDate(),
};

export const FilterStrategy = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.userDetails.isInWatchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.userDetails.isWatched),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.userDetails.isFavorite),
};

export const SortStrategy = {
  [SortType.BY_RATING]: (a, b) => b.filmInfo.rating - a.filmInfo.rating,
  [SortType.BY_COMMENT_AMOUNT]: (a, b) => b.comments.length - a.comments.length,
  [SortType.BY_DATE]: (a, b) => dayjs(b.filmInfo.releaseDate).diff(a.filmInfo.releaseDate),
};
