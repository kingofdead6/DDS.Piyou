import ProductCarousel from "./ProductsCarousel";

const trending = [
  { id: 1, name: "Urban Walk", price: "$120", image: "https://source.unsplash.com/600x600/?sneakers" },
  { id: 2, name: "Desert Pro", price: "$99", image: "https://source.unsplash.com/600x600/?shoes" },
  { id: 3, name: "Beige Run", price: "$110", image: "https://source.unsplash.com/600x600/?running-shoes" }
];

const bestOffers = [
  { id: 1, name: "Street Flex", price: "$89", image: "https://source.unsplash.com/600x600/?nike-shoes" },
  { id: 2, name: "Speed Max", price: "$79", image: "https://source.unsplash.com/600x600/?sports-shoes" }
];

const newDrops = [
  { id: 1, name: "Canvas Elite", price: "$140", image: "https://source.unsplash.com/600x600/?fashion-shoes" },
  { id: 2, name: "Minimal Walk", price: "$95", image: "https://source.unsplash.com/600x600/?beige-shoes" }
];

const specialPicks = [
  { id: 1, name: "Limited Sand", price: "$180", image: "https://source.unsplash.com/600x600/?luxury-shoes" }
];

export default function HomeCarousels() {
  return (
    <>
      <ProductCarousel title="Trending Now" products={trending} />
      <ProductCarousel title="Best Offers" products={bestOffers} />
      <ProductCarousel title="New Drops" products={newDrops} />
      <ProductCarousel title="Special Picks" products={specialPicks} />
    </>
  );
}
