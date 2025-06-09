import axios from 'axios';
import aiImage from '../assets/ai.gif';
import { TbMenu3 } from "react-icons/tb";
import { RxCross1 } from "react-icons/rx";
import userImage from '../assets/user.gif'
import { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const { userData, url, setUserData, getGeminiResponse } = useContext(userDataContext);
  const navigate = useNavigate();

  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState('');
  const [aiText, setAiText] = useState('');
  const [ham, setHam] = useState(false);

  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const synth = window.speechSynthesis;

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

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
        console.log('Recognition requested to start');

      } catch (error) {
        if (error.name === 'InvalidStateError') {
          console.error('start error:', error);
        }
      }
    }
  }

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = 'hi-IN';
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(voice => voice.lang === 'hi-IN');
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    isSpeakingRef.current = true;

    utterance.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      setTimeout(() => {
        startRecognition();
      }, 800)
      startRecognition();
    };

    synth.cancel();
    synth.speak(utterance);
  }

  const handleCommand = async (data) => {
    const { type, userInput, response } = data;
    speak(response);

    if (type === 'google-search') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }
    if (type === 'calculator-open') {
      window.open('https://www.google.com/search?q=calculator', '_blank');
    }
    if (type === 'instagram-open') {
      window.open('https://www.instagram.com/', '_blank');
    }
    if (type === 'facebook-open') {
      window.open('https://www.facebook.com/', '_blank');
    }
    if (type === 'weather-show') {
      window.open('https://www.google.com/search?q=weather', '_blank');
    }
    if (type === 'youtube-search' || type === 'youtube-open' || type === 'youtube-play') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }
  }

  useEffect(() => {

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognitionRef.current = recognition;

    let isMounted = true;

    const startTimeout = setTimeout(() => {
      if(isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log('Recognition started after timeout');
        } catch (error) {
          if (error.name !== 'InvalidStateError') {
            console.error(error);
          }
        }
      }
    }, 1000)


    recognition.onstart = () => {
      // console.log('Recognition started');
      isRecognizingRef.current = true;
      setListening(true);
    }

    recognition.onend = () => {
      // console.log('Recognition ended');
      isRecognizingRef.current = false;
      setListening(false);

      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if(isMounted){
            try {
              recognition.start();
              console.log('Recognition restarted after end');
            } catch (e) {
              if(e.name !== 'InvalidStateError') {
                console.error('Restart error', e);
              }
            }
          }
        }, 1000);
      }
    }

    recognition.onerror = (event) => {
      console.warn("Recognition error", event.error);
      isRecognizingRef.current = false;
      setListening(false);

      if (event.error !== 'aborted' && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if(isMounted){
            try {
              recognition.start();
              console.log('Recognition restarted after error');
            } catch (error) {
              if (error.name !== 'InvalidStateError') {
                console.error('Restart error', error);
              }
            }
          }
        }, 1000);
      }
    }


    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      // console.log("heard: " + transcript);

      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setAiText("");
        setUserText(transcript);
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);
        const data = await getGeminiResponse(transcript);
        // console.log(data);
        handleCommand(data);
        setAiText(data.response);
        setUserText("")
      }
    }

    window.speechSynthesis.onvoiceschanged = () => {
      const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, I am your assistant ${userData.assistantName}. How can I help you today?`);
      greeting.lang = 'hi-IN';
      greeting.onend(() => {
        startTimeout();
      })
      window.speechSynthesis.speak(greeting);
    }

    return () => {
      isMounted = false;
      recognition.stop();
      setListening(false);
      clearInterval(startTimeout);
      isRecognizingRef.current = false;
    }

  }, [])

  return (
    <div className='flex items-center justify-center flex-col w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] gap-[15px] overflow-hidden'>
      <TbMenu3 onClick={() => setHam(true)} className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer' />
      <div className={`lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg absolute p-[20px] flex flex-col gap-[20px] items-start ${ham ? "translate-x-0" : "translate-x-full"} transition-transform`}>
        <RxCross1 onClick={() => setHam(false)} className='text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] text-[24px] cursor-pointer' />
        <button
          onClick={handleLogout}
          className='min-w-[150px] h-[60px] mt-[30px] text-white font-semibold bg-blue-500 hover:bg-blue-800 rounded-full text-lg px-[20px] py-[10px]'>
          Log Out
        </button>
        <button
          onClick={() => navigate('/customize')}
          className='min-w-[150px] h-[60px] mt-[30px] text-white font-semibold bg-blue-500 hover:bg-blue-800 rounded-full text-lg px-[20px] py-[10px]'>
          Customize your assistant
        </button>

        <div className='w-full h-[2px] bg-gray-400'>
          <h1 className='text-white font-semibold text-[19px]'>History</h1>

          <div className='flex flex-col gap-[20px] w-full h-[400px] overflow-y-auto'>
            {
              userData.history?.map((his,index) => {
                return <span key={index} className='text-gray-200 text-[18px] truncate'>{his}</span>
              })
            }
          </div>
        </div>

      </div>
      <div className='w-[300px] h-[400px] flex items-center justify-center overflow-hidden shadow-lg rounded-4xl'>
        <img src={userData?.assistantImage} className='h-full object-cover rounded-4xl' />
      </div>
      <h1 className='text-[18px] font-semibold text-white'>I'm <span className='text-blue-500'>{userData?.assistantName}</span></h1>
      {!aiText && <img src={userImage} className="w-[200px]" />}
      {aiText && <img src={aiImage} className="w-[200px]" />}

      <h1 className='text-[18px] font-semibold text-wrap text-white'>
        {userText ? userText : aiText ? aiText : null}
      </h1>
    </div>
  )
}

export default Home;