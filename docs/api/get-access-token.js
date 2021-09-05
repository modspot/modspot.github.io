import { client_id } from '../constants.js'

export default function getAccessToken(code) {
  return fetch(`https://modspot-github-auth-proxy.herokuapp.com/api/github-proxy/${code}`)
  .then(res => res.json())
  .then(obj => obj.access_token)
}