import { useContext, useEffect } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {

  const { url, userData, setUserData, getGeminiResponse } = useContext(userDataContext)

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {

      const result = await axios.get(`${url}/auth/logout`, { withCredentials: true });
      setUserData(null);  
      navigate('/login');

    } catch (error) {
      setUserData(null); 
      console.error("Error during logout:", error);
    }
  }

  const speak = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}


  useEffect(() => {

    const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new speechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';

    recognition.onresult = async(e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("heard:", transcript);

      if( transcript.toLowerCase().includes(userData?.assistantName.toLowerCase()) ){
        const data = await getGeminiResponse(transcript);
        console.log(data);
        speak(data.response);
      }
    }
    recognition.start();     
  }, [userData]);

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col gap-4'>
      <button
          type="submit"
          onClick={handleLogout}
          className='min-w-[150px] h-[60px] mt-[30px] text-white font-semibold bg-blue-500 hover:bg-blue-700 absolute top-[20px] right-[20px] rounded-full text-[19px] transition duration-200 flex items-center justify-center cursor-pointer'
        >Log Out</button>
        <button
          type="submit"
          onClick={() => navigate('/customize')}
          className='min-w-[150px] h-[60px] mt-[30px] text-white font-semibold bg-blue-500 hover:bg-blue-700 absolute top-[100px] right-[20px] px-6 py-4 rounded-full text-[19px] transition duration-200 flex items-center justify-center cursor-pointer'
        >Customize your assistant</button>
      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg">
        <img src={userData?.assistantImage} className="h-full object-cover" />
      </div>
      <h1 className='text-white text-[18px] font-semibold'>I'm <span className='text-blue-500'>{userData?.assistantName}</span></h1>
    </div>
  )
}

export default Home