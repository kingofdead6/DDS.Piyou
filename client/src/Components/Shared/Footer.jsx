export default function Footer() {
  return (
    <footer className="bg-[#2d2a26] text-[#f5f0e8] py-16">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        {/* About */}
        <div>
          <h3 className="text-2xl font-bold mb-4">ShoeStore</h3>
          <p className="text-gray-300">
            Premium sneakers and shoes for men and women. Step into style with us!
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-[#ebe5db] transition">Home</a></li>
            <li><a href="/category/men" className="hover:text-[#ebe5db] transition">Men</a></li>
            <li><a href="/category/women" className="hover:text-[#ebe5db] transition">Women</a></li>
            <li><a href="#faq" className="hover:text-[#ebe5db] transition">FAQ</a></li>
            <li><a href="#contact" className="hover:text-[#ebe5db] transition">Contact</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-bold mb-4">Contact</h3>
          <p>Email: support@shoestore.com</p>
          <p>Phone: +1 234 567 890</p>
          <p>Address: 123 Sneaker Street, Fashion City</p>
        </div>
      </div>

      <div className="text-center mt-12 text-gray-400">
        &copy; {new Date().getFullYear()} ShoeStore. All rights reserved.
      </div>
    </footer>
  );
}
