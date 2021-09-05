import { dev_token, client_id } from '../constants.js';

const token_key = 'github-auth-token';

export const actions = {
  setGithubToken(state, token) {
    localStorage.setItem(token_key, token);

    return {
      ...state,
      github_token: token
    };
  },

  removeGithubToken(state) {
    localStorage.removeItem(token_key);

    delete state.github_token;

    window.location.reload();

    return {
      ...state,
      github_token: null
    };
  }

};

export const helpers = {
  fetchGithubToken() {
    if (!localStorage[token_key] || localStorage[token_key] === "undefined") {
      if (window.location.hostname === 'localhost') {
        return dev_token;
      }

      return null;
    }

    return localStorage[token_key];
  }
};

export const state = {
  github_token: helpers.fetchGithubToken()
};