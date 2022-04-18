import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state";
import { useMemo } from "react";

export const useActions = () => {
  const dispatch = useDispatch();

  // useMemo to only bind the actionCreator and the dispatch once
  return useMemo(() => {
    return bindActionCreators(actionCreators, dispatch);
  }, [dispatch]); // the dependency items only need to a variable defined inside the component(i.e useActions) or a prop. "actionCreators" doesnt need to be included as its imported
};
