import { buildGLTFGraph, getAssets, queueAssets } from "@/util/AssetManager";
import * as THREE from "three";
import { useMeshStandardMaterial, useOverlayMaterial } from "@/util/three";
import { ThreeElements, useFrame } from "@react-three/fiber";
import { FC, RefObject, useEffect, useMemo, useRef } from "react";
import { useRotateGroup, zoomOnHover } from "@/app/_ItemScene/Models/animations";
import { MeshTransmissionMaterial } from "@react-three/drei";

type LensModelProps = {
    setTargetFocalLength?: RefObject<(l: number) => void>
};

export const lensAssets = {
  model: { kind: "gltf", url: "./models/lens/tamron_17-70.glb" },

  bodyTexture:  { kind: "texture", url: "/models/lens/tamron_texture.png" },
  bodyRoughness: { kind: "texture", url: "/models/lens/TamronRoughness.png" },
  bodyMetalness: { kind: "texture", url: "/models/lens/TamronMetalness.png" },

  numbersTexture: { kind: "texture", url: "/models/lens/tamron-numbers_texture.png" },
} as const;

queueAssets(lensAssets);


export const LensModel: FC<LensModelProps & ThreeElements["group"]> = (p) => {

    const assets = getAssets(lensAssets);
    const { nodes } = useMemo(() => buildGLTFGraph(assets.model), [assets]);

    const zoomBarrelRef = useRef<THREE.Group>(null);
    const lensRef = useRef<THREE.Group>(null);
    const zoomRingRef = useRef<THREE.Group>(null);
    const mat = useOverlayMaterial({
        map: assets.bodyTexture,
        roughnessMap: assets.bodyRoughness,
        metalnessMap: assets.bodyMetalness,
        color: "#2b2b2b"
    });

    const numbersMat = useOverlayMaterial({
        map: assets.numbersTexture,
        color: "#2b2b2b",
        roughness: 0.5,
        metalness: 0.8
    });

    // const rotationDir = useRef(1);
    const targetFocalLength = useRef(0);
    const startHoverTime = useRef(0);
    useEffect(() => {
        if(p.setTargetFocalLength) {
            p.setTargetFocalLength.current = (l: number) => {
                targetFocalLength.current = l;
            };
        }
    }, [p.setTargetFocalLength]);
    useRotateGroup(lensRef);

    useFrame((_, _delta) => {
        zoomOnHover(zoomRingRef, zoomBarrelRef, targetFocalLength, startHoverTime);
    });

    const RubberMat = useMeshStandardMaterial({ color: "#242425", metalness: 0, roughness: 0.9 });
    const ZoomMat = useMeshStandardMaterial({ color: "#2b2b2b", metalness: 0.5, roughness: 0.7 });

    const glassMat = useMemo(() =>
        <MeshTransmissionMaterial
            transmission={1}
            roughness={0.2}
            thickness={0.2}
            ior={1.2}
            chromaticAberration={0.07}
            backside
            transmissionSampler   // use main render target
        />, []);


    return <group  ref={lensRef} {...p}>
        {/* ORIGIN
        <mesh position={[0, 0, 0]} material={RubberMat}>
            <sphereGeometry args={[0.05, 32, 32]} ></sphereGeometry>
        </mesh>
        */}

        <group position={[0, -1, 0]}  scale={25.005}>
            <mesh position={[0, 0, 0]} geometry={nodes["Focus_Ring"].geometry} castShadow receiveShadow material={RubberMat}>
            </mesh>

            <group ref={zoomRingRef}>
                <mesh position={[0, 0, 0]} geometry={nodes["Zoom_Ring"].geometry} castShadow receiveShadow material={RubberMat} />
                <mesh position={[0, 0, 0]} geometry={nodes["Zoom_Ring_Metal"].geometry} castShadow receiveShadow material={numbersMat}>
                    {/*<meshStandardMaterial color="#2b2b2b" roughness={0.5} metalness={0.7} />*/}
                </mesh>
            </group>

            <group ref={zoomBarrelRef} position={[0, 0, 0]}>
                <mesh position={[0, 0, 0]} geometry={nodes["Zoom"].geometry} castShadow receiveShadow material={mat} />
                <mesh position={[0, 0, 0]} geometry={nodes["Sheild_Mount"].geometry} castShadow receiveShadow material={ZoomMat} />

                <mesh position={[0, 0, 0]} geometry={nodes["Aperature"].geometry} castShadow receiveShadow>
                    <meshStandardMaterial  color="#1b1b1b" metalness={0} roughness={1}/>
                </mesh>
                <mesh position={[0, 0, 0]} geometry={nodes["AperatureBlack"].geometry} castShadow receiveShadow>
                    <meshStandardMaterial  color="black" metalness={0} roughness={1}/>
                </mesh>

                <mesh position={[0, 0, 0]} geometry={nodes["Lens1"].geometry} castShadow receiveShadow>
                    {glassMat}
                </mesh>
                <mesh position={[0, 0, 0]} geometry={nodes["Lens2"].geometry} castShadow receiveShadow>
                    {glassMat}
                </mesh>
                <mesh position={[0, 0, 0]} geometry={nodes["Lens3"].geometry} castShadow receiveShadow>
                    {glassMat}
                </mesh>
            </group>

            <mesh scale={[1, 1, 1]} geometry={nodes.Barrel.geometry} castShadow receiveShadow material={mat} />
        </group>

    </group>;

};
