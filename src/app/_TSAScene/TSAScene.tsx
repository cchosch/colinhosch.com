"use client";
import { useOverlayMaterial } from "@/util/three";
import { Environment, OrbitControls, OrthographicCamera, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas, CanvasProps, ThreeElements, useThree } from "@react-three/fiber";
import { FC, Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { LensModel } from "../_LensScene/LensScene";
import { addTSALights } from "./init";

const TSAScene: FC<CanvasProps> = (p) => {
    const ortho = false;
    const orbital = true;

    const setTargetFocalLengthRef = useRef((_l: number) => {});
    const leave = () => setTargetFocalLengthRef.current(17);
    const enter = () => setTargetFocalLengthRef.current(70);

    return <Canvas {...p}>
        <Suspense fallback={null}>
            {!ortho && <PerspectiveCamera makeDefault position={[10, 0.75, 0]} fov={23.5} />}
            {ortho && <OrthographicCamera makeDefault position={[0, 0.9, 10]} scale={0.005}/>}
            {orbital && <OrbitControls/>}
            {/*}
            {*/}
            <ambientLight intensity={0.1} />
            <directionalLight position={[5, 3, 4]} intensity={2} />

            <Environment environmentIntensity={1} files="/citrus_orchard_road_puresky_4k.hdr" background={false} />


            <InitCam orbital={orbital}/>
            <LensModel />

            <TSAModel/>
            {/*<LensModel setTargetFocalLength={setTargetFocalLengthRef}/>*/}
            <mesh position={[1, 0.75, 0]} rotation={[0, Math.PI /2, 0]} scale={1} onPointerLeave={leave} onPointerEnter={enter}>
                <planeGeometry args={[2, 3.5]}></planeGeometry>
                <meshStandardMaterial color={"#ffffff"} transparent opacity={0}/>
            </mesh>
        </Suspense>
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


const TSAModel: FC<ThreeElements["group"]> = (p) => {
    const { scene } = useThree();
    const { nodes } = useGLTF("./tsa/scanner/tsa_scanner.glb") as any; // eslint-disable-line
    const mat = useOverlayMaterial({
        textureUrl: "/tsa/scanner/analogic_texture.png",
        color: "#e2e2e2",
        metalness: 0.5,
        roughness: 0.5
    });
    const black = <meshStandardMaterial {...{
        metalness: 0.45,
        roughness: 0.6,
        color: "#000",
    }}/>;

    useEffect(() => {
        const added = addTSALights();
        scene.add(...added);

        return () => {
            added.forEach(l => scene.remove(l));
        };

    }, [scene]);

    console.log(Object.keys(nodes));

    return <group {...p}>
        <mesh geometry={nodes["Body"].geometry} castShadow receiveShadow material={mat}></mesh>
        <mesh geometry={nodes["Inner"].geometry} castShadow receiveShadow>
            <meshStandardMaterial {...{
                metalness: 0.0,
                roughness: 0.6,
                color: "#222222",
            }}/>
        </mesh>
        <mesh geometry={nodes["BB"].geometry} castShadow receiveShadow>
            {black}
        </mesh>
        <group rotation={[0, Math.PI / 2, 0]} >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(v => {
                let p = "FlapPlane";
                if(v > 0)
                    p+="0"+v.toString().padStart(2, "0");
                return <mesh key={p} geometry={nodes[p].geometry} castShadow receiveShadow>
                    <meshStandardMaterial color="#000000" side={THREE.DoubleSide}/>
                </mesh>;
            })}
            
        </group>
        <mesh geometry={nodes["Base"].geometry} castShadow receiveShadow>
            {black}
        </mesh>
        <mesh geometry={nodes["Ends"].geometry} castShadow receiveShadow>
            <meshStandardMaterial {...{
                color: "#A8CDE7",
                metalness: 0,
                roughness: 0.5

            }}/>
        </mesh>


    </group>;

};


export default TSAScene;