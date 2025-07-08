import React, { useState } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaGithub,
} from "react-icons/fa";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    message: "",
  });

  const [submitStatus, setSubmitStatus] = useState({
    message: "",
    isError: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ message: "", isError: false });

    try {
      const response = await axios.post(
        "http://localhost:5002/api/contact",
        formData
      );
      setSubmitStatus({
        message: "Message sent successfully!",
        isError: false,
      });
      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        message: "",
      });
    } catch (error) {
      setSubmitStatus({
        message: error.response?.data?.message || "Failed to send message",
        isError: true,
      });
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-[#E6F4EA] p-8 overflow-hidden">
      <div className="bg-green shadow-xl rounded-3xl p-8 w-full max-w-5xl flex flex-col md:flex-row gap-8 relative z-10 border-2 border-[#81C784]">
        <div className="md:w-2/3 w-full">
          <h2 className="text-2xl font-semibold mb-2">
          Contact our team
          </h2>
          <p className="text-gray-600 text-sm mb-8">
          Reach out to us! We're happy to assist with crop insights, tech
            help, or anything in between. Fill in your details and we'll respond
            soon!
          </p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {submitStatus.message && (
              <div
                className={`p-3 rounded-lg ${
                  submitStatus.isError
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {submitStatus.message}
              </div>
            )}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Contact Number"
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email ID"
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Query"
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 w-full h-32 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              required
            ></textarea>
            <button className="w-full bg-primary-600 text-white font-semibold py-3 rounded-lg hover:bg-primary-700 transition-colors duration-300">
              SUBMIT
            </button>
          </form>
        </div>
        <div className="md:w-1/3 w-full bg-[#79d47d] text-white rounded-2xl p-8 flex flex-col items-center text-center shadow-lg border-2 border-[#388e3c]">
          <h3 className="text-xl font-semibold mb-2">Connect with us</h3>
          <p className="text-sm text-primary-100 mb-8">
            Follow us on social media
          </p>
          <div className="grid grid-cols-2 gap-6">
            <a
              href="#"
              className="text-white text-3xl hover:text-primary-200 transition-colors duration-300"
            >
              <FaFacebook />
            </a>
            <a
              href="#"
              className="text-white text-3xl hover:text-primary-200 transition-colors duration-300"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="text-white text-3xl hover:text-primary-200 transition-colors duration-300"
            >
              <FaLinkedin />
            </a>
            <a
              href="#"
              className="text-white text-3xl hover:text-primary-200 transition-colors duration-300"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="text-white text-3xl hover:text-primary-200 transition-colors duration-300"
            >
              <FaYoutube />
            </a>
            <a
              href="#"
              className="text-white text-3xl hover:text-primary-200 transition-colors duration-300"
            >
              <FaGithub />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
