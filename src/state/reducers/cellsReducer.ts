import { ActionType } from "../action-types";
import { Action } from "../actions";
import { Cell } from "../cell";
import produce from "immer";

// interface is almost like a JS object with key value pair, but the value here is actaul type definition instead of value
// thus, we can apply this interface to an actual object to define the value types
interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[]; // an array of strings
  data: { [key: string]: Cell }; // a REGULAR object containing key(an array of ids or keys) value(Cell obejct{id/type/content}) pair
}
// for example here !
const initialState: CellsState = {
  loading: false, // yes/no
  error: null, // error message
  order: [], // just data ids in a array to obtain the order
  data: {}, // this object is used for key pair (id pairing Cell)
};

const reducer = produce(
  (
    state: CellsState = initialState, // this is just useReducer way of holding and updating stateFul things (no more setState(), have to use spread operator or immer to simplify spread operator)
    action: Action //dispatch will call reducer and associate the type of action with the upcoming reducer call
    //   the return value type must match CellsState (not needed after utilizing immer lib)
  ) => {
    switch (action.type) {
      case ActionType.UPDATE_CELL:
        const { id, content } = action.payload;
        // DUE TO IMMUTABILITY, we can not modify the original  object using const object1 = a new value, we have to use spread operator to modify a copy(cloning) of the original  and assigning to a new object
        // https://immerjs.github.io/immer/
        // Generally speaking, these benefits can be achieved by making sure you never change any property of an object, array or map, but by always creating an altered copy instead. In practice this can result in code that is quite cumbersome to write(example below with spread operator), and it is easy to accidentally violate those constraints. Immer will help you to follow the immutable data paradigm by addressing these pain points:
        // const newCellState = {
        //   // this is saying we want to keep state object's property intact and update the data property
        //   // then we tap into data property then we want to update the one of the cells inside the data property
        //   // then we tap into the id of the cell we want to update, then we eventually update the "content" property of the cell we targeted
        //   ...state,
        //   data: {
        //     ...state.data,
        //     [id]: {
        //       ...state.data[id],
        //       content,
        //     },
        //   },
        // };
        // return newCellState;

        // instead of this complicated way of updating state(object mutation) with spread operator, we just utilize a npm lib (produce https://immerjs.github.io/immer/update-patterns) to take care of it
        state.data[id].content = content;
        return state; // and we now dont need to return anything, but just need to put return there for the switch statement

      case ActionType.DELETE_CELL:
        const { payload } = action;
        delete state.data[payload];
        // both .filter and .findIndex will work, but .filter has shorter code
        // const index = state.order.findIndex(
        //   itemId => itemId === action.payload
        // );
        // if (index) {
        //   state.order.splice(index, 1);
        // }
        state.order = state.order.filter(itemId => itemId !== payload); // action.payload for this deleteCell only has "id", not the same the action.payload for updateCell
        return state;

      case ActionType.MOVE_CELL:
        const { direction } = action.payload;
        const index = state.order.findIndex(
          itemId => itemId === action.payload.id
        );
        // determine the target index by looking at "up" or "down"
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        // out of bound conditions upper and lower bounds
        if (targetIndex < 0 || targetIndex > state.order.length - 1) {
          return state;
        }
        //  simple swapping logic(only swappign with adjacent element(id))  Note: id here is NOT equal array index
        state.order[index] = state.order[targetIndex]; // assign the original id on targetIndex to Index((the place we move from)
        state.order[targetIndex] = action.payload.id; // THIS IS THE ACTUAL MOVE ... assign new id (which is the orignal id on Index) to the targetIndex(new index )
        // Note: the original state.order[index] = action.payload.id;
        return state;

      case ActionType.INSERT_CELL_AFTER: {
        // wrapping this case in {} as we have another const index defined here. It needs to be another block-level (one const variable in on block)
        const { type } = action.payload;
        // state.data[id].id = id;
        // state.data[id].type = type;
        // state.data[id].content = "";
        const newCell: Cell = {
          id: randomID(), // randomly generate this id in string
          type,
          content: "",
        };
        state.data[newCell.id] = newCell; // add a brand cell to the data object {[]:Cell} = {1:Cell1, 2:Cells ...}, note the Cell is a object
        const index = state.order.findIndex(
          // find the index of the existing cell id user clicked
          itemId => itemId === action.payload.id // this id is the targeted id that you want to insert a new cell before this id (from payload, not the newly random generated id)
        );
        if (index === -1) {
          // if the found index is null then .findIndex() return a "-1" (when you add to the end, the index is out of bound so not existing)
          //this is the corner case where we want to add a new cell to the end of the cells list intead of always before a existing cell
          // the foundIndex is null (findIndex returns -1)
          state.order.unshift(newCell.id); // add the element to the start of array by using .unshift(), .push() to the end of the array
        } else {
          state.order.splice(index + 1, 0, newCell.id); //.splice(index, #ofitems to be remove at the index, item1,item2,.. to be added BEFORE the index), therethere, we want to add AFTER, we need to add 1 to the reference index
          // note: when you add a new id on a existing index(not out of bound) the existing element and its following elment all get push back in index number
        }
        return state;
      }

      default:
        return state;
    }
  }
);

const randomID = () => {
  // toString(36) is based 36, which is 0-9 and a-Z https://stackoverflow.com/questions/37159703/why-is-tostring-range-limited-to-36
  return Math.random().toString(36).substr(2, 5);
};

export default reducer;
