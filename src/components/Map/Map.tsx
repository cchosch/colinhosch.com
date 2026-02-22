"use client"
import { cC, effectEvent } from "@/util";
import { Country } from "@/util/countries";
import * as d3 from "d3-geo";
import { FC, useEffect, useMemo, useRef } from "react";
import locations, { CityDetails } from "./cities";
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
        x: 100,
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
        y = svgHeight * (y -  offset.y) / offset.height;
        const lensCircle = document.querySelector<SVGCircleElement>("#lensCircle");
const lensMapShape = document.querySelector<SVGCircleElement>("#lensMapShape");

if (lensCircle) {
  lensCircle.setAttribute("cx", x.toFixed(4));
  lensCircle.setAttribute("cy", y.toFixed(4));
}
if (lensMapShape) {
  lensMapShape.setAttribute("cx", x.toFixed(4));
  lensMapShape.setAttribute("cy", y.toFixed(4));
}


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

    return <div className={cC(styles.mapContainer, className)}>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
            <defs>
                <radialGradient id="lensMap" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="rgb(128,128,128)" />
                    <stop offset="70%" stop-color="rgb(255,128,128)" />
                    <stop offset="100%" stop-color="rgb(128,128,128)" />
                </radialGradient>

                <circle id="lensMapShape" cx="0" cy="0" r="80" fill="url(#lensMap)" />

                <mask id="lensMask">
                    <rect width="100%" height="100%" fill="black" />
                    <circle id="lensCircle" cx="80" cy="80" r="80" fill="white" />
                </mask>

<filter id="magnify"
        x="-50%" y="-50%" width="200%" height="200%"
        color-interpolation-filters="sRGB">
  <feImage
    x="-80" y="-80" width="160" height="160"
    preserveAspectRatio="xMidYMid slice"
    result="map"
    href="data:image/svg+xml;utf8,
      <svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>
        <defs>
          <radialGradient id='g' cx='50%%' cy='50%%' r='50%%'>
            <stop offset='0%%' stop-color='rgb(128,128,128)'/>
            <stop offset='70%%' stop-color='rgb(255,128,128)'/>
            <stop offset='100%%' stop-color='rgb(128,128,128)'/>
          </radialGradient>
        </defs>
        <rect width='160' height='160' fill='url(#g)'/>
      </svg>"
  />

  <feDisplacementMap
    in="SourceGraphic"
    in2="map"
    scale="40"
    xChannelSelector="R"
    yChannelSelector="G"
  />
</filter>

            </defs>

<g>
  {/* normal map */}
  <g opacity="1">
    <circle cx={0} cy={0} r="2" fill="red" />
    <circle cx={680} cy={500} r="2" fill="red" />
    <g transform={`translate(${translate.x.toFixed(4)} ${translate.y.toFixed(4)}) scale(${scale.toFixed(4)})`}>
      <Country strokeWidth={1} stroke="black" name="kyrgyzstan" fill={landColor} />
      <Country strokeWidth={1} stroke="black" name="china" fill={landColor} />
    </g>
  </g>

  {/* distorted copy, clipped to lens mask */}
  <g
    style={{ mask: "url(#lensMask)", filter: "url(#magnify)" }}
    filterUnits="userSpaceOnUse"
  >
    <circle cx={0} cy={0} r="2" fill="red" />
    <circle cx={680} cy={500} r="2" fill="red" />
    <g transform={`translate(${translate.x.toFixed(4)} ${translate.y.toFixed(4)}) scale(${scale.toFixed(4)})`}>
      <Country strokeWidth={1} stroke="black" name="kyrgyzstan" fill={landColor} />
      <Country strokeWidth={1} stroke="black" name="china" fill={landColor} />
    </g>
  </g>
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
    </div>;
};
export default Map;
