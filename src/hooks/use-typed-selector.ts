import { useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState } from "../state";

// to access any state inside a component and this useTypedSelector is going to know the type of data is stored
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
