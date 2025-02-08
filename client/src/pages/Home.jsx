import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/user/HeroSection';
import FeaturesSection from '../components/user/FeaturesSection';
import StatsSection from '../components/user/StatsSection';
import BenefitsSection from '../components/user/BenefitsSection';
import TestimonialsSection from '../components/user/TestimonialsSection';
import CTASection from '../components/user/CTASection';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <BenefitsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;