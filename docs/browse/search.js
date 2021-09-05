import HoverModal from '../components/hover-modal.js';
import html from '../libs/html.js';
import params from '../libs/params.js';

export const StyledSearch = styled.form`
  & {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 1em;
  }

  & input#search {
    margin-left: 2em;
    min-width: 30ch;
  }

  & input[type="submit"] {
    margin-left: 2em;
  }

  .search-options {
    border: solid 1px var(--color-very-muted);
  }
`;

export default function Search(props){
  const { dispatch } = props;

  return html`
    <${StyledSearch}>
      <input
        type="search"
        id="game"
        name="game"
        list="game-list"
        placeholder="Game"
        value=${props.game_input}
        onChange=${event => dispatch({ type: 'setGameInput', payload: event.target.value })}
      />
      <datalist id="game-list">
        <option value="witcher-3"></option>
        <option value="minecraft"></option>
        <option value="cyberpunk2077"></option>
      </datalist>
      <input
        type="search"
        id="search"
        name="search"
        value=${props.search_input}
        onChange=${event => dispatch({ type: 'setSearchInput', payload: event.target.value })}
        style=${{ width: `${props.search_input.length}ch` }}
      />

      <${HoverModal} className="search-options muted">
        ⌨

        <div class="options-wrapper">
          <div class="options">
            <label class="smaller" for="realms-only">Realms only</label>
            <input type="checkbox" name="realms-only" id="realms-only" />
          </div>
        </div>
      </${HoverModal}>

      <input type="submit" value="Search" />

      
    </${StyledSearch}>
  `;
}