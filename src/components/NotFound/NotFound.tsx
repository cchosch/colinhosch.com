import Nav from "../Nav";
import styles from "./notfound.module.scss";

const NotFound = () => {
    return <>
        <Nav />
        <div className={styles.notFound}>
            Oops! Not Found
        </div>
    </>;
};

export default NotFound;