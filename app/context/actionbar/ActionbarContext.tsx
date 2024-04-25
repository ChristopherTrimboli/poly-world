import { createContext } from "react";

interface ActionbarContextType {
  activeActionbar: string;
  editType: "add" | "subtract";
  setActiveActionbar: (actionbar: string) => void;
  toggleEditType: () => void;
}

export const ActionbarContext = createContext<ActionbarContextType>(null);
