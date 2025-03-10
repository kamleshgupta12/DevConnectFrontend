import { motion } from "framer-motion";
import { FaComments } from "react-icons/fa";
import { FaHandshakeSimple } from "react-icons/fa6";


export default function WelcomePage() {
    return (
        <div className="flex flex-col items-center justify-center 
        h-[85vh] bg-richblack-800 text-white">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="text-center"
            >
             <div className="flex justify-center">
             <FaComments className="text-6xl text-[#308d46] mb-4 animate-pulse" />
             </div>
                <h1 className="text-4xl font-bold mb-2 text-richblack-5">Welcome to <span className="text-[#308d46]">DevConnect Chat</span></h1>
                <p className="text-lg  mb-6 text-richblack-100">A seamless Peer-to-Peer chat experience for developers.</p>
                <motion.button
                 
                    className="text-4xl text-richblack-5"
                >
              <FaHandshakeSimple/>
                </motion.button>
            </motion.div>
        </div>
    );
}