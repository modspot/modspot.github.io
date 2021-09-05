

export const actions = {
  setFavoriteGames(state, favorite_games) {
    return {
      ...state,
      favorite_games
    };
  },

  addFavoriteGame(state, game) {
    const favorite_games = [
      ...state.favorite_games,
      game
    ];

    localStorage.setItem('favorite-games', JSON.stringify(favorite_games));

    return {
      ...state,
      favorite_games
    };
  },

  removeFavoriteGame(state, game) {
    const { favorite_games } = state;
    const new_favorite_games = favorite_games.filter(g => g !== game);

    localStorage.setItem('favorite-games', JSON.stringify(new_favorite_games));

    return {
      ...state,
      favorite_games: new_favorite_games
    };
  }
};

export const helpers = {
  fetchFavoriteGames() {
    const favorite_games = JSON.parse(localStorage['favorite-games'] || "[]");

    return favorite_games;
  },
};

export const state = {
  favorite_games: helpers.fetchFavoriteGames()
};