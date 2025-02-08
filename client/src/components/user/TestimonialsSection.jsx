import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowLeft, ArrowRight, Quote, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    content: "ServoLend has revolutionized our loan processing. We've cut processing time by 60% and improved customer satisfaction significantly.",
    author: "Sarah Johnson",
    position: "Head of Digital Lending",
    company: "FirstTech Bank",
    image: "/api/placeholder/64/64",
    rating: 5,
    companyLogo: "/api/placeholder/120/40",
    stats: {
      processTime: "60%",
      satisfaction: "95%"
    }
  },
  {
    id: 2,
    content: "The automated assessment system is a game-changer. Our risk analysis is more accurate, and we can serve customers faster than ever.",
    author: "Michael Chen",
    position: "CTO",
    company: "Future Finance",
    image: "/api/placeholder/64/64",
    rating: 5,
    companyLogo: "/api/placeholder/120/40",
    stats: {
      accuracy: "99%",
      speed: "5x"
    }
  },
  {
    id: 3,
    content: "Integration was seamless, and the customer support has been exceptional. ServoLend has transformed our lending operations completely.",
    author: "Priya Patel",
    position: "Operations Director",
    company: "Global Credit",
    image: "/api/placeholder/64/64",
    rating: 5,
    companyLogo: "/api/placeholder/120/40",
    stats: {
      efficiency: "85%",
      savings: "40%"
    }
  }
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    })
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => (prev + newDirection + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const timer = setInterval(() => paginate(1), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 bg-blue-100 rounded-full mb-4"
          >
            <span className="text-blue-600 font-medium">Success Stories</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how leading financial institutions are transforming their operations
          </p>
        </motion.div>

        <div className="relative h-[600px]">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute w-full"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto">
                <div className="relative">
                  <Quote className="absolute -top-4 -left-4 h-16 w-16 text-blue-100 rotate-180" />
                  
                  <div className="relative z-10">
                    <div className="flex justify-center mb-8">
                      <motion.img
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        src={testimonials[currentIndex].companyLogo}
                        alt={testimonials[currentIndex].company}
                        className="h-12 object-contain"
                      />
                    </div>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-xl md:text-2xl text-gray-700 mb-8 text-center italic"
                    >
                      "{testimonials[currentIndex].content}"
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center justify-center mb-8"
                    >
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                      ))}
                    </motion.div>

                    <div className="flex flex-col md:flex-row items-center justify-between">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center mb-6 md:mb-0"
                      >
                        <img
                          src={testimonials[currentIndex].image}
                          alt={testimonials[currentIndex].author}
                          className="w-16 h-16 rounded-full border-4 border-blue-100"
                        />
                        <div className="ml-4">
                          <div className="font-semibold text-lg text-gray-900">
                            {testimonials[currentIndex].author}
                          </div>
                          <div className="text-gray-600">
                            {testimonials[currentIndex].position}
                          </div>
                          <div className="text-blue-600">
                            {testimonials[currentIndex].company}
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="grid grid-cols-2 gap-4"
                      >
                        {Object.entries(testimonials[currentIndex].stats).map(([key, value], i) => (
                          <div key={key} className="bg-blue-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-blue-600">{value}</div>
                            <div className="text-sm text-blue-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                          </div>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute left-0 right-0 bottom-0 flex justify-center space-x-4 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => paginate(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm text-gray-800 p-3 rounded-full shadow-lg hover:bg-white transition-colors -ml-4 md:-ml-8"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>

          <button
            onClick={() => paginate(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm text-gray-800 p-3 rounded-full shadow-lg hover:bg-white transition-colors -mr-4 md:-mr-8"
          >
            <ArrowRight className="h-6 w-6" />
          </button>
        </div>

        {/* Partner Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <p className="text-center text-gray-600 mb-8">Trusted by leading financial institutions</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {[1, 2, 3, 4].map((index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="grayscale hover:grayscale-0 transition-all"
              >
                <img
                  src={`/api/placeholder/160/80`}
                  alt={`Partner ${index}`}
                  className="max-h-12 w-auto"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;