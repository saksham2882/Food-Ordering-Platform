import { useEffect } from "react";
import { useSelector } from "react-redux";
import userApi from "../api/userApi";

const useUpdateLocation = () => {
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const updateLocation = async (lat, lon) => {
      try {
        const data = await userApi.updateLocation(lat, lon);
        console.log(data);
      } catch (error) {
        console.error("Failed to update location", error)
      }
    };

    // Update user location whenever browser geolocation detects a change
    // navigator.geolocation.watchPosition() continuously watches for location updates

    if (userData) {
      navigator.geolocation.watchPosition((pos) => {
        updateLocation(pos.coords.latitude, pos.coords.longitude);
      });
    }

  }, [userData]);
};

export default useUpdateLocation;
