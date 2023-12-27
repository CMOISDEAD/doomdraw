/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import useDrawStore from "../store/useStore";

const useHistory = () => {
  const {
    historyIndex: index,
    setHistoryIndex: setIndex,
    elements,
    setElements,
  } = useDrawStore((state) => state);
  const [history, setHistory] = useState(elements);

  useEffect(() => {
    setElements(history);
  }, [history, setElements]);

  const setState = (action: (value: any) => [], overwrite = false) => {
    const newState =
      typeof action === "function" ? action(history[index]) : action;
    if (overwrite) {
      const historyCopy = [...history];
      historyCopy[index] = newState;
      setHistory(historyCopy);
    } else {
      const updatedState = [...history].slice(0, index + 1);
      setHistory([...updatedState, newState]);
      setIndex((prevState) => prevState + 1);
    }
  };

  const undo = () => index > 0 && setIndex((prevState) => prevState - 1);

  const redo = () =>
    index < history.length - 1 && setIndex((prevState) => prevState + 1);

  return [history[index], setState, undo, redo];
};

export default useHistory;
