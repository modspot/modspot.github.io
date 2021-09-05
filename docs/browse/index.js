import html from '../libs/html.js';
import { initial_state, reducer } from './reducer.js';
import { helpers } from '../shared-store/index.js';
import params from '../libs/params.js';

import Menu from '../components/menu.js';
import Search from './search.js';
import RepositoryList from '../components/repository-list.js';
import searchRepositories, { searchRepositoryV3 } from '../api/search-repositories.js';
import TopicList from '../components/topic-list.js';
import Pagination from './pagination.js';
import GameList from './game-list.js';

const { useEffect, useReducer, useState } = React;

function App() {
  const [state, dispatch] = useReducer(reducer, initial_state);
  const [show_discovered_topics, setShowDiscoveredTopics] = useState(false);

  const fetchRepositories = async () => {
    const search = params['realms-only']
        ? state.search + ' topic:modspot-realm'
        : state.search;

    const games = state.game
      ? [state.game]
      : state.favorite_games;

    // uses the v4 api if a token is found
    if (state.github_token !== null) {
      const responses = await Promise.all(
        games
        .map(game => searchRepositories(
          state.github_token,
          game,
          search,
          // we use the same page information on purpose
          // as the mixed results are only supposed to be
          // displayed on the home page where there is no
          // pagination at the moment.
          state.page_information.end_cursor,
          state.page_information.start_cursor
        ))
      );
  
      const topics = responses.map(result => 
          result.repositories
          .map(repository => repository.topics)
        )
        .flatMap(x => x);
  
      const distinct_topics = Array.from(new Set(topics)).flatMap(x => x);

      const repositories = responses
        .map(result => result.repositories)
        .flatMap(x => x);
  
      return {
        repositories_search_result: {
          ...responses[0],
          repositories
        },
        distinct_topics
      }
    }
    // else, falls back to the v3 api
    else {
      const responses = await Promise.all(
        games.map(game => searchRepositoryV3(
          game,
          search,
          state.page_information.page
        ))
      );

      const lastIndexOfRepository = (arr = [], { url }) =>
        arr.reduceRight((acc, cur, index) => cur.url === url ? index : acc, -1)

      const distinct_topics = [];
      const repositories = responses
        .map(result => result.repositories)
        .flatMap(x => x)
        .filter((repository, index, arr) =>
          lastIndexOfRepository(arr, repository) === index)
        .sort((a, b) => b.pushed_at - a.pushed_at);

      return {
        repositories_search_result: {
          ...responses[0],
          repositories
        },
        distinct_topics
      };
    }
  };

  useEffect(() => {
    fetchRepositories()
    .then(({ repositories_search_result, distinct_topics }) => {
      dispatch({ type: 'setRepositories', payload: repositories_search_result });
      dispatch({ type: 'setDiscoveredTopics', payload: distinct_topics });
    });
  }, []);

  useEffect(async () => {
    const favorite_users_repositories = await helpers.favorite_users.fetchFavoriteUsersRepositories(
      state.favorite_users,
      state.favorite_games,
      state.github_token
    );

    dispatch({ type: 'setFavoriteUsersRepositories', payload: favorite_users_repositories });
  }, []);

  const is_pagination_shown = state.game && state.repositories.length > 0;
  const is_game_in_favorites = state.favorite_games
    .some(game => game === state.game);

  const topic_list = Array.from(state.favorite_topics);
  const filter_discovered_topics = state.discovered_topics
    .filter(topic => !state.favorite_topics.has(topic));

  return html`
    <div id="app">
      <${Menu} state=${state} dispatch=${dispatch} />

      <div id="content">
        ${state.game && html`
          <h1>
            ${state.game}
            ${ is_game_in_favorites
              ? html`<button class="text-style muted small" onClick=${() => dispatch({ type: 'removeFavoriteGame', payload: state.game })}>remove from favorites</button>`
              : html`<button class="text-style muted small" onClick=${() => dispatch({ type: 'addFavoriteGame', payload: state.game })}>add to favorites</button>`
            }
          </h1>
        `}
        <${Search} search_input=${state.search_input} game_input=${state.game_input} dispatch=${dispatch} />

        ${state.game && html`
          <div class="topics">
            <span class="smaller">Your topics</span>
            <${TopicList}
              topics=${topic_list}
              is_from_persistent_list=${true}
              search_input=${state.search_input}
              github_token=${state.github_token}
              dispatch=${dispatch} />
  

            <!-- show the discovered topics only when there is a github token and
                 we use the graphql api.
            -->
            ${state.github_token !== null && html`
              <span class="smaller">
                Discovered topics
                <button class="text-style muted smaller" onClick=${() => setShowDiscoveredTopics(!show_discovered_topics)}>${
                  show_discovered_topics
                    ? 'hide'
                    : 'show'
                }</button>
              </span>
            `}
            ${show_discovered_topics && html`
              <${TopicList} class="smaller"
                topics=${filter_discovered_topics}
                is_from_persistent_list=${false}
                search_input=${state.search_input}
                github_token=${state.github_token}
                dispatch=${dispatch} />
            `}
          </div>
        `}

        ${!state.game && html`<${GameList} />`}
        <${RepositoryList} repositories=${state.repositories} state=${state} dispatch=${dispatch} />
        ${is_pagination_shown && html`<${Pagination} state=${state} />`}
      </div>
    </div>
  `;
}

ReactDOM.render(
  html`<${App} />`,
  document.body
);