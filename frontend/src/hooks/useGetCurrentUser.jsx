import axios from "axios";
import { useEffect } from "react";
import { URL } from "../App";

const useGetCurrentUser = () => {
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${URL}/api/user/current`, {
          withCredentials: true,
        });
        console.log("Get User:", res);
      } catch (error) {
        console.log(error);
      }
    }

    fetchUser()
  }, [])
};

export default useGetCurrentUser;
