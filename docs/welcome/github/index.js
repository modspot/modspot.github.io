import html from '../../libs/html.js';
import { initial_state, reducer } from './reducer.js';
import getAccessToken from '../../api/get-access-token.js';
import { client_id } from '../../constants.js';

import Menu from '../../components/menu.js';

const { search } = location;
const params = search
  .replace('?', '')
  .split('&')
  .map((string) => string.split('='))
  .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

const { useEffect, useReducer } = React;

function App() {
  const [state, dispatch] = useReducer(reducer, initial_state);

  const oauth_uri = 'https://github.com/login/oauth/authorize';
  let redirect_uri = 'https://aelto.github.io/modspot/welcome';

  if (params.redirect === "realm-create") {
    redirect_uri += "?redirect=realm-create-success";
  }

  let github_signin_uri = `${oauth_uri}?client_id=${client_id}&redirect_uri=${redirect_uri}`;

  if (params.scope === "repo") {
    github_signin_uri += "&scope=repo";
  }

  useEffect(() => {
    getAccessToken(params.code).then(token => {
      dispatch({ type: 'setGithubToken', payload: token });
    });
  }, []);

  return html`
    <div id="app">
      <${Menu} state=${state} dispatch=${dispatch} />

      <div id="content">
        <h1>GitHub sign-in</h1>

        <section class="reading-font">
          <p>
            The most complex features of modspot depends on the latest GitHub services,
            which requires a GitHub account. You can use the GitHub signin of modspot to
            gain access to these features, once you've done that you will be automatically
            redirected to Modspot.
          </p>
          
          ${params.scope && html`
            <i class="muted">
              You've been sent here because of the realm creation form. After you sign-in with your GitHub account
              you will be automatically redirected to the realm creation page.
            </i>
          `}

          <i class="smaller">
            By clicking the link you will be redirected to a GitHub page
            where you will see the privileges Modspot is asking. You can then
            choose to accept, or deny, the access to the privileges.
          </i>
          <a href=${github_signin_uri}>Go to the GitHub sign-in page</a>
        </section>

      </div>
    </div>
  `;
}

ReactDOM.render(
  html`<${App} />`,
  document.body
);