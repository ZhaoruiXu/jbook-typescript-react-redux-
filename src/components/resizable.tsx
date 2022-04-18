import "./resizable.css"; // css file import always on top to make sure it will load first
import { ResizableBox, ResizableBoxProps } from "react-resizable";
import React, { useState, useEffect } from "react";

interface ResizableProps {
  direction: "horizontal" | "vertical";
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  let resizableProps: ResizableBoxProps;

  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [width, setWidth] = useState(window.innerWidth * 0.75);

  // only run once
  useEffect(() => {
    // add debouncing to improve the reszing performance (its currently lagging)
    let timer: any;
    if (timer) {
      clearTimeout(timer);
    }
    const listener = () => {
      timer = setTimeout(() => {
        setInnerHeight(window.innerHeight);
        setInnerWidth(window.innerWidth);
        // console.log(window.innerHeight, window.innerWidth);
        // console.log("hello", window.innerWidth * 0.75, width);
        if (window.innerWidth * 0.75 < width) {
          console.log("hello", window.innerWidth * 0.75, width);

          setWidth(window.innerWidth * 0.75);
        }
      }, 50); // this is to slow down the reaction time from the listener to make animation more smooth
    };
    window.addEventListener("resize", listener); // only added once and is always listening for resize events, until the <Resizable> is removed or deleted, which triggers the return {to remove the linstener}
    return () => {
      // this return is only triggered when un=mount happens, meaning the React Component is removed or deleted from the code-cell.tsx's return{}
      window.removeEventListener("resize", listener); // to clean up everytime before a new "addEventListener" is added, which slows down the performance
    };
  }, [width]); //  the "[]" here is for the useEffect to trigger upon on-mount of the React Component (Resizable in this case), means it only trigger one time when the App is first loaded up and <Resizable></Resizable> is displayed and used (mounted)
  // The dependency array will only be called first when the component is being mounted and second if the dependency in that array, which is "width", changes.

  // without useEffect can still achieve the same functionality, but its less efficient as we disregards React Components life cycle
  // const listener = () => {
  //   setInnerHeight(window.innerHeight);
  //   setInnerWidth(window.innerWidth);
  //   console.log(window.innerHeight, window.innerWidth);
  // };
  // window.addEventListener("resize", listener);

  if (direction === "horizontal") {
    resizableProps = {
      className: "resize-horizontal",
      minConstraints: [innerWidth * 0.2, Infinity], // these window.innerWidth values are set to intial window size(not dynamic),so we make it stateFul
      maxConstraints: [innerWidth * 0.75, Infinity], // x-axis to infinity(maxing the x space) y-axis space is whatever pixels obtianed from window API https://developer.mozilla.org/en-US/docs/Web/API/Window/innerHeight then we want 95% of the y-axis window real estate of user's broswer
      height: Infinity, // as wide as it can we dont care as it will automatically fit inside the constriants we set above
      width: width, //the origin is at top left innerWindow, this width is measured frmo left wall to the vertical handle bar
      resizeHandles: ["e"], // "east" is right hand side
      onResizeStop: (e, data) => {
        // sychronizing the vertical handle bar position (aka the "width")
        setWidth(data.size.width);
        console.log(data.size.width);
      },
    };
  } else {
    resizableProps = {
      // vertical (dragging horizontal bar up and down)
      minConstraints: [Infinity, 75],
      maxConstraints: [Infinity, innerHeight * 0.9], // x-axis to infinity(maxing the x space and doesnt care what the value is) y-axis space is whatever pixels obtianed from window API https://developer.mozilla.org/en-US/docs/Web/API/Window/innerHeight then we want 95% of the y-axis window real estate of user's broswer
      height: 300,
      width: Infinity,
      resizeHandles: ["s"], // "south" is bottom side
    };
  }
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax spread operator (...) to unpackage all the proeprties inside the resizableProps object
  // <ResizableBox
  // minConstraints={[Infinity, 75]}
  // maxConstraints={[Infinity, window.innerHeight * 0.9]} // x-axis to infinity(maxing the x space) y-axis space is whatever pixels obtianed from window API https://developer.mozilla.org/en-US/docs/Web/API/Window/innerHeight then we want 95% of the y-axis window real estate of user's broswer
  // height={300}
  // width={Infinity}
  // resizeHandles={["s"]}>{children}</ResizableBox>;
  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;
