import { useFrame, useThree } from "@react-three/fiber";
import CameraControls from "camera-controls";
import { ACTION, PointerInput } from "camera-controls/dist/types";
import { FC, useEffect, useRef } from "react";
import { Box3, MathUtils, Matrix4, MOUSE, Quaternion, Raycaster, Sphere, Spherical, Vector2, Vector3, Vector4 } from 'three';

const subsetOfTHREE = {
    MOUSE, Vector2, Vector3, Vector4, Quaternion,
    Matrix4, Spherical, Box3, Sphere, Raycaster,
    MathUtils: {
        DEG2RAD: MathUtils.DEG2RAD,
        clamp: MathUtils.clamp,
    },
};

CameraControls.install({ THREE: subsetOfTHREE });

export const CamControls: FC = () => {
    const { camera, gl } = useThree();

    const cameraControlsRef = useRef<CameraControls | null>(new CameraControls(camera, gl.domElement));

    useFrame(({ scene }, delta) => {
        if (!cameraControlsRef.current) return;
        cameraControlsRef.current.update(delta);
        gl.render(scene, camera);
    });


    // const extractClientCoordFromEvent = (pointers: PointerInput[], out: Vector2) => {
    //     out.set(0, 0);
    //     pointers.forEach((pointer) => {
    //         out.x += pointer.clientX;
    //         out.y += pointer.clientY;
    //     });
    //     out.x /= pointers.length;
    //     out.y /= pointers.length;
    // }

    useEffect(() => {
        const cameraControls = cameraControlsRef.current;
        if (!cameraControls) return;
        cameraControls.setTarget(0, 10, 0);
        cameraControls.mouseButtons.right = CameraControls.ACTION.NONE;
        cameraControls.mouseButtons.middle = CameraControls.ACTION.NONE;
        cameraControls.mouseButtons.wheel = CameraControls.ACTION.ZOOM;
        cameraControls.mouseButtons.left = CameraControls.ACTION.ROTATE;
        cameraControls.touches.one = CameraControls.ACTION.ROTATE;
        cameraControls.touches.two = CameraControls.ACTION.TOUCH_ZOOM;
        cameraControls.touches.three = CameraControls.ACTION.NONE;

        cameraControls.setBoundary(new Box3(new Vector3(0, 0, -1), new Vector3(1, 1, 0)));

    }, [cameraControlsRef.current]);

    return <></>;
};
