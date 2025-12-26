import scooter from "../assets/scooter.png";
import home from "../assets/home.png";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { useEffect, useState } from "react";


const createCustomIcon = (url, size) => new L.DivIcon({
  className: "custom-marker-icon",
  html: `
    <div class="relative w-full h-full group">
       <div class="absolute inset-0 bg-black/20 rounded-full blur-sm transform translate-y-1 scale-x-75 animate-pulse"></div>
       <img src="${url}" class="w-full h-full object-contain filter drop-shadow-lg transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-2" style="transform-origin: bottom center;" />
    </div>
  `,
  iconSize: size,
  iconAnchor: [size[0] / 2, size[1]],
  popupAnchor: [0, -size[1]],
});

const deliveryBoyIcon = createCustomIcon(scooter, [50, 50]);
const customerIcon = createCustomIcon(home, [45, 45]);

// Control Component for Recentering
const RecenterControl = ({ center }) => {
  const map = useMap();
  const handleRecenter = () => {
    if (center) {
      map.flyTo(center, 16, {
        animate: true,
        duration: 1.5,
      });
    }
  };

  return (
    <div className="leaflet-bottom leaflet-right">
      <div className="leaflet-control leaflet-bar !border-none !m-6">
        <Button
          size="icon"
          className="h-12 w-12 rounded-2xl shadow-xl bg-white text-slate-700 hover:bg-slate-900 hover:text-white border border-slate-200 transition-all hover:scale-110 active:scale-95"
          onClick={(e) => {
            L.DomEvent.stopPropagation(e);
            handleRecenter();
          }}
          title="Recenter Map"
        >
          <FaLocationCrosshairs className="size-5" />
        </Button>
      </div>
    </div>
  );
};

// handle auto-centering only on initial load or validity change
const AutoRecenter = ({ center }) => {
  const map = useMap();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (center && !initialized) {
      map.flyTo(center, 16, { animate: true, duration: 2 });
      setInitialized(true);
    }
  }, [center, map, initialized]);

  return null;
};


const DeliveryBoyTracking = ({ data }) => {
  const deliveryBoyLat = data?.deliveryBoyLocation?.lat;
  const deliveryBoyLon = data?.deliveryBoyLocation?.lon;
  const customerLat = data?.customerLocation?.lat;
  const customerLon = data?.customerLocation?.lon;

  const isValid = (val) => val != null && Number.isFinite(val);
  const hasDriver = isValid(deliveryBoyLat) && isValid(deliveryBoyLon);
  const hasCustomer = isValid(customerLat) && isValid(customerLon);

  const center = hasDriver
    ? [deliveryBoyLat, deliveryBoyLon]
    : hasCustomer
      ? [customerLat, customerLon]
      : null;

  if (!center) {
    return (
      <div className="w-full h-[450px] rounded-3xl overflow-hidden shadow-inner bg-slate-50 border border-slate-200 flex flex-col items-center justify-center gap-6 relative group">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="relative z-10 flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
          <div className="relative">
            <div className="size-16 rounded-full border-[5px] border-slate-200 border-t-orange-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="size-2 bg-orange-500 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-slate-700 font-black text-lg tracking-tight">Locating...</p>
            <p className="text-slate-400 font-medium text-xs">Waiting for GPS signal</p>
          </div>
        </div>
      </div>
    );
  }

  const path = hasDriver && hasCustomer ? [
    [deliveryBoyLat, deliveryBoyLon],
    [customerLat, customerLon],
  ] : [];

  return (
    <div className="w-full h-[450px] rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100 relative group isolate bg-white ring-1 ring-slate-100 z-0">

      <MapContainer
        className="w-full h-full z-0 font-sans rounded-3xl"
        center={center}
        zoom={16}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* -------- Helper to center on mount -------- */}
        <AutoRecenter center={center} />

        {/* -------- Custom Recenter Control -------- */}
        <RecenterControl center={center} />

        {hasDriver && (
          <Marker position={[deliveryBoyLat, deliveryBoyLon]} icon={deliveryBoyIcon}>
            <Popup className="font-bold text-slate-800 rounded-xl shadow-lg border-none">🛵 Delivery Partner</Popup>
          </Marker>
        )}

        {hasCustomer && (
          <Marker position={[customerLat, customerLon]} icon={customerIcon}>
            <Popup className="font-bold text-slate-800 rounded-xl shadow-lg border-none">🏠 Customer</Popup>
          </Marker>
        )}

        {path.length > 0 && (
          <Polyline
            positions={path}
            color="#f97316"
            weight={6}
            opacity={0.8}
            dashArray="12, 12"
            lineCap="round"
          />
        )}
      </MapContainer>

      {/* -------- Live Indicator Overlay -------- */}
      <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-white/50 text-xs font-bold text-slate-600 flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        Live Tracking
      </div>

    </div>
  );
};

export default DeliveryBoyTracking;
