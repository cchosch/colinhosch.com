import { useGLTF as useG } from "@react-three/drei";
import { ConstructorRepresentation, Extensions, LoaderResult, useLoader as useL } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { registerAsset } from "./loadingState";

// eslint-disable-next-line
// @ts-ignore 
import { type GLTFLoader } from "three-sdlib";

export function useGLTF(url: string, useDraco?: boolean | string, useMeshopt?: boolean, extendLoader?: (loader: GLTFLoader) => void) {
    const registered = useRef(false);

    if (!registered.current) {
        registerAsset(url);
        registered.current = true;
    }

    return useG(url, useDraco, useMeshopt, extendLoader);
}

type InputLike = string | string[] | string[][] | Readonly<string | string[] | string[][]>;
type LoaderLike = THREE.Loader<any, InputLike>; // eslint-disable-line

export function useLoader<I extends InputLike, L extends LoaderLike | ConstructorRepresentation<LoaderLike>>(
    loader: L,
    input: I,
    extensions?: Extensions<L>,
    onProgress?: (event: ProgressEvent<EventTarget>) => void
): I extends any[] ? LoaderResult<L>[] : LoaderResult<L> { //eslint-disable-line
    const urls = Array.isArray(input) ? input : [input];
    const registered = useRef(false);

    if (!registered.current) {
        urls.forEach(u => registerAsset(u));
        registered.current = true;
    }

    return useL(loader, input, extensions, onProgress);
}
