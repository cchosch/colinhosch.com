import { FC, useMemo } from "react";

type GridSvgProps = {
    viewBoxWidth: number,
    viewBoxHeight: number,
    config: {
        start: [number, number],
        end: [number, number],
        count: number
    },
    strokeWidth: number,
    stroke: string
};

const GridSvg: FC<GridSvgProps> = ({viewBoxWidth, viewBoxHeight, config, strokeWidth, stroke}) => {
    const paths = useMemo(() => {
        const ps = [];
        const startX = config.start[0];
        const startY = config.start[1];
        const endX = config.end[0];
        const endY = config.end[1];
        const spaceX = (endX-startX)/(config.count-1);
        const spaceY = (endY-startY)/(config.count-1);
        for(let i = 0; i < config.count; i++) {
            let start = [startX, startY + (i * spaceX)];
            let end = [endX, startY + (i * spaceX)];
            ps.push(`M${start[0]},${start[1]} ${end[0]},${end[1]}`);
        }

        for(let i = 0; i < config.count; i++) {
            let start = [startX + (i * spaceY), startY ];
            let end = [startX + (i * spaceY), endY ];
            ps.push(`M${start[0]},${start[1]} ${end[0]},${end[1]}`);
        }

        return ps.map((d, i) => {
            return <path key={i} strokeWidth={strokeWidth} stroke={stroke} d={d}/>;
        });
    }, [config, strokeWidth, stroke]);

    return <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
        {paths}
    </svg>
};

export default GridSvg;