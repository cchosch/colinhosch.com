import * as THREE from "three";
import { GLTF } from "three/examples/jsm/Addons.js";
import { getAsset, loadEnvironment, loadGLTF, loadTexture } from "./assetLoader";

// Per component defined structs
export type AssetKind = "gltf" | "texture" | "environment";

export type AssetDescriptor = { kind: AssetKind; url: string };

type GLTFResult = GLTF; // or a specific GLTF type
type TextureResult = THREE.Texture;
type EnvironmentResult = THREE.DataTexture;

export type LoadedType<D extends AssetDescriptor> =
    D["kind"] extends "gltf"    ? GLTFResult :
    D["kind"] extends "texture" ? TextureResult :
    D["kind"] extends "environment" ? EnvironmentResult :
    never;

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

export async function loadAssets<T extends Record<string, AssetDescriptor>>(
    defs: T
): Promise<NullableLoadedAssets<T> | LoadedAssets<T>> {
    const entries = Object.entries(defs) as [keyof T, T[keyof T]][];

    const result: Partial<LoadedAssets<T>> = {};

    await Promise.all(
        entries.map(async ([key, desc]) => {
            
            let value: any;

            if (desc.kind === "gltf") {
                // use your GLTF loader (loadAsync / useLoader in a non-React context)
                value = await loadGLTF(desc.url);
            } else if (desc.kind === "texture") {
                // Texture loader
                value = await loadTexture(desc.url);
            } else if (desc.kind === "environment") {
                value = await loadEnvironment(desc.url);
            }

            (result as any)[key] = value;
        })
    );

    return result as LoadedAssets<T>;
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
