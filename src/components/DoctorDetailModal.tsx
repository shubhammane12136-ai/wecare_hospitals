import React from 'react';
import { Doctor } from '../types';
import { X, Calendar, MapPin, Globe2, Award, Star, Clock } from 'lucide-react';

interface DoctorDetailModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onBook: (doctor: Doctor) => void;
}

export const DoctorDetailModal: React.FC<DoctorDetailModalProps> = ({
  doctor,
  onClose,
  onBook,
}) => {
  if (!doctor) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="doctor-detail-title"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header with Close */}
        <div className="bg-slate-900 text-white p-6 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-800 shrink-0 border-2 border-teal-500/40">
              {doctor.image ? (
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-teal-400 font-bold text-xl bg-slate-800">
                  {doctor.fallbackInitials}
                </div>
              )}
            </div>
            <div>
              <div className="text-xs text-teal-400 font-medium tracking-wide uppercase">
                {doctor.departmentName}
              </div>
              <h2 id="doctor-detail-title" className="text-xl font-bold tracking-tight text-white mt-0.5">
                {doctor.name}
              </h2>
              <p className="text-xs text-slate-300 mt-1 font-mono">
                {doctor.degrees}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
            aria-label="Close doctor details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Quick Indicators (Unboxed text with separators, no pills) */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pb-4 border-b border-slate-200">
            <span className="flex items-center gap-1 font-semibold text-teal-700">
              <Star className="w-3.5 h-3.5 fill-teal-600 text-teal-600" />
              <span>{doctor.rating}</span>
              <span className="text-slate-500 font-normal">({doctor.reviewCount} verified reviews)</span>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{doctor.experienceYears} Years Clinical Experience</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-mono text-slate-900 font-semibold">Consultation: ${doctor.consultationFee}</span>
          </div>

          {/* Biography */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Clinical Background & Specialization
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {doctor.bio}
            </p>
          </div>

          {/* Specialties List */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Clinical Sub-Specialties
            </h3>
            <div className="flex flex-wrap gap-2">
              {doctor.specialties.map((spec, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-xs text-slate-700 bg-slate-100 border border-slate-200 rounded-md font-medium"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Office, Languages & Schedule Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 font-semibold mb-0.5">Consultation Suite</strong>
                <span>{doctor.office}</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 font-semibold mb-0.5">Consulting Days</strong>
                <span>{doctor.availability.days.join(', ')}</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Globe2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 font-semibold mb-0.5">Languages Spoken</strong>
                <span>{doctor.languages.join(', ')}</span>
              </div>
            </div>
            {doctor.awards && doctor.awards.length > 0 && (
              <div className="flex items-start gap-2.5">
                <Award className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 font-semibold mb-0.5">Honors & Fellowships</strong>
                  <span>{doctor.awards[0]}</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div className="text-xs text-slate-500">
              <span>Next Available: </span>
              <strong className="text-slate-900">{doctor.availability.nextSlot}</strong>
            </div>
            <button
              onClick={() => {
                onClose();
                onBook(doctor);
              }}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg cursor-pointer transition-colors shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment with {doctor.name}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
