
export default function createUserRepository(token, { name, description }) {
  return fetch('https://api.github.com/user/repos', {
    method: 'post',
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${token}`,
    },
    body: JSON.stringify({
      name,
      description,
      private: true
    })
  })
  .then(res => res.json());
}