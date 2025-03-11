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
import { MTLLoader, OBJLoader, TGALoader } from "three/examples/jsm/Addons.js";
import { getCodeHighlights, screenRenderLoop } from "./crtType";
import KeyboardModel from "./keyboard";

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
            {<ambientLight intensity={1.5}/>}
            <spotLight intensity={10} position={[8, 0.5, 2]} lookAt={[0.5, -2, -2]}></spotLight>
            <spotLight intensity={10} position={[-4, 0.5, 0]} lookAt={[0.5, -2, -2]}></spotLight>
            <KeyboardModel position={[5, -1.5, 2]}/>

            <Selection>
                <CrtMonitor textureCanvasRef={{current: textureCanvasRef.current}} highlighted={crtContent}/>
            </Selection>
            
            {/*<OrbitControls target={[0, 0, 0]}/>*/}
            {<OrbitControls target={[0.5, -2, 3.5]}/>/**/}
        </Canvas>}
    </>;
};

type CrtMonitorProps = {
    textureCanvasRef: RefObject<HTMLCanvasElement>,
    highlighted: string
}

const CrtMonitor: FC<CrtMonitorProps> = ({textureCanvasRef, highlighted}) => {
    const planeGeom = useMemo(() => {
        const width = 1.8;
        const height = 1.375;
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

    const materials = useLoader(MTLLoader, "/crt/proCRT.mtl");
    const geom = useLoader(OBJLoader, "/crt/proCRT.obj", (loader) => {
        materials.preload(); // Preload the materials
        loader.setMaterials(materials); // Attach materials to the OBJ
    });

    const baseColor = useLoader(TGALoader, '/crt/textures/CRTMonitor_Base_Color.tga');

    const mat = useMemo(() => {
        return new THREE.MeshStandardMaterial({
            map: baseColor,              // Diffuse/albedo
            displacementScale: 0.1,      // Adjust this value as needed
            side: THREE.DoubleSide
        });
    }, [baseColor]);

    // Apply textures to the material
    useMemo(() => {
        // Traverse the model to find the mesh and apply textures
        geom.traverse((child) => {
            if (child instanceof THREE.Mesh && child.isMesh) {
                // Use a Standard Material (or Physical Material) for PBR
                child.material = mat;

                // Ensure UVs are set up for aoMap
                child.geometry.attributes.uv2 = child.geometry.attributes.uv;
                child.material.needsUpdate = true;
            }
        });
    }, [geom, mat]);

    useEffect(() => {
        const textureCanvas = textureCanvasRef.current;
        textureCanvas.width = 2000;
        textureCanvas.height = 2000;

        const contentTexture = textTexture ?? new THREE.CanvasTexture(textureCanvas);
        setTextTexture(contentTexture);

        const testEl = document.createElement("div");
        testEl.innerHTML = highlighted;
        testEl.style.display = "none";
        document.body.appendChild(testEl);

        const highlightedCode = getCodeHighlights(testEl);


        const interId = setInterval(screenRenderLoop({
            codeText: [[[highlightedCode[0][0], ""]]],
            fullCode: highlightedCode,
            contentTexture,
            textureCanvas,
            readIndex: [0, 0],
            direction: 1
        }), 100);

        return () => clearInterval(interId);
    }, [textureCanvasRef, highlighted]);

    return <>
        <group position={[0, -1.5, 1]} scale={1.5}>
            {/* CRT Body */}
            <primitive object={geom} position={[0.65, 0, 0]} rotation={[-Math.PI/2, 0, Math.PI/2]} scale={0.06}/>

            {/* Screen */}
            {textTexture && (
                <Selection>
                    <Selection enabled>
                        <mesh geometry={planeGeom} ref={screenRef} position={[1.5497, 1.22, 0]} rotation={[0, Math.PI/2, 0]}>
                            
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
