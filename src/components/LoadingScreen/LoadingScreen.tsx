"use client";
import Check from "@/Icon/Check";
import { cC, effectEvent } from "@/util";
import { useSubscribeAssets } from "@/util/AssetManager/assetLoader.client";
import { type LoadWaitEvent } from "@/util/loadingState";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./loadingscreen.module.scss";

export const LoadingEvents = {
    INIT_WAIT: "init",
    FINISH_WAIT: "done",
};

type ProgressBar = {
    total: number,
    loaded: number,
    percentage: number
};

const useProgBar = (): ProgressBar | null => {
    const [prog, setProg] = useState<ProgressBar | null>(null);

    useSubscribeAssets(setProg);

    return prog;
};


const disabled = false;
const LoadingScreen = () => {
    const loadingScreen = useRef<HTMLDivElement>(null);
    const statusRef = useRef<HTMLDivElement>(null);
    const [waitingFor, setWaitingFor] = useState<string[]>(["fonts"]);
    const fb = useRef<boolean>(false);
    const pb = useProgBar();

    const addLoadingBlock = (id: string) => {
        console.debug(`Add: ${id}`);
        setWaitingFor(wf => {
            if (wf.includes(id))
                return wf;
            return [...wf, id];
        });

        if (!fb.current) {
            fb.current = true;
        }
    };

    const haveLoadingBlock = useCallback((id: string): boolean => {
        return waitingFor.find(v => v === id) !== undefined;
    }, [waitingFor]);

    const removeLoadingBlock = (id: string) => {
        console.debug(`Remove: ${id}`);
        setWaitingFor((wF) => {
            for (let i = 0; i < wF.length; i++) {
                if (wF[i] === id) {
                    wF = wF.filter((_, j) => i !== j);
                    break;
                }
            }
            return [...wF];
        });
    };


    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
        document.fonts.ready.finally(() => {
            removeLoadingBlock("fonts");
        });

        return effectEvent("message", (ev) => {
            const loadEvent: LoadWaitEvent | null = ev.data?.loadEvent;
            if (!loadEvent) return;

            let id = `${loadEvent.id}:${loadEvent.name}`;
            if (!loadEvent.unique)
                id = id.split(":")[1];

            switch (loadEvent.status) {
                case LoadingEvents.INIT_WAIT:
                    console.log("recv add");
                    addLoadingBlock(id);
                    break;
                case LoadingEvents.FINISH_WAIT:
                    removeLoadingBlock(id);
            }
        }, undefined, window);
    }, []);

    const percentage = useMemo(() => pb?.percentage ?? 0, [pb]);

    const currStage = useMemo(() => {
        if (haveLoadingBlock("fonts"))
            return 1;
        if (percentage !== 100)
            return 2;
        if (haveLoadingBlock("first_frame") || waitingFor.length !== 0)
            return 3;
        console.log(waitingFor.length);
        return 4;
    }, [haveLoadingBlock, percentage, waitingFor]);
    const maxStage = 4;

    useEffect(() => {
        if (currStage === maxStage && !disabled) {
            loadingScreen.current?.classList.remove(styles.active);
        }
    }, [currStage]);

    useEffect(() => {
        const statCont = statusRef.current;
        if (!statCont)
            return;

        const p = Math.min(currStage - 1, maxStage - 2) / (maxStage - 2);
        statCont.setAttribute("style", `--loading-height: calc(${(p * 100).toFixed(2)}% - ${(p * 0.8).toFixed(3)}rem)`);

    }, [currStage]);

    return <div ref={loadingScreen} className={cC(styles.loadingScreen, styles.active)}>
        <div className={styles.loadingContent}>
            <svg viewBox="0 0 90 40" className={styles.loadingSvg}>
                <circle r="10" cx="15" cy="15" data-x="1"></circle>
                <circle r="10" cx="45" cy="15" data-x="2"></circle>
                <circle r="10" cx="75" cy="15" data-x="3"></circle>
            </svg>
            <div ref={statusRef} className={styles.statusCont}>
                <div className={cC(styles.loadCheck, styles.fontCheck, currStage >= 2 ? styles.success : "")}>
                    <Check />
                    Typefaces
                </div>
                <div className={cC(styles.progBarCont, styles.loadCheck, currStage >= 3 ? styles.success : "")}>
                    <Check />
                    <div>Assets {pb?.loaded ?? 0}/{pb?.total ?? '?'} ({percentage.toFixed().padStart(3, "_")}%)</div>
                    <div style={{ "--loaded": `${percentage.toFixed(3)}%` } as any} className={styles.progBar} />
                </div>
                <div className={cC(styles.loadCheck, currStage >= 4 ? styles.success : "")}>
                    <Check />
                    Render
                </div>
            </div>
        </div>
    </div>;
};

export default LoadingScreen;