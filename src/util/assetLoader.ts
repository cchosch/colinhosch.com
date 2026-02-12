"use client";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { GLTF, GLTFLoader, RGBELoader } from "three/examples/jsm/Addons.js";
import { AssetDescriptor, LoadedType } from "./assetLoader";
export * from "@/util/assetManager";

export type AssetStatus = "pending" | "loading" | "loaded" | "error";

type AnyExcept<ExcludedType, T> = T extends ExcludedType ? never : T;

export type AssetRecord<T = any> = {
    url: string;
    status: "pending" | "loading" | "error" | AnyExcept<string, T>;
    error?: unknown;
}

export interface AssetSnapshot {
    total: number;
    loaded: number;
    assets: Record<string, AssetRecord>;
}

type Listener = (snapshot: AssetSnapshot) => void;


// Internal state
const assets: Record<string, AssetRecord> = {};
const loadingManager = new THREE.LoadingManager();
const listeners = new Set<Listener>();

function emit() {
    const snapshot: AssetSnapshot = getSnapshot();
    listeners.forEach(l => l(snapshot));
}

// Public API

export function getSnapshot(): AssetSnapshot {
    const total = Object.keys(assets).length;
    const loaded = Object.values(assets).filter(a => typeof a.status !== "string").length;
    return {
        total,
        loaded,
        assets: { ...assets },
    };
}

export function subscribeAssets(listener: Listener) {
    listeners.add(listener);
    listener(getSnapshot());
    return () => {
        listeners.delete(listener);
    };
}

export async function loadEnvironment(
  url: string
): Promise<THREE.Texture | undefined> {
    return await loadAsset(
        url,
        async (u: string) => {
            const loader = new RGBELoader(loadingManager);
            // RGBELoader.loadAsync returns a DataTexture
            const texture = await loader.loadAsync(u);
            texture.mapping = THREE.EquirectangularReflectionMapping;
            texture.needsUpdate = true;
            return texture;
        }
    );
}

export async function loadTexture(url: string): Promise<THREE.Texture | undefined> {
    return await loadAsset(
        url,
        async (u: string) => {
            const loader = new THREE.TextureLoader(loadingManager);
            return await loader.loadAsync(u);
        }
    );
}
export async function loadGLTF(url: string): Promise<GLTF | undefined> {
    return await loadAsset(
        url,
        async (u: string) => {
            const loader = new GLTFLoader(loadingManager);
            return await loader.loadAsync(u);
        }
    );
}

async function loadAsset<T = any>(
    url: string,
    loader: (url: string) => Promise<AnyExcept<string, T>>
): Promise<T | undefined> {
    let rec = assets[url] as AssetRecord<T> | undefined;

    if (!rec) {
        rec = { url, status: "pending" };
        assets[url] = rec;
    }

    // Already loaded or loading: just return existing record
    if (typeof rec.status !== "string") {
        return rec.status;
    }

    // Start new load
    rec.status = "loading";
    try {
        const value: AnyExcept<string, T> = await loader(url);
        const current = assets[url] as AssetRecord<T> | undefined;
        if (!current) return value;

        current.status = value; 
        emit();

        return value;
    } catch (err) {
        const current = assets[url] as AssetRecord<T> | undefined;
        if (!current) throw err;

        current.status = "error";
        current.error = err;
        emit();

        console.error(err);
        return;
    }
}

export function getAsset<T extends AssetDescriptor>(
    url: string
): LoadedType<T> {
    if(typeof assets[url].status === "string") {
        throw new Error("Something went wrong");
    }

    return assets[url].status as LoadedType<T>;
}

export function useAssetsFinished(): boolean {
    const [f, setF] = useState(false);

    useEffect(() => {
        subscribeAssets((l) => {
            if(l.loaded === l.total)
                setF(true);
            console.log(l);
        });
    }, []);

    return f;
}

