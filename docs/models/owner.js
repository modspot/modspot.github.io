
export default class Owner {
  constructor({ avatarUrl, login }) {
    /**
     * @type {string}
     */
    this.avatarUrl = avatarUrl;

    /**
     * @type {string}
     */
    this.login = login;
  }
}