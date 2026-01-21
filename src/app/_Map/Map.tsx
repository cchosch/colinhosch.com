"use client";

import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useState } from "react";
import { airbnbMapStyle } from "./styles";

const containerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: "30px",
    outline: "none"
};

const MapComponent = () => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
    });
    const [map, setMap] = useState<google.maps.Map | null>(null);

    const onLoad = useCallback((map: google.maps.Map | null) => {
        // Optional: Do something with the map instance
        setMap(map);
    }, []);

    const onUnmount = useCallback((_map: google.maps.Map | null) => {
        setMap(null);
    }, []);
    return <>
        {isLoaded && <GoogleMap
            mapContainerStyle={containerStyle}
            center={{lat: 35, lng: 104}}
            zoom={3.5}
            options={{
                cameraControl: false,
                disableDefaultUI: true,
                draggable: false,
                keyboardShortcuts: false,
                styles: airbnbMapStyle
                
            }}
            
            onLoad={onLoad}
            onUnmount={onUnmount}
            >
            {/* Child components, such as Marker, can be added here */}
            </GoogleMap>}
    </>;
};

export default MapComponent;