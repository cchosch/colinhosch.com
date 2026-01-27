"use client";
import { CanvasProps } from '@react-three/fiber';
import dynamic from 'next/dynamic';

const TSAScene = dynamic(() => import('@/app/_TSAScene/TSAScene'), {
    ssr: false,
});

function TSASceneCli(p?: CanvasProps) {
    return <TSAScene {...p}/>;
}

export default TSASceneCli;