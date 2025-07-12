'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import MobileNav from './MobileNav';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 text-[var(--accent-500)]">
                🍸
              </div>
              <span className="text-xl font-bold text-white">
                Hotel Bar Finder
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                href="/search" 
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                Search
              </Link>
              <Link 
                href="/favorites" 
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                Favorites
              </Link>
              <Link 
                href="/login" 
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="btn-accent"
              >
                Sign Up
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
    </>
  );
}