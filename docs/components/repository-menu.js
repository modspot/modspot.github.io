import html from '../libs/html.js';
import HoverModal from './hover-modal.js';

export default function RepositoryMenu({ state, dispatch, repository, display_author_menu = false }) {
  const owner_login = repository.owner.login;
  const is_already_in_favorites = state.favorite_repositories && repository.url in state.favorite_repositories;
  const is_user_already_in_favorites = state.favorite_users && owner_login in state.favorite_users;

  return html`
    <${HoverModal}>
      <span>...</span>

      <div class="options-wrapper">
        <div class="options">
          ${is_already_in_favorites
            ? html`
              <button
                class="text-style option"
                onClick=${() => dispatch({ type: 'removeFavoriteRepository', payload: repository })}>
                remove from favorites
              </button>`
            : html`
              <button
                class="text-style option"
                onClick=${() => dispatch({ type: 'addFavoriteRepository', payload: repository })}>
                add to favorites
              </button>`
          }

          ${is_user_already_in_favorites
            ? html`
              <button
                class="text-style option"
                title=${`you are following ${owner_login}, click to unfollow ${owner_login}`}
                onClick=${() => dispatch({ type: 'removeFavoriteUser', payload: repository.owner })}>
                unfollow author
              </button>`
            : html`
              <button
                class="text-style option"
                title=${`click to follow ${owner_login}`}
                onClick=${() => dispatch({ type: 'addFavoriteUser', payload: repository.owner })}>
                follow author
              </button>`
          }

          ${repository.discussions.length > 0 && html`
            <a class="text-style option" href=${repository.url + '/discussions'}>discussions</a>
          `}

          <button class="text-style option" onClick=${() => downloadRepositoryLatestRelease(owner_login, repository.name)}>download</button>

          ${display_author_menu && html`
            <!-- this link is an example, the page doesn't exist yet -->
            <a class="option text-style" href=${`/modspot/user/mods/${repository.name}/releases/create`}>new release</a>
          `}
        </div>
      </div>
    </${HoverModal}>
  `;
}