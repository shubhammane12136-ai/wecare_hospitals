import React, { useState, useMemo } from 'react';
import { Doctor } from '../types';
import { DEPARTMENTS, DOCTORS } from '../data/hospitalData';
import { filterDoctors } from '../utils/bookingLogic';
import {
  Search,
  Calendar,
  Star,
  MapPin,
  Clock,
  Filter,
  Check,
  Award
} from 'lucide-react';

interface DoctorsViewProps {
  onOpenBooking: (departmentId?: string, doctorId?: string) => void;
  onSelectDoctor: (doctor: Doctor) => void;
}

export const DoctorsView: React.FC<DoctorsViewProps> = ({
  onOpenBooking,
  onSelectDoctor,
}) => {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [availableTodayOnly, setAvailableTodayOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'fee'>('rating');

  const filtered = useMemo(() => {
    let result = filterDoctors(DOCTORS, {
      departmentId: selectedDept,
      search,
      availableTodayOnly,
    });

    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'experience') {
      result.sort((a, b) => b.experienceYears - a.experienceYears);
    } else if (sortBy === 'fee') {
      result.sort((a, b) => a.consultationFee - b.consultationFee);
    }

    return result;
  }, [search, selectedDept, availableTodayOnly, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">
          Physician & Surgeon Directory
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Find a Specialist Doctor
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          Browse our team of board-certified clinicians, surgeons, and department chairs across all medical disciplines. Filter by specialty or find doctors available for same-day consultation.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by doctor name, specialty (e.g. angioplasty, stroke, hip replacement)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs font-semibold text-slate-600 whitespace-nowrap">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="rating">Highest Patient Rating</option>
              <option value="experience">Years of Experience</option>
              <option value="fee">Consultation Fee (Low to High)</option>
            </select>
          </div>
        </div>

        {/* Department Filters & Checkbox */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedDept('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                selectedDept === 'all'
                  ? 'bg-teal-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Specialties ({DOCTORS.length})
            </button>
            {DEPARTMENTS.map(dept => {
              const count = DOCTORS.filter(d => d.departmentId === dept.id).length;
              return (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDept(dept.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    selectedDept === dept.id
                      ? 'bg-teal-600 text-white font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {dept.name.split('&')[0]} ({count})
                </button>
              );
            })}
          </div>

          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none whitespace-nowrap">
            <input
              type="checkbox"
              checked={availableTodayOnly}
              onChange={(e) => setAvailableTodayOnly(e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
            />
            <span>Show Available Today Only</span>
          </label>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-teal-400 hover:shadow-lg transition-all duration-200"
          >
            <div>
              {/* Doctor Head Photo & Basic Info */}
              <div className="p-6 pb-4 flex items-start gap-4">
                <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                  {doctor.image ? (
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-teal-800 text-lg bg-teal-50">
                      {doctor.fallbackInitials}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-teal-700 uppercase tracking-wide">
                    {doctor.departmentName}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {doctor.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {doctor.degrees}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-600 pt-0.5">
                    <span className="flex items-center gap-1 font-semibold text-teal-700">
                      <Star className="w-3.5 h-3.5 fill-teal-600 text-teal-600" />
                      <span>{doctor.rating}</span>
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-500">{doctor.reviewCount} reviews</span>
                  </div>
                </div>
              </div>

              {/* Bio & Specialties */}
              <div className="px-6 py-2 space-y-3">
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {doctor.bio}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {doctor.specialties.slice(0, 3).map((spec, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-[11px] text-slate-700 bg-slate-100 rounded font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                  {doctor.specialties.length > 3 && (
                    <span className="text-[11px] text-slate-400 self-center">
                      +{doctor.specialties.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Meta details strip */}
              <div className="px-6 py-3 mt-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span>Next Slot:</span>
                  </span>
                  <span className="font-semibold text-slate-800">{doctor.availability.nextSlot}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Suite:</span>
                  </span>
                  <span className="text-slate-700 truncate max-w-[170px]">{doctor.office}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                  <span className="text-slate-500">Consultation Fee:</span>
                  <span className="font-mono text-slate-900 font-bold">${doctor.consultationFee}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 pt-4 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => onOpenBooking(doctor.departmentId, doctor.id)}
                className="flex-1 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg cursor-pointer transition-colors shadow-xs"
                aria-label={`Book appointment with ${doctor.name}`}
              >
                Book Appointment
              </button>
              <button
                onClick={() => onSelectDoctor(doctor)}
                className="px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
                aria-label={`View profile of ${doctor.name}`}
              >
                Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl space-y-3">
          <p className="text-slate-600 text-sm">No doctors found matching your criteria.</p>
          <button
            onClick={() => { setSearch(''); setSelectedDept('all'); setAvailableTodayOnly(false); }}
            className="text-xs font-semibold text-teal-700 underline cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};
