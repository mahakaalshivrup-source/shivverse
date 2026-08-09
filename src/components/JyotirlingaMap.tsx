"use client";

import { useState, useRef, useCallback, useMemo, useEffect, memo } from "react";
import Map, { Marker, NavigationControl, type MapRef } from "react-map-gl/maplibre";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin } from "lucide-react";
import jyotirlingaData, { type JyotirlingaLocation } from "@/data/jyotirlingaData";
import "maplibre-gl/dist/maplibre-gl.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MAP_STYLE: any = {
  version: 8,
  sources: {
    "carto-dark": {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
        "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
        "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
      ],
      tileSize: 256,
      maxzoom: 19,
    },
  },
  layers: [
    { id: "carto-tiles", type: "raster", source: "carto-dark", minzoom: 0, maxzoom: 20 },
  ],
};

const INDIA_BOUNDS: [number, number, number, number] = [67.0, 6.0, 98.0, 36.0];

const INITIAL_VIEW = {
  longitude: 78.9629,
  latitude: 22.0,
  zoom: 4.5,
  pitch: 50,
  bearing: 0,
};

const MarkerDot = memo(function MarkerDot({ name, isWarping }: { name: string; isWarping: boolean }) {
  return (
    <div className="relative group cursor-pointer flex items-center justify-center w-8 h-8">
      <span
        className={`absolute inset-0 rounded-full animate-ping ${isWarping ? "bg-amber-400 opacity-80" : "bg-blue-500/50 opacity-60"}`}
        style={{ animationDuration: isWarping ? "0.6s" : "2s" }}
      />
      <span
        className={`absolute w-6 h-6 rounded-full border transition-all duration-300 ${
          isWarping
            ? "border-amber-400 bg-amber-500/20 scale-150 shadow-[0_0_20px_rgba(251,191,36,0.9)]"
            : "border-blue-400/80 bg-blue-500/10 group-hover:scale-125 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
        }`}
      />
      <span className="relative w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_#fff]" />
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block whitespace-nowrap bg-black/90 text-white text-[11px] font-medium px-2.5 py-1 rounded border border-white/20 shadow-lg pointer-events-none z-30">
        {name}
      </div>
    </div>
  );
});

export default function JyotirlingaMap() {
  const mapRef = useRef<MapRef | null>(null);
  const [activeLocation, setActiveLocation] = useState<JyotirlingaLocation | null>(null);
  const [isWarping, setIsWarping] = useState(false);
  const [warpingId, setWarpingId] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  const handleMarkerClick = useCallback(
    (location: JyotirlingaLocation, e: { originalEvent: MouseEvent }) => {
      e.originalEvent.stopPropagation();
      if (isWarping || activeLocation) return;
      setIsWarping(true);
      setWarpingId(location.id);
      mapRef.current?.flyTo({ center: [location.lng, location.lat], zoom: 16, pitch: 45, duration: 1500, essential: true });
      timeoutRef.current = setTimeout(() => { setActiveLocation(location); setIsWarping(false); setWarpingId(null); }, 1500);
    },
    [isWarping, activeLocation],
  );

  const handleStopExploring = useCallback(() => {
    setActiveLocation(null);
    mapRef.current?.flyTo({ center: [INITIAL_VIEW.longitude, INITIAL_VIEW.latitude], zoom: INITIAL_VIEW.zoom, pitch: INITIAL_VIEW.pitch, bearing: INITIAL_VIEW.bearing, duration: 2000 });
  }, []);

  const markers = useMemo(
    () => jyotirlingaData.map((loc) => (
      <Marker key={loc.id} longitude={loc.lng} latitude={loc.lat} anchor="center" onClick={(e) => handleMarkerClick(loc, e)}>
        <MarkerDot name={loc.name} isWarping={warpingId === loc.id} />
      </Marker>
    )),
    [warpingId, handleMarkerClick],
  );

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden bg-black">
      <Map ref={mapRef} initialViewState={INITIAL_VIEW} style={{ width: "100%", height: "100%" }} mapStyle={MAP_STYLE} maxBounds={INDIA_BOUNDS} attributionControl={false} maxPitch={85}>
        <NavigationControl position="top-right" visualizePitch showCompass />
        {markers}
      </Map>

      <AnimatePresence>
        {isWarping && (
          <motion.div key="warp" initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-40 bg-blue-500 pointer-events-none" />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeLocation && (
          <motion.div key="overlay" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.5 }} className="fixed inset-0 z-50 bg-black flex flex-col">
            <button onClick={handleStopExploring} className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-6 z-[60] bg-black/60 backdrop-blur-md rounded-full px-4 py-2 text-white border border-white/20 hover:bg-black transition flex items-center gap-2 text-sm font-medium">
              <X className="w-4 h-4" /> Stop Exploring
            </button>
            {activeLocation.embedUrl ? (
              <iframe className="w-full h-full" frameBorder="0" style={{ border: 0 }} loading="lazy" allowFullScreen src={activeLocation.embedUrl} title={`Explore ${activeLocation.name}`} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <MapPin className="w-12 h-12 text-blue-400/50 mx-auto" />
                  <h3 className="text-2xl font-serif font-bold text-white">{activeLocation.name}</h3>
                  <p className="text-gray-400 text-sm max-w-md">{activeLocation.desc}</p>
                </div>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]" />
            <div className="absolute bottom-0 left-0 right-0 z-[55] pointer-events-none">
              <div className="flex justify-center pb-24 sm:pb-8 px-4">
                <div className="bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 max-w-lg text-center">
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-1">{activeLocation.name}</h2>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{activeLocation.desc}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
