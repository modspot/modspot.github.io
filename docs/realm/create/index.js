import html from '../../libs/html.js';
import { initial_state, reducer } from './reducer.js';
import getAccessToken from '../../api/get-access-token.js';
import { client_id } from '../../constants.js';

import Menu from '../../components/menu.js';
import StyledForm from '../../components/styled-form.js';
import createUserRepository from '../../api/create-user-repository.js';
import createRepositoryFile from '../../api/create-repository-file.js';
import patchUserRepository from '../../api/patch-user-repository.js';
import setRepositoryTopics from '../../api/set-repository-topics.js';

const { search } = location;
const params = search
  .replace('?', '')
  .split('&')
  .map((string) => string.split('='))
  .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

const { useState, useReducer } = React;

function App() {
  const [state, dispatch] = useReducer(reducer, initial_state);
  const [realm, setRealm] = useState(null);
  const [is_realm_public, setRealmIsPublic] = useState(false);
  const [are_topics_set, setAreTopicsSet] = useState(false);
  const [is_request_in_progress, setRequestInProgress] = useState(false);
  const [is_grant_message_shown, setGrantMessageShown] = useState(false);

  function redirectToWelcomePage() {
    location.replace('/modspot/welcome/github?scope=repo&redirect=realm-create');
  }

  async function makeRepositoryPublic(full_name) {
    if (is_request_in_progress) {
      return;
    }

    setRequestInProgress(true);

    const patch_response = await patchUserRepository(
      state.github_token,
      full_name,
      { private: false }
    );

    setRealmIsPublic(true);
    setRequestInProgress(false);
  }

  async function createRealm() {
    if (is_request_in_progress) {
      return;
    }

    setRequestInProgress(true);

    const getDomValue = (parent, selector) => parent.querySelector(selector).value
    const getValues = (parent, object) => Object.keys(object)
      .map(key => ({ key, value: getDomValue(parent, object[key]) }))
      .reduce((obj, cur) => ({ ...obj, [cur.key.replace('.', '')]: cur.value }), {});
    
    const $realm_information = document.querySelector('.realm-information');
    const realm_information = getValues($realm_information, {
      description: '.realm-description',
      name: '.realm-name'
    });

    const realm_definitions = Array.from(document.querySelectorAll('.realm-repository'))
      .map(repo => getValues(repo, {
        name: '.name',
        url: '.url',
        description: '.description',
        openGraphimageUrl: '.opengraphimageurl',
        discussions: '.discussions',
        owner_login: '.owner_login'
      }))
      .map(obj => ({
        name: obj.name,
        url: obj.url,
        description: obj.description,
        openGraphimageUrl: obj.openGraphimageUrl,
        discussions: obj.discussions,
        owner: {
          login: obj.owner_login
        }
      }));

    const mandatory_fields = {
      'Realm name': () => realm_information.name,
      ...realm_definitions.map((def, index) => ({
        [`Project ${index}'s name`]: () => def.name,
        [`Project ${index}'s url`]: () => def.url,
        [`Project ${index}'s owner login`]: () => def.owner.login
      }))
      .reduce((obj, cur) => ({ ...obj, ...cur }), {})
    };

    const missing_fields = Object.keys(mandatory_fields)
      .filter(key => !Boolean(mandatory_fields[key]()));

    const should_abort = missing_fields.length > 0;

    if (should_abort) {
      alert(`The following fields are missing: \n - ${missing_fields.join('\n - ')}`);

      return;
    }

    const repository_creation_response = await createUserRepository(
      state.github_token,
      realm_information
    );

    const { full_name } = repository_creation_response;

    const file_creation_response = await createRepositoryFile(
      state.github_token,
      full_name,
      'definition.json',
      JSON.stringify({
        repositories: realm_definitions
      }, null, '  ')
    );

    const patch_response = await patchUserRepository(
      state.github_token,
      full_name,
      { homepage: `https://api.github.com/repos/${full_name}/contents/definition.json` }
    );

    setRealm({
      ...repository_creation_response,
      definition_file_url: file_creation_response.content.html_url
    });

    setRequestInProgress(false);
  }

  async function setTopics(full_name, topic) {
    if (is_request_in_progress) {
      return;
    }

    setRequestInProgress(true);

    await setRepositoryTopics(
      state.github_token,
      full_name,
      ['modspot-realm', topic.replace(/ /g, '-')]
    );

    setAreTopicsSet(true);
    setRequestInProgress(false);
  }

  return html`
    <div id="app">
      <${Menu} state=${state} dispatch=${dispatch} />

      ${realm === null && html`
        <${StyledForm} id="content">
          <h1>Create a realm</h1>

          <section class="realm-information">
            <div class="row">
              <div class="left">
                <label>API Authorization</label>
                <div class="description">
                  Before you use this page you must allow modspot to create private & public
                  repositories on GitHub for you.
                </div>
              </div>
              <div class="right">
                <label>Authorization Scope</label>
                <div >
                  <i class="smaller">Seeing this message does not mean your token is wrong, it is always visible
                  for the sake of information.</i>
                  <hr />

                  ${is_grant_message_shown && html`
                    <button onClick=${() => setGrantMessageShown(false)} class="text-style muted">hide</button>
                    <br />
                  `}
                  ${!is_grant_message_shown && html`
                    Before proceeding, it may be a good idea to read 
                    this: <button onClick=${() => setGrantMessageShown(true)} class="text-style muted">read more</button>
                  `}

                  ${is_grant_message_shown && html`
                    To grant modspot access to public & private repositories, click the button.
                    You will be redirected to the modspot Github sign-in page that will refresh
                    your token.
                    <br />

                    Before proceeding you must know that you grant modspot the following privileges: 
                    <blockquote>
                    Grants full access to repositories, including private repositories.
                    That includes read/write access to code, commit statuses, repository and organization projects, invitations,
                    collaborators, adding team memberships, deployment statuses, and repository webhooks
                    for repositories and organizations.
                    Also grants ability to manage user projects.
                    </blockquote>

                    Modspot uses the access token to:
                    <ul>
                      <li>1: Create a private repository for your realm</li>
                      <li>2: Add a file to this repository to declare the projects you defined in the form</li>
                      <li>3: Automatically add the right topics after you've created the realm</li>
                      <li>4: Automatically set the homepage url linking to the definition file it created</li>
                      <li>5: Make the repository public once you click the "Make public" button</li>
                    </ul>

                    <i>
                      If you're wary of what modspot may potentially do with this token,
                      you can look at the source code of this page <a href="https://github.com/Aelto/modspot/tree/master/docs/realm/create">here</a>
                    </i>
                    <hr />
                  `}
                  
                </div>
                <button onClick=${() => redirectToWelcomePage()}>Grant authorization scope</button>
                
              </div>
            </div>
          </section>

          <section class="realm-information">
            <div class="row">
              <div class="left">
                <label>Realm information</label>
                <div class="description">
                  Start by filling the important information about your new realm
                </div>
              </div>
              <div class="right">
                <label>realm name</label>
                <input class="realm-name" placeholder="my-awesome-realm" />

                <label>description</label>
                <textarea class="realm-description" placeholder="it's an awesome realm with awesome projects" />
              </div>
            </div>
          </section>
            
              
          <section>
            <div class="row">
              <div class="left">
                <label>Realm projects</label>
                <div class="description">
                  Add the projects that will appear in your realm
                  <br />
                  <button onClick=${() => dispatch({ type: 'addRepository' })}>Add a project to the realm</button>
                </div>
              </div>
              <div class="right">
                
              ${state.repositories.map((repository, index) => html`
                <div class="realm-repository" key=${repository.key}>
                  <h2>Project ${index + 1}
                    <button
                      class="text-style muted"
                      onClick=${() => dispatch({ type: 'removeRepository', payload: index })}>
                      remove
                    </button>
                  </h2>

                  <label>name</label>
                  <input type="text" class="name" placeholder="My awesome project" />

                  <label>address</label>
                  <input type="text" class="url" placeholder="Url address" />

                  <label>description</label>
                  <textarea type="text" class="description" placeholder="Awesome project that does awesome things" />

                  <label>banner image</label>
                  <input type="text" class="opengraphimageurl" placeholder="Url address"/>

                  <label>comment section (optional)</label>
                  <input type="text" class="discussions" placeholder="Url address"/>

                  <label>author name</label>
                  <input type="text" class="owner_login" placeholder="BubbleGum78"/>
                </div>
              `)}

              </div>
            </div>
          </section>

          <section>
            <div class="row">
              <div class="left">
                <label>Create realm</label>
                <div class="description">
                  Create and push the realm to GitHub
                </div>
              </div>
              <div class="right">
                <button onClick=${() => createRealm()}>Create realm</button>
              </div>
            </div>
          </section>
        </${StyledForm}>
      `}

      ${realm !== null && html`
        <div id="content" class="reading-font">
          <h1><a href=${realm.html_url}>${realm.name}</a></h1>
          <p>
            The realm was created. You can access it here: <a href=${realm.html_url}>${realm.full_name}</a>.
            You can also see its definition file here: <a href=${realm.definition_file_url}>definition.json</a>.
          </p>

          ${!are_topics_set && html`
            <p>
              The realm currently has no topic, if you want the realm to be visible on modspot you must at least
              set a topic that corresponds to a game.
              <br/>
              Here is a list of topics that may interest you based on your favorite games:
              <ul>
                ${state.favorite_games.map(topic => html`
                  <li><span>${topic}</span> <button onClick=${() => setTopics(realm.full_name, topic)} class="text-style muted">set</button></li>
                `)}
              </ul>
            </p>
          `}

          ${!is_realm_public && html`
            <p>
              Once everything is setup and ready to be published, you must set the repository to public.
              For this, click this
              button: <button onClick=${() => makeRepositoryPublic(realm.full_name)}>Make <a href=${realm.html_url}>${realm.name}</a> public</button>
            </p>
          `}

          ${is_realm_public && html`
            <p>
              <a href=${realm.html_url}>${realm.name}</a> is now public and will appear in the topics you've set.
            </p>
          `}
        </div>
      `}
    </div>
  `;
}

ReactDOM.render(
  html`<${App} />`,
  document.body
);