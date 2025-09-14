import axios from "axios";
import { useEffect } from "react";
import { URL } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const useGetCurrentUser = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${URL}/api/user/current`, {
          withCredentials: true,
        });
        dispatch(setUserData(res.data))
      } catch (error) {
        console.log(error);
      }
    }

    fetchUser()
  }, [])
};

export default useGetCurrentUser;
