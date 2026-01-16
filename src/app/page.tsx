import China from "@/components/China";
import Nav from "@/components/Nav";
import styles from "./home.module.scss";


export default async function Home() {

    return (<div className={styles.homepage}>
        <Nav/>
        <China text="Coming Soon" className={styles.china}></China>
    </div>);
}


