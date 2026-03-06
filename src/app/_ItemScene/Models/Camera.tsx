"use client";

import * as THREE from "three";
import { useRotateGroup } from "@/app/_ItemScene/Models/animations";
import { getAssets, queueAssets } from "@/util/AssetManager";
import { useRef } from "react";

const cameraAssets = {
    model: { kind: "gltf", url: "./models/camera.glb" },
} as const;

queueAssets(cameraAssets);

const CameraModel = () => {
    const assets = getAssets(cameraAssets);
    const cameraGroupR = useRef<THREE.Group>(null);

    useRotateGroup(cameraGroupR, {
        initRotate: {
        }
    });

    return <>
        <group position={[0, 0.5, 0]} ref={cameraGroupR} scale={0.25}>
            <primitive rotation={[-Math.PI / 16, 0, 0]} object={assets.model.scene} />
        </group>
    </>;
};

export default CameraModel;
