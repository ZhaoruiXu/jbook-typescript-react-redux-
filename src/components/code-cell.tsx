import "./code-cell.css";
import { useEffect } from "react";
import CodeEditor from "./code-editor";
import Preview from "./preview";
import Resizable from "./resizable";
import { Cell } from "../state";
import { useActions } from "../hooks/use-actions";
import { useTypedSelector } from "../hooks/use-typed-selector";

interface CodeCellProps {
  cell: Cell;
}
// This is one way decalring React Component
const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  // const [input, setInput] = useState(""); // replace by global state from Redux store
  // const [error, setError] = useState(""); // replace by global state from Redux store
  // const [code, setCode] = useState(""); // replace by global state from Redux store
  const { createBundle } = useActions();
  const { updateCell } = useActions(); // this is the global state from Redux store
  // const ref = useRef<any>(); // treated as a global stateFul variable as we need to use it in both "handleSubmit" and "startService" functions
  // we can also choose to use setState, but here we go with useRef (same thing in this application)

  // const startService = async () => {
  //   // gives esbuild the opportunity to fetch web-assembly bundle for the bindary that we place in the public directory
  //   ref.current =
  // };

  // useEffect(() =>
  //   // run the startService once when on-mount using "[]"(first load up)
  //   {
  //     startService();
  //     // we only going to use "build"(= bundling) and "transform"(= transpiling)
  //   }, []);

  // derive a new state from
  const bundle = useTypedSelector(state => state.bundles[cell.id]);

  // instead of using click to build code, we want to implement a 1 second pause auto-build function using useEffect
  useEffect(() => {
    if (!bundle) {
      createBundle(cell.id, cell.content);
      return;
    }

    const timer = setTimeout(async () => {
      createBundle(cell.id, cell.content);
    }, 750);

    return () => {
      clearTimeout(timer);
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cell.id, cell.content, createBundle]);

  // const handleSubmit = async () => {
  //   const output = await bundle(input);
  // setInput("");
  // to prevent user click on the submit button to quickly after loading up the page
  // because after the HTML is loaded up the "Service" might not be ready yet
  // if (!ref.current) {
  //   return; // terminate this onClick event with null
  // }
  // // // this transforming is async in nature so we will make the handleSubmit an async function
  // // const result = await ref.current.transform(input, {
  // //     loader: "jsx",
  // //     target: "es2015" //is going to handle taking advanced or fancy JavaScript syntax like spread syntax inside of an object, async, await ...etc
  // // })

  // const result =

  // console.log(result); // output: {warnings: Array(0), outputFiles: Array(1)}
  // outputFiles: Array(1)
  // 0:
  // contents: Uint8Array(49) [40, 40, 41, 32, 61, 62, 32, 123, 10, 32, 32, 47, 47, 32, 97, 58, 105, 110, 100, 101, 120, 46, 106, 115, 10, 32, 32, 99, 111, 110, 115, 111, 108, 101, 46, 108, 111, 103, 40, 49, 41, 59, 10, 125, 41, 40, 41, 59, 10, buffer: ArrayBuffer(49), byteLength: 49, byteOffset: 0, length: 49]
  // path: "<stdout>"
  // text: "(() => {\n  // a:index.js\n  console.log(1);\n})();\n"
  // setCode(output);

  // eval(result.outputFiles[0].text); // eval() is a built-in function in the browser to execute JS code in a string like 'const a = 1; console.log(a);',
  // };

  return (
    <Resizable direction='vertical'>
      <div
        style={{
          // the 10 px is for the vertical position resizing bar
          height: "calc(100% - 10px)",
          display: "flex",
          flexDirection: "row",
        }}>
        {/* the vertical bar which is used to adjust the horizontal size is inside of the vertical sizing bar*/}
        <Resizable direction='horizontal'>
          {/* this second <Resizable> only gives an east side handle bar to its chidlren element <CodeEditor>*/}
          <CodeEditor
            // the "value" here is equal to "getValue()", which returns a string
            onChangeToSync={value => {
              updateCell(cell.id, value);
            }}
            initialValue={cell.content}
          />
        </Resizable>
        {/* <textarea
        value={input} 
        onChange={e => setInput(e.target.value)}></textarea> */}
        {/* <div>
          <button onClick={handleSubmit}>Submit</button>
        </div> */}
        {/* this submit button is removed as we want to compile automatically after user has paused coding for a few seconds*/}
        {/* <pre></pre> will format code and make it look like code */}
        {/* <pre>{code}</pre> not using it anymore */}
        {/* <iframe></iframe> is used for embedded one html inside another html */}
        {/* Note: the "public" folder is accessible from URL like http://localhost:3000/test.html */}
        {/* this iframe is for displaying only, we dont want communication between parent and child */}
        <div className='progress-wrapper'>
          {!bundle || bundle.loading ? (
            <div className='progress-cover'>
              <progress className='progress is-small is-primary max="100"'>
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} err={bundle.error} />
          )}
        </div>
        {/* since bundle can be "undefined", therefore guard it to prevent Preview from crashing*/}

        {/* the "sandbox=''" blocks the communication between parent and child html */}
        {/* the "sandbox='allow-same-origin'" or does not have a "sandbox" attribute will allow the communication between parent and child html */}
        {/* AND make sure the frames(html files) are in the same domain(URL)&port(3000)&protocol(http vs https) */}
        {/* Since we try to load JS code with a <script> tag, we need to add sandbox="allow-scripts", which will execute a <script> tag and still disable communcation */}
        {/* scr vs srcDoc : scr is fetching a html file through URL and srcDoc is justing reading some HTML content in this index.tsx file*/}
      </div>
    </Resizable>
  );
};

export default CodeCell; // this is resonsible for one code editor and one preview window as we will allow users to add mutiply code-cells
