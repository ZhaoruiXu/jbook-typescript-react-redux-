import "./cell-list-item.css";
// import { Cell } from "../state/cell"; // instead of import from this cell file directly
import { Cell } from "../state/"; // we want to avoid deep nested imports so we put all the exports togather
import TextEditor from "../components/text-editor";
import CodeCell from "./code-cell";
import ActionBar from "./action-bar";

interface CellListItemProps {
  cell: Cell;
}

const CellListItem: React.FC<CellListItemProps> = ({ cell }) => {
  let child: JSX.Element;
  if (cell.type === "code") {
    child = (
      <>
        <div className='action-bar-wrapper'>
          <ActionBar id={cell.id} />
        </div>
        <CodeCell cell={cell} />
      </>
    );
  } else {
    child = (
      <>
        <TextEditor cell={cell} />
        <ActionBar id={cell.id} />
      </>
    );
  }
  return <div className='cell-list-item'>{child}</div>;
};

export default CellListItem;
