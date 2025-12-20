import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setItemsInMyCity } from "../redux/userSlice";
import shopApi from "../api/shopApi";

const useGetItemsByCity = () => {
  const dispatch = useDispatch();
  const { currentCity } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await shopApi.getItemsByCity(currentCity);
        dispatch(setItemsInMyCity(data));
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (currentCity) {
      fetchItems();
    }
  }, [currentCity]);
};

export default useGetItemsByCity;
