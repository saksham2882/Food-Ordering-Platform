import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setShopsInMyCity } from "../redux/userSlice";
import shopApi from "../api/shopApi";

const useGetShopByCity = () => {
  const dispatch = useDispatch();
  const { currentCity } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const data = await shopApi.getShopsByCity(currentCity);
        dispatch(setShopsInMyCity(data));
      } catch (error) {
        console.log(error);
      }
    };

    if (currentCity) {
      fetchShops();
    }
  }, [currentCity]);
};

export default useGetShopByCity;
