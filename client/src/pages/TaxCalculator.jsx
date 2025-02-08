import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const TaxCalculator = () => {
  return (
    <>
      <Navbar />
      <div className="h-screen flex flex-col justify-center items-center">
        <h1>Tax Calculator acc to new tax regime @2025</h1>
      </div>
      <Footer />
    </>
  );
};

export default TaxCalculator;
