import html from '../libs/html.js';
import IRepository from '../models/repository.js';
import HoverModal from './hover-modal.js';
import { downloadRepositoryLatestRelease } from '../api/repository-releases.js';
import RepositoryMenu from './repository-menu.js';

export const StyledRepository = styled.div`
  width: 200px;
  font-size: 1em;
  position: relative;

  & > a {
    font-size: 1.5em;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  & > a span {
    background: var(--color-background);
    /* max-width: 90%; */
    /* z-index: 1; */
    font-size: 1em;
    padding: .2em 0;
  }

  & .image {
    top: 0;
    left: 0;

    width: 100%;
    height: 150px;
    border-radius: 12px;
    background-size: cover;
    background-position: center;
    display: inline-block;
  }

  &:hover ${HoverModal} {
    display: block;
  }

  & ${HoverModal} {
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

  .description {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3; /* number of lines to show */
    -webkit-box-orient: vertical;
  }
`;

export default function Repository(props) {
  const {
    state,
    /**
     * @type {IRepository}
     */
    repository,
    /**
     * controls whether or not the author menu should be displayed in the drop
     * down list. The author menu is the list of actions an author has over his
     * own repositories.
     */
    display_author_menu = false,
    /**
     * controls whether or not the link redirects to the modspot page or directly
     * to the repository.
     * When set at false, which is the default value it redirects to the modspot
     * page.
     */
    link_to_repository = false,
    dispatch
  } = props;

  const owner_login = repository.owner.login;

  const is_user_already_in_favorites = state.favorite_users && owner_login in state.favorite_users;

  return html`
    <${StyledRepository}>
      <a href=${link_to_repository
          ? repository.url
          : `/modspot/browse/mod?repository=${repository.owner.login}/${repository.name}`}>
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

        <${RepositoryMenu} repository=${repository} display_author_menu=${display_author_menu} state=${state} dispatch=${dispatch} />
      </div>

      ${repository.description && html`
        <div class="description" title=${repository.description}>${repository.description}</div>
      `}
    </ ${StyledRepository}>
  `;
}