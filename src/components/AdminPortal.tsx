import React, { useMemo, useState } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Appointment, Doctor, VisitType } from '../types';
import { DOCTORS, DEPARTMENTS } from '../data/hospitalData';

const ADMIN_EMAIL = 'shubhammane12136@gmail.com';
type Props = { appointments: Appointment[]; onSave: (apt: Appointment) => Promise<void>; onStatus: (id: string, status: Appointment['status']) => Promise<void>; onClose: () => void };

export function AdminPortal({ appointments, onSave, onStatus, onClose }: Props) {
  const [admin, setAdmin] = useState(false);
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patientName:'', patientEmail:'', patientPhone:'', patientAge:'', patientGender:'prefer-not-to-say', doctorId: DOCTORS[0]?.id || '', date:'', timeSlot:'', visitType:'in-person' as VisitType, symptoms:'', insuranceProvider:'' });

  const filtered = useMemo(() => appointments.filter(a => {
    const haystack = `${a.patientName} ${a.patientEmail} ${a.patientPhone} ${a.doctorName} ${a.bookingReference}`.toLowerCase();
    return haystack.includes(search.toLowerCase()) && (statusFilter === 'all' || a.status === statusFilter);
  }), [appointments, search, statusFilter]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setBusy(true);
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) { setError('This email is not authorized for the admin portal.'); setBusy(false); return; }
    try { const credential = await signInWithEmailAndPassword(auth, email.trim(), password); if (credential.user.email?.toLowerCase() !== ADMIN_EMAIL) { await signOut(auth); throw new Error('This account is not authorized as admin.'); } setAdmin(true); }
    catch (err: any) { setError(err?.message?.replace('Firebase: ', '') || 'Login failed. Check your Firebase admin account and password.'); }
    finally { setBusy(false); }
  };

  const createBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const doctor: Doctor | undefined = DOCTORS.find(d => d.id === form.doctorId);
    if (!doctor) { setError('Please select a doctor.'); return; }
    const department = DEPARTMENTS.find(d => d.id === doctor.departmentId);
    const now = new Date();
    const apt: Appointment = {
      id: `apt-${Date.now()}`, bookingReference: `WCH-${now.getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      doctorId: doctor.id, doctorName: doctor.name, doctorTitle: doctor.title, departmentId: doctor.departmentId,
      departmentName: department?.name || doctor.departmentName, patientName: form.patientName.trim(), patientEmail: form.patientEmail.trim(),
      patientPhone: form.patientPhone.trim(), patientAge: Number(form.patientAge) || 0,
      patientGender: form.patientGender as Appointment['patientGender'], visitType: form.visitType, date: form.date,
      timeSlot: form.timeSlot, symptoms: form.symptoms.trim(), insuranceProvider: form.insuranceProvider.trim(), status: 'confirmed',
      createdAt: now.toISOString(), office: doctor.office
    };
    await onSave(apt); setShowForm(false); setForm({ patientName:'', patientEmail:'', patientPhone:'', patientAge:'', patientGender:'prefer-not-to-say', doctorId: DOCTORS[0]?.id || '', date:'', timeSlot:'', visitType:'in-person', symptoms:'', insuranceProvider:'' });
  };

  const field = (label: string, key: keyof typeof form, type = 'text', required = false) => <label className="block text-sm font-medium text-slate-700">{label}<input required={required} type={type} value={form[key]} onChange={e => setForm(p => ({...p, [key]:e.target.value}))} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-teal-500" /></label>;

  return <div className="min-h-screen bg-slate-100 text-slate-900">
    <header className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 px-5 py-4 text-white md:px-10"><div><p className="text-xs uppercase tracking-[.25em] text-teal-300">WeCare Hospitals</p><h1 className="text-2xl font-bold">Admin Portal</h1></div><button onClick={onClose} className="rounded-xl border border-white/20 px-4 py-2 hover:bg-white/10">← Back to website</button></header>
    {!admin ? <div className="mx-auto flex min-h-[75vh] max-w-md items-center px-5 py-10"><form onSubmit={login} className="w-full rounded-3xl bg-white p-7 shadow-xl"><div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-2xl">🔐</div><h2 className="text-2xl font-bold">Administrator sign in</h2><p className="mt-2 text-sm text-slate-500">Use the authorized Firebase Authentication admin account.</p><label className="mt-6 block text-sm font-medium">Admin email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label><label className="mt-4 block text-sm font-medium">Password<input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label>{error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={busy} className="mt-6 w-full rounded-xl bg-teal-700 p-3 font-semibold text-white hover:bg-teal-800 disabled:opacity-60">{busy?'Signing in…':'Sign in securely'}</button><p className="mt-4 text-xs text-slate-500">The admin email must already exist in Firebase Authentication. Do not store passwords in source code.</p></form></div> : <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-2xl font-bold">Booking management</h2><p className="mt-1 text-sm text-slate-500">View, filter, update, or create patient bookings.</p></div><div className="flex gap-2"><button onClick={()=>setShowForm(v=>!v)} className="rounded-xl bg-teal-700 px-4 py-3 font-semibold text-white">{showForm?'Close form':'+ Add new booking'}</button><button onClick={async()=>{await signOut(auth);setAdmin(false);setPassword('');}} className="rounded-xl border bg-white px-4 py-3">Sign out</button></div></div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[{label:'All bookings',value:appointments.length},{label:'Confirmed',value:appointments.filter(a=>a.status==='confirmed').length},{label:'Rescheduled',value:appointments.filter(a=>a.status==='rescheduled').length},{label:'Cancelled',value:appointments.filter(a=>a.status==='cancelled').length}].map(x=><div key={x.label} className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{x.label}</p><p className="mt-2 text-3xl font-bold">{x.value}</p></div>)}</div>
      {showForm && <form onSubmit={createBooking} className="mb-7 rounded-2xl bg-white p-5 shadow-sm md:p-7"><h3 className="mb-5 text-xl font-bold">Create booking for a patient</h3><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{field('Patient full name','patientName','text',true)}{field('Patient email','patientEmail','email',true)}{field('Phone number','patientPhone','tel',true)}{field('Age','patientAge','number',true)}<label className="block text-sm font-medium">Gender<select value={form.patientGender} onChange={e=>setForm(p=>({...p,patientGender:e.target.value}))} className="mt-1 w-full rounded-xl border p-2.5"><option value="prefer-not-to-say">Prefer not to say</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></label><label className="block text-sm font-medium">Doctor<select required value={form.doctorId} onChange={e=>setForm(p=>({...p,doctorId:e.target.value}))} className="mt-1 w-full rounded-xl border p-2.5">{DOCTORS.map(d=><option key={d.id} value={d.id}>{d.name} — {d.departmentName}</option>)}</select></label>{field('Appointment date','date','date',true)}{field('Time slot (e.g. 10:30 AM)','timeSlot','text',true)}<label className="block text-sm font-medium">Visit type<select value={form.visitType} onChange={e=>setForm(p=>({...p,visitType:e.target.value as VisitType}))} className="mt-1 w-full rounded-xl border p-2.5"><option value="in-person">In person</option><option value="telehealth">Telehealth</option><option value="follow-up">Follow-up</option></select></label>{field('Insurance provider','insuranceProvider') }<label className="block text-sm font-medium sm:col-span-2 lg:col-span-3">Symptoms / notes<textarea value={form.symptoms} onChange={e=>setForm(p=>({...p,symptoms:e.target.value}))} rows={2} className="mt-1 w-full rounded-xl border p-3" /></label></div><button className="mt-5 rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white">Save booking</button></form>}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm"><div className="flex flex-col gap-3 border-b p-4 md:flex-row"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search patient, email, doctor, reference…" className="min-w-0 flex-1 rounded-xl border p-3"/><select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="rounded-xl border p-3"><option value="all">All statuses</option><option value="confirmed">Confirmed</option><option value="rescheduled">Rescheduled</option><option value="cancelled">Cancelled</option></select></div>
      {filtered.length===0 ? <div className="p-12 text-center text-slate-500">No bookings match your search.</div> : <div className="overflow-x-auto"><table className="w-full min-w-[1000px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{['Reference / Date','Patient','Doctor / Department','Visit','Status','Manage'].map(h=><th key={h} className="px-4 py-4 font-semibold">{h}</th>)}</tr></thead><tbody className="divide-y">{filtered.map(a=><tr key={a.id} className="align-top hover:bg-slate-50/70"><td className="px-4 py-4"><p className="font-semibold">{a.bookingReference}</p><p className="mt-1 text-slate-500">{a.date} · {a.timeSlot}</p></td><td className="px-4 py-4"><p className="font-semibold">{a.patientName}</p><p className="text-slate-500">{a.patientEmail}</p><p className="text-slate-500">{a.patientPhone}</p><p className="mt-1 text-xs text-slate-500">Age {a.patientAge} · {a.patientGender}</p></td><td className="px-4 py-4"><p className="font-semibold">{a.doctorName}</p><p className="text-slate-500">{a.departmentName}</p><p className="text-xs text-slate-500">{a.office}</p></td><td className="px-4 py-4">{a.visitType}</td><td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${a.status==='confirmed'?'bg-emerald-50 text-emerald-700':a.status==='cancelled'?'bg-red-50 text-red-700':'bg-amber-50 text-amber-700'}`}>{a.status}</span></td><td className="px-4 py-4"><select aria-label={`Update status for ${a.bookingReference}`} value={a.status} onChange={e=>onStatus(a.id,e.target.value as Appointment['status'])} className="rounded-lg border p-2"><option value="confirmed">Confirmed</option><option value="rescheduled">Rescheduled</option><option value="cancelled">Cancelled</option></select><p className="mt-2 max-w-48 text-xs text-slate-500">{a.symptoms || 'No notes provided'}</p></td></tr>)}</tbody></table></div>}</section>
      <p className="mt-4 text-xs text-slate-500">Important: bookings are stored in Firestore when configured, with local browser storage as a fallback. Configure Firestore security rules to restrict admin-only reads and writes before deploying.</p>
    </main>}
  </div>;
}
