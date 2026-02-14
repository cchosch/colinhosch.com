import * as THREE from "three";
import { GLTF } from "three/examples/jsm/Addons.js";
import { getAsset, loadEnvironment, loadGLTF, loadTexture } from "./assetLoader";

// Per component defined structs
export type AssetKind = "gltf" | "texture" | "environment";

export type AssetDescriptor = { kind: AssetKind; url: string };

type GLTFResult = GLTF; // or a specific GLTF type
type TextureResult = THREE.Texture;
type EnvironmentResult = THREE.DataTexture;

export type LoadTypes = {
    "gltf": GLTFResult,
    "texture": TextureResult,
    "environment": EnvironmentResult
}

export type LoadedType<D extends AssetDescriptor> = LoadTypes[D["kind"]];

export type LoadedAssets<T extends Record<string, AssetDescriptor>> = {
    [K in keyof T]: LoadedType<T[K]>;
};

type NullableLoadedAssets<T extends Record<string, AssetDescriptor>> = {
    [K in keyof LoadedAssets<T>]: LoadedAssets<T>[K] | undefined;
};

export function successLoad<T extends Record<string, AssetDescriptor>>(
    assets: NullableLoadedAssets<T>
): assets is LoadedAssets<T> {
    return !Object.values(assets).some(v => v === undefined);
}

type LoadMap = {
    [key in AssetKind]: (url: string) => Promise<LoadTypes[key] | undefined>;
}

const loadMap: LoadMap = {
    "gltf": loadGLTF,
    "texture": loadTexture,
    "environment": loadEnvironment
};

export function loadAsset<D extends AssetDescriptor>(
    desc: D
): Promise<LoadedType<D> | undefined> {
    const loader = loadMap[desc.kind] as (
        url: string
    ) => Promise<LoadedType<D> | undefined>;

    return loader(desc.url);
}

export async function loadAssets<T extends Record<string, AssetDescriptor>>(
    defs: T
): Promise<NullableLoadedAssets<T> | LoadedAssets<T>> {
    const entries = Object.entries(defs) as [keyof T, T[keyof T]][];

    const results = await Promise.all(
        entries.map(([key, desc]) => 
            loadAsset(desc).then(asset => [key, asset])
        )
    );

    return Object.fromEntries(results) as NullableLoadedAssets<T>;
}

export function getAssets<T extends Record<string, AssetDescriptor>>(
    defs: T
): LoadedAssets<T> {
    const entries = Object.entries(defs) as [keyof T, T[keyof T]][];

    const ents =  entries.map(([key, desc]) => {
        return [key, getAsset(desc.url)];
    });

    return Object.fromEntries(ents) as LoadedAssets<T>;
}

export type GLTFGraph = {
    nodes: Record<string, THREE.Object3D & {
        geometry?: THREE.BufferGeometry;
        material?: THREE.Material | THREE.Material[];
    }>;
    materials: Record<string, THREE.Material>;
};

export function buildGLTFGraph(gltf: GLTF): GLTFGraph {
    const nodes: Record<string, THREE.Object3D> = {};
    const materials: Record<string, THREE.Material> = {};

    gltf.scene.traverse((obj) => {
        if (obj.name) {
            nodes[obj.name] = obj;
        }

        // collect materials
        const mesh = obj as THREE.Mesh;
        if (mesh.isMesh) {
            const mat = mesh.material;

            if (Array.isArray(mat)) {
                mat.forEach((m) => m?.name && (materials[m.name] = m));
            } else if (mat?.name) {
                materials[mat.name] = mat;
            }
        }
    });

    return { nodes, materials };
}
