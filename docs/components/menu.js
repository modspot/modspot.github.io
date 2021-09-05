import html from '../libs/html.js';
import HoverModal from './hover-modal.js';

export const StyledMenu = styled.div`
  display: flex;
  padding: 1em;
  padding-right: 2em;
  font-size: 1.25em;
  align-items: center;

  & > * + *:not(.option) {
    margin-left: 1em;
  }

  a {
    text-transform: capitalize;
  }

  .spacer {
    flex-grow: 1;
  }

  button.text-style{
    text-decoration: none;
    color: var(--color-accent);
    font-size: 1em;
  }

  ${HoverModal} .options-wrapper {
    padding: 0.5em 1em 1em 1em;
  }
`;


export const makeHumanReadableGameName = topic => topic
  .replace(/-/, ' ')
  .replaceAll(/[0-9]+/g, match => ` ${match} `)
  .trim();

export default function Menu({ state, dispatch }) {
  const { favorite_games = [], github_token, github_login } = state;

  const signout = () => {
    dispatch({
      type: 'removeGithubToken'
    });
  };

  return html`
    <${StyledMenu} class="menu">
      <${HoverModal}>
        <a class="title" href="/browse">Modspot <span></span></a>

        <div class="options-wrapper">
          <div class="options">
            ${favorite_games.map(game => html`
              <a class="option" href=${"/browse/?game=" + game}>${makeHumanReadableGameName(game)}</a>
            `)}
          </div>
        </div>
      </${HoverModal}>
      <a href="/favorites">Favorites</a>
      <a href="/help">Help</a>
      <div class="spacer"></div>

      ${github_token === null && html`
        <a href="/welcome/github">Signin</a>
      `}

      ${github_token !== null && html`
        <${HoverModal}>
          <a class="title">${github_login} <span></span></a>

          <div class="options-wrapper">
            <div class="options">
              <a class="option" href="/user/mods">My mods</a>
              <button class="text-style option" onClick=${() => signout()}>Signout</a>
            </div>
          </div>
        </${HoverModal}>
      `}
    </${StyledMenu}>
  `
}
