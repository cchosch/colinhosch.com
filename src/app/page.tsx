import LiveDate from "@/components/LiveDate/LiveDate";
import Nav from "@/components/Nav";
import Clock from "@/Icon/Clock";
import LocationPin from "@/Icon/LocationPin";
import Contact from "./contatct";
import style from "./home.module.scss";


import { Crt } from "./crt/crt";

export default async function Home() {

    return (<>
        <Nav/>
        <div className="min-h-100 flex items-center">
            <div className={style.backgroundGradient}></div>
            <div className={style.background}></div>
            <div className="px-8 md:px-32 mt-4 flex w-full justify-center">
                <div className={`flex h-full items-center gap-16 flex-col ${style.infoCont}`}>
                    <div className={`flex gap-3 flex-col font-mono items-center ${style.personInfo}`}>
                        <img className={style.headshot}
                            src="/headshotCorrectedZoom.png"
                            alt="Colin Hoscheit"
                        />
                        <div className="flex flex-col items-center font-mono">
                            <div className="text-3xl">
                                Colin Hoscheit
                            </div>
                            <div className="text-xl">full stack consulting</div>
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
                        <img src="http://ghchart.rshah.org/409ba5/cchosch" alt="Colin's Github contributions" />
                    </div>
                </div>
                {/*
                <div className="font-mono">
                    Experience:
                    <br/>
                    &nbsp;* Lead Software Engineer, Bethesda Scholars (Summer 2023 - Present)
                    <br/>
                    &nbsp;* Software Engineer Intern, MoreVang (Winter 2023 - Summer 2023)
                    <br/>
                    &nbsp;* Software Engineer Intern, Flywheel Associates (Winter 2022 - Winter 2023)
                    <br/>
                    &nbsp;* Software Contractor, Xenophon Strategies (Winter 2021)
                    <br/>
                    <br/>

                </div>
                */}
            </div>
            {<Crt className={style.crtDisplay} style={{}}/>}
        </div>
    </>);
}


