import scooter from "../assets/scooter.png";
import home from "../assets/home.png";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Marker,
  Polygon,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";

const deliveryBoyIcon = new L.icon({
  iconUrl: scooter,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const customerIcon = new L.Icon({
  iconUrl: home,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const DeliveryBoyTracking = ({ data }) => {
  const deliveryBoyLat = data?.deliveryBoyLocation?.lat;
  const deliveryBoyLon = data?.deliveryBoyLocation?.lon;
  const customerLat = data?.customerLocation?.lat;
  const customerLon = data?.customerLocation?.lon;

  // Validate coordinates
  const isDeliveryBoyLocationValid =
    deliveryBoyLat !== undefined &&
    deliveryBoyLon !== undefined &&
    deliveryBoyLat !== null &&
    deliveryBoyLon !== null;

  const isCustomerLocationValid =
    customerLat !== undefined &&
    customerLon !== undefined &&
    customerLat !== null &&
    customerLon !== null;

  if (!isDeliveryBoyLocationValid || !isCustomerLocationValid) {
    return (
      <div className="w-full h-[400px] mt-3 rounded-xl overflow-hidden shadow-md flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Waiting for location data...</p>
      </div>
    );
  }

  const path = [
    [deliveryBoyLat, deliveryBoyLon],
    [customerLat, customerLon],
  ];

  const center = [deliveryBoyLat, deliveryBoyLon];

  return (
    <div className="w-full h-[400px] mt-3 rounded-xl overflow-hidden shadow-md">
      <MapContainer className={"w-full h-full"} center={center} zoom={17}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker
          position={[deliveryBoyLat, deliveryBoyLon]}
          icon={deliveryBoyIcon}
        >
          <Popup>Delivery Boy</Popup>
        </Marker>

        <Marker position={[customerLat, customerLon]} icon={customerIcon}>
          <Popup>Customer</Popup>
        </Marker>

        <Polyline positions={path} color="blue" weight={4} />
      </MapContainer>
    </div>
  );
};

export default DeliveryBoyTracking;
