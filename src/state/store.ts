import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk"; // to handle async
import { ActionType } from "./action-types";
import reducers from "./reducers";
// import * as actionCreators from "./action-creators";

export const store = createStore(reducers, {}, applyMiddleware(thunk));

// MANUAL TESTING: try dipatch to call cellReducer.ts
store.dispatch({
  type: ActionType.INSERT_CELL_AFTER, // this is "action.type"
  payload: { id: null, type: "code" }, // this is "action.payload.type"
});
store.dispatch({
  type: ActionType.INSERT_CELL_AFTER, // this is "action.type"
  payload: { id: null, type: "text" }, // this is "action.payload.type"
});
store.dispatch({
  type: ActionType.INSERT_CELL_AFTER, // this is "action.type"
  payload: { id: null, type: "code" }, // this is "action.payload.type"
});
store.dispatch({
  type: ActionType.INSERT_CELL_AFTER, // this is "action.type"
  payload: { id: null, type: "text" }, // this is "action.payload.type"
});
store.dispatch({
  type: ActionType.INSERT_CELL_AFTER, // this is "action.type"
  payload: { id: null, type: "code" }, // this is "action.payload.type"
});
store.dispatch({
  type: ActionType.INSERT_CELL_AFTER, // this is "action.type"
  payload: { id: null, type: "text" }, // this is "action.payload.type"
});
// const deleteID = store.getState().cells.order[1];
// store.dispatch(actionCreators.updateCell(deleteID, "hello"));
// store.dispatch(actionCreators.moveCell(deleteID, "up"));

// console.log(store.getState());
