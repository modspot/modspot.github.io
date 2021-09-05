import * as favorite_repositories from './favorite-repositories.js';
import * as favorite_topics from './favorite-topics.js';
import * as favorite_games from './favorite-games.js';
import * as favorite_users from './favorite-users.js';
import * as github_token from './github-token.js';

export const state = {
  ...favorite_repositories.state,
  ...favorite_games.state,
  ...favorite_users.state,
  ...github_token.state,
  ...favorite_topics.state
};

const actions = {
  ...favorite_repositories.actions,
  ...favorite_games.actions,
  ...favorite_users.actions,
  ...github_token.actions,
  ...favorite_topics.actions
};

export function makeReducer(component_actions) {
  return (state, action) => {
    if (typeof component_actions[action.type] === 'function') {
      return component_actions[action.type](state, action.payload);
    }

    return actions[action.type](state, action.payload);
  };
}

export const helpers = {
  favorite_repositories: favorite_repositories.helpers,
  favorite_games: favorite_games.helpers,
  favorite_users: favorite_users.helpers,
  github_token: github_token.helpers,
  favorite_topics: favorite_topics.helpers
};