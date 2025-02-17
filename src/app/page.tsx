"use client";
import LiveDate from "@/components/LiveDate/LiveDate";
import Nav from "@/components/Nav";
import Clock from "@/Icon/Clock";
import LocationPin from "@/Icon/LocationPin";
import { useRef } from "react";
import style from "./home.module.scss";

export default function Home() {
    const dialogRef = useRef<HTMLFormElement>(null);
    return (<>
        <Nav/>
        <div className={style.backgroundGradient}></div>
        <div className={style.background}></div>
        <div className="relative left-1/2 w-3/4 flex h-full justify-center items-center gap-16 flex-col mt-4 translate-x-[-50%]">
            <div className="flex gap-3 flex-col items-center">
                <img className={style.headshot}
                    src="/headshotCorrectedZoom.png"
                    alt="Colin Hoscheit"
                />
                <div className="flex flex-col items-center font-mono">
                    <div className="text-3xl">
                        Colin Hoscheit
                    </div>
                    <div className="text-xl">Software & Products</div>
                    <div className={style.details}>
                        <div className="flex gap-1 items-center whitespace-nowrap">
                            <LocationPin className="inline" fill="white" height="1.1rem"/>
                            <span>Washignton DC</span>
                        </div>
                        <div className="flex gap-1 items-center whitespace-nowrap">
                            <Clock fill="white" height="1.1rem"/>
                            <LiveDate tickMs={1000} tickCb={formatDate}/>
                        </div>
                    </div>
                </div>
                <button onMouseDown={() => dialogRef.current?.classList.add(style.open)} className={`${style.contactButton} font-mono`}>Contact</button>
            </div>
            <div className="flex flex-col gap-2">
                <img className="w-48" src="https://wakatime.com/badge/user/82cdae6a-ce3c-4063-8986-f4c5ae89b50d.svg" alt="Total time coded since Feb 12 2023" />
                <img src="http://ghchart.rshah.org/409ba5/cchosch" alt="Colin's Github contributions" />
            </div>
        </div>
        <form onSubmit={(ev) => {
            ev.preventDefault();
        }} className={`${style.contactDialog} relative`} ref={dialogRef}>
            <button data-is-close="true" onMouseDown={() => {dialogRef.current?.classList.remove(style.open);}} className="font-mono absolute top-2 right-4 cursor-pointer m-0 text-xl select-none">X</button>
            <div className="font-mono text-lg text-center mb-4 select-none">Contact Me</div>
            <div className="flex gap-2 mb-2">
                <input placeholder="John Doe" className={`${style.contactInput} font-mono`}/>
                <input placeholder="john@johndoe.com" type="email" className={`${style.contactInput} font-mono`}/>
            </div>
            <textarea placeholder={"Hi Colin,\n\nYour website looks great! I'd love to wire you my entire life savings today! Send me your details and I'll get it over.\n\nBest,\nJohn"} rows={8} className={`${style.contactInput} font-mono`}/>
            <button className="font-mono">Send</button>
        </form>
    </>);
}

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

