import {
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Vector3 } from "three";
import Grenade from "./Grenade";
import { ActionbarContext } from "../context/actionbar/ActionbarContext";
import { EcctrlProps } from "../../ecctrl/Ecctrl";
import { RapierRigidBody } from "@react-three/rapier";

const GrenadesManager = ({
  ecctrlRef,
}: {
  ecctrlRef: MutableRefObject<EcctrlProps & RapierRigidBody>;
}) => {
  const [grenades, setGrenades] = useState<Vector3[]>([]);
  const mousePositionRef = useRef({ x: 0, y: 0 });

  const { activeActionbar } = useContext(ActionbarContext);

  const updateMousePosition = useCallback((ev) => {
    mousePositionRef.current = { x: ev.clientX, y: ev.clientY };
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, [updateMousePosition]);

  const handleThrowGrenade = useCallback(() => {
    if (activeActionbar !== "3") return;
    const characterPosition = ecctrlRef.current.translation();
    const direction = new Vector3(
      mousePositionRef.current.x - characterPosition.x,
      mousePositionRef.current.y - characterPosition.y,
      0.5
    ).normalize();

    setGrenades((prev) => [
      ...prev,
      new Vector3(
        characterPosition.x + direction.x,
        characterPosition.y + direction.y,
        characterPosition.z + direction.z
      ),
    ]);
  }, [activeActionbar, ecctrlRef]);

  useEffect(() => {
    window.addEventListener("click", handleThrowGrenade);
    return () => {
      window.removeEventListener("click", handleThrowGrenade);
    };
  }, [handleThrowGrenade]);

  return (
    <>
      {grenades.map((position, index) => (
        <Grenade key={index} position={position} />
      ))}
    </>
  );
};

export default GrenadesManager;
