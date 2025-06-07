import image1 from '../assets/image1.png';
import image2 from '../assets/image2.jpg';
import image3 from '../assets/authBg.png';
import image4 from '../assets/image4.png';
import image5 from '../assets/image5.png';
import image6 from '../assets/image6.jpeg';
import image7 from '../assets/image7.jpeg';
import Card from '../components/Card.jsx'
import { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiImageAddLine } from "react-icons/ri";
import {MdKeyboardBackspace} from 'react-icons/md'
import { userDataContext } from '../context/UserContext.jsx';


const Customize = () => {

    const { frontendImage, setFrontendImage,
    backendImage, setBackendImage,
    selectedImage, setSelectedImage } = useContext(userDataContext);

    const inputImage = useRef();
    const navigate = useNavigate();
    
    const handleImage = (e) => {
        const file = e.target.files[0];
        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file));
    }

    return (
        <div className='flex items-center justify-center flex-col w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] relative'>
            <MdKeyboardBackspace onClick={() => navigate("/")} className="top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer absolute" />
            <h1 className='text-2xl font-semibold mb-[40px] text-white'>Select your <span className='text-blue-300'>Assistant Image</span></h1>
            <div className='w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[15px]'>
                <Card image={image1} />
                <Card image={image2} />
                <Card image={image3} />
                <Card image={image4} />
                <Card image={image5} />
                <Card image={image6} />
                <Card image={image7} />

                <div onClick={() => {inputImage.current.click(); setSelectedImage("input");}} className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#020220] border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 hover:border-4 hover:border-white cursor-pointer flex items-center justify-center ${selectedImage === "input" ? 'border-4 border-white shadow-2xl shadow-blue-950' : null}`}>
                    { !frontendImage && <RiImageAddLine className='text-white w-[25px] h-[25px]'/>}
                    { frontendImage && <img src={frontendImage} className="h-full object-cover" /> }
                </div>
                <input onChange={handleImage} type="file" accept='image/*' ref={inputImage} hidden/>
            </div>
            {selectedImage && <button onClick={() => navigate('/customize2')} className='w-[150px] h-[50px] mt-6 text-white font-semibold bg-blue-500 hover:bg-blue-800 rounded-full text-lg transition duration-200 flex items-center justify-center cursor-pointer'>Next</button>} 
        </div>
    )
}

export default Customize