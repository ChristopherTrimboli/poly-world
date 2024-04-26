import { useCallback, useMemo, useState } from "react";
import { ActionbarContext } from "./ActionbarContext";

const ActionbarProvider = ({ children }) => {
  const [activeBar, setActiveBar] = useState<string>("1");
  const [editType, setEditType] = useState<"add" | "subtract">("add");
  const [editSize, setEditSize] = useState<number>(1);

  const setActiveActionbar = useCallback((actionbar: string) => {
    setActiveBar(actionbar);
  }, []);

  const toggleEditType = useCallback(() => {
    setEditType((prev) => (prev === "add" ? "subtract" : "add"));
  }, []);

  const decreaseEditSize = useCallback(() => {
    setEditSize((prevEditSize) => Math.max(prevEditSize - 0.25, 0.25));
  }, []);

  const increaseEditSize = useCallback(() => {
    setEditSize((prev) => prev + 0.25);
  }, []);

  const activeBarValue = useMemo(() => {
    return {
      activeActionbar: activeBar,
      editType,
      editSize,
      setActiveActionbar,
      toggleEditType,
      decreaseEditSize,
      increaseEditSize,
    };
  }, [
    activeBar,
    editSize,
    editType,
    setActiveActionbar,
    toggleEditType,
    decreaseEditSize,
    increaseEditSize,
  ]);

  return (
    <ActionbarContext.Provider value={activeBarValue}>
      {children}
    </ActionbarContext.Provider>
  );
};

export default ActionbarProvider;
