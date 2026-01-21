export const airbnbMapStyle: google.maps.MapTypeStyle[] = [
    // Base map
    {
        elementType: "geometry",
        stylers: [{ color: "blue" }]
    },
    {
        elementType: "labels.text.fill",
        stylers: [{ color: "#00000000" }]
    },
    {
        elementType: "labels.text.stroke",
        stylers: [{ color: "#ffffff" }]
    },

    // Water
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#cfe8f3" }]
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6a8fa3" }]
    },

    // Parks / green areas
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#dbead5" }]
        // stylers: [{ color: "#dbead5" }]
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#5f7a5a" }]
    },

    // Roads
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#ffffff" }]
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#e6e6e6" }]
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#7a7a7a" }]
    },

    // Highways
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#fdfdfd" }]
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#dadada" }]
    },

    // POIs (shops, museums)
    {
        featureType: "poi",
        elementType: "geometry",
        stylers: [{ color: "#eeeeee" }]
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#00000000" }]
    },

    // Transit icons
    {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#e5e5e5" }]
    },
    {
        featureType: "transit.station",
        elementType: "labels.icon",
        stylers: [{ saturation: -100 }]
    },

    // Administrative boundaries
    {
        featureType: "administrative",
        elementType: "geometry.stroke",
        stylers: [{ color: "#000000" }]
    }
];
