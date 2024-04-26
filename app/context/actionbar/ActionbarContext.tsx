import { createContext } from "react";

interface ActionbarContextType {
  activeActionbar: string;
  editType: "add" | "subtract";
  editSize: number;
  setActiveActionbar: (actionbar: string) => void;
  toggleEditType: () => void;
  decreaseEditSize: () => void;
  increaseEditSize: () => void;
}

export const ActionbarContext = createContext<ActionbarContextType>(null);
