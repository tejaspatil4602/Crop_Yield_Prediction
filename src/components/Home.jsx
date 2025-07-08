import { motion } from "framer-motion";
import { FaSeedling, FaChartLine, FaCloudSun, FaRobot, FaBullhorn } from "react-icons/fa";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-white py-8 flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 px-4 md:px-8 py-12">
        <motion.div
          className="flex-1 text-center md:text-left"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-green-800 mb-4 leading-tight">
            Predict Your Harvest. <br /> Empower Your Future.
        </h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-6">
            Welcome to the next generation of <span className="font-semibold text-green-700">Crop Yield Prediction</span>.<br />
            Harness the power of AI and data to maximize your farm's potential.
          </p>
          <button
            className="px-8 py-3 bg-green-600 text-white rounded-full text-lg font-semibold shadow-lg hover:bg-green-700 hover:scale-105 transition-all duration-300"
            onClick={() => window.location.href = "/login"}
          >
            Try Crop Prediction Now
          </button>
        </motion.div>
        <motion.div
          className="flex-1 flex justify-center md:justify-end"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <img
            src="/img12bg.png"
            alt="Green Earth with Tree"
            className="w-full max-w-md rounded-3xl shadow-xl border-4 border-green-200"
          />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-8 py-12">
        {[
          {
            icon: <FaChartLine className="text-4xl text-green-600 mx-auto mb-2" />,
            title: "AI-Powered Predictions",
            desc: "Get accurate yield forecasts using advanced machine learning."
          },
          {
            icon: <FaCloudSun className="text-4xl text-blue-500 mx-auto mb-2" />,
            title: "Weather Integration",
            desc: "Real-time weather data for smarter planning."
          },
          {
            icon: <FaRobot className="text-4xl text-gray-600 mx-auto mb-2" />,
            title: "AI Chat Assistant",
            desc: "Instant help and advice for your farming queries."
          },
          {
            icon: <FaSeedling className="text-4xl text-emerald-600 mx-auto mb-2" />,
            title: "Data-Driven Insights",
            desc: "Make informed decisions for higher productivity."
          }
        ].map((f, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-green-100 text-center transition-all duration-300 hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            {f.icon}
            <h3 className="text-xl font-bold mb-2 text-green-800">{f.title}</h3>
            <p className="text-gray-600">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Promotion Section */}
      <section className="w-full max-w-4xl mx-auto px-4 md:px-8 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-green-800 mb-4 flex items-center justify-center gap-2">
            <FaBullhorn className="inline-block text-green-600" /> Promote Your Farm's Success!
            </h2>
          <p className="text-lg text-gray-700 mb-6">
            Join thousands of farmers who are transforming their yields with our platform.<br />
            Share your success stories and help us grow a smarter, more sustainable agricultural community.
          </p>
          <button
            className="px-8 py-3 bg-emerald-500 text-white rounded-full text-lg font-semibold shadow-lg hover:bg-emerald-600 hover:scale-105 transition-all duration-300"
            onClick={() => window.location.href = "/contact"}
          >
            Contact Us for Partnership
          </button>
          </motion.div>
      </section>
    </div>
  );
};

export default Home;
