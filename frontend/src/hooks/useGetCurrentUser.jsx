import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCheckingAuth, setUserData } from "../redux/userSlice";
import authApi from "../api/authApi";

const useGetCurrentUser = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authApi.checkAuth();
        dispatch(setUserData(data))
      } catch (error) {
        console.log(error);
        dispatch(setCheckingAuth(false))
      }
    }

    fetchUser()
  }, [])
};

export default useGetCurrentUser;
