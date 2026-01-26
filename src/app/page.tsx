import Nav from "@/components/Nav";
import TSAScene from "./_TSAScene";
import styles from "./home.module.scss";

export default async function Home() {

    return (<div className={styles.homepage}>
        <Nav/>
        <div className={styles.homeCont}>
            <div className={styles.bio}>
                <img width="500" height={300} alt="meme" src="/headshot.png" />
                <div className="w-full">
                    <div className="font-mono text-3xl text-center w-full font-extrabold"></div>
                    {/*<LensScene style={{width: "275px", height: "300px", overflow: "visible"}} />*/}
                </div>
            </div>
            <div>
                <TSAScene style={{width: "100%", height: "800px", overflow: "visible"}} />
                {/*<China className={styles.map} />*/}
            </div>
        </div>
    </div>);
}


