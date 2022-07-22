<p align="center">
  <img src="https://raw.githubusercontent.com/isomorphic-git/isomorphic-git/main/website/static/img/isomorphic-git-logo.svg?sanitize=true" alt="" height="150" />
</p>

# isomorphic-git

`isomorphic-git`&nbsp;is a pure JavaScript reimplementation of git that works in both Node.js and browser JavaScript environments. It can read and write to git repositories, fetch from and push to git remotes (such as GitHub), all without any native C++ module dependencies.

## Goals

Isomorphic-git aims for 100% interoperability with the canonical git implementation. This means it does all its operations by modifying files in a ".git" directory just like the git you are used to. The included&nbsp;`isogit`&nbsp;CLI can operate on git repositories on your desktop or server.

This library aims to be a complete solution with no assembly required. The API has been designed with modern tools like Rollup and Webpack in mind. By providing functionality as individual functions, code bundlers can produce smaller bundles by including only the functions your application uses.

The project includes type definitions so you can enjoy static type-checking and intelligent code completion in editors like VS Code and [CodeSandbox](https://codesandbox.io).

## Supported Environments

The following environments are tested in CI and will continue to be supported until the next breaking version:

<img src="https://raw.githubusercontent.com/isomorphic-git/isomorphic-git/main/website/static/img/browsers/node.webp" alt="" width="64" height="64" />
<br>Node 10 <img src="https://raw.githubusercontent.com/alrra/browser-logos/bc47e4601d2c1fd46a7912f9aed5cdda4afdb301/src/chrome/chrome.svg?sanitize=true" alt="" width="64" height="64" />
<br>Chrome 79 <img src="https://raw.githubusercontent.com/alrra/browser-logos/bc47e4601d2c1fd46a7912f9aed5cdda4afdb301/src/edge/edge.svg?sanitize=true" alt="" width="64" height="64" />
<br>Edge 79 <img src="https://raw.githubusercontent.com/alrra/browser-logos/bc47e4601d2c1fd46a7912f9aed5cdda4afdb301/src/firefox/firefox.svg?sanitize=true" alt="" width="64" height="64" />
<br>Firefox 72 <img src="https://raw.githubusercontent.com/alrra/browser-logos/bc47e4601d2c1fd46a7912f9aed5cdda4afdb301/src/safari/safari_64x64.png" alt="" width="64" height="64" />
<br>Safari 13 <img src="https://upload.wikimedia.org/wikipedia/commons/6/64/Android_logo_2019_%28stacked%29.svg" alt="" width="64" height="64" />
<br>Android 10 <img src="https://upload.wikimedia.org/wikipedia/commons/d/d6/IOS_13_logo.svg" alt="" width="64" height="64" />
<br>iOS 13

## Upgrading from version 0.x to version 1.x?

See the full [Release Notes](https://github.com/isomorphic-git/isomorphic-git/releases/tag/v1.0.0) on GitHub and the release [Blog Post](https://isomorphic-git.org/blog/2020/02/25/version-1-0-0).

## Install

You can install it from npm:

```
npm install --save isomorphic-git
```

## Getting Started

The "isomorphic" in&nbsp;`isomorphic-git`&nbsp;means that the same code runs in either the server or the browser. That's tricky to do since git uses the file system and makes HTTP requests. Browsers don't have an&nbsp;`fs`&nbsp;module. And node and browsers have different APIs for making HTTP requests!

So rather than relying on the&nbsp;`fs`&nbsp;and&nbsp;`http`&nbsp;modules,&nbsp;`isomorphic-git`&nbsp;lets you bring your own file system and HTTP client.

If you're using&nbsp;`isomorphic-git`&nbsp;in node, you use the native&nbsp;`fs`&nbsp;module and the provided node HTTP client.

```js
// node.js example
const path = require('path')
const git = require('isomorphic-git')
const http = require('isomorphic-git/http/node')
const fs = require('fs')

const dir = path.join(process.cwd(), 'test-clone')
git.clone({ fs, http, dir, url: 'https://github.com/isomorphic-git/lightning-fs' }).then(console.log)
```

If you're using&nbsp;`isomorphic-git`&nbsp;in the browser, you'll need something that emulates the&nbsp;`fs`&nbsp;API. The easiest to setup and most performant library is [LightningFS](https://github.com/isomorphic-git/lightning-fs) which is written and maintained by the same author and is part of the&nbsp;`isomorphic-git`&nbsp;suite. If LightningFS doesn't meet your requirements, isomorphic-git should also work with [BrowserFS](https://github.com/jvilk/BrowserFS) and [Filer](https://github.com/filerjs/filer). Instead of&nbsp;`isomorphic-git/http/node`&nbsp;this time import&nbsp;`isomorphic-git/http/web`:

```html
<script src="https://unpkg.com/@isomorphic-git/lightning-fs"></script>
<script src="https://unpkg.com/isomorphic-git"></script>
<script type="module">
import http from 'https://unpkg.com/isomorphic-git@beta/http/web/index.js'
const fs = new LightningFS('fs')

const dir = '/test-clone'
git.clone({ fs, http, dir, url: 'https://github.com/isomorphic-git/lightning-fs', corsProxy: 'https://cors.isomorphic-git.org' }).then(console.log)
</script>
```

If you're using ES module syntax, you can use either the default import for convenience, or named imports to benefit from tree-shaking if you are using a bundler:

```js
import git from 'isomorphic-git'
// or
import * as git from 'isomorphic-git'
// or
import {plugins, clone, commit, push} from 'isomorphic-git'
```

View the full [Getting Started guide](https://isomorphic-git.github.io/docs/quickstart.html) on the docs website.

Then check out the [Useful Snippets](https://isomorphic-git.org/docs/en/snippets) page, which includes even more sample code written by the community!

### CORS support

Unfortunately, due to the same-origin policy by default&nbsp;`isomorphic-git`&nbsp;can only clone from the same origin as the webpage it is running on. This is terribly inconvenient, as it means for all practical purposes cloning and pushing repos must be done through a proxy.

For this purpose [@isomorphic-git/cors-proxy](https://github.com/isomorphic-git/cors-proxy) exists which you can clone or [`npm install`](https://www.npmjs.com/package/@isomorphic-git/cors-proxy). For testing or small projects, you can also use [https://cors.isomorphic-git.org](https://cors.isomorphic-git.org) - a free proxy sponsored by [Clever Cloud](https://www.clever-cloud.com/?utm_source=ref&utm_medium=link&utm_campaign=isomorphic-git).

I'm hoping to get CORS headers added to all the major Git hosting platforms eventually, and will list my progress here:

Service Supports CORS requests Gogs (self-hosted) [✔](https://isomorphic-git.github.io/blog/2018/04/07/gogs-adds-cors-headers-for-isomorphic-git.html) Gitea (self-hosted) [✔](https://github.com/go-gitea/gitea/pull/5719) Azure DevOps [✔](https://github.com/isomorphic-git/isomorphic-git/issues/678#issuecomment-452402740) (Usage Note: requires authentication) Gitlab ❌ My [PR](https://gitlab.com/gitlab-org/gitlab-workhorse/merge_requests/219) was rejected, but the [issue](https://gitlab.com/gitlab-org/gitlab/issues/20590) is still open! Bitbucket ❌ Github ❌

It is literally just two lines of code to add the CORS headers!! Easy stuff. Surely it will happen.

### `isogit`&nbsp;CLI

Isomorphic-git comes with a simple CLI tool, named&nbsp;`isogit`&nbsp;because&nbsp;`isomorphic-git`&nbsp;is a lot to type. It is really just a thin shell that translates command line arguments into the equivalent JS API commands. So you should be able to run *any* current or future isomorphic-git commands using the CLI.

It always starts with an the assumption that the current working directory is a git root. E.g.&nbsp;`{ dir: '.' }`.

It uses&nbsp;`minimisted`&nbsp;to parse command line options and will print out the equivalent JS command and pretty-print the output JSON.

The CLI is more of a lark for quickly testing&nbsp;`isomorphic-git`&nbsp;and isn't really meant as a&nbsp;`git`&nbsp;CLI replacement.

## Supported Git commands

This project follows semantic versioning, so I may continue to make changes to the API but they will always be backwards compatible unless there is a major version bump.

### commands

-   [add](https://isomorphic-git.github.io/docs/add.html)
-   [addNote](https://isomorphic-git.github.io/docs/addNote.html)
-   [addRemote](https://isomorphic-git.github.io/docs/addRemote.html)
-   [annotatedTag](https://isomorphic-git.github.io/docs/annotatedTag.html)
-   [branch](https://isomorphic-git.github.io/docs/branch.html)
-   [checkout](https://isomorphic-git.github.io/docs/checkout.html)
-   [clone](https://isomorphic-git.github.io/docs/clone.html)
-   [commit](https://isomorphic-git.github.io/docs/commit.html)
-   [currentBranch](https://isomorphic-git.github.io/docs/currentBranch.html)
-   [deleteBranch](https://isomorphic-git.github.io/docs/deleteBranch.html)
-   [deleteRef](https://isomorphic-git.github.io/docs/deleteRef.html)
-   [deleteRemote](https://isomorphic-git.github.io/docs/deleteRemote.html)
-   [deleteTag](https://isomorphic-git.github.io/docs/deleteTag.html)
-   [expandOid](https://isomorphic-git.github.io/docs/expandOid.html)
-   [expandRef](https://isomorphic-git.github.io/docs/expandRef.html)
-   [fastForward](https://isomorphic-git.github.io/docs/fastForward.html)
-   [fetch](https://isomorphic-git.github.io/docs/fetch.html)
-   [findMergeBase](https://isomorphic-git.github.io/docs/findMergeBase.html)
-   [findRoot](https://isomorphic-git.github.io/docs/findRoot.html)
-   [getConfig](https://isomorphic-git.github.io/docs/getConfig.html)
-   [getConfigAll](https://isomorphic-git.github.io/docs/getConfigAll.html)
-   [getRemoteInfo](https://isomorphic-git.github.io/docs/getRemoteInfo.html)
-   [getRemoteInfo2](https://isomorphic-git.github.io/docs/getRemoteInfo2.html)
-   [hashBlob](https://isomorphic-git.github.io/docs/hashBlob.html)
-   [indexPack](https://isomorphic-git.github.io/docs/indexPack.html)
-   [init](https://isomorphic-git.github.io/docs/init.html)
-   [isDescendent](https://isomorphic-git.github.io/docs/isDescendent.html)
-   [isIgnored](https://isomorphic-git.github.io/docs/isIgnored.html)
-   [listBranches](https://isomorphic-git.github.io/docs/listBranches.html)
-   [listFiles](https://isomorphic-git.github.io/docs/listFiles.html)
-   [listNotes](https://isomorphic-git.github.io/docs/listNotes.html)
-   [listRemotes](https://isomorphic-git.github.io/docs/listRemotes.html)
-   [listServerRefs](https://isomorphic-git.github.io/docs/listServerRefs.html)
-   [listTags](https://isomorphic-git.github.io/docs/listTags.html)
-   [log](https://isomorphic-git.github.io/docs/log.html)
-   [merge](https://isomorphic-git.github.io/docs/merge.html)
-   [packObjects](https://isomorphic-git.github.io/docs/packObjects.html)
-   [pull](https://isomorphic-git.github.io/docs/pull.html)
-   [push](https://isomorphic-git.github.io/docs/push.html)
-   [readBlob](https://isomorphic-git.github.io/docs/readBlob.html)
-   [readCommit](https://isomorphic-git.github.io/docs/readCommit.html)
-   [readNote](https://isomorphic-git.github.io/docs/readNote.html)
-   [readObject](https://isomorphic-git.github.io/docs/readObject.html)
-   [readTag](https://isomorphic-git.github.io/docs/readTag.html)
-   [readTree](https://isomorphic-git.github.io/docs/readTree.html)
-   [remove](https://isomorphic-git.github.io/docs/remove.html)
-   [removeNote](https://isomorphic-git.github.io/docs/removeNote.html)
-   [renameBranch](https://isomorphic-git.github.io/docs/renameBranch.html)
-   [resetIndex](https://isomorphic-git.github.io/docs/resetIndex.html)
-   [resolveRef](https://isomorphic-git.github.io/docs/resolveRef.html)
-   [setConfig](https://isomorphic-git.github.io/docs/setConfig.html)
-   [status](https://isomorphic-git.github.io/docs/status.html)
-   [statusMatrix](https://isomorphic-git.github.io/docs/statusMatrix.html)
-   [tag](https://isomorphic-git.github.io/docs/tag.html)
-   [updateIndex](https://isomorphic-git.github.io/docs/updateIndex.html)
-   [version](https://isomorphic-git.github.io/docs/version.html)
-   [walk](https://isomorphic-git.github.io/docs/walk.html)
-   [writeBlob](https://isomorphic-git.github.io/docs/writeBlob.html)
-   [writeCommit](https://isomorphic-git.github.io/docs/writeCommit.html)
-   [writeObject](https://isomorphic-git.github.io/docs/writeObject.html)
-   [writeRef](https://isomorphic-git.github.io/docs/writeRef.html)
-   [writeTag](https://isomorphic-git.github.io/docs/writeTag.html)
-   [writeTree](https://isomorphic-git.github.io/docs/writeTree.html)

## Community

Share your questions and ideas with us! We love that. You can find us in our [Gitter chatroom](https://gitter.im/isomorphic-git/Lobby) or just create an issue here on Github! We are also [@IsomorphicGit](https://twitter.com/IsomorphicGit) on Twitter.

## Contributing to&nbsp;`isomorphic-git`

The development setup is similar to that of a large web application. The main difference is the ridiculous amount of hacks involved in the tests. We use Facebook's [Jest](https://jestjs.io) for testing, which make doing TDD fast and fun, but we also used custom hacks so that the same tests will also run in the browser using [Jasmine](https://jasmine.github.io/) via [Karma](https://karma-runner.github.io). We even have our own [mock server](https://github.com/isomorphic-git/git-http-mock-server) for serving git repository test fixtures!

You'll need [node.js](https://nodejs.org) installed, but everything else is a devDependency.

```sh
git clone https://github.com/isomorphic-git/isomorphic-git
cd isomorphic-git
npm install
npm test
```

Check out the [`CONTRIBUTING`](./CONTRIBUTING.md) document for more instructions.

## Who is using isomorphic-git?

-   [nde](https://nde.now.sh) - a futuristic next-generation web IDE
-   [git-app-manager](https://git-app-manager.now.sh/) - install "unhosted" websites locally by git cloning them
-   [GIT Web Terminal](https://jcubic.github.io/git/)
-   [Next Editor](https://next-editor.app/)
-   [Clever Cloud](https://www.clever-cloud.com/?utm_source=ref&utm_medium=link&utm_campaign=isomorphic-git)
-   [Stoplight Studio](https://stoplight.io/studio/?utm_source=ref&utm_medium=link&utm_campaign=isomorphic-git) - a modern editor for API design and technical writing

## Similar projects

-   [js-git](https://github.com/creationix/js-git)
-   [es-git](https://github.com/es-git/es-git)

## Acknowledgments

Isomorphic-git would not have been possible without the pioneering work by @creationix and @chrisdickinson. Git is a tricky binary mess, and without their examples (and their modules!) I would not have been able to come even close to finishing this. They are geniuses ahead of their time.

Cross-browser device testing is provided by:

[![BrowserStack](https://user-images.githubusercontent.com/587740/39730261-9c65c4d8-522e-11e8-9f12-16b349377a35.png)](http://browserstack.com/)

[![SauceLabs](https://saucelabs.com/content/images/logo.png)](https://saucelabs.com)

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

[<img src="https://avatars2.githubusercontent.com/u/587740?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>William Hilton</sub>**](https://onename.com/wmhilton)
<br>[📝](#blog-wmhilton) [🐛](https://github.com/isomorphic-git/isomorphic-git/issues?q=author%3Awmhilton) [💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=wmhilton) [🎨](#design-wmhilton) [📖](https://github.com/isomorphic-git/isomorphic-git/commits?author=wmhilton) [💡](#example-wmhilton) [⚠️](https://github.com/isomorphic-git/isomorphic-git/commits?author=wmhilton) [✅](#tutorial-wmhilton) [<img src="https://avatars2.githubusercontent.com/u/33748231?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>wDhTIG</sub>**](https://github.com/wDhTIG)
<br>[🐛](https://github.com/isomorphic-git/isomorphic-git/issues?q=author%3AwDhTIG) [<img src="https://avatars3.githubusercontent.com/u/847542?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>Marc MacLeod</sub>**](https://github.com/marbemac)
<br>[🤔](#ideas-marbemac) [🔍](#fundingFinding-marbemac) [<img src="https://avatars3.githubusercontent.com/u/20234?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>Brett Zamir</sub>**](http://brett-zamir.me)
<br>[🤔](#ideas-brettz9) [<img src="https://avatars2.githubusercontent.com/u/79351?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>Dan Allen</sub>**](http://mojavelinux.com)
<br>[🐛](https://github.com/isomorphic-git/isomorphic-git/issues?q=author%3Amojavelinux) [💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=mojavelinux) [🤔](#ideas-mojavelinux) [<img src="https://avatars1.githubusercontent.com/u/6831144?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>Tomáš Hübelbauer</sub>**](https://TomasHubelbauer.net)
<br>[🐛](https://github.com/isomorphic-git/isomorphic-git/issues?q=author%3ATomasHubelbauer) [💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=TomasHubelbauer) [<img src="https://avatars2.githubusercontent.com/u/1410520?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>Juan Campa</sub>**](https://github.com/juancampa)
<br>[🐛](https://github.com/isomorphic-git/isomorphic-git/issues?q=author%3Ajuancampa) [💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=juancampa) [<img src="https://avatars2.githubusercontent.com/u/1041868?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>Ira Miller</sub>**](http://iramiller.com)
<br>[🐛](https://github.com/isomorphic-git/isomorphic-git/issues?q=author%3Aisysd) [<img src="https://avatars1.githubusercontent.com/u/6311784?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>Rhys Arkins</sub>**](http://rhys.arkins.net)
<br>[💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=rarkins) [<img src="https://avatars1.githubusercontent.com/u/3408176?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>Sean Larkin</sub>**](http://twitter.com/TheLarkInn)
<br>[💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=TheLarkInn) [<img src="https://avatars1.githubusercontent.com/u/827205?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>Daniel Ruf</sub>**](https://daniel-ruf.de)
<br>[💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=DanielRuf) [<img src="https://avatars0.githubusercontent.com/u/10220449?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>bokuweb</sub>**](http://blog.bokuweb.me/)
<br>[💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=bokuweb) [📖](https://github.com/isomorphic-git/isomorphic-git/commits?author=bokuweb) [⚠️](https://github.com/isomorphic-git/isomorphic-git/commits?author=bokuweb) [<img src="https://avatars0.githubusercontent.com/u/1075694?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>Hiroki Osame</sub>**](https://github.com/hirokiosame)
<br>[💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=hirokiosame) [📖](https://github.com/isomorphic-git/isomorphic-git/commits?author=hirokiosame) [<img src="https://avatars1.githubusercontent.com/u/280241?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>Jakub Jankiewicz</sub>**](http://jcubic.pl/me)
<br>[💬](#question-jcubic) [🐛](https://github.com/isomorphic-git/isomorphic-git/issues?q=author%3Ajcubic) [💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=jcubic) [💡](#example-jcubic) [⚠️](https://github.com/isomorphic-git/isomorphic-git/commits?author=jcubic) [<img src="https://avatars1.githubusercontent.com/u/10459637?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>howardgod</sub>**](https://github.com/howardgod)
<br>[🐛](https://github.com/isomorphic-git/isomorphic-git/issues?q=author%3Ahowardgod) [💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=howardgod) [<img src="https://avatars3.githubusercontent.com/u/263378?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>burningTyger</sub>**](https://twitter.com/btyga)
<br>[🐛](https://github.com/isomorphic-git/isomorphic-git/issues?q=author%3AburningTyger) [<img src="https://avatars2.githubusercontent.com/u/65864?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>Melvin Carvalho</sub>**](https://melvincarvalho.com/#me)
<br>[📖](https://github.com/isomorphic-git/isomorphic-git/commits?author=melvincarvalho) <img src="https://avatars2.githubusercontent.com/u/3035266?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>akaJes</sub>**
<br>[💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=akaJes) [<img src="https://avatars2.githubusercontent.com/u/8316?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>Dima Sabanin</sub>**](http://twitter.com/dimasabanin)
<br>[🐛](https://github.com/isomorphic-git/isomorphic-git/issues?q=author%3Adsabanin) [💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=dsabanin) [<img src="https://avatars2.githubusercontent.com/u/73962?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>Koutaro Chikuba</sub>**](http://twitter.com/mizchi)
<br>[🐛](https://github.com/isomorphic-git/isomorphic-git/issues?q=author%3Amizchi) [💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=mizchi) [<img src="https://avatars2.githubusercontent.com/u/236342?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>Hubert SABLONNIÈRE</sub>**](https://www.hsablonniere.com/)
<br>[💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=hsablonniere) [⚠️](https://github.com/isomorphic-git/isomorphic-git/commits?author=hsablonniere) [🤔](#ideas-hsablonniere) [🔍](#fundingFinding-hsablonniere) [<img src="https://avatars1.githubusercontent.com/u/8864716?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>David Duarte</sub>**](https://github.com/DeltaEvo)
<br>[💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=DeltaEvo) [<img src="https://avatars2.githubusercontent.com/u/2294309?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>Thomas Pytleski</sub>**](http://stoplight.io/)
<br>[🐛](https://github.com/isomorphic-git/isomorphic-git/issues?q=author%3Apytlesk4) [💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=pytlesk4) [<img src="https://avatars3.githubusercontent.com/u/2793551?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>Vadim Markovtsev</sub>**](http://linkedin.com/in/vmarkovtsev)
<br>[🐛](https://github.com/isomorphic-git/isomorphic-git/issues?q=author%3Avmarkovtsev) [<img src="https://avatars0.githubusercontent.com/u/18474125?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>Yu Shimura</sub>**](https://yuhr.org)
<br>[🤔](#ideas-yuhr) [💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=yuhr) [⚠️](https://github.com/isomorphic-git/isomorphic-git/commits?author=yuhr) [<img src="https://avatars1.githubusercontent.com/u/545047?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>Dan Lynch</sub>**](https://github.com/pyramation)
<br>[💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=pyramation) [<img src="https://avatars3.githubusercontent.com/u/130597?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>Jeffrey Wescott</sub>**](https://www.jeffreywescott.com/)
<br>[🐛](https://github.com/isomorphic-git/isomorphic-git/issues?q=author%3Ajeffreywescott) [💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=jeffreywescott) [<img src="https://avatars2.githubusercontent.com/u/5515758?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>zebzhao</sub>**](https://github.com/zebzhao)
<br>[💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=zebzhao) [<img src="https://avatars2.githubusercontent.com/u/8736328?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>Tyler Smith</sub>**](https://github.com/tilersmyth)
<br>[🐛](https://github.com/isomorphic-git/isomorphic-git/issues?q=author%3Atilersmyth) [<img src="https://avatars3.githubusercontent.com/u/36491?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>Bram Borggreve</sub>**](https://github.com/beeman)
<br>[🐛](https://github.com/isomorphic-git/isomorphic-git/issues?q=author%3Abeeman) [<img src="https://avatars1.githubusercontent.com/u/1543625?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>Stefan Guggisberg</sub>**](https://github.com/stefan-guggisberg)
<br>[🐛](https://github.com/isomorphic-git/isomorphic-git/issues?q=author%3Astefan-guggisberg) [💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=stefan-guggisberg) [⚠️](https://github.com/isomorphic-git/isomorphic-git/commits?author=stefan-guggisberg) [<img src="https://avatars2.githubusercontent.com/u/6519792?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>Catalin Pirvu</sub>**](https://github.com/katakonst)
<br>[💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=katakonst) [<img src="https://avatars1.githubusercontent.com/u/6432572?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>Nicholas Nelson</sub>**](http://web.engr.oregonstate.edu/~nelsonni/)
<br>[💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=nelsonni) [⚠️](https://github.com/isomorphic-git/isomorphic-git/commits?author=nelsonni) [<img src="https://avatars2.githubusercontent.com/u/899444?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>Anna Henningsen</sub>**](https://twitter.com/addaleax)
<br>[💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=addaleax) [<img src="https://avatars0.githubusercontent.com/u/4312191?v=4&s=60?s=60" alt="" width="60px;" />
<br>**<sub>Fabian Henneke</sub>**](https://hen.ne.ke)
<br>[🐛](https://github.com/isomorphic-git/isomorphic-git/issues?q=author%3AFabianHenneke) [💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=FabianHenneke) [<img src="https://avatars2.githubusercontent.com/u/569822?v=4?s=60" alt="" width="60px;" />
<br>**<sub>djencks</sub>**](https://github.com/djencks)
<br>[🐛](https://github.com/isomorphic-git/isomorphic-git/issues?q=author%3Adjencks) [💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=djencks) [⚠️](https://github.com/isomorphic-git/isomorphic-git/commits?author=djencks) [<img src="https://avatars0.githubusercontent.com/u/1086421?v=4?s=60" alt="" width="60px;" />
<br>**<sub>Clemens Wolff</sub>**](https://justamouse.com)
<br>[💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=c-w) [📖](https://github.com/isomorphic-git/isomorphic-git/commits?author=c-w) [⚠️](https://github.com/isomorphic-git/isomorphic-git/commits?author=c-w) [<img src="https://avatars1.githubusercontent.com/u/3102175?v=4?s=60" alt="" width="60px;" />
<br>**<sub>Sojin Park</sub>**](https://sojin.io)
<br>[💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=raon0211) [<img src="https://avatars0.githubusercontent.com/u/319282?v=4?s=60" alt="" width="60px;" />
<br>**<sub>Edward Faulkner</sub>**](http://eaf4.com)
<br>[💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=ef4) [<img src="https://avatars2.githubusercontent.com/u/11488886?v=4?s=60" alt="" width="60px;" />
<br>**<sub>Khải</sub>**](https://github.com/KSXGitHub)
<br>[🐛](https://github.com/isomorphic-git/isomorphic-git/issues?q=author%3AKSXGitHub) [<img src="https://avatars0.githubusercontent.com/u/9100169?v=4?s=60" alt="" width="60px;" />
<br>**<sub>Corbin Crutchley</sub>**](https://crutchcorn.dev/)
<br>[💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=crutchcorn) [📖](https://github.com/isomorphic-git/isomorphic-git/commits?author=crutchcorn) [⚠️](https://github.com/isomorphic-git/isomorphic-git/commits?author=crutchcorn) [<img src="https://avatars1.githubusercontent.com/u/327887?v=4?s=60" alt="" width="60px;" />
<br>**<sub>Riceball LEE</sub>**](https://github.com/snowyu)
<br>[💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=snowyu) [📖](https://github.com/isomorphic-git/isomorphic-git/commits?author=snowyu) [⚠️](https://github.com/isomorphic-git/isomorphic-git/commits?author=snowyu) [<img src="https://avatars1.githubusercontent.com/u/3746270?v=4?s=60" alt="" width="60px;" />
<br>**<sub>lin onetwo</sub>**](https://onetwo.ren/)
<br>[💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=linonetwo) [<img src="https://avatars2.githubusercontent.com/u/3705017?v=4?s=60" alt="" width="60px;" />
<br>**<sub>林法鑫</sub>**](https://github.com/linfaxin)
<br>[🐛](https://github.com/isomorphic-git/isomorphic-git/issues?q=author%3Alinfaxin) [<img src="https://avatars2.githubusercontent.com/u/335152?v=4?s=60" alt="" width="60px;" />
<br>**<sub>Will Stott</sub>**](https://github.com/willstott101)
<br>[💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=willstott101) [⚠️](https://github.com/isomorphic-git/isomorphic-git/commits?author=willstott101) [<img src="https://avatars2.githubusercontent.com/u/223277?v=4?s=60" alt="" width="60px;" />
<br>**<sub>Seth Nickell</sub>**](http://mtnspring.org/)
<br>[🐛](https://github.com/isomorphic-git/isomorphic-git/issues?q=author%3Asnickell) [<img src="https://avatars0.githubusercontent.com/u/3290313?v=4?s=60" alt="" width="60px;" />
<br>**<sub>Alex Titarenko</sub>**](https://www.alextitarenko.me/)
<br>[💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=alex-titarenko) [<img src="https://avatars2.githubusercontent.com/u/15040698?v=4?s=60" alt="" width="60px;" />
<br>**<sub>Misha Kaletsky</sub>**](https://github.com/mmkal)
<br>[💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=mmkal) [<img src="https://avatars1.githubusercontent.com/u/54646976?v=4?s=60" alt="" width="60px;" />
<br>**<sub>Richard C. Zulch</sub>**](https://github.com/rczulch)
<br>[💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=rczulch) [📖](https://github.com/isomorphic-git/isomorphic-git/commits?author=rczulch) [<img src="https://avatars.githubusercontent.com/u/30231179?v=4?s=60" alt="" width="60px;" />
<br>**<sub>mkizka</sub>**](https://scrapbox.io/mkizka/README)
<br>[💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=mkizka) [<img src="https://avatars.githubusercontent.com/u/49341894?v=4?s=60" alt="" width="60px;" />
<br>**<sub>RyotaK</sub>**](https://ryotak.me/)
<br>[🐛](https://github.com/isomorphic-git/isomorphic-git/issues?q=author%3ARy0taK) [<img src="https://avatars.githubusercontent.com/u/3045979?v=4?s=60" alt="" width="60px;" />
<br>**<sub>Noah Hummel</sub>**](https://github.com/strangedev)
<br>[💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=strangedev) [⚠️](https://github.com/isomorphic-git/isomorphic-git/commits?author=strangedev) [<img src="https://avatars.githubusercontent.com/u/542836?v=4?s=60" alt="" width="60px;" />
<br>**<sub>Mike Lewis</sub>**](https://github.com/mtlewis)
<br>[📖](https://github.com/isomorphic-git/isomorphic-git/commits?author=mtlewis) [<img src="https://avatars.githubusercontent.com/u/1913805?v=4?s=60" alt="" width="60px;" />
<br>**<sub>Sam Verschueren</sub>**](https://twitter.com/SamVerschueren)
<br>[💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=SamVerschueren) [<img src="https://avatars.githubusercontent.com/u/9027363?v=4?s=60" alt="" width="60px;" />
<br>**<sub>Vitor Luiz Cavalcanti</sub>**](http://vitorluizc.github.io/)
<br>[📖](https://github.com/isomorphic-git/isomorphic-git/commits?author=VitorLuizC) [<img src="https://avatars.githubusercontent.com/u/4261788?v=4?s=60" alt="" width="60px;" />
<br>**<sub>Shane McLaughlin</sub>**](https://www.platformdemos.com/)
<br>[💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=mshanemc) [📖](https://github.com/isomorphic-git/isomorphic-git/commits?author=mshanemc) [⚠️](https://github.com/isomorphic-git/isomorphic-git/commits?author=mshanemc) [<img src="https://avatars.githubusercontent.com/u/2585460?v=4?s=60" alt="" width="60px;" />
<br>**<sub>Sean Poulter</sub>**](https://github.com/seanpoulter)
<br>[🚧](#maintenance-seanpoulter) [<img src="https://avatars.githubusercontent.com/u/84164531?v=4?s=60" alt="" width="60px;" />
<br>**<sub>araknast</sub>**](https://github.com/araknast)
<br>[💻](https://github.com/isomorphic-git/isomorphic-git/commits?author=araknast) [⚠️](https://github.com/isomorphic-git/isomorphic-git/commits?author=araknast) [📖](https://github.com/isomorphic-git/isomorphic-git/commits?author=araknast)

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

### Backers

Thank you to all our backers! 🙏 \[[Become a backer](https://opencollective.com/isomorphic-git#backer)\]

[![](https://opencollective.com/isomorphic-git/backers.svg?width=890)](https://opencollective.com/isomorphic-git#backers)

### Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. \[[Become a sponsor](https://opencollective.com/isomorphic-git#sponsor)\]

[![](https://opencollective.com/isomorphic-git/sponsor/0/avatar.svg)](https://opencollective.com/isomorphic-git/sponsor/0/website) [![](https://opencollective.com/isomorphic-git/sponsor/1/avatar.svg)](https://opencollective.com/isomorphic-git/sponsor/1/website) [![](https://opencollective.com/isomorphic-git/sponsor/2/avatar.svg)](https://opencollective.com/isomorphic-git/sponsor/2/website) [![](https://opencollective.com/isomorphic-git/sponsor/3/avatar.svg)](https://opencollective.com/isomorphic-git/sponsor/3/website) [![](https://opencollective.com/isomorphic-git/sponsor/4/avatar.svg)](https://opencollective.com/isomorphic-git/sponsor/4/website) [![](https://opencollective.com/isomorphic-git/sponsor/5/avatar.svg)](https://opencollective.com/isomorphic-git/sponsor/5/website) [![](https://opencollective.com/isomorphic-git/sponsor/6/avatar.svg)](https://opencollective.com/isomorphic-git/sponsor/6/website) [![](https://opencollective.com/isomorphic-git/sponsor/7/avatar.svg)](https://opencollective.com/isomorphic-git/sponsor/7/website) [![](https://opencollective.com/isomorphic-git/sponsor/8/avatar.svg)](https://opencollective.com/isomorphic-git/sponsor/8/website) [![](https://opencollective.com/isomorphic-git/sponsor/9/avatar.svg)](https://opencollective.com/isomorphic-git/sponsor/9/website)

## License

This work is released under [The MIT License](https://opensource.org/licenses/MIT)

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fisomorphic-git%2Fisomorphic-git.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fisomorphic-git%2Fisomorphic-git?ref=badge_large)