import { useCallback, useMemo, useState } from "react";
import { ActionbarContext } from "./ActionbarContext";

const ActionbarProvider = ({ children }) => {
  const [activeBar, setActiveBar] = useState<string>("1");

  const setActiveActionbar = useCallback((actionbar: string) => {
    setActiveBar(actionbar);
  }, []);

  const activeBarValue = useMemo(() => {
    return {
      activeActionbar: activeBar,
      setActiveActionbar,
    };
  }, [activeBar, setActiveActionbar]);

  return (
    <ActionbarContext.Provider value={activeBarValue}>
      {children}
    </ActionbarContext.Provider>
  );
};

export default ActionbarProvider;
