import html from '../../libs/html.js';
import { initial_state, reducer } from './reducer.js';
import { helpers } from '../../shared-store/index.js';
import params from '../../libs/params.js';

import Menu from '../../components/menu.js';
import Repository, { isRealm } from '../../models/repository.js';
import RepositoryList from '../../components/repository-list.js';
import RepositoryMenu from '../../components/repository-menu.js';
import HoverModal from '../../components/hover-modal.js';

const { useEffect, useReducer, useState } = React;
const fetch_headers = {};

export const StyledApp = styled.div`
  .mod-header {
    display: flex;
    flex-direction: column;
    align-items: center;

    .repository-image {
      position: relative;

      img {
        max-height: 300px;
        border-radius: 6px;
      }

      &:hover ${HoverModal} {
        display: block;
      }

      ${HoverModal} {
        display: none;
        position: absolute;
        padding: 1em;
        right: 0;
        top: 0;
        color: white;
        filter: drop-shadow(0px 0px 1px black);

        span {
          background: var(--color-background);
          padding: 0.1em;
          font-size: 12px;
          border-radius: 4px;
          opacity: 0.6;
        }

        .options-wrapper {
          padding-top: 0em;
        }
      }
    }


    h1 {
      margin: 0;
    }
  }
`;

function App() {
  const [state, dispatch] = useReducer(reducer, initial_state);
  const [repository, setRepository] = useState(null);
  const [hit_api_limit, setHitApiLimit] = useState(false);

  if (state.github_token && state.github_token !== null) {
    fetch_headers.Authorization = `token ${state.github_token}`;
  }
  else {
    delete fetch_headers.Authorization;
  }

  if (!params.repository) {
    return html`
      <${StyledApp}>
        <${Menu} state=${state} dispatch=${dispatch} />

        <div id="content">
          <h1>No such repository</h1>
        </div>
      </${StyledApp}>
    `;
  }

  if (hit_api_limit) {
    return html`
      <${StyledApp}>
        <${Menu} state=${state} dispatch=${dispatch} />

        <div id="content">
          <h1>Github API hourly limit hit</h1>
          <p>
            You can signin to remove the limit or you can view the <a href=${`https://github.com/${params.repository}`}>repository directly on GitHub</a>
          </p>
        </div>
      </${StyledApp}>
    `;
  }

  useEffect(async () => {
    const repository_response = await fetch(`https://api.github.com/repos/${params.repository}`, {
      headers: {
        ...fetch_headers
      }
    });

    if (repository_response.status === 403) {
      setHitApiLimit(true);

      return;
    }

    const repository_data = await repository_response.json();

    const repository_topics_response = await fetch(`https://api.github.com/repos/${params.repository}/topics`, {
      headers: {
        'Accept': 'application/vnd.github.mercy-preview+json',
        ...fetch_headers
      }
    });

    if (repository_topics_response.status === 403) {
      setHitApiLimit(true);

      return;
    }

    const topics = await repository_topics_response.json();

    const repository_releases_response = await fetch(`https://api.github.com/repos/${params.repository}/releases`, {
      headers: {
        ...fetch_headers
      }
    });

    if (repository_releases_response.status === 403) {
      setHitApiLimit(true);

      return;
    }

    const releases = await repository_releases_response.json();

    const repository = Repository.fromV3Data(repository_data);
    repository.topics = topics.names;
    repository.releases = releases;

    setRepository(repository);
  }, []);

  const is_realm = repository !== null && isRealm(repository);

  const h = html`
    <${StyledApp}>
      <${Menu} state=${state} dispatch=${dispatch} />

      <div id="content">
        ${repository !== null && html`
        
          <p class="mod-header">
            <div class="repository-image">
              <img src=${repository.openGraphImageUrl} />
              <${RepositoryMenu} repository=${repository} state=${state} dispatch=${dispatch} />
            </div>
            <h1>
              ${repository.name}
            </h1>
            <div>
              By ${repository.owner.login}, last updated: ${repository.pushed_at.toLocaleString()}
            </div>
          </p>

          <p>${repository.description}</p>
          <a href=${repository.url}>Open on GitHub</a>

          <${DisplayLatestRelease} releases=${repository.releases} />

          ${is_realm && html`
            <${DisplayRealmRepositories} repository_homepage=${repository.homepage_url} state=${state} setHitApiLimit=${setHitApiLimit} />
          `}
        `}
      </div>
    </${StyledApp}>
  `;

  return h;
}

const StyledPre = styled.pre`
  white-space: break-spaces;
`

function DisplayLatestRelease(props) {
  const { releases } = props;

  if (!Array.isArray(releases) || releases.length === 0) {
    return null;
  }

  const latest_release = releases[0];

  return html`
    <div>
      <h2>latest release - <a href=${latest_release.html_url}>${latest_release.name}</a></h2>
      <${StyledPre}>${latest_release.body}</${StyledPre}>
    </div>
  `;
}

function DisplayRealmRepositories(props) {
  const {
    state,
    /**
     * @type {IRepository}
     */
    repository_homepage,
    setHitApiLimit,
    dispatch
  } = props;

  const [realm_definition, setRealmDefinition] = useState(null);
  
  useEffect(async () => {
    const response = await fetch(repository_homepage);

    if (response.status === 403) {
      setHitApiLimit(true);

      return;
    }

    const definition = await response.json();

    setRealmDefinition(definition);
  }, []);

  if (realm_definition === null) {
    return null;
  }

  return html`
    <${RepositoryList} repositories=${realm_definition.repositories} link_to_repository=${true} dispatch=${dispatch} state=${state} />
  `;
}

ReactDOM.render(
  html`<${App} />`,
  document.body
);