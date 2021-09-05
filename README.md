# Modspot - [modspot.github.io](https://modspot.github.io/)
A modern mod browser based on GitHub

# Local environment
The repository comes with a basic expressjs server to run the website in [localhost:5000](http://localhost:5000). To run it you will need node.js, any version should work.

The whole website is in [`/docs`](/docs), there is no bundling step. The front-end is made with [reactjs](https://reactjs.org/). All components are made with hooks and use the reducer hook for state management if needed. There is a tiny wrapper around the reducers in [/docs/shared-store/index.js](docs/shared-store/index.js) that makes shared stores & reducers easy to make.

## Github graphql API

The graphql API requires a token for the whole API. For this reason you will have to [generate a personal access token](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token) and edit the file `docs/constants.mjs` with your token:
```js
export const dev_token = 'your-personal-access-token';
```

Whenever the website is opened under the `localhost` hostname, it will use this token for all API requests. **DO NOT COMMIT THE FILE**

# Github signin
The github signin for the GraphQL API via OAuth is done via a proxy at the following address: `https://modspot-github-auth-proxy.herokuapp.com/api/github-proxy/:code` where `:code` is the client_code.

This was done to prevent leaking the `client_secret` of modspot. It uses environment variables to get the client_secret value, only the maintainer has access to this variable and only the maintainer can change the variable on the heroku instance.

You can read the source code of the small nodejs proxy server here [`/src`](src/index.js)

# Realms
A realm and its definition is a way to display one or many projects as a single entry on the website. The projects do not have to be GitHub as long as the difinition provides all the necessary information. The difinition is a JSON object that contains the informations about different repositories

Here is an example of a realm definition, If you have a doubt about the definition, please check the [model definitions](docs/models).
```json
{
  "repositories": [
    {
      "url": "https://github.com/Aelto/task-runner",
      "description": "this project is not a mod at all but a simple example of how to add realms to modspot",
      "openGraphImageUrl": "https://a-link-to-an-image-for-the-project.png",
      "name": "task-runner",
      "discussions": "https://a-link-to-a-forum-or-a-comment-section.io",
      "owner": {
        "avatarUrl": "https://a-link-to-an-image-for-the-owner.png",
        "login": "Aelto"
      }
    },
    {
      "url": "https://github.com/Aelto/gpm",
      "description": "this project is not a mod at all but a simple example of how to add realms to modspot",
      "openGraphImageUrl": "https://a-link-to-an-image-for-the-project.png",
      "name": "task-runner",
      "discussions": "https://a-link-to-a-forum-or-a-comment-section.io",
      "owner": {
        "avatarUrl": "https://a-link-to-an-image-for-the-owner.png",
        "login": "Aelto"
      }
    }
  ]
}
```

Any repository on GitHub and for the current game you're browsing that has the `modspot-realm` topic will be interpreted as realm.
Realms that contain multiple repositories will still be displayed like a single item in the view, instead when the user
interacts with the realm item, a list of the repositories are displayed. The realm definition is fetched by using the `homepage_url` of a GitHub repository.

On top of offering a way to make projects from other websites visible on modspot, realms can also be used to create
modlists.

## Hosting a realm definition
a realm definition as said earlier must be written in the JSON format, this means that as long as the HTTP GET request receives a JSON response it will work. For this reason the realm definition could very well be an API that returns a dynamic JSON file, it could also be a file you placed directly in the repository you used to declare the realm, or it could even be a simple `.json` file served by an nginx server.

This freedom allows anyone to create realms and share their projects from all over the internet, no matter the hosting service that was initially used.

## Topics & rating
Because it would be too complex to add unique topics to every repository in the realm, instead modspot relies on the topics you set
to the realm itself. Same for the rating (stars, likes, etc...), it would be too easy to fake the rating and so the stars and watchers of
the repository will be used instead.
