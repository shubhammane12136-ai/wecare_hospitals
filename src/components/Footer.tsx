import React from 'react';
import { NavPage } from '../types';
import { Phone, MapPin, Mail, Clock, ShieldCheck } from 'lucide-react';
import { DEPARTMENTS } from '../data/hospitalData';

interface FooterProps {
  onNavigate: (page: NavPage) => void;
  onOpenBooking: (deptId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBooking }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand & Emergency Hotline */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
                <svg
                  className="w-5 h-5"
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
              <span className="text-lg font-bold text-white tracking-tight">
                WeCare Hospitals
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              WeCare Hospitals is a premier multidisciplinary healthcare center committed to clinical excellence, evidence-based therapies, and compassionate patient care.
            </p>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
              <div className="flex items-center gap-2 text-rose-400 font-semibold">
                <Phone className="w-3.5 h-3.5" />
                <span>24/7 Level 1 Trauma & Emergency Line</span>
              </div>
              <div className="text-white font-mono text-sm font-bold pl-5">
                1-800-932-2739 (1-800-WECARE-9)
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-white font-bold tracking-wider uppercase text-[11px]">
              Explore WeCare
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  About the Hospital
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('departments')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Medical Departments
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('doctors')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Find a Doctor
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('my-appointments')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  My Appointments
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Medical Departments Quick Links */}
          <div className="space-y-3">
            <h3 className="text-white font-bold tracking-wider uppercase text-[11px]">
              Departments
            </h3>
            <ul className="space-y-2">
              {DEPARTMENTS.slice(0, 5).map(d => (
                <li key={d.id}>
                  <button
                    onClick={() => {
                      onNavigate('departments');
                    }}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {d.name.split('&')[0]}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Campus Contact & Visiting */}
          <div className="space-y-3">
            <h3 className="text-white font-bold tracking-wider uppercase text-[11px]">
              Campus Contact
            </h3>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                <span>750 Medical Center Parkway, Metro Health City</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Outpatient Clinics: Mon-Sat 8am - 8pm</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>care@wecarehospitals.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} WeCare Hospitals Health System. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-teal-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>JCI Accredited Facility</span>
            </span>
            <span aria-hidden="true" className="text-slate-800">·</span>
            <span>HIPAA Compliant Data Handling</span>
            <span aria-hidden="true" className="text-slate-800">·</span>
            <span>Equal Opportunity Healthcare Provider</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
