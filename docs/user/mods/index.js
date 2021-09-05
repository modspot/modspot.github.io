import html from '../../libs/html.js';
import { initial_state, reducer } from './reducer.js';
import { helpers } from '../../shared-store/index.js';

import Menu from '../../components/menu.js';
import RepositoryList from '../../components/repository-list.js';
import searchRepositories from '../../api/search-repositories.js';

const { useEffect, useReducer, useState } = React;

function App() {
  const [state, dispatch] = useReducer(reducer, initial_state);
  const [repositories, setRepositories] = useState([]);

  if (!state.github_token) {
    return html`
      <div id="app">
        <${Menu} state=${state} dispatch=${dispatch} />

        <div id="content">
          <h1>Please sign-in to see your mods</h1>
        </div>
      </div>
    `;
  }

  useEffect(async () => {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${state.github_token}`,
      }
    });
    const result = await response.json();
    const { login } = result;

    const games_and_mods = [...state.favorite_games, 'mod'];
    const search = `user:${login}`;
    // todo: this implementation has a flaw if the user has more than 100 for a
    // single mod, then it will need pagination. But there is no pagination at
    // the moment.
    const search_results = await Promise.all(
      games_and_mods.map(game => searchRepositories(
        state.github_token,
        game,
        search,
        null,
        null,
        100
      ))
    );

    const repositories = search_results
      .map(result => result.repositories)
      .flatMap(repository => repository);

    const lastIndexOfRepository = (arr = [], { url }) =>
        arr.reduceRight((acc, cur, index) => cur.url === url ? index : acc, -1)

    const mixed_repositories = repositories
      .filter((repository, index, arr) =>
        lastIndexOfRepository(arr, repository) === index)
      .sort((a, b) => b.pushed_at - a.pushed_at);

    setRepositories(mixed_repositories);
  }, []);

  return html`
    <div id="app">
      <${Menu} state=${state} dispatch=${dispatch} />

      <div id="content">
        <h1>Your mods</h1>
        <p>Here is a list of your mods for your favorite games, and also those with the <span>mod</span> topic</p>

        <${RepositoryList} repositories=${repositories} state=${state} dispatch=${dispatch} display_author_menu=${true} />
      </div>
    </div>
  `;
}

ReactDOM.render(
  html`<${App} />`,
  document.body
);