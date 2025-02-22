"use client";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/Addons.js";

const CrtScene = () => { 

    return <div>
        <Canvas camera={{position: [5, 0, 0], fov: 80}} style={{height: "100vh"}}>
            <ambientLight intensity={Math.PI / 4}/>
            <spotLight intensity={Math.PI * 2} position={[5, 0, 0]} lookAt={[0, 0, 0]}></spotLight>
            <CrtMonitor/>
            <OrbitControls/>
            
        </Canvas>

    </div>;
};

const CrtMonitor = () => {
    const screenRef = useRef<THREE.Mesh>(null);
    const [textTexture, setTextTexture] = useState<THREE.CanvasTexture | null>(null);
    const canvasRef = useRef(document.createElement("canvas"));
    const geom = useLoader(STLLoader, "/crt.stl");
    const {camera} = useThree();
    const meshRef = useRef<THREE.Mesh>(null);
    useEffect(() => {
        if(meshRef.current) {

            camera.lookAt(new THREE.Vector3(0, 0, 0));
        }
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 2000;
        canvas.height = 2000;
        const ctx = canvas.getContext("2d");
        if(!ctx) {

            console.log("NO CANVAS");
            return;
        }

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const texture = new THREE.CanvasTexture(canvas);
        setTextTexture(texture);

        const codeText = [""];
        const fullCode = `function hello() {\n  console.log('Hello, world!');\n}`;
        let readIndex = 0;

        function animateTyping() {
            if(!ctx)
                return;
            if (readIndex < fullCode.length) {
                const writeIndex = codeText.length-1;
                if(fullCode[readIndex] === "\n") {
                    codeText.push("");
                }
                codeText[writeIndex] += fullCode[readIndex];
                readIndex++;
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "white";
                ctx.font = "50px JetBrains Mono";
                for(let i = 0; i < codeText.length; i++) {
                    ctx.fillText(codeText[i], 10, 60 * (i+1));
                }
                texture.needsUpdate = true;
                setTimeout(animateTyping, 100);
            }
        }

        animateTyping();
    }, []);

    return <>
        <group position={[0, -1.5, 0]} scale={1.5}>
            {/* CRT Body */}
            <mesh ref={meshRef} position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]}>
                <primitive object={geom}  />
                <meshStandardMaterial side={THREE.DoubleSide} attach="material" color="#e3e1c9" />
            </mesh>

            {/* Screen */}
            {true && (
                <mesh ref={screenRef} position={[1.65, 1.1, 0]} rotation={[0, Math.PI/2, 0]}>
                    <planeGeometry args={[1.8, 1.6]} />
                    <meshBasicMaterial map={textTexture} />
                </mesh>
            )}
        </group>
    </>;
};

export default CrtScene;
