import html from '../../../libs/html.js';

export default function PermissionSection({ is_grant_message_shown, setGrantMessageShown }) {
  function redirectToWelcomePage() {
    location.replace('/welcome/github?scope=repo&redirect=mod-create');
  }

  return html`
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
          <div class="smaller">
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
                <li>1: Create a private repository for your mod</li>
                <li>2: Add a file to this repository to create the template README</li>
                <li>3: Automatically add the right topics after you've created the mod</li>
                <li>4: Make the repository public once you click the "Make public" button</li>
              </ul>

              <i>
                If you're wary of what modspot may potentially do with this token,
                you can look at the source code of this page <a href="https://github.com/Aelto/tree/master/docs/user/mods/new">here</a>
              </i>
              <hr />
            `}
            
          </div>
          <button onClick=${() => redirectToWelcomePage()}>Grant authorization scope</button>
          
        </div>
      </div>
    </section>
  `;
}