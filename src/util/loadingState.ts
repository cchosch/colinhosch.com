import { LoadingEvents } from "@/components/LoadingScreen";

export type LoadWait = {
    finished: () => void
};

const assetRegistry: string[] = [];

export function registerAsset(url: string) {
    if (assetRegistry.includes(url))
        return;

    assetRegistry.push(url);
}

export function countAssets(): number {
    return assetRegistry.length;
}

export type LoadWaitEvent = {
    id: string,
    name: string,
    unique: boolean,
    status: "init" | "done"
};

export function bindLoadWait(name: string, unique: boolean = true): () => void {
    const id = Math.floor(Math.random() * 16777215).toString(16);
    window.postMessage({
        loadEvent: {
            id,
            name,
            unique,
            status: LoadingEvents.INIT_WAIT
        }
    });


    return () => {
        window.postMessage({
            loadEvent: {
                id,
                name,
                unique,
                status: LoadingEvents.FINISH_WAIT
            }
        });
    };
}
