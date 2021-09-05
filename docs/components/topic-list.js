import html from '../libs/html.js';

export default function TopicList(props) {
  const {
    topics = [],
    is_from_persistent_list = false,
    dispatch,
    search_input,
    github_token
  } = props;

  const extra_search = ` ${search_input} `;

  const removeFavoriteTopic = topic => dispatch({
    type: 'removeFavoriteTopic',
    payload: topic
  });

  const addFavoriteTopic = topic => dispatch({
    type: 'addFavoriteTopics',
    payload: [topic]
  });

  const toggleTopicFromSearch = (topic) => {
    const extra_topic = ` topic:${topic} `;

    if (extra_search.includes(extra_topic)) {
      dispatch({
        type: 'setSearchInput',
        payload: extra_search.replace(extra_topic, '').trim()
      });
    }
    else {
      dispatch({
        type: 'setSearchInput',
        payload: (extra_search.trim() + extra_topic).trim()
      });
    }
  }; 

  return html`
    <ul class="topic-list">
      ${topics.map(
        (topic) => html`
          <li>
            <!-- show the button only with the graphql api -->
            ${github_token && is_from_persistent_list && html`<button onClick=${() => removeFavoriteTopic(topic)} class="text-style muted">-</button>`}
            ${github_token && !is_from_persistent_list && html`<button onClick=${() => addFavoriteTopic(topic)} class="text-style muted">+</button>`}
            <button class=${`${extra_search.includes(` topic:${topic} `) ? 'underline' : ''} text-style accent`} onClick=${() => toggleTopicFromSearch(topic)}>${topic}</a>
          </li>
        `
      )}
    </ul>
  `;
}
