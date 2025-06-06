import { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext";


const Customize2 = () => {

    const {userData} = useContext(userDataContext);

    const [ assistantName, setAssistantName ] = useState(userData?.assistantName || '');

    return (
        <div className='flex items-center justify-center flex-col w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] p-[20px]'>
            <h1 className='text-2xl font-semibold mb-[40px] text-white'>Enter your <span className='text-blue-300'>Assistant Name</span></h1>
            <input
                type="text"
                onChange={(e) => setAssistantName(e.target.value)}
                value={assistantName} 
                className='w-full max-w-[600px] h-[60px] outline-none border-5 border-white bg-transparent text-white placeholder-gray-300 px-4 py-2 text-[18px] rounded-full'
                placeholder='eg: Alexa'
                required
            />
            {assistantName && <button onClick={() => navigate('/customize2')} className='min-w-[300px] w-[150px] h-[60px] mt-[30px] text-white font-semibold bg-blue-500 hover:bg-blue-800 rounded-full text-lg  flex items-center justify-center cursor-pointer'>Create your assistant</button>}
        </div>
    )
}

export default Customize2