
export default function getSignedInUser(github_token) {
  return fetch('https://api.github.com/user', {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${github_token}`,
    }
  })
  .then(response => response.json());
}