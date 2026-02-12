"use client";
import Check from "@/Icon/Check";
import { cC, effectEvent } from "@/util";
import { useSubscribeAssets } from "@/util/assetLoader";
import { type LoadWaitEvent } from "@/util/loadingState";
import { useEffect, useRef, useState } from "react";
import styles from "./loadingscreen.module.scss";

type ProgressBar = {
    total: number,
    loaded: number
};

const useProgBar = (): ProgressBar | null => {
    const [prog, setProg] = useState<ProgressBar | null>(null);

    useSubscribeAssets((a) => {
        setProg({
            loaded: a.loaded,
            total: a.total,
        });
    });

    return prog;
};

const LoadingScreen = () => {
    const loadingScreen = useRef<HTMLDivElement>(null);
    const [waitingFor, setWaitingFor] = useState<string[]>(["fonts"]);
    const fb = useRef<boolean>(false);
    const pb = useProgBar();

    const addLoadingBlock = (id: string) => {
        console.debug(`Add: ${id}`);
        setWaitingFor(wf => {
            if(wf.includes(id))
                return wf;
            return [...wf, id];
        });

        if(!fb.current) {
            fb.current = true;
        }
    };

    const haveLoadingBlock = (id: string): boolean => {
        return waitingFor.find(v => v === id) !== undefined;
    };

    const removeLoadingBlock = (id: string) => {
        setWaitingFor((wF) => {
            console.debug(`Remove: ${id}`);
            console.debug(wF);
            for(let i = 0; i < wF.length; i++) {
                if(wF[i] === id) {
                    wF = wF.filter((_, j) => i !== j);
                    break;
                }
            }
            console.debug(wF);
            return [...wF];
        });
    };

    useEffect(() => {
        if(waitingFor.length === 0 && fb.current)
            loadingScreen.current?.classList.remove(styles.active);
    }, [waitingFor]);

    useEffect(() => {
        document.fonts.ready.finally(() => {
            removeLoadingBlock("fonts");
        });

        return effectEvent("message", (ev) => {
            const loadEvent: LoadWaitEvent | null = ev.data?.loadEvent;
            if (!loadEvent) return;

            let id = `${loadEvent.id}:${loadEvent.name}`;
            if(!loadEvent.unique)
                id = id.split(":")[1];

            switch(loadEvent.status) {
                case "init":
                    if(haveLoadingBlock(id))
                        return;
                    addLoadingBlock(id);
                    break;
                case "done":
                    removeLoadingBlock(id);
            }
        }, undefined, window);
    }, []);

    const percentage = pb ? (pb.loaded / Math.max(pb.total, 1))*100 : 0;
    const assetsLoaded = percentage === 100;
    console.log(percentage);
    return <div ref={loadingScreen} className={cC(styles.loadingScreen, styles.active)}>
        <div className={styles.loadingContent}>
            <svg viewBox="0 0 90 40" className={styles.loadingSvg}>
                <circle r="10" cx="15" cy="15" data-x="1"></circle>
                <circle r="10" cx="45" cy="15" data-x="2"></circle>
                <circle r="10" cx="75" cy="15" data-x="3"></circle>
            </svg>
            <div>
                <div className={cC(styles.loadCheck, styles.fontCheck, haveLoadingBlock("fonts") ? "" : styles.success)}>
                    <Check />
                    Typefaces
                </div>
                <div className={cC(styles.progBarCont, styles.loadCheck, assetsLoaded ? styles.success : "")}>
                    <Check />
                    <div>Assets {pb?.loaded??0}/{pb?.total??'?'} ({percentage.toFixed().padStart(3, " ")}%)</div>
                    <div style={{"--loaded": `${percentage.toFixed(3)}%`} as any} className={styles.progBar}/>
                </div>
                <div className={cC(styles.loadCheck, (!assetsLoaded || haveLoadingBlock("first_frame")) ? "" : styles.success)}>
                    <Check />
                    Render
                </div>
            </div>
        </div>
    </div>;
};

export default LoadingScreen;