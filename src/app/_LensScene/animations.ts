import { cubicInterpolate } from "@/util";
import { RefObject } from "react";
import * as THREE from "three";

export const fixedRefF = <T>(func: (arg: T) => void | (() => void)): ((a: RefObject<T | null>) => void | (() => void)) => {
    return (argR) => {
        const arg = argR.current;
        if(!arg)
            return () => {};

        const cb = func(arg);

        if(cb)
            return () => {
                cb();
            };
    }
}

export const rotateLens = fixedRefF((lens: THREE.Group) => {
    lens.rotation.y += 0.003;

    if(lens.rotation.z !== Math.PI / 8) {
        lens.rotation.z = Math.PI / 8;
    }
});

type GroupRef = RefObject<THREE.Group | null>
export const zoomOnHover = (zoomRingRef: GroupRef, zoomBarrelRef: GroupRef, targetFocalLength: RefObject<number>, startHoverTime: RefObject<number>) => {
        const zoomRing = zoomRingRef.current;
        const zoomBarrel = zoomBarrelRef.current;

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

        zoomBarrel.position.y = cubicInterpolate(interpolateZoom, zoomRing.rotation.y) * 0.04;
}