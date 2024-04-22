import { useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { Circle, useKeyboardControls } from "@react-three/drei";
import { Controls } from "../types";
import { Canvas } from "@react-three/fiber";

const actionBarsConfig = [
  {
    label: "1",
    children: (
      <Canvas>
        <ambientLight intensity={1.75} />
        <Circle args={[3, 6, 6]}>
          <meshPhongMaterial
            attach="material"
            color="tan"
            flatShading
            specular={0x222222}
            shininess={5}
            wireframe
          />
        </Circle>
      </Canvas>
    ),
  },
  {
    label: "2",
    children: null,
  },
  {
    label: "3",
    children: null,
  },
  {
    label: "4",
    children: null,
  },
  {
    label: "5",
    children: null,
  },
  {
    label: "6",
    children: null,
  },
  {
    label: "7",
    children: null,
  },
  {
    label: "8",
    children: null,
  },
  {
    label: "9",
    children: null,
  },
  {
    label: "0",
    children: null,
  },
];

const ActionBar = ({ children, label, onClick, isActive }) => {
  return (
    <Box
      sx={{
        height: 60,
        width: 60,
        backgroundColor: `${
          isActive ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.1)"
        }`,
        backdropFilter: "blur(10px)",
        border: `2px solid ${
          isActive ? "rgba(255, 255, 255, 0.3)" : "transparent"
        }`,
        color: `${
          isActive ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 255, 255, 0.2)"
        }`,
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            position: "absolute",
            pl: 0.5,
            fontSize: "0.8rem",
          }}
        >
          {label}
        </Typography>
        {children}
      </Box>
    </Box>
  );
};

const Actionbars = () => {
  const [activeBar, setActiveBar] = useState<string>("1");

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
    if (action1Pressed) return setActiveBar("1");
    if (action2Pressed) return setActiveBar("2");
    if (action3Pressed) return setActiveBar("3");
    if (action4Pressed) return setActiveBar("4");
    if (action5Pressed) return setActiveBar("5");
    if (action6Pressed) return setActiveBar("6");
    if (action7Pressed) return setActiveBar("7");
    if (action8Pressed) return setActiveBar("8");
    if (action9Pressed) return setActiveBar("9");
    if (action0Pressed) return setActiveBar("0");
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
        {actionBarsConfig.map(({ label, children }) => (
          <ActionBar
            key={label}
            label={label}
            isActive={activeBar === label}
            onClick={() => setActiveBar(label)}
          >
            {children}
          </ActionBar>
        ))}
      </Stack>
    </Box>
  );
};

export default Actionbars;
