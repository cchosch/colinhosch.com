"use client";
import { FC, useEffect, useRef, useState } from "react";

interface LiveDateProps {
    tickMs: number,
    tickCb?: () => string,
}

const LiveDate: FC<LiveDateProps> = ({tickMs, tickCb}) => {
    const dateTickRef = useRef<null | NodeJS.Timeout>(null);
    if(!tickCb)
        tickCb = formatDate;
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

const formatDate = () => {
    const now = new Date();
    const timeZone = "America/New_York";

    // Get time in the specified timezone
    const formatter = new Intl.DateTimeFormat('en-US', { 
        timeZone, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: false 
    });
    
    const formattedTime = formatter.format(now);
    
    // Get the UTC offset
    const options: Intl.DateTimeFormatOptions = { timeZone, timeZoneName: 'shortOffset' };
    const timeZoneName = new Intl.DateTimeFormat('en-US', options).format(now);
    
    // Extract the UTC offset
    const offsetMatch = timeZoneName.match(/GMT(-\d{1,2})(:\d{2})?/);
    let utcOffset = 'UTC';
    
    if (offsetMatch) {
        if(offsetMatch.length < 3 || !offsetMatch[2]) {
            offsetMatch[2] = ":00";
        }
        utcOffset = `UTC ${offsetMatch[1]}${offsetMatch[2]}`;
    }

    return `${formattedTime} (${utcOffset})`;
};

export default LiveDate;