"use client";
import { cC } from "@/util";
import { Country } from "@/util/countries";
import { FC, useMemo, useRef, useState } from "react";
import CityPoints from "./components/CityPoints";
import GlassHover from "./components/GlassBtn";
import GridSvg from "./components/GridSvg";
import useTransform from "./components/useTransform";
import styles from "./map.module.scss";

type MapProps = {
    className?: string,
    includeCities?: boolean,
    text?: string,
    activeCities: { name: string, lat: number, lon: number, tier: number, id: string }[]
};

const [svgWidth, svgHeight] = [1360, 1000];
const Map: FC<MapProps> = ({
    className,
    includeCities: ic,
    text: txt,
    activeCities
}) => {
    const citiesContRef = useRef<SVGGElement>(null);
    const countriesGRef = useRef<SVGGElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const gridContainerRef = useRef<HTMLDivElement>(null);
    const [transformEnabled, _setTransformEnabled] = useState(false);

    const { initTransformString, screenToSvg } = useTransform(
        svgRef, svgWidth, svgHeight, transformEnabled,
        (t: string) => {
            const countriesG = countriesGRef.current;
            const citiesCont = citiesContRef.current;
            if (!countriesG || !citiesCont)
                return;
            countriesG.setAttribute("transform", t);
            citiesCont.setAttribute("transform", t);
        }
    );

    const includeCities = ic ?? true;
    const landColor = "#fbf8f2";

    const config = useMemo(() => {
        return {
            // every 50 svg units
            density: 50
        };
    }, []);

    return <>
        <div ref={gridContainerRef} className={styles.pContainer} >
            <GridSvg parentRef={gridContainerRef} viewBoxWidth={svgWidth} viewBoxHeight={svgHeight} config={config} stroke="#555" opacity={0.2} strokeWidth={1} />
        </div>


        <div className={cC(styles.mapContainer, className)}>

            <svg ref={svgRef} style={{ opacity: 1 }} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>


                <g ref={countriesGRef} transform={initTransformString}>
                    {/*}
                    <circle cx={0} cy={0} r="2" fill="red" />
                    <circle cx={680} cy={500} r="2" fill="red" />
                    {*/}

                    <Country strokeWidth={1} stroke="black" name="kyrgyzstan" fill={landColor} />
                    {/*<Country strokeWidth={1} stroke="black" name="india" fill={landColor} />*/}
                    <Country strokeWidth={1} stroke="black" name="kazakhstan" fill={landColor} />

                    <Country strokeWidth={1} stroke="black" name="china" fill={landColor} />


                    {
                        txt && <text fontFamily="WeirdSerif" className="select-none" letterSpacing={0} color="red" x="41.5%" y="60%" fontSize={80} textAnchor="middle" fill="red" fontStyle="italic" fontWeight="600">
                            {txt}
                        </text>
                    }
                </g>



                <g ref={citiesContRef} transform={initTransformString} >
                    {includeCities && <CityPoints activeCities={activeCities} parentRef={citiesContRef} screenToSvg={screenToSvg} />}
                    {activeCities.length === 0 && <div>
                        Coming Soon
                    </div>}
                </g>

            </svg>
            {/*<ChinaSvg fill={landColor} stroke={landColor} strokeWidth="1" height="550px"/>*/}
            <GlassHover />
        </div>

    </>;
};

export default Map;
