"use client";
import * as THREE from "three";
import Environment from "@/components/Environment";
import { loadAllAssets, useAssetsFinished } from "@/util/AssetManager";
import { OrbitControls, OrthographicCamera, PerspectiveCamera } from "@react-three/drei";
import { Canvas, CanvasProps, useThree } from "@react-three/fiber";
import { FC, useEffect, useMemo, useRef } from "react";
import CameraModel from "./Models/Camera";
import { LensModel } from "./Models/Lens";
import LaptopModel from "./Models/Laptop";
import { bindLoadWait } from "@/util/loadingState";

const ItemScene: FC<CanvasProps & { item: "lens" | "camera" | "computer" }> = (p) => {
    const ortho = false;
    const orbital = false;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const setTargetFocalLengthRef = useRef((_l: number) => { });
    const leave = () => setTargetFocalLengthRef.current(17);
    const enter = () => setTargetFocalLengthRef.current(70);

    const firstFrame = useRef<() => void>(null);
    const id = useMemo(() => Math.floor(Math.random() * 16777215).toString(16), []);

    useEffect(() => {
        if (firstFrame.current === null) {
            firstFrame.current = bindLoadWait(`first_frame_${id}`, false);
        }

        loadAllAssets();
    }, []);


    const finished = useAssetsFinished();

    if (!finished)
        return <div style={p.style} className={p.className}></div>;

    return <div style={p.style} className={p.className}>
        {p.item === "computer" && <canvas ref={canvasRef} style={{ display: "none", position: "fixed", aspectRatio: "3074/1981", height: "40svh", top: "0", left: "0" }}></canvas>}
        <Canvas  {...p} style={undefined} className={undefined} >
            {!ortho && <PerspectiveCamera makeDefault position={[10, 0.75, 0]} fov={23.5} />}
            {ortho && <OrthographicCamera makeDefault position={[10, 0.9, 0]} scale={0.005} />}
            {orbital && <OrbitControls />}
            <ambientLight intensity={0.1} />
            <directionalLight position={[5, 3, 4]} intensity={2} />

            <Environment background={false} />

            <InitCam orbital={orbital} />

            {(() => {
                switch (p.item) {
                    case "lens":
                        return <LensModel />;
                    case "camera":
                        return <CameraModel />;
                    case "computer":
                        return <LaptopModel canvasRef={canvasRef} />;
                }
                return <></>;
            })()}
            <mesh onAfterRender={() => {
                if (firstFrame.current) {
                    firstFrame.current();
                    firstFrame.current = null;
                }
            }} position={[1, 0.75, 0]} rotation={[0, Math.PI / 2, 0]} scale={1} onPointerLeave={leave} onPointerEnter={enter}>
                <planeGeometry args={[2, 3.5]}></planeGeometry>
                <meshStandardMaterial color={"#ffffff"} transparent opacity={0} />
            </mesh>
        </Canvas>
    </div>;
};


const InitCam = ({ orbital }: { orbital: boolean }) => {
    const { camera } = useThree();

    useEffect(() => {

        if (!orbital)
            camera.lookAt(new THREE.Vector3(0, camera.position.y, 0));
    });

    return <></>;
};


export default ItemScene;