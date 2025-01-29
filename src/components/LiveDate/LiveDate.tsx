"use client";
import { FC, useEffect, useRef, useState } from "react";

interface LiveDateProps {
    tickMs: number,
    tickCb: () => string,
}

const LiveDate: FC<LiveDateProps> = ({tickMs, tickCb}) => {
    const dateTickRef = useRef<null | NodeJS.Timeout>(null);
    const [cont, setCont] = useState(tickCb());
    useEffect(() => {
        dateTickRef.current = setInterval(() => {
            setCont(tickCb);
        }, tickMs);
        return () => {
            if(dateTickRef.current)
                clearInterval(dateTickRef.current);
        };
    }, [tickMs, tickCb]);

    return <>{cont}</>;
};

export default LiveDate;