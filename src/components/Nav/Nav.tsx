import Github from "@/../public/github.svg";
import { FC } from "react";
import styles from "./nav.module.scss";
 
const Nav: FC<object> = async ({}) => {

    return <div className={styles.nav}>
        <div className="font-bold text-lg font-mono flex-col flex items-center relative">
            <span>cchosch</span>
            <a href="https://github.com/cchosch" target="_blank" className="h-5 absolute top-full">
                <Github className="h-full" fill="black" />
            </a>
        </div>
    </div>;
};

export default Nav;