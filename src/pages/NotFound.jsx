import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center px-4 py-16 bg-background">
      <motion.div
        className="text-center max-w-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl md:text-4xl font-semibold text-metal mb-6">
          Page Not Found
        </h2>
        <p className="text-lg text-metal mb-10">
          The page you are looking for doesn't exist or has been moved. Please
          go back to the homepage.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary hover:bg-opacity-90 text-onPrimary py-3 px-8 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105"
        >
          <Home size={20} />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}

export default NotFound;
