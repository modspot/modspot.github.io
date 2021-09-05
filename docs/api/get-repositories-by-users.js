import graphqlQuery from './graphql-query.js';
import Repository from '../models/repository.js';

export default async function getRepositoriesByUsers(token, game, users = [], before, after, results_per_page = 100) {
  if (!game || !users.length) {
    return [];
  }

  const search_query = [`topic:${game} `, ...users.map(user => `user:${user}`)]
    .join(' ');

  const after_query = after
    ? `after: "${after}"`
    : '';

  const before_query = before
    ? `before: "${before}"`
    : '';

  const last_or_first = before_query
    ? 'last'
    : 'first';

  const query = `
    query {
      search(
        type:REPOSITORY, 
        query: """
        ${search_query}
        """,
        ${last_or_first}: ${results_per_page},
        ${before_query || after_query}
      ) {
        pageInfo {
          startCursor
          hasNextPage
          hasPreviousPage
          endCursor
        }

        repos: edges {
          repo: node {
            ... on Repository {
              url,
              openGraphImageUrl,
              name,
              description,
              homepageUrl,

              repositoryTopics(first: 100) {
                edges {
                  node {
                    id,
                    topic {
                      name
                    }
                  }
                }
              }

              owner {
                login,
                avatarUrl
              }

              discussions(first: 1) {
                edges {
                  node {
                    id,
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  

  const result = await graphqlQuery(token, query);

  const { repos, pageInfo } = result.data.search;

  return {
    repositories: repos.map(obj => new Repository(obj.repo)),
    page_information: {
      start_cursor: pageInfo.startCursor,
      has_next_page: pageInfo.hasNextPage,
      has_previous_page: pageInfo.hasPreviousPage,
      end_cursor: pageInfo.endCursor,
    },
  };
}

export async function getRepositoriesByUsersV3(game, users = [], page = 1, results_per_page = 100) {
  if (!game || !users.length) {
    return [];
  }

  const search_query = [`topic:${game}%20`, ...users.map(user => `user:${user}`)]
    .join('%20');

  const page_query = `page=${page || 0}&per_page=${results_per_page}`;
  const url = `https://api.github.com/search/repositories?${page_query}&q=${search_query}`;

  const response = await fetch(url);
  const result = await response.json();

  return {
    repositories: result.items.map(repository => Repository.fromV3Data(repository)),
    page_information: {
      page,
      has_next_page: (page - 1) * results_per_page + result.items.length < result.total_count
    }
  };
}