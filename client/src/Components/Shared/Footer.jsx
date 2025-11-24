// src/components/Footer.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import { translations } from "../../../translations";
import { Instagram, Facebook } from "lucide-react";

export default function Footer() {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang];

  const navLinks = t.navbar.items;

  return (
    <footer className="bg-[#2d2a26] text-[#f5f0e8] py-16" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand & Logo */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            {/* You can replace this with your actual logo */}
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-black text-[#2d2a26] text-xl">
              <img
                src="https://res.cloudinary.com/dtwa3lxdk/image/upload/v1763721586/468950233_555581560607916_1075285265882447077_n_nxe88x.jpg"
                alt="DDS Piyou Logo"
                className="h-12 w-auto rounded-full shadow-md"
              />
            </div>
            <h2 className="text-3xl font-bold tracking-wider">DDS.Piyou</h2>
          </div>
          <p className="text-gray-300 leading-relaxed max-w-xs">
            {lang === "fr"
              ? "Chaussures premium pour hommes et femmes. Style, confort et élégance à chaque pas."
              : "أحذية فاخرة للرجال والنساء. أناقة وراحة في كل خطوة."}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-6">{lang === "fr" ? "Liens rapides" : "روابط سريعة"}</h3>
          <ul className="space-y-4 text-lg">
            {navLinks.map((item) => (
              <li key={item.link}>
                <Link
                  to={item.link}
                  className="hover:text-white transition duration-200 inline-block border-b border-transparent hover:border-[#f5f0e8]"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Instagram Accounts */}
        <div>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Instagram size={22} />
            Instagram
          </h3>
          <ul className="space-y-4 text-lg">
            <li>
              <a
                href="https://www.instagram.com/dds_piyou?igsh=MXNicXE3bjFnbHYxcQ%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                @dds.piyou
              </a>
              <p className="text-sm text-gray-400">Page principale</p>
            </li>
            <li>
              <a
                href="https://www.instagram.com/ab_zone05/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                @AB-Zone
              </a>
              <p className="text-sm text-gray-400">Collection Homme</p>
            </li>
            <li>
              <a
                href="https://www.facebook.com/share/1BhUSmq8yQ/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                @Tchingo Mima 2 
              </a>
              <p className="text-sm text-gray-400">Collection Femme</p>
            </li>
          </ul>
        </div>

        {/* Facebook Accounts */}
        <div>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Facebook size={22} />
            Facebook
          </h3>
          <ul className="space-y-4 text-lg">
            <li>
              <a
                href="https://web.facebook.com/people/DDS-piyou/61556215403716/?rdid=s3mYsvn76NdBcZzV&share_url=https%3A%2F%2Fweb.facebook.com%2Fshare%2F1QimT9yoKM%2F%3F_rdc%3D1%26_rdr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                DDS.Piyou Officiel
              </a>
              <p className="text-sm text-gray-400">Page officielle</p>
            </li>
            <li>
              <a
                href="https://www.facebook.com/share/1BhUSmq8yQ/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                AB-Zone
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/share/1AWr9KbHSp/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                Tchingo Mima 2 
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-16 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
        <p>
          &copy; {new Date().getFullYear()} DDS.Piyou.{" "}
          {lang === "fr" ? "Tous droits réservés." : "كل الحقوق محفوظة."}
        </p>
      </div>
    </footer>
  );
}