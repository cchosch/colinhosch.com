"use client";
import { useEffect } from "react";
import { loadAllAssets } from "./assetManager";

const LoadAssets = () => {
    useEffect(() => {
        loadAllAssets();
    }, []);
    return <></>;
};

export default LoadAssets;