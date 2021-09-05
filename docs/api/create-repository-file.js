
export default function createRepositoryFile(token, full_name, file_path, content) {
  const base64_content = window.btoa(unescape(encodeURIComponent(content)));

  return fetch(`https://api.github.com/repos/${full_name}/contents/${file_path}`, {
    method: 'put',
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${token}`,
    },
    body: JSON.stringify({
      message: `create ${file_path}`,
      content: base64_content
    })
  })
  .then(res => res.json());
}