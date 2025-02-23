"use client";

import { useRef } from "react";
import style from "./home.module.scss";

const Contact = () => {
    const dialogRef = useRef<HTMLFormElement>(null);
    return <>
        <button onMouseDown={() => dialogRef.current?.classList.add(style.open)} className={`${style.contactButton} font-mono`}>Contact</button>
        <form onSubmit={(ev) => {
            ev.preventDefault();
        }} className={`${style.contactDialog} relative`} ref={dialogRef}>
            <button data-is-close="true" onMouseDown={() => {dialogRef.current?.classList.remove(style.open);}} className="font-mono absolute top-2 right-4 cursor-pointer m-0 text-xl select-none">X</button>
            <div className="font-mono text-lg text-center mb-4 select-none">Contact Me</div>
            <div className="flex gap-2 mb-2">
                <input placeholder="John Doe" className={`${style.contactInput} font-mono`}/>
                <input placeholder="john@johndoe.com" type="email" className={`${style.contactInput} font-mono`}/>
            </div>
            <textarea placeholder={"Hi Colin,\n\nYour website looks great! I'd love to wire you my entire life savings today! Send me your details and I'll get it over.\n\nBest,\nJohn"} rows={8} className={`${style.contactInput} font-mono`}/>
            <button className="font-mono">Send</button>
        </form>
    </>;
};

export default Contact;