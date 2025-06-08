import axios from 'axios';
import { useContext, useEffect, useState } from 'react'
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const { userData, url, setUserData, getGeminiResponse } = useContext(userDataContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${url}/auth/logout`, { withCredentials: true });
      setUserData(null);
      navigate('/login');
    } catch (error) {
      setUserData(null)
      console.log(error);
    }
  }

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }

  const handleCommand = async(data) => {
    const {type, userInput, response} = data;
    speak(response);

      
  }

  useEffect(() => {

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("heard: " + transcript);

      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        const data = await getGeminiResponse(transcript);
        console.log(data);
        speak(data.response);
      }
    }

    recognition.start();

  }, [])

  return (
    <div className='flex items-center justify-center flex-col w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] gap-[15px]'>
      <button
        onClick={handleLogout}
        className='min-w-[150px] w-[150px] h-[60px] mt-[30px] text-white font-semibold bg-blue-500 hover:bg-blue-800 rounded-full text-lg flex items-center justify-center cursor-pointer absolute top-[20px] right-[20px]'>
        Log Out
      </button>
      <button
        onClick={() => navigate('/customize')}
        className='min-w-[300px] w-[150px] h-[60px] mt-[30px] text-white font-semibold bg-blue-500 hover:bg-blue-800 rounded-full text-lg flex items-center justify-center cursor-pointer absolute top-[100px] right-[20px]'>
        Customize your assistant
      </button>
      <div className='w-[300px] h-[400px] flex items-center justify-center overflow-hidden shadow-lg rounded-4xl'>
        <img src={userData?.assistantImage} className='h-full object-cover rounded-4xl' />
      </div>
      <h1 className='text-[18px] font-semibold text-white'>I'm <span className='text-blue-500'>{userData?.assistantName}</span></h1>
    </div>
  )
}

export default Home