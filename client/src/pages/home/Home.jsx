import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-br from-gray-700 to-gray-900 text-white h-[100dvh] flex flex-col items-center justify-center p-8">
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-evenly w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-lg text-center md:text-left order-2 md:order-1"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text font-poppins text-transparent bg-gradient-to-r from-red-600 to-yellow-400">
            ComuniQ
          </h1>
          <p className="text-xl text-gray-400 mt-2">
            Seamless real-time communication, redefined.
          </p>
          <p className="text-lg text-gray-400 mt-2 hidden md:block">
            Connect with your team, friends, and family effortlessly. Experience
            the future of communication today.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-8"
          >
            <Button
              className="px-8 py-4 text-lg bg-yellow-600 hover:bg-yellow-700 rounded-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate("/auth")}
            >
              <div className="w-full">Get Started</div>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className=" md:mt-0 order-1 md:order-2"
        >
          <img
            src="https://illustrations.popsy.co/amber/communication.svg"
            alt="Communication Illustration"
            className="w-96 h-96 object-contain"
          />
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-14 text-center text-gray-400"
      >
        <p>© 2025 ComuniQ. All rights reserved.</p>
      </motion.div>
    </div>
  );
}
