"use client";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";

// ThreeJS specific helper functions

export function useGLB(fl: string, loader?: GLTFLoader): GLTF | null {
    const [model, setModel] = useState<GLTF | null>(null);
    const l = useMemo(() => loader??new GLTFLoader(), []);

    useEffect(() => {
        l.loadAsync(fl).then(ev => {
            setModel(ev);
        })
    }, [fl]);

    return model;
};

export function useMeshStandardMaterial(p: THREE.MeshStandardMaterialParameters): THREE.MeshStandardMaterial {
    return useMemo(() => new THREE.MeshStandardMaterial(p), [p]);
}

function loadTexture(loader: THREE.TextureLoader, url: string | undefined): null | Promise<THREE.Texture> {
    if(!url)
        return null;
    return (async () => {
        const tex = await loader.loadAsync(url);
        // tex.minFilter = THREE.NearestMipMapNearestFilter;
        // tex.magFilter = THREE.NearestFilter;
        tex.generateMipmaps = true;
        // tex.needsUpdate = true;

        // sRGB for color textures
        tex.flipY = false;
        // tex.colorSpace = THREE.NoColorSpace;

        return tex;
    })();
}

export const useLoadTexture = (loader: THREE.TextureLoader, u?: string): THREE.Texture | null => {
    const [t, setT] = useState<THREE.Texture | null>(null);

    useEffect(() => {
        loadTexture(loader, u)?.then(tex => {
            setT(tex);
        });
    }, [u]);

    return t;
};

/**
 * @param meshOptions The standard THREE.MeshStandardMaterialParameters with a textureUrl field included
 * @returns {THREE.MeshStandardMaterial} Material combining the material and texture, based on the alpha channel
 */
export function useOverlayMaterial(meshOptions: {
    textureUrl: string,
    roughnessUrl?: string,
    metalnessUrl?: string
} & THREE.MeshStandardMaterialParameters, l?: THREE.TextureLoader): THREE.MeshStandardMaterial {
    const [material, setMaterial] = useState(new THREE.MeshStandardMaterial({name: "loading"}));
    const loader = useMemo(() => l??new THREE.TextureLoader(), []);

    const tex = useLoadTexture(loader, meshOptions.textureUrl);
    const metalnessMap = useLoadTexture(loader, meshOptions.metalnessUrl);
    const roughnessMap = useLoadTexture(loader, meshOptions.roughnessUrl);

    useEffect(() => {
        if(!tex)
            return;
        if((meshOptions.metalnessUrl && !metalnessMap) || (meshOptions.roughnessUrl && !roughnessMap))
            return;

        const matParams = {
            map: tex,              // texture with alpha
            transparent: false,
            roughness: roughnessMap ? 1 : undefined,
            metalness: metalnessMap ? 1 : undefined,
            ...meshOptions,
            textureUrl: undefined,
            roughnessMap,
            metalnessMap,
        };
        delete matParams["textureUrl"];
        delete matParams["roughnessUrl"];
        delete matParams["metalnessUrl"];

        const mat = new THREE.MeshStandardMaterial(matParams);

        mat.onBeforeCompile = (shader) => {
            // Replace how the color map is applied: mix baseColor and texture by alpha
            const chunk = THREE.ShaderChunk.map_fragment.replace(
                'diffuseColor *= sampledDiffuseColor;',
                `
                // sampledDiffuseColor.rgb = texture color
                // sampledDiffuseColor.a   = its alpha
                vec3 base = diffuse; // material.color
                diffuseColor = vec4( mix( base, sampledDiffuseColor.rgb, sampledDiffuseColor.a ), opacity );
                `
            );

            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <map_fragment>',
                chunk
            );
        };

        setMaterial(mat);
    }, [tex, metalnessMap, roughnessMap]);

    return material;
}