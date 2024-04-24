import { useContext, useEffect } from "react";
import { Box, Stack, Tooltip, Typography } from "@mui/material";
import { Circle, useKeyboardControls } from "@react-three/drei";
import { Controls } from "../types";
import { Canvas } from "@react-three/fiber";
import { ActionbarContext } from "../context/actionbar/ActionbarContext";

const actionBarsConfig = [
  {
    label: "1",
    description: "Sphere Tool",
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

const ActionBar = ({ children, label, description, onClick, isActive }) => {
  return (
    <Tooltip title={description}>
      <Box
        sx={{
          height: 60,
          width: 60,
          transition: "all 0.2s",
          backgroundColor: `${
            isActive ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.2)"
          }`,
          backdropFilter: "blur(10px)",
          border: `2px solid ${
            isActive ? "rgba(255, 255, 255, 0.4)" : "transparent"
          }`,
          color: `${
            isActive ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 255, 255, 0.2)"
          }`,
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          },
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
    </Tooltip>
  );
};

const Actionbars = () => {
  const { activeActionbar, setActiveActionbar } = useContext(ActionbarContext);

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
    if (action1Pressed) return setActiveActionbar("1");
    if (action2Pressed) return setActiveActionbar("2");
    if (action3Pressed) return setActiveActionbar("3");
    if (action4Pressed) return setActiveActionbar("4");
    if (action5Pressed) return setActiveActionbar("5");
    if (action6Pressed) return setActiveActionbar("6");
    if (action7Pressed) return setActiveActionbar("7");
    if (action8Pressed) return setActiveActionbar("8");
    if (action9Pressed) return setActiveActionbar("9");
    if (action0Pressed) return setActiveActionbar("0");
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
    setActiveActionbar,
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
        {actionBarsConfig.map(({ label, description, children }) => (
          <ActionBar
            key={label}
            label={label}
            description={description}
            isActive={activeActionbar === label}
            onClick={() => setActiveActionbar(label)}
          >
            {children}
          </ActionBar>
        ))}
      </Stack>
    </Box>
  );
};

export default Actionbars;
