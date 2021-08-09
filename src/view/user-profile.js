const USER_PROFILE_RATINGS = [
  'Novice',
  'Fan',
  'Movie Buff',
];

export const createUserProfileTemplate = (films) => {
  let filmWatched = 0;
  let profileRating = '';

  films.forEach((film) => {
    filmWatched += film.userDetails.isWatched ? 1 : 0;
  });

  switch (true) {
    case filmWatched < 1:
      break;
    case filmWatched < 11:
      profileRating = USER_PROFILE_RATINGS[0];
      break;
    case filmWatched < 21:
      profileRating = USER_PROFILE_RATINGS[1];
      break;
    default:
      profileRating = USER_PROFILE_RATINGS[2];
      break;
  }

  return `<section class="header__profile profile">
    <p class="profile__rating">${profileRating}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};
