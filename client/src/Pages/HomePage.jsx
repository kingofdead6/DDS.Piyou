import React from 'react'
import Hero from '../Components/Home/Hero'
import Categories from '../Components/Home/Categories'
import ProductCarousel from '../Components/Home/ProductsCarousel'
import Announcements from '../Components/Home/Announcements'
import FAQ from '../Components/Home/FAQ'
import ContactUs from '../Components/Home/ContactUs'

const HomePage = () => {
  return (
    <div>
        <Hero />
         <ProductCarousel title=" Trending Products" reverse={false} />

      {/* ← Left */}
      <ProductCarousel title="Best Offers" reverse={true} />

      {/* Right → */}
      <ProductCarousel title=" Specials " reverse={false} />
        <Categories />
        <Announcements />
        <FAQ />
        <ContactUs />
    </div>
  )
}

export default HomePage