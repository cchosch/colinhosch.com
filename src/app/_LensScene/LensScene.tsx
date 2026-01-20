"use client";
import { cubicInterpolate } from "@/util";
import { Environment, MeshTransmissionMaterial, OrbitControls, OrthographicCamera, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas, CanvasProps, ThreeElements, useFrame, useLoader, useThree } from "@react-three/fiber";
import { FC, RefObject, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";


const LensScene: FC<CanvasProps> = (p) => {
    const ortho = false;
    const orbital = false;

    const setTargetFocalLengthRef = useRef((_l: number) => {});
    const leave = () => setTargetFocalLengthRef.current(17);
    const enter = () => setTargetFocalLengthRef.current(70);

    return <Canvas  {...p}>
        {!ortho && <PerspectiveCamera makeDefault position={[10, 0.75, 0]} fov={23.5} />}
        {ortho && <OrthographicCamera makeDefault position={[10, 0.9, 0]} scale={0.005}/>}
        {orbital && <OrbitControls/>}
        <ambientLight intensity={0.1} />
        <directionalLight position={[5, 3, 4]} intensity={2} />

        <Environment files="/citrus_orchard_road_puresky_4k.hdr" background={false} />

        <InitCam orbital={orbital}/>

        <LensModel setTargetFocalLength={setTargetFocalLengthRef}/>
        <mesh position={[1, 0.75, 0]} rotation={[0, Math.PI /2, 0]} scale={1} onPointerLeave={leave} onPointerEnter={enter}>
            <planeGeometry args={[2, 3.5]}></planeGeometry>
            <meshStandardMaterial color={"#ffffff"} transparent opacity={0}/>
        </mesh>
    </Canvas>;
};

const InitCam = ({orbital}: {orbital: boolean}) => {
    const { camera } = useThree();

    useEffect(() => {
        if(!orbital)
            camera.lookAt(new THREE.Vector3(0, camera.position.y, 0));
    });

    return <></>;
};


//< transmission={1} ior={1.2} thickness={0.2} roughness={0} chromaticAberration={0.02} backside />
type LensModelProps = {
    setTargetFocalLength: RefObject<(l: number) => void>
};

const LensModel: FC<LensModelProps & ThreeElements["group"]> = (p) => {
    const zoomBarrelRef = useRef<THREE.Group>(null);
    const lensRef = useRef<THREE.Group>(null);
    const zoomRingRef = useRef<THREE.Group>(null);
    const { nodes } = useGLTF("./3d models/tamron_17-70.glb") as any; // eslint-disable-line
    const mat = useOverlayMaterial({ textureUrl: "/tamron_texture.png", color: "#2b2b2b" });
    const numbersMat = useOverlayMaterial({
        textureUrl: "/tamron-numbers_texture.png",
        color: "#2b2b2b",
        roughness: 0.5,
        metalness: 0.7
    });
    // const rotationDir = useRef(1);
    const targetFocalLength = useRef(0);
    const startHoverTime = useRef(0);
    useEffect(() => {
        if(p.setTargetFocalLength) {
            p.setTargetFocalLength.current = (l: number) => {
                targetFocalLength.current = l;
            };
        }
    }, [p.setTargetFocalLength]);

    useFrame((_, _delta) => {
        const zoomRing = zoomRingRef.current;
        const zoomBarrel = zoomBarrelRef.current;

        const lens = lensRef.current;
        if(lens) {
            lens.rotation.y += (0.003);
            lens.rotation.z = Math.PI / 8;
        }

        if(!zoomRing || !zoomBarrel)
            return;


        const interpFocalLength: [number, number][] = [
            [17, 0],
            [24, 0.185],
            [35, 0.40],
            [50, 0.595],
            [70, 0.715],
        ];

        const targetRot = cubicInterpolate(interpFocalLength, targetFocalLength.current);

        if(targetRot === zoomRing.rotation.y) {
            if(startHoverTime.current > 0) {
                console.log(new Date().getTime()-startHoverTime.current);
                startHoverTime.current = 0;
            }
            return;
        }

        let minRot = targetRot;
        let maxRot = targetRot;
        let rotationDir = 1;
        if(targetRot > zoomRing.rotation.y) {
            minRot = 0;
            maxRot = targetRot;
        } if(targetRot < zoomRing.rotation.y) {
            rotationDir = -1;
            minRot = targetRot;
            maxRot = 0.715;
        }
        // rough speed in milliseconds, does change based on render because delta sucks
        const speedMs = 300;

        zoomRing.rotation.y += (0.005 * rotationDir) / (speedMs / 1000) ;
        zoomRing.rotation.y = Math.max(Math.min(zoomRing.rotation.y, maxRot), minRot);

        /*
        if(zoomRing.rotation.y > 0.715 || zoomRing.rotation.y < 0)
            rotationDir.current *= -1;
        */

        // 17 = 0
        // 24 = 0.185
        // 35 = 0.40
        // 50 = 0.59
        // 70 = 0.715

        // ABS MAX = 0.63635


        const interpolateZoom: [number, number][] = [
            [0, 0], // 17mm
            [0.185, 0.05], // 24mm
            [0.40, 0.15], // 35mm
            [0.59, 0.35], // 50mm
            [0.715, 0.63635], // 70mm
        ];

        zoomBarrel.position.y = cubicInterpolate(interpolateZoom, zoomRing.rotation.y)-1;

    });

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
            roughness={0.2}
            thickness={0.2}
            ior={1.2}
            chromaticAberration={0.07}
            backside
            transmissionSampler   // use main render target
        />, []);


    return <group ref={lensRef}>
        <mesh position={[0, 0, 0]} geometry={nodes["Focus_Ring"].geometry} castShadow receiveShadow material={RubberMat}>
        </mesh>

        <group ref={zoomRingRef}>
            <mesh position={[0, 1, 0]} geometry={nodes["Zoom_Ring"].geometry} castShadow receiveShadow material={RubberMat} />
            <mesh position={[0, -1, 0]} geometry={nodes["Zoom_Ring_Metal"].geometry} castShadow receiveShadow material={numbersMat}>
                {/*<meshStandardMaterial color="#2b2b2b" roughness={0.5} metalness={0.7} />*/}
            </mesh>
        </group>

        <group ref={zoomBarrelRef} position={[0, -1, 0]}>
            <mesh position={[0, 0, 0]} geometry={nodes["Zoom"].geometry} castShadow receiveShadow material={mat} />
            <mesh position={[0, 0, 0]} geometry={nodes["Sheild_Mount"].geometry} castShadow receiveShadow material={ZoomMat} />

            <mesh position={[0, 0, 0]} geometry={nodes["Aperature"].geometry} castShadow receiveShadow>
                <meshStandardMaterial  color="#1b1b1b" metalness={0} roughness={1}/>
            </mesh>
            <mesh position={[0, 0, 0]} geometry={nodes["AperatureBlack"].geometry} castShadow receiveShadow>
                <meshStandardMaterial  color="black" metalness={0} roughness={1}/>
            </mesh>

            <mesh position={[0, 0, 0]} geometry={nodes["Lens1"].geometry} castShadow receiveShadow>
                {glassMat}
            </mesh>
            <mesh position={[0, 0, 0]} geometry={nodes["Lens2"].geometry} castShadow receiveShadow>
                {glassMat}
            </mesh>
            <mesh position={[0, 0, 0]} geometry={nodes["Lens3"].geometry} castShadow receiveShadow>
                {glassMat}
            </mesh>
        </group>

        <mesh scale={[1, 1, 1]} geometry={nodes.Barrel.geometry} castShadow receiveShadow material={mat} />

    </group>;

};

function useOverlayMaterial(ps: {textureUrl: string} & THREE.MeshStandardMaterialParameters) {
    const tex = useLoader(THREE.TextureLoader, ps.textureUrl);
    // tex.minFilter = THREE.NearestMipMapNearestFilter;
    // tex.magFilter = THREE.NearestFilter;
    tex.generateMipmaps = true;
    tex.needsUpdate = true;

    // sRGB for color textures
    tex.flipY = false;

    const material = useMemo(() => {
        const matParams = {
            map: tex,              // texture with alpha
            transparent: false,
            roughness: 0.5,
            metalness: 0.8,
            ...ps,
            textureUrl: undefined
        };
        delete matParams["textureUrl"];

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
    }, [tex, ps]);

    return material;
}

export default LensScene;