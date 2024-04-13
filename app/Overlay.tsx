"use client";

import { EcctrlJoystick } from "ecctrl";

const Overlay = () => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);

  return <>{isMobile && <EcctrlJoystick buttonNumber={1} />}</>;
};

export default Overlay;
