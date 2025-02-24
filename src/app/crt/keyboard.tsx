"use client";
import { useLoader } from "@react-three/fiber";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { MTLLoader, OBJLoader, STLLoader } from "three/examples/jsm/Addons.js";
import { KeyPositions } from "./keyboardLayout";

type KeyboardModelProps = {
    position?: [number, number, number]
};

const KeyboardModel: FC<KeyboardModelProps> = ({position}) => {
    const [keys, setKeys] = useState<KeyModels | null>(null);
    const materials = useLoader(MTLLoader, "/keyboard/Keyboard.mtl");
    const obj = useLoader(OBJLoader, "/keyboard/Keyboard.obj", (loader) => {
        materials.preload(); // Preload the materials
        loader.setMaterials(materials); // Attach materials to the OBJ
    });
    const groupRef = useRef<THREE.Group | null>(null);
    useEffect(() => {
        getKeySizes().then(setKeys);
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
    const material = useMemo(() => new THREE.MeshStandardMaterial({
        emissiveIntensity: 0,
        side: THREE.DoubleSide,
        color: "#e3e1c9",
    }), []);
    const dMat = useMemo(() => new THREE.MeshStandardMaterial({
        emissiveIntensity: 0,
        side: THREE.DoubleSide,
        color: "#A09A8B"
    }), []);

    return <group ref={groupRef} position={position} rotation={[0, Math.PI/2.5, 0]} scale={7}>
        {keys && <group rotation={[-Math.PI/2, 0, 0]} position={[0, 0, 0]}>
            {KeyPositions.map((pos, i) => {
                const offset: [number, number, number] = pos.offset ? [pos.offset[0]/1000, pos.offset[1]/1000, (pos.offset[2]??0)/1000] : [0, 0, 0];
                const r: [number, number, number] | undefined = pos.rotation ? [pos.rotation[0], pos.rotation[1], pos.rotation[2]??0] : undefined;
                return <instancedMesh key={`${i}${pos.legend}`} rotation={r} args={[keys[pos.model], pos.d ? dMat : material, 1]} position={offset}></instancedMesh>;
            })}
        </group>}
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