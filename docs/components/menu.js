import html from '../libs/html.js';

export const StyledMenu = styled.div`
  display: flex;
  padding: 1em;
  font-size: 1.25em;

  * + * {
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
`;

export default function Menu({ state, dispatch }) {
  const { favorite_games = [], github_token } = state;

  const signout = () => {
    dispatch({
      type: 'removeGithubToken'
    });
  };

  return html`
    <${StyledMenu} class="menu">
      <a href="/modspot/browse">Modspot</a>
      <a href="/modspot/favorites">Favorites</a>
      <a href="/modspot/help">Help</a>
      ${favorite_games.length > 0 && html`<span> - </span>`}
      ${favorite_games.map(game => html`
        <a href=${"/modspot/browse/?game=" + game}>${game.replace(/-/, ' ')}</a>
      `)}
      <div class="spacer"></div>
      ${github_token === null && html`
        <a href="/modspot/welcome/github">Signin</a>
      `}
      ${github_token !== null && html`
        <a href="/modspot/user/mods">My mods</a>
        <button class="text-style" onClick=${() => signout()}>Signout</a>
      `}
    </${StyledMenu}>
  `
}
