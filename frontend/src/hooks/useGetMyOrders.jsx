import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMyOrders } from "../redux/userSlice";
import orderApi from "../api/orderApi";

const useGetMyOrders = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderApi.getMyOrders();
        dispatch(setMyOrders(data));
      } catch (error) {
        console.log(error);
      }
    };

    if (userData) {
      fetchOrders();
    }
  }, [userData]);
};

export default useGetMyOrders;
