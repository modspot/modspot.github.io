import html from '../libs/html.js';
import IRepository from '../models/repository.js';
import RepositoryList from './repository-list.js';
import Repository, { StyledRepository } from './repository.js';

const { useState } = React;

const StyledRealm = styled(StyledRepository)`
  cursor: pointer;

  & a {
    color: var(--color-accent-alternative);
  }
`;

function globalEscapeEventListener(event) {
  if (event.keyCode === 27 && window.toggleRealmDefinitionDisplay) {
    window.toggleRealmDefinitionDisplay();
  }
}

export default function Realm(props) {
  const {
    state,
    /**
     * @type {IRepository}
     */
    repository,
    dispatch
  } = props;

  const [realm_definition, setRealmDefinition] = useState(null);
  const [show_realm_definition, setShowRealmDefinition] = useState(false);

  const owner_login = repository.owner.login;

  const fetchRealmDefinition = () => {
    const { homepage_url = '' } = repository;

    if (!homepage_url) {
      return;
    }

    fetch(homepage_url)
    .then(res => res.json())
    .then(definition => setRealmDefinition(definition));
  };

  const toggleRealmDefinitionDisplay = () => {
    if (realm_definition === null) {
      fetchRealmDefinition();
    }

    if (show_realm_definition && window.toggleRealmDefinitionDisplay) {
      window.onkeydown = undefined;
    }
    
    if (!show_realm_definition) {
      window.onkeydown = globalEscapeEventListener;
    }

    setShowRealmDefinition(!show_realm_definition);
  };

  if (show_realm_definition) {
    window.toggleRealmDefinitionDisplay = toggleRealmDefinitionDisplay;
  }

  const is_already_in_favorites = repository.url in state.favorite_repositories;
  const is_user_already_in_favorites = owner_login in state.favorite_users;

  return html`
    <${StyledRealm} onClick=${() => toggleRealmDefinitionDisplay()}>
      <a>
        <div class="image" style=${{'background-image': `url('${repository.openGraphImageUrl}')` }} ></div>
        <span>${repository.name}</span>
      </a>
      <div class="author muted smaller">
        by ${is_user_already_in_favorites
          ? html`
            <button
              class="text-style muted smaller underline"
              title=${`you are following ${owner_login}, click to unfollow ${owner_login}`}
              onClick=${() => dispatch({ type: 'removeFavoriteUser', payload: repository.owner })}>
              ${owner_login}
            </button>`
          : html`
            <button
              class="text-style muted smaller"
              title=${`click to follow ${owner_login}`}
              onClick=${() => dispatch({ type: 'addFavoriteUser', payload: repository.owner })}>
              ${owner_login}
            </button>`
        }
        <span> - </span>
        ${repository.discussions.length > 0 && html`
          <a class="muted smaller" href=${repository.url + '/discussions'}>discussions</a>
          <span> - </span>
        `}
       
        ${is_already_in_favorites
          ? html`
            <button
              class="text-style muted smaller"
              onClick=${() => dispatch({ type: 'removeFavoriteRepository', payload: repository })}>
              remove from favorites
            </button>`
          : html`
            <button
              class="text-style muted smaller"
              onClick=${() => dispatch({ type: 'addFavoriteRepository', payload: repository })}>
              add to favorites
            </button>`
        }
        
      </div>

      ${repository.description && html` <div>${repository.description}</div> `}
    </${StyledRealm}>

    ${show_realm_definition && realm_definition !== null && html`
      <${RealmDefinition}
        realm_definition=${realm_definition}
        state=${state}
        dispatch=${dispatch}
        repository=${repository}
        toggleRealmDefinitionDisplay=${toggleRealmDefinitionDisplay} />
    `}
  `;
}

function RealmDefinition({ realm_definition, dispatch, state, repository, toggleRealmDefinitionDisplay }) {
  const { repositories = [] } = realm_definition;

  return html`
    <div class="realm-browse">
      <button class="text-style muted" onClick=${() => toggleRealmDefinitionDisplay()}>Close</button>
      <div class="flex center focus-repository realm-repository">
        <${Repository} repository=${repository} state=${state} dispatch=${dispatch} />
      </div>
      <${RepositoryList} repositories=${repositories} dispatch=${dispatch} state=${state} />
    </div>

  `;
};