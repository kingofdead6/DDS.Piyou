export default function Categories() {
  return (
    <section className="h-screen flex">
      {/* Men Side */}
      <a
        href="/category/men"
        className="relative w-1/2 h-full group overflow-hidden"
      >
        <img
          src="https://res.cloudinary.com/dtwa3lxdk/image/upload/v1763718178/download_vkvghk.jpg"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h2 className="text-white text-6xl font-bold tracking-wide">
            MEN
          </h2>
        </div>
      </a>

      {/* Women Side */}
      <a
        href="/category/women"
        className="relative w-1/2 h-full group overflow-hidden"
      >
        <img
          src="https://res.cloudinary.com/dtwa3lxdk/image/upload/v1763718178/Stunning_Casual_Outfits_With_Jeans_muvbnp.jpg"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h2 className="text-white text-6xl font-bold tracking-wide">
            WOMEN
          </h2>
        </div>
      </a>
    </section>
  );
}
