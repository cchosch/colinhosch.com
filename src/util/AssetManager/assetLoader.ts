"use client";
import { Mutex } from "async-mutex";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { GLTF, GLTFLoader, RGBELoader } from "three/examples/jsm/Addons.js";
import { AssetDescriptor, LoadedType, type AssetKind, type LoadTypes } from "./assetLoader";
export * from "@/util/AssetManager/assetManager";

export type AssetStatus = "loading" | "error";

export type AssetRecord<T extends AssetKind = AssetKind> = {
    url: string,
    m: Mutex,
} & ({
    status: "loading";
} | {
    status: "error";
    error: unknown;
} | {
    status: "loaded",
    value: LoadTypes[T];
});

export interface AssetSnapshot {
    total: number;
    loaded: number;
    percentage: number;
    assets: Record<string, AssetRecord>;
}

type Listener = (snapshot: AssetSnapshot) => void;


// Internal state
const assets: Record<string, AssetRecord> = {};
const loadingManager = new THREE.LoadingManager();
const listeners = new Set<Listener>();

const MAX_CONCURRENT_LOADS = 1;
let activeLoads = 0;
const pending: (() => void)[] = [];

function acquireSlot(): Promise<void> {
    return new Promise(resolve => {
        if (activeLoads < MAX_CONCURRENT_LOADS) {
            activeLoads++;
            resolve();
        } else {
            pending.push(() => {
                activeLoads++;
                resolve();
            });
        }
    });
}

function releaseSlot() {
    activeLoads--;
    const next = pending.shift();
    if (next) next();
}

function emit() {
    const snapshot: AssetSnapshot = getSnapshot();
    listeners.forEach(l => l(snapshot));
}

function getSnapshot(): AssetSnapshot {
    const total = Object.keys(assets).length;
    const loaded = Object.values(assets).filter(a => a.status === "loaded").length;
    return {
        total,
        loaded,
        percentage: (loaded / Math.max(total, 1)) * 100,
        assets: { ...assets },
    };
}

function subscribeAssets(listener: Listener) {
    listeners.add(listener);
    listener(getSnapshot());
    return () => {
        listeners.delete(listener);
    };
}

async function loadAsset<T extends AssetKind>(
    url: string,
    loader: (url: string) => Promise<LoadTypes[T]>
): Promise<LoadTypes[T] | undefined> {
    let rec = assets[url] as AssetRecord<T> | undefined;

    if (!rec) {
        rec = { url, status: "loading", m: new Mutex() };
        assets[url] = rec;
        emit();
    }

    // Already loaded: return existing record
    if (rec.status === "loaded") {
        return rec.value;
    }

    const r1 = await rec.m.acquire();

    const current = assets[url] as AssetRecord<T> | undefined;
    if (!current) {
        console.error(`Asset "${url}" was removed while another instance was waiting on it...`);
        r1();
        return;
    }
    if (current.status === "loaded") {
        r1();
        return current.value;
    }

    await acquireSlot();
    const release = () => {
        releaseSlot();
        r1();
    };

    let value: LoadTypes[T] | undefined = undefined;
    let newVal: AssetRecord | undefined = undefined;
    try {
        value = await loader(url);

        newVal = {
            url,
            status: "loaded",
            value,
            m: current.m
        };
    } catch (err) {
        console.error(err);

        newVal = {
            url,
            status: "error",
            error: err,
            m: current.m
        };
    } finally {
        if (newVal) {
            assets[url] = newVal;
            emit();
        }
        release();
    }
    return value;
}

// Public API

export function useSubscribeAssets(listener: Listener) {
    useEffect(() => {
        return subscribeAssets(listener);
    }, []); // eslint-disable-line
}

export async function loadEnvironment(
    url: string
): Promise<THREE.DataTexture | undefined> {
    return await loadAsset<"environment">(
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
    return await loadAsset<"texture">(
        url,
        async (u: string) => {
            const loader = new THREE.TextureLoader(loadingManager);
            const tex = await loader.loadAsync(u);
            tex.generateMipmaps = true;
            // tex.needsUpdate = true;

            // sRGB for color textures
            tex.flipY = false;
            return tex;
        }
    );
}
export async function loadGLTF(url: string): Promise<GLTF | undefined> {
    return await loadAsset<"gltf">(
        url,
        async (u: string) => {
            const loader = new GLTFLoader(loadingManager);
            return await loader.loadAsync(u);
        }
    );
}


export function getAsset<T extends AssetDescriptor>(
    url: string
): LoadedType<T> {
    const asset = assets[url];
    if (!asset || asset.status !== "loaded") {
        throw new Error(`Asset "${url}" retreived before it was loaded`);
    }

    return asset.value as LoadedType<T>;
}

export function useAssetsFinished(): boolean {
    const [f, setF] = useState(false);

    useEffect(() => {
        return subscribeAssets((l) => {
            if (l.loaded === l.total)
                setF(true);
            else
                setF(false);
        });
    }, []);

    return f;
}

