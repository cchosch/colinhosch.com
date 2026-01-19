import Nav from "@/components/Nav";
import ClientRender from "./_ClientRender";
import styles from "./home.module.scss";


export default async function Home() {

    return (<div className={styles.homepage}>
        <Nav/>
        <ClientRender />
    </div>);
}


