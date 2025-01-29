import { FC, JSX, SVGAttributes } from "react";

export type IconProps = {
    className?: SVGAttributes<SVGSVGElement>["className"],
    width?: SVGAttributes<SVGSVGElement>["width"],
    height?: SVGAttributes<SVGSVGElement>["height"],
    fill?: SVGAttributes<SVGSVGElement>["fill"],
    onClick?: SVGAttributes<SVGSVGElement>["onClick"],
}


export function iconTemplate(viewBox: string, children: JSX.Element): FC<IconProps> {
    const IconTemp: FC<IconProps> = ({fill, width, height, className}) => {
        return <svg viewBox={viewBox} fill={fill} height={height} width={width} className={className}>
            {children}
        </svg>;
    };
    return IconTemp; 
};