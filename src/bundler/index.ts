import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

let service: esbuild.Service;

const bundle = async (userCode: string) => {
  if (!service) {
    // if service is not started then start the service
    service = await esbuild.startService({
      worker: true,
      // go find the compiled binary in the public folder
      // wasmURL: "/esbuild-wasm" // this one stephen gave not really working in Win 10
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });
  }
  // the "service" is what we are going to use to actually bundle and transform, transport.
  // console.log(service);}
  try {
    const result = await service.build({
      entryPoints: ["index.js"], // we want the index.js to be first bundled
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(userCode)],
      //  the "define" is to get rid of console warning
      define: {
        "process.env.NODE_ENV": '"production"', // replacing process.env.NOD_ENV with the string "production" (the "" is needed otherwise its replaced by the variable prodcution)
        global: "window",
      },
    });
    return {
      code: result.outputFiles[0].text,
      err: "",
    };
  } catch (err: any) {
    return {
      code: "",
      err: err.message,
    };
  }
};

export default bundle;
