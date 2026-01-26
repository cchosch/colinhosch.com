import * as THREE from "three";

export const addTSALights = (
    {
        lightCount = 6,
        radius = 0.995,
        zOffset = 1.00,
        yOffset = -0.05,
        arcStart = -Math.PI * 0.08,
        arcEnd = Math.PI * 1.2,
        totalIntensity = 20,
        height = 0.07,
        debug = false
    }: {
        lightCount?: number;
        radius?: number;
        zOffset?: number;
        yOffset?: number;
        arcStart?: number;
        arcEnd?: number;
        totalIntensity?: number;
        height?: number;
        debug?: boolean;
    } = {}
): THREE.Object3D[] => {

    const added: THREE.Object3D[] = [];

    // ---- derived values ----
    const intensity = totalIntensity / lightCount;
    const deltaAngle = (arcEnd - arcStart) / lightCount;

    // Exact arc chord width per segment
    const width = 2 * radius * Math.tan(deltaAngle / 2);

    const color = new THREE.Color().setHSL(0.575, 1.0, 0.49);

    const inwardTarget = new THREE.Vector3();

    for (let side = -1; side <= 1; side += 2) {

        for (let i = 0; i < lightCount; i++) {
            // center segments on arc
            const t = (i + 0.5) / lightCount;
            const angle = arcStart + t * (arcEnd - arcStart);

            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius + yOffset;
            const z = zOffset * side;

            const light = new THREE.RectAreaLight(
                color,
                intensity,
                width,
                height
            );

            light.position.set(x, y, z);

            // ---- robust orientation ----
            // Face inward toward arc center at same height
            inwardTarget.set(0, yOffset, z);
            light.lookAt(inwardTarget);

            // Align tangentially along arc
            // light.rotatez(Math.atan2(y, x));
            light.rotateZ(Math.PI / 2);

            added.push(light);

            // ---- optional debug visualization ----
            if (debug) {
                const plane = new THREE.Mesh(
                new THREE.PlaneGeometry(width, height),
                new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    side: THREE.DoubleSide,
                    wireframe: true
                })
                );

                plane.position.copy(light.position);
                plane.quaternion.copy(light.quaternion);
                added.push(plane);
            }
        }
    }
    added.forEach(obj => {
        if (obj instanceof THREE.RectAreaLight) {
            obj.castShadow = false;           // unnecessary anyway
            obj.power = obj.intensity * 0.4;  // if using physicallyCorrectLights=true
        }
    });

    return added;
};
/*
export const addTSALights = (): THREE.Object3D[] => {
    const added: THREE.Object3D[] = [];
    // ---- tuning knobs ----
    const LIGHT_COUNT = 10;
    const RADIUS = 1.02;
    const Z_OFFSET = 1.03;
    const Y_OFFSET = -0.05;

    const ARC_START = -Math.PI * 0.08;
    const ARC_END   =  Math.PI * 1.2;

    const TOTAL_INTENSITY = 50;      // matches your original energy
    const INTENSITY = TOTAL_INTENSITY / LIGHT_COUNT;

    let width = 0.35;
    const height = 0.07;

    const color = new THREE.Color().setHSL(0.575, 1.0, 0.49);

    const getRectFromI = (i: number, side: number): {
        position: THREE.Vector3,
        rotation: THREE.Vector3
    } => {
        const t = i / LIGHT_COUNT;
        const angle = ARC_START + (t * (ARC_END - ARC_START));

        const x = Math.cos(angle) * RADIUS;
        const y = Math.sin(angle) * RADIUS + Y_OFFSET;
        const z = Z_OFFSET * side;

        const tangentAngle = angle + Math.PI / 2;
        return {
            position: new THREE.Vector3(x, y, z),
            rotation: new THREE.Vector3(
                Math.PI / 2,
                tangentAngle,
                0
            )
        };
    };
    const rectA = getRectFromI(3, 1);
    const rectB = getRectFromI(4, 1);
    const aFin = new THREE.Vector2(
        rectA.position.x + (Math.cos(rectA.rotation.y) * 5),
        rectA.position.y + (Math.sin(rectA.rotation.y) * 5),
    );
    const bFin = new THREE.Vector2(
        rectB.position.x + (Math.cos(rectB.rotation.y) * -5),
        rectB.position.y + (Math.sin(rectB.rotation.y) * -5),
    );

    const p = getLineSegmentIntersection(rectA.position, aFin, rectB.position, bFin);
    if (p) {
        // Pythagoras!

        // c
        width = Math.sqrt(
            // a^2
            (rectA.position.x - p.x) ** 2 +
            // b^2
            (rectA.position.y - p.y) ** 2
        ) * 2;
    } else {
        console.error("Lines do not connect! add more segments");
    }

    // ---- build arc lights ----
    for (let side = -1; side <= 1; side += 2) {

        for (let i = 0; i < LIGHT_COUNT; i++) {
            const { position, rotation } = getRectFromI(i, side);

            const light = new THREE.RectAreaLight(
                color,
                INTENSITY,
                width,
                height
            );
            light.position.set(...position.toArray());
            light.rotation.set(...rotation.toArray());

            // debug
            if (false) {
                const p = new THREE.Mesh(new THREE.PlaneGeometry(width, height));
                p.material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide});
                p.position.set(...position.toArray());
                p.rotation.set(...rotation.toArray());
                added.push(p);
            }

            added.push(light);
        }
    }

    return added
};
*/
