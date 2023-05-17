# Rewriting EasyStudy's frontend to React

As my semestral work for the NDBI021 User preferences course, I've decided to rewrite the frontend part of the EasyStudy project to React.

## Why?

In the beginning, I wanted to only add a simple UI feature or two. After seeing the state of the web app's implementation, however, I've felt like adding any features on top of the current application state would be only counterproductive - no feature I could think of was that useful and implementing anything I could think of would make the application's code super cluttered.

## Cluttered? 

The current implementation of the EasyStudy app uses Flask as the backend and Vue.js as the frontend library. This does not sound too wild - actually, it's a very sensible choice for an application like this. 

Unfortunately, the way these two interact together is not always ideal. Consider the following snippet:

```javascript
 window.app = new Vue({
        el: '#app',
        delimiters: ['[[',']]'], // Used to replace double { escaping with double [ escaping (to prevent jinja vs vue inference)
        data: function() {
            return {
              ...
              resultLayoutOptions: [
                { value: null, text: '{{select_result_layout}}' },
                { value: "rows", text: "{{rows}}" },
                { value: "row-single", text: "{{row_single}}" },
                { value: "row-single-scrollable", text: "{{row_single_scrollable}}" },
                { value: "columns", text: "{{columns}}" },
                { value: "column-single", text: "{{column_single}}" },
                { value: "max-columns", text: "{{max_columns}}" },
              ],
```

Parts of the client JavaScript code (inlined in the HTML template) are templated with Python variables (denoted by `{{ variable }}`). This is already quite nasty and opens **massive** backdoor for XSS attacks - imagine if someone made a user study with `select_result_layout` set to `"'}]}}}); mineBitcoin(); /**"`.  

> This is an actual problem - the application in it's current state is vulnerable to XSS attacks. 
>
> The problem (I've found) is with the customizable parts (footer...), which are not sanitized when rendered to the webpage - the only sanitization is done using the TinyMCE editor when the contents are sent to the server. Unfortunately, a malicious user can send an edited HTTP request manually, unescaping the `<script>` tags and causing havoc with such infected user study.

Aside from this problem - which could be potentially solved by Jinja's [sanitizing filter](https://jinja.palletsprojects.com/en/2.10.x/templates/#html-escaping) - this poses a big DX problem. With the template looking like this, it's not immediately clear, what are we looking at:

```html 
    <b-icon class="h2" :id="dataLoader.concat('_').concat(parameter.name).concat('_icon')" icon="question-circle-fill" variant="primary"></b-icon>
        <b-tooltip :target="dataLoader.concat('_').concat(parameter.name).concat('_icon')" triggers="hover">[[parameter.help]]</b-tooltip>
            </b-col>
            <b-col cols="1">
                [[parameter.name]]
            </b-col>
        <b-col>
```

This is an excerpt from one of the `fast_compare` templates, which is sent like this to the user - and only there, it's transformed (using the code from the first snippet) into valid HTML with all the `[[ var_name ]]` replaced by the actual JS variable values - and all the `<b-elements>` transformed into actual HTML elements, based on their declarations in the Bootstrap-Vue library, loaded from the CDN. This could possibly degrade SEO score as the search engine crawlers do not all run client side JS.

Because of this unorthodox interleaving of different libraries and languages in one file, it's not immediately obvious what data is coming from where - and - what makes it even worse, it makes it tough for the IDE to figure out what syntax highlighting it should be using.

<center>
<figure>
    <img src="https://imgs.xkcd.com/comics/bad_code.png"
         alt="Bad code - XKCD webcomic">
    <figcaption><a href="https://xkcd.com/1926/">xkcd.com/1926</a></figcaption>
</figure>
</center>

## So what now?

After assessing the situation, I've decided to rewrite the frontend part of the application using React. There's nothing wrong with Vue.js (and actually, using it would make the matter much easier, as the Vue.js code was already there), but I have never used it before - and in the time pressure of the last pre-deadline week, there was not much time to learn a completely new framework. Also (quoting the [2022 State of JS study](https://2022.stateofjs.com/en-US/libraries/front-end-frameworks/#front_end_frameworks_experience_linechart)), React is much more popular among developers, which should correlate with the number of maintained third-party libraries.

The rewrite itself was actually quite simple. Turning the current Flask backend server-side rendered implementation into a JSON API server for our React SPA app is as easy as replacing this:

```python
return render_template("compare_algorithms.html", **params)
```

Into this:

```python
return jsonify(params)
```

## Structure of the web app

The web application itself is a simple React app (created with the trusty `create-react-app` script) written in Typescript. The structure is following:

### `src/App.tsx`

The root component of the application. This React application uses **React Router** - a package which reads the current url from the address bar and renders the proper component based on that.
The `App.tsx` file contains the declaration of all the available routes in the application and their respective components. 

### `src/components`

Named with a severe lack of inspiration, this folder contains the "top level" components - think of a large top-level `<div>` element that contains the rest of the webpage. Using React Router's nested routes, the Layout component (from the `Layout.tsx` file) adds the top menu to all the pages (see how the `<Layout/>` component is referenced in the `App.tsx` file).

### `src/hooks`

For a regular user of React, this is nothing interesting - for anyone else, this looks like black magic. Both the files are probably write-and-forget:
- `useInterval()` is basically analogous to JS's `setInterval()`, only updated to match the React's component lifecycle.
- `useDebounce()` helps us to update a "debounced" only when the "source" value hasn't changed in the past `delay` ms. Very useful for search-while-typing components if you don't want to flood your API with one call per keystroke. 

### `src/routes`

This part of the codebase contains most of the actual components (imported in the `App.tsx` route declarations, remember?) Unfortunately, the names of the folders don't exactly match the routes from the `App.tsx` file - but they are close enough. 

### `src/utils`

This part contains non-component files exporting various utility functions. It's probably easier to `CTRL+F` to the place where it's used to see what exactly some of those functions are doing.

## What's new?

Aside from the rewrite itself, I've made only cosmetic changes to the application - UI updates here and there, some animations explaining the steps of the user study and some new copy. These are all only a result of me having fun - but at the same time, I do see the actual value of presenting the user with a friendly interface. It could be an interesting subject of a user study :).

## What's missing?

The current version of the React app is anything but finished. 
- During the rewrite frenzy, I've left out most of the reporting scripts (see `src/utils/reporting.ts`), 
- The editor for customizing the texts is not implemented. 
- Some components are referencing `data.movies`, `selected_movies`... when parsing data from the API calls. I've noticed this in the backend code as well - imo this is worth replacing with "items", as we can use other (non-movie) datasets as well.
- Only the fast-compare plugin's UI has been implemented - and is sitting in the frontend application's folder (instead of sharing the directory with the backend code, as it should). This is very simple to solve, see lower.
- Most likely a lot of other things I didn't think of :)

## FAQ

### How to provide new components for new plugins?

Because the React source code is still just a (Type|Java)Script module, you can easily create an npm package (`npm init`) in the plugin's folder, create the respective component there, export it (`export function PluginComponent`), and import it in the frontend web application `import { PluginComponent } from '../backend/plugins/PluginA/component'`. 

In order to simplify the import paths, you can also [add an alias](https://www.typescriptlang.org/tsconfig#paths) to the application's tsconfig.json file.
