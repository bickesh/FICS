import { useState } from 'react';
import fssaiLogo from './fssai-logo.png';
import ficsFlowchart from './fics-flowchart.png';

// ================================================================
// FICS OFFICER PORTAL — Complete UI Mockup (AO / TO Screens)
// Covers: Scrutiny → Payment → Visual Inspection → Lab → NOC
// Based on: FICS_FLOW_Chart.pdf + FSSAI_ICEGATE_SWIFT_Workflow.pdf
// ================================================================

// ─── Dummy Data ────────────────────────────────────────────────────────────────
const OFFICERS = ['TO - Rajan Kumar', 'TO - Priya Sharma', 'TO - Amit Verma', 'TO - Deepak Nair'];

const APPS = [
  {
    id: 'FICS/2024/3821', arn: 'ARN-2024-3821', be: '8234567', beType: 'Regular', beDate: '2024-04-10', igm: 'IGM24001',
    importType: 'Regular', source: 'SWIFT',
    importer: 'M/s Global Foods Pvt Ltd', iec: 'AABCG1234A', cha: 'ABC Customs House Agents',
    port: 'JNPT, Mumbai', cfsLocation: 'CFS Nhava Sheva',
    stage: 'scrutiny', status: 'PENDING_SCRUTINY', assignedTO: null,
    items: [
      { sno: 1, hsCode: '19011090', product: 'Wheat Flour Preparations', qty: '5000 KG', value: '₹4,50,000', country: 'USA', mfgDate: '2024-01-15', expDate: '2025-01-14', scrutinyDecision: null },
      { sno: 2, hsCode: '21069099', product: 'Food Supplements (Protein Powder)', qty: '200 KG', value: '₹1,20,000', country: 'USA', mfgDate: '2024-02-01', expDate: '2025-01-31', scrutinyDecision: null },
    ],
    documents: ['Invoice', 'Packing List', 'FSSAI License', 'Product Declaration'],
    clarifications: [],
    payment: null, viAppointment: null, samples: [], labResult: null, certificate: null,
  },
  {
    id: 'FICS/2024/3820', arn: 'ARN-2024-3820', be: '7234566', beType: 'PADS', beDate: '2024-04-09', igm: '',
    importType: 'PADS', source: 'Manual',
    importer: 'M/s Tasty Imports Pvt Ltd', iec: 'AABCT5678B', cha: 'XYZ CHA Services',
    port: 'Chennai Sea', cfsLocation: 'CFS Chennai Port',
    stage: 'payment', status: 'PENDING_DD_VERIFICATION', assignedTO: 'TO - Rajan Kumar',
    items: [
      { sno: 1, hsCode: '09042110', product: 'Dried Chillies', qty: '10000 KG', value: '₹8,00,000', country: 'China', mfgDate: '2024-01-01', expDate: '2024-12-31', scrutinyDecision: 'ACCEPT' },
    ],
    documents: ['Invoice', 'Packing List', 'Phytosanitary Certificate'],
    clarifications: [],
    payment: { mode: 'DD', ddNo: 'DD123456', bank: 'SBI Branch - Chennai', amount: '₹3,500', status: 'PENDING_VERIFICATION' },
    viAppointment: null, samples: [], labResult: null, certificate: null,
  },
  {
    id: 'FICS/2024/3819', arn: 'ARN-2024-3819', be: '6234565', beType: 'Regular', beDate: '2024-04-08', igm: 'IGM24003',
    importType: 'Regular', source: 'Manual',
    importer: 'M/s Heritage Foods Ltd', iec: 'AABCH9012C', cha: 'DEF Clearing Agents',
    port: 'JNPT, Mumbai', cfsLocation: 'CFS Gateway',
    stage: 'visual_inspection', status: 'VI_IN_PROGRESS', assignedTO: 'TO - Priya Sharma',
    items: [
      { sno: 1, hsCode: '07031090', product: 'Fresh Onions', qty: '20000 KG', value: '₹2,00,000', country: 'Netherlands', mfgDate: '2024-03-20', expDate: '2024-06-20', scrutinyDecision: 'ACCEPT', sampleId: 'SMP-2024-001', viStatus: 'DISCREPANCY', discrepancyType: 'RECTIFIABLE', discrepancyNote: 'Country of origin label missing on inner packaging' },
      { sno: 2, hsCode: '07019000', product: 'Potatoes', qty: '15000 KG', value: '₹1,50,000', country: 'Netherlands', mfgDate: '2024-03-20', expDate: '2024-06-20', scrutinyDecision: 'ACCEPT', sampleId: 'SMP-2024-002', viStatus: 'PASSED', discrepancyType: null, discrepancyNote: null },
    ],
    documents: ['Invoice', 'Packing List', 'Phytosanitary Certificate', 'Health Certificate'],
    clarifications: [],
    payment: { mode: 'Online', txnId: 'TXN789456', amount: '₹5,000', status: 'SUCCESS' },
    viAppointment: { date: '2024-04-15', time: '10:00', acknowledged: true, ackTime: '11:45', aoApproved: false },
    samples: [
      { id: 'SMP-2024-001', itemSno: 1, lab: null, status: 'VI_DISCREPANCY' },
      { id: 'SMP-2024-002', itemSno: 2, lab: null, status: 'VI_PASSED' },
    ],
    labResult: null, certificate: null,
  },
  {
    id: 'FICS/2024/3818', arn: 'ARN-2024-3818', be: '5234564', beType: 'Bulk', beDate: '2024-04-07', igm: 'IGM24004',
    importType: 'Bulk', source: 'Manual',
    importer: 'M/s Spice World Exports', iec: 'AABCS3456D', cha: 'GHI CHA',
    port: 'Kolkata', cfsLocation: 'Kolkata Port Trust',
    stage: 'lab_testing', status: 'LAB_RESULT_RECEIVED', assignedTO: 'TO - Amit Verma',
    items: [
      { sno: 1, hsCode: '09042210', product: 'Dry Red Chilli (Crushed)', qty: '5000 KG', value: '₹12,00,000', country: 'Vietnam', mfgDate: '2023-12-01', expDate: '2024-11-30', scrutinyDecision: 'ACCEPT', sampleId: 'SMP-2024-003', viStatus: 'PASSED' },
      { sno: 2, hsCode: '09042220', product: 'Chilli Powder', qty: '3000 KG', value: '₹9,00,000', country: 'Vietnam', mfgDate: '2023-12-01', expDate: '2024-11-30', scrutinyDecision: 'ACCEPT', sampleId: 'SMP-2024-004', viStatus: 'PASSED' },
    ],
    documents: ['Invoice', 'Packing List', 'Lab Certificate from Origin'],
    clarifications: [],
    payment: { mode: 'Online', txnId: 'TXN456789', amount: '₹7,000', status: 'SUCCESS' },
    viAppointment: { date: '2024-04-10', time: '11:00', acknowledged: true, ackTime: '10:30', aoApproved: true },
    samples: [
      { id: 'SMP-2024-003', itemSno: 1, lab: 'FSSAI Referral Lab Mumbai', reportDate: '2024-04-14', result: 'PASS', failReason: null },
      { id: 'SMP-2024-004', itemSno: 2, lab: 'FSSAI Referral Lab Mumbai', reportDate: '2024-04-14', result: 'FAIL', failReason: 'Aflatoxin B1: 8.2 ppb (limit: 5 ppb). Sudan Red dye detected.' },
    ],
    labResult: { receivedDate: '2024-04-14', status: 'RECEIVED' },
    toRecommendation: null, certificate: null,
  },
  {
    id: 'FICS/2024/3817', arn: 'ARN-2024-3817', be: '4234563', beType: 'Regular', beDate: '2024-04-06', igm: 'IGM24005',
    importType: 'Regular', source: 'SWIFT',
    importer: 'M/s Pure Harvest Agro', iec: 'AABCP7890E', cha: 'JKL Customs',
    port: 'JNPT, Mumbai', cfsLocation: 'CFS Nhava Sheva',
    stage: 'noc_pending', status: 'NOC_APPROVAL_PENDING', assignedTO: 'TO - Rajan Kumar',
    items: [
      { sno: 1, hsCode: '10019900', product: 'Wheat (Durum)', qty: '50000 KG', value: '₹25,00,000', country: 'Canada', mfgDate: '2023-11-01', expDate: '2024-10-31', scrutinyDecision: 'ACCEPT', sampleId: 'SMP-2024-005', viStatus: 'PASSED' },
    ],
    documents: ['Invoice', 'Packing List', 'Certificate of Origin', 'Phytosanitary Certificate'],
    clarifications: [],
    payment: { mode: 'Online', txnId: 'TXN123789', amount: '₹3,000', status: 'SUCCESS' },
    viAppointment: { date: '2024-04-09', time: '10:00', acknowledged: true, ackTime: '09:00', aoApproved: true },
    samples: [
      { id: 'SMP-2024-005', itemSno: 1, lab: 'FSSAI Referral Lab Delhi', reportDate: '2024-04-13', result: 'PASS', failReason: null },
    ],
    labResult: { receivedDate: '2024-04-13', status: 'RECEIVED' },
    toRecommendation: 'RECOMMEND_NOC', certificate: null,
  },
];

const REVIEW_CASES = [
  {
    id: 'REV/2024/001', type: 'RETEST', appId: 'FICS/2024/3810',
    nccNo: 'NCC/FSSAI/JNPT/2024/3810', nccDate: '2024-04-15',
    daysFromNCC: 12, daysLeft: 3, importer: 'M/s Dragon Foods Pvt Ltd',
    product: 'Processed Meat Products', hsCode: '16010000',
    failReason: 'Salmonella detected in primary sample SMP-2024-099 — count 45 MPN/g (limit: absent per 25g)',
    status: 'RETEST_PENDING_AO', retestSampleSent: false,
  },
  {
    id: 'REV/2024/002', type: 'REVIEW_1', appId: 'FICS/2024/3805',
    nccNo: 'NCC/FSSAI/JNPT/2024/3805', nccDate: '2024-04-01',
    daysFromNCC: 25, daysLeft: 5, importer: 'M/s Euro Dairy Imports',
    product: 'Cheese and Dairy Products', hsCode: '0406.10',
    failReason: 'Aflatoxin M1: 0.9 μg/kg detected (FSSAI limit: 0.5 μg/kg) in sample SMP-2024-088',
    status: 'REVIEW_PENDING_RD', assignedRD: null, assignedTO: null,
  },
  {
    id: 'REV/2024/003', type: 'APPEAL_2', appId: 'FICS/2024/3800',
    nccNo: 'NCC/FSSAI/JNPT/2024/3800', nccDate: '2024-03-15',
    reviewDecision: 'NCC_CONFIRMED_BY_RD', importer: 'M/s Pacific Seafoods Inc',
    product: 'Frozen Tuna Fish Fillets', hsCode: '0304.71',
    failReason: 'Mercury: 1.8 ppm (FSSAI limit: 1.0 ppm) — both primary and counter-sample failed',
    status: 'APPEAL_PENDING_CEO', assignedCEOTO: null,
  },
];

// ─── Demo Users (one per role) ─────────────────────────────────────────────────
const DEMO_USERS = [
  { role: 'AO',    name: 'Suresh Menon',    designation: 'Authorized Officer',    org: 'FSSAI, JNPT Mumbai',            username: 'ao.suresh',   password: 'fics@2024' },
  { role: 'INS',   name: 'Rajan Kumar',     designation: 'Inspector / Tech Officer', org: 'FSSAI, JNPT Mumbai',         username: 'ins.rajan',   password: 'fics@2024' },
  { role: 'IMP',   name: 'Ramesh Agarwal',  designation: 'Importer',              org: 'M/s Global Foods Pvt Ltd',      username: 'imp.ramesh',  password: 'fics@2024' },
  { role: 'CHA',   name: 'Vikram Shetty',   designation: 'CHA Representative',    org: 'ABC Customs House Agents',      username: 'cha.vikram',  password: 'fics@2024' },
  { role: 'LABS',  name: 'Dr. Anita Rao',   designation: 'Lab Analyst',           org: 'FSSAI Referral Lab, Mumbai',    username: 'labs.anita',  password: 'fics@2024' },
  { role: 'RD',    name: 'Ramesh Pillai',   designation: 'Regional Director',     org: 'FSSAI West Zone (JNPT)',        username: 'rd.pillai',   password: 'fics@2024' },
  { role: 'CEO',   name: 'Dr. K. Prakash',  designation: 'FSSAI CEO',             org: 'FSSAI Head Office, Delhi',      username: 'ceo.fssai',   password: 'fics@2024' },
  { role: 'ADMIN', name: 'Pradeep Nair',    designation: 'System Administrator',  org: 'FSSAI IT Cell',                 username: 'admin.fics',  password: 'fics@2024' },
];

// ─── Role-wise Navigation (SRS §3.2) ──────────────────────────────────────────
const ROLE_DEFAULT_SCREEN = {
  AO: 'dashboard', INS: 'dashboard', IMP: 'imp_apps', CHA: 'imp_apps',
  LABS: 'dashboard', RD: 'review', CEO: 'review', ADMIN: 'admin_users',
};

const ROLE_NAV = {
  AO: [
    { id: 'dashboard', label: 'Dashboard',            icon: '🏠' },
    { id: 'bin',       label: 'Application Bin',      icon: '📋' },
    { id: 'scrutiny',  label: 'Scrutiny',             icon: '🔍', badge: 12 },
    { id: 'payment',   label: 'Payment Verification', icon: '💳', badge: 3 },
    { id: 'vi',        label: 'Visual Inspection',    icon: '👁️', badge: 7 },
    { id: 'lab',       label: 'Lab Results',          icon: '🧪', badge: 5 },
    { id: 'noc',       label: 'NOC Issuance',         icon: '📜', badge: 4 },
    { id: 'review',    label: 'Review & Appeal',      icon: '⚖️', badge: 3 },
    { id: 'reports',   label: 'Reports',              icon: '📊' },
  ],
  INS: [
    { id: 'dashboard', label: 'My Dashboard',         icon: '🏠' },
    { id: 'bin',       label: 'Application Bin',      icon: '📋' },
    { id: 'scrutiny',  label: 'Scrutiny Workbench',   icon: '🔍', badge: 5 },
    { id: 'vi',        label: 'Visual Inspection',    icon: '👁️', badge: 7 },
    { id: 'lab',       label: 'Lab Results',          icon: '🧪', badge: 5 },
    { id: 'reports',   label: 'Reports',              icon: '📊' },
  ],
  IMP: [
    { id: 'imp_apps',    label: 'My Applications',     icon: '📋', badge: 3 },
    { id: 'imp_payment', label: 'Payments',            icon: '💳', badge: 1 },
    { id: 'imp_clarif',  label: 'Clarifications',      icon: '❓', badge: 2 },
    { id: 'imp_noc',     label: 'NOC / NCC Downloads', icon: '📜' },
    { id: 'imp_review',  label: 'Review & Retest',     icon: '⚖️' },
  ],
  CHA: [
    { id: 'imp_apps',    label: 'Client Applications',  icon: '📋', badge: 5 },
    { id: 'imp_payment', label: 'Payments',             icon: '💳', badge: 2 },
    { id: 'imp_clarif',  label: 'Clarifications',       icon: '❓', badge: 3 },
    { id: 'imp_noc',     label: 'NOC / NCC Downloads',  icon: '📜' },
    { id: 'imp_review',  label: 'Review & Retest',      icon: '⚖️' },
  ],
  LABS: [
    { id: 'dashboard',    label: 'Lab Dashboard',        icon: '🏠' },
    { id: 'lab_samples',  label: 'Samples Received',     icon: '🧪', badge: 8 },
    { id: 'lab_results',  label: 'Result Update',        icon: '📋', badge: 4 },
    { id: 'lab_reports',  label: 'Report Generation',    icon: '📄', badge: 3 },
    { id: 'lab_invoice',  label: 'Invoice Generation',   icon: '💰', badge: 2 },
    { id: 'reports',      label: 'Reports',              icon: '📊' },
  ],
  RD: [
    { id: 'review',  label: 'Review Queue',  icon: '⚖️', badge: 2 },
    { id: 'reports', label: 'Port Reports',  icon: '📊' },
  ],
  CEO: [
    { id: 'review',  label: '2nd Appeal Queue',      icon: '🏛️', badge: 1 },
    { id: 'reports', label: 'Performance Dashboard', icon: '📊' },
  ],
  ADMIN: [
    { id: 'admin_users',     label: 'User Management',  icon: '👥' },
    { id: 'admin_masters',   label: 'Master Management',icon: '⚙️' },
    { id: 'admin_circulars', label: 'Circulars & CMS',  icon: '📰' },
  ],
};

// ─── Atoms ─────────────────────────────────────────────────────────────────────
function Badge({ color = 'gray', children }) {
  const c = {
    green: 'bg-green-100 text-green-800', red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800', blue: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-600', orange: 'bg-orange-100 text-orange-800',
    purple: 'bg-purple-100 text-purple-800', indigo: 'bg-indigo-100 text-indigo-800',
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${c[color] || c.gray}`}>{children}</span>;
}

const STAGE_MAP = {
  scrutiny: { color: 'blue', label: 'Scrutiny' },
  payment: { color: 'yellow', label: 'Payment' },
  visual_inspection: { color: 'orange', label: 'Visual Inspection' },
  lab_testing: { color: 'purple', label: 'Lab Testing' },
  noc_pending: { color: 'indigo', label: 'NOC Pending' },
  completed_noc: { color: 'green', label: 'NOC Issued' },
  completed_ncc: { color: 'red', label: 'NCC Issued' },
  rejected: { color: 'red', label: 'Rejected' },
};
function StageBadge({ stage }) {
  const s = STAGE_MAP[stage] || { color: 'gray', label: stage };
  return <Badge color={s.color}>{s.label}</Badge>;
}

function Field({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide leading-none mb-0.5">{label}</dt>
      <dd className="text-sm text-gray-900 font-medium">{value ?? '—'}</dd>
    </div>
  );
}

function Card({ title, children, className = '', action }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {title && (
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

function Btn({ children, onClick, color = 'blue', size = 'sm', disabled = false, outline = false, full = false }) {
  const sz = { xs: 'px-2.5 py-1.5 text-xs', sm: 'px-3 py-2 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-5 py-2.5 text-base' };
  const solid = { blue: 'bg-blue-600 hover:bg-blue-700 text-white', green: 'bg-green-600 hover:bg-green-700 text-white', red: 'bg-red-600 hover:bg-red-700 text-white', yellow: 'bg-yellow-500 hover:bg-yellow-600 text-white', orange: 'bg-orange-500 hover:bg-orange-600 text-white', gray: 'bg-gray-100 hover:bg-gray-200 text-gray-700', indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white', purple: 'bg-purple-600 hover:bg-purple-700 text-white' };
  const outln = { blue: 'border border-blue-500 text-blue-600 hover:bg-blue-50', red: 'border border-red-500 text-red-600 hover:bg-red-50', green: 'border border-green-500 text-green-600 hover:bg-green-50', gray: 'border border-gray-300 text-gray-600 hover:bg-gray-50', yellow: 'border border-yellow-500 text-yellow-600 hover:bg-yellow-50' };
  const style = outline ? (outln[color] || outln.gray) : (solid[color] || solid.blue);
  return (
    <button onClick={onClick} disabled={disabled}
      className={`inline-flex items-center font-medium rounded transition-colors focus:outline-none ${sz[size]} ${style} ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} ${full ? 'w-full justify-center' : ''}`}>
      {children}
    </button>
  );
}

function Modal({ title, children, onClose, size = 'md' }) {
  const w = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className={`bg-white rounded-xl shadow-2xl w-full ${w[size]} max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">&times;</button>
        </div>
        <div className="px-6 py-4 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function InfoBox({ type = 'info', children }) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warn: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    danger: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800',
  };
  const icons = { info: 'ℹ️', warn: '⚠️', danger: '❌', success: '✅' };
  return <div className={`p-3 border rounded-lg text-xs flex gap-2 ${styles[type]}`}><span>{icons[type]}</span><div>{children}</div></div>;
}

// ─── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ active, go, currentUser, onLogout }) {
  const nav = ROLE_NAV[currentUser?.role] ?? ROLE_NAV.AO;
  const roleColor = { AO: 'text-green-400', INS: 'text-blue-400', IMP: 'text-yellow-400', CHA: 'text-orange-400', LABS: 'text-teal-400', RD: 'text-purple-400', CEO: 'text-red-400', ADMIN: 'text-gray-400' };
  return (
    <aside className="w-52 bg-gray-900 text-white flex flex-col flex-shrink-0 h-full">
      <div className="px-4 py-3.5 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-xs font-bold">F</div>
          <div>
            <div className="text-xs font-bold">FICS Portal</div>
            {/* <div className="text-xs text-gray-400">FSSAI v3.0</div> */}
          </div>
        </div>
      </div>
      <div className="px-3 py-2 border-b border-gray-700 text-xs">
        <div className={`font-semibold ${roleColor[currentUser?.role] ?? 'text-green-400'}`}>{currentUser?.role} — {currentUser?.name}</div>
        <div className="text-gray-400 text-[10px] mt-0.5 leading-tight">{currentUser?.org}</div>
      </div>
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {nav.map(n => (
          <button key={n.id} onClick={() => go(n.id)}
            className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded text-xs font-medium transition-colors ${active === n.id ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
            <span>{n.icon}</span>
            <span className="flex-1">{n.label}</span>
            {n.badge && <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">{n.badge}</span>}
          </button>
        ))}
      </nav>
      <button onClick={onLogout} className="mx-3 mb-2 mt-1 flex items-center gap-2 px-3 py-2 rounded text-xs font-medium text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
        <span>🚪</span><span>Logout</span>
      </button>
      <div className="px-3 py-2 border-t border-gray-700 text-xs text-gray-500"></div>
    </aside>
  );
}

function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div><h1 className="text-lg font-bold text-gray-900">{title}</h1>{subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}</div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

// ─── Shared stat-table helper (mirrors ASPX fieldset+table layout) ────────────
function StatTable({ rows, go }) {
  return (
    <table className="w-full text-xs border-collapse">
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="border border-gray-300">
            <td className={`px-2 py-1.5 font-semibold border-r border-gray-300 w-4/5 ${r.red ? 'text-red-700' : 'text-gray-800'}`}>{r.label}</td>
            <td
              className={`px-2 py-1.5 text-center font-bold text-sm w-1/5 ${go && r.screen ? 'text-blue-700 underline cursor-pointer hover:bg-blue-50' : 'text-blue-700'}`}
              onClick={go && r.screen ? () => go(r.screen) : undefined}
              title={go && r.screen ? `Click to view ${r.label}` : undefined}
            >{r.val ?? '00'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Fieldset({ legend, children }) {
  return (
    <fieldset className="border border-gray-400 rounded p-0 mb-3">
      <legend className="px-2 text-xs font-bold text-gray-700 ml-2">{legend}</legend>
      <div className="p-1">{children}</div>
    </fieldset>
  );
}

// ─── AO Dashboard (matches AO/MyHome.aspx — 6 fieldsets in 3 rows × 2 cols) ──
function AODashboard({ go }) {
  return (
    <div>
      <PageHeader title="Authorized Officer — Dashboard" subtitle="FICS Processing — JNPT Mumbai" actions={
        <div className="flex gap-2">
          <Btn size="xs" color="blue" outline onClick={() => go('bin')}>Application Bin</Btn>
          <Btn size="xs" color="gray" outline onClick={() => go('reports')}>Reports</Btn>
        </div>
      }/>
      <div className="grid grid-cols-2 gap-0 text-xs">
        {/* Row 1 */}
        <Fieldset legend="Scrutiny and Payment(s)">
          <StatTable go={go} rows={[
            { label: 'Total New Application(s)',                           val: 12, screen: 'scrutiny' },
            { label: "Application(s) Sent for Clarification",             val: 4,  screen: 'scrutiny' },
            { label: "Application(s) Clarified by User",                  val: 3,  screen: 'scrutiny' },
            { label: "Application(s) waiting for Payment",                val: 5,  screen: 'payment'  },
            { label: "Application(s) Rejected in Scrutiny",               val: 2,  screen: 'bin'      },
            { label: "Application(s) Assigned to TO",                     val: 8,  screen: 'scrutiny' },
            { label: "Application(s) Assigned to TO [Log Details]",       val: 8,  screen: 'scrutiny' },
            { label: "Application(s) Pending For Scrutiny Check",         val: 6,  screen: 'scrutiny' },
            { label: "Application(s) Pending For BOE Detail(s) Scrutiny", val: 2,  screen: 'bin', red: true },
          ]} />
        </Fieldset>
        <Fieldset legend="Appointment(s) and Visual Inspection">
          <StatTable go={go} rows={[
            { label: 'Application(s) Waiting for Assign Inspector',                     val: 9,  screen: 'vi' },
            { label: 'Total No. of Pending Appointment(s)',                              val: 7,  screen: 'vi' },
            { label: 'Appointment(s) Waiting for User Acknowledgement',                 val: 4,  screen: 'vi' },
            { label: 'Rejected Sample Appointment(s) Waiting for User Acknowledgement', val: 1,  screen: 'vi' },
            { label: 'Appointment Change Request(s) by Applicants',                     val: 2,  screen: 'vi' },
            { label: 'Rejected Sample Appointment Change Request(s) by Applicants',     val: 0,  screen: 'vi' },
            { label: 'Appointment Change Request(s) by Inspectors',                     val: 1,  screen: 'vi' },
            { label: 'Rejected Sample Appointment Change Request(s) by Inspectors',     val: 0,  screen: 'vi' },
            { label: 'Application(s) for which discrepancies Reported by Inspectors',   val: 3,  screen: 'vi' },
          ]} />
        </Fieldset>
        {/* Row 2 */}
        <Fieldset legend="Sampling & Sample Submission to Lab">
          <StatTable go={go} rows={[
            { label: 'Sample(s) to be Forwarded to Lab',     val: 6,  screen: 'lab' },
            { label: 'Sample(s) Forwarded to Lab',           val: 14, screen: 'lab' },
            { label: 'Sample(s) Acknowledged by Lab',        val: 11, screen: 'lab' },
            { label: 'Sample(s) not Fit For Analysis',       val: 1,  screen: 'lab' },
            { label: 'Application(s) Waiting for Sampling',  val: 5,  screen: 'vi'  },
          ]} />
        </Fieldset>
        <Fieldset legend="Lab Analysis & NOC/NCC Generation">
          <StatTable go={go} rows={[
            { label: 'Application(s) for Discrepancy Verification',                    val: 3, screen: 'vi'  },
            { label: 'Application(s) for Which Discrepancies were Fixed by Applicants', val: 2, screen: 'vi' },
            { label: 'NOC Rejection Recommendation by Inspectors',                     val: 1, screen: 'noc' },
            { label: 'Application(s) for Issuance of NOC',                             val: 4, screen: 'noc' },
            { label: 'Application(s) Assigned TO for NOC',                             val: 3, screen: 'noc' },
            { label: 'Sample(s) Recommended for NOC by TO',                            val: 5, screen: 'noc' },
          ]} />
        </Fieldset>
        {/* Row 3 */}
        <Fieldset legend="CHA Registration(s)">
          <StatTable go={go} rows={[
            { label: 'New CHA Registration Application(s)',               val: 2, screen: 'admin_users' },
            { label: 'Approved/Rejected CHA Registration Application(s)', val: 5, screen: 'admin_users' },
            { label: 'Rejected CHA Registration Application(s)',          val: 1, screen: 'admin_users' },
            { label: 'Pending CHA Profile Update Request(s)',             val: 3, screen: 'admin_users' },
          ]} />
        </Fieldset>
        <Fieldset legend="Re-Testing">
          <StatTable go={go} rows={[
            { label: 'Number of Re-test Request(s) Received',         val: 3, screen: 'review' },
            { label: 'Re-test Application(s) for which Payment is done', val: 2, screen: 'review' },
            { label: 'Forward Re-test Sample(s) to Lab',              val: 1, screen: 'review' },
            { label: 'Re-test Application(s) for Issuance of NOC',    val: 1, screen: 'review' },
          ]} />
        </Fieldset>
      </div>
      {/* Quick action row */}
      <div className="flex gap-2 mt-2">
        {[
          { label: '🔍 Scrutiny', screen: 'scrutiny', color: 'blue' },
          { label: '💳 Payment Verification', screen: 'payment', color: 'yellow' },
          { label: '👁️ Visual Inspection', screen: 'vi', color: 'orange' },
          { label: '🧪 Lab Results', screen: 'lab', color: 'purple' },
          { label: '📜 NOC Issuance', screen: 'noc', color: 'green' },
          { label: '⚖️ Review & Appeal', screen: 'review', color: 'red' },
        ].map(a => <Btn key={a.screen} size="xs" color={a.color} onClick={() => go(a.screen)}>{a.label}</Btn>)}
      </div>
    </div>
  );
}

// ─── INS Dashboard (matches INS/INSPHome.aspx — Current Statistics) ───────────
function INSDashboard({ go }) {
  const sampleList = [
    { consId: 'FICS/2024/3819', appntDt: '15-Apr-2024', appntTime: '10:00', cfs: 'CFS Nhava Sheva', product: 'Fresh Onions', radSmp: 0, normalSmp: 2 },
    { consId: 'FICS/2024/3818', appntDt: '12-Apr-2024', appntTime: '11:00', cfs: 'Kolkata Port Trust', product: 'Dry Red Chilli', radSmp: 0, normalSmp: 2 },
    { consId: 'FICS/2024/3817', appntDt: '10-Apr-2024', appntTime: '09:00', cfs: 'CFS Nhava Sheva', product: 'Wheat (Durum)', radSmp: 0, normalSmp: 1 },
  ];
  return (
    <div>
      <PageHeader title="Inspector / Technical Officer — Dashboard" subtitle="FICS — Current Work Queue" />
      <Fieldset legend="CURRENT STATISTICS">
        <StatTable go={go} rows={[
          { label: 'New Inspection Assignments',                         val: 9,  screen: 'vi'       },
          { label: 'Pending For Sampling',                               val: 7,  screen: 'vi'       },
          { label: 'Rejected Sample Pending For Sampling',               val: 1,  screen: 'vi'       },
          { label: 'Rejected Sample Pending For Clarification',          val: 2,  screen: 'scrutiny' },
          { label: 'Samples to be forwarded to LAB',                     val: 6,  screen: 'lab'      },
          { label: 'Discrepancy Verification Appointments',              val: 3,  screen: 'vi'       },
          { label: 'Application(s) for Scrutiny',                        val: 5,  screen: 'scrutiny' },
          { label: 'Sample(s) Pending For NOC Approval From AO',         val: 4,  screen: 'noc'      },
          { label: 'Sample(s) Pending For Issuance of NOC',              val: 3,  screen: 'noc'      },
          { label: 'Application(s) Assigned for Scrutiny [Log Details]', val: 5,  screen: 'scrutiny' },
          { label: 'Inspected Application(s)',                           val: 12, screen: 'bin'      },
          { label: 'Samples forwarded to LAB',                           val: 14, screen: 'lab'      },
        ]} />
      </Fieldset>
      <Fieldset legend="List of Application(s) — Forwarded By Authorized Officer">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {['Sr', 'Consignment ID', 'Appt Date', 'Appt Time', 'CFS Location', 'Product', 'Rad Samples', 'Normal Samples'].map(h => (
                  <th key={h} className="border border-gray-300 px-2 py-1.5 text-center font-bold text-gray-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleList.map((r, i) => (
                <tr key={r.consId} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-300 px-2 py-1.5 text-center">{i + 1}</td>
                  <td className="border border-gray-300 px-2 py-1.5 text-blue-700 font-semibold cursor-pointer hover:underline">{r.consId}</td>
                  <td className="border border-gray-300 px-2 py-1.5 text-center">{r.appntDt}</td>
                  <td className="border border-gray-300 px-2 py-1.5 text-center">{r.appntTime}</td>
                  <td className="border border-gray-300 px-2 py-1.5">{r.cfs}</td>
                  <td className="border border-gray-300 px-2 py-1.5">{r.product}</td>
                  <td className="border border-gray-300 px-2 py-1.5 text-center">{r.radSmp}</td>
                  <td className="border border-gray-300 px-2 py-1.5 text-center">{r.normalSmp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Fieldset>
      <div className="flex gap-2 mt-2">
        {[
          { label: '🔍 Scrutiny', screen: 'scrutiny', color: 'blue' },
          { label: '👁️ Visual Inspection', screen: 'vi', color: 'orange' },
          { label: '🧪 Lab Results', screen: 'lab', color: 'purple' },
          { label: '📊 Reports', screen: 'reports', color: 'gray' },
        ].map(a => <Btn key={a.screen} size="xs" color={a.color} onClick={() => go(a.screen)}>{a.label}</Btn>)}
      </div>
    </div>
  );
}

// ─── CHA Dashboard (matches CHA/ChaHome.aspx — 2-col stats + 2 grids) ─────────
function CHADashboard({ go }) {
  const activeApps = [
    { cid: 'FICS/2024/3821', country: '🇺🇸', importer: 'Global Foods Pvt Ltd', product: 'Wheat Flour', scrutiny: 'Pending', payment: 'Pending', appt: '—', lab: '—', boe: '—' },
    { cid: 'FICS/2024/3820', country: '🇨🇳', importer: 'Tasty Imports Pvt Ltd', product: 'Dried Chillies', scrutiny: 'Accepted', payment: 'Pending Verification', appt: '—', lab: '—', boe: 'PADS' },
    { cid: 'FICS/2024/3819', country: '🇳🇱', importer: 'Heritage Foods Ltd', product: 'Fresh Onions', scrutiny: 'Accepted', payment: 'Success', appt: '15-Apr-2024 10:00', lab: '—', boe: '—' },
  ];
  const recentNOCs = [
    { appId: 'FICS/2024/3817', boe: '4234563', product: 'Wheat (Durum) [10019900]', insOff: 'TO - Rajan Kumar', status: 'NOC Issued' },
    { appId: 'FICS/2024/3815', boe: '4234561', product: 'Sunflower Oil [15121110]', insOff: 'TO - Priya Sharma', status: 'NOC Issued' },
  ];
  return (
    <div>
      <PageHeader title="Customs House Agent — Dashboard" subtitle="FICS — Client Application Status" />
      <Fieldset legend="CURRENT STATISTICS">
        <div className="grid grid-cols-2 gap-0">
          <div>
            <StatTable rows={[
              { label: 'Total No. of New Application(s)',                            val: 5 },
              { label: 'Total No. of Application(s) Waiting for Payment',           val: 2 },
              { label: 'Total No. of Application(s) Waiting for Clarification',     val: 3 },
              { label: 'Total No. of Appointment(s) to be Acknowledged',            val: 2 },
              { label: 'Total No. of Re-Appointment(s) to be Acknowledged for sample(s) Rejected in Visual Inspection', val: 0 },
              { label: 'Total No. of Application(s) For BoE Update (PADS)',         val: 1, red: true },
            ]} />
          </div>
          <div>
            <StatTable rows={[
              { label: 'Total No. of Appointment Change Request(s) Sent',              val: 1 },
              { label: 'Total No. of Application(s) With Rectifiable Discrepancies',  val: 2 },
              { label: 'Total No. of Application(s) - For Payment (Re-Test Cases)',   val: 0 },
              { label: 'Total No. of Inactive Application(s)',                         val: 3 },
              { label: 'Total No. Appointment(s) For BoE Clarification (PADS)',       val: 1, red: true },
            ]} />
          </div>
        </div>
      </Fieldset>
      <Fieldset legend="ACTIVE NOC APPLICATIONS">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {['Sr', 'Application ID', 'Country', 'Importer', 'Product(s)', 'Scrutiny', 'Payment', 'Appt Given', 'Lab Submit', 'BoE Status', 'Action'].map(h => (
                  <th key={h} className="border border-gray-300 px-2 py-1.5 text-center font-bold text-gray-700 text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeApps.map((r, i) => (
                <tr key={r.cid} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-300 px-1 py-1.5 text-center">{i + 1}</td>
                  <td className="border border-gray-300 px-1 py-1.5 text-blue-700 font-semibold cursor-pointer hover:underline">{r.cid}</td>
                  <td className="border border-gray-300 px-1 py-1.5 text-center text-lg">{r.country}</td>
                  <td className="border border-gray-300 px-1 py-1.5 text-[10px]">{r.importer}</td>
                  <td className="border border-gray-300 px-1 py-1.5 text-[10px]">{r.product}</td>
                  <td className="border border-gray-300 px-1 py-1.5 text-center"><Badge color={r.scrutiny === 'Accepted' ? 'green' : 'yellow'}>{r.scrutiny}</Badge></td>
                  <td className="border border-gray-300 px-1 py-1.5 text-center"><Badge color={r.payment === 'Success' ? 'green' : 'yellow'}>{r.payment}</Badge></td>
                  <td className="border border-gray-300 px-1 py-1.5 text-[10px]">{r.appt}</td>
                  <td className="border border-gray-300 px-1 py-1.5 text-center">—</td>
                  <td className="border border-gray-300 px-1 py-1.5 text-center">{r.boe || '—'}</td>
                  <td className="border border-gray-300 px-1 py-1.5 text-center"><Btn size="xs" color="blue" outline onClick={() => go('imp_apps')}>View</Btn></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Fieldset>
      <Fieldset legend="RECENT ISSUED NOC(s)">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {['Sr', 'Application ID', 'Bill of Entry', 'Item Desc [HS Code]', 'Inspection Officer', 'Action'].map(h => (
                <th key={h} className="border border-gray-300 px-2 py-1.5 text-center font-bold text-gray-700 text-[10px]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentNOCs.map((r, i) => (
              <tr key={r.appId} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 px-2 py-1.5 text-center">{i + 1}</td>
                <td className="border border-gray-300 px-2 py-1.5 text-blue-700 font-semibold">{r.appId}</td>
                <td className="border border-gray-300 px-2 py-1.5 text-center">{r.boe}</td>
                <td className="border border-gray-300 px-2 py-1.5">{r.product}</td>
                <td className="border border-gray-300 px-2 py-1.5">{r.insOff}</td>
                <td className="border border-gray-300 px-2 py-1.5 text-center"><Btn size="xs" color="green" outline>View NOC</Btn></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Fieldset>
    </div>
  );
}

// ─── IMP Dashboard (matches Importer/Imp_Home.aspx) ───────────────────────────
function IMPDashboard({ go }) {
  const activeApps = [
    { cid: 'FICS/2024/3821', country: '🇺🇸', product: 'Wheat Flour Preparations', scrutiny: 'Pending', payment: 'Pending', appt: '—', lab: '—', boe: '—' },
    { cid: 'FICS/2024/3820', country: '🇨🇳', product: 'Dried Chillies', scrutiny: 'Accepted', payment: 'Pending Verification', appt: '—', lab: '—', boe: 'PADS' },
  ];
  const recentNOCs = [
    { appId: 'FICS/2024/3817', boe: '4234563', product: 'Wheat (Durum) [10019900]', insOff: 'TO - Rajan Kumar' },
    { appId: 'FICS/2024/3815', boe: '4234561', product: 'Sunflower Oil [15121110]', insOff: 'TO - Priya Sharma' },
  ];
  return (
    <div>
      <PageHeader title="Importer — Dashboard" subtitle="FICS — My Application Status" />
      <Fieldset legend="CURRENT STATISTICS">
        <StatTable rows={[
          { label: 'Total New Application(s)',                        val: 3 },
          { label: 'Application(s) Waiting for Payment',             val: 1 },
          { label: 'Application(s) Waiting for Clarification',       val: 2 },
          { label: 'Total Acknowledge Appointment',                   val: 1 },
          { label: 'Total New Acknowledge change Request',            val: 0 },
          { label: 'Total No. of Re-Appointment(s) to be Acknowledged for sample(s) Rejected in Visual Inspection', val: 0 },
          { label: 'Total No. of Application(s) For BoE Update (PADS)', val: 1, red: true },
          { label: 'Total No. Appointment(s) For BoE Clarification (PADS)', val: 0, red: true },
        ]} />
      </Fieldset>
      <Fieldset legend="ACTIVE NOC APPLICATIONS">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {['Sr', 'Application ID', 'Country', 'Product(s)', 'Scrutiny', 'Payment', 'Appt Given', 'Lab Submit', 'BoE Status', 'Action'].map(h => (
                <th key={h} className="border border-gray-300 px-2 py-1.5 text-center font-bold text-gray-700 text-[10px]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeApps.map((r, i) => (
              <tr key={r.cid} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 px-1 py-1.5 text-center">{i + 1}</td>
                <td className="border border-gray-300 px-1 py-1.5 text-blue-700 font-semibold cursor-pointer hover:underline" onClick={() => go('imp_apps')}>{r.cid}</td>
                <td className="border border-gray-300 px-1 py-1.5 text-center text-base">{r.country}</td>
                <td className="border border-gray-300 px-1 py-1.5 text-[10px]">{r.product}</td>
                <td className="border border-gray-300 px-1 py-1.5 text-center"><Badge color={r.scrutiny === 'Accepted' ? 'green' : 'yellow'}>{r.scrutiny}</Badge></td>
                <td className="border border-gray-300 px-1 py-1.5 text-center"><Badge color={r.payment === 'Success' ? 'green' : 'yellow'}>{r.payment}</Badge></td>
                <td className="border border-gray-300 px-1 py-1.5">{r.appt}</td>
                <td className="border border-gray-300 px-1 py-1.5 text-center">—</td>
                <td className="border border-gray-300 px-1 py-1.5 text-center">{r.boe || '—'}</td>
                <td className="border border-gray-300 px-1 py-1.5 text-center"><Btn size="xs" color="blue" outline onClick={() => go('imp_apps')}>View</Btn></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Fieldset>
      <Fieldset legend="RECENT NOCs">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {['Sr', 'Application ID', 'Bill of Entry', 'Item Desc [HS Code]', 'Inspection Officer', 'Action'].map(h => (
                <th key={h} className="border border-gray-300 px-2 py-1.5 text-center font-bold text-gray-700 text-[10px]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentNOCs.map((r, i) => (
              <tr key={r.appId} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 px-2 py-1.5 text-center">{i + 1}</td>
                <td className="border border-gray-300 px-2 py-1.5 text-blue-700 font-semibold">{r.appId}</td>
                <td className="border border-gray-300 px-2 py-1.5 text-center">{r.boe}</td>
                <td className="border border-gray-300 px-2 py-1.5">{r.product}</td>
                <td className="border border-gray-300 px-2 py-1.5">{r.insOff}</td>
                <td className="border border-gray-300 px-2 py-1.5 text-center"><Btn size="xs" color="green" outline onClick={() => go('imp_noc')}>View NOC</Btn></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Fieldset>
    </div>
  );
}

// ─── LABS Dashboard (matches Labs/LabHomeNew.aspx) ────────────────────────────
function LABSDashboard({ go }) {
  const sampleList = [
    { smpId: 'SMP-2024-003', consId: 'FICS/2024/3818', desc: 'Dry Red Chilli (Crushed)', hs: '09042210', mode: 'Courier', dispDate: '11-Apr-2024' },
    { smpId: 'SMP-2024-004', consId: 'FICS/2024/3818', desc: 'Chilli Powder', hs: '09042220', mode: 'Courier', dispDate: '11-Apr-2024' },
    { smpId: 'SMP-2024-005', consId: 'FICS/2024/3817', desc: 'Wheat (Durum)', hs: '10019900', mode: 'Hand-Delivered', dispDate: '10-Apr-2024' },
    { smpId: 'SMP-2024-006', consId: 'FICS/2024/3816', desc: 'Refined Sunflower Oil', hs: '15121110', mode: 'Courier', dispDate: '09-Apr-2024' },
  ];
  return (
    <div>
      <PageHeader title="Laboratory — Dashboard" subtitle="FSSAI Referral Lab — Sample Processing Queue" />
      <Fieldset legend="CURRENT STATISTICS">
        <StatTable rows={[
          { label: 'Sample(s) Received for Analysis',            val: 8 },
          { label: 'Sample(s) for Analysis Result Update',       val: 4 },
          { label: 'Sample(s) for Analysis Report Generation',   val: 3 },
          { label: 'Sample(s) Not Fit for Analysis',             val: 1 },
          { label: 'Analysed Sample(s) for Invoice Generation',  val: 2 },
          { label: '(Re-Test) Sample(s) Received for Analysis',  val: 1 },
          { label: '(Re-Test) Sample(s) for Analysis Result Update', val: 0 },
        ]} />
      </Fieldset>
      <Fieldset legend="List of Sample(s) Forwarded By Authorized Officers">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {['Sr', 'Sample ID', 'Description', 'HS Code', 'Sample Dispatch Mode', 'Sample Dispatch Date'].map(h => (
                <th key={h} className="border border-gray-300 px-2 py-1.5 text-center font-bold text-gray-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sampleList.map((r, i) => (
              <tr key={r.smpId} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 px-2 py-1.5 text-center">{i + 1}</td>
                <td className="border border-gray-300 px-2 py-1.5 font-mono text-blue-700 font-semibold">{r.smpId}</td>
                <td className="border border-gray-300 px-2 py-1.5">{r.desc}</td>
                <td className="border border-gray-300 px-2 py-1.5 font-mono">{r.hs}</td>
                <td className="border border-gray-300 px-2 py-1.5 text-center">{r.mode}</td>
                <td className="border border-gray-300 px-2 py-1.5 text-center">{r.dispDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Fieldset>
    </div>
  );
}

// ─── ADMIN Dashboard ──────────────────────────────────────────────────────────
function ADMINDashboard({ go }) {
  return (
    <div>
      <PageHeader title="System Administrator — Dashboard" subtitle="FICS Administration Panel" actions={
        <Btn size="xs" color="blue" onClick={() => go('admin_users')}>User Management</Btn>
      }/>
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Total Users', val: 142, icon: '👥', color: 'bg-blue-500' },
          { label: 'Active Officers', val: 38, icon: '👨‍⚖️', color: 'bg-green-500' },
          { label: 'Registered Importers', val: 67, icon: '🏭', color: 'bg-yellow-500' },
          { label: 'Registered CHAs', val: 29, icon: '📦', color: 'bg-orange-500' },
          { label: 'Registered Labs', val: 8, icon: '🧪', color: 'bg-purple-500' },
          { label: 'Active Ports', val: 12, icon: '🚢', color: 'bg-indigo-500' },
          { label: 'Pending User Requests', val: 5, icon: '📋', color: 'bg-red-500' },
          { label: 'System Alerts', val: 2, icon: '⚠️', color: 'bg-gray-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-lg">{s.icon}</span>
              <span className={`text-white text-xs font-bold px-2 py-0.5 rounded-full ${s.color}`}>{s.val}</span>
            </div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'User Management', icon: '👥', desc: 'Create, edit, deactivate officer and stakeholder accounts', screen: 'admin_users', color: 'blue' },
          { label: 'Master Management', icon: '⚙️', desc: 'HS codes, ports, labs, product categories, fee masters', screen: 'admin_masters', color: 'indigo' },
          { label: 'Circulars & CMS', icon: '📰', desc: 'Publish notices, circulars, advisories on portal', screen: 'admin_circulars', color: 'green' },
        ].map(m => (
          <Card key={m.label}>
            <div className="flex items-start gap-3 cursor-pointer" onClick={() => go(m.screen)}>
              <div className={`w-10 h-10 rounded-lg bg-${m.color}-100 flex items-center justify-center text-xl flex-shrink-0`}>{m.icon}</div>
              <div>
                <div className="font-semibold text-sm text-gray-900 mb-0.5">{m.label}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{m.desc}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Screen 1: Dashboard (role-aware router) ───────────────────────────────────
function Dashboard({ go, currentUser }) {
  const role = currentUser?.role ?? 'AO';
  if (role === 'AO')    return <AODashboard go={go} />;
  if (role === 'INS')   return <INSDashboard go={go} />;
  if (role === 'CHA')   return <CHADashboard go={go} />;
  if (role === 'IMP')   return <IMPDashboard go={go} />;
  if (role === 'LABS')  return <LABSDashboard go={go} />;
  if (role === 'ADMIN') return <ADMINDashboard go={go} />;
  return <AODashboard go={go} />;
}

// ─── Screen 2: Application Bin ─────────────────────────────────────────────────
function ApplicationBin({ go, selectedId }) {
  const [tab, setTab] = useState('all');
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'scrutiny', label: 'Scrutiny' },
    { id: 'payment', label: 'Payment' },
    { id: 'visual_inspection', label: 'Visual Inspection' },
    { id: 'lab_testing', label: 'Lab Testing' },
    { id: 'noc_pending', label: 'NOC Pending' },
  ];
  const list = tab === 'all' ? APPS : APPS.filter(a => a.stage === tab);
  const actionMap = {
    scrutiny: { label: 'Scrutiny Action', screen: 'scrutiny', color: 'blue' },
    payment: { label: 'Verify Payment', screen: 'payment', color: 'yellow' },
    visual_inspection: { label: 'VI Action', screen: 'vi', color: 'orange' },
    lab_testing: { label: 'Lab Review', screen: 'lab', color: 'purple' },
    noc_pending: { label: 'Issue NOC', screen: 'noc', color: 'indigo' },
  };
  return (
    <div>
      <PageHeader title="Application Bin" subtitle="All FICS applications — full processing queue" />
      <div className="flex border-b border-gray-200 mb-4">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${tab === t.id ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>
      <Card>
        <table className="w-full text-xs">
          <thead><tr className="bg-gray-50 border-b text-gray-500">
            {['App ID / ARN', 'Importer / IEC', 'Type', 'Source', 'Port', 'Assigned TO', 'Stage', 'Action'].map(h => (
              <th key={h} className="text-left px-3 py-2">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {list.map(a => {
              const act = actionMap[a.stage];
              return (
                <tr key={a.id} className={`border-b border-gray-100 hover:bg-blue-50/30 ${selectedId === a.id ? 'bg-blue-50' : ''}`}>
                  <td className="px-3 py-2.5">
                    <div className="font-mono text-blue-600 font-semibold">{a.id}</div>
                    <div className="text-gray-400">{a.arn}</div>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="font-medium text-gray-900">{a.importer}</div>
                    <div className="text-gray-400">IEC: {a.iec}</div>
                  </td>
                  <td className="px-3 py-2.5">{a.importType}</td>
                  <td className="px-3 py-2.5"><Badge color={a.source === 'SWIFT' ? 'indigo' : 'gray'}>{a.source}</Badge></td>
                  <td className="px-3 py-2.5">{a.port}</td>
                  <td className="px-3 py-2.5">{a.assignedTO ?? <span className="text-gray-400 italic">Unassigned</span>}</td>
                  <td className="px-3 py-2.5"><StageBadge stage={a.stage} /></td>
                  <td className="px-3 py-2.5">
                    {act && <Btn size="xs" color={act.color} onClick={() => go(act.screen, a.id)}>{act.label}</Btn>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── Screen 3: Scrutiny ────────────────────────────────────────────────────────
function ScrutinyScreen({ go, selectedId }) {
  const pending = APPS.filter(a => a.stage === 'scrutiny');
  const [sel, setSel] = useState(selectedId ? APPS.find(a => a.id === selectedId) : pending[0]);
  const [decision, setDecision] = useState(null);
  const [itemDecisions, setItemDecisions] = useState({});
  const [assignTO, setAssignTO] = useState('');
  const [fips, setFips] = useState(false);
  const [clarText, setClarText] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [modal, setModal] = useState(null);

  const DECISIONS = [
    { id: 'ACCEPT', label: 'Accept', color: 'green', icon: '✅', desc: 'Clear for Payment & Visual Inspection' },
    { id: 'REJECT', label: 'Reject', color: 'red', icon: '🚫', desc: 'Application fails — forfeited' },
    { id: 'CLARIFICATION', label: 'Send for Clarification', color: 'yellow', icon: '❓', desc: 'Request info from CHA/Importer' },
    { id: 'NOT_IN_SCOPE', label: 'Not in Scope', color: 'gray', icon: '∅', desc: 'Item not under FSSAI jurisdiction' },
    { id: 'SIMILAR_PRODUCT', label: 'Similar Product', color: 'purple', icon: '≈', desc: 'Same batch — multiple items (SWIFT)' },
  ];

  return (
    <div>
      <PageHeader title="Scrutiny" subtitle="Review applications and take scrutiny decisions per the flow" />
      <div className="grid grid-cols-4 gap-4">
        {/* Queue List */}
        <div className="col-span-1 space-y-2">
          <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Pending Scrutiny ({pending.length})</div>
          {pending.map(a => (
            <div key={a.id} onClick={() => setSel(a)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${sel?.id === a.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'}`}>
              <div className="text-xs font-mono font-semibold text-blue-700">{a.id}</div>
              <div className="text-xs text-gray-600 mt-0.5 truncate">{a.importer}</div>
              <div className="flex gap-1 mt-1.5">
                <Badge color={a.source === 'SWIFT' ? 'indigo' : 'gray'}>{a.source}</Badge>
                <Badge color="gray">{a.importType}</Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Detail + Actions */}
        {sel && (
          <div className="col-span-3 space-y-4">
            {/* App Summary */}
            <Card title={`Application — ${sel.id}`}>
              <div className="grid grid-cols-4 gap-3">
                <Field label="ARN" value={sel.arn} />
                <Field label="BE Number" value={sel.be} />
                <Field label="BE Date" value={sel.beDate} />
                <Field label="Import Type" value={sel.importType} />
                <Field label="Importer" value={sel.importer} />
                <Field label="IEC Code" value={sel.iec} />
                <Field label="CHA" value={sel.cha} />
                <Field label="Port" value={sel.port} />
              </div>
            </Card>

            {/* Items */}
            <Card title="Consignment Items — Item-wise Scrutiny Decision"
              action={
                <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                  <input type="checkbox" checked={fips} onChange={e => setFips(e.target.checked)} className="rounded" />
                  <span className="font-medium text-orange-700">FIPS — No Inspection Required</span>
                </label>
              }>
              {fips && <InfoBox type="warn" className="mb-3">FIPS flag set: On Acceptance, AO will directly generate NOC without Visual Inspection or Lab Testing.</InfoBox>}
              <table className="w-full text-xs">
                <thead><tr className="bg-gray-50 border-b text-gray-500">
                  {['#', 'HS Code', 'Product Description', 'Qty / Value', 'Country', 'Mfg Date', 'Exp Date', 'Item Decision'].map(h => (
                    <th key={h} className="text-left px-3 py-2">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {sel.items.map(item => (
                    <tr key={item.sno} className="border-b border-gray-100">
                      <td className="px-3 py-2.5">{item.sno}</td>
                      <td className="px-3 py-2.5 font-mono text-blue-700">{item.hsCode}</td>
                      <td className="px-3 py-2.5 font-medium">{item.product}</td>
                      <td className="px-3 py-2.5">{item.qty}<br /><span className="text-gray-400">{item.value}</span></td>
                      <td className="px-3 py-2.5">{item.country}</td>
                      <td className="px-3 py-2.5">{item.mfgDate}</td>
                      <td className="px-3 py-2.5">{item.expDate}</td>
                      <td className="px-3 py-2.5">
                        <select value={itemDecisions[item.sno] || ''} onChange={e => setItemDecisions(p => ({ ...p, [item.sno]: e.target.value }))}
                          className="text-xs border border-gray-300 rounded px-2 py-1">
                          <option value="">-- Select --</option>
                          <option value="ACCEPT">Accept</option>
                          <option value="REJECT">Reject</option>
                          <option value="NOT_IN_SCOPE">Not in Scope</option>
                          <option value="SIMILAR">Similar Product</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            {/* Documents */}
            <Card title="Submitted Documents">
              <div className="flex flex-wrap gap-2">
                {sel.documents.map(d => (
                  <span key={d} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200 cursor-pointer hover:bg-blue-100">
                    📄 {d} <span className="text-blue-400">↗</span>
                  </span>
                ))}
              </div>
            </Card>

            {/* Clarification History */}
            <Card title="Query / Clarification History">
              {sel.clarifications.length === 0
                ? <p className="text-xs text-gray-400 italic">No clarifications raised for this application.</p>
                : sel.clarifications.map((c, i) => (
                  <div key={i} className="text-xs border rounded p-2.5 mb-2 bg-yellow-50">
                    <div className="font-medium text-yellow-800">Query #{i + 1}: {c.query}</div>
                    <div className="text-gray-500 mt-1">Response: {c.response || <em>Awaiting response from CHA/Importer</em>}</div>
                  </div>
                ))
              }
            </Card>

            {/* Scrutiny Decision Panel */}
            <Card title="Scrutiny Decision — Select Overall Application Outcome">
              <div className="grid grid-cols-5 gap-2 mb-4">
                {DECISIONS.map(d => (
                  <div key={d.id} onClick={() => setDecision(d.id)}
                    className={`p-3 border-2 rounded-lg cursor-pointer text-center transition-all ${decision === d.id ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-gray-400 bg-white'}`}>
                    <div className="text-xl mb-1">{d.icon}</div>
                    <div className="text-xs font-semibold text-gray-800 leading-tight">{d.label}</div>
                    <div className="text-[10px] text-gray-400 mt-1 leading-tight">{d.desc}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 justify-end">
                <Btn color="gray" outline>Save Draft</Btn>
                <Btn color="yellow" outline onClick={() => setModal('CLARIFICATION')}>Raise Query to CHA</Btn>
                <Btn color="green" disabled={!decision} onClick={() => setModal('CONFIRM')}>Submit Scrutiny Decision</Btn>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Clarification Modal */}
      {modal === 'CLARIFICATION' && (
        <Modal title="Send for Clarification — Query to CHA/Importer" onClose={() => setModal(null)}>
          <InfoBox type="info">The application will be sent back to CHA/Importer. They must fill in missing details and re-submit. The re-filled application goes back to AO and scrutiny recommences.</InfoBox>
          <div className="mt-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">Clarification Required *</label>
            <textarea rows={4} value={clarText} onChange={e => setClarText(e.target.value)}
              placeholder="Describe missing information or details required from CHA/Importer..."
              className="w-full text-sm border border-gray-300 rounded px-3 py-2" />
          </div>
          <div className="flex gap-2 mt-4 justify-end">
            <Btn color="gray" outline onClick={() => setModal(null)}>Cancel</Btn>
            <Btn color="yellow">Send to CHA/Importer</Btn>
          </div>
        </Modal>
      )}

      {/* Reject Modal */}
      {modal === 'REJECT' && (
        <Modal title="Reject Application" onClose={() => setModal(null)}>
          <InfoBox type="danger"><strong>Irreversible action.</strong> Application will be forfeited. Consignment cannot proceed through FICS. For SWIFT applications, NCC/OSC will be sent to ICEGATE via FSSAI API 3.</InfoBox>
          <div className="mt-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">Rejection Reason *</label>
            <textarea rows={3} value={rejectReason} onChange={e => setRejectReason(e.target.value)}
              placeholder="State the reason for rejection (wrong info / non-compliant product / document deficit)..."
              className="w-full text-sm border border-gray-300 rounded px-3 py-2" />
          </div>
          <div className="flex gap-2 mt-4 justify-end">
            <Btn color="gray" outline onClick={() => setModal(null)}>Cancel</Btn>
            <Btn color="red" disabled={!rejectReason}>Confirm Rejection</Btn>
          </div>
        </Modal>
      )}

      {/* Confirm Modal */}
      {modal === 'CONFIRM' && (
        <Modal title="Confirm Scrutiny Decision" onClose={() => setModal(null)}>
          {decision === 'REJECT' ? (
            <div className="mb-3">
              <InfoBox type="danger">You are about to REJECT application <strong>{sel?.id}</strong>. This will forfeit the application.</InfoBox>
              <div className="mt-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">Rejection Reason *</label>
                <textarea rows={3} value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                  placeholder="Rejection reason..." className="w-full text-sm border border-gray-300 rounded px-3 py-2" />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-700">Submitting decision: <strong className="text-blue-700">{decision}</strong> for <strong>{sel?.id}</strong></p>
              {fips && decision === 'ACCEPT' && <InfoBox type="warn">FIPS flag active — NOC will be directly generated by AO without Visual Inspection.</InfoBox>}
              {decision === 'ACCEPT' && !fips && <InfoBox type="success">Application will be sent to importer for Payment. After payment, Visual Inspection will be scheduled.</InfoBox>}
              {decision === 'NOT_IN_SCOPE' && <InfoBox type="info">Application will be marked Not in Scope. For SWIFT, OSC certificate sent to ICEGATE.</InfoBox>}
            </div>
          )}
          <div className="flex gap-2 mt-4 justify-end">
            <Btn color="gray" outline onClick={() => setModal(null)}>Go Back</Btn>
            <Btn color={decision === 'REJECT' ? 'red' : 'green'} disabled={decision === 'REJECT' && !rejectReason}
              onClick={() => setModal(null)}>Confirm & Submit</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Screen 4: Payment Verification ───────────────────────────────────────────
function PaymentVerification({ go, selectedId }) {
  const pending = APPS.filter(a => a.stage === 'payment');
  const [sel, setSel] = useState(selectedId ? APPS.find(a => a.id === selectedId) : pending[0]);
  const [modal, setModal] = useState(false);

  return (
    <div>
      <PageHeader title="Payment Verification" subtitle="Online payments are auto-verified by the system. AO confirms and forwards application for Visual Inspection." />
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1 space-y-2">
          <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Payment Pending ({pending.length})</div>
          {pending.map(a => (
            <div key={a.id} onClick={() => setSel(a)}
              className={`p-3 rounded-lg border cursor-pointer bg-white ${sel?.id === a.id ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:border-yellow-300'}`}>
              <div className="text-xs font-mono font-semibold text-blue-700">{a.id}</div>
              <div className="text-xs text-gray-600 truncate">{a.importer.replace('M/s ', '')}</div>
              <div className="text-xs text-gray-400 mt-1">Mode: {a.payment?.mode ?? 'Online'}</div>
              <div className="text-xs text-gray-400">Txn: {a.payment?.txnId ?? '—'}</div>
            </div>
          ))}

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-xs font-semibold text-blue-800 mb-1.5">Payment Rules</div>
            <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
              <li>Online payment: auto-verified by system</li>
              <li>AO confirms before VI scheduling</li>
              <li>Payment mandatory before VI</li>
              <li>Retest fee: online payment only</li>
            </ul>
          </div>
        </div>

        <div className="col-span-3 space-y-4">
          {sel?.payment && (
            <>
              <Card title="Application & Online Payment Summary">
                <div className="grid grid-cols-4 gap-3 mb-4">
                  <Field label="Application ID" value={sel.id} />
                  <Field label="Importer" value={sel.importer} />
                  <Field label="Port" value={sel.port} />
                  <Field label="CHA" value={sel.cha} />
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-xs font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <span>💳</span> Online Payment Details
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <Field label="Payment Mode" value="Online" />
                    <Field label="Amount" value={sel.payment.amount} />
                    <Field label="Transaction ID" value={sel.payment.txnId ?? '—'} />
                    <Field label="Payment Status" value={sel.payment.status} />
                    <Field label="Payment Gateway" value="SBI ePay / NIC" />
                    <Field label="Payment Date" value="12 Apr 2026" />
                    <Field label="Fee Category" value="Scrutiny Fee" />
                    <Field label="Auto-Verified" value="Yes — System Verified" />
                  </div>
                </div>
              </Card>

              <Card title="AO Confirmation">
                <InfoBox type="success" className="mb-4">
                  Online payment of <strong>{sel.payment.amount}</strong> has been auto-verified by the system via Transaction ID <strong>{sel.payment.txnId ?? 'TXN-XXXXXX'}</strong>. AO confirmation will forward this application for Visual Inspection scheduling.
                </InfoBox>
                <div className="flex gap-2 justify-end">
                  <Btn color="gray" outline>Cancel</Btn>
                  <Btn color="green" onClick={() => setModal(true)}>✅ Confirm & Forward for Visual Inspection</Btn>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>

      {modal && (
        <Modal title="Confirm Payment & Forward for VI" onClose={() => setModal(false)}>
          <p className="text-sm text-gray-700 mb-4">Confirm online payment for application <strong>{sel?.id}</strong> and forward for Visual Inspection?</p>
          <InfoBox type="success">Payment confirmed. Application will proceed to Visual Inspection scheduling.</InfoBox>
          <div className="flex gap-2 mt-4 justify-end">
            <Btn color="gray" outline onClick={() => setModal(false)}>Cancel</Btn>
            <Btn color="green" onClick={() => setModal(false)}>Confirm</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Screen 5: Visual Inspection ──────────────────────────────────────────────
function VisualInspection({ go, selectedId }) {
  const pending = APPS.filter(a => a.stage === 'visual_inspection');
  const [sel, setSel] = useState(selectedId ? APPS.find(a => a.id === selectedId) : pending[0]);
  const [step, setStep] = useState('appointment');
  const [modal, setModal] = useState(null);

  const steps = [
    { id: 'appointment', label: '1. Appointment', icon: '📅' },
    { id: 'sampling', label: '2. Sample ID Gen.', icon: '🧫' },
    { id: 'vi_result', label: '3. VI Result Entry', icon: '🔬' },
    { id: 'discrepancy', label: '4. Discrepancy', icon: '⚠️' },
    { id: 'forward_lab', label: '5. Forward to Lab', icon: '🧪' },
  ];

  return (
    <div>
      <PageHeader title="Visual Inspection" subtitle="Manage appointment → sample ID → VI result → discrepancy → forward to lab" />
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1 space-y-2">
          <div className="text-xs font-semibold text-gray-500 uppercase mb-2">VI Queue ({pending.length})</div>
          {pending.map(a => (
            <div key={a.id} onClick={() => setSel(a)}
              className={`p-3 rounded-lg border cursor-pointer bg-white ${sel?.id === a.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}>
              <div className="text-xs font-mono font-semibold text-blue-700">{a.id}</div>
              <div className="text-xs text-gray-600 truncate">{a.importer.replace('M/s ', '')}</div>
              <div className="text-xs text-gray-500 mt-1">TO: {a.assignedTO ?? 'Unassigned'}</div>
              <StageBadge stage={a.stage} />
            </div>
          ))}
        </div>

        {sel && (
          <div className="col-span-3">
            {/* Step Nav */}
            <div className="flex border-b border-gray-200 mb-4 bg-white rounded-t-lg overflow-hidden">
              {steps.map(s => (
                <button key={s.id} onClick={() => setStep(s.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors flex-1 justify-center ${step === s.id ? 'border-orange-500 text-orange-700 bg-orange-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                  {s.icon} {s.label}
                </button>
              ))}
            </div>

            {/* Step 1: Appointment */}
            {step === 'appointment' && (
              <div className="space-y-4">
                <Card title="Schedule Inspection Appointment">
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Inspection Date</label>
                      <input type="date" defaultValue="2024-04-15" className="w-full text-sm border border-gray-300 rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Inspection Time</label>
                      <input type="time" defaultValue="10:00" className="w-full text-sm border border-gray-300 rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">CFS Location</label>
                      <input type="text" defaultValue={sel.cfsLocation} className="w-full text-sm border border-gray-300 rounded px-3 py-2" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Btn color="blue">Send Appointment to CHA/Importer</Btn>
                    <Btn color="orange" outline onClick={() => setModal('POSTPONE')}>Postpone Date</Btn>
                  </div>
                </Card>

                {sel.viAppointment && (
                  <Card title="CHA/Importer Acknowledgement Status">
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <Field label="Scheduled Date" value={sel.viAppointment.date} />
                      <Field label="Scheduled Time" value={sel.viAppointment.time} />
                      <Field label="Acknowledged at" value={sel.viAppointment.ackTime ? `${sel.viAppointment.ackTime}` : 'Not yet'} />
                    </div>
                    {sel.viAppointment.acknowledged ? (
                      sel.viAppointment.ackTime > '11:00' ? (
                        <InfoBox type="warn">
                          <strong>Acknowledged AFTER 11:00 AM</strong> — AO approval required before inspection proceeds on scheduled date.
                          <div className="flex gap-2 mt-2">
                            <Btn size="xs" color="green">Approve — Proceed on Scheduled Date</Btn>
                            <Btn size="xs" color="orange">Do Not Approve — Postpone</Btn>
                          </div>
                        </InfoBox>
                      ) : (
                        <InfoBox type="success">Acknowledged before 11:00 AM — Inspection proceeds as scheduled on {sel.viAppointment.date}.</InfoBox>
                      )
                    ) : (
                      <div className="flex items-center gap-3">
                        <Badge color="yellow">Awaiting Acknowledgement</Badge>
                        <Btn size="xs" color="orange" onClick={() => setModal('POSTPONE')}>Postpone Inspection Date</Btn>
                      </div>
                    )}
                  </Card>
                )}
              </div>
            )}

            {/* Step 2: Sample ID Generation */}
            {step === 'sampling' && (
              <Card title="Generate Unique Sample ID per Consignment Item">
                <InfoBox type="info">TO must generate a Sample ID for each item. Each ID is unique and used to track the sample through lab testing. Multiple samples can be generated per item.</InfoBox>
                <table className="w-full text-xs mt-3">
                  <thead><tr className="bg-gray-50 border-b text-gray-500">
                    {['#', 'HS Code', 'Product', 'Quantity', 'Samples Req.', 'Sample ID(s)', 'Action'].map(h => (
                      <th key={h} className="text-left px-3 py-2">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {sel.items.map(item => (
                      <tr key={item.sno} className="border-b border-gray-100">
                        <td className="px-3 py-3">{item.sno}</td>
                        <td className="px-3 py-3 font-mono text-blue-700">{item.hsCode}</td>
                        <td className="px-3 py-3 font-medium">{item.product}</td>
                        <td className="px-3 py-3">{item.qty}</td>
                        <td className="px-3 py-3">
                          <input type="number" defaultValue={1} min={1} max={5} className="w-14 text-xs border border-gray-300 rounded px-2 py-1" />
                        </td>
                        <td className="px-3 py-3">
                          {item.sampleId ? <Badge color="green">{item.sampleId}</Badge> : <span className="text-gray-400 italic">Not generated</span>}
                        </td>
                        <td className="px-3 py-3">
                          {item.sampleId ? <Badge color="green">✓ Generated</Badge> : <Btn size="xs" color="blue">Generate Sample ID</Btn>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-end mt-3">
                  <Btn color="blue">Generate All Sample IDs</Btn>
                </div>
              </Card>
            )}

            {/* Step 3: VI Result Entry */}
            {step === 'vi_result' && (
              <Card title="TO: Update Visual Inspection Result per Item">
                <div className="text-xs text-gray-500 mb-3 p-2 bg-gray-50 rounded flex gap-4">
                  <span>Inspection Date: <strong>{sel.viAppointment?.date}</strong></span>
                  <span>Time: <strong>{sel.viAppointment?.time}</strong></span>
                  <span>TO: <strong>{sel.assignedTO}</strong></span>
                  <span>CFS: <strong>{sel.cfsLocation}</strong></span>
                </div>
                <table className="w-full text-xs">
                  <thead><tr className="bg-gray-50 border-b text-gray-500">
                    {['Sample ID', 'HS Code', 'Product', 'VI Result', 'Discrepancy Note', 'Discrepancy Type'].map(h => (
                      <th key={h} className="text-left px-3 py-2">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {sel.items.map(item => (
                      <tr key={item.sno} className={`border-b border-gray-100 ${item.viStatus === 'DISCREPANCY' ? 'bg-red-50' : ''}`}>
                        <td className="px-3 py-3 font-mono text-green-700">{item.sampleId ?? '—'}</td>
                        <td className="px-3 py-3 font-mono text-blue-700">{item.hsCode}</td>
                        <td className="px-3 py-3">{item.product}</td>
                        <td className="px-3 py-3">
                          <select defaultValue={item.viStatus ?? ''} className="text-xs border border-gray-300 rounded px-2 py-1">
                            <option value="">-- Select --</option>
                            <option value="PASSED">Passed ✓</option>
                            <option value="DISCREPANCY">Discrepancy Found ⚠️</option>
                          </select>
                        </td>
                        <td className="px-3 py-3">
                          <input type="text" defaultValue={item.discrepancyNote ?? ''} placeholder="Describe discrepancy..."
                            className="text-xs border border-gray-300 rounded px-2 py-1 w-full" />
                        </td>
                        <td className="px-3 py-3">
                          {item.viStatus === 'DISCREPANCY'
                            ? <select defaultValue={item.discrepancyType ?? ''} className="text-xs border border-gray-300 rounded px-2 py-1">
                                <option value="">-- Type --</option>
                                <option value="RECTIFIABLE">Rectifiable</option>
                                <option value="NON_RECTIFIABLE">Non-Rectifiable</option>
                              </select>
                            : <span className="text-gray-400">—</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex gap-2 mt-4 justify-end">
                  <Btn color="gray" outline>Save</Btn>
                  <Btn color="orange">Submit VI Results</Btn>
                </div>
              </Card>
            )}

            {/* Step 4: Discrepancy Handling */}
            {step === 'discrepancy' && (
              <div className="space-y-4">
                {sel.items.filter(i => i.viStatus === 'DISCREPANCY').length === 0
                  ? <Card><InfoBox type="success">No discrepancies recorded. Proceed to forward samples to lab.</InfoBox></Card>
                  : sel.items.filter(i => i.viStatus === 'DISCREPANCY').map(item => (
                    <Card key={item.sno} title={`Discrepancy — ${item.product} (${item.sampleId})`}>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Field label="Discrepancy Note" value={item.discrepancyNote} />
                          <div className="mt-3">
                            <dt className="text-xs font-medium text-gray-500 uppercase">Type</dt>
                            <dd className="mt-1">
                              <Badge color={item.discrepancyType === 'RECTIFIABLE' ? 'yellow' : 'red'}>
                                {item.discrepancyType}
                              </Badge>
                            </dd>
                          </div>
                        </div>
                        <div>
                          {item.discrepancyType === 'RECTIFIABLE' ? (
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg space-y-2">
                              <div className="text-xs font-semibold text-yellow-800">Rectifiable — Actions Available</div>
                              <Btn size="sm" color="yellow" full>Send Back to CHA/Applicant for Rectification</Btn>
                              <Btn size="sm" color="blue" outline full>Re-assign TO for Discrepancy Verification</Btn>
                              <Btn size="sm" color="orange" outline full>Re-assign Second TO for Re-sampling</Btn>
                              <p className="text-xs text-gray-500 mt-1">Flow: Importer rectifies → resends to AO → AO re-assigns TO → TO verifies → Accepted or NCC</p>
                            </div>
                          ) : (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-2">
                              <div className="text-xs font-semibold text-red-800">Non-Rectifiable — Generate NCC</div>
                              <InfoBox type="danger">Discrepancy cannot be corrected. NCC must be generated. Application stops here.</InfoBox>
                              <Btn size="sm" color="red" full onClick={() => setModal('NCC_VI')}>Generate NCC (Non-Conformance Certificate)</Btn>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                }
              </div>
            )}

            {/* Step 5: Forward to Lab */}
            {step === 'forward_lab' && (
              <Card title="Forward Samples to Laboratory via INFOLNET">
                <InfoBox type="info">Labs are auto-selected on <strong>Round Robin basis</strong>. AO can override the selection. All samples collected during VI are forwarded to labs.</InfoBox>
                <table className="w-full text-xs mt-3 mb-4">
                  <thead><tr className="bg-gray-50 border-b text-gray-500">
                    {['Sample ID', 'Product', 'HS Code', 'Auto-Selected Lab (Round Robin)', 'AO Override Lab'].map(h => (
                      <th key={h} className="text-left px-3 py-2">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {sel.items.filter(i => i.viStatus !== 'DISCREPANCY' || i.discrepancyType === 'RECTIFIABLE').map(item => (
                      <tr key={item.sno} className="border-b border-gray-100">
                        <td className="px-3 py-3 font-mono text-green-700">{item.sampleId ?? '—'}</td>
                        <td className="px-3 py-3">{item.product}</td>
                        <td className="px-3 py-3 font-mono text-blue-700">{item.hsCode}</td>
                        <td className="px-3 py-3 text-blue-700">FSSAI Referral Lab Mumbai</td>
                        <td className="px-3 py-3">
                          <select className="text-xs border border-gray-300 rounded px-2 py-1">
                            <option value="">Use Auto-Selected</option>
                            <option>FSSAI Referral Lab Delhi</option>
                            <option>FSSAI Referral Lab Chennai</option>
                            <option>NABL Accredited Lab Kolkata</option>
                            <option>Referral Lab Hyderabad</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex gap-2 justify-end">
                  <Btn color="gray" outline>Cancel</Btn>
                  <Btn color="purple">Forward Samples to Lab via INFOLNET</Btn>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>

      {modal === 'POSTPONE' && (
        <Modal title="Postpone Inspection Date" onClose={() => setModal(null)}>
          <p className="text-xs text-gray-500 mb-3">Update inspection date due to non-acknowledgement or AO non-approval.</p>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-medium text-gray-700 mb-1">New Date</label>
              <input type="date" className="w-full text-sm border border-gray-300 rounded px-3 py-2" /></div>
            <div><label className="block text-xs font-medium text-gray-700 mb-1">New Time</label>
              <input type="time" className="w-full text-sm border border-gray-300 rounded px-3 py-2" /></div>
          </div>
          <div className="flex gap-2 mt-4 justify-end">
            <Btn color="gray" outline onClick={() => setModal(null)}>Cancel</Btn>
            <Btn color="orange">Update Appointment</Btn>
          </div>
        </Modal>
      )}

      {modal === 'NCC_VI' && (
        <Modal title="Generate NCC — Non-Conformance Certificate" onClose={() => setModal(null)}>
          <InfoBox type="danger">NCC will be generated for non-rectifiable discrepancy. Application stops here. SWIFT applications: NCC/OSC sent to ICEGATE via FSSAI API 3.</InfoBox>
          <div className="mt-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">AO Remarks *</label>
            <textarea rows={3} placeholder="Remarks for NCC generation..." className="w-full text-sm border border-gray-300 rounded px-3 py-2" />
          </div>
          <div className="flex gap-2 mt-4 justify-end">
            <Btn color="gray" outline onClick={() => setModal(null)}>Cancel</Btn>
            <Btn color="red">Confirm NCC Generation</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Screen 6: Lab Results ─────────────────────────────────────────────────────
function LabResults({ go, selectedId }) {
  const pending = APPS.filter(a => a.stage === 'lab_testing');
  const [sel, setSel] = useState(selectedId ? APPS.find(a => a.id === selectedId) : pending[0]);
  const [modal, setModal] = useState(null);
  const [clarNote, setClarNote] = useState('');

  const passAll = sel?.samples?.every(s => s.result === 'PASS');
  const hasFail = sel?.samples?.some(s => s.result === 'FAIL');

  return (
    <div>
      <PageHeader title="Lab Results Review" subtitle="Review INFOLNET test reports — TO recommendation and AO final decision" />
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1 space-y-2">
          <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Lab Results ({pending.length})</div>
          {pending.map(a => (
            <div key={a.id} onClick={() => setSel(a)}
              className={`p-3 rounded-lg border cursor-pointer bg-white ${sel?.id === a.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}>
              <div className="text-xs font-mono font-semibold text-blue-700">{a.id}</div>
              <div className="text-xs text-gray-600 truncate">{a.importer.replace('M/s ', '')}</div>
              <div className="mt-1 flex gap-1">
                {a.samples?.some(s => s.result === 'FAIL')
                  ? <Badge color="red">FAIL — Action Needed</Badge>
                  : <Badge color="green">PASS</Badge>
                }
              </div>
            </div>
          ))}
        </div>

        {sel && (
          <div className="col-span-3 space-y-4">
            <Card title="Lab Test Report Summary">
              <table className="w-full text-xs">
                <thead><tr className="bg-gray-50 border-b text-gray-500">
                  {['Sample ID', 'Product', 'Lab', 'Report Date', 'Result', 'Fail Reason', 'Report'].map(h => (
                    <th key={h} className="text-left px-3 py-2">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {sel.samples?.map(s => (
                    <tr key={s.id} className={`border-b border-gray-100 ${s.result === 'FAIL' ? 'bg-red-50' : ''}`}>
                      <td className="px-3 py-2.5 font-mono text-green-700">{s.id}</td>
                      <td className="px-3 py-2.5">{sel.items.find(i => i.sno === s.itemSno)?.product}</td>
                      <td className="px-3 py-2.5">{s.lab}</td>
                      <td className="px-3 py-2.5">{s.reportDate}</td>
                      <td className="px-3 py-2.5"><Badge color={s.result === 'PASS' ? 'green' : 'red'}>{s.result}</Badge></td>
                      <td className="px-3 py-2.5 text-red-700 max-w-[180px]">{s.failReason ?? '—'}</td>
                      <td className="px-3 py-2.5"><Btn size="xs" color="gray" outline>📄 View Report</Btn></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

          </div>
        )}
      </div>

      {modal === 'dummy' && null}
    </div>
  );
}

// ─── Screen 7: NOC Issuance ────────────────────────────────────────────────────
function NOCIssuance({ go, selectedId }) {
  const pending = APPS.filter(a => a.stage === 'noc_pending');
  const [sel, setSel] = useState(selectedId ? APPS.find(a => a.id === selectedId) : pending[0]);
  const [certAction, setCertAction] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [showCert, setShowCert] = useState(null);

  return (
    <div>
      <PageHeader title="NOC / PNOC / NCC Issuance" subtitle="AO final approval after lab results — generate certificate and send to ICEGATE" />
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1 space-y-2">
          <div className="text-xs font-semibold text-gray-500 uppercase mb-2">NOC Queue ({pending.length})</div>
          {pending.map(a => (
            <div key={a.id} onClick={() => setSel(a)}
              className={`p-3 rounded-lg border cursor-pointer bg-white ${sel?.id === a.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}>
              <div className="text-xs font-mono font-semibold text-blue-700">{a.id}</div>
              <div className="text-xs text-gray-600 truncate">{a.importer.replace('M/s ', '')}</div>
              <div className="text-xs text-gray-400 mt-1">TO: {a.assignedTO}</div>
              {a.toRecommendation && <Badge color="blue" className="mt-1">{a.toRecommendation}</Badge>}
            </div>
          ))}
        </div>

        {sel && (
          <div className="col-span-3 space-y-4">
            <Card title={`Final Review — ${sel.id}`}>
              <div className="grid grid-cols-4 gap-3">
                <Field label="ARN" value={sel.arn} />
                <Field label="BE Number" value={sel.be} />
                <Field label="Importer" value={sel.importer} />
                <Field label="Port" value={sel.port} />
              </div>
            </Card>

            {/* TO Recommendation */}
            {sel.toRecommendation && (
              <Card title="TO Recommendation Received">
                <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded">
                  <span className="text-3xl">👨‍💼</span>
                  <div>
                    <div className="font-medium text-blue-900 text-sm">{sel.assignedTO}</div>
                    <div className="text-xs text-gray-600 mt-0.5">Recommendation: <Badge color="green">{sel.toRecommendation}</Badge></div>
                    <div className="text-xs text-gray-500 mt-1">Lab results verified. All samples passed. Consignment cleared for NOC issuance by AO.</div>
                  </div>
                </div>
              </Card>
            )}

            {/* Lab Results */}
            <Card title="Lab Test Results (Final)">
              <table className="w-full text-xs">
                <thead><tr className="bg-gray-50 border-b text-gray-500">
                  {['Sample ID', 'Product', 'Lab', 'Report Date', 'Result'].map(h => (
                    <th key={h} className="text-left px-3 py-2">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {sel.samples?.map(s => (
                    <tr key={s.id} className="border-b border-gray-100">
                      <td className="px-3 py-2.5 font-mono text-green-700">{s.id}</td>
                      <td className="px-3 py-2.5">{sel.items.find(i => i.sno === s.itemSno)?.product}</td>
                      <td className="px-3 py-2.5">{s.lab}</td>
                      <td className="px-3 py-2.5">{s.reportDate}</td>
                      <td className="px-3 py-2.5"><Badge color={s.result === 'PASS' ? 'green' : 'red'}>{s.result}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            {/* Payment Confirmation */}
            <Card title="Payment Status — Mandatory for NOC">
              {sel.payment?.status === 'SUCCESS'
                ? <InfoBox type="success">Payment confirmed. Txn ID: <strong>{sel.payment.txnId}</strong> | Amount: <strong>{sel.payment.amount}</strong> | Mode: {sel.payment.mode}</InfoBox>
                : <InfoBox type="danger">Payment not confirmed. NOC cannot be generated until payment is verified.</InfoBox>
              }
            </Card>

            {/* AO Final Decision */}
            <Card title="AO Final Certificate Decision">
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { id: 'NOC', icon: '📜', label: 'Issue Final NOC', sub: 'Full No Objection Certificate — TO generates NOC', color: 'green' },
                  { id: 'PNOC', icon: '📋', label: 'Issue Provisional NOC', sub: 'PNOC issued after payment — awaiting full lab clearance', color: 'blue' },
                  { id: 'NCC', icon: '🚫', label: 'Deny — Generate NCC', sub: 'Non-Conformance Certificate — process stops', color: 'red' },
                ].map(a => (
                  <div key={a.id} onClick={() => setCertAction(a.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer text-center transition-all ${certAction === a.id ? `border-${a.color}-500 bg-${a.color}-50` : 'border-gray-200 hover:border-gray-400'}`}>
                    <div className="text-3xl mb-1.5">{a.icon}</div>
                    <div className={`text-sm font-semibold text-${a.color}-700`}>{a.label}</div>
                    <div className="text-xs text-gray-400 mt-1 leading-tight">{a.sub}</div>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">AO Remarks</label>
                <textarea rows={2} value={remarks} onChange={e => setRemarks(e.target.value)}
                  placeholder="Enter remarks for the decision..." className="w-full text-sm border border-gray-300 rounded px-3 py-2" />
              </div>

              {certAction === 'NOC' && <InfoBox type="success" className="mb-3">AO approves → TO generates final NOC certificate. For SWIFT applications, NOC is sent to ICEGATE via FSSAI API 3.</InfoBox>}
              {certAction === 'PNOC' && <InfoBox type="info" className="mb-3">PNOC issued after payment receipt. Final NOC/NCC to follow after complete lab clearance.</InfoBox>}
              {certAction === 'NCC' && <InfoBox type="danger" className="mb-3">NCC generated. Process ends. For SWIFT, NCC/OSC sent to ICEGATE via FSSAI API 3.</InfoBox>}

              <div className="flex gap-2 justify-end">
                <Btn color="gray" outline>Revert to Lab for Clarification</Btn>
                <Btn color="blue" outline onClick={() => certAction && setShowCert(certAction)}>Preview Certificate</Btn>
                <Btn
                  color={certAction === 'NOC' ? 'green' : certAction === 'PNOC' ? 'blue' : certAction === 'NCC' ? 'red' : 'gray'}
                  disabled={!certAction}
                  onClick={() => setShowCert(certAction)}>
                  {certAction === 'NOC' ? 'Approve & Issue NOC' : certAction === 'PNOC' ? 'Issue PNOC' : certAction === 'NCC' ? 'Confirm NCC' : 'Select Decision'}
                </Btn>
              </div>
            </Card>
          </div>
        )}
      </div>

      {showCert && (
        <Modal title={`${showCert} Certificate Preview`} onClose={() => setShowCert(null)} size="xl">
          <CertificatePreview type={showCert} app={sel} />
          <div className="flex gap-2 mt-4 justify-end border-t pt-4">
            <Btn color="gray" outline onClick={() => setShowCert(null)}>Close</Btn>
            <Btn color="gray" outline>🖨️ Print</Btn>
            {sel?.source === 'SWIFT' && <Btn color="indigo">📤 Send to ICEGATE (FSSAI API 3)</Btn>}
            <Btn color="green">✅ Finalize & Issue</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Certificate Preview Component ────────────────────────────────────────────
function CertificatePreview({ type, app }) {
  if (!app) return null;
  const titles = { NOC: 'NO OBJECTION CERTIFICATE', PNOC: 'PROVISIONAL NO OBJECTION CERTIFICATE', NCC: 'NON-CONFORMANCE CERTIFICATE' };
  const borders = { NOC: 'border-green-500', PNOC: 'border-blue-500', NCC: 'border-red-600' };
  const certNo = `${type}/FSSAI/JNPT/2024/${app.id.split('/').pop()}`;
  const note = {
    NOC: 'This consignment is hereby cleared for customs release. No objection is raised by FSSAI for the import of the food items mentioned herein, subject to continued compliance with FSSAI regulations.',
    PNOC: 'Provisional clearance is granted for the consignment pending receipt of final laboratory test results. Final NOC or NCC shall be issued upon receipt of complete test reports.',
    NCC: 'This consignment has been found non-compliant with FSSAI Standards. The consignment is hereby rejected and cannot be imported into India. The importer may apply for re-test within the stipulated period.',
  };
  return (
    <div className={`border-4 ${borders[type]} rounded-lg p-6`}>
      <div className="text-center mb-5 border-b pb-4">
        <div className="text-xs font-semibold text-gray-500 tracking-widest mb-1">FOOD SAFETY AND STANDARDS AUTHORITY OF INDIA</div>
        <div className="text-base font-bold text-gray-900 mb-1">{titles[type]}</div>
        <div className="text-sm text-gray-600">Certificate No: <strong>{certNo}</strong></div>
        <div className="text-xs text-gray-400 mt-0.5">Date: 30 April 2024</div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
        <Field label="ARN" value={app.arn} />
        <Field label="Bill of Entry" value={app.be} />
        <Field label="BE Date" value={app.beDate} />
        <Field label="Importer" value={app.importer} />
        <Field label="IEC Code" value={app.iec} />
        <Field label="CHA" value={app.cha} />
        <Field label="Port of Entry" value={app.port} />
        <Field label="Import Type" value={app.importType} />
        <Field label="Source" value={app.source} />
      </div>
      <table className="w-full text-xs border border-gray-300 border-collapse mb-4">
        <thead><tr className="bg-gray-100 border border-gray-300">
          {['S.No', 'HS Code', 'Product Description', 'Quantity', 'Country of Origin', 'Status'].map(h => (
            <th key={h} className="border border-gray-300 px-2 py-1.5 text-left">{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {app.items?.map(item => (
            <tr key={item.sno}>
              <td className="border border-gray-300 px-2 py-1.5">{item.sno}</td>
              <td className="border border-gray-300 px-2 py-1.5 font-mono">{item.hsCode}</td>
              <td className="border border-gray-300 px-2 py-1.5">{item.product}</td>
              <td className="border border-gray-300 px-2 py-1.5">{item.qty}</td>
              <td className="border border-gray-300 px-2 py-1.5">{item.country}</td>
              <td className="border border-gray-300 px-2 py-1.5"><Badge color={type === 'NCC' ? 'red' : 'green'}>{type} ISSUED</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-gray-600 mb-4 italic">{note[type]}</p>
      <div className="flex justify-between items-end border-t pt-3 mt-3">
        <div className="text-xs">
          <div className="font-semibold text-gray-800">Authorized Signatory</div>
          <div className="text-gray-600">AO - Suresh Menon</div>
          <div className="text-gray-500">FSSAI, JNPT Mumbai</div>
          <div className="text-gray-400 mt-1">This is a computer generated certificate</div>
        </div>
        <div className="w-28 h-16 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center text-gray-400 text-xs">
          <span className="text-base">🔏</span>
          <span>Digital Seal</span>
        </div>
      </div>
    </div>
  );
}

// ─── Screen 8: Reports ─────────────────────────────────────────────────────────
function Reports() {
  return (
    <div>
      <PageHeader title="Reports & Analytics" subtitle="Application processing statistics for JNPT Mumbai" />
      <div className="grid grid-cols-3 gap-4">
        {[
          { title: 'Weekly Scrutiny Report', desc: 'Accept / Reject / Clarification / Not in Scope breakdown', icon: '🔍' },
          { title: 'Visual Inspection Report', desc: 'VI outcomes, discrepancy types, NCC generated', icon: '👁️' },
          { title: 'Lab Results Report', desc: 'Pass / Fail rates by product category and lab', icon: '🧪' },
          { title: 'NOC / PNOC / NCC Issued', desc: 'Certificate issuance summary for the period', icon: '📜' },
          { title: 'Non Compliant Importers Report', desc: 'Importers with non-compliant history', icon: '⏱️' },
          { title: 'SWIFT Integration Log', desc: 'ICEGATE API exchange log — ARN, queries, certificates', icon: '🔗' },
          { title: 'Payment Reconciliation', desc: 'Online / DD payments received vs pending', icon: '💳' },
          { title: 'TO Performance Report', desc: 'Applications handled by each Technical Officer', icon: '👨‍💼' },
          { title: 'INFOLNET Lab Log', desc: 'Sample dispatch and test result turnaround times', icon: '🏥' },
        ].map(r => (
          <Card key={r.title}>
            <div className="text-3xl mb-2">{r.icon}</div>
            <div className="text-sm font-semibold text-gray-900 mb-1">{r.title}</div>
            <div className="text-xs text-gray-500 mb-3">{r.desc}</div>
            <div className="flex gap-2">
              <Btn size="xs" color="blue" outline>Generate Report</Btn>
              <Btn size="xs" color="gray" outline>Export CSV</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Shared Layout Components ──────────────────────────────────────────────────
function GlobalUtilityBar() {
  return (
    <div className="bg-[#154360] text-white py-1 px-4 flex items-center justify-between text-[11px] flex-shrink-0">
      <div className="flex items-center gap-2">
        <img src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg" alt="India" className="h-4 w-auto flex-shrink-0" onError={e => { e.target.style.display='none'; }} />
        <span className="font-semibold opacity-90">Ministry of Health &amp; Family Welfare</span>
        <span className="opacity-30">|</span>
        <span className="opacity-80">Government of India</span>
        <span className="opacity-30">|</span>
        <span className="opacity-70">मंत्रालय स्वास्थ्य एवं परिवार कल्याण</span>
      </div>
      <div className="flex items-center gap-3 opacity-80">
        <button className="hover:underline">Skip to Main Content</button>
        <span className="opacity-40">|</span>
        <button className="hover:underline">Screen Reader Access</button>
        <span className="opacity-40">|</span>
        <span>Text Size:</span>
        <div className="flex items-center gap-0.5">
          <button className="border border-white/40 px-1.5 rounded hover:bg-white/20 text-[10px] leading-tight py-0.5">A-</button>
          <button className="border border-white/40 px-1.5 rounded hover:bg-white/20 text-[11px] leading-tight py-0.5">A</button>
          <button className="border border-white/40 px-1.5 rounded hover:bg-white/20 text-[13px] leading-tight py-0.5">A+</button>
        </div>
        <span className="opacity-40">|</span>
        <button className="hover:underline font-semibold">English</button>
        <span className="opacity-40">/</span>
        <button className="hover:underline opacity-80">हिन्दी</button>
      </div>
    </div>
  );
}

function GlobalFooter() {
  return (
    <div className="bg-[#0D1B2A] border-t border-white/10 py-2.5 px-6 flex-shrink-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] text-white/40">
        <span>&copy; 2026 Food Safety and Standards Authority of India (FSSAI) — Government of India. All Rights Reserved.</span>
        <div className="flex gap-4">
          {['Privacy Policy', 'Terms of Use', 'Accessibility Statement', 'Sitemap'].map(l => (
            <button key={l} className="hover:text-white/60 transition-colors">{l}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Hero / Public Landing Page ────────────────────────────────────────────────
function HeroPage({ onLogin }) {
  const [showLogin, setShowLogin] = useState(false);
  const [loginRole, setLoginRole] = useState(null);
  const [loginCreds, setLoginCreds] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const loginRoleCards = [
    { role:'AO',    label:'Authorized Officer', icon:'👨‍⚖️',    color:'border-green-300 hover:bg-green-50' },
    { role:'INS',   label:'Inspector / TO',     icon:'🔬',           color:'border-blue-300 hover:bg-blue-50' },
    { role:'IMP',   label:'Importer',           icon:'🏭',          color:'border-yellow-300 hover:bg-yellow-50' },
    { role:'CHA',   label:'CHA',                icon:'📦',           color:'border-orange-300 hover:bg-orange-50' },
    { role:'RD',    label:'Regional Director',  icon:'👨‍💼',       color:'border-purple-300 hover:bg-purple-50' },
    { role:'CEO',   label:'FSSAI CEO',          icon:'🏛️',      color:'border-red-300 hover:bg-red-50' },
    { role:'ADMIN', label:'Admin',              icon:'⚙️',           color:'border-gray-300 hover:bg-gray-50' },
  ];

  const pickLoginRole = (role) => {
    setLoginRole(role);
    const u = DEMO_USERS.find(d => d.role === role);
    if (u) setLoginCreds({ username: u.username, password: u.password });
    setLoginError('');
  };

  const submitLogin = () => {
    const user = DEMO_USERS.find(u => u.username === loginCreds.username && u.password === loginCreds.password);
    if (user) { setShowLogin(false); onLogin(user); }
    else { setLoginError('Invalid credentials. Select a role tile to auto-fill demo credentials.'); }
  };

  const loginDemoUser = loginRole ? DEMO_USERS.find(u => u.role === loginRole) : null;

  const stats = [
    { val: '3,24,816', label: 'Applications Processed', icon: '📋' },
    { val: '2,98,442', label: 'NOCs Issued',             icon: '✅' },
    { val: '47',       label: 'Active Ports / ICDs',     icon: '🚢' },
    { val: '124',      label: 'INFOLNET Labs Linked',    icon: '🧪' },
  ];
  const notices = [
    { date: '28 Apr 2026', tag: 'Circular', text: 'Revised SOP for PADS consignments at Air Cargo Stations — effective 01 May 2026' },
    { date: '22 Apr 2026', tag: 'Advisory', text: 'SWIFT 3.0 integration — new BE fields mandatory from 15 May 2026' },
    { date: '18 Apr 2026', tag: 'Notice',   text: 'HS Code mapping update for dairy and edible oil categories — refer Annexure III' },
    { date: '10 Apr 2026', tag: 'Update',   text: 'INFOLNET Lab roster updated for JNPT, Chennai, and Kolkata ports' },
  ];
  const quickLinks = [
    { icon: '📄', label: 'FSSAI Regulations & Standards' },
    { icon: '🔍', label: 'Track Your Application (ARN)' },
    { icon: '📘', label: 'Import Guidelines & SOP' },
    { icon: '🧾', label: 'Approved Lab List (INFOLNET)' },
    { icon: '📞', label: 'Helpdesk & Support' },
    { icon: '❓', label: 'FAQs — Importer / CHA' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800" style={{ fontFamily: 'Arial, sans-serif' }}>

      <GlobalUtilityBar />

      {/* ── Main Header (FSSAI logo + FICS title + Nav + Login in one row) ─── */}
      <header className="bg-white border-b-[3px] border-[#FF6200] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4 py-1.5">

          {/* FSSAI Logo image */}
          <img
            src={fssaiLogo}
            alt="FSSAI"
            className="h-14 w-auto flex-shrink-0"
            onError={e => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          {/* Fallback SVG logo if image fails */}
          <div className="hidden items-center gap-2 flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-white border-2 border-[#006633] flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 48 48" className="w-9 h-9">
                <circle cx="24" cy="24" r="22" fill="#006633" />
                <text x="24" y="30" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="Arial">F</text>
              </svg>
            </div>
            <div>
              <div className="text-[10px] font-black text-[#006633] tracking-wide leading-tight uppercase">Food Safety and Standards</div>
              <div className="text-[10px] font-black text-[#006633] tracking-wide leading-tight uppercase">Authority of India</div>
              <div className="text-[9px] text-gray-400 italic leading-tight">Inspiring Trust, Assuring Safe &amp; Nutritious Food</div>
              <div className="text-[8px] text-gray-400 leading-tight">Ministry of Health and Family Welfare, Government of India</div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-10 w-px bg-gray-200 mx-1 flex-shrink-0" />

          {/* FICS Portal Name */}
          <div className="flex-shrink-0">
            <div className="text-[18px] font-black text-[#FF6200] leading-tight tracking-tight">Food Import Clearance System</div>
            {/* <div className="text-[10px] text-gray-400 leading-tight mt-0.5">FSSAI — Food Import Clearance &amp; NOC Portal</div> */}
          </div>

          {/* Nav links (flexible center) */}
          <nav className="flex-1 flex items-center justify-center gap-0">
            {[
              { label: 'Home', active: true },
              { label: 'About FICS' },
              { label: 'Circulars' },
              { label: 'Guidelines' },
              { label: 'Track' },
              { label: 'FAQs' },
              { label: 'Contact' },
            ].map(item => (
              <button key={item.label}
                className={`px-3.5 py-4 text-[12px] font-medium border-b-2 transition-colors whitespace-nowrap ${
                  item.active
                    ? 'border-[#FF6200] text-gray-900 font-semibold'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Login button */}
          <button onClick={() => setShowLogin(true)}
            className="flex-shrink-0 bg-[#FF6200] hover:bg-[#e05500] text-white font-bold px-5 py-2.5 rounded text-[13px] transition-colors shadow flex items-center gap-2 whitespace-nowrap">
            🔒 Login
          </button>
        </div>
      </header>

      {/* ── Hero Section ────────────────────────────────────────────────────── */}
      <main className="flex-1">
        <section className="bg-white py-10 border-b border-gray-100">
          <div className="max-w-[1440px] mx-auto px-6 py-3 flex items-center justify-between">

            {/* LEFT: Headline + CTAs + badges */}
            <div className="flex-1 min-w-0">
              <h1 className="text-[48px] font-black leading-[1.1] mb-2" style={{ color: '#1A237E' }}>
                Seamless Imports.
              </h1>
              <h1 className="text-[48px] font-black leading-[1.1] mb-8" style={{ color: '#FF6200' }}>
                Uncompromised<br />Safety.
              </h1>

              {/* CTA Buttons */}
              <div className="flex items-center gap-4 mb-8">
                <button onClick={() => setShowLogin(true)}
                  className="flex items-center gap-2 bg-[#FF6200] hover:bg-[#e05500] text-white font-bold px-7 py-3.5 rounded-lg text-[15px] transition-colors shadow-md">
                  🔒 Login to FICS Portal
                </button>
                <button className="flex items-center gap-2 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold px-7 py-3.5 rounded-lg text-[15px] transition-colors bg-white">
                  🔍 Track NOC Application
                </button>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-8 text-[13px] font-semibold text-gray-600">
                <span className="flex items-center gap-1.5">
                  <span className="text-[#006633] font-black text-base">✓</span> 100% PAPERLESS
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[#006633] font-black text-base">✓</span> ICEGATE INTEGRATED
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[#006633] font-black text-base">✓</span> 124+ NABL LABS
                </span>
              </div>
            </div>

            {/* RIGHT: Flowchart image */}
            <div className="flex-shrink-0 w-[62%] max-w-[860px]">
              <img
                src={ficsFlowchart}
                alt="FICS Import Clearance Process Flow"
                className="w-full max-h-[560px] object-contain"
                onError={e => {
                  e.target.style.display = 'none';
                }}
              />
            </div>

          </div>
        </section>

        {/* ── Stats Bar ───────────────────────────────────────────────────────── */}
        <section className="bg-[#154360] py-6">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-4 gap-6">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-2xl font-black text-white">{s.val}</div>
                <div className="text-xs text-blue-300 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Notices + Quick Links ────────────────────────────────────────────── */}
        <section className="bg-gray-50 py-10">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 gap-8">

            {/* Notices */}
            <div className="col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black text-[#154360] uppercase tracking-wide flex items-center gap-2">
                  <span>📢</span> Latest Notices &amp; Circulars
                </h2>
                <button className="text-xs text-[#006633] hover:underline font-semibold">View All →</button>
              </div>
              <div className="space-y-3">
                {notices.map(n => (
                  <div key={n.text} className="bg-white rounded-lg border border-gray-200 px-4 py-3 flex items-start gap-3 hover:shadow-sm cursor-pointer transition-shadow">
                    <div className="text-[10px] font-bold text-white px-2 py-0.5 rounded mt-0.5 flex-shrink-0"
                      style={{ backgroundColor: n.tag === 'Circular' ? '#006633' : n.tag === 'Advisory' ? '#1A237E' : n.tag === 'Notice' ? '#FF6200' : '#555' }}>
                      {n.tag}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-800 leading-snug">{n.text}</div>
                      <div className="text-[10px] text-gray-400 mt-1">{n.date}</div>
                    </div>
                    <span className="text-gray-300 text-xs flex-shrink-0">›</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h2 className="text-sm font-black text-[#154360] uppercase tracking-wide flex items-center gap-2 mb-4">
                <span>🔗</span> Quick Links
              </h2>
              <div className="space-y-2">
                {quickLinks.map(l => (
                  <button key={l.label}
                    className="w-full text-left flex items-center gap-3 px-3 py-2.5 bg-white rounded-lg border border-gray-200 hover:border-[#006633] hover:bg-[#F8FFF8] text-xs font-medium text-gray-700 transition-all">
                    <span className="text-base">{l.icon}</span>
                    <span>{l.label}</span>
                    <span className="ml-auto text-gray-300">›</span>
                  </button>
                ))}
              </div>

              <div className="mt-4 bg-[#FFF8F0] border border-[#FF6200]/30 rounded-lg p-3">
                <div className="text-xs font-bold text-[#FF6200] mb-1">🆘 Need Help?</div>
                <div className="text-[11px] text-gray-600 leading-snug">
                  Helpdesk: <span className="font-semibold">1800-XXX-XXXX</span><br />
                  Email: <span className="font-semibold">fics-support@fssai.gov.in</span><br />
                  Mon–Fri, 9:00 AM – 6:00 PM IST
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>



      

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="bg-[#0D1B2A] text-white">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-4 gap-8 text-xs">
          <div>
            <div className="font-black text-base text-green-400 mb-2">FICS</div>
            <div className="text-white/60 leading-relaxed text-[11px]">
              Food Import Clearance System<br />
              An initiative of FSSAI under the Ministry of Health &amp; Family Welfare, Government of India.
            </div>
            <div className="mt-3 flex gap-2">
              {['FSSAI', 'ICEGATE', 'NIC'].map(b => (
                <span key={b} className="text-[10px] border border-white/20 px-2 py-0.5 rounded text-white/50">{b}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="font-bold text-white/80 mb-3 text-[11px] uppercase tracking-wide">About</div>
            <ul className="space-y-1.5 text-white/50 text-[11px]">
              {['About FSSAI', 'About FICS', 'Governing Policy', 'Annual Reports', 'RTI'].map(l => (
                <li key={l}><button className="hover:text-white transition-colors">{l}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-bold text-white/80 mb-3 text-[11px] uppercase tracking-wide">Services</div>
            <ul className="space-y-1.5 text-white/50 text-[11px]">
              {['Track Application', 'Download NOC/NCC', 'Import Guidelines', 'Lab Finder', 'Grievance Redressal'].map(l => (
                <li key={l}><button className="hover:text-white transition-colors">{l}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-bold text-white/80 mb-3 text-[11px] uppercase tracking-wide">Contact</div>
            <div className="text-white/50 text-[11px] space-y-1.5 leading-relaxed">
              <div>FSSAI Head Office<br />FDA Bhawan, Kotla Road<br />New Delhi — 110002</div>
              <div>📞 1800-XXX-XXXX (Toll Free)</div>
              <div>✉ fics-support@fssai.gov.in</div>
            </div>
          </div>
        </div>
      </footer>
      <GlobalFooter />

      {/* ── Login Modal ─────────────────────────────────────────────────────── */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) setShowLogin(false); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold leading-none">✕</button>

            <div className="text-center mb-5">
              <div className="text-lg font-black text-[#154360]">Food Import Clearance System</div>
              <div className="text-xs text-gray-500 mt-0.5">FICS — Officer &amp; Stakeholder Portal</div>
            </div>

            <p className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Select Your Role</p>

            <div className="grid grid-cols-7 gap-2 mb-5">
              {loginRoleCards.map(r => (
                <button key={r.role} onClick={() => pickLoginRole(r.role)}
                  className={`border-2 rounded-xl p-3 text-center transition-all ${loginRole === r.role ? r.color + ' ring-2 ring-[#FF6200]' : 'border-gray-200 ' + r.color}`}>
                  <div className="text-2xl mb-1">{r.icon}</div>
                  <div className="text-xs font-bold text-gray-800 leading-tight">{r.label}</div>
                  <div className="text-[10px] text-gray-500 mt-1 leading-tight">{r.desc}</div>
                </button>
              ))}
            </div>

            <div className="max-w-sm mx-auto">
              {loginDemoUser && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2.5 mb-4 text-xs text-center">
                  <div className="font-semibold text-orange-800">{loginDemoUser.name} — {loginDemoUser.designation}</div>
                  <div className="text-orange-700 mt-0.5">{loginDemoUser.org}</div>
                  <div className="text-gray-500 mt-1">Username: <strong>{loginDemoUser.username}</strong> &nbsp;|&nbsp; Password: <strong>{loginDemoUser.password}</strong></div>
                </div>
              )}

              <div className="space-y-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Username</label>
                  <input type="text" value={loginCreds.username}
                    onChange={e => setLoginCreds(p => ({ ...p, username: e.target.value }))}
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#FF6200]"
                    placeholder="Enter username" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                  <input type="password" value={loginCreds.password}
                    onChange={e => setLoginCreds(p => ({ ...p, password: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && submitLogin()}
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#FF6200]"
                    placeholder="Enter password" />
                </div>
              </div>

              {loginError && <p className="text-xs text-red-600 text-center mb-2">{loginError}</p>}

              <button onClick={submitLogin}
                className="w-full bg-[#FF6200] hover:bg-[#e05500] text-white font-bold py-2.5 rounded-lg transition-colors text-sm">
                Login to FICS Portal →
              </button>

              <p className="text-center mt-3 text-xs text-gray-400">
                Quick login: &nbsp;
                {DEMO_USERS.filter(u => u.role !== 'LABS').map(u => (
                  <button key={u.role} onClick={() => { setShowLogin(false); onLogin(u); }}
                    className="mx-1 text-[#FF6200] hover:underline font-medium">{u.role}</button>
                ))}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Login Screen ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, onBack }) {
  const roleCards = [
    { role: 'AO',    label: 'Authorized Officer',  icon: '👨‍⚖️', desc: 'Scrutiny, Payment, VI, Lab, NOC issuance',            color: 'border-green-300 hover:bg-green-50' },
    { role: 'INS',   label: 'Inspector / TO',      icon: '🔬',   desc: 'Inspection assignments, sampling, lab forwarding',     color: 'border-blue-300 hover:bg-blue-50' },
    { role: 'IMP',   label: 'Importer',            icon: '🏭',   desc: 'Application status, payment, NOC/NCC download',        color: 'border-yellow-300 hover:bg-yellow-50' },
    { role: 'CHA',   label: 'CHA',                 icon: '📦',   desc: 'Client applications, clearance tracking',              color: 'border-orange-300 hover:bg-orange-50' },
    { role: 'LABS',  label: 'Lab',                 icon: '🧪',   desc: 'Sample receipt, analysis, report & invoice generation', color: 'border-teal-300 hover:bg-teal-50' },
    { role: 'RD',    label: 'Regional Director',   icon: '👨‍💼',  desc: '1st Review decisions, port performance',               color: 'border-purple-300 hover:bg-purple-50' },
    { role: 'CEO',   label: 'FSSAI CEO',           icon: '🏛️',   desc: '2nd Appeal (final authority), national dashboard',     color: 'border-red-300 hover:bg-red-50' },
    { role: 'ADMIN', label: 'Admin',               icon: '⚙️',   desc: 'User management, masters, CMS administration',         color: 'border-gray-300 hover:bg-gray-50' },
  ];
  const [selectedRole, setSelectedRole] = useState(null);
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const pickRole = (role) => {
    setSelectedRole(role);
    const u = DEMO_USERS.find(d => d.role === role);
    if (u) setCreds({ username: u.username, password: u.password });
    setError('');
  };

  const handleLogin = () => {
    const user = DEMO_USERS.find(u => u.username === creds.username && u.password === creds.password);
    if (user) { onLogin(user); }
    else { setError('Invalid credentials. Select a role tile to auto-fill demo credentials.'); }
  };

  const demoUser = selectedRole ? DEMO_USERS.find(u => u.role === selectedRole) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-950 flex flex-col items-center justify-center p-6">
      {onBack && (
        <div className="w-full max-w-4xl mb-3">
          <button onClick={onBack} className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs transition-colors">
            ← Back to Portal Home
          </button>
        </div>
      )}
      <div className="text-center mb-7">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
          <span className="text-green-700 font-black text-2xl">F</span>
        </div>
        <div className="text-white/70 text-xs tracking-widest mb-1 uppercase">Food Safety and Standards Authority of India</div>
        <div className="text-white text-2xl font-bold">Food Import Clearance System</div>
        <div className="text-white/50 text-sm mt-1">FICS — Officer &amp; Stakeholder Portal</div>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-6">
        <p className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Select Your Role</p>

        <div className="grid grid-cols-7 gap-2 mb-5">
          {roleCards.filter(r => r.role !== 'LABS').map(r => (
            <button key={r.role} onClick={() => pickRole(r.role)}
              className={`border-2 rounded-xl p-3 text-center transition-all ${selectedRole === r.role ? r.color + ' ring-2 ring-green-500 bg-green-50' : 'border-gray-200 ' + r.color}`}>
              <div className="text-2xl mb-1">{r.icon}</div>
              <div className="text-xs font-bold text-gray-800 leading-tight">{r.label}</div>
              <div className="text-[10px] text-gray-500 mt-1 leading-tight">{r.desc}</div>
            </button>
          ))}
        </div>

        <div className="max-w-sm mx-auto">
          {demoUser && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 mb-4 text-xs text-center">
              <div className="font-semibold text-green-800">{demoUser.name} &mdash; {demoUser.designation}</div>
              <div className="text-green-700 mt-0.5">{demoUser.org}</div>
              <div className="text-gray-500 mt-1">Username: <strong>{demoUser.username}</strong> &nbsp;|&nbsp; Password: <strong>{demoUser.password}</strong></div>
            </div>
          )}

          <div className="space-y-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Username</label>
              <input type="text" value={creds.username}
                onChange={e => setCreds(p => ({ ...p, username: e.target.value }))}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
                placeholder="Enter username" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={creds.password}
                onChange={e => setCreds(p => ({ ...p, password: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
                placeholder="Enter password" />
            </div>
          </div>

          {error && <p className="text-xs text-red-600 text-center mb-2">{error}</p>}

          <button onClick={handleLogin}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
            Login to FICS Portal &rarr;
          </button>

          <p className="text-center mt-3 text-xs text-gray-400">
            Quick login: &nbsp;
            {DEMO_USERS.map(u => (
              <button key={u.role} onClick={() => onLogin(u)}
                className="mx-1 text-green-700 hover:underline font-medium">{u.role}</button>
            ))}
          </p>
        </div>
      </div>
      <p className="mt-5 text-white/30 text-xs">FICS Mockup — For demonstration purposes only &nbsp;|&nbsp; &copy; FSSAI 2024</p>
    </div>
  );
}

// ─── Screen 0: FICS Home ───────────────────────────────────────────────────────
function FICSHome({ go, currentUser }) {
  const role = currentUser?.role ?? 'AO';

  const MODULE_SETS = {
    AO: [
      { id:'bin',      icon:'📋', label:'Application Bin',      desc:'Full processing queue view',                      color:'bg-blue-50 border-blue-200 hover:bg-blue-100',     iconBg:'bg-blue-600' },
      { id:'scrutiny', icon:'🔍', label:'Scrutiny',              desc:'Accept / reject / clarify applications',           color:'bg-indigo-50 border-indigo-200 hover:bg-indigo-100', iconBg:'bg-indigo-600', pending:12 },
      { id:'payment',  icon:'💳', label:'Payment Verification',  desc:'Verify DD and online payments',                   color:'bg-yellow-50 border-yellow-200 hover:bg-yellow-100', iconBg:'bg-yellow-500', pending:3 },
      { id:'vi',       icon:'👁️', label:'Visual Inspection',     desc:'VI appointments, sampling, discrepancy',          color:'bg-orange-50 border-orange-200 hover:bg-orange-100', iconBg:'bg-orange-500', pending:7 },
      { id:'lab',      icon:'🧪', label:'Lab Results',           desc:'Review INFOLNET lab reports, AO decision',        color:'bg-purple-50 border-purple-200 hover:bg-purple-100', iconBg:'bg-purple-600', pending:5 },
      { id:'noc',      icon:'📜', label:'NOC Issuance',          desc:'Issue NOC / PNOC / NCC → ICEGATE',                color:'bg-green-50 border-green-200 hover:bg-green-100',   iconBg:'bg-green-600',  pending:4 },
      { id:'review',   icon:'⚖️', label:'Review & Appeal',       desc:'Retest, 1st Review (RD), 2nd Appeal (CEO)',       color:'bg-red-50 border-red-200 hover:bg-red-100',         iconBg:'bg-red-600',    pending:3 },
      { id:'reports',  icon:'📊', label:'Reports & Analytics',   desc:'SLA, payment reconciliation, INFOLNET lab log',   color:'bg-teal-50 border-teal-200 hover:bg-teal-100',      iconBg:'bg-teal-600' },
    ],
    TO: [
      { id:'bin',      icon:'📋', label:'Application Bin',       desc:'Applications assigned to you',                    color:'bg-blue-50 border-blue-200 hover:bg-blue-100',     iconBg:'bg-blue-600' },
      { id:'scrutiny', icon:'🔍', label:'Scrutiny Workbench',    desc:'Clarification drafting, item-level decisions',    color:'bg-indigo-50 border-indigo-200 hover:bg-indigo-100', iconBg:'bg-indigo-600', pending:12 },
      { id:'vi',       icon:'👁️', label:'Visual Inspection',     desc:'VI schedule, sample capture, batch grouping',     color:'bg-orange-50 border-orange-200 hover:bg-orange-100', iconBg:'bg-orange-500', pending:7 },
      { id:'lab',      icon:'🧪', label:'Lab Results',           desc:'Review lab reports, recommend to AO',              color:'bg-purple-50 border-purple-200 hover:bg-purple-100', iconBg:'bg-purple-600', pending:5 },
      { id:'reports',  icon:'📊', label:'Reports',               desc:'Workbench statistics and performance',             color:'bg-teal-50 border-teal-200 hover:bg-teal-100',      iconBg:'bg-teal-600' },
    ],
    IMP: [
      { id:'imp_apps',    icon:'📋', label:'My Applications',    desc:'Track all import applications and status',         color:'bg-blue-50 border-blue-200 hover:bg-blue-100',     iconBg:'bg-blue-600', pending:3 },
      { id:'imp_payment', icon:'💳', label:'Payments',           desc:'Pay scrutiny / VI / retest fees (online or DD)',   color:'bg-yellow-50 border-yellow-200 hover:bg-yellow-100', iconBg:'bg-yellow-500', pending:1 },
      { id:'imp_clarif',  icon:'❓', label:'Clarifications',     desc:'Respond to AO scrutiny clarification queries',     color:'bg-orange-50 border-orange-200 hover:bg-orange-100', iconBg:'bg-orange-500', pending:2 },
      { id:'imp_noc',     icon:'📜', label:'NOC / NCC Downloads',desc:'Download issued certificates',                    color:'bg-green-50 border-green-200 hover:bg-green-100',   iconBg:'bg-green-600' },
      { id:'imp_review',  icon:'⚖️', label:'Review & Retest',   desc:'Submit Form 6 — Retest / 1st Review / Appeal',    color:'bg-red-50 border-red-200 hover:bg-red-100',         iconBg:'bg-red-600' },
    ],
    CHA: [
      { id:'imp_apps',    icon:'📋', label:'Client Applications',desc:'Track all client consignments and status',         color:'bg-blue-50 border-blue-200 hover:bg-blue-100',     iconBg:'bg-blue-600', pending:5 },
      { id:'imp_payment', icon:'💳', label:'Payments',           desc:'Submit payments for clients (online / DD)',        color:'bg-yellow-50 border-yellow-200 hover:bg-yellow-100', iconBg:'bg-yellow-500', pending:2 },
      { id:'imp_clarif',  icon:'❓', label:'Clarifications',     desc:'Respond to scrutiny clarifications for clients',   color:'bg-orange-50 border-orange-200 hover:bg-orange-100', iconBg:'bg-orange-500', pending:3 },
      { id:'imp_noc',     icon:'📜', label:'NOC / NCC Downloads',desc:'Download issued certificates for clients',         color:'bg-green-50 border-green-200 hover:bg-green-100',   iconBg:'bg-green-600' },
      { id:'imp_review',  icon:'⚖️', label:'Review & Retest',   desc:'File Review / Retest on behalf of clients',       color:'bg-red-50 border-red-200 hover:bg-red-100',         iconBg:'bg-red-600' },
    ],
    RD: [
      { id:'review',  icon:'⚖️', label:'1st Review Queue',      desc:'NCC cases requiring RD decision — 2 pending',     color:'bg-blue-50 border-blue-200 hover:bg-blue-100',     iconBg:'bg-blue-600', pending:2 },
      { id:'reports', icon:'📊', label:'Port Performance',      desc:'JNPT port summary — SLA, throughput, trends',      color:'bg-teal-50 border-teal-200 hover:bg-teal-100',     iconBg:'bg-teal-600' },
    ],
    CEO: [
      { id:'review',  icon:'🏛️', label:'2nd Appeal Queue',      desc:'2nd Appeal cases for final CEO decision — 1 pending', color:'bg-red-50 border-red-200 hover:bg-red-100',   iconBg:'bg-red-600', pending:1 },
      { id:'reports', icon:'📊', label:'National Dashboard',    desc:'All-India import clearance performance overview',  color:'bg-teal-50 border-teal-200 hover:bg-teal-100',     iconBg:'bg-teal-600' },
    ],
    ADMIN: [
      { id:'admin_users',     icon:'👥', label:'User Management',  desc:'Create / activate / deactivate users',           color:'bg-blue-50 border-blue-200 hover:bg-blue-100',     iconBg:'bg-blue-600' },
      { id:'admin_masters',   icon:'⚙️', label:'Master Management',desc:'Port, lab, HS code, fee structure, SLA',         color:'bg-gray-50 border-gray-200 hover:bg-gray-100',     iconBg:'bg-gray-600' },
      { id:'admin_circulars', icon:'📰', label:'Circulars & CMS',  desc:'Publish news, circulars, FAQs for stakeholders', color:'bg-purple-50 border-purple-200 hover:bg-purple-100', iconBg:'bg-purple-600' },
    ],
  };
  const modules = MODULE_SETS[role] ?? MODULE_SETS.AO;

  const STAT_SETS = {
    AO:    [{label:'Total Active',val:38,color:'bg-gray-700',icon:'📁'},{label:'Scrutiny Pending',val:12,color:'bg-blue-600',icon:'🔍'},{label:'VI / Lab In Progress',val:12,color:'bg-orange-500',icon:'🧪'},{label:'NOC Queue',val:4,color:'bg-green-600',icon:'📜'},{label:'Review & Appeal',val:3,color:'bg-red-500',icon:'⚖️'}],
    TO:    [{label:'Assigned to Me',val:8,color:'bg-blue-600',icon:'📋'},{label:'Scrutiny Pending',val:5,color:'bg-indigo-600',icon:'🔍'},{label:'VI Due Today',val:3,color:'bg-orange-500',icon:'👁️'},{label:'Lab Pending',val:2,color:'bg-purple-600',icon:'🧪'}],
    IMP:   [{label:'My Applications',val:3,color:'bg-blue-600',icon:'📁'},{label:'In Process',val:2,color:'bg-orange-500',icon:'⏳'},{label:'NOC Received',val:5,color:'bg-green-600',icon:'📜'},{label:'NCC Received',val:1,color:'bg-red-500',icon:'🚫'}],
    CHA:   [{label:'Client Apps',val:12,color:'bg-blue-600',icon:'📁'},{label:'In Process',val:7,color:'bg-orange-500',icon:'⏳'},{label:'NOC Issued',val:18,color:'bg-green-600',icon:'📜'},{label:'Clarifications Due',val:3,color:'bg-yellow-500',icon:'❓'}],
    RD:    [{label:'1st Review Pending',val:2,color:'bg-blue-600',icon:'⚖️'},{label:'Port Throughput (Apr)',val:142,color:'bg-green-600',icon:'📦'},{label:'NCC Confirmed (Apr)',val:8,color:'bg-red-500',icon:'🚫'}],
    CEO:   [{label:'2nd Appeal Pending',val:1,color:'bg-red-500',icon:'🏛️'},{label:'Resolved This Month',val:4,color:'bg-green-600',icon:'✅'},{label:'Total Active Ports',val:12,color:'bg-blue-600',icon:'🏭'}],
    ADMIN: [{label:'Total Users',val:247,color:'bg-blue-600',icon:'👥'},{label:'Active Today',val:34,color:'bg-green-600',icon:'✅'},{label:'Pending Activations',val:5,color:'bg-yellow-500',icon:'⏳'}],
  };
  const stats = STAT_SETS[role] ?? STAT_SETS.AO;

  const ALERT_SETS = {
    AO:    [{type:'danger',msg:'FICS/2024/3818 — Lab FAIL: Aflatoxin + Sudan Red — AO decision pending'},{type:'warn',msg:'FICS/2024/3821 — Scrutiny SLA breach risk today (2 days pending)'},{type:'warn',msg:'REV/2024/001 — Retest window closes in 3 days for M/s Dragon Foods'},{type:'info',msg:'FICS/2024/3820 — DD submitted at SBI Chennai — verify before EOD'},{type:'success',msg:'NOC issued for FICS/2024/3815 — transmitted to ICEGATE successfully'}],
    TO:    [{type:'warn',msg:'FICS/2024/3819 — VI discrepancy pending AO approval — your clarification needed'},{type:'info',msg:'FICS/2024/3818 — Lab results received — verify and recommend to AO'},{type:'success',msg:'FICS/2024/3817 — Your NOC recommendation accepted by AO'}],
    IMP:   [{type:'warn',msg:'FICS/2024/3821 — Clarification query raised by AO — respond by 02 May'},{type:'info',msg:'FICS/2024/3819 — Visual Inspection in progress at JNPT'},{type:'danger',msg:'FICS/2024/3810 — NCC issued — Retest window: 3 days remaining'}],
    CHA:   [{type:'warn',msg:'3 client applications have pending clarification responses'},{type:'info',msg:'M/s Global Foods — VI scheduled 15 Apr — ensure representative presence'},{type:'success',msg:'M/s Pure Harvest — NOC issued and sent to ICEGATE'}],
    RD:    [{type:'warn',msg:'REV/2024/002 — 1st Review: 5 days left in 30-day window — assign TO today'},{type:'info',msg:'REV/2024/001 — Retest approved by AO — awaiting lab result'}],
    CEO:   [{type:'warn',msg:'REV/2024/003 — 2nd Appeal pending CEO decision (M/s Pacific Seafoods — Mercury)'},{type:'info',msg:'4 appeals resolved this month — 2 NOC issued, 2 NCC confirmed'}],
    ADMIN: [{type:'warn',msg:'5 user activation requests pending approval'},{type:'info',msg:'INFOLNET scheduled maintenance 2 May — notify labs and AOs'},{type:'success',msg:'SWIFT API 3 integration health check passed — all ports connected'}],
  };
  const alerts = ALERT_SETS[role] ?? ALERT_SETS.AO;

  const wsScreen = ['IMP','CHA'].includes(role) ? 'imp_apps' : role === 'ADMIN' ? 'admin_users' : role === 'RD' || role === 'CEO' ? 'review' : 'dashboard';

  return (
    <div>
      {/* FSSAI Portal Banner */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 text-white rounded-xl p-5 mb-5 flex items-center gap-5">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0">
          <div className="text-green-700 font-black text-2xl">F</div>
        </div>
        <div className="flex-1">
          <div className="text-xs font-medium text-green-200 tracking-widest mb-0.5">FOOD SAFETY AND STANDARDS AUTHORITY OF INDIA</div>
          <div className="text-xl font-bold">Food Import Clearance System (FICS)</div>
          <div className="text-xs text-green-200 mt-0.5">Portal Version 3.0 &nbsp;|&nbsp; {currentUser?.designation}</div>
        </div>
        <div className="text-right text-xs text-green-200">
          <div className="font-semibold text-white text-sm">{currentUser?.role} — {currentUser?.name}</div>
          <div className="mt-0.5">{currentUser?.org}</div>
          <div className="mt-0.5">30 Apr 2024 &nbsp;|&nbsp; 10:45 AM</div>
          <button onClick={() => go(wsScreen)} className="mt-2 bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1.5 rounded transition-colors">
            Go to Workspace →
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex gap-3 mb-5">
        {stats.map(s => (
          <div key={s.label} className={`flex-1 ${s.color} text-white rounded-lg p-3`}>
            <div className="flex items-center justify-between">
              <span className="text-2xl">{s.icon}</span>
              <span className="text-3xl font-black">{s.val}</span>
            </div>
            <div className="text-xs text-white/80 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Module Tiles */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {modules.map(m => (
          <button key={m.id} onClick={() => go(m.id)}
            className={`border rounded-xl p-4 text-left transition-all relative ${m.color}`}>
            {m.pending && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{m.pending}</span>
            )}
            <div className={`w-10 h-10 ${m.iconBg} rounded-lg flex items-center justify-center text-white text-xl mb-2`}>{m.icon}</div>
            <div className="text-sm font-semibold text-gray-900 mb-0.5">{m.label}</div>
            <div className="text-xs text-gray-500 leading-snug">{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Alerts + Announcements */}
      <div className="grid grid-cols-2 gap-4">
        <Card title="⚠️ Alerts — Your Pending Actions">
          <div className="space-y-2">
            {alerts.map((a, i) => <InfoBox key={i} type={a.type}>{a.msg}</InfoBox>)}
          </div>
        </Card>
        <Card title="📌 Announcements — FSSAI Head Office">
          <div className="space-y-0">
            {[
              { date:'29 Apr', msg:'All SCN responses for HS code 09042xxx to be closed by 30 Apr EOD.' },
              { date:'28 Apr', msg:'INFOLNET maintenance scheduled 2 May 00:00–06:00. Plan sample dispatch accordingly.' },
              { date:'27 Apr', msg:'New SOP for Retest requests effective 1 May 2024 — refer circular FSSAI/IMP/2024/15.' },
              { date:'25 Apr', msg:'Round-robin lab assignment temporarily suspended — manual assignment only.' },
              { date:'24 Apr', msg:'SWIFT integration upgraded — ARN generation now real-time. Report discrepancies to ICEGATE helpdesk.' },
            ].map((a, i) => (
              <div key={i} className="flex gap-3 py-2 border-b border-gray-50 last:border-0">
                <span className="text-xs font-medium text-gray-400 w-12 flex-shrink-0 pt-0.5">{a.date}</span>
                <span className="text-xs text-gray-700 leading-snug">{a.msg}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Importer / CHA Workspace ──────────────────────────────────────────────────
function ImporterPortal({ currentUser, defaultTab = 'apps' }) {
  const [tab, setTab] = useState(defaultTab);
  const isCHA = currentUser?.role === 'CHA';
  const tabs = [
    { id:'apps',    label: isCHA ? '📋 Client Applications' : '📋 My Applications' },
    { id:'payment', label: '💳 Payments' },
    { id:'clarif',  label: '❓ Clarifications' },
    { id:'noc',     label: '📜 NOC / NCC Downloads' },
    { id:'review',  label: '⚖️ Review & Retest' },
  ];
  const myApps = isCHA ? APPS : [APPS[0]];

  return (
    <div>
      <PageHeader
        title={isCHA ? 'CHA — Client Application Tracker' : 'Importer Application Dashboard'}
        subtitle={`Welcome, ${currentUser?.name} | ${currentUser?.org}`}
      />
      <div className="flex border-b border-gray-200 mb-4">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${tab === t.id ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'apps' && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-3 mb-3">
            {[
              { label:'Total Applications', val:myApps.length,  color:'bg-blue-500' },
              { label:'In Process',         val:myApps.filter(a=>!['completed_noc','completed_ncc','rejected'].includes(a.stage)).length, color:'bg-orange-500' },
              { label:'NOC Issued',         val:5,              color:'bg-green-500' },
              { label:'NCC Issued',         val:1,              color:'bg-red-500' },
            ].map(s => (
              <div key={s.label} className={`${s.color} text-white rounded-lg p-3`}>
                <div className="text-2xl font-bold">{s.val}</div>
                <div className="text-xs text-white/80 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
          <Card title="Application Status">
            <table className="w-full text-xs">
              <thead><tr className="bg-gray-50 border-b text-gray-500">
                {['App ID','ARN','Product(s)','Port','Stage','Status','Action'].map(h => (
                  <th key={h} className="text-left px-3 py-2">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {myApps.map(a => (
                  <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-mono text-blue-600">{a.id}</td>
                    <td className="px-3 py-2.5 font-mono text-gray-500 text-[10px]">{a.arn}</td>
                    <td className="px-3 py-2.5 max-w-[140px] truncate">{a.items.map(i => i.product).join(', ')}</td>
                    <td className="px-3 py-2.5">{a.port}</td>
                    <td className="px-3 py-2.5"><StageBadge stage={a.stage} /></td>
                    <td className="px-3 py-2.5 text-[10px] text-gray-500">{a.status}</td>
                    <td className="px-3 py-2.5"><Btn size="xs" color="blue" outline>View</Btn></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {tab === 'payment' && (
        <Card title="Payment Status">
          <InfoBox type="info">Online payment gateway for FSSAI scrutiny fee, VI fee, and retest fee. DD submission also available for offline payment.</InfoBox>
          <div className="mt-3 space-y-2">
            {APPS.filter(a => a.payment).slice(0, 3).map(a => (
              <div key={a.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="text-xs font-semibold">{a.id}</div>
                  <div className="text-xs text-gray-500">Mode: {a.payment.mode} &nbsp;|&nbsp; Amount: {a.payment.amount} &nbsp;|&nbsp; {a.payment.txnId || a.payment.ddNo}</div>
                </div>
                <Badge color={a.payment.status === 'SUCCESS' ? 'green' : 'yellow'}>{a.payment.status}</Badge>
              </div>
            ))}
            <div className="pt-2"><Btn color="green">+ Pay New Fee</Btn></div>
          </div>
        </Card>
      )}

      {tab === 'clarif' && (
        <Card title="Scrutiny Clarifications Pending">
          <InfoBox type="warn">AO has raised clarification queries on your applications. Please respond with supporting documents within the stipulated timeframe.</InfoBox>
          <div className="mt-3 space-y-3">
            {[
              { id:'FICS/2024/3821', query:'Please upload FSSAI Product Approval Certificate for Protein Powder (HS: 21069099). Clarification due by 02 May 2024.' },
            ].map(c => (
              <div key={c.id} className="p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                <div className="text-xs font-semibold text-gray-800 mb-1">{c.id}</div>
                <div className="text-xs text-gray-600 mb-3">{c.query}</div>
                <div className="flex items-center gap-3">
                  <input type="file" className="text-xs flex-1" />
                  <Btn size="xs" color="blue">Submit Response</Btn>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'noc' && (
        <Card title="NOC / PNOC / NCC Downloads">
          <table className="w-full text-xs">
            <thead><tr className="bg-gray-50 border-b text-gray-500">
              {['Certificate No','App ID','Type','Issue Date','Download'].map(h => (
                <th key={h} className="text-left px-3 py-2">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {[
                { certNo:'NOC/FSSAI/JNPT/2024/3815', appId:'FICS/2024/3815', type:'NOC',  date:'2024-04-20' },
                { certNo:'NCC/FSSAI/JNPT/2024/3810', appId:'FICS/2024/3810', type:'NCC',  date:'2024-04-15' },
                { certNo:'PNOC/FSSAI/JNPT/2024/3808', appId:'FICS/2024/3808', type:'PNOC', date:'2024-04-10' },
              ].map(c => (
                <tr key={c.certNo} className="border-b border-gray-100">
                  <td className="px-3 py-2.5 font-mono text-green-700 text-[10px]">{c.certNo}</td>
                  <td className="px-3 py-2.5 font-mono text-blue-600">{c.appId}</td>
                  <td className="px-3 py-2.5"><Badge color={c.type === 'NOC' ? 'green' : c.type === 'PNOC' ? 'blue' : 'red'}>{c.type}</Badge></td>
                  <td className="px-3 py-2.5">{c.date}</td>
                  <td className="px-3 py-2.5"><Btn size="xs" color="gray" outline>📄 Download PDF</Btn></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'review' && (
        <div className="space-y-4">
          <InfoBox type="info">After receiving an NCC, you may apply for Retest (within 15 days) or 1st Review with RD (within 30 days) by submitting Form 6 through this portal.</InfoBox>
          {REVIEW_CASES.map(r => (
            <Card key={r.id} title={`${r.id} — ${r.type === 'RETEST' ? 'Retest Request' : r.type === 'REVIEW_1' ? '1st Review / RD' : '2nd Appeal / CEO'}`}>
              <div className="grid grid-cols-3 gap-3 mb-2">
                <Field label="NCC Number" value={r.nccNo} />
                <Field label="NCC Date" value={r.nccDate} />
                <Field label="Status" value={r.status} />
                <Field label="Product" value={r.product} />
                {r.daysLeft && <Field label="Days Remaining" value={`${r.daysLeft} days`} />}
              </div>
              <InfoBox type="danger">{r.failReason}</InfoBox>
            </Card>
          ))}
          <div className="flex gap-2 pt-2">
            <Btn color="orange">+ Apply for Retest (Form 6)</Btn>
            <Btn color="blue" outline>+ Apply for 1st Review (Form 6)</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Admin Workspace ────────────────────────────────────────────────────────────
function AdminPortal({ currentUser, defaultTab = 'users' }) {
  const [tab, setTab] = useState(defaultTab);
  return (
    <div>
      <PageHeader title="FICS Administration Console" subtitle={`System Administrator — ${currentUser?.org}`} />
      <div className="flex border-b border-gray-200 mb-4">
        {[
          { id:'users',     label:'👥 User Management' },
          { id:'masters',   label:'⚙️ Master Management' },
          { id:'circulars', label:'📰 Circulars & CMS' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${tab === t.id ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'users' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <input className="text-sm border rounded px-3 py-1.5 w-56" placeholder="Search user / IEC / username..." />
              <select className="text-sm border rounded px-3 py-1.5">
                <option>All Roles</option>
                {['AO','TO','IMP','CHA','RD','CEO','ADMIN'].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <Btn color="green">+ Create User</Btn>
          </div>
          <Card title="Registered Users">
            <table className="w-full text-xs">
              <thead><tr className="bg-gray-50 border-b text-gray-500">
                {['Name','Role','Org / Port','Username','Status','Actions'].map(h => (
                  <th key={h} className="text-left px-3 py-2">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {DEMO_USERS.map((u, i) => (
                  <tr key={u.username} className="border-b border-gray-100">
                    <td className="px-3 py-2.5 font-medium">{u.name}</td>
                    <td className="px-3 py-2.5">
                      <Badge color={u.role==='AO'?'green':u.role==='TO'?'blue':u.role==='CEO'?'red':u.role==='RD'?'purple':u.role==='ADMIN'?'gray':'yellow'}>
                        {u.role}
                      </Badge>
                    </td>
                    <td className="px-3 py-2.5 text-gray-600">{u.org}</td>
                    <td className="px-3 py-2.5 font-mono">{u.username}</td>
                    <td className="px-3 py-2.5"><Badge color="green">Active</Badge></td>
                    <td className="px-3 py-2.5 flex gap-1">
                      <Btn size="xs" color="blue" outline>Edit</Btn>
                      <Btn size="xs" color="red" outline>Deactivate</Btn>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {tab === 'masters' && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { title:'Port Master',     desc:'Add/edit ports of entry and CFS locations', icon:'🏭' },
            { title:'Lab Master',      desc:'FSSAI referral labs — INFOLNET integration', icon:'🧪' },
            { title:'HS Code Master',  desc:'Harmonised System code descriptions',        icon:'📋' },
            { title:'Fee Structure',   desc:'Scrutiny, VI, retest fee per product category', icon:'💰' },
            { title:'SLA Configuration', desc:'Stage-wise SLA hours for each role',      icon:'⏱️' },
            { title:'Document Types',  desc:'Mandatory/optional documents per product',  icon:'📄' },
          ].map(m => (
            <Card key={m.title}>
              <div className="text-3xl mb-2">{m.icon}</div>
              <div className="text-sm font-semibold mb-1">{m.title}</div>
              <div className="text-xs text-gray-500 mb-3">{m.desc}</div>
              <div className="flex gap-2">
                <Btn size="xs" color="blue" outline>Manage</Btn>
                <Btn size="xs" color="gray" outline>Export</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'circulars' && (
        <Card title="Circulars, Notices & Announcements">
          <div className="flex justify-end mb-3"><Btn color="green" size="sm">+ New Circular</Btn></div>
          <table className="w-full text-xs">
            <thead><tr className="bg-gray-50 border-b text-gray-500">
              {['Ref No','Subject','Date','Type','Visible To','Actions'].map(h => (
                <th key={h} className="text-left px-3 py-2">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {[
                { ref:'FSSAI/IMP/2024/15', sub:'New SOP for Retest requests effective 1 May 2024',         date:'27 Apr', type:'Circular', to:'All Officers' },
                { ref:'FSSAI/IMP/2024/14', sub:'INFOLNET maintenance scheduled 2 May 00:00–06:00',         date:'28 Apr', type:'Notice',   to:'All Users' },
                { ref:'FSSAI/IMP/2024/13', sub:'Round-robin lab assignment temporarily suspended',           date:'25 Apr', type:'Notice',   to:'AO, TO' },
              ].map(c => (
                <tr key={c.ref} className="border-b border-gray-100">
                  <td className="px-3 py-2.5 font-mono text-green-700 text-[10px]">{c.ref}</td>
                  <td className="px-3 py-2.5">{c.sub}</td>
                  <td className="px-3 py-2.5">{c.date}</td>
                  <td className="px-3 py-2.5"><Badge color="blue">{c.type}</Badge></td>
                  <td className="px-3 py-2.5 text-gray-500">{c.to}</td>
                  <td className="px-3 py-2.5 flex gap-1">
                    <Btn size="xs" color="blue" outline>Edit</Btn>
                    <Btn size="xs" color="red" outline>Delete</Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

// ─── Screen 9: Review & Appeal ─────────────────────────────────────────────────
function ReviewAppeal({ go, currentUser }) {
  const role = currentUser?.role;
  const defaultTab = role === 'CEO' ? 'appeal2' : role === 'RD' ? 'review1' : 'retest';
  const [tab, setTab] = useState(defaultTab);
  const tabs = [
    { id: 'retest',  label: '🔄 Retest',              sub: '15-day window',  count: REVIEW_CASES.filter(r => r.type === 'RETEST').length },
    { id: 'review1', label: '⚖️ 1st Review / RD',      sub: '30-day window',  count: REVIEW_CASES.filter(r => r.type === 'REVIEW_1').length },
    { id: 'appeal2', label: '🏛️ 2nd Appeal / CEO',     sub: 'Final authority', count: REVIEW_CASES.filter(r => r.type === 'APPEAL_2').length },
  ];

  return (
    <div>
      <PageHeader title="Review & Appeal" subtitle="Post-NCC importer-initiated requests — Retest | 1st Review (RD) | 2nd Appeal (CEO)" />
      <InfoBox type="info">
        <strong>Process:</strong> NCC Issued → Importer submits Form 6 within 15 days for Retest → AO approves → Lab retests (secondary sample) → If fail: Importer may request 1st Review to RD within 30 days → RD decides → If NCC confirmed: 2nd Appeal to CEO (final, binding decision)
      </InfoBox>

      <div className="flex border-b border-gray-200 mt-4 mb-4">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-2 ${tab === t.id ? 'border-green-600 text-green-700 bg-green-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t.label}
            <span className="text-gray-400 text-[10px]">({t.sub})</span>
            <span className={`rounded-full text-[10px] font-bold px-1.5 py-0.5 ${tab === t.id ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>{t.count}</span>
          </button>
        ))}
      </div>

      {tab === 'retest'  && <RetestPanel />}
      {tab === 'review1' && <Review1Panel />}
      {tab === 'appeal2' && <Appeal2Panel />}
    </div>
  );
}

function RetestPanel() {
  const cases = REVIEW_CASES.filter(r => r.type === 'RETEST');
  const [sel, setSel] = useState(cases[0]);
  const [modal, setModal] = useState(null);

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-1 space-y-2">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Retest Requests ({cases.length})</div>
        {cases.map(c => (
          <div key={c.id} onClick={() => setSel(c)}
            className={`p-3 rounded-lg border cursor-pointer bg-white ${sel?.id === c.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}>
            <div className="text-xs font-mono font-semibold text-blue-700">{c.id}</div>
            <div className="text-xs text-gray-600 truncate">{c.importer.replace('M/s ', '')}</div>
            <div className="mt-1"><Badge color={c.daysLeft <= 3 ? 'red' : 'orange'}>{c.daysLeft} days left</Badge></div>
          </div>
        ))}
      </div>

      {sel && (
        <div className="col-span-3 space-y-4">
          <Card title={`Retest Request — ${sel.id}`}>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Original App ID" value={sel.appId} />
              <Field label="NCC Number" value={sel.nccNo} />
              <Field label="NCC Date" value={sel.nccDate} />
              <Field label="Importer" value={sel.importer} />
              <Field label="Product" value={sel.product} />
              <Field label="HS Code" value={sel.hsCode} />
            </div>
          </Card>

          <Card title="Lab Failure — Basis for NCC">
            <InfoBox type="danger">{sel.failReason}</InfoBox>
          </Card>

          <Card title="Retest Timeline (15-Day Window)">
            <div className="flex items-center gap-4 mb-3">
              {[
                { label: 'Days Since NCC', val: sel.daysFromNCC, color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
                { label: 'Days Remaining', val: sel.daysLeft,    color: sel.daysLeft <= 3 ? 'text-red-600' : 'text-orange-600', bg: sel.daysLeft <= 3 ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200' },
                { label: 'Total Window',   val: 15,              color: 'text-gray-600',  bg: 'bg-gray-50 border-gray-200' },
              ].map((s, i, arr) => (
                <div key={s.label} className="flex items-center gap-4">
                  <div className={`text-center px-4 py-3 border rounded-lg ${s.bg}`}>
                    <div className={`text-2xl font-black ${s.color}`}>{s.val}</div>
                    <div className="text-xs text-gray-500">{s.label}</div>
                  </div>
                  {i < arr.length - 1 && <span className="text-gray-300 text-xl">→</span>}
                </div>
              ))}
            </div>
            {sel.daysLeft <= 3 && <InfoBox type="warn">Retest window closing soon. Importer must be notified immediately. Urgent AO action required.</InfoBox>}
          </Card>

          <Card title="AO Action — Approve or Deny Retest">
            <InfoBox type="info">Importer submitted Form 6 for retest within 15-day window. On AO approval: importer pays per-sample retest fee (online only). Secondary (counter) sample dispatched to auto-assigned lab via round robin. Lab acknowledges and commences retest.</InfoBox>
            <div className="mt-3 space-y-3">
              <div className="p-3 bg-gray-50 border border-gray-200 rounded flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700">Counter-Sample Status</span>
                <Badge color={sel.retestSampleSent ? 'green' : 'yellow'}>{sel.retestSampleSent ? 'Sample dispatched to lab' : 'Awaiting AO approval'}</Badge>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">AO Remarks (optional)</label>
                <textarea rows={2} placeholder="Remarks for retest decision..." className="w-full text-sm border border-gray-300 rounded px-3 py-2" />
              </div>
              <div className="flex gap-2">
                <Btn color="green" onClick={() => setModal('APPROVE')}>✅ Approve Retest — Notify Importer for Payment</Btn>
                <Btn color="red" outline onClick={() => setModal('DENY')}>❌ Deny Retest Request</Btn>
              </div>
            </div>
          </Card>
        </div>
      )}

      {modal === 'APPROVE' && (
        <Modal title="Approve Retest Request" onClose={() => setModal(null)}>
          <InfoBox type="info">On approval, importer is notified via FICS portal to pay the per-sample retest fee. Post-payment, counter-sample is auto-assigned to a lab (round robin). Lab acknowledges and commences retest. Result: Pass → NOC; Fail → 1st Review process.</InfoBox>
          <div className="mt-3 space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">Auto-assigned Lab (Round Robin)</label>
              <input className="w-full text-sm border rounded px-3 py-2 bg-gray-50" defaultValue="FSSAI Referral Lab — Chennai" readOnly />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">AO Remarks</label>
              <textarea rows={2} className="w-full text-sm border rounded px-3 py-2" placeholder="Remarks..." />
            </div>
          </div>
          <div className="flex gap-2 mt-4 justify-end">
            <Btn color="gray" outline onClick={() => setModal(null)}>Cancel</Btn>
            <Btn color="green">Approve & Notify Importer</Btn>
          </div>
        </Modal>
      )}

      {modal === 'DENY' && (
        <Modal title="Deny Retest Request" onClose={() => setModal(null)}>
          <InfoBox type="warn">Retest denied. Importer may still proceed to 1st Review with RD if within 30-day window from NCC date.</InfoBox>
          <div className="mt-3">
            <label className="block text-xs font-medium mb-1">Reason for Denial *</label>
            <textarea rows={3} className="w-full text-sm border rounded px-3 py-2" placeholder="Enter reason for denial..." />
          </div>
          <div className="flex gap-2 mt-4 justify-end">
            <Btn color="gray" outline onClick={() => setModal(null)}>Cancel</Btn>
            <Btn color="red">Confirm Denial</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Review1Panel() {
  const cases = REVIEW_CASES.filter(r => r.type === 'REVIEW_1');
  const [sel, setSel] = useState(cases[0]);
  const [modal, setModal] = useState(null);
  const rdOfficers = ['RD - Ramesh Pillai (JNPT)', 'RD - Anita Gupta (Chennai)', 'RD - Manish Joshi (Delhi)'];

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-1 space-y-2">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-2">1st Review / RD ({cases.length})</div>
        {cases.map(c => (
          <div key={c.id} onClick={() => setSel(c)}
            className={`p-3 rounded-lg border cursor-pointer bg-white ${sel?.id === c.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
            <div className="text-xs font-mono font-semibold text-blue-700">{c.id}</div>
            <div className="text-xs text-gray-600 truncate">{c.importer.replace('M/s ', '')}</div>
            <div className="mt-1"><Badge color={c.daysLeft <= 5 ? 'red' : 'blue'}>{c.daysLeft} days left</Badge></div>
          </div>
        ))}
      </div>

      {sel && (
        <div className="col-span-3 space-y-4">
          <Card title={`1st Review Request — ${sel.id}`}>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Original App ID" value={sel.appId} />
              <Field label="NCC Number" value={sel.nccNo} />
              <Field label="NCC Date" value={sel.nccDate} />
              <Field label="Importer" value={sel.importer} />
              <Field label="Product" value={sel.product} />
              <Field label="HS Code" value={sel.hsCode} />
              <Field label="Days Since NCC" value={`${sel.daysFromNCC} of 30 days`} />
              <Field label="Window Remaining" value={`${sel.daysLeft} days`} />
              <Field label="Status" value={sel.status} />
            </div>
          </Card>

          <Card title="NCC Failure Basis">
            <InfoBox type="danger">{sel.failReason}</InfoBox>
            <p className="text-xs text-gray-500 mt-2">Importer has submitted Form 6 for 1st Review. FICS confirms this is the importer's 1st review request for this NCC number.</p>
          </Card>

          <Card title="TO Delegation">
            <InfoBox type="info">RD may delegate to a TO mapped to the port. Assigned TO seeks clarifications from importer, collects responses, and presents findings to RD. RD takes the final decision.</InfoBox>
            <div className="mt-3 space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1">Assign TO (optional — if RD delegates port-level review)</label>
                <select className="w-full text-sm border border-gray-300 rounded px-3 py-2">
                  <option>-- Assign TO (if RD delegates) --</option>
                  {OFFICERS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <Btn color="blue">Save TO Assignment</Btn>
            </div>
          </Card>

          <Card title="RD Decision Actions">
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: '✅', label: 'Issue NOC',           sub: 'RD reverses NCC — AO to generate NOC',             color: 'green',  modal: 'RD_NOC' },
                { icon: '🔄', label: 'Allow Retest / Re-inspection', sub: 'RD orders fresh sampling or re-inspection', color: 'orange', modal: 'RD_RETEST' },
                { icon: '🏷️', label: 'Label Rectification', sub: 'RD permits labelling correction and re-clearance', color: 'yellow', modal: 'RD_LABEL' },
                { icon: '❓', label: 'Seek Clarification',   sub: 'TO seeks additional info/docs from importer',      color: 'blue',   modal: 'RD_CLARIF' },
                { icon: '🚫', label: 'Confirm NCC',          sub: 'RD upholds NCC — importer may appeal to CEO',      color: 'red',    modal: 'RD_NCC' },
              ].map(a => (
                <div key={a.label} onClick={() => setModal(a.modal)}
                  className="p-3 border-2 border-gray-200 rounded-lg cursor-pointer text-center hover:border-gray-400 transition-all">
                  <div className="text-2xl mb-1">{a.icon}</div>
                  <div className={`text-xs font-semibold text-${a.color}-700`}>{a.label}</div>
                  <div className="text-xs text-gray-400 mt-1 leading-tight">{a.sub}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {modal === 'RD_NOC' && (
        <Modal title="RD Decision: Issue NOC" onClose={() => setModal(null)}>
          <InfoBox type="success">RD reverses the NCC decision. AO will generate the final NOC certificate for this consignment.</InfoBox>
          <div className="mt-3">
            <label className="block text-xs font-medium mb-1">RD Order Reference</label>
            <input className="w-full text-sm border rounded px-3 py-2 mb-3" placeholder="RD Order No..." />
            <label className="block text-xs font-medium mb-1">RD Remarks *</label>
            <textarea rows={3} className="w-full text-sm border rounded px-3 py-2" placeholder="Reason for reversing NCC..." />
          </div>
          <div className="flex gap-2 mt-4 justify-end">
            <Btn color="gray" outline onClick={() => setModal(null)}>Cancel</Btn>
            <Btn color="green">Confirm — Proceed to NOC Issuance</Btn>
          </div>
        </Modal>
      )}

      {modal === 'RD_NCC' && (
        <Modal title="RD Decision: Confirm NCC" onClose={() => setModal(null)}>
          <InfoBox type="danger">NCC confirmed by RD. Importer is notified and becomes eligible to file 2nd Appeal with FSSAI CEO.</InfoBox>
          <div className="mt-3">
            <label className="block text-xs font-medium mb-1">RD Order Reference</label>
            <input className="w-full text-sm border rounded px-3 py-2 mb-3" placeholder="RD Order No..." />
            <label className="block text-xs font-medium mb-1">RD Remarks *</label>
            <textarea rows={3} className="w-full text-sm border rounded px-3 py-2" placeholder="Reason for confirming NCC..." />
          </div>
          <div className="flex gap-2 mt-4 justify-end">
            <Btn color="gray" outline onClick={() => setModal(null)}>Cancel</Btn>
            <Btn color="red">Confirm NCC — Notify Importer for 2nd Appeal</Btn>
          </div>
        </Modal>
      )}

      {modal === 'RD_CLARIF' && (
        <Modal title="Seek Clarification from Importer" onClose={() => setModal(null)}>
          <p className="text-sm text-gray-600 mb-3">Assigned TO will contact the importer to collect additional documents or clarification on behalf of RD.</p>
          <textarea rows={3} className="w-full text-sm border rounded px-3 py-2 mb-3" placeholder="Describe documents / clarification required from importer..." />
          <div className="flex gap-2 justify-end">
            <Btn color="gray" outline onClick={() => setModal(null)}>Cancel</Btn>
            <Btn color="blue">Send Clarification Request to Importer</Btn>
          </div>
        </Modal>
      )}

      {(modal === 'RD_RETEST' || modal === 'RD_LABEL') && (
        <Modal title={modal === 'RD_RETEST' ? 'RD Orders Retest / Re-inspection' : 'RD Orders Label Rectification'} onClose={() => setModal(null)}>
          <InfoBox type="warn">{modal === 'RD_RETEST' ? 'RD directs a fresh round of sampling and laboratory testing. AO to assign TO for resampling and VI.' : 'RD allows importer to rectify label non-compliance and resubmit for clearance. AO to coordinate.'}</InfoBox>
          <div className="mt-3">
            <label className="block text-xs font-medium mb-1">RD Instructions</label>
            <textarea rows={3} className="w-full text-sm border rounded px-3 py-2" placeholder="Specific instructions from RD..." />
          </div>
          <div className="flex gap-2 mt-4 justify-end">
            <Btn color="gray" outline onClick={() => setModal(null)}>Cancel</Btn>
            <Btn color="orange">Confirm & Notify AO</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Appeal2Panel() {
  const cases = REVIEW_CASES.filter(r => r.type === 'APPEAL_2');
  const [sel, setSel] = useState(cases[0]);
  const [modal, setModal] = useState(null);
  const hoTOs = ['HO TO - Vikram Singh (HO Delhi)', 'HO TO - Meera Iyer (HO Delhi)', 'HO TO - Ajay Bose (HO Delhi)'];

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-1 space-y-2">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-2">2nd Appeal / CEO ({cases.length})</div>
        {cases.map(c => (
          <div key={c.id} onClick={() => setSel(c)}
            className={`p-3 rounded-lg border cursor-pointer bg-white ${sel?.id === c.id ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-300'}`}>
            <div className="text-xs font-mono font-semibold text-blue-700">{c.id}</div>
            <div className="text-xs text-gray-600 truncate">{c.importer.replace('M/s ', '')}</div>
            <div className="mt-1"><Badge color="red">CEO Pending</Badge></div>
          </div>
        ))}
      </div>

      {sel && (
        <div className="col-span-3 space-y-4">
          <div className="p-3 bg-red-50 border border-red-300 rounded-lg flex items-center gap-3">
            <span className="text-2xl">🏛️</span>
            <div>
              <div className="text-xs font-bold text-red-800">Final Authority — FSSAI CEO</div>
              <div className="text-xs text-red-700 mt-0.5">CEO decision is binding and final. No further appeal exists within the FICS system after 2nd Appeal.</div>
            </div>
          </div>

          <Card title={`2nd Appeal — ${sel.id}`}>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Original App ID" value={sel.appId} />
              <Field label="NCC Number" value={sel.nccNo} />
              <Field label="NCC Date" value={sel.nccDate} />
              <Field label="Importer" value={sel.importer} />
              <Field label="Product" value={sel.product} />
              <Field label="HS Code" value={sel.hsCode} />
              <Field label="1st Review Decision" value={sel.reviewDecision} />
              <Field label="Appeal Status" value={sel.status} />
            </div>
          </Card>

          <Card title="Failure Basis (From Lab Testing)">
            <InfoBox type="danger">{sel.failReason}</InfoBox>
          </Card>

          <Card title="HO TO Assignment (CEO Delegates)">
            <InfoBox type="info">CEO assigns Head Office Technical Officers (HO TOs) to assist in review. HO TOs examine the case, seek clarifications from the importer, and present their findings and recommendation to CEO for final decision.</InfoBox>
            <div className="mt-3">
              {sel.assignedCEOTO ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded flex items-center gap-3">
                  <span className="text-2xl">👨‍💼</span>
                  <div>
                    <div className="text-sm font-semibold text-red-900">{sel.assignedCEOTO}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Assigned HO TO for CEO Review</div>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-medium mb-1">Assign HO TO</label>
                    <select className="w-full text-sm border border-gray-300 rounded px-3 py-2">
                      <option>-- Select HO TO --</option>
                      {hoTOs.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="flex items-end"><Btn color="red">Assign</Btn></div>
                </div>
              )}
            </div>
          </Card>

          <Card title="CEO Final Decision">
            <div className="grid grid-cols-3 gap-3 mb-3">
              {[
                { icon: '✅', label: 'Issue NOC',             sub: 'CEO reverses NCC — AO generates final NOC',        color: 'green', modal: 'CEO_NOC' },
                { icon: '❓', label: 'Clarification / Re-eval', sub: 'CEO returns for re-evaluation or additional info', color: 'blue',  modal: 'CEO_CLARIF' },
                { icon: '🚫', label: 'Confirm NCC (Final)',    sub: 'CEO upholds NCC — process ends; ICEGATE notified', color: 'red',   modal: 'CEO_NCC' },
              ].map(a => (
                <div key={a.label} onClick={() => setModal(a.modal)}
                  className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer text-center hover:border-gray-400 transition-all">
                  <div className="text-3xl mb-1.5">{a.icon}</div>
                  <div className={`text-sm font-semibold text-${a.color}-700`}>{a.label}</div>
                  <div className="text-xs text-gray-400 mt-1 leading-tight">{a.sub}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {modal === 'CEO_NOC' && (
        <Modal title="CEO Decision: Issue NOC — Final" onClose={() => setModal(null)}>
          <InfoBox type="success">CEO reverses NCC. AO will generate the final NOC certificate. This is a FINAL decision — process ends with NOC issuance and transmission to ICEGATE.</InfoBox>
          <div className="mt-3 space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">CEO Order Reference *</label>
              <input className="w-full text-sm border rounded px-3 py-2" placeholder="CEO Order No / File Reference..." />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">CEO Remarks *</label>
              <textarea rows={3} className="w-full text-sm border rounded px-3 py-2" placeholder="CEO decision remarks..." />
            </div>
          </div>
          <div className="flex gap-2 mt-4 justify-end">
            <Btn color="gray" outline onClick={() => setModal(null)}>Cancel</Btn>
            <Btn color="green">Confirm CEO Decision — Issue NOC</Btn>
          </div>
        </Modal>
      )}

      {modal === 'CEO_NCC' && (
        <Modal title="CEO Decision: Confirm NCC — Final" onClose={() => setModal(null)}>
          <InfoBox type="danger">CEO confirms NCC. This is the FINAL decision. Process ends. NCC/OSC transmitted to ICEGATE via FSSAI API 3. No further appeal possible within FICS.</InfoBox>
          <div className="mt-3 space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">CEO Order Reference *</label>
              <input className="w-full text-sm border rounded px-3 py-2" placeholder="CEO Order No / File Reference..." />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">CEO Final Remarks *</label>
              <textarea rows={3} className="w-full text-sm border rounded px-3 py-2" placeholder="CEO final remarks..." />
            </div>
          </div>
          <div className="flex gap-2 mt-4 justify-end">
            <Btn color="gray" outline onClick={() => setModal(null)}>Cancel</Btn>
            <Btn color="red">Confirm Final NCC — Send to ICEGATE</Btn>
          </div>
        </Modal>
      )}

      {modal === 'CEO_CLARIF' && (
        <Modal title="CEO: Clarification Required / Re-evaluation" onClose={() => setModal(null)}>
          <InfoBox type="info">Case returned for re-evaluation. HO TO coordinates with importer, collects required documents or data, and presents updated findings to CEO for final decision.</InfoBox>
          <div className="mt-3">
            <textarea rows={3} className="w-full text-sm border rounded px-3 py-2" placeholder="Describe what is required for re-evaluation..." />
          </div>
          <div className="flex gap-2 mt-4 justify-end">
            <Btn color="gray" outline onClick={() => setModal(null)}>Cancel</Btn>
            <Btn color="blue">Send for Re-evaluation</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  // appView: 'hero' → public landing  |  'login' → login screen  |  'main' → portal
  const [appView, setAppView]       = useState('hero');
  const [currentUser, setCurrentUser] = useState(null);
  const [screen, setScreen]         = useState('dashboard');
  const [selectedId, setSelectedId] = useState(null);

  const go = (s, id = null) => { setSelectedId(id); setScreen(s); };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setScreen(ROLE_DEFAULT_SCREEN[user.role] ?? 'dashboard');
    setAppView('main');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setScreen('dashboard');
    setAppView('hero');
  };

  if (appView === 'hero') return <HeroPage onLogin={handleLogin} />;

  const u = currentUser;
  const SCREENS = {
    dashboard:       <Dashboard go={go} currentUser={u} />,
    bin:             <ApplicationBin go={go} selectedId={selectedId} />,
    scrutiny:        <ScrutinyScreen go={go} selectedId={selectedId} />,
    payment:         <PaymentVerification go={go} selectedId={selectedId} />,
    vi:              <VisualInspection go={go} selectedId={selectedId} />,
    lab:             <LabResults go={go} selectedId={selectedId} />,
    noc:             <NOCIssuance go={go} selectedId={selectedId} />,
    review:          <ReviewAppeal go={go} currentUser={u} />,
    reports:         <Reports />,
    imp_apps:        <ImporterPortal currentUser={u} defaultTab="apps" />,
    imp_payment:     <ImporterPortal currentUser={u} defaultTab="payment" />,
    imp_clarif:      <ImporterPortal currentUser={u} defaultTab="clarif" />,
    imp_noc:         <ImporterPortal currentUser={u} defaultTab="noc" />,
    imp_review:      <ImporterPortal currentUser={u} defaultTab="review" />,
    admin_users:     <AdminPortal currentUser={u} defaultTab="users" />,
    admin_masters:   <AdminPortal currentUser={u} defaultTab="masters" />,
    admin_circulars: <AdminPortal currentUser={u} defaultTab="circulars" />,
  };

  const defaultScreen = ROLE_DEFAULT_SCREEN[u?.role] ?? 'dashboard';

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <GlobalUtilityBar />
      <div className="flex flex-1 min-h-0 overflow-hidden bg-gray-50">
        <Sidebar active={screen} go={s => go(s)} currentUser={u} onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto p-5">
          {SCREENS[screen] ?? SCREENS[defaultScreen]}
        </main>
      </div>
      <GlobalFooter />
    </div>
  );
}
