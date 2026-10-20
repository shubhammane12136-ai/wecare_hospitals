import React from 'react';
import { Department, Doctor, NavPage } from '../types';
import { DEPARTMENTS, DOCTORS, HOSPITAL_HERO_IMAGE, HOSPITAL_FACILITY_IMAGE, HOSPITAL_METRICS, ACCREDITATIONS, PATIENT_TESTIMONIALS } from '../data/hospitalData';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Star,
  Activity,
  HeartPulse,
  Brain,
  Bone,
  Baby,
  Wind
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (page: NavPage) => void;
  onOpenBooking: (deptId?: string, docId?: string) => void;
  onSelectDoctor: (doctor: Doctor) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenBooking,
  onSelectDoctor,
}) => {
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

  // Top 4 featured doctors
  const featuredDoctors = DOCTORS.slice(0, 4);

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-35 mix-blend-overlay">
          <img
            src={HOSPITAL_HERO_IMAGE}
            alt="WeCare Hospitals Campus Architecture"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl space-y-6">
            <div className="text-xs font-semibold text-teal-400 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Accredited Academic & Clinical Medical Center</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Compassionate Care, Clinical Precision.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              At WeCare Hospitals, world-class medical specialists, groundbreaking robotic technology, and compassionate bedside care unite to provide exceptional healthcare for you and your family.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onOpenBooking()}
                className="flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Doctor Appointment</span>
              </button>
              <button
                onClick={() => onNavigate('doctors')}
                className="flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg transition-all cursor-pointer"
              >
                <span>Find a Specialist</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Quick Unboxed Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-4 border-t border-slate-800/80">
              <span>Level 1 Trauma Center</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>120+ Specialist Doctors</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Door-to-Balloon &lt; 45 mins</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>24/7 Emergency Care</span>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Metrics Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-30">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-slate-100 p-6 sm:p-8">
          {HOSPITAL_METRICS.map((metric, i) => (
            <div key={i} className="p-4 sm:p-6 text-center sm:text-left space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
                {metric.value}
              </div>
              <div className="text-sm font-bold text-teal-800">
                {metric.label}
              </div>
              <p className="text-xs text-slate-500 leading-normal">
                {metric.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Fast Medical Department Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Centers of Excellence
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
              Specialized Medical Departments
            </h2>
          </div>
          <button
            onClick={() => onNavigate('departments')}
            className="flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800 cursor-pointer"
          >
            <span>View All Departments</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEPARTMENTS.map((dept) => {
            const deptDocs = DOCTORS.filter(d => d.departmentId === dept.id);
            return (
              <div
                key={dept.id}
                className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-teal-500 hover:shadow-md transition-all duration-200"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center">
                    {getDepartmentIcon(dept.iconName)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {dept.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {dept.shortDescription}
                    </p>
                  </div>

                  {/* Clean unboxed doctors count & lead */}
                  <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span>Staff Physicians:</span>
                      <strong className="text-slate-800 font-semibold">{deptDocs.length} Specialists</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Department Head:</span>
                      <span className="text-slate-700 font-medium truncate max-w-[180px]">{dept.headOfDepartment.split(',')[0]}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-5 mt-5 border-t border-slate-100">
                  <button
                    onClick={() => onOpenBooking(dept.id)}
                    className="flex-1 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg cursor-pointer transition-colors"
                  >
                    Book Consultation
                  </button>
                  <button
                    onClick={() => onNavigate('departments')}
                    className="px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Doctors Spotlight */}
      <section className="bg-slate-100/70 border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                Distinguished Specialists
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
                Meet Our Department Chairs & Specialists
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Each clinical department at WeCare is led by internationally recognized physicians and surgeons.
              </p>
            </div>
            <button
              onClick={() => onNavigate('doctors')}
              className="flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800 cursor-pointer"
            >
              <span>Explore All Doctors</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-200"
              >
                <div>
                  <div className="aspect-square w-full bg-slate-200 overflow-hidden relative">
                    {doctor.image ? (
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-teal-800 text-white font-bold text-2xl">
                        {doctor.fallbackInitials}
                      </div>
                    )}
                    <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[11px] font-mono">
                      ★ {doctor.rating}
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="text-[11px] font-semibold text-teal-700 uppercase tracking-wide">
                      {doctor.departmentName.split('&')[0]}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {doctor.name}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">
                      {doctor.title}
                    </p>

                    {/* Clean unboxed metadata */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span>{doctor.experienceYears} yrs exp</span>
                      <span aria-hidden="true">·</span>
                      <span>{doctor.languages[0]}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-slate-900">${doctor.consultationFee}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 space-y-2">
                  <button
                    onClick={() => onOpenBooking(doctor.departmentId, doctor.id)}
                    className="w-full py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg cursor-pointer transition-colors shadow-xs"
                    aria-label={`Book appointment with ${doctor.name}`}
                  >
                    Book Appointment
                  </button>
                  <button
                    onClick={() => onSelectDoctor(doctor)}
                    className="w-full py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                    aria-label={`View profile of ${doctor.name}`}
                  >
                    View Doctor Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Infrastructure Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch bg-slate-900 rounded-2xl overflow-hidden text-white shadow-xl">
          <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-xs font-semibold text-teal-400 uppercase tracking-widest">
                Pioneering Healthcare Technology
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                Robotic Precision & Advanced Diagnostics
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                WeCare Hospitals houses 14 advanced hybrid operating suites equipped with da Vinci robotic surgical systems, Mako robotic joint navigation, and real-time 3T intraoperative MRI.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                <span>Sub-millimeter surgical accuracy minimizing patient recovery time</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                <span>Door-to-intervention emergency protocols under 45 minutes</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                <span>Zero-radiation ultrasound and ultra-low-dose pediatric imaging</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('about')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              >
                <span>Read About Our Campus & Infrastructure</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="relative min-h-[320px] lg:min-h-full">
            <img
              src={HOSPITAL_FACILITY_IMAGE}
              alt="WeCare Hospitals Robotic Operating Theatre"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Patient Stories / Proof */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">
            Patient Stories & Outcomes
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Real Care, Life-Changing Results
          </h2>
          <p className="text-sm text-slate-600">
            Over 99.4% of our patients rate their treatment and bedside care as exceptional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PATIENT_TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-teal-600">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-teal-600" />
                  ))}
                </div>
                <blockquote className="text-sm text-slate-700 leading-relaxed italic">
                  "{t.quote}"
                </blockquote>
              </div>

              <div className="pt-4 border-t border-slate-100 text-xs">
                <strong className="block text-slate-900 font-semibold">{t.patientName}</strong>
                <span className="text-slate-500 block">{t.location}</span>
                <span className="text-teal-700 font-medium block mt-1">{t.verifiedTreatment}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Accreditations Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 sm:p-8">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6 text-center">
            Global Accreditations & Quality Benchmarks
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ACCREDITATIONS.map((acc, i) => (
              <div key={i} className="space-y-1 text-center sm:text-left">
                <div className="text-xs font-bold text-teal-700">{acc.code}</div>
                <div className="text-sm font-bold text-slate-900">{acc.name}</div>
                <p className="text-xs text-slate-500">{acc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
