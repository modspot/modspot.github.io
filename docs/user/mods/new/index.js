import html from '../../../libs/html.js';
import { initial_state, reducer } from './reducer.js';

import Menu from '../../../components/menu.js';
import StyledForm from '../../../components/styled-form.js';
import PermissionSection from './permission-section.js';

const { useEffect, useReducer, useState } = React;

function App() {
  const [state, dispatch] = useReducer(reducer, initial_state);
  const [is_request_in_progress, setRequestInProgress] = useState(false);
  const [is_grant_message_shown, setGrantMessageShown] = useState(false);

  if (!state.github_token) {
    return html`
      <div id="app">
        <${Menu} state=${state} dispatch=${dispatch} />

        <div id="content">
          <h1>Please sign-in to see create a mod</h1>
        </div>
      </div>
    `;
  }

  console.log(state);

  return html`
    <div id="app">
      <${Menu} state=${state} dispatch=${dispatch} />

      <${StyledForm} id="content">
        <h1>Create a mod</h1>

        <${PermissionSection} is_grant_message_shown=${is_grant_message_shown} setGrantMessageShown=${setGrantMessageShown} />

        <section class="mod-information">
          <div class="row">
            <div class="left">
              <label>Mod information</label>
              <div class="description">
                Start by filling the important information about your new mod
              </div>
            </div>
            <div class="right">
              <label>mod name</label>
              <input class="mod-name" placeholder="my-awesome-mod" />

              <label>mod short description</label>
              <textarea class="mod-description" placeholder="it's an awesome mod with awesome ideas" />

              <label>Game</label>
              <input
                type="search"
                id="game"
                name="game"
                list="game-list"
                placeholder="fantastic-game-4"
              />
              <datalist id="game-list">
                ${state.favorite_games.length > 0 && state.favorite_games.map(game => html`
                  <option value=${game}></option>
                `)}
                ${state.favorite_games.length === 0 && html`
                  <option value="witcher-3"></option>
                  <option value="minecraft"></option>
                  <option value="cyberpunk2077"></option>
                `}
              </datalist>
            </div>
          </div>
        </section>

        <section>
            <div class="row">
              <div class="left">
                <label>Create mod</label>
                <div class="description">
                  Create and push the mod to GitHub
                </div>
              </div>
              <div class="right">
                <button onClick=${() => createRealm()}>Create mod</button>
              </div>
            </div>
          </section>

      </${StyledForm}>
    </div>
  `;
}

ReactDOM.render(
  html`<${App} />`,
  document.body
);