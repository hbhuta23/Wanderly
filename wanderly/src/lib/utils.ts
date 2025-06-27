import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Google Maps API loading utility
let googleMapsLoadingPromise: Promise<void> | null = null;

export const loadGoogleMapsAPI = (): Promise<void> => {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  // If already loaded, return immediately
  if ((window as any).google?.maps?.importLibrary) {
    return Promise.resolve();
  }

  // If already loading, return the existing promise
  if (googleMapsLoadingPromise) {
    return googleMapsLoadingPromise;
  }

  // Check if script tag already exists
  const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
  if (existingScript) {
    // Script is already being loaded, wait for it
    googleMapsLoadingPromise = new Promise((resolve) => {
      const checkGoogleMaps = () => {
        if ((window as any).google?.maps?.importLibrary) {
          resolve();
        } else {
          setTimeout(checkGoogleMaps, 100);
        }
      };
      checkGoogleMaps();
    });
    return googleMapsLoadingPromise;
  }

  // Load the script
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return Promise.reject(new Error("Google Maps API key not found"));
  }

  googleMapsLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const params = new URLSearchParams({
      key: apiKey,
      v: "alpha",
    });
    script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
    script.async = true;
    script.defer = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps API"));

    document.head.appendChild(script);
  });

  return googleMapsLoadingPromise;
};
