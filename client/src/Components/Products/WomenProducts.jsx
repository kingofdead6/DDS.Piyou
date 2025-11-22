import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const products = [
  {
    id: 1,
    name: 'The Urban Walker',
    price: 450,
    category: 'Sneakers',
    color: 'beige',
    gender: 'Unisex',
    image: 'https://res.cloudinary.com/dtwa3lxdk/image/upload/v1763721586/468950233_555581560607916_1075285265882447077_n_nxe88x.jpg',
  },
  {
    id: 2,
    name: 'The Midnight Heel',
    price: 780,
    category: 'Heels',
    color: 'beige',
    gender: 'Women',
    image: 'https://res.cloudinary.com/dtwa3lxdk/image/upload/v1763721586/468950233_555581560607916_1075285265882447077_n_nxe88x.jpg',
  },
  {
    id: 3,
    name: 'The City Loafer',
    price: 520,
    category: 'Loafers',
    color: 'brown',
    gender: 'Men',
    image: 'https://res.cloudinary.com/dtwa3lxdk/image/upload/v1763722004/20251121_1145_Sleek_Urban_Sneakers_simple_compose_01kak08x72etqb9n66kcmgvyfj_proj2d.png',
  },
  {
    id: 4,
    name: 'The Explorer Boot',
    price: 650,
    category: 'Boots',
    color: 'brown',
    gender: 'Men',
    image: 'https://res.cloudinary.com/dtwa3lxdk/image/upload/v1763722004/20251121_1145_Sleek_Urban_Sneakers_simple_compose_01kak08x72etqb9n66kcmgvyfj_proj2d.png',
  },
];

const categories = ['All Shoes', 'Sneakers', 'Boots', 'Heels', 'Loafers'];
const colors = ['black', 'white', 'beige', 'brown', 'gray'];

export default function WomenProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Shoes');
  const [minPrice, setMinPrice] = useState(150);
  const [maxPrice, setMaxPrice] = useState(850);
  const [selectedColor, setSelectedColor] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter only Men products + selected filters
  const filteredProducts = products.filter((p) => {
    if (p.gender !== 'Women') return false; // only men
    if (selectedCategory !== 'All Shoes' && p.category !== selectedCategory) return false;
    if (p.price < minPrice || p.price > maxPrice) return false;
    if (selectedColor && p.color !== selectedColor) return false;
    return true;
  });

  const productsPerPage = 6;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="min-h-screen bg-[#d8cfc7] pt-24">
      <div className="max-w-7xl mx-auto px-6 pb-10">
        <h1 className="text-3xl font-medium tracking-wide">Women's Shoes</h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 flex gap-16">
        {/* Filters */}
        <aside className="w-[300px] shrink-0 space-y-12">
          {/* Category */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-widest uppercase border-b border-black pb-3">
              Category
            </h3>
            <ul className="space-y-3 text-sm">
              {categories.map((cat) => (
                <li key={cat}>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="category"
                      checked={selectedCategory === cat}
                      onChange={() => setSelectedCategory(cat)}
                      className="w-4 h-4 accent-black "
                      
                    />
                    <span className="group-hover:underline underline-offset-4">{cat}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Price */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-widest uppercase border-b border-black pb-3">
              Price Range
            </h3>
            <input
              type="range"
              min="150"
              max="850"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-black"
            />
            <div className="flex justify-between text-xs text-gray-700">
              <span>$150</span>
              <span className="font-medium">${maxPrice}</span>
              <span>$850</span>
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-widest uppercase border-b border-black pb-3">
              Color
            </h3>
            <div className="flex gap-3 flex-wrap">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(selectedColor === color ? '' : color)}
                  className={`w-12 h-12 rounded-full border-2 transition ${
                    selectedColor === color ? 'border-black scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color === 'beige' ? '#d9d1c0' : color }}
                />
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          <div className="space-y-3 pt-4">
            <button
              onClick={() => {
                setSelectedCategory('All Shoes');
                setMinPrice(150);
                setMaxPrice(850);
                setSelectedColor('');
              }}
              className="w-full py-3 text-sm font-medium border border-black hover:bg-black hover:text-white transition"
            >
              Clear Filters
            </button>
          </div>
        </aside>

        {/* Products */}
        <main className="flex-1">
          <div className="grid grid-cols-3 gap-8">
            {displayedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                </Link>
                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-medium">{product.name}</h3>
                  <p className="text-gray-700">${product.price.toFixed(2)}</p>
                  <Link
                    to={`/product/${product.id}`}
                    className="block text-center mt-2 py-2 border border-black hover:bg-black hover:text-white transition rounded"
                  >
                    See Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-3 mt-10">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="text-xl px-2"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setCurrentPage(n)}
                className={`w-9 h-9 rounded-full text-sm ${
                  n === currentPage ? 'bg-black text-white' : 'hover:bg-gray-200'
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="text-xl px-2"
            >
              &gt;
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
