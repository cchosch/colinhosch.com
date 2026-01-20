/**
 * @param classes class names to combine
 * @returns class names separated by a space
 */
export const cC = (...classes: (string | undefined)[]): string => {
    return classes.filter(v => v).join(" ");
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