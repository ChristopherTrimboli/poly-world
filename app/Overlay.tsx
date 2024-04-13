"use client";

import { EcctrlJoystick } from "ecctrl";
import { useEffect, useState } from "react";

const Overlay = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(window?.navigator?.userAgent));
  }, []);

  return <>{isMobile && <EcctrlJoystick buttonNumber={1} />}</>;
};

export default Overlay;
