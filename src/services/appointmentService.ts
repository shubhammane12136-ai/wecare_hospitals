import { collection, doc, setDoc, updateDoc, getDocs, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Appointment } from '../types';

const LOCAL_STORAGE_KEY = 'wecare_appointments';

export function getLocalAppointments(): Appointment[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalAppointments(appointments: Appointment[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appointments));
  } catch (err) {
    console.error('Failed to save to local storage', err);
  }
}

export async function saveAppointment(appointment: Appointment): Promise<void> {
  // Always update local cache first for instant UI response
  const existing = getLocalAppointments();
  const updated = [appointment, ...existing.filter(a => a.id !== appointment.id)];
  saveLocalAppointments(updated);

  // Sync to Firebase Firestore
  try {
    const docRef = doc(db, 'appointments', appointment.id);
    await setDoc(docRef, {
      ...appointment,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Firestore write warning (data safely preserved locally):', err);
  }
}

export async function updateAppointmentStatus(id: string, status: 'confirmed' | 'rescheduled' | 'cancelled'): Promise<void> {
  const existing = getLocalAppointments();
  const updated = existing.map(a => a.id === id ? { ...a, status } : a);
  saveLocalAppointments(updated);

  try {
    const docRef = doc(db, 'appointments', id);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Firestore update warning (data safely preserved locally):', err);
  }
}

export function subscribeAppointments(onUpdate: (appointments: Appointment[]) => void): () => void {
  // First emit local data immediately
  const initialLocal = getLocalAppointments();
  if (initialLocal.length > 0) {
    onUpdate(initialLocal);
  }

  // Subscribe to Firestore collection
  try {
    const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteList: Appointment[] = [];
          snapshot.forEach((docSnap) => {
            remoteList.push(docSnap.data() as Appointment);
          });
          saveLocalAppointments(remoteList);
          onUpdate(remoteList);
        }
      },
      (error) => {
        console.warn('Firestore subscription notice (using local data):', error.message);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Firestore subscription initialization notice:', err);
    return () => {};
  }
}
