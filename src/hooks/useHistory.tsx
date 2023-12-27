/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import useDrawStore from "../store/useStore";
import { IElement } from "../global";

const useHistory = () => {
  const {
    historyIndex,
    setHistoryIndex,
    history: elements,
    setElements,
  } = useDrawStore((state) => state);
  const [history, setHistory] = useState(elements);

  useEffect(() => {
    setElements(history);
  }, [history, setElements]);

  const setState = (
    action: IElement[] | ((value: IElement[]) => IElement[]),
    overwrite = false,
  ) => {
    const newState =
      typeof action === "function" ? action(history[historyIndex]) : action;
    if (overwrite) {
      const historyCopy = [...history];
      historyCopy[historyIndex] = newState;
      setHistory(historyCopy);
    } else {
      const updatedState = [...history].slice(0, historyIndex + 1);
      setHistory([...updatedState, newState]);
      setHistoryIndex((prevState) => prevState + 1);
    }
  };

  // HACK: this doesn't work with slide delete action.
  const deleteElement = (id: string) => {
    const actualCopy = [...history[historyIndex]];
    const filteredElements = actualCopy.filter((element) => element.id !== id);
    setHistory([...history, filteredElements]);
    setHistoryIndex((prevState) => prevState + 1);
  };

  const undo = () =>
    historyIndex > 0 && setHistoryIndex((prevState) => prevState - 1);

  const redo = () =>
    historyIndex < history.length - 1 &&
    setHistoryIndex((prevState) => prevState + 1);

  return {
    elements: history[historyIndex],
    setState,
    undo,
    redo,
    deleteElement,
  };
};

export default useHistory;
