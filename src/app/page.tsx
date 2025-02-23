import LiveDate from "@/components/LiveDate/LiveDate";
import Nav from "@/components/Nav";
import Clock from "@/Icon/Clock";
import LocationPin from "@/Icon/LocationPin";
import Contact from "./contatct";
import style from "./home.module.scss";


import * as THREE from "three";
import { Crt } from "./crt/crt";
export default function Home() {
    new THREE.Vector2(0, 2);
    return (<>
        <Nav/>
        <div className="min-h-100 flex items-center justify-center">
            <div className={style.backgroundGradient}></div>
            <div className={style.background}></div>
            <div className="w-3/4 flex h-full justify-center items-center gap-16 flex-col mt-4">
                <div className={`flex gap-3 flex-col font-mono items-center ${style.personInfo}`}>
                    <img className={style.headshot}
                        src="/headshotCorrectedZoom.png"
                        alt="Colin Hoscheit"
                    />
                    <div className="flex flex-col items-center font-mono">
                        <div className="text-3xl">
                            Colin Hoscheit
                        </div>
                        <div className="text-xl">Full stack consulting</div>
                        <div className={style.details}>
                            <div className="flex gap-1 items-center whitespace-nowrap">
                                <LocationPin className="inline" fill="white" height="1.1rem"/>
                                <span>Washignton DC</span>
                            </div>
                            <div className="flex gap-1 items-center whitespace-nowrap">
                                <Clock fill="white" height="1.1rem"/>
                                <LiveDate tickMs={1000}/>
                            </div>
                        </div>
                    </div>
                    <Contact/>
                </div>
                <div className="flex flex-col gap-2">
                    <img className="w-48" src="https://wakatime.com/badge/user/82cdae6a-ce3c-4063-8986-f4c5ae89b50d.svg" alt="Total time coded since Feb 12 2023" />
                    <img src="http://ghchart.rshah.org/409ba5/cchosch" alt="Colin's Github contributions" />
                </div>
            </div>
            {<Crt className={style.crtDisplay} style={{}}/>}
        </div>
    </>);
}


