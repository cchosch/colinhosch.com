import China from "@/components/China";
import Nav from "@/components/Nav";
import LensScene from "./_LensScene";
import styles from "./home.module.scss";

export default async function Home() {

    return (<div className={styles.homepage}>
        <Nav/>
        <div className={styles.homeCont}>
            <div className={styles.bio}>
                <img width="500" height={300} alt="meme" src="/headshot.png" />
                <div className="w-full">
                    <div className="font-mono text-3xl text-center w-full font-extrabold"></div>
                    <LensScene style={{width: "275px", height: "300px", overflow: "visible"}} />
                </div>
            </div>
            <div>
                {<China className={styles.map} />}
            </div>
        </div>
    </div>);
}


