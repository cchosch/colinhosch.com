"use client";
import { effectEvent } from "@/util";
import { useEffect, useRef } from "react";
import styles from "./cursor.module.scss";

const Cursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        return effectEvent("mousemove", (ev) => {
            const c = cursorRef.current;
            if(!c)
                return;
            const [cX, cY] = [ev.clientX-5, ev.clientY-5];
            c.setAttribute("style", `left: ${cX}px; top: ${cY}px`);
        });
    }, []);
    return <div className={styles.cursor} ref={cursorRef}>
        <div></div>
    </div>;
};

export default Cursor;
