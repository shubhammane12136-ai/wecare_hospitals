import React, { useState, useEffect } from 'react';
import { NavPage, Appointment, Doctor, UserProfile } from './types';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { AboutView } from './components/AboutView';
import { DepartmentsView } from './components/DepartmentsView';
import { DoctorsView } from './components/DoctorsView';
import { MyAppointmentsView } from './components/MyAppointmentsView';
import { BookingModal } from './components/BookingModal';
import { DoctorDetailModal } from './components/DoctorDetailModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { AdminPortal } from './components/AdminPortal';

import {
  subscribeAppointments,
  saveAppointment,
  updateAppointmentStatus,
  getLocalAppointments
} from './services/appointmentService';
import {
  subscribeAuthState,
  signOutUser
} from './services/authService';

const SAMPLE_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-sample-1',
    bookingReference: 'WCH-2026-9481',
    doctorId: 'doc-sarah-lin',
    doctorName: 'Dr. Sarah Lin',
    doctorTitle: 'Senior Interventional Cardiologist',
    departmentId: 'dept-cardiology',
    departmentName: 'Cardiology & Vascular Institute',
    patientName: 'David K. Morrison',
    patientEmail: 'david.morrison@example.com',
    patientPhone: '+1 (555) 019-4822',
    patientAge: 48,
    patientGender: 'male',
    visitType: 'in-person',
    date: '2026-10-24',
    timeSlot: '10:30 AM',
    symptoms: 'Post-intervention cardiac checkup and lipid review',
    insuranceProvider: 'BlueCross BlueShield',
    status: 'confirmed',
    createdAt: '2026-10-18T14:20:00Z',
    office: 'Cardiovascular Suite 302, Tower A'
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavPage>('home');
  const [adminPortalOpen, setAdminPortalOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingDeptId, setBookingDeptId] = useState<string | undefined>(undefined);
  const [bookingDocId, setBookingDocId] = useState<string | undefined>(undefined);
  const [hasPendingBookingIntent, setHasPendingBookingIntent] = useState(false);
  const [selectedDoctorForDetail, setSelectedDoctorForDetail] = useState<Doctor | null>(null);

  // Auth Modal State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authReason, setAuthReason] = useState<string | undefined>(undefined);

  // Subscribe to Firebase Authentication
  useEffect(() => {
    const unsubAuth = subscribeAuthState((activeUser) => {
      setUser(activeUser);
    });
    return () => {
      unsubAuth();
    };
  }, []);

  // Subscribe to real-time appointments from Firebase Firestore with local fallback
  useEffect(() => {
    const existing = getLocalAppointments();
    if (existing.length === 0) {
      saveAppointment(SAMPLE_APPOINTMENTS[0]);
    }

    const unsubscribe = subscribeAppointments((list) => {
      setAppointments(list);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin', reason?: string) => {
    setAuthMode(mode);
    setAuthReason(reason);
    setIsAuthOpen(true);
  };

  const handleSignOut = async () => {
    await signOutUser();
    setUser(null);
  };

  const handleOpenBooking = (deptId?: string, docId?: string) => {
    setBookingDeptId(deptId);
    setBookingDocId(docId);
    // If user is not signed in, prompt them to sign in or create an account
    if (!user) {
      setHasPendingBookingIntent(true);
      handleOpenAuth('signin', 'Please sign in or create an account to book your consultation.');
      return;
    }
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setBookingDeptId(undefined);
    setBookingDocId(undefined);
  };

  const handleAppointmentBooked = async (newApt: Appointment) => {
    setAppointments(prev => [newApt, ...prev.filter(a => a.id !== newApt.id)]);
    await saveAppointment(newApt);
  };

  const handleCancelAppointment = async (id: string) => {
    const updated = appointments.map(apt => {
      if (apt.id === id) {
        return { ...apt, status: 'cancelled' as const };
      }
      return apt;
    });
    setAppointments(updated);
    await updateAppointmentStatus(id, 'cancelled');
  };

  const activeAppointmentCount = appointments.filter(a => a.status === 'confirmed').length;

  if (adminPortalOpen) return <AdminPortal appointments={appointments} onSave={handleAppointmentBooked} onStatus={async (id, status) => { setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a)); await updateAppointmentStatus(id, status); }} onClose={() => setAdminPortalOpen(false)} />;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <div className="flex justify-end bg-slate-950 px-4 py-2"><button onClick={() => setAdminPortalOpen(true)} className="rounded-lg border border-white/25 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10">Admin Portal</button></div>
      {/* Top Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        onOpenBooking={() => handleOpenBooking()}
        appointmentCount={activeAppointmentCount}
        user={user}
        onOpenAuth={(mode) => handleOpenAuth(mode)}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomeView
            onNavigate={(page) => setCurrentPage(page)}
            onOpenBooking={handleOpenBooking}
            onSelectDoctor={(doc) => setSelectedDoctorForDetail(doc)}
          />
        )}

        {currentPage === 'about' && (
          <AboutView onOpenBooking={() => handleOpenBooking()} />
        )}

        {currentPage === 'departments' && (
          <DepartmentsView
            onOpenBooking={handleOpenBooking}
            onSelectDoctor={(doc) => setSelectedDoctorForDetail(doc)}
          />
        )}

        {currentPage === 'doctors' && (
          <DoctorsView
            onOpenBooking={handleOpenBooking}
            onSelectDoctor={(doc) => setSelectedDoctorForDetail(doc)}
          />
        )}

        {currentPage === 'my-appointments' && (
          <MyAppointmentsView
            appointments={appointments}
            onCancelAppointment={handleCancelAppointment}
            onOpenBooking={() => handleOpenBooking()}
            user={user}
            onOpenAuth={(mode) => handleOpenAuth(mode)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(page) => setCurrentPage(page)}
        onOpenBooking={handleOpenBooking}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        initialDepartmentId={bookingDeptId}
        initialDoctorId={bookingDocId}
        onAppointmentBooked={handleAppointmentBooked}
        onNavigateToAppointments={() => {
          handleCloseBooking();
          setCurrentPage('my-appointments');
        }}
        user={user}
        onRequireAuth={() => handleOpenAuth('signin', 'Please sign in or create an account to confirm your appointment.')}
      />

      {/* Doctor Detail Modal */}
      <DoctorDetailModal
        doctor={selectedDoctorForDetail}
        onClose={() => setSelectedDoctorForDetail(null)}
        onBook={(doc) => {
          setSelectedDoctorForDetail(null);
          handleOpenBooking(doc.departmentId, doc.id);
        }}
      />

      {/* Auth Modal (Sign In / Sign Up) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => {
          setIsAuthOpen(false);
          setHasPendingBookingIntent(false);
        }}
        initialMode={authMode}
        promptReason={authReason}
        onSuccess={(signedInUser) => {
          setUser(signedInUser);
          setIsAuthOpen(false);
          // If the user was trying to book, automatically open booking modal now
          if (hasPendingBookingIntent || bookingDeptId || bookingDocId) {
            setIsBookingOpen(true);
            setHasPendingBookingIntent(false);
          }
        }}
      />
    </div>
  );
}
