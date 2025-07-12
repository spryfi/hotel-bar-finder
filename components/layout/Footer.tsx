import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[var(--primary-900)] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 text-[var(--accent-500)]">🍸</div>
              <span className="text-xl font-bold text-white">
                Hotel Bar Finder
              </span>
            </div>
            <p className="text-gray-400 max-w-md">
              The ultimate directory for business travelers and cocktail enthusiasts. 
              Never check into a dry hotel again.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/search" className="hover:text-white transition-colors duration-200">
                  Search Hotels
                </Link>
              </li>
              <li>
                <Link href="/cities/new-york" className="hover:text-white transition-colors duration-200">
                  New York
                </Link>
              </li>
              <li>
                <Link href="/cities/los-angeles" className="hover:text-white transition-colors duration-200">
                  Los Angeles
                </Link>
              </li>
              <li>
                <Link href="/cities/chicago" className="hover:text-white transition-colors duration-200">
                  Chicago
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-white transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors duration-200">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Hotel Bar Finder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}