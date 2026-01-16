import { FC } from "react";
import styles from "./nav.module.scss";
 
const Nav: FC<object> = async ({}) => {

    return <div className={styles.nav}>
        <div className="font-mono flex-col flex items-center font-bold">
            <span>cchosch</span>
        </div>
    </div>;
};

export default Nav;