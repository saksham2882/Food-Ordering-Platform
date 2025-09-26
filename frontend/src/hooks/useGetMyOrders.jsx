import axios from "axios";
import { useEffect } from "react";
import { SERVER_URL } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setMyOrders } from "../redux/userSlice";

const useGetMyOrders = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/order/my-orders`, {
          withCredentials: true,
        });
        console.log(res)
        dispatch(setMyOrders(res.data));
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrders(); 
  }, [userData]);
};

export default useGetMyOrders;
