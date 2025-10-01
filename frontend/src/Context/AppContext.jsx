import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { doctors as localDoctors } from "../assets/assets"; // Local doctor images

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState(localDoctors); // Start with local doctors
  const [token, setToken] = useState(localStorage.getItem("token") || false);
  const [userData, setUserData] = useState(false);

  // Fetch doctors from backend if available
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
      if (data.success && data.doctors?.length > 0) {
        // Map backend doctors, fallback to local images if needed
        const updatedDoctors = data.doctors.map((doc) => ({
          ...doc,
          image:
            doc.image ||
            localDoctors.find((localDoc) => localDoc._id === doc._id)?.image,
          available: doc.available ?? true,
        }));
        setDoctors(updatedDoctors);
      } else {
        toast.info("Using local doctor data");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch doctors, using local data");
    }
  };

  // Load user profile
  const loadUserProfileData = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: { token },
      });
      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Context value
  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
