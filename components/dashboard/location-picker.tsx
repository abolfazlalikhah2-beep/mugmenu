"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

/**
 * Minimal shape of the pieces of the Google Maps JavaScript API used below —
 * avoids pulling in @types/google.maps just for a handful of calls.
 */
interface GoogleMapsLatLng {
  lat(): number;
  lng(): number;
}
interface GoogleMapsMapInstance {
  setCenter(latLng: { lat: number; lng: number }): void;
  addListener(event: string, handler: (e: { latLng: GoogleMapsLatLng }) => void): void;
}
interface GoogleMapsMarkerInstance {
  setPosition(latLng: { lat: number; lng: number }): void;
}
interface GoogleMapsGeocoderResult {
  geometry: { location: GoogleMapsLatLng };
}
interface GoogleMapsNamespace {
  maps: {
    Map: new (el: HTMLElement, opts: Record<string, unknown>) => GoogleMapsMapInstance;
    Marker: new (opts: Record<string, unknown>) => GoogleMapsMarkerInstance;
    Geocoder: new () => {
      geocode(
        req: { address: string },
        cb: (results: GoogleMapsGeocoderResult[] | null, status: string) => void
      ): void;
    };
  };
}
declare global {
  interface Window {
    google?: GoogleMapsNamespace;
  }
}

const DEFAULT_CENTER = { lat: 35.6892, lng: 51.389 }; // Tehran — used only when no location is set yet.

let scriptLoadPromise: Promise<void> | null = null;

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (window.google?.maps) return Promise.resolve();
  if (!scriptLoadPromise) {
    scriptLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Google Maps script failed to load"));
      document.head.appendChild(script);
    });
  }
  return scriptLoadPromise;
}

export function LocationPicker({
  apiKey,
  latitude,
  longitude,
}: {
  apiKey: string | undefined;
  latitude: number | null;
  longitude: number | null;
}) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    latitude != null && longitude != null ? { lat: latitude, lng: longitude } : null
  );
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const mapElRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<GoogleMapsMapInstance | null>(null);
  const markerRef = useRef<GoogleMapsMarkerInstance | null>(null);

  useEffect(() => {
    if (!apiKey || !mapElRef.current) return;
    let cancelled = false;
    setStatus("loading");
    loadGoogleMapsScript(apiKey)
      .then(() => {
        if (cancelled || !mapElRef.current || !window.google) return;
        const center = coords ?? DEFAULT_CENTER;
        const map = new window.google.maps.Map(mapElRef.current, {
          center,
          zoom: coords ? 16 : 11,
          streetViewControl: false,
          mapTypeControl: false,
        });
        const marker = new window.google.maps.Marker({ position: center, map, draggable: true });
        map.addListener("click", (e) => {
          const next = { lat: e.latLng.lat(), lng: e.latLng.lng() };
          marker.setPosition(next);
          setCoords(next);
        });
        mapRef.current = map;
        markerRef.current = marker;
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
    // Intentionally runs once per mount — re-centering on later `coords` changes is handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  function handleSearch() {
    if (!window.google || !search.trim()) return;
    new window.google.maps.Geocoder().geocode({ address: search.trim() }, (results, geoStatus) => {
      if (geoStatus !== "OK" || !results?.[0]) return;
      const loc = results[0].geometry.location;
      const next = { lat: loc.lat(), lng: loc.lng() };
      setCoords(next);
      mapRef.current?.setCenter(next);
      markerRef.current?.setPosition(next);
    });
  }

  if (!apiKey) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-right text-xs font-light text-text-3">
          برای نمایش نقشه تعاملی، کلید Google Maps API را در تنظیمات سرور وارد کنید. تا آن زمان می‌توانید
          مختصات را دستی وارد کنید.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Input
            name="latitude"
            label="عرض جغرافیایی (Latitude)"
            dir="ltr"
            className="text-right"
            type="number"
            step="any"
            defaultValue={latitude ?? ""}
          />
          <Input
            name="longitude"
            label="طول جغرافیایی (Longitude)"
            dir="ltr"
            className="text-right"
            type="number"
            step="any"
            defaultValue={longitude ?? ""}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 rounded-input border border-border-input px-3">
        <button type="button" onClick={handleSearch} aria-label="جستجو" className="shrink-0 text-text-3">
          <Search size={16} />
        </button>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
          placeholder="جستجوی آدرس روی نقشه…"
          className="h-11 flex-1 bg-transparent text-sm text-[#333] outline-none placeholder:text-text-3"
        />
      </div>
      <div ref={mapElRef} className="h-[220px] w-full overflow-hidden rounded-[14px] bg-[#F2F2F2]">
        {status === "error" && (
          <div className="flex h-full items-center justify-center gap-1.5 text-xs text-red-500">
            <MapPin size={14} />
            بارگذاری نقشه ناموفق بود.
          </div>
        )}
      </div>
      <p className="text-right text-[11px] font-light text-text-3">
        روی نقشه کلیک کنید یا نشانگر را جابه‌جا کنید تا موقعیت دقیق ثبت شود.
      </p>
      <input type="hidden" name="latitude" value={coords?.lat ?? ""} readOnly />
      <input type="hidden" name="longitude" value={coords?.lng ?? ""} readOnly />
    </div>
  );
}
