import { effectEvent, unbindEffects, useFramedEffectEvent, VoidFn } from "@/util";
import { RefObject, useCallback, useEffect, useRef } from "react";

type useTransformReturn = {
    initTransformString: string,
    screenToSvg: (clientX: number, clientY: number) => { x: number, y: number }
};

// left = 0
// middle = 1
const dragButton: MouseEvent["button"] = 0;
const useTransform = (svgRef: RefObject<SVGElement | null>, svgWidth: number, svgHeight: number, moveEnabled: boolean, onUpdate: (transString: string) => void): useTransformReturn => {
    const parentRectRef = useRef<DOMRect | null>(null);
    const scale = useRef(1.791907);
    const translate = useRef<{ x: number, y: number }>({
        x: -16.731383773391954,
        y: 61.25564161599507
    });

    const getTransformString = (): string => {
        return `translate(${translate.current.x.toFixed(4)} ${translate.current.y.toFixed(4)}) scale(${scale.current.toFixed(4)})`;
    };

    const changeTransform = useCallback((transl?: { x: number, y: number }, scl?: number) => {
        if (!moveEnabled)
            return;
        if (transl)
            translate.current = transl;
        if (scl)
            scale.current = scl;
        console.log(translate.current);
        console.log(scale.current);

        const t = getTransformString();
        onUpdate(t);
    }, [moveEnabled]);


    const screenToSvg = useCallback((clientX: number, clientY: number): { x: number, y: number } => {
        const offset = parentRectRef.current;
        if (!offset)
            throw new Error("No parent rect");

        const x = svgWidth * (clientX - offset.left) / offset.width;
        const y = svgHeight * (clientY - offset.top) / offset.height;
        return {
            x: (x - translate.current.x) / scale.current,
            y: (y - translate.current.y) / scale.current
        };
    }, []);

    useFramedEffectEvent(
        "wheel",
        (ev) => {
            if (!moveEnabled)
                return;
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
        [moveEnabled],
        (ev) => {
            if (moveEnabled)
                ev.preventDefault()
        },
        undefined,
        () => svgRef.current!.parentElement!.parentElement
    );


    useEffect(() => {
        const es: VoidFn[] = [];
        const parent = svgRef.current;

        if (parent) {
            let updateTimeout: null | any = null;
            es.push(() => {
                if (updateTimeout)
                    clearTimeout(updateTimeout)
            });
            const updateRect = () => {
                if (updateTimeout)
                    clearTimeout(updateTimeout)

                if (!parentRectRef.current)
                    parentRectRef.current = parent.getBoundingClientRect();

                updateTimeout = setTimeout(() => {
                    parentRectRef.current = parent.getBoundingClientRect();
                }, 50);
            };

            updateRect();
            const ro = new ResizeObserver(updateRect);
            ro.observe(document.body);
            ro.observe(parent);

            es.push(() => ro.disconnect());
            const unbindDrag: { current: null | VoidFn } = { current: null };
            es.push(() => {
                if (unbindDrag.current) {
                    unbindDrag.current();
                    unbindDrag.current = null;
                }
            });
            const mouseUp = (ev: MouseEvent) => {
                if (ev.button !== dragButton)
                    return;
                if (unbindDrag.current) {
                    unbindDrag.current();
                    unbindDrag.current = null;
                }
            };

            es.push(effectEvent("mousedown", (downEv) => {
                if (downEv.button !== dragButton)
                    return;

                if (unbindDrag.current) {
                    unbindDrag.current();
                    unbindDrag.current = null;
                }

                const starting = screenToSvg(downEv.clientX, downEv.clientY);
                unbindDrag.current = effectEvent("mousemove", (ev) => {
                    const current = screenToSvg(ev.clientX, ev.clientY);
                    const diff = {
                        x: (current.x - starting.x) * scale.current,
                        y: (current.y - starting.y) * scale.current,
                    };
                    changeTransform({
                        x: translate.current.x + diff.x,
                        y: translate.current.y + diff.y,
                    });
                });
            }, undefined, parent));


            es.push(effectEvent("mouseup", mouseUp));
            es.push(effectEvent("mouseleave", mouseUp));
        }


        return unbindEffects(es);
    }, []);

    return {
        initTransformString: getTransformString(),
        screenToSvg
    };
};

export default useTransform;
