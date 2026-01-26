"use client";
import { useOverlayMaterial } from "@/util/three";
import { Environment, MeshTransmissionMaterial, OrbitControls, OrthographicCamera, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas, CanvasProps, ThreeElements, useFrame, useThree } from "@react-three/fiber";
import { FC, RefObject, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { rotateLens, zoomOnHover } from "./animations";


const LensScene: FC<CanvasProps> = (p) => {
    const ortho = false;
    const orbital = false;

    const setTargetFocalLengthRef = useRef((_l: number) => {});
    const leave = () => setTargetFocalLengthRef.current(17);
    const enter = () => setTargetFocalLengthRef.current(70);

    return <Canvas  {...p}>
        {!ortho && <PerspectiveCamera makeDefault position={[10, 0.75, 0]} fov={23.5} />}
        {ortho && <OrthographicCamera makeDefault position={[10, 0.9, 0]} scale={0.005}/>}
        {orbital && <OrbitControls/>}
        <ambientLight intensity={0.1} />
        <directionalLight position={[5, 3, 4]} intensity={2} />

        <Environment files="/citrus_orchard_road_puresky_4k.hdr" background={false} />

        <InitCam orbital={orbital}/>

        <LensModel setTargetFocalLength={setTargetFocalLengthRef}/>
        <mesh position={[1, 0.75, 0]} rotation={[0, Math.PI /2, 0]} scale={1} onPointerLeave={leave} onPointerEnter={enter}>
            <planeGeometry args={[2, 3.5]}></planeGeometry>
            <meshStandardMaterial color={"#ffffff"} transparent opacity={0}/>
        </mesh>
    </Canvas>;
};

const InitCam = ({orbital}: {orbital: boolean}) => {
    const { camera } = useThree();

    useEffect(() => {

        if(!orbital)
            camera.lookAt(new THREE.Vector3(0, camera.position.y, 0));
    });

    return <></>;
};


//< transmission={1} ior={1.2} thickness={0.2} roughness={0} chromaticAberration={0.02} backside />
type LensModelProps = {
    setTargetFocalLength?: RefObject<(l: number) => void>
};

export const LensModel: FC<LensModelProps & ThreeElements["group"]> = (p) => {
    const zoomBarrelRef = useRef<THREE.Group>(null);
    const lensRef = useRef<THREE.Group>(null);
    const zoomRingRef = useRef<THREE.Group>(null);
    const { nodes } = useGLTF("./lens/tamron_17-70.glb") as any; // eslint-disable-line
    const texLoader = useMemo(() => new THREE.TextureLoader(), []);
    const mat = useOverlayMaterial({
        textureUrl: "/lens/tamron_texture.png",
        roughnessUrl: "/lens/TamronRoughness.png",
        metalnessUrl: "/lens/TamronMetalness.png",
        color: "#2b2b2b"
    }, texLoader);
    const numbersMat = useOverlayMaterial({
        textureUrl: "/lens/tamron-numbers_texture.png",
        color: "#2b2b2b",
        roughness: 0.5,
        metalness: 0.8
    }, texLoader);
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

    useFrame((_, _delta) => {
        rotateLens(lensRef);
        zoomOnHover(zoomRingRef, zoomBarrelRef, targetFocalLength, startHoverTime);
    });

    const RubberMat = new THREE.MeshStandardMaterial({ color: "#242425", metalness: 0, roughness: 0.9 });
    const ZoomMat = new THREE.MeshStandardMaterial({ color: "#2b2b2b", metalness: 0.5, roughness: 0.7 });

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


export default LensScene;