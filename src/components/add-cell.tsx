import "./add-cell.css";
import { useActions } from "../hooks/use-actions";

interface AddCellProps {
  prevCellId: string | null;
  forceVisibility?: boolean; // make this prop optional by adding ?, as we dont want to add this to all the <AddCell></AddCell> components
}

const AddCell: React.FC<AddCellProps> = ({ prevCellId, forceVisibility }) => {
  const { insertCellAfter } = useActions();
  return (
    <div className={`add-cell ${forceVisibility && "force-visible"}`}>
      <button
        className='button is-rounded is-primary is-small'
        onClick={() => insertCellAfter(prevCellId, "code")}>
        <span className='icon is-small'>
          <i className='fa fa-plus' />
        </span>
        <span>Code</span>
      </button>
      <button
        className='button is-rounded is-primary is-small'
        onClick={() => insertCellAfter(prevCellId, "text")}>
        <span className='icon is-small'>
          <i className='fa fa-plus' />
        </span>
        <span>Text</span>
      </button>
      <div className='divider'></div>
    </div>
  );
};

export default AddCell;
