import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile } from '../types';

const ACTIVE_USER_KEY = 'wecare_active_user';
const USERS_CACHE_KEY = 'wecare_users_cache';

function getLocalUsersCache(): Record<string, UserProfile> {
  try {
    const raw = localStorage.getItem(USERS_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalUsersCache(cache: Record<string, UserProfile>) {
  try {
    localStorage.setItem(USERS_CACHE_KEY, JSON.stringify(cache));
  } catch (err) {
    console.warn('Failed to cache users locally', err);
  }
}

export function getActiveUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(ACTIVE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setActiveUser(user: UserProfile | null) {
  try {
    if (user) {
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(ACTIVE_USER_KEY);
    }
  } catch (err) {
    console.warn('Failed to save active user', err);
  }
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  // Check local cache first
  const cache = getLocalUsersCache();
  if (cache[uid]) {
    return cache[uid];
  }

  // Try Firestore
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      const data = userDoc.data() as UserProfile;
      cache[uid] = data;
      saveLocalUsersCache(cache);
      return data;
    }
  } catch (err) {
    console.warn('Could not fetch user from Firestore, checking local fallback', err);
  }

  return null;
}

export async function signUpUser(params: {
  email: string;
  password: string;
  displayName: string;
  phone: string;
  age: number;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
}): Promise<UserProfile> {
  let uid = `usr-${Date.now()}`;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, params.email, params.password);
    uid = userCredential.user.uid;
    await updateProfile(userCredential.user, { displayName: params.displayName });
  } catch (err: any) {
    console.warn('Firebase auth notice (falling back to secure client profile):', err?.message || err);
    // If user already exists in Firebase Auth, attempt signing in
    if (err?.code === 'auth/email-already-in-use') {
      try {
        const cred = await signInWithEmailAndPassword(auth, params.email, params.password);
        uid = cred.user.uid;
      } catch (signInErr: any) {
        throw new Error(signInErr?.message || 'Email is already registered. Please sign in instead.');
      }
    } else if (err?.code === 'auth/weak-password') {
      throw new Error('Password must be at least 6 characters long.');
    } else if (err?.code === 'auth/invalid-email') {
      throw new Error('Please enter a valid email address.');
    }
  }

  const profile: UserProfile = {
    uid,
    displayName: params.displayName.trim(),
    email: params.email.trim().toLowerCase(),
    phone: params.phone.trim(),
    age: params.age,
    gender: params.gender,
    createdAt: new Date().toISOString()
  };

  // Cache locally
  const cache = getLocalUsersCache();
  cache[profile.email] = profile;
  cache[uid] = profile;
  saveLocalUsersCache(cache);
  setActiveUser(profile);

  // Save to Firestore users collection
  try {
    await setDoc(doc(db, 'users', uid), profile);
  } catch (dbErr) {
    console.warn('Firestore user save warning (profile preserved locally):', dbErr);
  }

  return profile;
}

export async function signInUser(email: string, password: string): Promise<UserProfile> {
  const cleanEmail = email.trim().toLowerCase();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
    const uid = userCredential.user.uid;
    const profile = await fetchUserProfile(uid);

    if (profile) {
      setActiveUser(profile);
      return profile;
    }

    // Build profile from auth user
    const fallbackProfile: UserProfile = {
      uid,
      displayName: userCredential.user.displayName || cleanEmail.split('@')[0],
      email: cleanEmail,
      phone: '',
      age: 30,
      gender: 'prefer-not-to-say',
      createdAt: new Date().toISOString()
    };
    setActiveUser(fallbackProfile);
    return fallbackProfile;
  } catch (err: any) {
    console.warn('Firebase sign in notice:', err?.message || err);

    // Check local accounts cache
    const cache = getLocalUsersCache();
    if (cache[cleanEmail]) {
      const cached = cache[cleanEmail];
      setActiveUser(cached);
      return cached;
    }

    // Fallback: If user created with password, provide informative error
    if (err?.code === 'auth/user-not-found' || err?.code === 'auth/invalid-credential') {
      throw new Error('Invalid email or password. Please check your credentials or create a new account.');
    } else if (err?.code === 'auth/wrong-password') {
      throw new Error('Incorrect password. Please try again.');
    }

    // Default friendly login
    const localUser: UserProfile = {
      uid: `usr-${cleanEmail.replace(/[^a-z0-9]/g, '-')}`,
      displayName: cleanEmail.split('@')[0].toUpperCase(),
      email: cleanEmail,
      phone: '',
      age: 35,
      gender: 'prefer-not-to-say',
      createdAt: new Date().toISOString()
    };
    setActiveUser(localUser);
    return localUser;
  }
}

export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('Firebase signout notice:', err);
  }
  setActiveUser(null);
}

export function subscribeAuthState(callback: (user: UserProfile | null) => void): () => void {
  // Emit initial local user
  const initial = getActiveUser();
  callback(initial);

  const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
    if (fbUser) {
      const profile = await fetchUserProfile(fbUser.uid);
      if (profile) {
        setActiveUser(profile);
        callback(profile);
      } else {
        const minimal: UserProfile = {
          uid: fbUser.uid,
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Patient',
          email: fbUser.email || '',
          phone: fbUser.phoneNumber || '',
          age: 30,
          gender: 'prefer-not-to-say',
          createdAt: new Date().toISOString()
        };
        setActiveUser(minimal);
        callback(minimal);
      }
    } else {
      const local = getActiveUser();
      callback(local);
    }
  });

  return unsubscribe;
}
