
export default function setRepositoryTopics(token, full_name, topics = []) {
  return fetch(`https://api.github.com/repos/${full_name}/topics`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/vnd.github.mercy-preview+json',
      'Authorization': `token ${token}`,
    },
    body: JSON.stringify({
      names: topics.map(topic => topic.toLowerCase())
    })
  })
  .then(res => res.json());
}