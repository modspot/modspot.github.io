import Owner from './owner.js';
import Discussion from './discussion.js';

/**
 * @returns {string[]}
 */
function makeRepositoryTopics(topics) {
  return topics.edges.map(item => item.node.topic.name);
}

/**
 * @returns {Discussion[]}
 */
function makeRepositoryDiscussions(discussions) {
  return discussions.edges.map(item => new Discussion(item.node))
}

export default class Repository {
  constructor(raw_data) {
    this.url = raw_data.url;
    this.description = raw_data.description;
    this.openGraphImageUrl = raw_data.openGraphImageUrl;
    this.name = raw_data.name;
    this.owner = new Owner(raw_data.owner);
    this.discussions = makeRepositoryDiscussions(raw_data.discussions);
    this.pushed_at = new Date(raw_data.pushedAt);

    /**
     * @type {string[]}
     */
    this.topics = makeRepositoryTopics(raw_data.repositoryTopics) || [];
    this.homepage_url = raw_data.homepageUrl;
  }

  static fromV3Data(raw_data) {
    return new Repository({
      url: raw_data.html_url,
      description: raw_data.description,
      openGraphImageUrl: raw_data.owner.avatar_url,
      name: raw_data.name,
      pushedAt: raw_data.pushed_at,
      owner: {
        avatarUrl: raw_data.owner.avatar_url,
        login: raw_data.owner.login
      },
      homepageUrl: raw_data.homepage,
      discussions: {
        edges: [{
          node: {
            url: `${raw_data.url}/discussions`
          }
        }]
      },
      repositoryTopics: {
        edges: []
      }
    });
  }
}

/**
 * returns if the supplied repository is a modspot realm
 * @param {Repository} repository 
 */
export function isRealm(repository) {
  if (!Array.isArray(repository.topics)) {
    return false;
  }

  return repository.topics.some(topic => topic === 'modspot-realm');
}
