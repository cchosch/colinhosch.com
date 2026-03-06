"use client";
import { useFramedEffectEvent } from "@/util";
import * as d3 from "d3-geo";
import { FC, RefObject, SVGAttributes, useCallback, useMemo } from "react";
import locations, { CityDetails } from "../../../util/cities";

type CityPointsProps = {
    screenToSvg: (clientX: number, clientY: number) => { x: number, y: number },
    parentRef: RefObject<SVGElement | null>,
    activeCities: { id: string, lat: number, lon: number, tier: number, name: string }[]
}

const [pointWidth, pointHeight] = [747, 550];
const pointHoverTolerance = 400;
const CityPoints: FC<SVGAttributes<SVGGElement> & CityPointsProps> = (props) => {
    const { screenToSvg, parentRef, activeCities } = props;

    const projection = useMemo(() => d3.geoMercator().center([103.1, 38.5]).scale(724.5).translate([pointWidth / 2, pointHeight / 2]), []);

    const updateCityPings = useCallback((ev: { clientX: number, clientY: number }) => {
        const citiesCont = parentRef.current;
        if (!citiesCont)
            return;

        const cities = citiesCont.children;
        const { x, y } = screenToSvg(ev.clientX, ev.clientY);

        updatePoints(cities, x, y);
    }, []);

    const locArr = useMemo(() => Object.entries(locations).map(([t, n]) => {
        return [];
        return Object.keys(n).map((key) => {
            return [
                key,
                {
                    ...n[key],
                    tier: parseFloat(t.substring(1))
                }
            ] as [
                    string,
                    CityDetails[0] & { tier: number }
                ];
        });
    }).flat(), []);
    /*
    */

    useFramedEffectEvent(
        "mousemove",
        updateCityPings,
        []
    );

    return <>
        {activeCities.filter(c => c.tier < 4).map(({ lat, lon, name }) => {
            const [x, y] = projection([lon, lat])!;
            const tX = x;
            const tY = y;

            return <circle cy={tY.toFixed(4)} cx={tX.toFixed(4)} data-location={name} key={name} r="2" fill="red" />;
        })}
        {locArr.filter(([_l, { tier }]) => tier < 4).map(([loc, coords]) => {
            const [x, y] = projection([coords.lon, coords.lat])!;
            const tX = x;
            const tY = y;

            return <circle cy={tY.toFixed(4)} cx={tX.toFixed(4)} data-location={loc} key={loc} r="2" fill="red" />;
        })}
    </>;
};

function updatePoints(cities: HTMLCollection, x: number, y: number) {
    let closest: [number, Element] | null = null;

    for (let i = 0; i < cities.length; i++) {
        const cx = parseFloat(cities[i].getAttribute("cx") ?? "NaN");
        const cy = parseFloat(cities[i].getAttribute("cy") ?? "NaN");
        if (isNaN(cx) || isNaN(cy))
            continue;

        if (x > cx + pointHoverTolerance || x < cx - pointHoverTolerance)
            continue;
        if (y > cy + pointHoverTolerance || y < cy - pointHoverTolerance)
            continue;

        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (!closest || closest[0] > dist)
            closest = [dist, cities[i]];

        // 1 when on top of dot, 0 when {pointHoverTolerance} svg units away from dot.
        let proximity = (1 - (dist / pointHoverTolerance));
        proximity = Math.pow(proximity, 6);
        cities[i].setAttribute("r", Math.max(2, 5 * proximity).toFixed(4));
    }
}

export default CityPoints;