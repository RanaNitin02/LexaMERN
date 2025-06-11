import axios from 'axios';
import aiImage from '../assets/ai.gif';
import { TbMenu3 } from "react-icons/tb";
import { RxCross1 } from "react-icons/rx";
import userImage from '../assets/user.gif';
import { useContext, useEffect, useRef, useState } from 'react';
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
      await axios.get(`${url}/auth/logout`, { withCredentials: true });
      setUserData(null);
      navigate('/login');
    } catch (error) {
      setUserData(null);
      console.error(error);
    }
  };

  const startRecognition = () => {
    if (
      recognitionRef.current &&
      !isRecognizingRef.current &&
      !isSpeakingRef.current
    ) {
      try {
        recognitionRef.current.start();
        console.log('Recognition started');
      } catch (error) {
        if (error.name !== 'InvalidStateError') {
          console.error('Start recognition error:', error);
        }
      }
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    const voices = synth.getVoices();
    const hindiVoice = voices.find((voice) => voice.lang === 'hi-IN');
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    isSpeakingRef.current = true;

    utterance.onend = () => {
      setAiText('');
      isSpeakingRef.current = false;
      setTimeout(() => {
        startRecognition();
      }, 800);
    };

    synth.cancel();
    synth.speak(utterance);
  };

  const handleCommand = async (data) => {
    const { type, userInput, response } = data;
    speak(response);

    const openURL = (url) => window.open(url, '_blank');

    const urls = {
      'google-search': `https://www.google.com/search?q=${encodeURIComponent(userInput)}`,
      'calculator-open': 'https://www.google.com/search?q=calculator',
      'instagram-open': 'https://www.instagram.com/',
      'facebook-open': 'https://www.facebook.com/',
      'weather-show': 'https://www.google.com/search?q=weather',
      'youtube-search': `https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`,
      'youtube-open': 'https://www.youtube.com/',
      'youtube-play': `https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`
    };

    if (urls[type]) openURL(urls[type]);
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    let isMounted = true;

    const initRecognition = () => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log('Recognition started');
        } catch (error) {
          if (error.name !== 'InvalidStateError') {
            console.error(error);
          }
        }
      }
    };

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      if (isMounted && !isSpeakingRef.current) {
        setTimeout(initRecognition, 1000);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== 'aborted' && isMounted && !isSpeakingRef.current) {
        setTimeout(initRecognition, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setUserText(transcript);
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);
        const data = await getGeminiResponse(transcript);
        handleCommand(data);
        setAiText(data.response);
        setUserText('');
      }
    };

    const greetUser = () => {
      const greeting = new SpeechSynthesisUtterance(
        `Hello ${userData.name}, I am your assistant ${userData.assistantName}. How can I help you today?`
      );
      greeting.lang = 'hi-IN';
      const voices = synth.getVoices();
      const hindiVoice = voices.find((voice) => voice.lang === 'hi-IN');
      if (hindiVoice) {
        greeting.voice = hindiVoice;
      }

      greeting.onend = () => {
        setTimeout(() => {
          if (!isSpeakingRef.current && !isRecognizingRef.current) {
            startRecognition();
          }
        }, 800);
      };

      synth.speak(greeting);
    };

    if (synth.getVoices().length > 0) {
      greetUser();
    } else {
      window.speechSynthesis.onvoiceschanged = greetUser;
    }

    return () => {
      isMounted = false;
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
    };
  }, []);

  return (
    <div className='flex flex-col items-center justify-start w-full min-h-screen px-4 pt-6 bg-gradient-to-t from-black to-[#030353] gap-4 overflow-x-hidden'>
      <TbMenu3 onClick={() => setHam(true)} className='lg:hidden text-white absolute top-5 right-5 w-6 h-6 cursor-pointer' />
      
      {/* Side Menu */}
      <div className={`lg:hidden fixed top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-5 flex flex-col gap-4 items-start transition-transform z-50 ${ham ? 'translate-x-0' : 'translate-x-full'}`}>
        <RxCross1 onClick={() => setHam(false)} className='text-white absolute top-5 right-5 w-6 h-6 cursor-pointer' />
        <button
          onClick={handleLogout}
          className='w-full text-white font-semibold bg-blue-500 hover:bg-blue-800 rounded-full text-lg px-5 py-3'>
          Log Out
        </button>
        <button
          onClick={() => navigate('/customize')}
          className='w-full text-white font-semibold bg-blue-500 hover:bg-blue-800 rounded-full text-lg px-5 py-3'>
          Customize your assistant
        </button>

        <div className='w-full border-t border-gray-400 pt-4'>
          <h1 className='text-white font-semibold text-lg mb-2'>History</h1>
          <div className='flex flex-col gap-2 max-h-[300px] overflow-y-auto'>
            {userData.history?.map((his, index) => (
              <span key={index} className='text-gray-200 text-sm truncate'>{his}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Assistant Image */}
      <div className='w-full max-w-[280px] h-[320px] flex items-center justify-center overflow-hidden shadow-lg rounded-2xl'>
        <img src={userData?.assistantImage} className='w-full h-full object-cover rounded-2xl' />
      </div>

      {/* Assistant Name */}
      <h1 className='text-[18px] font-semibold text-white text-center'>
        I'm <span className='text-blue-500'>{userData?.assistantName}</span>
      </h1>

      {/* Animation */}
      {!aiText ? (
        <img src={userImage} className="w-[160px]" />
      ) : (
        <img src={aiImage} className="w-[160px]" />
      )}

      {/* Text Display */}
      <h1 className='text-[16px] font-medium text-white text-center px-2 break-words'>
        {userText || aiText || ''}
      </h1>
    </div>
  );
};

export default Home;
