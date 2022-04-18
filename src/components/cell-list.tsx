import { useTypedSelector } from "../hooks/use-typed-selector";
import CellListItem from "./cell-list-item";
// import { Cell } from "../state/"; // we want to avoid deep nested imports so we put all the exports togather
import AddCell from "./add-cell";
import { Fragment } from "react";

const CellList: React.FC = () => {
  // the "cells" state here is newly created(derived) from two pieces(data, order) of Redux Stored state "cells"
  // essentially, we take two pieces from stored "cells" and do some calcualtion or combination to make a new derived state also called "cells"
  const cells = useTypedSelector(({ cells: { data, order } }) => {
    return order.map(id => data[id]); // to return the list of cells in the right order
  });
  // console.log(cells);
  const renderedCells = cells.map((cell, index) => {
    return (
      // <></> or <Fragment></Fragment> is to replace <div></div> that you need to have in returning JSX(html inside of javascript)
      // since we need to put a unique key to each of the renderedCells, we have to import Fragment from react to have "key" prop for the component
      <Fragment key={index}>
        <CellListItem cell={cell} />
        <AddCell prevCellId={cell.id} />
      </Fragment>
    );
  });

  return (
    <div>
      <AddCell
        forceVisibility={cells.length === 0 ? true : false}
        prevCellId={null}
      />
      {renderedCells}
    </div>
  ); // JSX must return HTML can not just be "renderedCells"
};

export default CellList;
