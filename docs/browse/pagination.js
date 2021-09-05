import html from '../libs/html.js';

export default function Pagination({ state }) {
  // to support the v3 fallback.
  if (state.github_token === null) {
    return PaginationV3(state);
  }

  const {
    game,
    search,
    page_information: {
      start_cursor,
      end_cursor,
      has_next_page,
      has_previous_page
    }
  } = state;

  return html`
    <div id="pagination">
      ${has_previous_page && html`
        <a href=${`?game=${game}&search=${search}&end=${start_cursor}`}>
          ${'<'}
        </a>
      `}
      ${has_next_page && html`
        <a href=${`?game=${game}&search=${search}&start=${end_cursor}`}>
          ${'>'}
        </a>
      `}
    </div>
  `;
}

function PaginationV3(state) {
  const {
    game,
    search,
    page_information: {
      page = 1,
      has_next_page
    }
  } = state;

  return html`
    <div id="pagination">
      ${page > 1 && html`
        <a href=${`?game=${game}&search=${search}&page=${Number(page) - 1}`}>
          ${'<'}
        </a>
      `}
      ${has_next_page && html`
        <a href=${`?game=${game}&search=${search}&page=${Number(page) + 1}`}>
          ${'>'}
        </a>
      `}
    </div>
  `;
}