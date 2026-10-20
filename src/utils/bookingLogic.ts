import type { AppointmentFormData, Doctor } from '../types/index.ts';

export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateAppointmentForm(data: Partial<AppointmentFormData>): FormValidationResult {
  const errors: Record<string, string> = {};

  if (!data.departmentId || data.departmentId.trim() === '') {
    errors.departmentId = 'Please select a medical department';
  }

  if (!data.doctorId || data.doctorId.trim() === '') {
    errors.doctorId = 'Please select a consulting doctor';
  }

  if (!data.date || data.date.trim() === '') {
    errors.date = 'Please select an appointment date';
  } else {
    // Check that date is formatted YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data.date)) {
      errors.date = 'Invalid date format';
    } else {
      const selected = new Date(`${data.date}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (isNaN(selected.getTime())) {
        errors.date = 'Invalid date';
      } else if (selected < today) {
        errors.date = 'Appointment date cannot be in the past';
      }
    }
  }

  if (!data.timeSlot || data.timeSlot.trim() === '') {
    errors.timeSlot = 'Please select an available consultation slot';
  }

  if (!data.patientName || data.patientName.trim().length < 2) {
    errors.patientName = 'Patient full name must be at least 2 characters';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.patientEmail || !emailRegex.test(data.patientEmail.trim())) {
    errors.patientEmail = 'Please provide a valid email address';
  }

  const cleanPhone = (data.patientPhone || '').replace(/\D/g, '');
  if (!data.patientPhone || cleanPhone.length < 8) {
    errors.patientPhone = 'Please provide a valid contact number (at least 8 digits)';
  }

  if (data.patientAge !== undefined && data.patientAge !== '') {
    const ageNum = Number(data.patientAge);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 125) {
      errors.patientAge = 'Please enter a valid age (0–125)';
    }
  } else {
    errors.patientAge = 'Please enter patient age';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function generateBookingReference(prefix = 'WCH', dateStr = '2026', seed = Math.floor(Math.random() * 9000) + 1000): string {
  const cleanYear = dateStr.includes('-') ? dateStr.split('-')[0] : dateStr;
  return `${prefix}-${cleanYear}-${seed}`;
}

export function filterDoctors(
  doctors: Doctor[],
  filters: { departmentId?: string; search?: string; availableTodayOnly?: boolean }
): Doctor[] {
  return doctors.filter(doctor => {
    if (filters.departmentId && filters.departmentId !== 'all') {
      if (doctor.departmentId !== filters.departmentId) {
        return false;
      }
    }

    if (filters.availableTodayOnly) {
      if (!doctor.availability.availableToday) {
        return false;
      }
    }

    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase().trim();
      const matchName = doctor.name.toLowerCase().includes(q);
      const matchTitle = doctor.title.toLowerCase().includes(q);
      const matchDept = doctor.departmentName.toLowerCase().includes(q);
      const matchSpecialty = doctor.specialties.some(s => s.toLowerCase().includes(q));
      const matchBio = doctor.bio.toLowerCase().includes(q);

      if (!matchName && !matchTitle && !matchDept && !matchSpecialty && !matchBio) {
        return false;
      }
    }

    return true;
  });
}

export function getAvailableSlots(
  doctor: Doctor,
  _dateStr: string,
  bookedSlots: string[] = []
): string[] {
  const baseSlots = doctor.availability.slots && doctor.availability.slots.length > 0
    ? doctor.availability.slots
    : ['09:00 AM', '10:30 AM', '02:00 PM', '03:30 PM'];

  return baseSlots.filter(slot => !bookedSlots.includes(slot));
}

export function canCancelAppointment(appointmentDate: string, appointmentTimeSlot?: string, now = new Date()): boolean {
  try {
    const aptDate = new Date(`${appointmentDate}T23:59:59`);
    return aptDate.getTime() >= now.getTime();
  } catch {
    return false;
  }
}

export function validateAuthForm(
  mode: 'signin' | 'signup',
  fields: { email?: string; password?: string; displayName?: string; phone?: string; age?: string }
): FormValidationResult {
  const errors: Record<string, string> = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!fields.email || !emailRegex.test(fields.email.trim())) {
    errors.email = 'Please provide a valid email address';
  }

  if (!fields.password || fields.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (mode === 'signup') {
    if (!fields.displayName || fields.displayName.trim().length < 2) {
      errors.displayName = 'Full name must be at least 2 characters';
    }

    const cleanPhone = (fields.phone || '').replace(/\D/g, '');
    if (!fields.phone || cleanPhone.length < 8) {
      errors.phone = 'Please enter a valid phone number (at least 8 digits)';
    }

    if (fields.age !== undefined && fields.age !== '') {
      const ageNum = Number(fields.age);
      if (isNaN(ageNum) || ageNum < 0 || ageNum > 125) {
        errors.age = 'Please enter a valid age (0–125)';
      }
    } else {
      errors.age = 'Please enter age';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function filterUserAppointments(
  appointments: import('../types/index.ts').Appointment[],
  user: import('../types/index.ts').UserProfile | null
): import('../types/index.ts').Appointment[] {
  if (!user) {
    return appointments;
  }
  const userEmail = user.email.toLowerCase();
  return appointments.filter(apt => {
    if (apt.userId && apt.userId === user.uid) return true;
    if (apt.patientEmail && apt.patientEmail.toLowerCase() === userEmail) return true;
    return false;
  });
}

