import { useContext, useState } from 'react';
import axios from "axios";
import { IoEye } from 'react-icons/io5'
import bgImg from '../assets/authBg.png'
import { IoEyeOff } from 'react-icons/io5'
import { HashLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext';

const Signup = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { url, userData, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${url}/auth/signup`, {
        name, email, password
      }, { withCredentials: true })
      setUserData(res.data);
      setLoading(false);
      navigate('/customize'); 
    } catch (err) {
      console.log("error in signing up, frontend", err);
      setUserData(null);
      setError(err.response.data.message);
      setLoading(false);
    }

  }

  return (
    <div className='w-full h-[100vh] bg-cover flex items-center justify-center' style={{ backgroundImage: `url(${bgImg})` }}>
      <form
        onSubmit={handleSubmit}
        className='w-[90%] h-[600px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px]'>
        <h1 className='mb-[30px] text-white text-[30px] font-semibold'>Register to <span className='text-blue-400'>Virtual Assistant</span></h1>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='w-full h-[60px] outline-none border-5 border-white bg-transparent text-white placeholder-gray-300 px-4 py-2 text-[18px] rounded-full'
          placeholder='Enter your name'
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full h-[60px] outline-none border-5 border-white bg-transparent text-white placeholder-gray-300 px-4 py-2 text-[18px] rounded-full'
          placeholder='Enter your email'
        />
        <div className="w-full h-[60px] outline-none border-5 border-white bg-transparent text-white text-[18px] rounded-full relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-4 py-2'
            placeholder='password'
          />
          {showPassword ? <IoEyeOff onClick={() => setShowPassword(false)}
            className='absolute top-[15px] right-[20px] h-[25px] w-[25px] text-white cursor-pointer'
          /> : <IoEye onClick={() => setShowPassword(true)}
            className='absolute top-[15px] right-[20px] h-[25px] w-[25px] text-white cursor-pointer'
          />}
        </div>

        {error && <p className='text-red-500 text-[18px] font-semibold'>*{error}</p>}

        <button
          type="submit"
          className='w-[150px] h-[50px] mt-6 text-white font-semibold bg-blue-500 hover:bg-blue-600 rounded-full text-lg transition duration-200 flex items-center justify-center'
          disabled={loading}
        >
          {loading ? (
            <HashLoader color="#ffffff" size={25} />
          ) : (
            "Register"
          )}
        </button>
        <p className='text-[white] text-[18px]'>Already have an account ? <span onClick={() => navigate('/login')} className='text-blue-400 font-bold cursor-pointer'>Login</span>
        </p>
      </form>
    </div>
  )
}

export default Signup