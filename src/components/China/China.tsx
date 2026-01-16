import ChinaSvg from "@/../public/china.svg";
import { cC } from "@/util";
import * as d3 from "d3-geo";
import { FC } from "react";
import styles from "./china.module.scss";
import locations, { CityDetails } from "./cities";

type ChinaMapProps = {
    className?: string,
    includeCities?: boolean,
    text?: string,
};

const China: FC<ChinaMapProps> = async ({className, includeCities: ic, text: txt}) => {
    const [width, height] = [747, 550];
    const includeCities = ic??false;
    const projection =  d3.geoMercator().center([103.1, 38.5]).scale(724.5).translate([width / 2, height / 2]);
    const chinaColor = "black";

    return <div className={cC(styles.mapContainer, className)}>
        <ChinaSvg fill={chinaColor} stroke={chinaColor} strokeWidth="1" height="550px"/>
        <svg xmlns="http://www.w3.org/2000/svg" className={styles.locationSvg} viewBox="0 0 774.04419 569.64088" >
            {
                txt && <text fontFamily="WeirdSerif" className="select-none" letterSpacing={0} color="red" x="41.5%" y="60%" fontSize={80} textAnchor="middle" fill="red" fontStyle="italic" fontWeight="600">
                    {txt}
                </text>
            }
            {includeCities && Object.entries(locations).map(([t, n]) => {
                return Object.keys(n).map((key) => {
                    return [
                        key,
                        {
                            ...n[key],
                            tier: parseFloat(t.substring(1))
                        }
                    ] as [
                        string,
                        CityDetails[0] & {tier: number}
                    ];
                });
            }).flat().filter(([_l, {tier}]) => tier < 4).map(([loc, coords]) => {
                const [x, y] = projection([coords.lon, coords.lat])!;

                return <circle cy={y.toFixed(4)} cx={x.toFixed(4)} data-bruh-location={loc} key={loc} r="2" fill="red" />;
            })}
        </svg>
    </div>;
};
export default China;
