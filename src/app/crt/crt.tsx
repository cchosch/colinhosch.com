"use client";
import { pixelatedCRTShader } from "@/shaders/pixelated";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { Selection } from "@react-three/postprocessing";
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import { CSSProperties, FC, RefObject, useEffect, useMemo, useRef, useState } from "react";
import { codeToHtml } from "shiki";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/Addons.js";
import { getCodeHighlights, screenRenderLoop } from "./crtType";

hljs.registerLanguage("typescript", typescript);

export type CrtProps = {
    style?: CSSProperties,
    className?: string,
    showCanvas?: boolean
};

export const Crt: FC<CrtProps> = ({style, className, showCanvas}) => { 
    const textureCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const [crtContent, setCrtContent] = useState<null | string>(null);
    useEffect(() => {
        fetch("/type.txt").then((resp) => resp.text().then(fullCode => {
            codeToHtml(fullCode, {theme: "dark-plus", lang: "ts"}).then((txt) => {
                setCrtContent(currTxt => {
                    if(currTxt)
                        return currTxt;
                    const ctx = textureCanvasRef.current?.getContext("2d");
                    if(ctx && textureCanvasRef.current) {
                        ctx.fillStyle = "black";
                        ctx.fillRect(0, 0, textureCanvasRef.current.width, textureCanvasRef.current.height);
                    }

                    return txt;
                });
            });
        }));

    }, []);

    return <>
        <canvas ref={textureCanvasRef} style={{display: showCanvas ? undefined: "none", position: "absolute", aspectRatio: "1/1", height: "40svh"}}></canvas>
        {crtContent && textureCanvasRef.current && <Canvas className={className} camera={{position: [8, 0.5, 0], fov: 60}} style={style??{height: "100svh"}}>
            {<ambientLight intensity={Math.PI / 8}/>}
            <spotLight intensity={Math.PI * 20} position={[8, 0.5, 2]} lookAt={[0.5, -2, -2]}></spotLight>
            <Selection>
                <CrtMonitor textureCanvasRef={{current: textureCanvasRef.current}} highlighted={crtContent}/>
            </Selection>
            
            <OrbitControls target={[0.5, -2, 3.5]}/>
        </Canvas>}
    </>;
};

const CrtMonitor = ({textureCanvasRef, highlighted}: {textureCanvasRef: RefObject<HTMLCanvasElement>, highlighted: string}) => {
    const planeGeom = useMemo(() => {
            const width = 1.8;
            const height = 1.7;
            const plane = new THREE.PlaneGeometry(width, height, 20, 20);
            const positions = plane.attributes.position.array;

            for (let i = 0; i < positions.length; i += 3) {
                const x = positions[i];
                const y = positions[i + 1];

                // Apply curvature along X and Y axes
                const curveAmount = -0.2 * (1 - (x / width) ** 2 - (y / height) ** 2);
                positions[i + 2] = -curveAmount;
            }

            plane.attributes.position.needsUpdate = true;
            return plane;
        }, []);
    const screenRef = useRef<THREE.Mesh>(null);
    const [textTexture, setTextTexture] = useState<THREE.CanvasTexture | null>(null);
    const geom = useLoader(STLLoader, "/crt.stl");
    const meshRef = useRef<THREE.Mesh>(null);

    useEffect(() => {
        const textureCanvas = textureCanvasRef.current;
        textureCanvas.width = 2000;
        textureCanvas.height = 2000;

        const contentTexture = new THREE.CanvasTexture(textureCanvas);
        setTextTexture(contentTexture);

        const testEl = document.createElement("div");
        testEl.innerHTML = highlighted;
        testEl.style.display = "none";
        document.body.appendChild(testEl);

        const highlightedCode = getCodeHighlights(testEl);
        console.log(highlightedCode);


        // document.body.removeChild(testEl);

        const interId = setInterval(screenRenderLoop({
            codeText: [[[highlightedCode[0][0], ""]]],
            fullCode: highlightedCode,
            contentTexture,
            textureCanvas,
            readIndex: [0, 0],
            direction: 1
        }), 10);

        return () => clearInterval(interId);
    }, []);

    return <>
        <group position={[0, -1.5, 1]} scale={1.5}>
            {/* CRT Body */}
            <mesh ref={meshRef} position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]}>
                <primitive object={geom}  />
                <meshStandardMaterial emissiveIntensity={0} side={THREE.DoubleSide} attach="material" color="#e3e1c9" />
            </mesh>

            {/* Screen */}
            {textTexture && (
                <Selection>

                    <Selection enabled>
                        <mesh geometry={planeGeom} ref={screenRef} position={[1.5497, 1.1, 0]} rotation={[0, Math.PI/2, 0]}>
                            
                            {/*<planeGeometry args={[1.8, 1.6]} />*/}
                                <shaderMaterial
                                    uniforms={{...pixelatedCRTShader.uniforms, tDiffuse: {value: textTexture}}}
                                    vertexShader={pixelatedCRTShader.vertexShader}
                                    fragmentShader={pixelatedCRTShader.fragmentShader}
                                ></shaderMaterial>
                        </mesh>
                    </Selection>

                </Selection>
            )}
        </group>
    </>;
};
