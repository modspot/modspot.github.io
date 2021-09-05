import graphqlQuery from './graphql-query.js';
import Repository from '../models/repository.js';


export default async function searchRepositories(token, game, search, before = null, after = null, results_per_page = 10) {
  if (!game) {
    return {
      /**
       * @type {Repository[]}
       */
      repositories: [],
      page_information: {},
    };
  }

  const search_query = search
    ? `topic:${game} ${search} in:readme sort:updated`
    : `topic:${game} sort:updated`;

  const after_query = after !== null
    ? `after: "${after}"`
    : '';

  const before_query = before !== null
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
    /**
     * @type {Repository[]}
     */
    repositories: repos.map(obj => new Repository(obj.repo)),
    page_information: {
      start_cursor: pageInfo.startCursor,
      has_next_page: pageInfo.hasNextPage,
      has_previous_page: pageInfo.hasPreviousPage,
      end_cursor: pageInfo.endCursor,
    },
  };
}

/**
 * this function searches the repositories as well but instead uses
 * the v3 github api.
 * 
 * The v3 api, unlike the graphql api, doesn't need a oauth token
 * and allows anyone to use the API.
 */
export async function searchRepositoryV3(game, search, page = 1, results_per_page = 10) {
  if (!game) {
    return [];
  }

  const search_query = search
    ? `topic:${game}%20${search}%20in:readme%20sort:updated`
    : `topic:${game}%20sort:updated`;
  const page_information = `page=${page || 0}&per_page=${results_per_page}`;
  const url = `https://api.github.com/search/repositories?${page_information}&q=${search_query}`;

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