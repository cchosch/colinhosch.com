"use client";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const CrtScene = () => { 
    return <div>
        <Canvas camera={{position: [0, 0, 3], fov: 60}} style={{height: "100vh"}}>
            <ambientLight intensity={Math.PI / 2}/>
            <CrtMonitor/>
            
        </Canvas>

    </div>;
};

const CrtMonitor = () => {
    const screenRef = useRef<THREE.Mesh>(null);
    const [textTexture, setTextTexture] = useState<THREE.CanvasTexture | null>(null);
    const canvasRef = useRef(document.createElement("canvas"));

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 2000;
        canvas.height = 2000;
        const ctx = canvas.getContext("2d");
        if(!ctx)
            return;

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
                ctx.fillStyle = "lime";
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
        <group position={[0, 0, 0]} scale={1.5}>
            {/* CRT Body */}
            <mesh>
                <boxGeometry args={[1.25, 1.25, 1]} />
                <meshStandardMaterial color="#e3e1c9" />
            </mesh>

            {/* Screen */}
            {textTexture && (
                <mesh ref={screenRef} position={[0, 0, 0.51]}>
                    <planeGeometry args={[1, 1]} />
                    <meshBasicMaterial map={textTexture} />
                </mesh>
            )}
        </group>
    </>;
};

export default CrtScene;
