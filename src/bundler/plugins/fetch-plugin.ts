import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localForage from "localforage"; // to make working with indexDB easier

const fileCache = localForage.createInstance({
  name: "filecache",
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      // we hijack the onLoad, so we know which file it's looking for, and just pass the our self-made content to it
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        // since we set the "entryPoints" to be "index.js" in index.tsx, this if statment will first entered, then we can hijack it with returing our own hard-coded contents, instead of letting esbuild accessing our local file system(which creates an error)
        // if esbuild is attempting load index.js, we will just stop its normal process(dont access the local hard drive, loading from the local file system)
        // we will load it for it (the return statement)
        return {
          // esbuild(onLoad part) returns parses the "contents" and sees we are requring "nested-test-pkg" and send this info to esbuild(onResolve part)
          //esbuild(onResolve part) then creats an object {path: "nested-test-pkg", import: "index.js"}, then turns it into {path: "https://unpkg.com/nested-test-pkg"} (NOTE: actual )
          // then pass the URL to esbuild(onLoad part) for fetching the URL using asyc axios
          loader: "jsx",
          // this is just first cycle hard-coded contents (only access once)
          //es module and common JS ways of import/export
          // `
          //     const React = require("react");
          //     import ReactDOM from "react-dom";
          //     console.log(React, ReactDOM);
          // `,
          contents: inputCode,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // this is "filter: /.*/" is for any files that are not ending with .index.js, if so it would enter into the onLoad above with filter: /(^index\.js$)/
        // check to see if we have already fetched this file
        // and if it is in the cache (checking if the key already exists in indexDB)
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        ); // only function can be assigned with a data type using "<>"

        // if it is, return(terminate) it immediately
        if (cachedResult) {
          return cachedResult; // this cachedResult is unknown date type so typescript is not happy, we need to return somthing that is defined by "interface OnLoadResult"
        }
      });

      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        // this is "filter: /.css$/" is for css files
        // else http get the data from the path
        const { data, request } = await axios.get(args.path);

        // check if the path URL ends($) with a ".css"
        // const fileType = args.path.match(/.css$/) ? 'css' : 'jsx';

        const escaped = data // these are JS regular expression https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Cheatsheet
          .replace(/\n/g, "") // replace any next lines so the whole file is one line
          .replace(/"/g, '\\"') // escape any double quotes
          .replace(/'/g, "\\'"); // escape any single quotes

        // if ends with ".css" then we need to hijack the esbuild again with hard-coded stuff
        // as esbuild cant output both js and css files at the same time
        // so we need to write js code to add css stuff
        const contents = `
                const style = document.createElement('style');
                style.innerText = '${escaped}';
                document.head.appendChild(style);
            `;

        const result: esbuild.OnLoadResult = {
          //an object can be assigned with a data type using ":" with a defined interface
          loader: "jsx",
          contents,
          resolveDir: new URL("./", request.responseURL).pathname,
        };
        // store reponse in cache
        await fileCache.setItem(args.path, result); // key(args.path) value(result) pair

        return result;
      });

      // onLoad is load up the file that the onResolve finds
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // this is "filter: /.*/" is for plain JS files
        // else http get the data from the path
        const { data, request } = await axios.get(args.path);

        // check if the path URL ends($) with a ".css"
        // const fileType = args.path.match(/.css$/) ? 'css' : 'jsx';

        // const escaped = data // these are JS regular expression https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Cheatsheet
        //     .replace(/\n/g, '') // replace any next lines so the whole file is one line
        //     .replace(/"/g, '\\"') // escape any double quotes
        //     .replace(/'/g, "\\'") // escape any single quotes

        // if ends with ".css" then we need to hijack the esbuild again with hard-coded stuff
        // as esbuild cant output both js and css files at the same time
        // so we need to write js code to add css stuff
        // const contents =
        // `
        //     const style = document.createElement('style');
        //     style.innerText = '${escaped}';
        //     document.head.appendChild(style);
        // `

        const result: esbuild.OnLoadResult = {
          //an object can be assigned with a data type using ":" with a defined interface
          loader: "jsx",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };
        // store reponse in cache
        await fileCache.setItem(args.path, result); // key(args.path) value(result) pair

        return result;
      });
    },
  };
};
