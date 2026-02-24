import { unbindEffects, useFramedEffectEvent, VoidFn } from "@/util";
import { RefObject, useCallback, useEffect, useRef } from "react";

type useTransformReturn = {
    initTransformString: string,
    screenToSvg: (clientX: number, clientY: number) => {x: number, y: number}
};

const useTransform = (svgRef: RefObject<SVGElement | null>, svgWidth: number, svgHeight: number, onUpdate: (transString: string) => void): useTransformReturn => {
    const parentRectRef = useRef<DOMRect | null>(null);
    const scale = useRef(1);
    const scrollEv = useRef({clientX: 0, clientY: 0, deltaY: 0});
    const translate = useRef<{x: number, y: number}>({
        x: 0,
        y: 0 
    });

    const getTransformString = (): string => {
        return `translate(${translate.current.x.toFixed(4)} ${translate.current.y.toFixed(4)}) scale(${scale.current.toFixed(4)})`;
    };

    const changeTransform = useCallback((transl?: {x: number, y: number}, scl?: number) => {
        if(transl)
            translate.current = transl;
        if(scl)
            scale.current = scl;

        const t =  getTransformString();
        onUpdate(t);
    }, []);


    const screenToSvg = useCallback((clientX: number, clientY: number): {x: number, y: number} => {
        const offset = parentRectRef.current;
        if(!offset)
            throw new Error("No parent rect");

        const x = svgWidth * (clientX - offset.x) / offset.width;
        const y = svgHeight * (clientY - offset.y) / offset.height;
        return {
            x: (x - translate.current.x ) / scale.current,
            y: (y - translate.current.y ) / scale.current
        };
    }, []);

    useFramedEffectEvent(
        "wheel",
        (ev) => {
            const zoomScale = Math.max(Math.min(1 - ev.deltaY / 2000, 2), 0.1);  // >1 in, <1 out

            const oldScale = scale.current;

            let newScale = oldScale * zoomScale;
            newScale = Math.min(Math.max(newScale, 0.2), 10);
            if (Math.abs(newScale - oldScale) < 1e-4) return;

            const amt = oldScale - newScale;

            const pSvg = screenToSvg(ev.clientX, ev.clientY); // content coords

            const newTranslate = {
                x: translate.current.x + pSvg.x * amt,
                y: translate.current.y + pSvg.y * amt,
            };

            changeTransform(newTranslate, newScale);
        },
        [],
        (ev) => ev.preventDefault(),
        undefined,
        () => svgRef.current!.parentElement!.parentElement
    );


    useEffect(() => {
        const es: VoidFn[] = [];
        const parent = svgRef.current;
        const scrollParent = parent?.parentElement?.parentElement;
        if (parent) {
            const updateRect = () => {
                parentRectRef.current = parent.getBoundingClientRect();
            };

            updateRect();
            const ro = new ResizeObserver(updateRect);
            ro.observe(parent);

            es.push(() => ro.disconnect());
        }

        if(scrollParent) {
            /*
            es.push(effectEvent("wheel", (ev) => {
                ev.preventDefault();

                const zoomScale = Math.max(Math.min(1 - ev.deltaY / 2000, 2), 0.1);  // >1 in, <1 out


                const oldScale = scale.current;

                let newScale = oldScale * zoomScale;
                newScale = Math.min(Math.max(newScale, 0.2), 10);
                if (Math.abs(newScale - oldScale) < 1e-4) return;

                const amt = oldScale - newScale;

                const pSvg = screenToSvg(ev.clientX, ev.clientY); // content coords

                const newTranslate = {
                    x: translate.current.x + pSvg.x * amt,
                    y: translate.current.y + pSvg.y * amt,
                };

                changeTransform(newTranslate, newScale);
            }, undefined, scrollParent));
            */
        }

        return unbindEffects(es);
    }, []);

    return {
        initTransformString: getTransformString(),
        screenToSvg
    };
};

export default useTransform;
