import "./preview.css";
import { useEffect, useRef } from "react";

interface PreviewProps {
  code: string;
  err: string;
}

// the "code" is striped out JS code such as "(() => {\n  // a:index.js\n  console.log(1);\n})();\n"
const html = `
<html>
    <head></head>
    <body>
        <div id="root"></div>
        <script>
            // this is to show runtime errors 
            const handleError = (err) => {
              const root = document.getElementById("root");
              root.innerHTML = '<div style="color:red;"><h4>RunTime Error</h4>' + err + '</div>';
              throw err;
            }
            // to catch error from async functions
            window.addEventListener("error", (e) => {
              event.preventDefault(); // to make sure we dont print the err message twice as we want to use throw err in the handleError function
              handleError(e.error);
            });
            window.addEventListener('message', (event) => {
              try{
                  eval(event.data);
              } catch (err){
                handleError(err);
              }
            }, false);
        </script>
    </body>
</html>
`; // the "throw err" is for the error to show up in the inspector console in Chrome, otherwise the error is only shown in the iframe (another way is "console.error(err)")

const Preview: React.FC<PreviewProps> = ({ code, err }) => {
  const iframe = useRef<any>();

  // useEffect(() => {
  //   // to ensure before every execute of user's code, we reset the content(attribute) of the iframe
  //   iframe.current.srcdoc = html;
  //   setTimeout(() => {
  //     // delay to allow some time for the iframe listener to setup properly before the message is posted
  //     iframe.current.contentWindow.postMessage(code, "*"); // we use useRef as DOM element selector
  //   }, 50);
  // }, [code]); // useEffect triggers when "code and html" change state

  useEffect(() => {
    iframe.current.srcdoc = html;
  }, [code]);

  const loadHandler = () => {
    iframe.current.contentWindow.postMessage(code, "*");
  };

  return (
    <div className='preview-wrapper'>
      <iframe
        title='preview'
        ref={iframe}
        sandbox='allow-scripts'
        srcDoc={html}
        onLoad={loadHandler}
      />
      {/* this is to show compilation errors */}
      {err && <div className='preview-error'>{err}</div>}
    </div>
  );
};

export default Preview;
