"use client";
import React, { useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";

export default function Home() {
  const mapRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: "weekly",
      });

      const { Map } = await loader.importLibrary("maps");
      const { Marker } = await loader.importLibrary("marker");

      // Get the user's current position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // map options
          const mapOptions: google.maps.MapOptions = {
            center: currentPosition,
            zoom: 17,
            mapId: "MY_NEXTJS_MAPID",
          };

          // setup the map
          if (mapRef.current) {
            const map = new Map(mapRef.current, mapOptions);

            // Add a blue marker for the current position
            new Marker({
              position: currentPosition,
              map: map,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              },
            });
          }
        },
        (error) => {
          console.error("Error getting current position:", error);
          // Fallback to a default position if geolocation fails
          const defaultPosition = { lat: 0, lng: 0 };
          // ... (use defaultPosition to set up the map)
        }
      );
    };

    initMap();
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }}></div>;
}
