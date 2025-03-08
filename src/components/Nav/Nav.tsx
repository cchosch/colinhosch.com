import { fetchWakaTimeHours } from "@/app/actions";
import { FC } from "react";
import styles from "./nav.module.scss";
 
const Nav: FC<object> = async ({}) => {
    const wakaHours = await fetchWakaTimeHours();

    return <div className={styles.nav}>
        <div className="font-mono flex-col flex items-center">
            <span>cchosch</span>
            <span className="text-sm">
                {wakaHours && <>({Math.round(parseFloat(wakaHours.decimal)).toFixed(0)} hours spent coding)</>}
            </span>
 
        </div>
    </div>;
};

export default Nav;