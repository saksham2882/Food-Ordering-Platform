import axios from "axios";
import { useEffect } from "react";
import { SERVER_URL } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";

const useGetMyShop = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/shop/get-my`, {
          withCredentials: true,
        });
        dispatch(setMyShopData(res.data))
      } catch (error) {
        console.log(error);
      }
    };

    fetchShop();
  }, [userData]);
};

export default useGetMyShop;
