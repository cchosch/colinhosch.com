"use client";
import { cC } from "@/util";
import { useEffect, useRef } from "react";
import styles from "./loadingscreen.module.scss";


const LoadingScreen = () => {
    const loadingScreen = useRef<HTMLDivElement>(null);
    useEffect(() => {
        document.fonts.ready.then(() => {
            loadingScreen.current?.classList.remove(styles.active);
        });
    }, []);

    return <div ref={loadingScreen} className={cC(styles.loadingScreen, styles.active)}></div>;
};

export default LoadingScreen;