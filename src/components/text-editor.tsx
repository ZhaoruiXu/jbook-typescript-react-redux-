import "./text-editor.css";
import MDEditor from "@uiw/react-md-editor";
import { useState, useEffect, useRef } from "react";
import { Cell } from "../state";
import { useActions } from "../hooks/use-actions";
// export default function App() {
//   const [value, setValue] = React.useState("**Hello world!!!**");
//   return (
//     <div className='container'>
//       <MDEditor value={value} onChange={setValue} />
//       <MDEditor.Markdown source={value} />
//     </div>
//   );
// }
interface TextEditorProps {
  cell: Cell;
}

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  const insideDiv = useRef<HTMLDivElement | null>(null);
  // const grammarltRef = useRef<HTMLDivElement | null>("grammarly-extension")
  const [editing, setEditing] = useState(false);
  // const [value, setValue] = useState("# Header"); // replacing this local state with Redux's global state
  const { updateCell } = useActions(); // this is our global state to replace the const [value, setValue] = useState("# Header");

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (
        insideDiv.current &&
        e.target &&
        insideDiv.current.contains(e.target as Node) // as contains() only accept type Node | null, and e.target is type EventTarget so we need to tell TypeScript "dont worry this makes sense" by adding "as Node"
      ) {
        console.log("inside editor");

        setEditing(true); //enable editing by expand the text area
        return;
      }
      console.log("not inside editor");
      // console.log(e.target);
      setEditing(false); // retract the text area
    };
    document.addEventListener("click", listener, { capture: true });
    return () => {
      document.removeEventListener("click", listener, { capture: true });
    };
  }, []); // run one time (the time the <TextEditor> first appears on the screen)
  if (editing) {
    return (
      // this is the editing view
      <div className='text-editor' ref={insideDiv}>
        <MDEditor
          value={cell.content}
          onChange={v => {
            updateCell(cell.id, v || ""); // if v(value) is undefined just set to a empty string
          }}
        />
      </div>
    );
  }
  return (
    // this is the preview view
    <div className='text-editor card' onClick={() => setEditing(true)}>
      <div className='card-content'>
        <MDEditor.Markdown source={cell.content || "Click to edit it"} />
      </div>
    </div>
  );
};

export default TextEditor;
