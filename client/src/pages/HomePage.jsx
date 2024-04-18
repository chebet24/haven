import React from 'react';
import Header from "../components/Layout/Header";
import Hero from "../components/Route/Hero/Hero";
import Categories from "../components/Route/Categories/Categories";
import BestDeals from "../components/Route/BestDeals/BestDeals";
import FeaturedProduct from "../components/Route/FeaturedProduct/FeaturedProduct";
import Events from "../components/Events/Events";

import Footer from "../components/Layout/Footer";

const HomePage = () => {
  return (
    <div>
      {/* Header (Nav bar) */}
      <Header activeHeading={1} />

      <div style={{ display: 'flex' }}>
        {/* Sidebar (Categories) */}
        <div style={{ flex: '0 0 10%', backgroundColor: '', padding: '10px' }}>
        <Categories />
        </div>

        {/* Main Content */}
        <div style={{ flex: '1', padding: '20px' }}>
          <Hero />
          
         
        </div>
      </div>
       <BestDeals /> 
       <Events />
          <FeaturedProduct /> 
          <Footer />  
    </div>
  );
}

export default HomePage;
