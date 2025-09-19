import axios from "axios";
import { useEffect } from "react";
import { SERVER_URL } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setItemsInMyCity } from "../redux/userSlice";

const useGetItemsByCity = () => {
  const dispatch = useDispatch();
  const { currentCity } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(
          `${SERVER_URL}/api/item/get-by-city/${currentCity}`,
          {
            withCredentials: true,
          }
        );
        dispatch(setItemsInMyCity(res.data));
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchItems();
  }, [currentCity]);
};

export default useGetItemsByCity;
