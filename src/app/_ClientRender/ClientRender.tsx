"use client";
import { Environment, MeshTransmissionMaterial, MeshTransmissionMaterialProps, OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";


const ClientRender = () => {
    return <Canvas style={{height: "calc(100vh - 60px)", }}>
        <ambientLight intensity={0.1} />
      <directionalLight position={[5, 3, 4]} intensity={2} />

      {/* HDR environment for reflections */}
        <Environment files="/citrus_orchard_road_puresky_4k.hdr" background={false} />


        <PerspectiveCamera makeDefault position={[0, 5, 0]} fov={50} />
        <OrbitControls/>
        <Lens/>

    </Canvas>;
};

const config: MeshTransmissionMaterialProps = {
    transmission: 1,
    roughness: 0,
    thickness: 0.2,
    ior: 1.2,
    chromaticAberration: 0.02,
    // anisotropicBlur: 0.1,
    backside: true
};

//< transmission={1} ior={1.2} thickness={0.2} roughness={0} chromaticAberration={0.02} backside />
const Lens = () => {
    const zoomBarrelRef = useRef<THREE.Group>(null);
    const zoomRingRef = useRef<THREE.Group>(null);
    const { nodes, scene } = useGLTF("./3d models/tamron_17-70.glb") as any; // eslint-disable-line
    const mat = useOverlayMaterial("/tamron_texture.png", "#2b2b2b");
    const numbersMat = useOverlayMaterial("/tamron-numbers_texture.png", "#2b2b2b", {
        roughness: 0.5,
        metalness: 0.7
    });
    const rotationDir = useRef(1);

    useFrame(() => {
        const zoomRing = zoomRingRef.current;
        const zoomBarrel = zoomBarrelRef.current;
        if(!zoomRing || !zoomBarrel)
            return;
        // zoomRing.rotateY(0.001);
        zoomRing.rotation.y += 0.005 * rotationDir.current;
        // zoomRing.rotation.y = 0.715 ;
        // 24 = 0.185
        // 35 = 0.40
        // 50 = 0.59
        // 70 = 0.715
        if(zoomRing.rotation.y > 0.715 || zoomRing.rotation.y < 0)
            rotationDir.current *= -1;
        zoomBarrel.position.y = ((zoomRing.rotation.y)*0.890);
        
    });
    useLayoutEffect(() => {
        scene.traverse((o: any) => { // eslint-disable-line
            if (o.geometry) {
                // o.geometry.computeVertexNormals();
            }
        });
    }, [scene]);
    const RubberMat = new THREE.MeshStandardMaterial({
        color: "#242425",
        metalness: 0,
        roughness: 0.9
    });
    const ZoomMat = new THREE.MeshStandardMaterial({
        color: "#2b2b2b",
        metalness: 0.5,
        roughness: 0.7
    });
    const glassMat = useMemo(() =>
        <MeshTransmissionMaterial
            transmission={1}
            roughness={0.5}
            thickness={0.1}
            ior={1.15}
            chromaticAberration={0.06}
            backside
            transmissionSampler   // use main render target
            samples={8}
        />, []);

    return <group >
        <mesh position={[0, 0, 0]} geometry={nodes["Focus_Ring"].geometry} castShadow receiveShadow material={RubberMat}>
        </mesh>

        <group ref={zoomRingRef}>
            <mesh position={[0, 1, 0]} geometry={nodes["Zoom_Ring"].geometry} castShadow receiveShadow material={RubberMat} />
            <mesh position={[0, -1, 0]} geometry={nodes["Zoom_Ring_Metal"].geometry} castShadow receiveShadow material={numbersMat}>
                {/*<meshStandardMaterial color="#2b2b2b" roughness={0.5} metalness={0.7} />*/}
            </mesh>
        </group>

        <group ref={zoomBarrelRef}>
            <mesh position={[0, -1, 0]} geometry={nodes["Zoom"].geometry} castShadow receiveShadow material={mat} />
            <mesh position={[0, -1, 0]} geometry={nodes["Sheild_Mount"].geometry} castShadow receiveShadow material={ZoomMat} />

            <mesh position={[0, -1, 0]} geometry={nodes["Lens1"].geometry} castShadow receiveShadow>
                {glassMat}
            </mesh>
            <mesh position={[0, -1, 0]} geometry={nodes["Lens2"].geometry} castShadow receiveShadow>
                {glassMat}
            </mesh>
            <mesh position={[0, -1, 0]} geometry={nodes["Lens3"].geometry} castShadow receiveShadow>
                {glassMat}
            </mesh>
        </group>

        <mesh scale={[1, 1, 1]} geometry={nodes.Barrel.geometry} castShadow receiveShadow material={mat} />

    </group>;

};

function useOverlayMaterial(textureUrl: string, baseColor: string | number, ps?: THREE.MeshStandardMaterialParameters) {
    const tex = useLoader(THREE.TextureLoader, textureUrl);
    // tex.minFilter = THREE.NearestMipMapNearestFilter;
    // tex.magFilter = THREE.NearestFilter;
    tex.generateMipmaps = true;
    tex.needsUpdate = true;

    // sRGB for color textures
    tex.flipY = false;

    const material = useMemo(() => {
            const mat = new THREE.MeshStandardMaterial({
                color: baseColor,      // base solid color
                map: tex,              // texture with alpha
                transparent: false,
                roughness: 0.5,
                metalness: 0.8,
                ...ps
            });

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
    }, [tex, baseColor]);

    return material;
}

export default ClientRender;