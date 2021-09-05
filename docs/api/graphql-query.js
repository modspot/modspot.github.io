export default function query(token, graphql_query, variables) {
  return fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `bearer ${token}`
    },
    body: JSON.stringify({ query: graphql_query, variables })
  })
  .then(r => r.json());
}