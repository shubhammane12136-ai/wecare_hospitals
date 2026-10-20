import React from 'react';
import { NavPage, UserProfile } from '../types';
import { Phone, Calendar, Clock, MapPin, User, LogOut, LogIn } from 'lucide-react';

interface NavbarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  onOpenBooking: () => void;
  appointmentCount: number;
  user: UserProfile | null;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenBooking,
  appointmentCount,
  user,
  onOpenAuth,
  onSignOut,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

  const navLinks: { id: NavPage; label: string; badge?: number }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'departments', label: 'Departments' },
    { id: 'doctors', label: 'Doctors' },
    { id: 'my-appointments', label: 'My Appointments', badge: appointmentCount },
  ];

  const handleNavClick = (page: NavPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Clinical Strip: Emergency & Campus Info */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-rose-300 font-medium">
              <Phone className="w-3.5 h-3.5 text-rose-400" />
              <span>24/7 Emergency & Trauma: <strong className="text-white font-mono tabular-nums">1-800-932-2739</strong></span>
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>OPD Consultation: Mon - Sat 8:00 AM - 8:00 PM</span>
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>750 Medical Center Parkway, Metro Campus</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-teal-300 font-medium">JCI Gold Seal Accredited</span>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: 3 Zones */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (single text element) */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 sm:gap-3 text-left group cursor-pointer focus:outline-none shrink-0"
          aria-label="WeCare Hospitals Home"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs group-hover:bg-teal-700 transition-colors">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-xl font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors whitespace-nowrap shrink-0">
              WeCare Hospitals
            </span>
            <span className="hidden sm:block text-[11px] font-medium text-slate-500 tracking-wide uppercase">
              Center for Clinical Excellence
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 Nav Links (single-line, clean typography) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`relative py-1 cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-teal-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && link.badge > 0 ? (
                  <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-teal-100 text-teal-800 font-mono tabular-nums">
                    {link.badge}
                  </span>
                ) : null}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & User Account */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
                aria-label="Patient profile menu"
              >
                <div className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-[10px]">
                  {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline max-w-[110px] truncate">{user.displayName.split(' ')[0]}</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 text-xs">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <div className="font-bold text-slate-900 truncate">{user.displayName}</div>
                    <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleNavClick('my-appointments');
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    <span>My Consultation History</span>
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onSignOut();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 border-t border-slate-100 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth('signin')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              aria-label="Sign in to patient portal"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          <button
            onClick={onOpenBooking}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-teal-500"
            aria-label="Book a doctor consultation"
          >
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Book Appointment</span>
            <span className="sm:hidden">Book</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1">
          {/* Mobile User Profile Header */}
          {user ? (
            <div className="p-3 mb-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xs">
                  {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                </div>
                <div className="truncate max-w-[160px]">
                  <strong className="block text-slate-900 font-semibold">{user.displayName}</strong>
                  <span className="text-slate-500 text-[11px] truncate block">{user.email}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignOut();
                }}
                className="text-rose-600 font-semibold hover:underline"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="p-2 mb-2 flex items-center gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('signin');
                }}
                className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg text-center cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('signup');
                }}
                className="flex-1 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg text-center cursor-pointer"
              >
                Create Account
              </button>
            </div>
          )}

          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && link.badge > 0 ? (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-teal-100 text-teal-800 font-mono tabular-nums">
                    {link.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
