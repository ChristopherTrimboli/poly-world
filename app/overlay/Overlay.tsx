"use client";

import { EcctrlJoystick } from "../../ecctrl/Ecctrl";
import { useEffect, useState } from "react";
import Actionbars from "./Actionbars";

const Overlay = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(window?.navigator?.userAgent));
  }, []);

  return (
    <>
      {isMobile && <EcctrlJoystick buttonNumber={1} />}
      <Actionbars />
    </>
  );
};

export default Overlay;
