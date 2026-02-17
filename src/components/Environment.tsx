import { getAssets, queueAssets } from "@/util/AssetManager/assetLoader";
import { registerAsset } from "@/util/loadingState";
import { Environment as E, EnvironmentProps } from "@react-three/drei";
import { JSX, useEffect } from "react";

export const environmentAssets = {
    environment: {kind: "environment", url: "/citrus_orchard_road_puresky_4k.hdr"}
} as const;
queueAssets(environmentAssets);

const Environment = (p: EnvironmentProps): JSX.Element => {
    const assets = getAssets(environmentAssets);

    useEffect(() => {
        const files = p.files??[];
        if(Array.isArray(files))
            files.forEach(f => registerAsset(f));
        else
            registerAsset(files);

    }, [p.files]);
    return <E environmentIntensity={1} background={false} map={assets.environment} {...p}/>;
};

export default Environment;
