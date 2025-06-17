import React from "react";
import { motion } from "framer-motion";
import { FaFacebookF, FaLinkedinIn, FaGithub } from "react-icons/fa";
import bebo from "../../../src/assets/images/bebo.jpg";
import alaa from "../../../src/assets/images/Alaa.jpg";
import eslam from "../../../src/assets/images/Eslam.png";
import hossam from "../../../src/assets/images/hossam.png";

const teamMembers = [
  { img: alaa, name: "Alaa", role: "Frontend Developer" },
  { img: "https://i.imgur.com/vOONp7T.png", name: "Habiba", role: "UI/UX Designer" },
  { img: eslam, name: "Eslam", role: "Backend Developer" },
  { img: bebo, name: "Abdelrahman", role: "Full Stack Developer" },
  { img: hossam, name: "Hossam", role: "Project Manager" },
  { img: "https://i.imgur.com/mV0hE6p.png", name: "Ayten", role: "Marketing Specialist" },
  { img: "https://i.imgur.com/Zd0Lx0M.png", name: "Ahmed", role: "Business Analyst" },
  { img: "https://i.imgur.com/OtG6a9p.png", name: "Sara", role: "QA Engineer" },
  { img: "https://i.imgur.com/Y0S1L8y.png", name: "Mohamed", role: "Data Scientist" },
  { img: "https://i.imgur.com/ffWnINe.png", name: "Nada", role: "Content Creator" },
  { img: "https://i.imgur.com/I7VmjCe.png", name: "Omar", role: "DevOps Engineer" },
  { img: "https://i.imgur.com/1x1USeR.png", name: "Lina", role: "Product Owner" },
  { img: "https://i.imgur.com/QGeOfbr.png", name: "Youssef", role: "UI Designer" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] to-[#1c2333] p-10 text-white flex flex-col items-center">
      {/* Optional Lottie Animation here if needed */}
      <h1 className="text-4xl md:text-5xl font-bold mb-10 bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 text-transparent bg-clip-text">
        Meet Our Dream Team
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-7xl">
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.6, type: "spring" }}
            whileHover={{ scale: 1.05 }}
            className="relative bg-white/10 border border-white/20 rounded-2xl backdrop-blur-md p-4 flex flex-col items-center text-center shadow-xl hover:shadow-2xl hover:shadow-purple-500 transition duration-300 group overflow-hidden"
          >
            {/* Gradient Blur Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 opacity-20 blur-lg rounded-xl group-hover:opacity-40 transition" />

            {/* Pulse Animation */}
            <motion.img
              src={member.img}
              alt={member.name}
              className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-white z-10"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
            />
            <h3 className="mt-4 text-lg md:text-xl font-semibold z-10">{member.name}</h3>
            <p className="text-sm text-gray-300 mt-1 z-10">{member.role}</p>

            {/* Social Icons on Hover */}
            <div className="absolute bottom-4 flex gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20">
              <a href="#" className="text-white hover:text-blue-400">
                <FaFacebookF size={18} />
              </a>
              <a href="#" className="text-white hover:text-blue-300">
                <FaLinkedinIn size={18} />
              </a>
              <a href="#" className="text-white hover:text-gray-400">
                <FaGithub size={18} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default About;
