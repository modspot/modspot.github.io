import { dev_token, client_id } from '../constants.js';

const token_key = 'github-auth-token';
const github_username_key = 'github-login';

export const actions = {
  setGithubToken(state, { token, login }) {
    localStorage.setItem(token_key, token);
    localStorage.setItem(github_username_key, login);

    return {
      ...state,
      github_token: token,
      github_login: login
    };
  },

  removeGithubToken(state) {
    localStorage.removeItem(token_key);
    localStorage.removeItem(github_username_key);

    delete state.github_token;

    window.location.reload();

    return {
      ...state,
      github_token: null,
      github_login: null
    };
  },

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
  },

  getAuthenticatedUserName() {
    if (!localStorage[github_username_key] || localStorage[github_username_key] === "undefined") {
      if (window.location.hostname === 'localhost') {
        return 'local-owner';
      }

      return 'Unknown';
    }

    return localStorage[github_username_key];
  }
};

export const state = {
  github_token: helpers.fetchGithubToken(),
  github_login: helpers.getAuthenticatedUserName()
};