import User from '../models/user.model.js';
import uploadToCloudinary  from '../config/cloudinary.js';

export const getCurrentUser = async(req, res) => {
    try {
        const userId = req.userId;
    
        const user = await User.findById(userId).select("-password");
    
        if( !user ) {
            return res.status(404).json({ message: "User not found" });
        }
    
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: "get user error" });   
    }
}


export const updateAssistant = async(req, res) => {
    try {
        
        const { assistantName, imageURL } = req.body;
        let assistantImage;

        if( req.file ){
            assistantImage = await uploadToCloudinary(req.file.path);
        }else{
            assistantImage = imageURL;
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            { assistantName, assistantImage },
            { new: true }
        ).select("-password");

        return res.status(200).json(user); 

    } catch (error) {
        // console.error("Update Assistant Error:", error);
        return res.status(500).json({ message: "update assistant error" });
    }
}