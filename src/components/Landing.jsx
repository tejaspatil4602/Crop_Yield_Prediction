import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChartLine, FaCloud, FaHistory, FaRobot, FaBullhorn, FaSeedling } from 'react-icons/fa';
import { BiCrop, BiData, BiShield, BiTrendingUp } from 'react-icons/bi';

const Landing = () => {
  const navigate = useNavigate();

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const features = [
    {
      icon: <FaChartLine className="text-4xl text-green-600" />,
      title: 'AI-Powered Yield Predictions',
      description: 'Advanced machine learning algorithms for accurate crop predictions.'
    },
    {
      icon: <FaCloud className="text-4xl text-blue-500" />,
      title: 'Real-time Weather Monitoring',
      description: 'Stay updated with live weather data and forecasts.'
    },
    {
      icon: <FaHistory className="text-4xl text-orange-600" />,
      title: 'Historical Data Analysis',
      description: 'Learn from past trends to improve future yields.'
    },
    {
      icon: <FaRobot className="text-4xl text-gray-600" />,
      title: 'Interactive AI Chat Support',
      description: 'Get instant answers to your farming queries.'
    }
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full h-[100vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-green-100 to-green-50 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 w-full h-full bg-[url('/farm-bg.svg')] bg-cover bg-center opacity-30 bg-fixed transform scale-105" />
        </div>
        <motion.div 
          className="relative max-w-4xl mx-auto text-center"
          initial="initial"
          animate="animate"
          variants={fadeIn}
        >
          <div className="mb-4">
            <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-700 tracking-tight drop-shadow-lg">AgriPredictor</span>
          </div>
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-green-800 mb-6 drop-shadow-lg"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Revolutionize Your Farming with AI
          </motion.h1>
          <motion.p
            className="text-xl sm:text-2xl text-gray-700 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Welcome to the future of agriculture! Our crop yield prediction website empowers farmers and agri-businesses with cutting-edge technology, real-time data, and actionable insights. Maximize your harvest, minimize risks, and make data-driven decisions for a sustainable and profitable future.
          </motion.p>
          <motion.div
            className="flex flex-col items-center gap-4 mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <span className="inline-flex items-center gap-2 bg-green-200/80 text-green-900 px-4 py-2 rounded-full shadow-md animate-pulse">
              <FaBullhorn className="text-green-600 animate-bounce" />
              <span className="font-semibold">Promoting Smart Farming for Everyone!</span>
            </span>
            <span className="inline-flex items-center gap-2 bg-green-100/80 text-green-800 px-4 py-2 rounded-full shadow animate-fade-in">
              <FaSeedling className="text-emerald-600 animate-spin-slow" />
              <span>Join thousands of farmers already boosting their yields!</span>
            </span>
          </motion.div>
          <button
            onClick={() => navigate('/home')}
            className="px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-full text-xl font-bold shadow-xl hover:from-green-700 hover:to-emerald-600 hover:scale-105 transition-all duration-300 animate-fade-in"
          >
            Get Started
          </button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-green-800 mb-4">
              Powerful Features for Smart Farming
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Combining advanced machine learning algorithms with real-time weather data and historical trends to deliver powerful, actionable insights.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-green-100 text-center transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-green-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;