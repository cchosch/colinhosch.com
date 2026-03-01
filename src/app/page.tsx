import Map from "@/components/Map";
import Nav from "@/components/Nav";
import { Country } from "@/util/countries";
import LensScene from "./_LensScene";
import styles from "./home.module.scss";

export default async function Home() {

    return (<div className={styles.homepage}>
        <svg
            aria-hidden="true"
            className={styles.worldBg}
            viewBox="0 0 1600 900"
            preserveAspectRatio="xMidYMid slice"
        >
            <defs>
                <linearGradient id="worldStroke" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgba(0,0,0, 1)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0.6)" />
                </linearGradient>
            </defs>

            <g
                fill="none"
                stroke="url(#worldStroke)"
                strokeWidth="0.0"
                strokeLinejoin="round"
                strokeLinecap="round"
                transform="scale(1.58477035687)"
            >
                <Country name="world"/>
            </g>
        </svg>

        <Nav/>
        <div className={styles.homeCont}>
            <div className={styles.bio}>
                <img width="500" height={300} alt="meme" src="/headshot.png" />
                <div className="w-full">
                    <div className="font-mono text-3xl text-center w-full font-bold">Gear</div>
                    <LensScene style={{width: "275px", height: "300px", overflow: "visible"}} />
                </div>
            </div>
            <div >
                <Map className={styles.map} />
            </div>
        </div>
    </div>);
}


