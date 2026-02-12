import { FC, JSX, SVGAttributes } from "react";

export type IconProps = {
    className?: SVGAttributes<SVGSVGElement>["className"],
    width?: SVGAttributes<SVGSVGElement>["width"],
    height?: SVGAttributes<SVGSVGElement>["height"],
    fill?: SVGAttributes<SVGSVGElement>["fill"],
    onClick?: SVGAttributes<SVGSVGElement>["onClick"],
    stroke?: SVGAttributes<SVGSVGElement>["stroke"],
}


export function iconTemplate(viewBox: string, children: JSX.Element): FC<IconProps> {
    const IconTemp: FC<IconProps> = ({fill, width, height, stroke, className}) => {
        return <svg viewBox={viewBox} fill={fill} stroke={stroke} height={height} width={width} className={className}>
            {children}
        </svg>;
    };
    return IconTemp; 
};