import axios from "axios";
import { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext";
import {MdKeyboardBackspace} from 'react-icons/md'
import { useNavigate } from "react-router-dom";


const Customize2 = () => {

    const {url, userData, setUserData, backendImage, selectedImage} = useContext(userDataContext);

    const [ assistantName, setAssistantName ] = useState(userData?.assistantName || '');
    const [ loading, setLoading ] = useState(false);
    const navigate = useNavigate();

    const handleUpdateAssistant = async() => {
        setLoading(true);
        try {
            let formData = new FormData();
            formData.append('assistantName', assistantName);

            if( backendImage ){
                formData.append('assistantImage', backendImage);
            }else{
                formData.append('imageURL', selectedImage);
            }

            const res = await axios.post(`${url}/user/update`, formData, {withCredentials: true});

            setLoading(false);
            console.log(res.data);
            setUserData(res.data);
            navigate('/');
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    return (
        <div className='flex items-center justify-center flex-col w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] p-[20px] relative'>
            <MdKeyboardBackspace onClick={() => navigate("/customize")} className="top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer absolute" />
            <h1 className='text-2xl font-semibold mb-[40px] text-white'>Enter your <span className='text-blue-300'>Assistant Name</span></h1>
            <input
                type="text"
                onChange={(e) => setAssistantName(e.target.value)}
                value={assistantName} 
                className='w-full max-w-[600px] h-[60px] outline-none border-2 border-[#fff] bg-transparent text-white placeholder-gray-300 px-4 py-2 text-[18px] rounded-full'
                placeholder='eg: Alexa'
                required
            />
            { assistantName && 
                <button 
                    onClick={() => handleUpdateAssistant()} 
                    disabled={loading}
                    className='min-w-[300px] w-[150px] h-[60px] mt-[30px] text-white font-semibold bg-blue-500 hover:bg-blue-800 rounded-full text-lg flex items-center justify-center cursor-pointer'>
                    { !loading ? 'Create your assistant' : 'Creating...' }
                </button>
            }
        </div>
    )
}

export default Customize2