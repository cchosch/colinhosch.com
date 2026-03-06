import Github from "@/../public/github.svg";
import Instagram from "@/../public/instagram.svg";
import { FC } from "react";
import styles from "./nav.module.scss";
import Link from "next/link";

const Nav: FC<object> = async ({ }) => {

    return <header className={styles.nav}>
        <div className="flex gap-4 font-mono items-center relative">
            <Link href="/" className="font-bold text-lg">cchosch</Link>
            <div className="h-5 absolute -translate-x-1/2 left-1/2 top-full flex gap-2">
                <Link href="https://github.com/cchosch" target="_blank" className="h-full">
                    <Github className="h-full" fill="black" />
                </Link>
                <Link href="https://instagram.com/colinhoscheit" target="_blank" >
                    <Instagram className="h-full" fill="black" />
                </Link>

            </div>
            <div className="ml-8 font-thin absolute left-full underline">
                <Link href="/gallery">gallery</Link>
            </div>
        </div>
    </header>;
};

export default Nav;