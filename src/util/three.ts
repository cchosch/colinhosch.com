"use client";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";

// ThreeJS specific helper functions

export function useMeshStandardMaterial(p: THREE.MeshStandardMaterialParameters): THREE.MeshStandardMaterial {
    return useMemo(() => new THREE.MeshStandardMaterial(p), [p]);
}

type OverlayMaterialParams = {
    metalnessMap?: THREE.Texture,
    roughnessMap?: THREE.Texture
} & THREE.MeshStandardMaterialParameters;

/**
 * @param meshOptions The standard THREE.MeshStandardMaterialParameters with a textureUrl field included
 * @returns {THREE.MeshStandardMaterial} Material combining the material and texture, based on the alpha channel
 */
export function useOverlayMaterial(meshOptions: OverlayMaterialParams): THREE.MeshStandardMaterial {
    const [material, setMaterial] = useState(new THREE.MeshStandardMaterial({name: "loading"}));
    const matParams: THREE.MeshStandardMaterialParameters  = {
        transparent: false,
        roughness: meshOptions.roughnessMap ? 1 : undefined,
        metalness: meshOptions.metalnessMap ? 1 : undefined,
        ...meshOptions,
    };

    useEffect(() => {
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
    }, []); // eslint-disable-line

    return material;
}