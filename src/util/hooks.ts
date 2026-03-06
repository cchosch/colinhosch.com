"use client";
import { useState } from "react";

export function useUpdate(): (() => void) {
    const [_s, setS] = useState(false);

    return () => {
        setS(s => !s);
    };
}