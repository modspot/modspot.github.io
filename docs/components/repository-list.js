import html from '../libs/html.js';

import Repository from './repository.js';
import Realm from './realm.js';

import { isRealm } from '../models/repository.js';

export default function RepositoryList({ state, dispatch, repositories = [], custom_class = '', display_author_menu = false, link_to_repository = false }) {
  return html`
    <ul class="repository-list">
      ${repositories.map(
        (repository) => html`
            <li key=${repository.url} class=${custom_class}><${Repository} repository=${repository} display_author_menu=${display_author_menu} state=${state} dispatch=${dispatch} link_to_repository=${link_to_repository} /></li>
          `
      )}
    </ul>
  `;
}