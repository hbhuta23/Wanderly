import React, { useEffect, useRef } from "react";
import { loadGoogleMapsAPI } from "@/lib/utils";

const DEFAULT_CENTER = { lat: 40, lng: -100 }; // fallback center (USA)

interface SimpleGlobeProps {
  coords: { lat: number; lng: number } | null;
  destination: string;
  markers: { lat: number; lng: number; name: string }[];
}

const SimpleGlobe: React.FC<SimpleGlobeProps> = ({ coords, destination, markers = [] }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const extraMarkersRef = useRef<google.maps.Marker[]>([]);

  // Initialize map on mount
  useEffect(() => {
    let isMounted = true;
    loadGoogleMapsAPI().then(() => {
      if (!isMounted) return;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          initMap(userLocation);
        },
        () => {
          initMap(DEFAULT_CENTER);
        }
      );
    });
    function initMap(center: { lat: number; lng: number }) {
      if (mapRef.current) {
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center,
          zoom: 14,
          minZoom: 3,
          maxZoom: 18,
          mapTypeId: "roadmap",
          rotateControl: false,
          gestureHandling: "greedy",
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
        });
      }
    }
    return () => {
      isMounted = false;
      mapInstance.current = null;
      markerRef.current = null;
      extraMarkersRef.current.forEach(m => m.setMap(null));
      extraMarkersRef.current = [];
    };
  }, []);

  // When coords changes, add marker and animate map (smooth zoom out, pan, zoom in)
  useEffect(() => {
    if (!mapInstance.current || !coords) return;
    // Remove previous marker
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }
    // Add new marker
    markerRef.current = new window.google.maps.Marker({
      position: coords,
      map: mapInstance.current,
      title: destination || "Destination",
      animation: window.google.maps.Animation.DROP,
    });

    const map = mapInstance.current;
    const targetZoom = 15;
    const zoomOutLevel = 4;
    let zoomStep: number = typeof map.getZoom() === 'number' ? (map.getZoom() as number) : 10;
    // Step 1: Smoothly zoom out
    const zoomOutInterval = setInterval(() => {
      if (zoomStep > zoomOutLevel) {
        zoomStep -= 1;
        map.setZoom(zoomStep);
      } else {
        clearInterval(zoomOutInterval);
        // Step 2: Smooth pan
        map.panTo(coords);
        // Step 3: Smoothly zoom in
        setTimeout(() => {
          let zoomInStep = zoomOutLevel;
          const zoomInInterval = setInterval(() => {
            if (zoomInStep < targetZoom) {
              zoomInStep += 1;
              map.setZoom(zoomInStep);
            } else {
              clearInterval(zoomInInterval);
            }
          }, 100); // adjust for speed
        }, 800); // allow time for pan
      }
    }, 100); // adjust for speed

    // Cleanup intervals if component unmounts or coords changes
    return () => {
      clearInterval(zoomOutInterval);
    };
  }, [coords, destination]);

  // When markers change, update extra markers
  useEffect(() => {
    if (!mapInstance.current) return;
    // Remove old markers
    extraMarkersRef.current.forEach(m => m.setMap(null));
    extraMarkersRef.current = [];
    // Add new markers
    if (markers && markers.length > 0) {
      extraMarkersRef.current = markers.map(marker => {
        return new window.google.maps.Marker({
          position: { lat: marker.lat, lng: marker.lng },
          map: mapInstance.current!,
          title: marker.name,
          icon: undefined, // Use default icon, or customize if you want
        });
      });
    }
  }, [markers]);

  return (
    <div
      ref={mapRef}
      style={{ width: "100vw", height: "100vh", margin: 0, padding: 0, overflow: "hidden" }}
    />
  );
};

export default SimpleGlobe;