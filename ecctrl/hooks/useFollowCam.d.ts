import * as THREE from "three";
export declare const useFollowCam: (props: UseFollowCamProps) => {
    pivot: THREE.Object3D<THREE.Object3DEventMap>;
    followCam: THREE.Object3D<THREE.Object3DEventMap>;
    cameraCollisionDetect: (delta: number) => void;
    joystickCamMove: (movementX: number, movementY: number) => void;
};
export type UseFollowCamProps = {
    disableFollowCam?: boolean;
    disableFollowCamPos?: {
        x: number;
        y: number;
        z: number;
    };
    disableFollowCamTarget?: {
        x: number;
        y: number;
        z: number;
    };
    camInitDis?: number;
    camMaxDis?: number;
    camMinDis?: number;
    camInitDir?: {
        x: number;
        y: number;
    };
    camMoveSpeed?: number;
    camZoomSpeed?: number;
    camCollisionOffset?: number;
};
