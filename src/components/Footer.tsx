
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-20 h-8 rounded-full bg-gradient-to-br from-research-green to-research-black flex items-center justify-center">
                <span className="text-black font-bold text-lg">K-BIOX</span>
              </div>
            </Link>
            <p className="text-sm text-gray-600">
              Connecting researchers globally through shared interests and citation networks.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Platform
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/researchers" className="text-sm text-gray-600 hover:text-research-purple">
                  Find Researchers
                </Link>
              </li>
              <li>
                <Link to="/network" className="text-sm text-gray-600 hover:text-research-purple">
                  Citation Network
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:text-research-purple">
                  Upcoming Events
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-research-purple">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:text-research-purple">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:text-research-purple">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:text-research-purple">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Subscribe
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Get the latest updates on new features and researchers.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-research-purple"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-research-purple text-white rounded-md text-sm hover:bg-research-light-purple transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-400 text-center">
            © {new Date().getFullYear()} Research Nexus. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
