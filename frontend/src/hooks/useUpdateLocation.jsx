import axios from "axios";
import { useEffect } from "react";
import { SERVER_URL } from "../App";
import { useSelector } from "react-redux";

const useUpdateLocation = () => {
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const updateLocation = async (lat, lon) => {
      const res = await axios.post(
        `${SERVER_URL}/api/user/update-location`,
        { lat, lon },
        { withCredentials: true }
      );
      console.log(res.data);
    };

    // Update user location whenever browser geolocation detects a change
    // navigator.geolocation.watchPosition() continuously watches for location updates

    navigator.geolocation.watchPosition((pos) => {
      updateLocation(pos.coords.latitude, pos.coords.longitude);
    });
    
  }, [userData]);
};

export default useUpdateLocation;
