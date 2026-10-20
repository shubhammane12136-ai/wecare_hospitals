import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateAppointmentForm,
  generateBookingReference,
  filterDoctors,
  getAvailableSlots,
  canCancelAppointment,
  validateAuthForm,
  filterUserAppointments
} from './bookingLogic.ts';
import type { Doctor } from '../types/index.ts';

const mockDoctor1: Doctor = {
  id: 'doc-1',
  name: 'Dr. Sarah Lin',
  departmentId: 'dept-cardiology',
  departmentName: 'Cardiology & Vascular Institute',
  title: 'Senior Interventional Cardiologist',
  degrees: 'MD, FACC',
  experienceYears: 18,
  rating: 4.96,
  reviewCount: 312,
  languages: ['English', 'Mandarin'],
  availability: {
    days: ['Monday', 'Wednesday'],
    nextSlot: 'Today at 02:30 PM',
    availableToday: true,
    slots: ['09:00 AM', '10:30 AM', '02:30 PM']
  },
  image: '',
  fallbackInitials: 'SL',
  bio: 'Expert in angioplasty and heart catheterization.',
  specialties: ['Interventional Cardiology', 'Coronary Angioplasty'],
  consultationFee: 160,
  office: 'Suite 302'
};

const mockDoctor2: Doctor = {
  id: 'doc-2',
  name: 'Dr. Alexander Wright',
  departmentId: 'dept-neurology',
  departmentName: 'Neurology & Neurosurgery',
  title: 'Chief Neurologist',
  degrees: 'MD, PhD',
  experienceYears: 20,
  rating: 4.98,
  reviewCount: 420,
  languages: ['English', 'German'],
  availability: {
    days: ['Tuesday', 'Thursday'],
    nextSlot: 'Tomorrow at 11:30 AM',
    availableToday: false,
    slots: ['10:00 AM', '02:00 PM']
  },
  image: '',
  fallbackInitials: 'AW',
  bio: 'Expert in stroke prevention and brain health.',
  specialties: ['Acute Stroke Care', 'Neurovascular Disease'],
  consultationFee: 175,
  office: 'Suite 402'
};

test('validateAppointmentForm catches empty required fields', () => {
  const result = validateAppointmentForm({});
  assert.equal(result.isValid, false);
  assert.ok(result.errors.departmentId);
  assert.ok(result.errors.doctorId);
  assert.ok(result.errors.date);
  assert.ok(result.errors.patientName);
  assert.ok(result.errors.patientEmail);
  assert.ok(result.errors.patientPhone);
});

test('validateAppointmentForm validates good data with future date', () => {
  const future = new Date();
  future.setDate(future.getDate() + 3);
  const futureDateStr = future.toISOString().split('T')[0];

  const result = validateAppointmentForm({
    departmentId: 'dept-cardiology',
    doctorId: 'doc-1',
    visitType: 'in-person',
    date: futureDateStr,
    timeSlot: '09:00 AM',
    patientName: 'Jane Doe',
    patientEmail: 'jane.doe@example.com',
    patientPhone: '+1-555-0199',
    patientAge: '34',
    patientGender: 'female',
    symptoms: 'Routine heart checkup',
    insuranceProvider: 'BlueCross'
  });

  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, {});
});

test('validateAppointmentForm flags invalid email and short phone', () => {
  const result = validateAppointmentForm({
    departmentId: 'dept-cardiology',
    doctorId: 'doc-1',
    date: '2027-01-15',
    timeSlot: '09:00 AM',
    patientName: 'John',
    patientEmail: 'not-an-email',
    patientPhone: '123',
    patientAge: '40'
  });

  assert.equal(result.isValid, false);
  assert.ok(result.errors.patientEmail);
  assert.ok(result.errors.patientPhone);
});

test('generateBookingReference produces expected prefix and seed', () => {
  const code = generateBookingReference('WCH', '2026-10-20', 8842);
  assert.equal(code, 'WCH-2026-8842');
});

test('filterDoctors filters by department and query', () => {
  const docs = [mockDoctor1, mockDoctor2];

  const cardioOnly = filterDoctors(docs, { departmentId: 'dept-cardiology' });
  assert.equal(cardioOnly.length, 1);
  assert.equal(cardioOnly[0].id, 'doc-1');

  const strokeSearch = filterDoctors(docs, { search: 'stroke' });
  assert.equal(strokeSearch.length, 1);
  assert.equal(strokeSearch[0].id, 'doc-2');

  const todayOnly = filterDoctors(docs, { availableTodayOnly: true });
  assert.equal(todayOnly.length, 1);
  assert.equal(todayOnly[0].id, 'doc-1');
});

test('getAvailableSlots excludes booked slots', () => {
  const available = getAvailableSlots(mockDoctor1, '2026-10-25', ['10:30 AM']);
  assert.deepEqual(available, ['09:00 AM', '02:30 PM']);
});

test('canCancelAppointment correctly identifies future vs past dates', () => {
  const future = new Date();
  future.setDate(future.getDate() + 5);
  const futureStr = future.toISOString().split('T')[0];

  assert.equal(canCancelAppointment(futureStr), true);
  assert.equal(canCancelAppointment('2020-01-01'), false);
});

test('validateAuthForm validates signin and signup requirements', () => {
  // Signin invalid
  const badSignIn = validateAuthForm('signin', { email: 'invalid', password: '123' });
  assert.equal(badSignIn.isValid, false);
  assert.ok(badSignIn.errors.email);
  assert.ok(badSignIn.errors.password);

  // Signin valid
  const goodSignIn = validateAuthForm('signin', { email: 'patient@example.com', password: 'secretpassword' });
  assert.equal(goodSignIn.isValid, true);

  // Signup valid
  const goodSignUp = validateAuthForm('signup', {
    email: 'newpatient@example.com',
    password: 'secretpassword',
    displayName: 'Jane Doe',
    phone: '+1-555-0199',
    age: '28'
  });
  assert.equal(goodSignUp.isValid, true);
});

test('filterUserAppointments returns only appointments belonging to the user', () => {
  const apts = [
    {
      id: 'apt-1',
      bookingReference: 'WCH-1',
      userId: 'usr-100',
      patientEmail: 'alex@example.com',
      patientName: 'Alex',
      doctorId: 'doc-1',
      doctorName: 'Dr. Sarah Lin',
      doctorTitle: 'Chair',
      departmentId: 'dept-1',
      departmentName: 'Cardio',
      patientPhone: '12345678',
      patientAge: 40,
      patientGender: 'male' as const,
      visitType: 'in-person' as const,
      date: '2026-10-25',
      timeSlot: '10:00 AM',
      symptoms: 'Checkup',
      insuranceProvider: 'None',
      status: 'confirmed' as const,
      createdAt: '2026-10-19T00:00:00Z',
      office: 'Suite 302'
    },
    {
      id: 'apt-2',
      bookingReference: 'WCH-2',
      userId: 'usr-200',
      patientEmail: 'other@example.com',
      patientName: 'Other',
      doctorId: 'doc-1',
      doctorName: 'Dr. Sarah Lin',
      doctorTitle: 'Chair',
      departmentId: 'dept-1',
      departmentName: 'Cardio',
      patientPhone: '12345678',
      patientAge: 30,
      patientGender: 'female' as const,
      visitType: 'in-person' as const,
      date: '2026-10-26',
      timeSlot: '11:00 AM',
      symptoms: 'Checkup',
      insuranceProvider: 'None',
      status: 'confirmed' as const,
      createdAt: '2026-10-19T00:00:00Z',
      office: 'Suite 302'
    }
  ];

  const user = {
    uid: 'usr-100',
    displayName: 'Alex',
    email: 'alex@example.com',
    phone: '12345678',
    age: 40,
    gender: 'male' as const,
    createdAt: '2026-10-19T00:00:00Z'
  };

  const filtered = filterUserAppointments(apts, user);
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, 'apt-1');
});

