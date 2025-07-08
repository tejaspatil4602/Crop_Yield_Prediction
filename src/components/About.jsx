import React from "react";
import { motion } from "framer-motion";
import {
  Leaf,
  BarChart,
  CloudSun,
  Lightbulb,
  MonitorSmartphone,
  Cloud,
  MessageSquare,
  LineChart,
  Brain,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: <MonitorSmartphone size={32} className="text-green-600" />,
    text: "AI-Powered Yield Predictions",
    description:
      "Advanced machine learning algorithms provide accurate crop yield forecasts based on multiple environmental factors.",
  },
  {
    icon: <Cloud size={32} className="text-green-600" />,
    text: "Real-time Weather Monitoring",
    description:
      "Stay informed with up-to-the-minute weather updates and forecasts that affect your crop growth.",
  },
  {
    icon: <MessageSquare size={32} className="text-green-600" />,
    text: "Interactive AI Chat Support",
    description:
      "Get instant assistance and expert advice through our AI-powered chat system.",
  },
  {
    icon: <LineChart size={32} className="text-green-600" />,
    text: "Historical Data Analysis",
    description:
      "Make informed decisions using comprehensive historical yield and weather pattern data.",
  },
  {
    icon: <Brain size={32} className="text-green-600" />,
    text: "Data-Driven Decisions",
    description:
      "Optimize your farming strategies with insights derived from comprehensive data analysis.",
  },
  {
    icon: <TrendingUp size={32} className="text-green-600" />,
    text: "Increased Productivity",
    description:
      "Boost your farm's efficiency and yield through data-backed recommendations and insights.",
  },
];

const aboutItems = [
  {
    icon: <Leaf size={32} className="text-green-600" />,
    title: "Smart Farming",
    description:
      "Bringing AI and machine learning into agriculture to help farmers make better decisions.",
  },
  {
    icon: <BarChart size={32} className="text-green-600" />,
    title: "Yield Predictions",
    description:
      "Get accurate yield predictions based on soil, weather, and crop data.",
  },
  {
    icon: <CloudSun size={32} className="text-green-600" />,
    title: "Real-time Insights",
    description:
      "Stay updated with climate and crop data to reduce risks and improve productivity.",
  },
  {
    icon: <Lightbulb size={32} className="text-green-600" />,
    title: "Innovative Approach",
    description:
      "Blending technology with agriculture to promote sustainable and smart farming.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 text-gray-800 px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center"
      >
        <motion.h1
          className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-green-500 via-green-600 to-green-800 text-transparent bg-clip-text animate-gradient"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          About Crop Yield Predictor
        </motion.h1>
        <motion.p
          className="text-lg sm:text-xl text-gray-600 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Our platform is designed to empower farmers and researchers by
          predicting crop yields with the help of intelligent machine learning
          models. We combine environmental, soil, and crop data to create smart
          insights and practical recommendations.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
          {aboutItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-green-50/80 backdrop-blur p-6 rounded-2xl shadow-md hover:shadow-xl transform transition-all duration-300 group"
            >
              <motion.div
                className="mb-4 text-green-600 group-hover:text-green-700 transition-colors duration-300"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                {item.icon}
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 text-green-800 group-hover:text-green-600 transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.h2
          className="text-3xl sm:text-4xl font-bold mb-12 bg-gradient-to-r from-green-500 via-green-600 to-green-800 text-transparent bg-clip-text"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          Key Features
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: "easeOut",
              }}
              className="relative group bg-white/50 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start space-x-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 text-white transform group-hover:scale-110 transition-all duration-300">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300">
                    {feature.text}
                  </h3>
                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
