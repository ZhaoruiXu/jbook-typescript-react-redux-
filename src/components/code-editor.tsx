import "./code-editor.css";
import "./syntax.css";
import { useRef } from "react";
import MonacoEditor, { EditorDidMount } from "@monaco-editor/react"; // EditorDidMount is a type definition file, not a function
import prettier from "prettier";
import parser from "prettier/parser-babel";
import codeShift from "jscodeshift";
import Highlighter from "monaco-jsx-highlighter";
// import parse from "@babel/parser";
// import traverse from "@babel/traverse";
// import editor from "@type";

interface CodeEditorProps {
  initialValue: string;
  onChangeToSync(value: string): void; // dont need to return anything so we use "void"
}

// ": React.FC<CodeEditorProps>" is typeScript type assigning
const CodeEditor: React.FC<CodeEditorProps> = ({
  initialValue,
  onChangeToSync,
}) => {
  const editorRef = useRef<any>(); // to use as a gloal referencing tool
  const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
    editorRef.current = monacoEditor; // so we can use this monacoEditor param outside of the function
    monacoEditor.onDidChangeModelContent(() => {
      onChangeToSync(getValue()); // pass this getValue using props.onChangeToSync(props.getValue()) to the index.jsx to update input using setInput
    });

    monacoEditor.getModel()?.updateOptions({ tabSize: 2 });

    // add jsx syntax highlighting
    const highlighter = new Highlighter(
      // @ts-ignore
      window.monaco,
      codeShift,
      monacoEditor
    );
    highlighter.highLightOnDidChangeModelContent(
      () => {},
      () => {},
      undefined,
      () => {}
    );
  };

  const onFormatClick = () => {
    // get current value from editor(so need to READ the "getValue")
    const unformatted = editorRef.current.getModel().getValue();
    // format that value(using prettier and parser)
    const formatted = prettier
      .format(unformatted, {
        parser: "babel",
        plugins: [parser],
        useTabs: true,
        singleQuote: true,
      })
      .replace(/\n$/, ""); // replace the new line with an empty string so we prevent a new line gets created when "format" is clicked
    // JS Regualr Expression($ end of \n linefeed) https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Cheatsheet
    // set the formatted value back in the editor(so need to SET the value using "monacoEditor" and in order to use "monacoEditor", we need to use useRef)
    editorRef.current.setValue(formatted);
  };

  return (
    <div className='editor-wrapper'>
      <button
        className='button button-format is-primary is-small'
        onClick={onFormatClick}>
        Format
      </button>
      <MonacoEditor
        editorDidMount={onEditorDidMount}
        value={initialValue} // this "value" is actual just a intial value(doenst not stick) but Monaco doesnt call it that way
        theme='dark'
        language='javascript'
        height='100%'
        options={{
          // ctr + click to see the definition of all the options here
          wordWrap: "on",
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
