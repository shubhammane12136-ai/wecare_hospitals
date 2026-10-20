import React, { useState, useEffect } from 'react';
import { Department, Doctor, Appointment, VisitType, AppointmentFormData } from '../types';
import { DEPARTMENTS, DOCTORS } from '../data/hospitalData';
import { validateAppointmentForm, generateBookingReference, getAvailableSlots } from '../utils/bookingLogic';
import { saveAppointment } from '../services/appointmentService';
import { X, Calendar, Clock, CheckCircle2, User, Phone, Mail, FileText, Download, Printer } from 'lucide-react';

import { UserProfile } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDepartmentId?: string;
  initialDoctorId?: string;
  onAppointmentBooked: (appointment: Appointment) => void;
  onNavigateToAppointments: () => void;
  user: UserProfile | null;
  onRequireAuth: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialDepartmentId,
  initialDoctorId,
  onAppointmentBooked,
  onNavigateToAppointments,
  user,
  onRequireAuth,
}) => {
  // Today's date in YYYY-MM-DD
  const getTodayStr = () => new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<AppointmentFormData>({
    departmentId: initialDepartmentId || DEPARTMENTS[0].id,
    doctorId: initialDoctorId || '',
    visitType: 'in-person',
    date: getTodayStr(),
    timeSlot: '',
    patientName: user?.displayName || '',
    patientEmail: user?.email || '',
    patientPhone: user?.phone || '',
    patientAge: user?.age ? String(user.age) : '32',
    patientGender: user?.gender || 'female',
    symptoms: '',
    insuranceProvider: 'None / Self-Pay',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Sync user details when user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        patientName: user.displayName || prev.patientName,
        patientEmail: user.email || prev.patientEmail,
        patientPhone: user.phone || prev.patientPhone,
        patientAge: user.age ? String(user.age) : prev.patientAge,
        patientGender: user.gender || prev.patientGender
      }));
    }
  }, [user]);

  // Sync initial props whenever modal opens or props change
  useEffect(() => {
    if (isOpen) {
      const deptId = initialDepartmentId || (initialDoctorId ? DOCTORS.find(d => d.id === initialDoctorId)?.departmentId : DEPARTMENTS[0].id) || DEPARTMENTS[0].id;
      const docId = initialDoctorId || (DOCTORS.filter(d => d.departmentId === deptId)[0]?.id || '');
      const firstDoc = DOCTORS.find(d => d.id === docId);
      const defaultSlot = firstDoc?.availability?.slots?.[0] || '10:00 AM';

      setFormData(prev => ({
        ...prev,
        departmentId: deptId,
        doctorId: docId,
        timeSlot: defaultSlot,
        date: getTodayStr()
      }));
      setConfirmedAppointment(null);
      setErrors({});
    }
  }, [isOpen, initialDepartmentId, initialDoctorId]);

  // When department changes, pick the first doctor in that department
  const handleDepartmentChange = (deptId: string) => {
    const deptDoctors = DOCTORS.filter(d => d.departmentId === deptId);
    const newDoc = deptDoctors[0];
    const newSlot = newDoc?.availability?.slots?.[0] || '10:00 AM';

    setFormData(prev => ({
      ...prev,
      departmentId: deptId,
      doctorId: newDoc ? newDoc.id : '',
      timeSlot: newSlot
    }));
    if (errors.departmentId || errors.doctorId) {
      setErrors(prev => ({ ...prev, departmentId: '', doctorId: '' }));
    }
  };

  const handleDoctorChange = (docId: string) => {
    const doc = DOCTORS.find(d => d.id === docId);
    const newSlot = doc?.availability?.slots?.[0] || '10:00 AM';
    setFormData(prev => ({
      ...prev,
      doctorId: docId,
      timeSlot: newSlot
    }));
    if (errors.doctorId) {
      setErrors(prev => ({ ...prev, doctorId: '' }));
    }
  };

  // Doctors in current department
  const filteredDoctors = DOCTORS.filter(d => d.departmentId === formData.departmentId);
  const selectedDoctor = DOCTORS.find(d => d.id === formData.doctorId) || filteredDoctors[0];
  const selectedDepartment = DEPARTMENTS.find(d => d.id === formData.departmentId) || DEPARTMENTS[0];

  // Available slots for selected doctor
  const availableSlots = selectedDoctor ? getAvailableSlots(selectedDoctor, formData.date) : [];

  const handleInputChange = (field: keyof AppointmentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onRequireAuth();
      return;
    }

    const validation = validateAppointmentForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const bookingRef = generateBookingReference('WCH', formData.date);
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      bookingReference: bookingRef,
      userId: user.uid,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorTitle: selectedDoctor.title,
      departmentId: selectedDepartment.id,
      departmentName: selectedDepartment.name,
      patientName: formData.patientName.trim(),
      patientEmail: formData.patientEmail.trim(),
      patientPhone: formData.patientPhone.trim(),
      patientAge: Number(formData.patientAge),
      patientGender: formData.patientGender as any,
      visitType: formData.visitType,
      date: formData.date,
      timeSlot: formData.timeSlot,
      symptoms: formData.symptoms.trim() || 'General consultation',
      insuranceProvider: formData.insuranceProvider.trim() || 'None / Self-Pay',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      office: selectedDoctor.office
    };

    await saveAppointment(newAppointment);
    onAppointmentBooked(newAppointment);
    setConfirmedAppointment(newAppointment);
  };

  const downloadIcs = () => {
    if (!confirmedAppointment) return;
    const { bookingReference, doctorName, departmentName, date, timeSlot, office } = confirmedAppointment;
    
    // Parse time slot to generate start/end
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 id="booking-modal-title" className="text-lg font-bold tracking-tight text-white">
                {confirmedAppointment ? 'Consultation Confirmed' : 'Book a Specialist Appointment'}
              </h2>
              <p className="text-xs text-slate-400">
                {confirmedAppointment ? 'Your appointment has been registered in the hospital system' : 'Select department, specialist, and preferred consultation schedule'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
            aria-label="Close appointment modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {confirmedAppointment ? (
            /* Confirmation View */
            <div className="space-y-6">
              <div className="p-5 bg-teal-50/80 border border-teal-200 rounded-xl flex items-start gap-4">
                <CheckCircle2 className="w-7 h-7 text-teal-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-teal-900 uppercase tracking-wider">
                    Official Appointment Confirmation
                  </div>
                  <div className="text-xl font-bold text-slate-900 font-mono tracking-tight">
                    {confirmedAppointment.bookingReference}
                  </div>
                  <p className="text-xs text-slate-600">
                    A confirmation SMS and email have been dispatched with pre-consultation guidelines.
                  </p>
                </div>
              </div>

              {/* Consultation Details Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-slate-50 border border-slate-200 rounded-xl text-sm">
                <div>
                  <span className="text-xs text-slate-500 block mb-0.5">Specialist Doctor</span>
                  <strong className="text-slate-900 block font-semibold">{confirmedAppointment.doctorName}</strong>
                  <span className="text-xs text-slate-600">{confirmedAppointment.doctorTitle}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-0.5">Department</span>
                  <strong className="text-slate-900 block font-semibold">{confirmedAppointment.departmentName}</strong>
                  <span className="text-xs text-slate-600">{confirmedAppointment.office}</span>
                </div>
                <div className="border-t border-slate-200 pt-3">
                  <span className="text-xs text-slate-500 block mb-0.5">Date & Time Slot</span>
                  <strong className="text-slate-900 block font-semibold">
                    {confirmedAppointment.date} at {confirmedAppointment.timeSlot}
                  </strong>
                  <span className="text-xs text-teal-700 font-medium capitalize">
                    {confirmedAppointment.visitType} Visit
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-3">
                  <span className="text-xs text-slate-500 block mb-0.5">Patient Details</span>
                  <strong className="text-slate-900 block font-semibold">{confirmedAppointment.patientName}</strong>
                  <span className="text-xs text-slate-600">
                    {confirmedAppointment.patientPhone} · Age {confirmedAppointment.patientAge}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <button
                    onClick={downloadIcs}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Add to Calendar (.ics)</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Receipt</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToAppointments();
                    }}
                    className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg cursor-pointer transition-colors shadow-xs"
                  >
                    View in My Appointments
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Department & Doctor */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>1. Clinical Department & Specialist Doctor</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dept-select" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Medical Department *
                    </label>
                    <select
                      id="dept-select"
                      value={formData.departmentId}
                      onChange={(e) => handleDepartmentChange(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      {DEPARTMENTS.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                    {errors.departmentId && <p className="text-xs text-rose-600 mt-1">{errors.departmentId}</p>}
                  </div>

                  <div>
                    <label htmlFor="doctor-select" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Consulting Specialist *
                    </label>
                    <select
                      id="doctor-select"
                      value={formData.doctorId}
                      onChange={(e) => handleDoctorChange(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      {filteredDoctors.map(doc => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name} — {doc.title} (${doc.consultationFee})
                        </option>
                      ))}
                    </select>
                    {errors.doctorId && <p className="text-xs text-rose-600 mt-1">{errors.doctorId}</p>}
                  </div>
                </div>

                {/* Selected Doctor Summary Pill-Free Box */}
                {selectedDoctor && (
                  <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{selectedDoctor.name}</span>
                      <span aria-hidden="true">·</span>
                      <span>{selectedDoctor.degrees}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-teal-700 font-medium">★ {selectedDoctor.rating} ({selectedDoctor.reviewCount} reviews)</span>
                    </div>
                    <div className="font-mono font-medium text-slate-900">
                      Fee: ${selectedDoctor.consultationFee}
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Date, Visit Type & Time Slot */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  2. Schedule & Consultation Mode
                </h3>

                {/* Visit Type Segmented Control */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg mb-4">
                  {(['in-person', 'telehealth', 'follow-up'] as VisitType[]).map((type) => {
                    const label = type === 'in-person' ? 'In-Person Hospital Visit' : type === 'telehealth' ? 'Virtual Video Consult' : 'Routine Follow-up';
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleInputChange('visitType', type)}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                          formData.visitType === type
                            ? 'bg-white text-slate-900 shadow-xs font-semibold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="apt-date" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Appointment Date *
                    </label>
                    <input
                      type="date"
                      id="apt-date"
                      min={getTodayStr()}
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                    {errors.date && <p className="text-xs text-rose-600 mt-1">{errors.date}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Available Slot *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {availableSlots.map(slot => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => handleInputChange('timeSlot', slot)}
                          className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            formData.timeSlot === slot
                              ? 'bg-teal-50 border-teal-600 text-teal-800 font-semibold ring-1 ring-teal-600'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span className="font-mono tabular-nums">{slot}</span>
                        </button>
                      ))}
                    </div>
                    {errors.timeSlot && <p className="text-xs text-rose-600 mt-1">{errors.timeSlot}</p>}
                  </div>
                </div>
              </div>

              {/* Step 3: Patient Information */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    3. Patient Contact & Medical Info
                  </h3>
                  {user ? (
                    <span className="text-[11px] font-semibold text-teal-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                      <span>Verified: {user.displayName}</span>
                    </span>
                  ) : null}
                </div>

                {!user && (
                  <div className="p-3 mb-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-amber-900">
                    <div>
                      <strong className="block font-semibold">Patient Account Required</strong>
                      <span className="text-amber-800">Please sign in or create an account before reserving so your consultation and history are saved to your profile.</span>
                    </div>
                    <button
                      type="button"
                      onClick={onRequireAuth}
                      className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg shrink-0 transition-colors cursor-pointer text-xs"
                    >
                      Sign In / Register Now
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  <div className="sm:col-span-2">
                    <label htmlFor="patient-name" className="block text-xs font-semibold text-slate-700 mb-1">
                      Patient Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        id="patient-name"
                        placeholder="e.g. Eleanor Vance"
                        value={formData.patientName}
                        onChange={(e) => handleInputChange('patientName', e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    {errors.patientName && <p className="text-xs text-rose-600 mt-1">{errors.patientName}</p>}
                  </div>

                  <div>
                    <label htmlFor="patient-age" className="block text-xs font-semibold text-slate-700 mb-1">
                      Age *
                    </label>
                    <input
                      type="number"
                      id="patient-age"
                      min="0"
                      max="125"
                      value={formData.patientAge}
                      onChange={(e) => handleInputChange('patientAge', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-mono tabular-nums"
                    />
                    {errors.patientAge && <p className="text-xs text-rose-600 mt-1">{errors.patientAge}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label htmlFor="patient-email" className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="email"
                        id="patient-email"
                        placeholder="patient@example.com"
                        value={formData.patientEmail}
                        onChange={(e) => handleInputChange('patientEmail', e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    {errors.patientEmail && <p className="text-xs text-rose-600 mt-1">{errors.patientEmail}</p>}
                  </div>

                  <div>
                    <label htmlFor="patient-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="tel"
                        id="patient-phone"
                        placeholder="+1 (555) 019-2834"
                        value={formData.patientPhone}
                        onChange={(e) => handleInputChange('patientPhone', e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    {errors.patientPhone && <p className="text-xs text-rose-600 mt-1">{errors.patientPhone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="insurance-provider" className="block text-xs font-semibold text-slate-700 mb-1">
                      Health Insurance Carrier
                    </label>
                    <input
                      type="text"
                      id="insurance-provider"
                      placeholder="e.g. BlueCross, Aetna, Cigna, or Self-Pay"
                      value={formData.insuranceProvider}
                      onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="patient-symptoms" className="block text-xs font-semibold text-slate-700 mb-1">
                      Primary Symptoms / Clinical Reason
                    </label>
                    <div className="relative">
                      <FileText className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        id="patient-symptoms"
                        placeholder="e.g. Chest tightness, joint stiffness, consultation"
                        value={formData.symptoms}
                        onChange={(e) => handleInputChange('symptoms', e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg cursor-pointer transition-colors shadow-xs hover:shadow-sm"
                >
                  {user ? 'Confirm & Reserve Appointment' : 'Sign In & Reserve Appointment'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
