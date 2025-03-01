"use client";
import { Text3D } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { MTLLoader, OBJLoader, STLLoader } from "three/examples/jsm/Addons.js";
import { KeyPositions } from "./keyboardLayout";

type KeyboardModelProps = {
    position?: [number, number, number]
};

const keySize = 0.005;
const KeyboardModel: FC<KeyboardModelProps> = ({position}) => {
    const [keys, setKeys] = useState<KeyModels | null>(null);
    const materials = useLoader(MTLLoader, "/keyboard/Keyboard.mtl");
    const obj = useLoader(OBJLoader, "/keyboard/Keyboard.obj", (loader) => {
        materials.preload(); // Preload the materials
        loader.setMaterials(materials); // Attach materials to the OBJ
    });
    const groupRef = useRef<THREE.Group | null>(null);
    const pressedKeys = useRef(new Map());
    const legendLookup = useRef<{[key: string]: number}>({});

    const material = useMemo(() => new THREE.MeshStandardMaterial({
        emissiveIntensity: 0,
        side: THREE.DoubleSide,
        color: "#e3e1c9",
    }), []);
    const fontMat = useMemo(() => new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        color: "black"
    }), []);
    const dMat = useMemo(() => new THREE.MeshStandardMaterial({
        emissiveIntensity: 0,
        side: THREE.DoubleSide,
        color: "#A09A8B"
    }), []);
    const setKeyPressed = (keyName: string, mesh: THREE.Object3D, value: boolean) => {
        pressedKeys.current.set(keyName, {
            pressed: value,
            mesh
        });
    };

    useEffect(() => {
        getKeySizes().then(setKeys);
        const keyListener = (dir: boolean) => {
            return (ev: KeyboardEvent) => {
                console.log(ev);
                const c = ev.code.replace("Key", "").replace("Digit", "").toLowerCase();
                const cI = legendLookup.current[c];
                if(!cI || !groupRef.current)
                    return;
                const cKey = groupRef.current.children[0].children[cI];
                if(cKey && cKey instanceof THREE.Group) {
                    setKeyPressed(c, cKey, dir);
                }
            };
        }; 
        const downL = keyListener(true);
        const upL = keyListener(false);
        addEventListener("keydown", downL);
        addEventListener("keyup", upL);
        return () => {
            removeEventListener("keydown", downL);
            removeEventListener("keyup", upL);
        };
    }, []);

    useEffect(() => {
        if (!obj) {
            return;
        }
        const travChildren = (child: THREE.Object3D) => {
            if(child instanceof THREE.Mesh && child.material)
                child.material.side = THREE.DoubleSide; // Render both sides
        };

        // Make all materials double-sided
        obj.traverse(travChildren);

        groupRef.current?.add(obj);
    }, [obj]);


    // Animation loop for smooth keypress effect
    useFrame(() => {
        pressedKeys.current.forEach((state, keyId) => {
            if (state.mesh) {
                const targetZ = state.pressed ? -0.005 : 0; // Move down when pressed
                state.mesh.position.z = THREE.MathUtils.lerp(state.mesh.position.z, targetZ, 0.2); // Smooth transition

                if (Math.abs(state.mesh.position.z - targetZ) < 0.001) {
                    if (!state.pressed)
                        pressedKeys.current.delete(keyId); // Remove if returned to original position
                }
            }
        });
    });
    const keyEls = useMemo(() => {
        return <>
            {keys && <group rotation={[-Math.PI/2, 0, 0]} position={[0, 0, 0]}>
                {KeyPositions.map((pos, i) => {
                    const offset: [number, number, number] = pos.offset ? [pos.offset[0]/1000, pos.offset[1]/1000, (pos.offset[2]??0)/1000] : [0, 0, 0];
                    const r: [number, number, number] | undefined = pos.rotation ? [pos.rotation[0], pos.rotation[1], pos.rotation[2]??0] : undefined;
                    if(pos.legend || pos.code) {
                        const k = (pos.code ?? pos.legend)??"";

                        legendLookup.current[k.toLowerCase()] = i;
                    }
                    if(!pos.legendOffset) {
                        pos.legendOffset = [0, 0];
                    }
                    if(!pos.legendOffset[2]) {
                        pos.legendOffset[2] = 0;
                    }
                    keys[pos.model].computeBoundingSphere();
                    keys[pos.model].computeBoundingBox();
                    const keyBounding = keys[pos.model].boundingBox!;
                    const lLoc = keys[pos.model].boundingSphere!.center;
                    lLoc.x-=(keyBounding.max.x-keyBounding.min.x)/2;
                    const cKeySize = keySize * (pos.legendSize??1);
                    lLoc.x+=cKeySize+cKeySize/4;
                    lLoc.x += pos.legendOffset[0]/1000;
                    lLoc.y += pos.legendOffset[1]/1000;
                    lLoc.z += pos.legendOffset[2]/1000;
                    
                    return <group rotation={r} key={`${i}${pos.legend}`} position={offset}>
                        <instancedMesh  args={[keys[pos.model], pos.d ? dMat : material, 1]} ></instancedMesh>
                        <Text3D material={fontMat} scale={cKeySize} height={0.01} position={[lLoc.x-cKeySize/2, lLoc.y-cKeySize/2, lLoc.z+0.0078]} font="JetBrains Mono_Regular.json">{pos.legend}</Text3D>
                    </group>;
                })}
            </group>}
        </>;
    }, [keys, fontMat, dMat, material]);

    return <group ref={groupRef} position={position} rotation={[0, Math.PI/2.5, 0]} scale={7}>
        {keyEls}
    </group>;
};

export type KeyModels = {
    _1u_arrow: THREE.BufferGeometry,
    _1u_zxc: THREE.BufferGeometry,
    _1u_home_row: THREE.BufferGeometry,
    _1u_qwerty_row: THREE.BufferGeometry,
    _1u_numbers_row: THREE.BufferGeometry,
    _1u_f_row: THREE.BufferGeometry,
    _1_25u: THREE.BufferGeometry,
    _1_5u: THREE.BufferGeometry,
    _1_5u_bottom: THREE.BufferGeometry,
    _1_75u: THREE.BufferGeometry,
    _2u_vertical: THREE.BufferGeometry,
    _2u: THREE.BufferGeometry,
    _2_25u: THREE.BufferGeometry,
    caps_lock: THREE.BufferGeometry,
    enter: THREE.BufferGeometry,
    space: THREE.BufferGeometry,
    backspace: THREE.BufferGeometry,
}
const fileMap: {[key in keyof KeyModels]: string} = {
    _1u_arrow: "1u_arrow.stl",
    _1u_zxc: "1u_zxcvb_row.stl",
    _1u_home_row: "1u_home_row.stl",
    _1u_qwerty_row: "1u_qwerty_row.stl",
    _1u_numbers_row: "1u_numbers_row.stl",
    _1u_f_row: "1u_f_row.stl",
    _1_25u: "1.25_u.stl",
    _1_5u: "1.5_u.stl",
    _1_5u_bottom: "1.5u_bottom.stl",
    _1_75u: "1.75_u.stl",
    _2u_vertical: "2u_vertical.stl",
    _2u: "2u.stl",
    _2_25u: "2.25u.stl",
    caps_lock: "caps_lock.stl",
    enter: "enter.stl",
    space: "space.stl",
    backspace: "backspace.stl"
};

const getKeySizes = async (): Promise<KeyModels> => {
    const stlLoader = new STLLoader();
    async function loadFile(name: string) {
        return stlLoader.loadAsync(`/keyboard/keycaps/${name}`);
    };
    const files: [keyof KeyModels, string][] = Object.entries(fileMap) as [keyof KeyModels, string][];
    const resp = await Promise.all(files.map(([, modelFile]: [keyof KeyModels, string]): Promise<THREE.BufferGeometry> => {
        return loadFile(modelFile);
    }));
    return Object.fromEntries(files.map(([modelName, ], i) => {
        return [modelName, resp[i]];
    })) as KeyModels;
};

export default KeyboardModel;