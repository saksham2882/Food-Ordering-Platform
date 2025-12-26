import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";
import shopApi from "../api/shopApi";

const useGetMyShop = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const data = await shopApi.getMyShop();
        dispatch(setMyShopData(data))
      } catch (error) {
        console.log(error);
      }
    };

    if (userData) {
      fetchShop();
    }
  }, [userData, dispatch]);
};

export default useGetMyShop;
