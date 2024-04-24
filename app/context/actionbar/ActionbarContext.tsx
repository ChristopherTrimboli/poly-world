import { createContext } from "react";

interface ActionbarContextType {
  activeActionbar: string;
  setActiveActionbar: (actionbar: string) => void;
}

export const ActionbarContext = createContext<ActionbarContextType>(null);
