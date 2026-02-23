"use client"
import { cC, effectEvent } from "@/util";
import { Country } from "@/util/countries";
import * as d3 from "d3-geo";
import { FC, useEffect, useMemo, useRef } from "react";
import GlassHover from "./Btn";
import locations, { CityDetails } from "./cities";
import GridSvg from "./GridSvg";
import styles from "./map.module.scss";

type MapProps = {
    className?: string,
    includeCities?: boolean,
    text?: string,
};

const [pointWidth, pointHeight] = [747, 550];
const [svgWidth, svgHeight] = [1360, 1000];
const Map: FC<MapProps> = ({className, includeCities: ic, text: txt}) => {
    const citiesContRef = useRef<SVGGElement>(null);
    const includeCities = ic??true;
    const projection =  d3.geoMercator().center([103.1, 38.5]).scale(724.5).translate([pointWidth / 2, pointHeight / 2]);
    const landColor = "#fbf8f2";
    const scale = 1.5;
    const translate = {
        x: 150,
        y: 0
    };
    const locArr = useMemo(() => Object.entries(locations).map(([t, n]) => {
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
    }).flat(), []);

    const updateCityPings = ({clientX: x, clientY: y}: {clientX: number, clientY: number}) => {
        const citiesCont = citiesContRef.current;
        if(!citiesCont)
            return;

        const cities = citiesCont.children;
        const offset = citiesCont.parentElement!.getBoundingClientRect();
        const tolerance = 400;


        x = svgWidth * (x - offset.x) / offset.width;
        y = svgHeight * (y - offset.y) / offset.height;


        let closest: [number, Element] | null = null;

        for(let i = 0; i < cities.length; i++) {
            const cx = parseFloat(cities[i].getAttribute("cx")??"NaN");
            const cy = parseFloat(cities[i].getAttribute("cy")??"NaN");
            if(isNaN(cx) || isNaN(cy))
                continue

            if(x > cx + tolerance || x < cx - tolerance)
                continue;
            if(y > cy + tolerance || y < cy - tolerance)
                continue;

            const dist = Math.sqrt(Math.abs(x - cx)**2 + Math.abs(y - cy)**2)
            if(!closest || closest[0] > dist)
                closest = [dist, cities[i]];

            // 1 when on top of dot, 0 when {tolerance} svg units away from dot.
            let proximity = (1 - (dist / tolerance));
            proximity = Math.pow(proximity, 3)
            cities[i].setAttribute("r", Math.max(2, 5 * proximity).toFixed(4))
        }
    };

    useEffect(() => {
        return effectEvent("mousemove", updateCityPings);
    }, []);
    const config = useMemo(() => {return {
        start: [-50, -410] as [number, number],
        end: [1850, 1600] as [number, number],
        count: 30
    };}, []);

    return <>
        <div className={styles.pContainer} >
            <GridSvg viewBoxWidth={svgWidth} viewBoxHeight={svgHeight} config={config} stroke="black" strokeWidth={1}/>
        </div>

        <GlassHover/>

        <div className={cC(styles.mapContainer, className)}>
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`}>

                <circle cx={0} cy={0} r="2" fill="red" />
                <circle cx={680} cy={500} r="2" fill="red" />

                <g transform={`translate(${translate.x.toFixed(4)} ${translate.y.toFixed(4)}) scale(${scale.toFixed(4)})`}>
                    <Country strokeWidth={1} stroke="black" name="kyrgyzstan" fill={landColor} />
                    <Country strokeWidth={1} stroke="black" name="china" fill={landColor} />
                    <Country strokeWidth={1} stroke="black" name="kazakhstan" fill={landColor} />
                </g>


                {
                    txt && <text fontFamily="WeirdSerif" className="select-none" letterSpacing={0} color="red" x="41.5%" y="60%" fontSize={80} textAnchor="middle" fill="red" fontStyle="italic" fontWeight="600">
                        {txt}
                    </text>
                }

                <g ref={citiesContRef}>
                    {includeCities && locArr.filter(([_l, {tier}]) => tier < 4).map(([loc, coords]) => {
                        const [x, y] = projection([coords.lon, coords.lat])!;
                        const tX = (x * scale) + translate.x;
                        const tY = (y * scale) + translate.y;

                        return <circle cy={tY.toFixed(4)} cx={tX.toFixed(4)} data-location={loc} key={loc} r="2" fill="red" />;
                    })}
                </g>

            </svg>
            {/*<ChinaSvg fill={landColor} stroke={landColor} strokeWidth="1" height="550px"/>*/}
        </div>
    </>;
};
export default Map;
