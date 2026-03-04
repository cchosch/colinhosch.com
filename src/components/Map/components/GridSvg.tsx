import { FC, RefObject, SVGAttributes, useEffect, useRef, useState } from "react";

type GridSvgProps = {
    viewBoxWidth: number,
    viewBoxHeight: number,
    config: {
        density: number,
    },
    screenToSvg?: (x: number, y: number) => { x: number, y: number };
    parentRef: RefObject<HTMLDivElement | null>
} & SVGAttributes<SVGPathElement>;

const decimalAccuracy = 4;
const [width, height] = [1360, 1000];
const GridSvg: FC<GridSvgProps> = ({ parentRef, config, opacity, strokeWidth, stroke }) => {
    const [viewBoxWidth, viewBoxHeight] = [width, height];
    const countRef = useRef<null | { x: number, y: number }>(null);

    const gridSpace = config.density;
    const [, setCenter] = useState<[number, number]>([0, 0]);
    const [path, setPath] = useState("");

    const updatePath = () => {
        const parent = parentRef.current;
        if (!parent) return;

        const bounding = parent.getBoundingClientRect();
        const firstChild = parent.children[0] as HTMLElement | undefined;
        if (!firstChild) return;

        const childBounding = firstChild.getBoundingClientRect();

        const transformX = (x: number): number =>
            viewBoxWidth * ((x - childBounding.x) / childBounding.width);

        const transformY = (y: number): number =>
            viewBoxHeight * ((y - childBounding.y) / childBounding.height);


        let [startX, startY] = [transformX(bounding.x), transformY(bounding.y)];
        let [endX, endY] = [transformX(bounding.x + bounding.width), transformY(bounding.y + bounding.height)];

        const innerWidth = endX - startX;
        const innerHeight = endY - startY;

        const countX = Math.floor(innerWidth / gridSpace) + 3;
        const countY = Math.floor(innerHeight / gridSpace) + 3;

        const oldCount = countRef.current;
        if (oldCount && countX === oldCount.x && countY === oldCount.y)
            return;

        countRef.current = {
            x: countX,
            y: countY
        };

        const yPad = (((innerHeight / gridSpace) % 1) * gridSpace) / 2;
        const xPad = (((innerWidth / gridSpace) % 1) * gridSpace) / 2;

        const c: [number, number] = [
            startX + (innerWidth / 2),
            startY + (innerHeight / 2)
        ];
        setCenter(c);


        startX += xPad - gridSpace;
        startY += yPad - gridSpace;
        endX -= xPad - gridSpace;
        endY -= yPad - gridSpace;

        const ps = [];
        for (let i = 0; i < countY; i++) {
            const y = (startY + (i * gridSpace)).toFixed(decimalAccuracy);
            ps.push(`M${startX.toFixed(decimalAccuracy)},${y} ${endX.toFixed(decimalAccuracy)},${y}`);
        }

        for (let i = 0; i < countX; i++) {
            const x = (startX + (i * gridSpace)).toFixed(decimalAccuracy);
            ps.push(`M${x},${startY.toFixed(decimalAccuracy)} ${x},${endY.toFixed(decimalAccuracy)}`);
        }

        setPath(ps.join(" "));
    };

    useEffect(() => {
        updatePath();

        const parent = parentRef.current;
        if (!parent)
            return;

        let frameId: number | null = null;
        const ro = new ResizeObserver((_e) => {
            if (frameId !== null) {
                return;
            }
            frameId = requestAnimationFrame(() => {
                updatePath();
                frameId = null;
            });
        });
        ro.observe(parent);

        return () => ro.disconnect();
    }, []);

    return <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
        <path opacity={opacity} fill="none" strokeWidth={strokeWidth} stroke={stroke} d={path} />;
        {/*<circle r={4} fill="red" cx={center[0]} cy={center[1]}/>*/}
    </svg>;
};

export default GridSvg;