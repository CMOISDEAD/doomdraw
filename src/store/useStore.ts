import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IElement } from "../global";

interface Store {
  elements: IElement[];
  setElements: (
    action: ((prevState: IElement[]) => IElement[]) | IElement[],
  ) => void;
}

const useDrawStore = create<Store>()(
  persist(
    (set) => ({
      elements: [],
      setElements: (action) => {
        if (typeof action === "function") {
          set((state) => ({ elements: action(state.elements) }));
        } else {
          set({ elements: action });
        }
      },
    }),
    {
      name: "doomdraw-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useDrawStore;
