import React from 'react';
import { HOSPITAL_HERO_IMAGE, HOSPITAL_FACILITY_IMAGE, ACCREDITATIONS } from '../data/hospitalData';
import {
  ShieldCheck,
  Award,
  Users,
  Building2,
  Clock,
  HeartHandshake,
  CheckCircle2,
  MapPin,
  Calendar
} from 'lucide-react';

interface AboutViewProps {
  onOpenBooking: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onOpenBooking }) => {
  const leadership = [
    {
      name: 'Dr. Arthur Sterling, MD, MBA',
      title: 'President & Chief Executive Officer',
      credentials: 'Harvard Medical School · Wharton Health Care Management',
      bio: 'Leading WeCare Hospitals with a focus on value-based clinical care and rapid patient recovery metrics.'
    },
    {
      name: 'Dr. Maria Henderson, MD, FACS',
      title: 'Chief Medical Officer',
      credentials: 'Johns Hopkins School of Medicine · Fellow, American College of Surgeons',
      bio: 'Oversees 24 clinical departments, clinical governance, and surgical outcome audit standards.'
    },
    {
      name: 'Evelyn Ramos, DNP, RN, NEA-BC',
      title: 'Chief Nursing Officer',
      credentials: 'Columbia University School of Nursing',
      bio: 'Directed WeCare Hospitals to its 4th consecutive ANCC Magnet designation for nursing excellence.'
    },
    {
      name: 'Dr. Sanjay Patel, MD, PhD',
      title: 'Director of Clinical Research & Innovation',
      credentials: 'Stanford University Medical Center',
      bio: 'Principal investigator on over 40 ongoing cardiovascular and oncology phase II/III clinical trials.'
    }
  ];

  const coreValues = [
    {
      title: 'Clinical Integrity',
      desc: 'Evidence-based protocols, continuous peer audits, and zero compromise on patient safety guidelines.'
    },
    {
      title: 'Compassionate Dignity',
      desc: 'Treating each patient as an individual with dedicated private consultation rooms and family-centered care.'
    },
    {
      title: 'Rapid Emergency Response',
      desc: 'Consistently maintaining sub-45-minute door-to-balloon and rapid stroke protocol response times.'
    },
    {
      title: 'Accessible Excellence',
      desc: 'Partnered with over 40 health insurance carriers to ensure world-class care remains accessible.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">
          About WeCare Hospitals
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
          A Legacy of Healing, A Future of Medical Discovery
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Founded as a regional referral institute, WeCare Hospitals has grown into one of the country’s most respected tertiary healthcare facilities, uniting world-renowned physicians, cutting-edge robotic surgical suites, and deeply compassionate patient care.
        </p>
      </div>

      {/* Campus & Infrastructure Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-8 sm:p-10 space-y-6">
          <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">
            Campus Infrastructure
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Engineered for Patient Comfort & Clinical Precision
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Spanning over 600,000 square feet, our campus features 450 inpatient private suites, 14 hybrid surgical theaters, a Level IV Neonatal Intensive Care Unit (NICU), and an on-site comprehensive molecular genomics laboratory.
          </p>

          <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-700">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>Dedicated Level 1 Emergency Trauma Bay with direct rooftop helipad</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>Full HEPA laminar airflow surgical suites ensuring surgical site infection rates &lt; 0.1%</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>Healing garden terraces and private family consultation alcoves</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg cursor-pointer transition-colors shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule a Campus Consultation</span>
            </button>
          </div>
        </div>

        <div className="h-full min-h-[340px]">
          <img
            src={HOSPITAL_HERO_IMAGE}
            alt="WeCare Hospitals Campus View"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Core Institutional Values */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">
            Our Guiding Philosophy
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Clinical Values That Anchor Every Patient Touchpoint
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((val, i) => (
            <div key={i} className="p-6 bg-white border border-slate-200 rounded-xl space-y-2">
              <div className="text-sm font-bold text-slate-900">{val.title}</div>
              <p className="text-xs text-slate-600 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Leadership Team */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">
            Medical Governance
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Executive & Clinical Leadership
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Guided by veteran physicians and nursing directors committed to medical ethics and community welfare.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {leadership.map((lead, i) => (
            <div key={i} className="p-6 bg-white border border-slate-200 rounded-xl flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm">
                  {lead.name.split(' ')[1]?.[0] || 'D'}
                </div>
                <h3 className="text-sm font-bold text-slate-900">{lead.name}</h3>
                <p className="text-xs font-medium text-teal-800">{lead.title}</p>
                <p className="text-[11px] font-mono text-slate-500">{lead.credentials}</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                {lead.bio}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Visiting Hours & Patient Guidelines */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-xl font-bold text-slate-900">
            Visitor Guidelines & Campus Amenities
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            We provide a calm, healing atmosphere designed to support both patients and their families.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
          <div className="space-y-2">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>General Visiting Hours</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              General Inpatient Floors: 08:00 AM – 08:00 PM daily. ICU & Critical Care: 10:00 AM – 02:00 PM & 05:00 PM – 07:00 PM. Two immediate family visitors permitted per patient bay.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>Parking & Transit Access</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Complimentary patient valet parking at East and West entrance pavilions. Covered multi-story garage with 24/7 security escorts and electric vehicle charging bays.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Patient Rights & Language Access</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Certified medical interpretation available in over 40 languages via bedside video terminals. Patient advocates available 24/7 for care coordination and grievance resolution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
