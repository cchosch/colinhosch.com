"use client"

import * as THREE from "three";
import { useRotateGroup } from "@/app/_ItemScene/Models/animations";
import { getAssets, queueAssets } from "@/util/AssetManager";
import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";

const cameraAssets = {
    model: { kind: "gltf", url: "./models/laptop/mbp.glb" },
} as const;
queueAssets(cameraAssets);

const LaptopModel = () => {
    const assets = getAssets(cameraAssets);
    const cameraGroupR = useRef<THREE.Group>(null);
    const t = useThree();
    useEffect(() => {
        console.log(assets.model.scene.getObjectByName("ScreenSheet"));
    }, []);

    useRotateGroup(cameraGroupR, {
        initZRotate: -Math.PI / 8
    });

    return <>
        <group position={[0, -0.2, 0]} ref={cameraGroupR} scale={9.5}>
            <primitive object={assets.model.scene} />
        </group>
    </>;
};

export default LaptopModel;
