import React, { useState } from "react";
import axios from 'axios';
import { useEffect } from "react";
const Navbar = () => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [  isUser, setIsUser ] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsUser(true);
    } else {
      setIsUser(false);
    }
  }, [])


  const loginDetails = async () => {

    const email = prompt("Enter Your Email");
    const password = prompt("Enter Your Password");

    try {

      const url = `${backendUrl}/login`;
      const res = await axios.post(url, {
        email, password
      })

      if (res.status === 200) {
        console.log("Successfully login ");
        localStorage.setItem("token", res.data.token);
        window.location.reload();

      }

    } catch (error) {
      console.error("❌ Error while login:", error.response?.data || error.message);
    }



  }
  const SignUpDetails = async () => {
    const name = prompt("Enter Your Name");
    const email = prompt("Enter Your Email");
    const password = prompt("Enter Your Password");

    try {

      const url = `${backendUrl}/signup`;
      const res = await axios.post(url, {
        name, email, password
      })

      if (res.status === 200) {
        console.log("Successfully Signed Up ");
        localStorage.setItem("token", res.data.token);
        window.location.reload();
      }

    } catch (error) {
      console.error("❌ Error while signing up:", error.response?.data || error.message);
    }
  }

  return (
    <nav className="bg-[#1e2a38] shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          🏠 Your Goals
        </h1>

        {isUser &&
          <div className="flex gap-4">
            <button onClick={loginDetails} className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition">
              Login
            </button>
            <button onClick={SignUpDetails} className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition">
              Sign Up
            </button>
          </div>}





      </div>
    </nav>
  );
};

export default Navbar;
