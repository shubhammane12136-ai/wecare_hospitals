import { Department, Doctor } from '../types';

export const HOSPITAL_HERO_IMAGE = '/src/assets/images/hero_hospital_building_1792429357332.jpg';
export const HOSPITAL_FACILITY_IMAGE = '/src/assets/images/facility_advanced_care_1792429374088.jpg';

export const DEPARTMENTS: Department[] = [
  {
    id: 'dept-cardiology',
    name: 'Cardiology & Vascular Institute',
    slug: 'cardiology',
    shortDescription: 'Comprehensive cardiovascular care including interventional catheterization, heart failure management, and electrophysiology.',
    longDescription: 'The WeCare Heart & Vascular Institute offers advanced cardiac diagnostics, non-invasive imaging, and minimally invasive catheter-based interventions. Recognized nationally for door-to-balloon times under 45 minutes.',
    iconName: 'HeartPulse',
    services: [
      'Coronary Angiography & Angioplasty',
      'Electrophysiology & Arrhythmia Ablation',
      'Advanced Heart Failure Program',
      'Transcatheter Aortic Valve Replacement (TAVR)',
      'Cardiac Rehabilitation & Wellness'
    ],
    keyTechnologies: ['Siemens Artis Pheno Hybrid Cath Lab', '3D Intracardiac Ultrasound', '384-Slice Cardiac CT Scanner'],
    headOfDepartment: 'Dr. Sarah Lin, MD, FACC',
    location: 'Tower A, Floors 3–4',
    contactExtension: 'Ext. 3010',
    emergencyCare: true,
  },
  {
    id: 'dept-neurology',
    name: 'Neurology & Neurosurgery',
    slug: 'neurology',
    shortDescription: 'Comprehensive brain and nervous system care with a certified Comprehensive Stroke Center and minimally invasive neurosurgery.',
    longDescription: 'Equipped with intraoperative MRI and robotic cranial navigation, our multidisciplinary team treats complex brain tumors, epilepsy, cerebrovascular aneurysms, and neurodegenerative disorders.',
    iconName: 'Brain',
    services: [
      '24/7 Acute Stroke Rapid Response',
      'Robotic Minimally Invasive Cranial Surgery',
      'Epilepsy Monitoring & Resection',
      'Movement Disorders & Deep Brain Stimulation (DBS)',
      'Spine & Peripheral Nerve Reconstruction'
    ],
    keyTechnologies: ['Intraoperative 3T MRI Suite', 'StealthStation S8 Surgical Navigation', 'Continuous Video EEG Telemetry'],
    headOfDepartment: 'Dr. Alexander Wright, MD, PhD',
    location: 'Tower B, Floors 4–5',
    contactExtension: 'Ext. 4020',
    emergencyCare: true,
  },
  {
    id: 'dept-orthopedics',
    name: 'Orthopedics & Joint Replacement',
    slug: 'orthopedics',
    shortDescription: 'Advanced robotic-assisted joint replacement, sports injury rehabilitation, and complex spinal reconstructive surgery.',
    longDescription: 'Restoring mobility with personalized biomechanical planning, robotic Mako surgery, and dedicated orthopedic rehabilitation suites with an average length of stay under 24 hours for joint replacements.',
    iconName: 'Bone',
    services: [
      'Robotic-Arm Assisted Total Knee & Hip Replacement',
      'Arthroscopic Rotator Cuff & ACL Repair',
      'Minimally Invasive Endoscopic Spine Surgery',
      'Pediatric Orthopedic Correction',
      'Specialized Athlete Sports Medicine Clinic'
    ],
    keyTechnologies: ['Mako Robotic-Arm Surgical Platform', 'EOS Low-Dose Full Body Imaging', 'Zero-Gravity Gait Rehabilitation'],
    headOfDepartment: 'Dr. David Sterling, MD, FAAOS',
    location: 'Pavilion C, Floors 1–2',
    contactExtension: 'Ext. 2040',
    emergencyCare: true,
  },
  {
    id: 'dept-pediatrics',
    name: 'Pediatrics & Neonatal Care',
    slug: 'pediatrics',
    shortDescription: 'Compassionate, family-centered medical care for infants, children, and adolescents, backed by a Level IV NICU.',
    longDescription: 'Designed around comfort and healing, our pediatric center delivers round-the-clock emergency care, specialized pediatric cardiology, allergy clinics, and developmental milestone assessments.',
    iconName: 'Baby',
    services: [
      'Level IV Neonatal Intensive Care (NICU)',
      'Pediatric Emergency & Critical Care',
      'Pediatric Cardiology & Pulmonology',
      'Childhood Immunization & Growth Tracking',
      'Pediatric Allergy, Asthma & Immunology'
    ],
    keyTechnologies: ['Giraffe Omnibed Neonatal Incubators', 'Pediatric High-Frequency Oscillatory Ventilators', 'Child-Friendly Low-Dose Imaging'],
    headOfDepartment: 'Dr. Priya Patel, MD, FAAP',
    location: 'Children’s Wing, Floors 1–3',
    contactExtension: 'Ext. 1050',
    emergencyCare: true,
  },
  {
    id: 'dept-oncology',
    name: 'Oncology & Cancer Center',
    slug: 'oncology',
    shortDescription: 'Multidisciplinary precision cancer therapies, targeted immunotherapy, advanced radiation, and surgical oncology.',
    longDescription: 'Our Comprehensive Cancer Care Center integrates molecular genomic profiling, stereotactic body radiation, and an on-site dedicated infusion suite designed with private patient bays.',
    iconName: 'Activity',
    services: [
      'Targeted Immunotherapy & Infusion Services',
      'Varian TrueBeam Stereotactic Radiation Therapy',
      'Robotic Minimally Invasive Tumor Resections',
      'Precision Genetic & Biomarker Profiling',
      'Comprehensive Cancer Survivorship & Palliative Care'
    ],
    keyTechnologies: ['Varian TrueBeam Linear Accelerator', 'Next-Gen DNA Sequencing Laboratory', 'Cold-Cap Scalp Cooling Therapy'],
    headOfDepartment: 'Dr. Helena Weiss, MD',
    location: 'East Pavilion, Floors 2–3',
    contactExtension: 'Ext. 5030',
    emergencyCare: false,
  },
  {
    id: 'dept-pulmonology',
    name: 'Pulmonology & Critical Care',
    slug: 'pulmonology',
    shortDescription: 'Specialized diagnosis and therapies for asthma, COPD, interstitial lung diseases, and sleep apnea alongside medical ICU services.',
    longDescription: 'Our pulmonary specialists utilize state-of-the-art bronchoscopic navigation for early nodule detection and personalized pulmonary rehabilitation programs.',
    iconName: 'Wind',
    services: [
      'Navigational Electromagnetic Bronchoscopy',
      'Comprehensive Sleep Diagnostics Laboratory',
      'Advanced Asthma & Allergy Biologics',
      'COPD & Interstitial Lung Disease Management',
      'Critical Care Medical ICU (MICU) Support'
    ],
    keyTechnologies: ['SuperDimension Navigation Bronchoscopy', 'Digital Polysomnography Sleep Suites', 'Advanced ECMO Life Support'],
    headOfDepartment: 'Dr. Vikram Mehra, MD, FCCP',
    location: 'Tower A, Floor 2',
    contactExtension: 'Ext. 3080',
    emergencyCare: true,
  }
];

export const DOCTORS: Doctor[] = [
  // Cardiology Doctors (3 doctors)
  {
    id: 'doc-sarah-lin',
    name: 'Dr. Sarah Lin',
    departmentId: 'dept-cardiology',
    departmentName: 'Cardiology & Vascular Institute',
    title: 'Senior Interventional Cardiologist & Department Chair',
    degrees: 'MD, FACC, FSCAI (Harvard Medical School)',
    experienceYears: 18,
    rating: 4.96,
    reviewCount: 312,
    languages: ['English', 'Mandarin'],
    availability: {
      days: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
      nextSlot: 'Today at 02:30 PM',
      availableToday: true,
      slots: ['09:00 AM', '10:30 AM', '02:30 PM', '04:00 PM']
    },
    image: '/src/assets/images/doctor_cardiologist_woman_1792429390286.jpg',
    fallbackInitials: 'SL',
    bio: 'Dr. Lin is an internationally published cardiologist specializing in complex coronary interventions, TAVR procedures, and radial artery catheterization. She pioneered WeCare’s 45-minute rapid STEMI protocol.',
    specialties: ['Interventional Cardiology', 'TAVR & Structural Heart', 'Coronary Angioplasty', 'Radial Access'],
    consultationFee: 160,
    office: 'Cardiovascular Suite 302, Tower A',
    awards: ['Top Physician Award 2024', 'American College of Cardiology Fellow']
  },
  {
    id: 'doc-robert-hayes',
    name: 'Dr. Robert Hayes',
    departmentId: 'dept-cardiology',
    departmentName: 'Cardiology & Vascular Institute',
    title: 'Cardiac Electrophysiologist',
    degrees: 'MD, FHRS (Stanford Medicine)',
    experienceYears: 14,
    rating: 4.92,
    reviewCount: 198,
    languages: ['English', 'Spanish'],
    availability: {
      days: ['Tuesday', 'Thursday', 'Saturday'],
      nextSlot: 'Tomorrow at 10:00 AM',
      availableToday: false,
      slots: ['10:00 AM', '11:30 AM', '01:30 PM', '03:30 PM']
    },
    image: '',
    fallbackInitials: 'RH',
    bio: 'Dr. Hayes focuses on heart rhythm disorders, radiofrequency catheter ablation, and leadless pacemaker implantation. He has treated over 2,000 patients with atrial fibrillation.',
    specialties: ['Atrial Fibrillation Ablation', 'Pacemaker & ICD Implantation', 'Syncope Evaluation', 'Ventricular Arrhythmias'],
    consultationFee: 150,
    office: 'Cardiovascular Suite 306, Tower A'
  },
  {
    id: 'doc-ananya-sen',
    name: 'Dr. Ananya Sen',
    departmentId: 'dept-cardiology',
    departmentName: 'Cardiology & Vascular Institute',
    title: 'Non-Invasive Cardiologist & Imaging Specialist',
    degrees: 'MD, FASE (Columbia University)',
    experienceYears: 11,
    rating: 4.89,
    reviewCount: 164,
    languages: ['English', 'Hindi', 'Bengali'],
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
      nextSlot: 'Today at 03:00 PM',
      availableToday: true,
      slots: ['09:30 AM', '11:00 AM', '03:00 PM', '04:30 PM']
    },
    image: '',
    fallbackInitials: 'AS',
    bio: 'Specializing in advanced cardiovascular ultrasound, 3D echocardiography, and preventive preventive cardiology for patients with strong family history of heart disease.',
    specialties: ['3D Echocardiography', 'Preventive Cardiology', 'Cardiovascular CT/MRI', 'Women’s Heart Health'],
    consultationFee: 140,
    office: 'Cardiovascular Suite 308, Tower A'
  },

  // Neurology Doctors (3 doctors)
  {
    id: 'doc-alexander-wright',
    name: 'Dr. Alexander Wright',
    departmentId: 'dept-neurology',
    departmentName: 'Neurology & Neurosurgery',
    title: 'Chief Neurologist & Director of Stroke Services',
    degrees: 'MD, PhD, FAAN (Johns Hopkins School of Medicine)',
    experienceYears: 20,
    rating: 4.98,
    reviewCount: 420,
    languages: ['English', 'German'],
    availability: {
      days: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
      nextSlot: 'Today at 11:30 AM',
      availableToday: true,
      slots: ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM']
    },
    image: '/src/assets/images/doctor_neurologist_man_1792429404713.jpg',
    fallbackInitials: 'AW',
    bio: 'Dr. Wright is a leading authority on neuroprotection, acute ischemic stroke treatment, and neurovascular imaging. He directs the regional emergency neuro-intervention grid.',
    specialties: ['Acute Stroke Care', 'Cerebrovascular Disease', 'Complex Neuro-Consultation', 'Cognitive Neurology'],
    consultationFee: 175,
    office: 'Neuroscience Clinic 402, Tower B',
    awards: ['National Stroke Association Lifetime Leadership', 'Excellence in Clinical Neurology']
  },
  {
    id: 'doc-maya-chen',
    name: 'Dr. Maya Chen',
    departmentId: 'dept-neurology',
    departmentName: 'Neurology & Neurosurgery',
    title: 'Consultant Neurosurgeon',
    degrees: 'MD, FAANS (UCSF School of Medicine)',
    experienceYears: 13,
    rating: 4.91,
    reviewCount: 185,
    languages: ['English', 'Mandarin'],
    availability: {
      days: ['Wednesday', 'Thursday', 'Saturday'],
      nextSlot: 'Tomorrow at 09:30 AM',
      availableToday: false,
      slots: ['09:30 AM', '11:00 AM', '01:00 PM', '03:00 PM']
    },
    image: '',
    fallbackInitials: 'MC',
    bio: 'Specialist in minimally invasive brain surgery, cranial endoscopy, pituitary tumor removal, and microscopic spine stabilization.',
    specialties: ['Minimally Invasive Neurosurgery', 'Skull Base Surgery', 'Spinal Cord Decompression', 'Brain Aneurysm Surgery'],
    consultationFee: 190,
    office: 'Surgical Pavilion 410, Tower B'
  },
  {
    id: 'doc-tariq-al-mansoor',
    name: 'Dr. Tariq Al-Mansoor',
    departmentId: 'dept-neurology',
    departmentName: 'Neurology & Neurosurgery',
    title: 'Neurologist & Movement Disorder Specialist',
    degrees: 'MD (Oxford & King’s College London)',
    experienceYears: 12,
    rating: 4.88,
    reviewCount: 142,
    languages: ['English', 'Arabic'],
    availability: {
      days: ['Monday', 'Wednesday', 'Friday'],
      nextSlot: 'Today at 01:15 PM',
      availableToday: true,
      slots: ['10:00 AM', '01:15 PM', '03:15 PM']
    },
    image: '',
    fallbackInitials: 'TM',
    bio: 'Focuses on Parkinson’s disease management, essential tremor, botulinum toxin clinical therapies, and pre-surgical evaluation for deep brain stimulation.',
    specialties: ['Parkinson’s Disease', 'Deep Brain Stimulation Tuning', 'Movement Disorders', 'Neuropathy'],
    consultationFee: 145,
    office: 'Neuroscience Clinic 408, Tower B'
  },

  // Orthopedics Doctors (3 doctors)
  {
    id: 'doc-david-sterling',
    name: 'Dr. David Sterling',
    departmentId: 'dept-orthopedics',
    departmentName: 'Orthopedics & Joint Replacement',
    title: 'Director of Orthopedic Surgery & Robotic Joint Care',
    degrees: 'MD, FAAOS (Mayo Clinic College of Medicine)',
    experienceYears: 17,
    rating: 4.97,
    reviewCount: 380,
    languages: ['English'],
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      nextSlot: 'Today at 03:45 PM',
      availableToday: true,
      slots: ['08:30 AM', '10:00 AM', '01:30 PM', '03:45 PM']
    },
    image: '/src/assets/images/doctor_orthopedic_man_1792429431892.jpg',
    fallbackInitials: 'DS',
    bio: 'Dr. Sterling has completed over 3,500 successful joint replacements and serves as a master instructor in computer-navigated and robotic knee and hip reconstruction.',
    specialties: ['Robotic Hip & Knee Replacement', 'Complex Revision Arthroplasty', 'Pelvic Trauma', 'Rapid Recovery Protocols'],
    consultationFee: 165,
    office: 'Orthopedic Suite 105, Pavilion C'
  },
  {
    id: 'doc-rachel-kovacs',
    name: 'Dr. Rachel Kovacs',
    departmentId: 'dept-orthopedics',
    departmentName: 'Orthopedics & Joint Replacement',
    title: 'Sports Medicine Surgeon & Arthroscopy Specialist',
    degrees: 'MD (University of Pennsylvania)',
    experienceYears: 10,
    rating: 4.93,
    reviewCount: 220,
    languages: ['English', 'French'],
    availability: {
      days: ['Tuesday', 'Thursday', 'Friday', 'Saturday'],
      nextSlot: 'Tomorrow at 11:00 AM',
      availableToday: false,
      slots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM']
    },
    image: '',
    fallbackInitials: 'RK',
    bio: 'Former consultant to national sports athletic programs, Dr. Kovacs treats collegiate and active individuals with cartilage preservation, meniscus repair, and ligament reconstruction.',
    specialties: ['ACL Reconstruction', 'Shoulder Arthroscopy & Rotator Cuff', 'Cartilage Restoration', 'Sports Injury Rehabilitation'],
    consultationFee: 150,
    office: 'Sports Clinic 112, Pavilion C'
  },
  {
    id: 'doc-michael-oconnor',
    name: 'Dr. Michael O’Connor',
    departmentId: 'dept-orthopedics',
    departmentName: 'Orthopedics & Joint Replacement',
    title: 'Spine Surgeon & Traumatologist',
    degrees: 'MD, FRCS (Tr & Orth) (Royal College of Surgeons)',
    experienceYears: 15,
    rating: 4.87,
    reviewCount: 195,
    languages: ['English'],
    availability: {
      days: ['Monday', 'Wednesday', 'Friday'],
      nextSlot: 'Today at 04:15 PM',
      availableToday: true,
      slots: ['09:15 AM', '11:45 AM', '02:15 PM', '04:15 PM']
    },
    image: '',
    fallbackInitials: 'MO',
    bio: 'Dedicated to minimally invasive spine decompression, disc replacement, spinal deformity correction, and emergency musculoskeletal trauma stabilization.',
    specialties: ['Microdiscectomy', 'Lumbar & Cervical Spine Fusion', 'Scoliosis Correction', 'Fracture Management'],
    consultationFee: 160,
    office: 'Spine Center 120, Pavilion C'
  },

  // Pediatrics Doctors (3 doctors)
  {
    id: 'doc-priya-patel',
    name: 'Dr. Priya Patel',
    departmentId: 'dept-pediatrics',
    departmentName: 'Pediatrics & Neonatal Care',
    title: 'Head of Pediatric Medicine',
    degrees: 'MD, FAAP (Northwestern University Feinberg)',
    experienceYears: 16,
    rating: 4.99,
    reviewCount: 450,
    languages: ['English', 'Hindi', 'Gujarati'],
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      nextSlot: 'Today at 01:00 PM',
      availableToday: true,
      slots: ['08:45 AM', '10:15 AM', '01:00 PM', '03:15 PM', '04:45 PM']
    },
    image: '/src/assets/images/doctor_pediatrician_woman_1792429418302.jpg',
    fallbackInitials: 'PP',
    bio: 'Beloved by parents and young patients, Dr. Patel delivers comprehensive developmental monitoring, pediatric disease prevention, and adolescent health counseling.',
    specialties: ['General Pediatrics', 'Developmental Milestone Screening', 'Pediatric Nutrition', 'Adolescent Medicine'],
    consultationFee: 130,
    office: 'Pediatric Center 101, Children’s Wing',
    awards: ['Patient Choice Compassionate Physician 2025']
  },
  {
    id: 'doc-lucas-gomez',
    name: 'Dr. Lucas Gomez',
    departmentId: 'dept-pediatrics',
    departmentName: 'Pediatrics & Neonatal Care',
    title: 'Neonatologist & Pediatric Critical Care Specialist',
    degrees: 'MD (Baylor College of Medicine)',
    experienceYears: 12,
    rating: 4.94,
    reviewCount: 160,
    languages: ['English', 'Spanish'],
    availability: {
      days: ['Tuesday', 'Wednesday', 'Friday', 'Saturday'],
      nextSlot: 'Tomorrow at 10:30 AM',
      availableToday: false,
      slots: ['10:30 AM', '01:30 PM', '03:30 PM']
    },
    image: '',
    fallbackInitials: 'LG',
    bio: 'Dedicated to premature newborn intensive resuscitation, respiratory distress management in infants, and family-centered NICU discharge planning.',
    specialties: ['Neonatal Intensive Care', 'Prematurity Complications', 'Infant Respiratory Therapy', 'Neonatal Nutrition'],
    consultationFee: 155,
    office: 'NICU Medical Directorate, Children’s Wing'
  },
  {
    id: 'doc-emily-watson',
    name: 'Dr. Emily Watson',
    departmentId: 'dept-pediatrics',
    departmentName: 'Pediatrics & Neonatal Care',
    title: 'Pediatric Allergy & Pulmonology Consultant',
    degrees: 'MD (Yale School of Medicine)',
    experienceYears: 9,
    rating: 4.90,
    reviewCount: 135,
    languages: ['English'],
    availability: {
      days: ['Monday', 'Thursday', 'Friday'],
      nextSlot: 'Today at 02:45 PM',
      availableToday: true,
      slots: ['09:45 AM', '11:15 AM', '02:45 PM']
    },
    image: '',
    fallbackInitials: 'EW',
    bio: 'Focuses on pediatric severe asthma, severe food allergies, eczema, and desensitization therapy for childhood immunological conditions.',
    specialties: ['Pediatric Asthma', 'Food Allergies & Desensitization', 'Eczema & Atopic Dermatitis', 'Pulmonary Function Testing'],
    consultationFee: 135,
    office: 'Pediatric Center 108, Children’s Wing'
  },

  // Oncology Doctors (2 doctors)
  {
    id: 'doc-helena-weiss',
    name: 'Dr. Helena Weiss',
    departmentId: 'dept-oncology',
    departmentName: 'Oncology & Cancer Center',
    title: 'Director of Medical Oncology & Clinical Trials',
    degrees: 'MD (Heidelberg University & Memorial Sloan Kettering)',
    experienceYears: 19,
    rating: 4.95,
    reviewCount: 290,
    languages: ['English', 'German'],
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      nextSlot: 'Today at 02:00 PM',
      availableToday: true,
      slots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM']
    },
    image: '',
    fallbackInitials: 'HW',
    bio: 'Pioneering oncologist specializing in targeted immunotherapies, precision molecular diagnostics, and breast and gastrointestinal oncology.',
    specialties: ['Medical Oncology', 'Immunotherapy Protocols', 'Genomic Guided Therapies', 'Breast & Lung Cancer'],
    consultationFee: 170,
    office: 'Cancer Center Suite 204, East Pavilion'
  },
  {
    id: 'doc-jonathan-kim',
    name: 'Dr. Jonathan Kim',
    departmentId: 'dept-oncology',
    departmentName: 'Oncology & Cancer Center',
    title: 'Surgical Oncologist',
    degrees: 'MD, PhD (Duke University School of Medicine)',
    experienceYears: 13,
    rating: 4.91,
    reviewCount: 174,
    languages: ['English', 'Korean'],
    availability: {
      days: ['Tuesday', 'Thursday', 'Friday'],
      nextSlot: 'Tomorrow at 09:00 AM',
      availableToday: false,
      slots: ['09:00 AM', '11:30 AM', '01:30 PM']
    },
    image: '',
    fallbackInitials: 'JK',
    bio: 'Expert in robotic gastrointestinal, hepatobiliary, and endocrine tumor resection with organ-preserving surgical techniques.',
    specialties: ['Robotic Surgical Oncology', 'Pancreatic & Liver Resections', 'Colorectal Oncology', 'Thyroid Surgery'],
    consultationFee: 180,
    office: 'Cancer Center Suite 210, East Pavilion'
  },

  // Pulmonology Doctors (2 doctors)
  {
    id: 'doc-vikram-mehra',
    name: 'Dr. Vikram Mehra',
    departmentId: 'dept-pulmonology',
    departmentName: 'Pulmonology & Critical Care',
    title: 'Chief of Pulmonology & Sleep Medicine',
    degrees: 'MD, FCCP (All India Institute of Medical Sciences & Cleveland Clinic)',
    experienceYears: 21,
    rating: 4.94,
    reviewCount: 310,
    languages: ['English', 'Hindi', 'Punjabi'],
    availability: {
      days: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
      nextSlot: 'Today at 10:45 AM',
      availableToday: true,
      slots: ['09:15 AM', '10:45 AM', '02:15 PM', '04:00 PM']
    },
    image: '',
    fallbackInitials: 'VM',
    bio: 'Recognized researcher in chronic obstructive pulmonary disease (COPD), obstructive sleep apnea, and post-viral pulmonary fibrosis.',
    specialties: ['COPD & Emphysema', 'Interventional Bronchoscopy', 'Sleep Apnea & CPAP', 'Pulmonary Fibrosis'],
    consultationFee: 145,
    office: 'Pulmonary Clinic 201, Tower A'
  },
  {
    id: 'doc-chloe-bennett',
    name: 'Dr. Chloe Bennett',
    departmentId: 'dept-pulmonology',
    departmentName: 'Pulmonology & Critical Care',
    title: 'Intensivist & Respiratory Medicine Specialist',
    degrees: 'MD (University of Toronto Faculty of Medicine)',
    experienceYears: 11,
    rating: 4.88,
    reviewCount: 140,
    languages: ['English', 'French'],
    availability: {
      days: ['Wednesday', 'Thursday', 'Friday', 'Saturday'],
      nextSlot: 'Tomorrow at 01:45 PM',
      availableToday: false,
      slots: ['10:00 AM', '01:45 PM', '03:45 PM']
    },
    image: '',
    fallbackInitials: 'CB',
    bio: 'Specialist in critical care life support, non-invasive mechanical ventilation, and long-term pulmonary rehabilitation.',
    specialties: ['Critical Care ICU', 'Respiratory Failure', 'Asthma Management', 'Occupational Lung Health'],
    consultationFee: 140,
    office: 'Pulmonary Clinic 205, Tower A'
  }
];

export const HOSPITAL_METRICS = [
  { value: '450+', label: 'Inpatient Beds', detail: 'Including 80 dedicated ICU & critical care units' },
  { value: '120+', label: 'Specialist Doctors', detail: 'Board-certified across 24 multidisciplinary fields' },
  { value: '< 45 min', label: 'Door-to-Balloon Time', detail: 'Consistently outperforming national cardiology benchmarks' },
  { value: '99.4%', label: 'Patient Satisfaction', detail: 'Independent verified post-discharge clinical surveys' },
];

export const ACCREDITATIONS = [
  { name: 'Joint Commission International (JCI)', code: 'Gold Seal of Approval', desc: 'Highest global standard in patient safety and clinical care protocols' },
  { name: 'Level 1 Trauma Center', code: 'State Certified', desc: 'Comprehensive 24/7 neuro, cardiac, and trauma surgical response teams' },
  { name: 'Magnet Nursing Recognition', code: 'ANCC Credentialed', desc: 'Top tier nursing care quality and patient-to-nurse clinical ratios' },
  { name: 'College of American Pathologists (CAP)', code: 'Laboratory Excellence', desc: '100% precision audit compliance in pathology and molecular genetics' }
];

export const PATIENT_TESTIMONIALS = [
  {
    id: 't-1',
    quote: 'The promptness of Dr. Sarah Lin and the WeCare cardiac cath team saved my father during a sudden heart attack. From ambulance entry to stent placement took only 38 minutes.',
    patientName: 'David K. Morrison',
    location: 'Recovered Patient, Cardiology',
    verifiedTreatment: 'Emergency Coronary Angioplasty',
    rating: 5
  },
  {
    id: 't-2',
    quote: 'Dr. Sterling performed my robotic knee replacement. I walked unassisted within 48 hours and returned to hiking 7 weeks later. The physical therapy staff at WeCare is unmatched.',
    patientName: 'Eleanor Vance',
    location: 'Active Retiree, Orthopedics',
    verifiedTreatment: 'Mako Robotic Total Knee Arthroplasty',
    rating: 5
  },
  {
    id: 't-3',
    quote: 'Having a sick toddler in the middle of the night is terrifying. Dr. Priya Patel treated my daughter with such gentle warmth and precision that our fear vanished immediately.',
    patientName: 'Sofia Martinez',
    location: 'Parent of Patient, Pediatrics',
    verifiedTreatment: 'Pediatric Respiratory Care',
    rating: 5
  }
];
