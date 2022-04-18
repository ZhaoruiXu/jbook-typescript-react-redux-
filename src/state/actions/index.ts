import { ActionType } from "../action-types";
import { CellTypes } from "../cell";

export type CellDirection = "up" | "down";

export interface UpdateCellAction {
  type: ActionType.UPDATE_CELL; // you can put the "type" in the payload too but this is cleaner as we want things in the payload to be stateFul
  payload: {
    id: string;
    content: string;
  };
}

export interface DeleteCellAction {
  type: ActionType.DELETE_CELL;
  payload: string;
}

export interface MoveCellAction {
  type: ActionType.MOVE_CELL;
  payload: {
    //   so for this type of action, we want to know  which cell and what direction we are moving
    id: string;
    direction: CellDirection;
  };
}

export interface InsertCellAfterAction {
  type: ActionType.INSERT_CELL_AFTER;
  payload: { id: string | null; type: CellTypes };
}

export interface BundleStartAction {
  type: ActionType.BUNDLE_START;
  // which codecell, so the paylaod is id
  payload: string;
}

export interface BundleCompleteAction {
  type: ActionType.BUNDLE_COMPLETE;
  payload: { cellId: string; bundle: { code: string; err: string } };
}

// "type" is for group up "interfaces" here, but can also be used to define a property type "export type CellDirection = "up" | "down""
export type Action =
  | MoveCellAction
  | DeleteCellAction
  | InsertCellAfterAction
  | UpdateCellAction
  | BundleStartAction
  | BundleCompleteAction;
