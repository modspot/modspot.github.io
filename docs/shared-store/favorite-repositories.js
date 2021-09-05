
export const actions = {
  setFavoriteRepositories(state, favorite_repositories) {
    return {
      ...state,
      favorite_repositories
    };
  },

  addFavoriteRepository(state, repository) {
    const favorite_repositories = {
      ...state.favorite_repositories,
      [repository.url]: repository
    };

    localStorage.setItem('favorite-repositories', JSON.stringify(favorite_repositories));

    return {
      ...state,
      favorite_repositories
    };
  },

  removeFavoriteRepository(state, repository) {
    const { favorite_repositories } = state;
    const new_favorite_repositories = { ...favorite_repositories};
    delete new_favorite_repositories[repository.url];

    localStorage.setItem('favorite-repositories', JSON.stringify(new_favorite_repositories));


    return {
      ...state,
      favorite_repositories: new_favorite_repositories
    };
  },
};

export const helpers = {
  fetchFavoriteRepositories() {
    const favorite_repositories = JSON.parse(localStorage['favorite-repositories'] || "{}");

    return favorite_repositories;
  }
};

export const state = {
  favorite_repositories: helpers.fetchFavoriteRepositories(),
};