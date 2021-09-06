import html from '../libs/html.js';

export default function GameList() {
  const games = [
    { route: 'witcher-3', name: 'Witcher 3' },
    { route: 'cyberpunk2077', name: 'Cyberpunk 2077' },
    { route: 'valheim', name: 'Valheim' },
    { route: 'dark-souls', name: 'Dark Souls' },
    { route: 'minecraft', name: 'Minecraft' },
    { route: 'skyrim', name: 'Skyrim' },
    { route: 'fallout', name: 'Fallout' },
    { route: 'guildwars2', name: 'Guild Wars 2' },
  ];

  return html`
    <ul class="repository-list">
      ${games.map(game => html`
        <li>
          <a class="repository" href=${`?game=${game.route}`}>${game.name}</a>
        </li>
      `)}
    </ul>
  `;
}