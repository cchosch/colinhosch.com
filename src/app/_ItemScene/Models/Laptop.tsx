"use client";

import * as THREE from "three";
import { useRotateGroup } from "@/app/_ItemScene/Models/animations";
import { getAssets, queueAssets } from "@/util/AssetManager";
import { FC, RefObject, useCallback, useEffect, useRef, useState } from "react";
import { codeToHtml } from "shiki";
import { pixelatedCRTShader } from "@/shaders/pixelated";
import { getCodeHighlights, screenRenderLoop } from "@/util/crtType";

const cameraAssets = {
    model: { kind: "gltf", url: "./models/laptop/mbp.glb" },
} as const;
queueAssets(cameraAssets);

const LaptopModel: FC<{ canvasRef: RefObject<HTMLCanvasElement | null> }> = ({ canvasRef }) => {
    const assets = getAssets(cameraAssets);
    const laptopGroupR = useRef<THREE.Group>(null);
    const textTextureRef = useRef<THREE.CanvasTexture>(null);
    const [editorText, setEditorText] = useState<null | string>(null);

    useEffect(() => {
        fetch("/type.txt").then((resp) => resp.text().then(fullCode => {
            codeToHtml(fullCode, { theme: "dark-plus", lang: "ts" }).then((txt) => {
                setEditorText(currTxt => {
                    const canvas = canvasRef.current;
                    const ctx = canvas?.getContext("2d");
                    if (currTxt || !canvas || !ctx)
                        return currTxt;

                    ctx.fillStyle = "black";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    return txt;
                });
            });
        }));
    }, []);

    const updateScreenMaterial = useCallback((mat: THREE.Material) => {
        assets.model.scene.traverse((object) => {
            if ("isMesh" in object && object.isMesh && object instanceof THREE.Mesh && object.name === "ScreenSheet") {
                console.log(object.name);
                // Assign a new material, or modify the existing one
                object.material = mat;
                object.material.needsUpdate = true;
            }
        });
    }, [assets]);

    useEffect(() => {
        const textureCanvas = canvasRef.current;
        if (!textureCanvas || !editorText)
            return;
        textureCanvas.width = 3074 / 2.75;
        textureCanvas.height = 1981 / 2.75;

        if (!textTextureRef.current) {
            textTextureRef.current = new THREE.CanvasTexture(textureCanvas);
            const m = new THREE.ShaderMaterial({
                uniforms: { ...pixelatedCRTShader.uniforms, tDiffuse: { value: textTextureRef.current! } },
                vertexShader: pixelatedCRTShader.vertexShader,
                fragmentShader: pixelatedCRTShader.fragmentShader
            });
            updateScreenMaterial(m);
        }

        const testEl = document.querySelector<HTMLDivElement>("div#codeEl") ?? document.createElement("div");
        if (testEl.id !== "codeEl") {
            testEl.id = "codeEl";
        }
        testEl.innerHTML = editorText;
        testEl.style.display = "none";
        document.body.appendChild(testEl);

        const highlightedCode = getCodeHighlights(testEl);


        const interId = setInterval(screenRenderLoop({
            codeText: [[[highlightedCode[0][0], ""]]],
            fullCode: highlightedCode,
            contentTexture: textTextureRef.current,
            textureCanvas,
            readIndex: [0, 0],
            direction: 1
        }), 100);

        return () => clearInterval(interId);
    }, [editorText, updateScreenMaterial]);

    useRotateGroup(laptopGroupR, {
        initRotate: {
            z: -Math.PI / 8,
        }
    });

    return <>
        <group ref={laptopGroupR} position={[0, -0.2, 0]} scale={8}>
            <group rotation={[0, Math.PI / 8, 0]}>
                <primitive object={assets.model.scene} />
            </group>
        </group>
    </>;
};

export default LaptopModel;
