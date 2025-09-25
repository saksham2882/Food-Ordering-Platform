import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentAddress, setCurrentCity, setCurrentState } from "../redux/userSlice";
import { setAddress, setLocation } from "../redux/mapSlice";

const useGetCity = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const apiKey = import.meta.env.VITE_GEOAPIKEY;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      // console.log(position)

      // get latitude and longitude from callback
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // set current Location for delivery
      dispatch(setLocation({lat: latitude, lon: longitude}))

      // fetch city
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`
      );

      // console.log(res)
      dispatch(setCurrentCity(res?.data?.results[0]?.city));
      dispatch(setCurrentState(res?.data?.results[0]?.state));
      dispatch(setCurrentAddress(res?.data?.results[0]?.formatted || res?.data?.results[0]?.address_line2));

      // set current Address for delivery
      dispatch(setAddress(res?.data?.results[0]?.formatted || res?.data?.results[0]?.address_line2));
    });
  }, [userData]);
};

export default useGetCity;
