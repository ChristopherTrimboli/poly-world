import {
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Vector3 } from "three";
import Grenade from "./Grenade";
import { ActionbarContext } from "../context/actionbar/ActionbarContext";
import { EcctrlProps } from "../../ecctrl/Ecctrl";
import { RapierRigidBody } from "@react-three/rapier";

interface Grenade {
  throwPosition: Vector3;
  throwDirection: Vector3;
}

const GrenadesManager = ({
  ecctrlRef,
}: {
  ecctrlRef: MutableRefObject<EcctrlProps & RapierRigidBody>;
}) => {
  const [grenades, setGrenades] = useState<Grenade[]>([]);

  const { activeActionbar } = useContext(ActionbarContext);

  const handleThrowGrenade = useCallback(() => {
    if (activeActionbar !== "3") return;
    const characterPosition = ecctrlRef.current.translation();
    const characterRotation = ecctrlRef.current.rotation();

    // throw grenade outwards from character position and rotation...
    const throwPosition = new Vector3(
      characterPosition.x,
      characterPosition.y + 1,
      characterPosition.z
    );

    const throwDirection = new Vector3(
      Math.sin(characterRotation.y),
      0,
      Math.cos(characterRotation.y)
    ).multiplyScalar(10);

    setGrenades((prev) => [...prev, { throwPosition, throwDirection }]);
  }, [activeActionbar, ecctrlRef]);

  useEffect(() => {
    window.addEventListener("click", handleThrowGrenade);
    return () => {
      window.removeEventListener("click", handleThrowGrenade);
    };
  }, [handleThrowGrenade]);

  const disposeGrenade = useCallback(() => {
    setGrenades((prev) => prev.slice(1));
  }, []);

  return (
    <>
      {grenades.map(({ throwPosition, throwDirection }, index) => (
        <Grenade
          key={index}
          throwPosition={throwPosition}
          throwDirection={throwDirection}
          disposeGrenade={disposeGrenade}
        />
      ))}
    </>
  );
};

export default GrenadesManager;
