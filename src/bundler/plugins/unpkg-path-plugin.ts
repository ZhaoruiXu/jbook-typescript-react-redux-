import * as esbuild from "esbuild-wasm";

// execute this immediately
// (async () => {
//   await fileCache.setItem('color', 'red'); // saving data into indexDB database inside of client broswer

//   const color = await fileCache.getItem('color');
//   console.log(color);
// })()

export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      // handle root entry file of 'index.js'
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: "index.js", namespace: "a" };
        // we will hijack this path, which will load up the index.js file and use it for our path: `https://unpkg.com/${args.path}` down below
      });

      // handle relative paths in a module
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        // the "./" and "../" still means current directory and previous directory

        return {
          namespace: "a",
          // if the its "./" the path will append after the importer https://unpkg.com/medium-test-pkg/utils (an npm package stephen created)
          // if the its "../" the current directory will be replaced by the path (up one path) https://unpkg.com/utils (however this is just an example not an npm package that stephen created)
          path: new URL(args.path, "https://unpkg.com" + args.resolveDir + "/")
            .href, // we dont use args.importer anymore due to nested-test-package containing /scr folder or /dict folder etc
        };
      });

      // handle main file of a module
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        // onResolve step is to figure out what the actaul path is to an particular file, so we can override the path that esbuild is trying to find the file with
        return {
          namespace: "a",
          path: `https://unpkg.com/${args.path}`,
        };
      });
    },
  };
};

//////////////////////////////////////////////////////////////// His code ////////////////////////////////////////////////////////////////

// import * as esbuild from 'esbuild-wasm';
// import axios from 'axios';

// export const unpkgPathPlugin = () => {
//   return {
//     name: 'unpkg-path-plugin',
//     setup(build: esbuild.PluginBuild) {
//       build.onResolve({ filter: /.*/ }, async (args: any) => {
//         console.log('onResolve', args);
//         if (args.path === 'index.js') {
//           return { path: args.path, namespace: 'a' };
//         }

//         return {
//           namespace: 'a',
//           path: `https://unpkg.com/${args.path}`,
//         };

//         // else if (args.path === 'tiny-test-pkg') {
//         //   return {
//         //     path: 'https://unpkg.com/tiny-test-pkg@1.0.0/index.js',
//         //     namespace: 'a',
//         //   };
//         // }
//       });

//       build.onLoad({ filter: /.*/ }, async (args: any) => {
//         console.log('onLoad', args);

//         if (args.path === 'index.js') {
//           return {
//             loader: 'jsx',
//             contents: `
//               const message = require('medium-test-pkg');
//               console.log(message);
//             `,
//           };
//         }

//         const { data } = await axios.get(args.path);
//         return {
//           loader: 'jsx',
//           contents: data,
//         };
//       });
//     },
//   };
// };
