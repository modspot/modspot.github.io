import html from '../libs/html.js';
import { initial_state, reducer } from './reducer.js';
import { helpers } from '../shared-store/index.js';

import Menu from '../components/menu.js';
import RepositoryList from '../components/repository-list.js';

const { useEffect, useReducer, useState } = React;

function App() {
  const [state, dispatch] = useReducer(reducer, initial_state);
  const favorite_repositories = Object.values(state.favorite_repositories);
  const favorite_users = Object.keys(state.favorite_users);

  useEffect(async () => {
    const favorite_users_repositories = await helpers.favorite_users.fetchFavoriteUsersRepositories(
      state.favorite_users,
      state.favorite_games,
      state.github_token
    );

    dispatch({ type: 'setFavoriteUsersRepositories', payload: favorite_users_repositories });
  }, []);

  return html`
    <div id="app">
      <${Menu} state=${state} dispatch=${dispatch} />

      <div id="content">
        <h1>Favorite mods</h1>
        ${favorite_repositories.length <= 0 && html`
          <p>Add mods to favorites and they will be displayed here.</p>
        `}
        <${RepositoryList} repositories=${favorite_repositories} state=${state} dispatch=${dispatch} />

        <h1>Favorite users</h1>
        ${favorite_users.length > 0 && html`
          <div>You are currently following ${favorite_users.join(', ')}</div>
        `}
        ${state.favorite_users_repositories.length <= 0 && html`
          <p>Add users to favorites and mods they made for your favorite games will be displayed here.</p>
        `}
        <${RepositoryList} repositories=${state.favorite_users_repositories} state=${state} dispatch=${dispatch} />
      </div>
    </div>
  `;
}

ReactDOM.render(
  html`<${App} />`,
  document.body
);