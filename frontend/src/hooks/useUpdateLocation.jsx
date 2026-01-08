import { useEffect } from "react";
import { useSelector } from "react-redux";
import userApi from "../api/userApi";

const useUpdateLocation = () => {
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const updateLocation = async (lat, lon) => {
      try {
        const data = await userApi.updateLocation(lat, lon);
        // console.log(data);
      } catch (error) {
        console.error("Failed to update location", error)
      }
    };

    // Update user location once when userData changes
    // navigator.geolocation.getCurrentPosition() gets the current location

    if (userData) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          updateLocation(pos.coords.latitude, pos.coords.longitude);
        },
        (error) => {
          console.error("Geolocation error", error);
        }
      );
    }

  }, [userData]);
};

export default useUpdateLocation;
