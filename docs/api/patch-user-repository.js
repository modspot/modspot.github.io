
export default function patchUserRepository(token, full_name, patch) {
  return fetch(`https://api.github.com/repos/${full_name}`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${token}`,
    },
    body: JSON.stringify(patch)
  })
  .then(res => res.json());
}