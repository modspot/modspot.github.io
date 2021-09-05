import { makeReducer, state } from '../../shared-store/index.js';

const makeEmptyRepository = () => ({ key: Math.random() })

export const initial_state = {
  ...state,

  repositories: [makeEmptyRepository()]
};

export const reducer = makeReducer({

  addRepository(state) {
    return {
      ...state,
      repositories: [
        ...state.repositories,
        makeEmptyRepository()
      ]
    };
  },

  removeRepository(state, index) {
    return {
      ...state,
      repositories: state.repositories.filter((repo, i) => i !== index)
    };
  }

});