import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IElement } from "../global";

interface Store {
  historyIndex: number;
  elements: IElement[][];
  setElements: (action: IElement[][]) => void;
  setHistoryIndex: (action: (prevState: number) => number) => void;
}

const useDrawStore = create<Store>()(
  persist(
    (set) => ({
      historyIndex: 0,
      elements: [[]],
      setElements: (action) => set({ elements: action }),
      setHistoryIndex: (action) =>
        set((state) => ({ historyIndex: action(state.historyIndex) })),
    }),
    {
      name: "doomdraw-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useDrawStore;
