import getRepositoriesByUsers, { getRepositoriesByUsersV3 } from '../api/get-repositories-by-users.js';

export const actions = {
  setFavoriteUsers(state, action) {
    return {
      ...state,
      favorite_users: action.payload
    };
  },

  addFavoriteUser(state, user) {
    const favorite_users = {
      ...state.favorite_users,
      [user.login]: user
    };

    localStorage.setItem('favorite-users', JSON.stringify(favorite_users));

    return {
      ...state,
      favorite_users
    };
  },

  removeFavoriteUser(state, user) {
    const { favorite_users } = state;
    const new_favorite_users = { ...favorite_users};
    delete new_favorite_users[user.login];

    localStorage.setItem('favorite-users', JSON.stringify(new_favorite_users));


    return {
      ...state,
      favorite_users: new_favorite_users
    };
  },

  setFavoriteUsersRepositories(state, repositories) {
    localStorage.setItem('favorite-users-repositories', JSON.stringify(repositories));

    return {
      ...state,
      favorite_users_repositories: repositories
    };
  }
};

export const helpers = {
  fetchFavoriteUsers() {
    const favorite_users = JSON.parse(localStorage['favorite-users'] || "{}");
    
    return favorite_users;
  },

  /**
   * @todo there is a known flaw to this function. If a user follows too many
   * users for a single game, github may return more than 100 repositories
   * and so it will require pagination.
   */
   async fetchFavoriteUsersRepositories(favorite_users, favorite_games, github_token) {
    const favorite_users_list = Object.keys(favorite_users);
    const requests_per_game = favorite_games
      .map(game => github_token !== null
        ? getRepositoriesByUsers(github_token, game, favorite_users_list)
        : getRepositoriesByUsersV3(game, favorite_users_list));
    
    const results = await Promise.all(requests_per_game);
    const joined_results = results
      .map(result => result.repositories || [])
      .flatMap(item => item);

    if (!joined_results) {
      return [];
    }

    const favorite_users_repositories = joined_results;

    return favorite_users_repositories;
  }
};

export const state = {
  /**
   * an object where the key is the username and the value an object containing
   * various information about the user.
   */
  favorite_users: helpers.fetchFavoriteUsers(),

  /**
   * a list of all the repositories we get from the favorite users search.
   * It's an array and not a map because Github search api allows us to fetch
   * repositories from multiple users at once.
   */
  favorite_users_repositories: []
};