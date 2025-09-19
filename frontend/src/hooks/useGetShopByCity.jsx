import axios from "axios";
import { useEffect } from "react";
import { SERVER_URL } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setShopsInMyCity } from "../redux/userSlice";

const useGetShopByCity = () => {
  const dispatch = useDispatch();
  const { currentCity } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await axios.get(
          `${SERVER_URL}/api/shop/get-by-city/${currentCity}`,
          {
            withCredentials: true,
          }
        );
        dispatch(setShopsInMyCity(res.data));
        console.log(res.data)
      } catch (error) {
        console.log(error);
      }
    };

    fetchShops();
  }, [currentCity]);
};

export default useGetShopByCity;
