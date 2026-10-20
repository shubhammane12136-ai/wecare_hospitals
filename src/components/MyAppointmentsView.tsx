import React, { useState } from 'react';
import { Appointment, UserProfile } from '../types';
import { canCancelAppointment, filterUserAppointments } from '../utils/bookingLogic';
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Trash2,
  Phone,
  ArrowRight,
  ShieldCheck,
  LogIn
} from 'lucide-react';

interface MyAppointmentsViewProps {
  appointments: Appointment[];
  onCancelAppointment: (id: string) => void;
  onOpenBooking: () => void;
  user: UserProfile | null;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
}

export const MyAppointmentsView: React.FC<MyAppointmentsViewProps> = ({
  appointments,
  onCancelAppointment,
  onOpenBooking,
  user,
  onOpenAuth,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cancelModalId, setCancelModalId] = useState<string | null>(null);

  // Filter to user's appointments first if logged in
  const userScoped = filterUserAppointments(appointments, user);

  const filteredAppointments = userScoped.filter(apt => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      apt.bookingReference.toLowerCase().includes(q) ||
      apt.doctorName.toLowerCase().includes(q) ||
      apt.departmentName.toLowerCase().includes(q) ||
      apt.patientName.toLowerCase().includes(q)
    );
  });

  const handleConfirmCancel = (id: string) => {
    onCancelAppointment(id);
    setCancelModalId(null);
  };

  const downloadIcs = (apt: Appointment) => {
    const { bookingReference, doctorName, departmentName, date, timeSlot, office } = apt;
    const [time, period] = timeSlot.split(' ');
    const [hoursStr, minutesStr] = time.split(':');
    let hours = parseInt(hoursStr, 10);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    const formattedDate = date.replace(/-/g, '');
    const startHour = String(hours).padStart(2, '0');
    const startMin = String(minutesStr || '00').padStart(2, '0');
    const endHour = String(hours + 1).padStart(2, '0');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//WeCare Hospitals//Appointment Scheduler//EN',
      'BEGIN:VEVENT',
      `UID:${bookingReference}@wecarehospitals.com`,
      `DTSTAMP:${formattedDate}T120000Z`,
      `DTSTART:${formattedDate}T${startHour}${startMin}00`,
      `DTEND:${formattedDate}T${endHour}${startMin}00`,
      `SUMMARY:Medical Appointment with ${doctorName} (${departmentName})`,
      `DESCRIPTION:WeCare Hospitals Appointment Booking ID: ${bookingReference}. Location: ${office}. Please arrive 15 minutes prior.`,
      `LOCATION:WeCare Hospitals, ${office}, 750 Medical Center Pkwy`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `wecare-appointment-${bookingReference}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">
            Patient Portal & Appointments
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
            Manage Your Medical Consultations
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Review confirmed bookings, download calendar entries, or manage your hospital visits.
          </p>
        </div>

        <button
          onClick={onOpenBooking}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg cursor-pointer transition-colors shadow-xs"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book New Consultation</span>
        </button>
      </div>

      {/* Patient Account Status Banner */}
      {user ? (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between text-xs text-teal-900">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              Signed in as <strong>{user.displayName}</strong> ({user.email}). All consultation records are synced with WeCare Firebase Cloud Registry.
            </span>
          </div>
          <span className="font-mono text-teal-700 font-semibold">{filteredAppointments.length} Bookings</span>
        </div>
      ) : (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              You are currently browsing appointments. Sign in or create an account to link consultations directly to your permanent medical record in Firebase.
            </span>
          </div>
          <button
            onClick={() => onOpenAuth('signin')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg shrink-0 cursor-pointer transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In to Account</span>
          </button>
        </div>
      )}

      {/* Search Input for reference or doctor */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Look up by booking code (e.g. WCH-2026-...) or doctor name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
        />
      </div>

      {/* Appointments List */}
      {filteredAppointments.length > 0 ? (
        <div className="space-y-4">
          {filteredAppointments.map((apt) => {
            const isCancelled = apt.status === 'cancelled';
            const canCancel = !isCancelled && canCancelAppointment(apt.date, apt.timeSlot);

            return (
              <div
                key={apt.id}
                className={`bg-white rounded-xl border p-6 transition-all ${
                  isCancelled
                    ? 'border-slate-200 opacity-60 bg-slate-50/50'
                    : 'border-slate-200 hover:border-teal-400 shadow-xs'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  {/* Left Column: Doctor & Department Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-md">
                        {apt.bookingReference}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        isCancelled
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}>
                        {isCancelled ? 'Cancelled' : 'Confirmed'}
                      </span>
                      <span className="text-xs text-slate-500 capitalize">
                        {apt.visitType} Visit
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {apt.doctorName}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium">
                        {apt.doctorTitle} · {apt.departmentName}
                      </p>
                    </div>

                    {/* Patient & Clinic Location */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{apt.office}</span>
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>Patient: <strong>{apt.patientName}</strong> (Age {apt.patientAge})</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>Reason: {apt.symptoms}</span>
                    </div>
                  </div>

                  {/* Right Column: Time & Actions */}
                  <div className="flex flex-col md:items-end justify-between gap-4 shrink-0">
                    <div className="text-left md:text-right space-y-1">
                      <div className="text-xs text-slate-500">Scheduled Date & Time</div>
                      <div className="text-base font-bold text-slate-900 font-mono">
                        {apt.date} at {apt.timeSlot}
                      </div>
                      <div className="text-xs text-slate-500">
                        Please arrive 15 mins prior with ID
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-2">
                      {!isCancelled && (
                        <button
                          onClick={() => downloadIcs(apt)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>.ics</span>
                        </button>
                      )}

                      {canCancel && (
                        <button
                          onClick={() => setCancelModalId(apt.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              No Appointments Found
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              You haven't scheduled any consultations yet, or your search query didn't match any registered records.
            </p>
          </div>
          <button
            onClick={onOpenBooking}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg cursor-pointer transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Your First Appointment</span>
          </button>
        </div>
      )}

      {/* Cancellation Confirmation Dialog */}
      {cancelModalId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 border border-slate-200 shadow-xl">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-900">Cancel Appointment?</h3>
            </div>
            <p className="text-xs text-slate-600">
              Are you sure you want to cancel this consultation? The doctor's time slot will be released back to the hospital schedule.
            </p>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setCancelModalId(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                onClick={() => handleConfirmCancel(cancelModalId)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg cursor-pointer transition-colors"
              >
                Yes, Cancel Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
