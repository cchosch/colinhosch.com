"use client";
import { useMemo } from "react";
import * as THREE from "three";

// ThreeJS specific helper functions

function loadTexture(loader: THREE.TextureLoader, url: string | undefined): null | THREE.Texture {
    if(!url)
        return null;
    const tex = loader.load(url);
    // tex.minFilter = THREE.NearestMipMapNearestFilter;
    // tex.magFilter = THREE.NearestFilter;
    tex.generateMipmaps = true;
    // tex.needsUpdate = true;

    // sRGB for color textures
    tex.flipY = false;
    // tex.colorSpace = THREE.NoColorSpace;

    return tex;
}

/**
 * @param meshOptions The standard THREE.MeshStandardMaterialParameters with a textureUrl field included
 * @returns {THREE.MeshStandardMaterial} Material combining the material and texture, based on the alpha channel
 */
export function useOverlayMaterial(meshOptions: {
    textureUrl: string,
    roughnessUrl?: string,
    metalnessUrl?: string
} & THREE.MeshStandardMaterialParameters, loader?: THREE.TextureLoader): THREE.MeshStandardMaterial {
    if(!loader)
        loader = new THREE.TextureLoader();

    const useLoadT = (u?: string) => {
        return useMemo(() =>  loadTexture(loader, u), [u]);
    };
    const tex = useLoadT(meshOptions.textureUrl);
    const metalnessMap = useLoadT(meshOptions.metalnessUrl);
    const roughnessMap = useLoadT(meshOptions.roughnessUrl);

    const material = useMemo(() => {
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

        return mat;
    }, [tex, meshOptions]);

    return material;
}