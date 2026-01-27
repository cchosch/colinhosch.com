"use client";
import { Environment, OrbitControls, OrthographicCamera, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas, CanvasProps, ThreeElements, useThree } from "@react-three/fiber";
import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { LensModel } from "../_LensScene/LensScene";

const TSAScene: FC<CanvasProps> = (p) => {
    const ortho = false;
    const orbital = true;

    const setTargetFocalLengthRef = useRef((_l: number) => {});
    const leave = () => setTargetFocalLengthRef.current(17);
    const enter = () => setTargetFocalLengthRef.current(70);



    return <Canvas {...p}>
            {!ortho && <PerspectiveCamera makeDefault position={[10, 0.75, 0]} fov={23.5} />}
            {ortho && <OrthographicCamera makeDefault position={[0, 0.9, 10]} scale={0.005}/>}
            {orbital && <OrbitControls/>}
            {/*}
            {*/}
            <ambientLight intensity={0.1} />
            <directionalLight position={[5, 3, 4]} intensity={1} />

            {/*}
            {*/}
            <Environment environmentIntensity={1} background={false} files={"/citrus_orchard_road_puresky_4k.hdr"}/>
            <LensModel />
            <TSAModel/>

            <InitCam orbital={orbital}/>
            {/*<LensModel setTargetFocalLength={setTargetFocalLengthRef}/>*/}
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

    }, [orbital, camera]);

    return <>
    </>;
};

const TSAModel:  FC<ThreeElements["group"]> = (p) => {
    const {scene} = useGLTF("./tsa/scanner/tsa_scanner.glb");

    return <primitive  object={scene} />;
    /*
    const { scene } = useThree();
    const model = useGLB("./tsa/scanner/tsa_scanner.glb");
    const [nodes, setNodes] = useState<{[key: string]: THREE.Mesh} | null>(null);
    const [lights, setLights] = useState<THREE.Object3D[]>([]);

    // const mat = new THREE.MeshBasicMaterial();
    const mat = useOverlayMaterial({
        textureUrl: "/tsa/scanner/analogic_texture.png",
        color: "#e2e2e2",
        metalness: 0.5,
        roughness: 0.5
    });
    const black = useMeshStandardMaterial({
        metalness: 0.45,
        roughness: 0.6,
        color: "#000",
    });

    useEffect(() => {
        const added = addTSALights();
        setLights(added);
        // scene.add(...added);

        return () => {
            // added.forEach(l => scene.remove(l));
        };
    }, [scene]);

    useEffect(() => {
        if(!model)
            return;
        const { scene: modelS } = model;

        const meshes: {[key: string]: THREE.Mesh} = {};

        modelS.traverse((obj) => {
            if("isMesh" in obj && obj instanceof THREE.Mesh) {
                let name = obj.name.charAt(0).toLowerCase() + obj.name.substring(1);
                for(let i = 0; i < name.length; i++) {
                    if(name.charAt(i) !== "_")
                        continue;
                    if(i === name.length-1)
                        name = name.substring(0, i);
                    else
                        name = name.substring(0, i) + capitalize(name.substring(i+1));
                }

                meshes[name] = obj;
            }
        });

        setNodes(meshes);
    }, [model]);

    if(!model || !nodes || mat.name === "loading")
        return;

    const {body, inner, bB, base, ends} = nodes;

    return <group {...p}>
        <mesh geometry={body.geometry} castShadow receiveShadow material={mat}></mesh>
        <mesh geometry={inner.geometry} castShadow receiveShadow>
            <meshStandardMaterial {...{
                metalness: 0.0,
                roughness: 0.6,
                color: "#222222",
            }}/>
        </mesh>

        {lights.map(l => {
            return <Fragment  key={l.id}/>;
            return <primitive object={l} key={l.id}/>;
        })}

        <mesh geometry={bB.geometry} castShadow receiveShadow material={black} />
        <group rotation={[0, Math.PI / 2, 0]} >
            {Object.entries(nodes).filter(([x, _]) => x.startsWith("flapPlane")).map(([_, cNode]) => {
                return <mesh key={cNode.id} geometry={cNode.geometry} castShadow receiveShadow>
                    <meshStandardMaterial color="#000000" side={THREE.DoubleSide}/>
                </mesh>;
            })}
        </group>
        <mesh geometry={base.geometry} castShadow receiveShadow material={black} />
        <mesh geometry={ends.geometry} castShadow receiveShadow>
            <meshStandardMaterial {...{
                color: "#A8CDE7",
                metalness: 0,
                roughness: 0.5

            }}/>
        </mesh>
    </group>;

    */
};


export default TSAScene;