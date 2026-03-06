import Map from "@/components/Map";
import Nav from "@/components/Nav";
import styles from "./home.module.scss";
import ItemScene from "./_ItemScene";
import "@/util/AssetManager";
import LoadingScreen from "@/components/LoadingScreen";

// [{ name: "Beijing", "lat": 40.190632, "lon": 116.412144, tier: 1, id: "bj" }]
export default async function Home() {

    return <>
        {<LoadingScreen />}
        <div className={styles.homepage}>
            <Nav />
            <div className={styles.homeCont}>
                <div className={styles.bio}>
                    <img width="500" height={300} alt="meme" src="/headshot.png" />

                    <div className="mb-2 mt-6 font-mono text-3xl text-center w-full font-bold">Items</div>

                    <div className={styles.itemsContainer}>
                        <ItemScene item="lens" className={styles.itemCanvas} />
                        <ItemScene item="camera" className={styles.itemCanvas} />
                        <ItemScene item="computer" className={styles.itemCanvas} />
                    </div>
                </div>
                <div >
                    <Map activeCities={[]} className={styles.map} />
                </div>
            </div>
            <div className="px-2 text-center mt-4 mb-2 flex-col flex text-lg">
                Follow me on my great asian expedition of 2026
            </div>
        </div>
    </>;
}


