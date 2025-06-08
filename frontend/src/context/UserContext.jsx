import { createContext, useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';

export const userDataContext = createContext();

function UserContext({ children }) {

  const url = import.meta.env.VITE_BASE_URL;

  const [userData, setUserData] = useState(null);

  const [ frontendImage, setFrontendImage ] = useState(null);
  const [ backendImage, setBackendImage ] = useState(null);
  const [ selectedImage, setSelectedImage ] = useState(null);

  const handleCurrentUser = async() => {
    try {
      const res = await axios.get(`${url}/user/current`, {
        withCredentials: true
      });
      setUserData(res.data);
      // console.log('Current User Data:', res.data);
    } catch (error) {
      console.log(error);
    }
  }

  const getGeminiResponse = async(command) => {
    try {
      
      const res = await axios.post(`${url}/user/asktoassistant`, { command }, {
        withCredentials: true
      });
      return res.data;

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleCurrentUser();
  }, [])

  const value = {
    url, userData, setUserData,
    frontendImage, setFrontendImage,
    backendImage, setBackendImage,
    selectedImage, setSelectedImage,
    getGeminiResponse
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
