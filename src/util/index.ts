import { Vector2, Vector3 } from "three";

/**
 * @param classes class names to combine
 * @returns class names separated by a space
 */
export const cC = (...classes: (string | undefined)[]): string => {
    return classes.filter(v => v).join(" ");
};

/**
 * @param type name of event
 * @param listener listener callback
 * @param options options for event listener
 * @returns function that removes event listener from document
 *
 * allows you to put an event listener in your useEffect without removing the function from the function call
 */
export const effectEvent = <K extends keyof DocumentEventMap>(type: K, listener: (ev: DocumentEventMap[K]) => void, options?: boolean | AddEventListenerOptions | undefined, target?: any): () => void => { // eslint-disable-line
    if (!target)
        target = document;
    target.addEventListener(type, listener, options);
    return () => {
        target.removeEventListener(type, listener, options);
    };
};

type Point = [number, number];

export function cubicInterpolate(points: Point[], x: number): number {
    if (points.length < 2) {
        throw new Error("At least two points are required");
    }

    // Sort by x
    const pts = [...points].sort((a, b) => a[0] - b[0]);

    // Clamp to bounds
    if (x <= pts[0][0]) return pts[0][1];
    if (x >= pts[pts.length - 1][0]) return pts[pts.length - 1][1];

    // Find segment index i such that x is between pts[i] and pts[i+1]
    let i = 0;
    while (i < pts.length - 1 && x > pts[i + 1][0]) {
        i++;
    }

    // Indices for Catmull–Rom: p0, p1, p2, p3
    const i0 = Math.max(0, i - 1);
    const i1 = i;
    const i2 = i + 1;
    const i3 = Math.min(pts.length - 1, i + 2);

    const [_x0, y0] = pts[i0]; // eslint-disable-line
    const [x1, y1] = pts[i1];
    const [x2, y2] = pts[i2];
    const [_x3, y3] = pts[i3]; // eslint-disable-line

    // Normalize x to t in [0, 1] between x1 and x2
    const t = (x - x1) / (x2 - x1);

    // Catmull–Rom spline formula
    const a =
        -0.5 * y0 +
        1.5 * y1 -
        1.5 * y2 +
        0.5 * y3;

    const b =
        y0 -
        2.5 * y1 +
        2 * y2 -
        0.5 * y3;

    const c = -0.5 * y0 + 0.5 * y2;
    const d = y1;

    return ((a * t + b) * t + c) * t + d;
}


export function interpolate(points: Point[], x: number): number {
    if (points.length === 0) {
        throw new Error("No points provided");
    }

    if (points.length === 1) {
        return points[0][1];
    }

    // Ensure points are sorted by x
    const sorted = [...points].sort((a, b) => a[0] - b[0]);

    // Clamp to bounds
    if (x <= sorted[0][0]) {
        return sorted[0][1];
    }

    if (x >= sorted[sorted.length - 1][0]) {
        return sorted[sorted.length - 1][1];
    }

    // Find the segment containing x
    for (let i = 0; i < sorted.length - 1; i++) {
        const [x1, y1] = sorted[i];
        const [x2, y2] = sorted[i + 1];

        if (x >= x1 && x <= x2) {
            const t = (x - x1) / (x2 - x1);
            return y1 + t * (y2 - y1);
        }
    }

    // Should never happen if input is valid
    throw new Error("Interpolation failed");
}

type Vec = Vector2 | Vector3;

/**
 * Calculates the intersection point of two line segments (A,B) and (C,D).
 * @param {number} ax - x coordinate of point A.
 * @param {number} ay - y coordinate of point A.
 * @param {number} bx - x coordinate of point B.
 * @param {number} by - y coordinate of point B.
 * @param {number} cx - x coordinate of point C.
 * @param {number} cy - y coordinate of point C.
 * @param {number} dx - x coordinate of point D.
 * @param {number} dy - y coordinate of point D.
 * @returns {object|boolean} The intersection point {x, y} or false if they don't intersect/are parallel.
 */
export function getLineSegmentIntersection(a: Vec, b: Vec, c: Vec, d: Vec): false | Vector2 {
    const [ax, ay] = [a.x, a.y];
    const [bx, by] = [b.x, b.y];
    const [cx, cy] = [c.x, c.y];
    const [dx, dy] = [d.x, d.y];
    
    const determinant = (bx - ax) * (dy - cy) - (dx - cx) * (by - ay);

    // If the determinant is 0, the lines are parallel or collinear
    if (determinant === 0) {
        return false;
    }

    const lambda = ((dy - cy) * (dx - ax) + (cx - dx) * (dy - ay)) / determinant;
    const gamma = ((ay - by) * (dx - ax) + (bx - ax) * (dy - ay)) / determinant;

    // Check if the intersection point is on both line segments (0 <= value <= 1)
    if (lambda > 0 && lambda < 1 && gamma > 0 && gamma < 1) {
        // Calculate the intersection point
        const x = ax + lambda * (bx - ax);
        const y = ay + lambda * (by - ay);
        return new Vector2(x, y);
    }

    // Otherwise, the infinite lines intersect, but not the segments
    return false;
}