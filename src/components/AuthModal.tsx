import React, { useState } from 'react';
import { UserProfile } from '../types';
import { signInUser, signUpUser } from '../services/authService';
import { validateAuthForm } from '../utils/bookingLogic';
import { X, Lock, Mail, User, Phone, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  initialMode?: 'signin' | 'signup';
  promptReason?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signin',
  promptReason,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('32');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | 'prefer-not-to-say'>('female');
  const [insuranceProvider, setInsuranceProvider] = useState('');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    const validation = validateAuthForm(mode, {
      email,
      password,
      displayName,
      phone,
      age
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        const user = await signUpUser({
          email,
          password,
          displayName,
          phone,
          age: Number(age),
          gender
        });
        onSuccess(user);
        onClose();
      } else {
        const user = await signInUser(email, password);
        onSuccess(user);
        onClose();
      }
    } catch (err: any) {
      setGeneralError(err?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: 'signin' | 'signup') => {
    setMode(newMode);
    setErrors({});
    setGeneralError(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-start justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 id="auth-modal-title" className="text-lg font-bold tracking-tight text-white">
                {mode === 'signup' ? 'Create Patient Account' : 'Patient Portal Sign In'}
              </h2>
              <p className="text-xs text-slate-300">
                {mode === 'signup'
                  ? 'Register to book & manage your medical appointments'
                  : 'Access your consultation history & test bookings'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reason banner if triggered by booking */}
        {promptReason && (
          <div className="bg-teal-50 border-b border-teal-100 px-6 py-2.5 text-xs text-teal-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{promptReason}</span>
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {generalError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{generalError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label htmlFor="reg-name" className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      id="reg-name"
                      placeholder="e.g. Dr. Arthur Dent / Sarah Connor"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  {errors.displayName && <p className="text-xs text-rose-600 mt-1">{errors.displayName}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="reg-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="tel"
                        id="reg-phone"
                        placeholder="+1 (555) 019-9482"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label htmlFor="reg-age" className="block text-xs font-semibold text-slate-700 mb-1">
                      Age *
                    </label>
                    <input
                      type="number"
                      id="reg-age"
                      min="0"
                      max="125"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono tabular-nums"
                    />
                    {errors.age && <p className="text-xs text-rose-600 mt-1">{errors.age}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-gender" className="block text-xs font-semibold text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    id="reg-gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label htmlFor="auth-email" className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  id="auth-email"
                  placeholder="patient@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="auth-password" className="block text-xs font-semibold text-slate-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  id="auth-password"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg cursor-pointer transition-colors shadow-xs disabled:opacity-50 mt-2"
            >
              {loading ? 'Processing...' : mode === 'signup' ? 'Create Patient Account & Proceed' : 'Sign In to WeCare'}
            </button>
          </form>

          {/* Secure Firebase notice */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Securely stored in WeCare Hospitals Patient Registry (Firebase)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
