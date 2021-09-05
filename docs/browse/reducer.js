import { makeReducer, state } from '../shared-store/index.js';

const { search } = location;
const params = search
  .replace('?', '')
  .split('&')
  .map((string) => string.split('='))
  .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

export const initial_state = {
  ...state,
  game: decodeURIComponent(params.game || ''),
  search: decodeURIComponent(params.search || '').replace(/\+/g, ' '),
  page_count: Number(params.page_count || 0),
  repositories: [],
  discovered_topics: [],
  show_discovered_topics: false,
  page_information: {
    start_cursor: params.start,
    has_next_page: false,
    has_previous_page: false,
    end_cursor: params.end,

    // used only in the v3 fallback state
    page: params.page
  },

  game_input: decodeURIComponent(params.game || ''),
  search_input: decodeURIComponent(params.search || '').replace('+', ' ')
};

export const reducer = makeReducer({
  setRepositories(state, { repositories, page_information }) {
    return {
      ...state,
      repositories,
      page_information
    };
  },

  setDiscoveredTopics(state, discovered_topics) {
    return {
      ...state,
      discovered_topics
    }
  },

  setSearch(state, search) {
    return {
      ...state,
      search
    };
  },

  setGameInput(state, game_input) {
    return {
      ...state,
      game_input
    };
  },

  setSearchInput(state, search_input) {
    return {
      ...state,
      search_input
    };
  }
});