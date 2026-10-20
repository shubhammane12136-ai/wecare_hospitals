import React, { useState } from 'react';
import { Department, Doctor } from '../types';
import { DEPARTMENTS, DOCTORS } from '../data/hospitalData';
import {
  HeartPulse,
  Brain,
  Bone,
  Baby,
  Activity,
  Wind,
  Calendar,
  Search,
  MapPin,
  Phone,
  CheckCircle,
  Star,
  User
} from 'lucide-react';

interface DepartmentsViewProps {
  onOpenBooking: (departmentId?: string, doctorId?: string) => void;
  onSelectDoctor: (doctor: Doctor) => void;
}

export const DepartmentsView: React.FC<DepartmentsViewProps> = ({
  onOpenBooking,
  onSelectDoctor,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState<string>('all');

  const getDepartmentIcon = (name: string) => {
    switch (name) {
      case 'HeartPulse': return <HeartPulse className="w-5 h-5 text-teal-600" />;
      case 'Brain': return <Brain className="w-5 h-5 text-teal-600" />;
      case 'Bone': return <Bone className="w-5 h-5 text-teal-600" />;
      case 'Baby': return <Baby className="w-5 h-5 text-teal-600" />;
      case 'Activity': return <Activity className="w-5 h-5 text-teal-600" />;
      default: return <Wind className="w-5 h-5 text-teal-600" />;
    }
  };

  const filteredDepartments = DEPARTMENTS.filter(dept => {
    if (selectedDeptId !== 'all' && dept.id !== selectedDeptId) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchName = dept.name.toLowerCase().includes(q);
      const matchDesc = dept.shortDescription.toLowerCase().includes(q) || dept.longDescription.toLowerCase().includes(q);
      const matchServices = dept.services.some(s => s.toLowerCase().includes(q));
      const matchTech = dept.keyTechnologies.some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchServices && !matchTech) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="space-y-4">
        <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">
          Clinical Departments & Institutes
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Multidisciplinary Medical Specialties
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          WeCare Hospitals brings together dedicated specialty departments, each equipped with dedicated outpatient suites, cutting-edge diagnostic technology, and a multidisciplinary panel of attending specialist physicians.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by specialty, condition, or clinical procedure..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
          />
        </div>

        {/* Department Quick Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedDeptId('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              selectedDeptId === 'all'
                ? 'bg-teal-600 text-white font-semibold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Departments ({DEPARTMENTS.length})
          </button>
          {DEPARTMENTS.map(dept => (
            <button
              key={dept.id}
              onClick={() => setSelectedDeptId(dept.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                selectedDeptId === dept.id
                  ? 'bg-teal-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {dept.name.split('&')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Departments Detail Cards */}
      <div className="space-y-12">
        {filteredDepartments.map((dept) => {
          const deptDoctors = DOCTORS.filter(d => d.departmentId === dept.id);

          return (
            <div
              key={dept.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow"
            >
              {/* Department Banner Header */}
              <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/30">
                    {getDepartmentIcon(dept.iconName)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-teal-400 font-semibold uppercase tracking-wider">
                      <span>{dept.location}</span>
                      <span aria-hidden="true">·</span>
                      <span>{dept.contactExtension}</span>
                      {dept.emergencyCare && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-rose-400 font-medium">24/7 Emergency Care</span>
                        </>
                      )}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                      {dept.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                      {dept.longDescription}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <button
                    onClick={() => onOpenBooking(dept.id)}
                    className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg cursor-pointer transition-colors shadow-xs"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book in this Department</span>
                  </button>
                </div>
              </div>

              {/* Department Body: Clinical Services + Key Technologies */}
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-200/80 bg-slate-50/50">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Core Clinical Services
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {dept.services.map((service, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Diagnostic & Surgical Technology
                  </h3>
                  <div className="space-y-2">
                    {dept.keyTechnologies.map((tech, i) => (
                      <div
                        key={i}
                        className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 flex items-center justify-between"
                      >
                        <span>{tech}</span>
                        <span className="text-[11px] text-teal-700 font-semibold uppercase">Advanced Suite</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Department Doctors Section: MULTIPLE DOCTORS PER DEPARTMENT */}
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Attending Physicians & Specialists in {dept.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {deptDoctors.length} board-certified specialists available for in-person and telehealth consultations.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {deptDoctors.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 bg-white border border-slate-200 rounded-xl hover:border-teal-500 transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                            {doc.image ? (
                              <img
                                src={doc.image}
                                alt={doc.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-teal-700 bg-teal-50">
                                {doc.fallbackInitials}
                              </div>
                            )}
                          </div>
                          <div className="space-y-0.5">
                            <h4 className="text-sm font-bold text-slate-900">
                              {doc.name}
                            </h4>
                            <p className="text-xs text-slate-600 line-clamp-1">
                              {doc.title}
                            </p>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                              <Star className="w-3 h-3 fill-teal-600 text-teal-600" />
                              <span className="font-semibold text-slate-800">{doc.rating}</span>
                              <span aria-hidden="true">·</span>
                              <span>{doc.experienceYears} yrs</span>
                            </div>
                          </div>
                        </div>

                        {/* Availability and Fee unboxed text */}
                        <div className="text-xs text-slate-600 pt-2 border-t border-slate-100 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Next Slot:</span>
                            <span className="font-medium text-slate-800">{doc.availability.nextSlot}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Consultation Fee:</span>
                            <span className="font-mono text-slate-900 font-semibold">${doc.consultationFee}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => onOpenBooking(dept.id, doc.id)}
                          className="flex-1 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg cursor-pointer transition-colors shadow-xs"
                          aria-label={`Book appointment with ${doc.name}`}
                        >
                          Book Doctor
                        </button>
                        <button
                          onClick={() => onSelectDoctor(doc)}
                          className="px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
                          aria-label={`View profile of ${doc.name}`}
                        >
                          Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {filteredDepartments.length === 0 && (
          <div className="text-center py-12 p-8 bg-white border border-slate-200 rounded-xl space-y-3">
            <p className="text-sm text-slate-600">No departments found matching "{searchQuery}".</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedDeptId('all'); }}
              className="text-xs font-semibold text-teal-700 underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
