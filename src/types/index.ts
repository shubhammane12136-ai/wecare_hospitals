export type NavPage = 'home' | 'about' | 'departments' | 'doctors' | 'my-appointments';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  phone: string;
  age: number;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  insuranceProvider?: string;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  iconName: string;
  services: string[];
  keyTechnologies: string[];
  headOfDepartment: string;
  location: string;
  contactExtension: string;
  emergencyCare: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  departmentId: string;
  departmentName: string;
  title: string;
  degrees: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  languages: string[];
  availability: {
    days: string[];
    nextSlot: string;
    availableToday: boolean;
    slots: string[];
  };
  image: string;
  fallbackInitials: string;
  bio: string;
  specialties: string[];
  consultationFee: number;
  office: string;
  awards?: string[];
}

export type VisitType = 'in-person' | 'telehealth' | 'follow-up';

export interface Appointment {
  id: string;
  bookingReference: string;
  userId?: string;
  doctorId: string;
  doctorName: string;
  doctorTitle: string;
  departmentId: string;
  departmentName: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientAge: number;
  patientGender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  visitType: VisitType;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:30 AM"
  symptoms: string;
  insuranceProvider: string;
  status: 'confirmed' | 'rescheduled' | 'cancelled';
  createdAt: string;
  office: string;
}

export interface AppointmentFormData {
  departmentId: string;
  doctorId: string;
  visitType: VisitType;
  date: string;
  timeSlot: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientAge: string;
  patientGender: string;
  symptoms: string;
  insuranceProvider: string;
}
