"use client";
import { cC } from "@/util";
import { Country } from "@/util/countries";
import { FC, useMemo, useRef } from "react";
import CityPoints from "./components/CityPoints";
import GlassHover from "./components/GlassBtn";
import GridSvg from "./components/GridSvg";
import useTransform from "./components/useTransform";
import styles from "./map.module.scss";

type MapProps = {
    className?: string,
    includeCities?: boolean,
    text?: string,
};

const [svgWidth, svgHeight] = [1380, 1000];
const Map: FC<MapProps> = ({className, includeCities: ic, text: txt}) => {
    const citiesContRef = useRef<SVGGElement>(null);
    const countriesGRef = useRef<SVGGElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const gridContainerRef = useRef<HTMLDivElement>(null);

    const { initTransformString, screenToSvg } = useTransform(
        svgRef, svgWidth, svgHeight,
        (t: string) => {
            const countriesG = countriesGRef.current;
            const citiesCont = citiesContRef.current;
            if(!countriesG || !citiesCont)
                return;
            countriesG.setAttribute("transform", t);
            citiesCont.setAttribute("transform", t);
        }
    );

    const includeCities = ic??true;
    const landColor = "#fbf8f2";

    const config = useMemo(() => {return {
        start: [-500, -860] as [number, number],
        end: [2300, 2050] as [number, number],
        count: 45
    };}, []);

    return <>
        <div ref={gridContainerRef} className={styles.pContainer} >
            <GridSvg parentRef={gridContainerRef} viewBoxWidth={svgWidth} viewBoxHeight={svgHeight} config={config} stroke="black" strokeWidth={1}/>
        </div>


        <div className={cC(styles.mapContainer, className)}>
            <svg ref={svgRef} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>


                <g ref={countriesGRef}  transform={initTransformString}>
                    <circle cx={0} cy={0} r="2" fill="red" />
                    <circle cx={680} cy={500} r="2" fill="red" />

                    <Country strokeWidth={1} stroke="black" name="kyrgyzstan" fill={landColor} />
                    <Country strokeWidth={1} stroke="black" name="india" fill={landColor} />
                    <Country strokeWidth={1} stroke="black" name="china" fill={landColor} />
                    <Country strokeWidth={1} stroke="black" name="kazakhstan" fill={landColor} />

                    {
                        txt && <text fontFamily="WeirdSerif" className="select-none" letterSpacing={0} color="red" x="41.5%" y="60%" fontSize={80} textAnchor="middle" fill="red" fontStyle="italic" fontWeight="600">
                            {txt}
                        </text>
                    }
                </g>



                <g ref={citiesContRef} transform={initTransformString} >
                    {includeCities && <CityPoints parentRef={citiesContRef} screenToSvg={screenToSvg}/>}
                </g>

            </svg>
            {/*<ChinaSvg fill={landColor} stroke={landColor} strokeWidth="1" height="550px"/>*/}
        </div>

        {<GlassHover/>}
    </>;
};

export default Map;
