import axios from "axios";
import { useEffect } from "react";
import { URL } from "../App";
import { useDispatch } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";

const useGetMyShop = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await axios.get(`${URL}/api/shop/get-my`, {
          withCredentials: true,
        });
        dispatch(setMyShopData(res.data))
      } catch (error) {
        console.log(error);
      }
    };

    fetchShop();
  }, []);
};

export default useGetMyShop;
