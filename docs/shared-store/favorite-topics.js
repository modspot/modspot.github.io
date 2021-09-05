
const default_topics = JSON.stringify([
  'immersion',
  'gameplay',
  'textures',
  'models',
  'quests',
  'crafting',
  'balance',
  'economy',
  'leveling',
  'cheat',
  'console',
  'desktop',
  'controls',
  'keyboard',
  'controller'
]);

export const actions = {
  addFavoriteTopics(state, topics) {
    const favorite_topics = new Set([...state.favorite_topics, ...topics]);

    localStorage.setItem('favorite-topics', JSON.stringify(Array.from(favorite_topics)));

    return {
      ...state,
      favorite_topics
    };
  },

  removeFavoriteTopic(state, topic) {
    const favorite_topics = new Set([...state.favorite_topics].filter(t => t !== topic));

    localStorage.setItem('favorite-topics', JSON.stringify(Array.from(favorite_topics)));

    return {
      ...state,
      favorite_topics
    };
  },

  setFavoriteTopics(state, favorite_topics) {
    localStorage.setItem('favorite-topics', JSON.stringify(Array.from(favorite_topics)));

    return {
      ...state,
      favorite_topics
    };
  },
};

export const helpers = {
  fetchFavoriteTopics() {
    return new Set(JSON.parse(localStorage['favorite-topics'] || default_topics));
  }
};

export const state = {
  favorite_topics: helpers.fetchFavoriteTopics()
};