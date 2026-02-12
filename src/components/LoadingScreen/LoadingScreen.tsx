"use client";
import { cC, effectEvent } from "@/util";
import { subscribeAssets } from "@/util/assetLoader";
import { type LoadWaitEvent } from "@/util/loadingState";
import { useEffect, useRef, useState } from "react";
import styles from "./loadingscreen.module.scss";

type ProgressBar = {
    total: number,
    loaded: number
};

const useProgBar = (): ProgressBar | null => {
    const [prog, setProg] = useState<ProgressBar | null>(null);

    useEffect(() => {
        subscribeAssets((a) => {
            setProg({
                loaded: a.loaded,
                total: a.total,
            });
        });
    }, []);

    return prog;
};

const LoadingScreen = () => {
    const loadingScreen = useRef<HTMLDivElement>(null);
    const waitingFor = useRef<string[]>(["fonts"]);
    const fb = useRef<boolean>(false);
    const pb = useProgBar();

    const addLoadingBlock = (id: string) => {
        console.debug(`Add: ${id}`);
        waitingFor.current.push(id);

        if(!fb.current) {
            fb.current = true;
        }
    };
    const haveLoadingBlock = (id: string): boolean => {
        return waitingFor.current.find(v => v === id) !== undefined;
    };
    const removeLoadingBlock = (id: string) => {
        console.debug(`Remove: ${id}`);
        const wF = waitingFor.current;
        for(let i = 0; i < wF.length; i++) {
            if(wF[i] === id) {
                waitingFor.current = waitingFor.current.filter((_, j) => i !== j);
                break;
            }
        }
        if(waitingFor.current.length === 0 && fb.current)
            loadingScreen.current?.classList.remove(styles.active);
    };

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

    return <div ref={loadingScreen} className={cC(styles.loadingScreen, styles.active)}>
        <div className={styles.loadingContent}>
            <svg viewBox="0 0 90 40" className={styles.loadingSvg}>
                <circle r="10" cx="15" cy="15" data-x="1"></circle>
                <circle r="10" cx="45" cy="15" data-x="2"></circle>
                <circle r="10" cx="75" cy="15" data-x="3"></circle>
            </svg>
        </div>
        {pb && <div style={{"--loaded": `${(pb.loaded / pb.total)*100}%`} as any} className={styles.progBar}/>}
    </div>;
};

export default LoadingScreen;