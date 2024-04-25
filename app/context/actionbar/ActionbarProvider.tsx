import { useCallback, useMemo, useState } from "react";
import { ActionbarContext } from "./ActionbarContext";

const ActionbarProvider = ({ children }) => {
  const [activeBar, setActiveBar] = useState<string>("1");
  const [editType, setEditType] = useState<"add" | "subtract">("add");

  const setActiveActionbar = useCallback((actionbar: string) => {
    setActiveBar(actionbar);
  }, []);

  const toggleEditType = useCallback(() => {
    setEditType((prev) => (prev === "add" ? "subtract" : "add"));
  }, []);

  const activeBarValue = useMemo(() => {
    return {
      activeActionbar: activeBar,
      editType,
      setActiveActionbar,
      toggleEditType,
    };
  }, [activeBar, editType, setActiveActionbar, toggleEditType]);

  return (
    <ActionbarContext.Provider value={activeBarValue}>
      {children}
    </ActionbarContext.Provider>
  );
};

export default ActionbarProvider;
