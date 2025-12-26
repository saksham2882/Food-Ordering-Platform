import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentAddress, setCurrentCity, setCurrentState } from "../redux/userSlice";
import { setAddress, setLocation } from "../redux/mapSlice";
import cityApi from "../api/cityApi";

const useGetCity = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      // console.log(position)

      // get latitude and longitude from callback
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // set current Location for delivery
      dispatch(setLocation({ lat: latitude, lon: longitude }))

      // fetch city
      try {
        const data = await cityApi.getReverseGeocoding(latitude, longitude);

        // console.log(res)
        dispatch(setCurrentCity(data?.results[0]?.city));
        dispatch(setCurrentState(data?.results[0]?.state));
        dispatch(setCurrentAddress(data?.results[0]?.formatted || data?.results[0]?.address_line2));

        // set current Address for delivery
        dispatch(setAddress(data?.results[0]?.formatted || data?.results[0]?.address_line2));
      } catch (error) {
        console.error("Error fetching city data:", error);
      }
    });
  }, [userData]);
};

export default useGetCity;
