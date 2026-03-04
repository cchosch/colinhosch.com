import Github from "@/../public/github.svg";
import { FC } from "react";
import styles from "./nav.module.scss";
import Link from "next/link";

const Nav: FC<object> = async ({ }) => {

    return <header className={styles.nav}>
        <div className="flex-col flex items-center relative">
            <Link href="/" className="font-bold text-lg font-mono">cchosch</Link>
            <Link href="https://github.com/cchosch" target="_blank" className="h-5 absolute top-full">
                <Github className="h-full" fill="black" />
            </Link>
        </div>
    </header>;
};

export default Nav;