import html from '../libs/html.js';
import { initial_state, reducer } from './reducer.js';
import getAccessToken from '../api/get-access-token.js';

import Menu from '../components/menu.js';

const { search } = location;
const params = search
  .replace('?', '')
  .split('&')
  .map((string) => string.split('='))
  .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

const { useEffect, useReducer } = React;

function App() {
  const [state, dispatch] = useReducer(reducer, initial_state);

  useEffect(() => {
    getAccessToken(params.code).then(token => {
      dispatch({ type: 'setGithubToken', payload: token });
    });
  }, []);

  useEffect(() => {
    if (!state.github_token) {
      return;
    }

    if (params.redirect === "realm-create-success") {
      location.replace('/modspot/realm/create?from-signin=true');
    }
  })

  return html`
    <div id="app">
      <${Menu} state=${state} dispatch=${dispatch} />

      <div id="content">
        <h1>Welcome to modspot!</h1>
        <p>You are now authenticated and have access to all of modspot features</p>

        <a href="/modspot">Go back to the home page</a>
      </div>
    </div>
  `;
}

ReactDOM.render(
  html`<${App} />`,
  document.body
);