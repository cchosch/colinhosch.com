import { FC, RefObject, useEffect, useState } from "react";

type GridSvgProps = {
    viewBoxWidth: number,
    viewBoxHeight: number,
    config: {
        start: [number, number],
        end: [number, number],
        count: number,
        density?: number,
    },
    strokeWidth: number,
    stroke: string,
    screenToSvg?: (x: number, y: number) => {x: number, y: number};
    parentRef: RefObject<HTMLDivElement | null>
};

const decimalAccuracy = 2;
const GridSvg: FC<GridSvgProps> = ({parentRef, viewBoxWidth, viewBoxHeight, config, strokeWidth, stroke}) => {
    const density = config.density??30;
    const [path, setPath] = useState("");

    useEffect(() => {
        const parent = parentRef.current;
        if(!parent)
            return;

        const bounding = parent.getBoundingClientRect();
        const tR = [bounding.left, bounding.top];
        const bR = [tR[0] + bounding.width, tR[1] + bounding.height];
        

        const ps = [];
        const [startX, startY] = config.start;
        const [endX, endY] = config.end;

        const spaceY = (endY-startY)/(config.count-1);
        for (let i = 0; i < config.count; i++) {
            const y = (startY + i * spaceY).toFixed(decimalAccuracy);
            ps.push(`M${startX.toFixed(decimalAccuracy)},${y} ${endX.toFixed(decimalAccuracy)},${y}`);
        }

        const spaceX = (endX-startX)/(config.count-1);
        for (let i = 0; i < config.count; i++) {
            const x = (startX + i * spaceX).toFixed(decimalAccuracy);
            ps.push(`M${x},${startY.toFixed(decimalAccuracy)} ${x},${endY.toFixed(decimalAccuracy)}`);
        }

        setPath(ps.join(" "));
    }, []);

    return <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
        <path fill="none" strokeWidth={strokeWidth} stroke={stroke} d={path}/>;
    </svg>;
};

export default GridSvg;