"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  onLaunch: () => void;
};

export default function NavigationBar({ onLaunch }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How it works" },
    { href: "#explore", label: "Explore" },
    { href: "#about", label: "About" },
  ];

  return (
    // <>
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-nav border-b border-base shadow-sm" : "bg-tranparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-bold text-sm">
            SC
          </div>
          <span className="font-bold text-lg text-primary">SkillChain</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-secondary hover:text-primary transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <button
            className="btn-primary px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            onClick={onLaunch}
          >
            Launch App
          </button>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {[
            menuOpen ? "rotate-45 translate-y-2" : "",
            menuOpen ? "opacity-0 scale-x-0" : "",
            menuOpen ? "-rotate-45 -translate-y-2" : "",
          ].map((extra, i) => (
            <span
              key={i}
              className={`block h-0.5 w-6 rounded transition-all duration-300 origin-center ${extra}`}
              style={{ backgroundColor: "var(--text-primary)" }}
            />
          ))}
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-nav px-6 pb-4 flex flex-col gap-4 border-t border-base pt-4">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-secondary hover:text-primary transition-colors"
            >
              {label}
            </Link>
          ))}

          <button
            className="btn-primary w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            onClick={() => {
              setMenuOpen(false);
              onLaunch();
            }}
          >
            Launch App
          </button>
        </div>
      </div>
    </nav>
  );
}
