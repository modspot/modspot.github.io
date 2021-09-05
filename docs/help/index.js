import html from '../libs/html.js';
import { initial_state, reducer } from './reducer.js';

import Menu from '../components/menu.js';

const { useEffect, useReducer, useState } = React;

function App() {
  const [state, dispatch] = useReducer(reducer, initial_state);

  useEffect(() => {
    if (!location.hash) {
      return;
    }
    
    setTimeout(() => {
      const section = document.querySelector(location.hash);
      section.scrollIntoView({
        behavior: 'smooth'
      });
    }, 50);
  });

  return html`
    <div id="app">
      <${Menu} state=${state} dispatch=${dispatch} />

      <div id="content">
        <h1>How to be visible on modspot</h1>
        <ul>
          <li><a href="#how-to-make-project-visible">How to make your existing projects visible in Modspot</a></li>
          <li><a href="#how-to-use-github">How to use GitHub to host your projects</a></li>
          <li><a href="#why-github">Why GitHub - and known limitations</a></li>
          <li><a href="#realms">Modspot realms - What are they</a></li>
        </ul>

        <section id="how-to-make-project-visible" class="reading-font">
          <h2><a href="#how-to-make-project-visible">How to make your existing projects visible on Modspot</a></h2>

          <p>
            Topics on github are like hashtags on popular platforms. Your projects
            can use any amount of topics you want to make it more visible to people.
            Modspot uses the topics to search for mods. For example if you add
            the <span>witcher-3</span> topic to your project, it will become visible 
            in the <a href="/modspot/?game=witcher-3">Witcher 3 search page</a>.
            The Witcher 3 topic was written <span>witcher-3</span> because topics
            can't contain spaces, using dashes for spaces has become the practice.
            And of course if you want to make sure your mod is also visible in
            the <a href="/modspot/?game=witcher">witcher</a> search then you'll simply
            have to add another topic <span>witcher</span>.
          </p>

          <p>
            That's it.
            <br />
            You can learn more about topics <a href="https://docs.github.com/en/github/administering-a-repository/managing-repository-settings/classifying-your-repository-with-topics#adding-topics-to-your-repository">here</a>
          </p>
        </section>

        <section id="how-to-use-github" class="reading-font">
          <h2><a href="#how-to-use-github">How to use github to host your projects</a></h2>

          <p>
            First, you should know that GitHub was made for developers. It will
            have a few features you may never use or may not understand right away.
            But be reassured you don't need to know much to use the basic features
            of the website and have your project visible on Modspot.
          </p>

          <p>
            GitHub is made on top of <span>git</span>, a tool made to have history
            over changes made to software. Of course your projects may not all
            contain code but that's not an issue at all, git also works on any
            type of file.
          </p>

          <p>
            A project made with git (also called a repository) is composed of two
            main things:
            <ul>
              <li><span>The source</span>: the files used to actualle craft the project</li>
              <li><span>The releases</span>: the files actual users are supposed to download & use</li>
            </ul>
            The difference is important because GitHub as a hosting service puts
            restrictions on the source files but not the releases. So you must
            use releases to share your mods.
          </p>

          <p>
            Now we will take an example of how a mod project is
            organised. <a href="https://github.com/Aelto/tw3-random-encounters-reworked">RER</a> is a mod i made for the game The Witcher 3 that was hosted on Githud
            since the beginning. If you click the link you will notice three things:
            <ul>
              <li>The source files in the center</li>
              <li>The description under the source files</li>
              <li>A link to the releases on the right with a direct link to the latest version</li>
            </ul>
            To add a description to your mod you must create a <span>README.md</span> file
            and add it to the source files. Anything you will write in it will then
            be displayed on the main page.
            <br />
            To make a release, you must click on the releases link and then
            select <span>Draft a new release</span> where you'll be asked to write
            a version number, a title, a description and finally binary files for this release.
            It says binary but it can be anything like a zip archive for example.
          </p>
        </section>

        <section id="why-github" class="reading-font">
          <h2><a href="#why-github">Why GitHub - and known limitations</a></h2>

          <p>
            GitHub at a first glance may not seem suited for hosting your mods.
            However it presents many advantages that alternatives do not offer.
            A few of them will be listed here, do not see it as an exhaustive list

            <ul>
              <li>Encourages open-source mods in a fully transparent manner</li>
              <li>
                Very few limitations in the releases (what's a release? see this <a href="#how-to-use-github">section</a>).
                Files weighting up to 2GB each, with no limit in the amount of files,
                no limit in total size and no bandwidth limit either.
              </li>
              <li>
                Native support for <a href="https://docs.github.com/en/discussions">discussions</a>
              </li>
              <li>
                Native support for <a href="https://guides.github.com/features/issues/">issues</a> (bug reports)
              </li>
              <li>
                Native support for <a href="https://github.com/sponsors">sponsors</a> (donations)
              </li>
              <li>
                Free & complete API for the developers to automate their processes and build websites like modspot
              </li>
              <li>
                Support for privates repositories in case you really don't want to share the sources of your mods.
                You could then use a blank repository to appear on modspot and share your releases.
              </li>
              <li>
                No ads.
              </li>
              <li>
                GitHub was recently aquired by Microsoft and left as an independant company.
                Most of its revenue is from other companies relying on their services.
                That means there are no limitations for free users, or at least
                no limitations you will care about.
              </li>
            </ul>
          </p>

          <p>
            Now for the issues & limitations:
            <ul>
              <li>
                No ads, and so no passive revenue for maintainers outside of donations.
              </li>
              <li>
                Requires some tech knowledge to use. But it can also be seen as a good point,
                it enforces good working practices.
              </li>
              <li>
                GitHub was first created for software and code, which means that
                unless you know how to use the website or you use a website like modspot,
                browsing for mods may be complicated.
              </li>
            </ul>
          </p>
        </section>

        <section id="realms" class="reading-font">
          <h2><a href="#realms">Modspot realms - What are they</a></h2>

          <p>
            Realms are modspot's way to make modpacks, but it is also a way to
            add projects that are not hosted on GitHub on modspot. The realms are displayed
            in a different color and when clicked a window is opened to display all the mods
            in that realm.
          </p>

          <p>
            To add a realm to modspot use one of the following methods:
            <ul>
              <li>Use the <a href="/modspot/realm/create">Realm creation form</a></li>
              <li>Use the documentation and use the <a href="https://github.com/Aelto/modspot-realm-example">realword example</a></li>
            </ul>
          </p>
        </section>
      </div>
    </div>
  `;
}

ReactDOM.render(
  html`<${App} />`,
  document.body
);