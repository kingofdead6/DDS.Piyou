import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const products = [
  {
    id: 1,
    name: "Air Motion X",
    image: "https://images.unsplash.com/photo-1606813902914-4f2fdbb8f7ad",
    link: "/product/1",
  },
  {
    id: 2,
    name: "Urban Runner",
    image: "https://images.unsplash.com/photo-1528701800489-20be3c39b83c",
    link: "/product/2",
  },
  {
    id: 3,
    name: "Cloud Step",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    link: "/product/3",
  },
  {
    id: 4,
    name: "Beige Classic",
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2",
    link: "/product/4",
  },
  {
    id: 5,
    name: "Street Boost",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
    link: "/product/5",
  },
];

export default function ProductCarousel({ title, reverse = false }) {
  return (
    <section className="py-20">
      <h2 className="text-4xl font-bold text-center mb-10 text-[#2d2a26]">
        {title}
      </h2>

      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={30}
        slidesPerView={4}
        loop={true}
        navigation
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          reverseDirection: reverse,
        }}
        className="px-8"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <div className="bg-white rounded-2xl shadow-lg p-4 hover:scale-105 transition-all duration-300">
              <img
                src={product.image}
                className="w-full h-60 object-cover rounded-xl"
                alt={product.name}
              />

              <h3 className="text-lg font-semibold mt-4">
                {product.name}
              </h3>

              <a href={product.link}>
                <button className="mt-4 w-full bg-black text-white py-2 rounded-xl hover:bg-[#6f5f4b] transition">
                  View Details
                </button>
              </a>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
