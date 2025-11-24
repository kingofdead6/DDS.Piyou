import React, { useContext } from 'react';
import { LanguageContext } from "../Components/context/LanguageContext";
import { translations } from "../../translations";

import Hero from '../Components/Home/Hero';
import Categories from '../Components/Home/Categories';
import ProductCarousel from '../Components/Home/ProductsCarousel';
import FAQ from '../Components/Home/FAQ';

const HomePage = () => {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang].home;

  return (
    <div>
      <Hero />

      <ProductCarousel 
        titleKey="trendingProducts"   // ← correct key (camelCase, no space)
        reverse={false} 
        endpoint="trending" 
      />

      <ProductCarousel 
        titleKey="bestOffers"         // ← correct key
        reverse={true} 
        endpoint="best-offers" 
      />

      <ProductCarousel 
        titleKey="specialOffers"      // ← correct key (I recommend this instead of "specials")
        reverse={false} 
        endpoint="specials" 
      />

      <Categories />
      <FAQ />
    </div>
  );
};

export default HomePage;