"use client";
import { FC, useEffect, useRef } from "react";
import { bindLoadWait } from "../loadingState";
import { loadAllAssets, useAssetsFinished } from "./assetLoader";

const AssetSuspense: FC<{children: any}> = ({children}) => {
    const firstFrame = useRef<() => void>(null);

    useEffect(() => {
        if(firstFrame.current === null) {
            firstFrame.current = bindLoadWait("first_frame", false);
        }

        loadAllAssets();
    }, []);

    const finished = useAssetsFinished();
    return <>
        {finished && <>
            {children}
            <mesh onAfterRender={() => {
                if(firstFrame.current) {
                    firstFrame.current();
                    firstFrame.current = null;
                }
            }} >
                <planeGeometry args={[2, 3.5]}></planeGeometry>
                <meshStandardMaterial color={"#ffffff"} transparent opacity={0}/>

            </mesh>
        </>}
        
    </>;
};

export default AssetSuspense;
