import { useEffect, useState } from "react";
import { Box, Stack } from "@mui/material";
import { useKeyboardControls } from "@react-three/drei";
import { Controls } from "../types";

const actionBarsConfig = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

const ActionBar = ({ children, onClick, isActive }) => {
  return (
    <Box
      sx={{
        height: 50,
        width: 50,
        padding: 1,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        border: `1px solid ${isActive ? "white" : "transparent"}`,
        color: `${isActive ? "white" : "rgba(255, 255, 255, 0.5)"}`,
      }}    
      onClick={onClick}
    >
      {children}
    </Box>
  );
};

const Actionbars = () => {
  const [activeBar, setActiveBar] = useState(1);

  const action1Pressed = useKeyboardControls<Controls>(
    (state) => state.action1
  );
  const action2Pressed = useKeyboardControls<Controls>(
    (state) => state.action2
  );
  const action3Pressed = useKeyboardControls<Controls>(
    (state) => state.action3
  );
  const action4Pressed = useKeyboardControls<Controls>(
    (state) => state.action4
  );
  const action5Pressed = useKeyboardControls<Controls>(
    (state) => state.action5
  );
  const action6Pressed = useKeyboardControls<Controls>(
    (state) => state.action6
  );
  const action7Pressed = useKeyboardControls<Controls>(
    (state) => state.action7
  );
  const action8Pressed = useKeyboardControls<Controls>(
    (state) => state.action8
  );
  const action9Pressed = useKeyboardControls<Controls>(
    (state) => state.action9
  );
  const action0Pressed = useKeyboardControls<Controls>(
    (state) => state.action0
  );

  useEffect(() => {
    if (action1Pressed) return setActiveBar(1);
    if (action2Pressed) return setActiveBar(2);
    if (action3Pressed) return setActiveBar(3);
    if (action4Pressed) return setActiveBar(4);
    if (action5Pressed) return setActiveBar(5);
    if (action6Pressed) return setActiveBar(6);
    if (action7Pressed) return setActiveBar(7);
    if (action8Pressed) return setActiveBar(8);
    if (action9Pressed) return setActiveBar(9);
    if (action0Pressed) return setActiveBar(0);
  }, [
    action1Pressed,
    action2Pressed,
    action3Pressed,
    action4Pressed,
    action5Pressed,
    action6Pressed,
    action7Pressed,
    action8Pressed,
    action9Pressed,
    action0Pressed,
  ]);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        padding: 2,
        zIndex: 1000,
      }}
    >
      <Stack direction="row" spacing={1}>
        {actionBarsConfig.map((bar) => (
          <ActionBar
            key={bar}
            isActive={activeBar === bar}
            onClick={() => setActiveBar(bar)}
          >
            {bar}
          </ActionBar>
        ))}
      </Stack>
    </Box>
  );
};

export default Actionbars;
