import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Check if current environment is production
const isProduction = process.env.NODE_ENV === "production";

/**
 * Dynamic cookie options for res.cookie()
 * - Localhost (Development): secure = false, sameSite = "strict"
 * - Production: secure = true, sameSite = "none"
 */


export const googleAuth=async (req,res)=>{
    console.log("googleAuth Login Func")
    try {
        const {name,email,avatar}=req.body
        if(!email){
            return res.status(400).json({
                message:"email is required"
            })
        }
        const user=await User.findOne({email})
        if(!user){
            user=await User.create({name,email,avatar})
        }

        const token=await jwt.sign({id:user._id},process.env.JWT_SECRET, {expiresIn:"7d"})

        res.cookie("token",token,{
            httpOnly:true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "strict",
            maxAge:7*24*60*60*1000
        })

        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message:`google auth error ${error}`})
    }
}

export const logOut=async (req,res)=>{
    try {
        res.clearCookie("token",{
            httpOnly:true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "strict",
        })
        return res.status(200).json({message:"logout successfully"})
    } catch (error) {
        return res.status(500).json({message:`log out error ${error}`})
    }
}



// export const logOut = async (req, res) => {
//     try {
//         return res
//             .clearCookie("token", {
//                 httpOnly: true,
//                 secure: false, // Set to true in production with HTTPS
//                 sameSite: "strict"
//             })
//             .status(200)
//             .json({ message: "Logged out successfully" });
//     } catch (error) {
//         return res.status(500).json({ message: `log out error ${error}` });
//     }
// }