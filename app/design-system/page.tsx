'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

/* ═══════════════════════════════════════════════════════════
   ACKO Chat Design System — Widget Showcase
   All standard chat widgets rendered with demo data
   ═══════════════════════════════════════════════════════════ */

type LobTab = 'base' | 'health' | 'motor' | 'life';

const LOB_TABS: { id: LobTab; label: string; color: string }[] = [
  { id: 'base', label: 'Base Components', color: 'purple' },
  { id: 'health', label: 'Health', color: 'emerald' },
  { id: 'motor', label: 'Motor', color: 'blue' },
  { id: 'life', label: 'Life', color: 'amber' },
];

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-[22px] font-bold" style={{ color: 'var(--ds-text)' }}>{title}</h2>
      <p className="text-[14px] mt-1" style={{ color: 'var(--ds-text-secondary)' }}>{description}</p>
    </div>
  );
}

function WidgetCard({ title, widgetType, children }: { title: string; widgetType: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden transition-colors duration-300" style={{ background: 'var(--ds-card-bg)', border: '1px solid var(--ds-card-border)' }}>
      <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--ds-border)' }}>
        <div>
          <h3 className="text-[15px] font-semibold" style={{ color: 'var(--ds-text)' }}>{title}</h3>
          <p className="text-[11px] font-mono mt-0.5" style={{ color: 'var(--ds-text-tertiary)' }}>{widgetType}</p>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ color: 'var(--ds-badge-text)', background: 'var(--ds-badge-bg)', border: '1px solid var(--ds-badge-border)' }}>Widget</span>
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Standalone Widget Implementations (no store deps)
   ═══════════════════════════════════════════════ */

/* ── Unified SelectionCards Component ──
   One component, multiple layouts driven by data shape:
   - Grid (≤4 options with icons)
   - List (5+ options or no icons)
   - Compact grid (label-only, e.g. NCB %, year)
   - Radio style (yes/no binary)
*/

const ICON_MAP: Record<string, string> = {
  user: '/icons/generic/Profile.svg',
  heart: '/icons/health-life/Spouse.svg',
  child: '/icons/health-life/Child.svg',
  building: '/icons/generic/industry.svg',
  family: '/icons/health-life/Family.svg',
  doctor: '/icons/health-life/Doctor.svg',
  hospital: '/icons/health-life/hospital.svg',
  car: '/icons/car-bike/Car.svg',
  bike: '/icons/car-bike/Bike.svg',
  policy: '/icons/generic/Policy.svg',
  payment: '/icons/generic/Payment.svg',
  claim: '/icons/generic/Claim.svg',
  calendar: '/icons/generic/Calender.svg',
  location: '/icons/generic/Location.svg',
  compare: '/icons/generic/Compare.svg',
  gift: '/icons/generic/Gift.svg',
  savings: '/icons/generic/Savings.svg',
  discount: '/icons/generic/Discount.svg',
  renew: '/icons/generic/Renew.svg',
  recommend: '/icons/generic/Recommendation.svg',
  verify: '/icons/generic/Verify.svg',
  tick: '/icons/generic/Tick.svg',
  alert: '/icons/generic/Alert.svg',
  info: '/icons/generic/Info.svg',
  search: '/icons/generic/magnifier.svg',
  star: '/icons/generic/star.svg',
  download: '/icons/generic/Download.svg',
  share: '/icons/generic/Share.svg',
  phone: '/icons/generic/Phone.svg',
  mail: '/icons/generic/Mail.svg',
  wallet: '/icons/generic/wallet.svg',
  credit: '/icons/generic/credit-card.svg',
  lock: '/icons/generic/lock.svg',
  fingerprint: '/icons/generic/fingerprint.svg',
  camera: '/icons/generic/Camera.svg',
  edit: '/icons/generic/Edit.svg',
  delete: '/icons/generic/Delete.svg',
  refresh: '/icons/generic/Refresh.svg',
  settings: '/icons/generic/settings.svg',
  notification: '/icons/generic/Notification.svg',
  home: '/icons/generic/Home.svg',
  addon: '/icons/generic/add-on.svg',
  coverage: '/icons/generic/Extra coverage.svg',
  transfer: '/icons/generic/Transfer policy.svg',
  identity: '/icons/generic/Identity.svg',
  document: '/icons/generic/Policy document.svg',
  bill: '/icons/generic/Bill.svg',
  invoice: '/icons/generic/Invoice.svg',
  upi: '/icons/generic/UPI payment.svg',
  bank: '/icons/generic/bank.svg',
  money: '/icons/generic/Money.svg',
  headphone: '/icons/generic/Headphone.svg',
  delivery: '/icons/generic/Delivery.svg',
  tracking: '/icons/generic/Tracking.svg',
  tools: '/icons/generic/Tools.svg',
  flash: '/icons/generic/Flash.svg',
  clipboard: '/icons/generic/clipboard-check.svg',
  medicine: '/icons/health-life/Medicine.svg',
  ambulance: '/icons/health-life/Ambulance.svg',
  life: '/icons/health-life/Life.svg',
  checkup: '/icons/health-life/Health checkup.svg',
  fuel: '/icons/car-bike/Fuel.svg',
  garage: '/icons/car-bike/Garage.svg',
  speedometer: '/icons/car-bike/Speedometer.svg',
  towing: '/icons/car-bike/Towing.svg',
  thirdparty: '/icons/car-bike/Third Party.svg',
  zerodep: '/icons/car-bike/Zero Dep Car.svg',
};

interface SelectionOption {
  id: string;
  label: string;
  icon?: string;
  description?: string;
  badge?: string;
}

type SelectionLayout = 'auto' | 'grid' | 'list' | 'compact-grid' | 'radio';

function UnifiedSelectionCards({
  options,
  layout = 'auto',
  columns = 2,
  onSelect,
}: {
  options: SelectionOption[];
  layout?: SelectionLayout;
  columns?: 2 | 3;
  onSelect: (id: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelected(id);
    setTimeout(() => onSelect(id), 250);
  };

  const resolvedLayout: Exclude<SelectionLayout, 'auto'> =
    layout !== 'auto'
      ? layout
      : options.length <= 4 && options.every(o => o.icon)
        ? 'grid'
        : 'list';

  if (resolvedLayout === 'grid') {
    return (
      <div className={`grid gap-3 max-w-md ${columns === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {options.map((opt, i) => (
          <motion.button
            key={opt.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => handleSelect(opt.id)}
            className={`relative flex flex-col items-center text-center p-5 rounded-2xl border transition-all duration-200 active:scale-[0.96] min-h-[120px] justify-center
              ${selected === opt.id ? 'border-purple-400 bg-white/15 shadow-lg shadow-purple-900/20' : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'}`}
          >
            {opt.badge && <span className="absolute -top-2 -right-2 text-[11px] bg-pink-500 text-white px-2.5 py-0.5 rounded-full font-semibold shadow-sm">{opt.badge}</span>}
            {opt.icon && ICON_MAP[opt.icon] && (
              <div className="mb-2 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <img src={ICON_MAP[opt.icon]} alt={opt.label} className="w-6 h-6 opacity-80" style={{ filter: 'var(--ds-icon-filter)' }} />
              </div>
            )}
            <span className="text-[15px] font-medium text-white/90">{opt.label}</span>
            {opt.description && <span className="text-[13px] text-white/50 mt-1">{opt.description}</span>}
          </motion.button>
        ))}
      </div>
    );
  }

  if (resolvedLayout === 'compact-grid') {
    return (
      <div className={`grid gap-2 max-w-md ${columns === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleSelect(opt.id)}
            className={`relative flex flex-col items-center py-4 px-3 rounded-xl border text-center transition-all duration-200 active:scale-[0.95]
              ${selected === opt.id ? 'border-purple-400 bg-white/15 shadow-lg shadow-purple-900/20 text-white' : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:border-white/20'}`}
          >
            {opt.badge && <span className="absolute -top-2 text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full font-semibold">{opt.badge}</span>}
            <span className="text-[15px] font-semibold">{opt.label}</span>
            {opt.description && <span className="text-[13px] text-white/50 mt-1">{opt.description}</span>}
          </button>
        ))}
      </div>
    );
  }

  if (resolvedLayout === 'radio') {
    return (
      <div className="max-w-md space-y-3">
        {options.map((opt, i) => (
          <motion.button
            key={opt.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => handleSelect(opt.id)}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl border text-left transition-all duration-200 active:scale-[0.97]
              ${selected === opt.id
                ? opt.id === 'yes' ? 'border-purple-400 bg-purple-500/15 shadow-lg shadow-purple-900/20' : 'border-white/25 bg-white/10'
                : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'}`}
          >
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
              ${selected === opt.id
                ? opt.id === 'yes' ? 'border-purple-400 bg-purple-500' : 'border-white/40 bg-white/20'
                : 'border-white/30 bg-transparent'}`}
            >
              {selected === opt.id && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <img
                    src={opt.id === 'yes' ? ICON_MAP.tick : '/icons/generic/Close.svg'}
                    alt={opt.id === 'yes' ? 'yes' : 'no'}
                    className={`w-3.5 h-3.5 ${opt.id !== 'yes' ? 'opacity-70' : ''}`}
                    style={{ filter: 'var(--ds-icon-filter)' }}
                  />
                </motion.div>
              )}
            </div>
            <span className={`text-[15px] font-medium ${selected === opt.id ? 'text-white' : 'text-white/80'}`}>{opt.label}</span>
          </motion.button>
        ))}
      </div>
    );
  }

  // List layout (default)
  return (
    <div className="grid grid-cols-1 gap-2.5 max-w-md">
      {options.map((opt, i) => (
        <motion.button
          key={opt.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          onClick={() => handleSelect(opt.id)}
          className={`text-left px-4 py-3.5 rounded-xl border transition-all duration-200 active:scale-[0.97]
            ${selected === opt.id ? 'border-purple-400 bg-white/15 shadow-md shadow-purple-900/20' : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'}`}
        >
          <div className="flex items-center gap-3">
            {opt.icon && ICON_MAP[opt.icon] && (
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <img src={ICON_MAP[opt.icon]} alt={opt.label} className="w-5 h-5 opacity-70" style={{ filter: 'var(--ds-icon-filter)' }} />
              </div>
            )}
            <div className="flex-1">
              <span className="text-[15px] font-medium text-white/90">{opt.label}</span>
              {opt.description && <p className="text-[12px] text-white/40 mt-0.5">{opt.description}</p>}
            </div>
            {opt.badge && <span className="text-[11px] bg-purple-500/50 text-white px-2 py-0.5 rounded-full border border-purple-400/30">{opt.badge}</span>}
          </div>
        </motion.button>
      ))}
    </div>
  );
}

/* ── Unified GridSelector Component ──
   Handles both single-select and multi-select grid patterns.
   Supports: icons (from ICON_MAP), initials (auto from label), searchable lists.
   Merges: MultiSelect, BrandSelector into one configurable component.
*/

interface GridOption {
  id: string;
  label: string;
  icon?: string;
}

function UnifiedGridSelector({
  options: initialOptions,
  columns = 2,
  multiSelect = false,
  searchable = false,
  onSelect,
}: {
  options: GridOption[];
  columns?: 2 | 3;
  multiSelect?: boolean;
  searchable?: boolean;
  onSelect: (ids: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const options = searchable
    ? initialOptions.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    : initialOptions;

  const toggle = (id: string) => {
    if (multiSelect) {
      setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    } else {
      setSelected([id]);
      setTimeout(() => onSelect([id]), 250);
    }
  };

  return (
    <div className="max-w-md">
      {searchable && (
        <div className="relative mb-3">
          <img src="/icons/generic/magnifier.svg" alt="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" style={{ filter: 'var(--ds-icon-filter)' }} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/15 text-white placeholder-white/30 text-[14px] focus:outline-none focus:border-purple-400 transition-colors"
            style={{ backgroundColor: 'var(--ds-input-bg)' }} />
        </div>
      )}
      <div className={`grid gap-2.5 ${columns === 3 ? 'grid-cols-3' : 'grid-cols-2'} ${searchable ? 'max-h-[240px] overflow-y-auto' : ''}`}>
        {options.map((opt, i) => {
          const isSelected = selected.includes(opt.id);
          const hasIcon = opt.icon && ICON_MAP[opt.icon];
          return (
            <motion.button
              key={opt.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => toggle(opt.id)}
              className={`flex flex-col items-center text-center p-4 rounded-xl border transition-all duration-150 active:scale-[0.97]
                ${isSelected ? 'border-purple-400 bg-white/15' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
            >
              <div className={`mb-1.5 w-9 h-9 rounded-lg flex items-center justify-center ${isSelected ? 'bg-purple-500/30' : 'bg-white/10'}`}>
                {hasIcon ? (
                  <img src={ICON_MAP[opt.icon!]} alt={opt.label} className="w-5 h-5 opacity-80" style={{ filter: 'var(--ds-icon-filter)' }} />
                ) : (
                  <span className="text-[11px] font-bold text-white/60">{opt.label.charAt(0)}</span>
                )}
              </div>
              <span className="text-[12px] text-white/90 font-medium leading-tight">{opt.label}</span>
              {multiSelect && isSelected && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-1">
                  <img src={ICON_MAP.tick} alt="selected" className="w-3 h-3" style={{ filter: 'var(--ds-icon-filter)' }} />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
      {multiSelect && (
        <button
          onClick={() => selected.length > 0 && onSelect(selected)}
          disabled={selected.length === 0}
          className="mt-4 w-full py-3 bg-purple-700 text-white hover:bg-purple-600 rounded-xl text-[15px] font-semibold disabled:opacity-40 transition-all active:scale-[0.97]"
        >
          Continue ({selected.length} selected)
        </button>
      )}
    </div>
  );
}

function DemoNumberInput() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const num = parseInt(value);
    if (isNaN(num)) { setError('Please enter a valid number'); return; }
    if (num < 18) { setError('Minimum age is 18'); return; }
    if (num > 65) { setError('Maximum age is 65'); return; }
    setError('');
  };

  return (
    <div className="max-w-sm">
      <input
        type="tel"
        inputMode="numeric"
        value={value}
        onChange={(e) => { setValue(e.target.value); setError(''); }}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="Enter your age"
        className="w-full px-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-[15px] text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-colors backdrop-blur-sm"
      />
      <p className="text-[12px] text-white/40 mt-1.5">Between 18 and 65 years</p>
      {error && <p className="text-[12px] text-red-400 mt-1">{error}</p>}
      <button onClick={handleSubmit} className="mt-3 w-full py-3 bg-purple-700 text-white hover:bg-purple-600 rounded-xl text-[15px] font-semibold transition-colors active:scale-[0.97]">
        Continue
      </button>
    </div>
  );
}

function DemoTextInput() {
  const [value, setValue] = useState('');

  return (
    <div className="max-w-sm">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter your full name"
        className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30 text-[15px] font-medium transition-colors"
      />
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full mt-3 py-3 rounded-xl bg-purple-700 text-white hover:bg-purple-600 text-[15px] font-semibold active:scale-[0.97] transition-transform"
      >
        Continue
      </motion.button>
    </div>
  );
}

function DemoPincodeInput() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!/^\d{6}$/.test(value)) { setError('Please enter a valid 6-digit pincode'); return; }
    setError('');
  };

  return (
    <div className="max-w-sm">
      <div className="relative">
        <img src="/icons/generic/Location.svg" alt="location" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60" style={{ filter: 'var(--ds-icon-filter)' }} />
        <input
          type="tel" inputMode="numeric" maxLength={6} value={value}
          onChange={(e) => { setValue(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Enter your pincode"
          className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-[15px] text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-colors backdrop-blur-sm"
        />
      </div>
      {error && <p className="text-[12px] text-red-400 mt-1.5">{error}</p>}
      <button onClick={handleSubmit} disabled={value.length !== 6}
        className="mt-3 w-full py-3 bg-purple-700 text-white hover:bg-purple-600 rounded-xl text-[15px] font-semibold disabled:opacity-40 transition-all active:scale-[0.97]">
        Find Hospitals
      </button>
    </div>
  );
}

function DemoDatePicker() {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full max-w-sm">
      <p className="text-[13px] text-white/60 mb-3">Select date of birth</p>
      <div className="flex gap-3">
        <input
          type="number" inputMode="numeric" placeholder="DD" value={day}
          onChange={(e) => { setDay(e.target.value); if (e.target.value.length >= 2) monthRef.current?.focus(); }}
          maxLength={2}
          className="flex-1 min-w-0 px-2 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 text-center text-sm font-medium transition-colors"
        />
        <input
          ref={monthRef}
          type="number" inputMode="numeric" placeholder="MM" value={month}
          onChange={(e) => { setMonth(e.target.value); if (e.target.value.length >= 2) yearRef.current?.focus(); }}
          maxLength={2}
          className="flex-1 min-w-0 px-2 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 text-center text-sm font-medium transition-colors"
        />
        <input
          ref={yearRef}
          type="number" inputMode="numeric" placeholder="YYYY" value={year}
          onChange={(e) => setYear(e.target.value)}
          maxLength={4}
          className="flex-[1.3] min-w-0 px-2 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 text-center text-sm font-medium transition-colors"
        />
      </div>
      {day && month && year && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-purple-300/60 text-[12px] mt-1.5">
          {parseInt(day)}/{parseInt(month)}/{parseInt(year)}
        </motion.p>
      )}
      {error && <p className="text-red-400 text-[12px] mt-1.5">{error}</p>}
      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="w-full mt-3 py-2.5 rounded-xl bg-purple-700 text-white hover:bg-purple-600 text-sm font-semibold active:scale-[0.97] transition-transform"
      >
        Continue
      </motion.button>
    </div>
  );
}

function DemoNumberInputWithCurrency() {
  const [value, setValue] = useState('');

  const formatDisplay = (v: string) => {
    const num = parseInt(v);
    if (isNaN(num)) return '';
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)} L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(1)} K`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  return (
    <div className="max-w-sm">
      <div className="relative">
        <input
          type="number" inputMode="numeric" value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter annual income"
          className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30 text-[15px] font-medium transition-colors"
        />
        {value && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-purple-300/70">
            {formatDisplay(value)}
          </div>
        )}
      </div>
      <p className="text-white/40 text-[12px] mt-1.5">Minimum ₹3,00,000 per year</p>
      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="w-full mt-3 py-3 rounded-xl bg-purple-700 text-white hover:bg-purple-600 text-[15px] font-semibold active:scale-[0.97] transition-transform"
      >
        Continue
      </motion.button>
    </div>
  );
}

function DemoVehicleRegInput() {
  const [value, setValue] = useState('');

  return (
    <div className="max-w-sm">
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
          <div className="w-7 h-5 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-[8px] text-white font-bold">IND</span>
          </div>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          placeholder="KA 01 AB 1234"
          maxLength={13}
          style={{ backgroundColor: 'var(--ds-input-bg)' }}
          className="w-full pl-14 pr-4 py-4 rounded-xl border text-[16px] tracking-widest font-bold uppercase transition-colors border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-purple-400"
        />
      </div>
      <p className="text-[11px] text-white/40 mt-2 text-center">Enter your vehicle registration number</p>
      <button className="mt-3 w-full py-3.5 rounded-xl text-[15px] font-semibold transition-colors active:scale-[0.97] bg-purple-600 text-white hover:bg-purple-500">
        Find My Vehicle
      </button>
    </div>
  );
}

function DemoProgressiveLoader() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ['Checking registration...', 'Fetching vehicle details...', 'Loading insurance history...'];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        const newP = prev + 2;
        if (newP > 33 && currentStep === 0) setCurrentStep(1);
        if (newP > 66 && currentStep <= 1) setCurrentStep(2);
        return newP;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [currentStep]);

  return (
    <div className="max-w-sm mx-auto">
      <div className="bg-white/10 border border-white/15 rounded-2xl p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-purple-500/20 rounded-full flex items-center justify-center">
          <div className="w-8 h-8 border-[3px] border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
        </div>
        <p className="text-[15px] font-semibold text-white mb-2">Finding your vehicle</p>
        <p className="text-[13px] text-white/50 mb-4">{steps[currentStep]}</p>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-[11px] text-white/30 mt-2">{progress}%</p>
      </div>
    </div>
  );
}

function DemoCalculationTheater() {
  const [step, setStep] = useState(0);
  const steps = [
    'Analyzing your profile...',
    'Comparing 15+ plans...',
    'Calculating best premium...',
    'Applying discounts...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="max-w-sm mx-auto">
      <div className="bg-gradient-to-br from-purple-600/30 to-indigo-700/30 border border-purple-400/20 rounded-2xl p-6">
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
              <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(139,92,246,0.2)" strokeWidth="2.5" />
              <motion.path
                d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" stroke="#a78bfa" strokeWidth="2.5"
                initial={{ strokeDasharray: '0, 100' }}
                animate={{ strokeDasharray: `${((step + 1) / steps.length) * 100}, 100` }}
                transition={{ duration: 0.8 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-purple-300/30 border-t-purple-300 rounded-full animate-spin" />
            </div>
          </div>
        </div>
        <div className="space-y-2.5">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: i <= step ? 1 : 0.3, x: 0 }}
              transition={{ delay: i * 0.3, duration: 0.4 }}
              className="flex items-center gap-2.5"
            >
              {i < step ? (
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <img src="/icons/generic/Tick.svg" alt="done" className="w-3 h-3" style={{ filter: 'var(--ds-icon-filter)' }} />
                </div>
              ) : i === step ? (
                <div className="w-5 h-5 rounded-full border-2 border-purple-400 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border border-white/20 flex-shrink-0" />
              )}
              <span className={`text-[13px] ${i <= step ? 'text-white/80' : 'text-white/30'}`}>{s}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DemoConsentWidget() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="max-w-md">
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <button onClick={() => setChecked(!checked)} className="mt-0.5 flex-shrink-0">
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${checked ? 'bg-purple-500 border-purple-400' : 'border-white/30 bg-transparent'}`}>
              {checked && (
                <img src="/icons/generic/Tick.svg" alt="checked" className="w-3 h-3" style={{ filter: 'var(--ds-icon-filter)' }} />
              )}
            </div>
          </button>
          <span className="text-[13px] text-white/60 leading-relaxed">
            I confirm the details provided are accurate. I agree to ACKO&apos;s{' '}
            <span className="text-purple-400 underline">Terms &amp; Conditions</span> and{' '}
            <span className="text-purple-400 underline">Privacy Policy</span>.
          </span>
        </label>
      </div>
      <button
        disabled={!checked}
        className="mt-3 w-full py-3 bg-purple-700 text-white hover:bg-purple-600 rounded-xl text-[15px] font-semibold disabled:opacity-40 transition-all active:scale-[0.97]"
      >
        Confirm &amp; Proceed
      </button>
    </div>
  );
}

/* ── Unified SummaryCard Component ──
   Renders label-value rows in a card. Editable prop adds pencil icons per row.
   Merges: ReviewSummary, EditableSummary into one component.
*/

interface SummaryRow {
  label: string;
  value: string;
  editable?: boolean;
}

function UnifiedSummaryCard({
  title,
  subtitle,
  rows,
  editable = false,
  ctaLabel = 'Continue',
}: {
  title: string;
  subtitle?: string;
  rows: SummaryRow[];
  editable?: boolean;
  ctaLabel?: string;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-md">
      <div className="rounded-2xl overflow-hidden p-5 space-y-1"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="pb-3 border-b border-white/10">
          <h3 className="text-[17px] font-bold text-white">{title}</h3>
          {subtitle && <p className="text-[12px] text-white/40 mt-0.5">{subtitle}</p>}
        </div>
        <div className="py-1">
          {rows.map((row) => {
            const showEdit = editable && row.editable !== false;
            return (
              <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-[11px] text-white/40">{row.label}</p>
                  <p className="text-[14px] text-white font-medium mt-0.5">{row.value}</p>
                </div>
                {showEdit && (
                  <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                    <img src="/icons/generic/Edit.svg" alt="edit" className="w-4 h-4 opacity-50" style={{ filter: 'var(--ds-icon-filter)' }} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <button className="w-full py-3.5 rounded-xl bg-purple-600 text-white text-[15px] font-semibold active:scale-[0.97] transition-transform shadow-lg shadow-purple-600/30 mt-2">
          {ctaLabel}
        </button>
      </div>
    </motion.div>
  );
}

function DemoPremiumBreakdown() {
  const Divider = () => <div className="my-4" style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-md">
      <div className="relative rounded-t-2xl px-4 pt-4 pb-5 overflow-hidden" style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(255,255,255,0.1)', borderBottom: 'none' }}>
        <div className="pr-24">
          <p className="text-[16px] font-semibold text-white">Maruti Suzuki Swift</p>
          <p className="text-[12px] mt-1 leading-snug text-white/50">Comprehensive Plan &middot; VXi Petrol</p>
          <p className="text-[12px] mt-1.5 text-white/50">
            IDV : <span className="text-[14px] font-semibold text-white">4.8 Lakh</span>
          </p>
        </div>
        <div className="absolute right-3 top-3 w-[80px] h-[60px] bg-white/10 rounded-lg flex items-center justify-center">
          <img src="/icons/car-bike/Car.svg" alt="car" className="w-10 h-10 opacity-40" style={{ filter: 'var(--ds-icon-filter)' }} />
        </div>
      </div>

      <div className="rounded-b-2xl px-4 pt-4 pb-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderTop: 'none', boxShadow: '0px 4px 10px -2px rgba(54,53,76,0.08)' }}>
        <p className="text-[14px] font-semibold text-white mb-3">Base policy premium</p>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-[14px]">
            <span className="text-white/50">Third-party (TP) premium</span>
            <span className="text-white/50">₹2,094</span>
          </div>
          <div className="flex items-center justify-between text-[14px]">
            <span className="text-white/50">Own Damage (OD) premium</span>
            <span className="text-white/50">₹4,405</span>
          </div>
        </div>

        <Divider />
        <p className="text-[14px] font-semibold text-white mb-3">Add-on premium</p>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-[14px]">
            <span className="text-white/50">Engine Protection</span>
            <span className="text-white/50">₹999</span>
          </div>
          <div className="flex items-center justify-between text-[14px]">
            <span className="text-white/50">Zero Depreciation</span>
            <span className="text-white/50">₹1,499</span>
          </div>
        </div>

        <Divider />
        <p className="text-[14px] font-semibold text-white mb-3">Discounts</p>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-[14px]">
            <span className="text-white/50">NCB discount (50% of OD)</span>
            <span className="font-medium" style={{ color: '#0FA457' }}>-₹2,203</span>
          </div>
        </div>

        <Divider />
        <div className="space-y-2.5 mb-4">
          <div className="flex items-center justify-between text-[14px]">
            <span className="text-white/50">Net Premium</span>
            <span className="text-white/50">₹6,794</span>
          </div>
          <div className="flex items-center justify-between text-[14px]">
            <span className="text-white/50">18% GST</span>
            <span className="text-white/50">₹1,223</span>
          </div>
        </div>

        <Divider />
        <div className="flex items-center justify-between mb-4">
          <p className="text-[14px] font-semibold text-white">
            Total <span className="text-[12px] font-normal text-white/50">(Including GST)</span>
          </p>
          <p className="text-[14px] font-semibold text-white">₹8,017</p>
        </div>

        <button className="w-full py-3 rounded-xl text-[15px] font-semibold transition-all active:scale-[0.97] bg-purple-600 text-white hover:bg-purple-500">
          Proceed to Payment
        </button>
      </div>
    </motion.div>
  );
}

function DemoPaymentGateway() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const methods = [
    { id: 'upi', label: 'UPI', desc: 'Google Pay, PhonePe, Paytm', icon: '/icons/generic/UPI payment.svg' },
    { id: 'card', label: 'Card', desc: 'Visa, Mastercard, RuPay', icon: '/icons/generic/credit-card.svg' },
    { id: 'netbanking', label: 'Net Banking', desc: 'All major banks', icon: '/icons/generic/bank.svg' },
    { id: 'wallet', label: 'Wallet', desc: 'Paytm, Amazon Pay', icon: '/icons/generic/wallet.svg' },
  ];

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 max-w-md" style={{ background: '#1a1f36' }}>
      <div className="px-5 py-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #2b3a67 0%, #1a1f36 100%)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#528FF0]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.076 2L4 12.239l3.076 0L11.153 2zM11.669 2L8.593 12.239l3.076 0L15.746 2zM20 2l-7.077 10.239L16 22l4-9.761L16.923 2z" />
            </svg>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-white">ACKO Insurance</p>
            <p className="text-[11px] text-white/40">Maruti Swift — Motor Insurance</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-white/40">Amount</p>
          <p className="text-[18px] font-bold text-white">₹10,617</p>
        </div>
      </div>
      <div className="p-5">
        <p className="text-[12px] font-semibold text-white/50 uppercase tracking-wider mb-3">Payment Method</p>
        <div className="space-y-2.5">
          {methods.map(m => (
            <button key={m.id} onClick={() => setSelectedMethod(m.id)}
              className="w-full flex items-center gap-3.5 p-3.5 rounded-xl transition-all text-left"
              style={{
                background: selectedMethod === m.id ? 'rgba(82, 143, 240, 0.12)' : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${selectedMethod === m.id ? 'rgba(82, 143, 240, 0.5)' : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              <img src={m.icon} alt={m.label} className="w-5 h-5 opacity-70" style={{ filter: 'var(--ds-icon-filter)' }} />
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-white">{m.label}</p>
                <p className="text-[11px] text-white/40">{m.desc}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedMethod === m.id ? 'border-[#528FF0] bg-[#528FF0]' : 'border-white/20'}`}>
                {selectedMethod === m.id && (
                  <img src="/icons/generic/Tick.svg" alt="selected" className="w-3 h-3" style={{ filter: 'var(--ds-icon-filter)' }} />
                )}
              </div>
            </button>
          ))}
        </div>
        <button disabled={!selectedMethod}
          className="w-full mt-5 py-3.5 rounded-xl text-[15px] font-semibold text-white transition-all disabled:opacity-30"
          style={{ background: selectedMethod ? 'linear-gradient(135deg, #528FF0 0%, #3b6fd4 100%)' : '#528FF0' }}
        >
          Pay ₹10,617
        </button>
      </div>
    </div>
  );
}

function DemoCelebration() {
  const CONFETTI_COLORS = ['#FFD700', '#FF6B6B', '#4ECDC4', '#A78BFA', '#F472B6'];
  const confetti = Array.from({ length: 20 }).map(() => ({
    xPct: Math.random() * 100, rotation: Math.random() * 720,
    duration: 2 + Math.random() * 2, delay: Math.random() * 0.5,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
  }));

  return (
    <div className="max-w-sm mx-auto">
      <div className="bg-white/10 border border-white/15 rounded-2xl overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {confetti.map((p, i) => (
            <motion.div key={i} initial={{ y: -10, opacity: 1 }} animate={{ y: 300, opacity: 0, rotate: p.rotation }}
              transition={{ duration: p.duration, delay: p.delay, ease: 'linear', repeat: Infinity, repeatDelay: 1 }}
              className="absolute w-2 h-2 rounded-full" style={{ left: `${p.xPct}%`, backgroundColor: p.color }}
            />
          ))}
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 p-6 text-center relative z-20">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10, stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl shadow-green-500/30">
            <img src="/icons/generic/Tick.svg" alt="success" className="w-10 h-10" style={{ filter: 'var(--ds-icon-filter)' }} />
          </motion.div>
          <h2 className="text-[20px] font-bold text-white">Payment Successful!</h2>
          <p className="text-[13px] text-white/60 mt-2">Your policy is now active</p>
        </div>
        <div className="p-5 space-y-3 relative z-20">
          <div className="flex justify-between items-center">
            <span className="text-[12px] text-white/50">Policy Number</span>
            <span className="text-[13px] font-semibold text-white">ACKO-2026-7839201</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[12px] text-white/50">Status</span>
            <span className="text-[12px] font-semibold text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Active
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[12px] text-white/50">Valid Until</span>
            <span className="text-[13px] font-semibold text-white">2 Mar 2027</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DemoNpsFeedback() {
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const emojis = [
    { value: 1, emoji: '😞', label: 'Poor' },
    { value: 2, emoji: '😕', label: 'Fair' },
    { value: 3, emoji: '😐', label: 'Okay' },
    { value: 4, emoji: '😊', label: 'Good' },
    { value: 5, emoji: '🤩', label: 'Loved it!' },
  ];

  return (
    <div className="space-y-4 max-w-md">
      <div className="flex justify-center gap-3">
        {emojis.map((e) => (
          <button key={e.value} onClick={() => setScore(e.value)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${score === e.value ? 'bg-white/15 scale-110 border border-purple-400/40' : 'bg-white/5 border border-transparent hover:bg-white/10'}`}>
            <span className="text-[28px]">{e.emoji}</span>
            <span className={`text-[10px] font-medium ${score === e.value ? 'text-white' : 'text-white/40'}`}>{e.label}</span>
          </button>
        ))}
      </div>
      {score !== null && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
          <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)}
            placeholder="Any suggestions? (optional)"
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[13px] text-white placeholder:text-white/30 resize-none h-20 focus:outline-none focus:border-purple-400/40" />
          <button className="w-full py-3 rounded-xl text-[14px] font-semibold transition-colors active:scale-[0.97] bg-purple-600 text-white hover:bg-purple-500">
            Submit Feedback
          </button>
        </motion.div>
      )}
    </div>
  );
}

function DemoPolicyTracker() {
  const steps = [
    { label: 'Payment received', status: 'done' as const, detail: 'Just now' },
    { label: 'Vehicle inspection', status: 'done' as const, detail: 'Not required for new policy' },
    { label: 'KYC verification', status: 'pending' as const, detail: 'Complete within 4 days' },
    { label: 'Policy issued', status: 'pending' as const, detail: 'After KYC verification' },
  ];

  return (
    <div className="max-w-md">
      <div className="bg-white/10 border border-white/15 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
            <img src="/icons/car-bike/Car.svg" alt="car" className="w-5 h-5 opacity-70" style={{ filter: 'var(--ds-icon-filter)' }} />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-white">Maruti Suzuki Swift</p>
            <p className="text-[11px] text-white/50">ACKO-MOT-2026-001</p>
          </div>
          <span className="text-[10px] font-semibold text-green-400 bg-green-400/15 px-2 py-0.5 rounded-full">Active</span>
        </div>
        <div className="p-4 space-y-0">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${s.status === 'done' ? 'bg-green-500' : 'bg-white/15 border border-white/30'}`}>
                  {s.status === 'done' ? (
                    <img src="/icons/generic/Tick.svg" alt="done" className="w-3 h-3" style={{ filter: 'var(--ds-icon-filter)' }} />
                  ) : (<span className="w-1.5 h-1.5 rounded-full bg-white/40" />)}
                </div>
                {i < steps.length - 1 && <div className={`w-0.5 h-8 ${s.status === 'done' ? 'bg-green-500/50' : 'bg-white/10'}`} />}
              </div>
              <div className="pb-4">
                <p className={`text-[13px] font-medium ${s.status === 'done' ? 'text-white' : 'text-white/50'}`}>{s.label}</p>
                <p className="text-[11px] text-white/40">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DemoCoverageCard() {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const breakdownItems = [
    { label: 'Current debts / loans', value: '₹40L' },
    { label: 'Future education costs', value: '₹30L' },
    { label: 'Family expenses (10 yrs)', value: '₹60L' },
    { label: 'Emergency buffer', value: '₹20L' },
  ];

  return (
    <div className="max-w-sm mx-auto">
      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-purple-600/40 to-indigo-700/40 border border-white/10 backdrop-blur-sm">
        <div className="px-5 pt-5 pb-4">
          <p className="text-white/50 text-[11px] uppercase tracking-wider mb-1">Recommended Cover</p>
          <p className="text-3xl font-bold text-white">₹1.5 Cr</p>
        </div>
        <div className="h-px bg-white/10" />
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-white/50 text-[11px] uppercase tracking-wider mb-0.5">Policy Term</p>
            <p className="text-lg font-semibold text-white">30 years</p>
          </div>
          <div className="text-right">
            <p className="text-white/50 text-[11px] uppercase tracking-wider mb-0.5">Covers till age</p>
            <p className="text-lg font-semibold text-white">62</p>
          </div>
        </div>
        <div className="h-px bg-white/10" />
        <button onClick={() => setShowBreakdown(!showBreakdown)}
          className="w-full px-5 py-3 flex items-center justify-between text-white/60 hover:text-white/80 transition-colors">
          <span className="text-[12px] font-medium">Why this is recommended</span>
          <motion.svg animate={{ rotate: showBreakdown ? 180 : 0 }} transition={{ duration: 0.2 }} className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </motion.svg>
        </button>
        <AnimatePresence>
          {showBreakdown && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="px-5 pb-4 space-y-2">
                {breakdownItems.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-[12px] text-white/50">{item.label}</span>
                    <span className="text-[12px] text-white/80 font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="px-5 pb-5 pt-2">
          <button className="w-full py-3.5 rounded-xl bg-purple-600 text-white text-[15px] font-semibold active:scale-[0.97] transition-transform shadow-lg shadow-purple-600/30">
            Continue with this plan
          </button>
        </div>
      </div>
    </div>
  );
}

function DemoPremiumSliders() {
  const [coverage, setCoverage] = useState(10000000);
  const [term, setTerm] = useState(30);
  const minCoverage = 2500000;
  const maxCoverage = 100000000;
  const minTerm = 10;
  const maxTerm = 40;

  const formatCoverage = (n: number) => {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(0)}L`;
    return `₹${n.toLocaleString('en-IN')}`;
  };

  const getProgress = (value: number, min: number, max: number) => ((value - min) / (max - min)) * 100;
  const premium = Math.round((coverage / 100000) * 8 * (1 + (term - 10) * 0.02));
  const monthly = Math.round(premium / 12);

  return (
    <div className="max-w-md">
      <div className="rounded-2xl overflow-hidden border border-white/10 backdrop-blur-sm bg-gradient-to-br from-white/10 to-white/5">
        <div className="bg-gradient-to-r from-purple-600/80 to-indigo-700/80 px-5 py-5">
          <p className="text-white/60 text-[11px] uppercase tracking-wider">Annual Premium</p>
          <p className="text-white text-3xl font-bold mt-1">₹{premium.toLocaleString('en-IN')}<span className="text-lg font-normal text-white/60">/yr</span></p>
          <p className="text-white/50 text-[12px] mt-1">₹{monthly.toLocaleString('en-IN')}/mo</p>
        </div>
        <div className="px-5 py-5 space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[13px] text-white/60">Coverage</span>
              <span className="text-[15px] font-bold text-white">{formatCoverage(coverage)}</span>
            </div>
            <input type="range" min={minCoverage} max={maxCoverage} step={2500000} value={coverage}
              onChange={(e) => setCoverage(Number(e.target.value))}
              style={{ background: `linear-gradient(to right, #a78bfa ${getProgress(coverage, minCoverage, maxCoverage)}%, rgba(255,255,255,0.15) ${getProgress(coverage, minCoverage, maxCoverage)}%)` }}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-400 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white/30" />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-white/40">{formatCoverage(minCoverage)}</span>
              <span className="text-[10px] text-white/40">{formatCoverage(maxCoverage)}</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[13px] text-white/60">Policy Term</span>
              <span className="text-[15px] font-bold text-white">{term} years</span>
            </div>
            <input type="range" min={minTerm} max={maxTerm} step={1} value={term}
              onChange={(e) => setTerm(Number(e.target.value))}
              style={{ background: `linear-gradient(to right, #a78bfa ${getProgress(term, minTerm, maxTerm)}%, rgba(255,255,255,0.15) ${getProgress(term, minTerm, maxTerm)}%)` }}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-400 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white/30" />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-white/40">{minTerm} yrs</span>
              <span className="text-[10px] text-white/40">{maxTerm} yrs</span>
            </div>
          </div>
        </div>
        <div className="px-5 pb-5">
          <button className="w-full py-3.5 rounded-xl bg-purple-600 text-white text-[15px] font-semibold active:scale-[0.97] transition-transform shadow-lg shadow-purple-600/30 hover:bg-purple-500">
            Continue with this plan
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Health-Specific Widget Demos
   ═══════════════════════════════════════════════ */

function DemoHospitalList() {
  const [showAll, setShowAll] = useState(false);
  const hospitals = [
    { name: 'Apollo Hospital', type: 'Multi-specialty', distance: '1.2 km' },
    { name: 'Fortis Healthcare', type: 'Super-specialty', distance: '2.5 km' },
    { name: 'Max Hospital', type: 'Multi-specialty', distance: '3.1 km' },
    { name: 'Manipal Hospital', type: 'General', distance: '4.8 km' },
    { name: 'Columbia Asia', type: 'Multi-specialty', distance: '5.3 km' },
  ];
  const visible = showAll ? hospitals : hospitals.slice(0, 3);

  return (
    <div className="max-w-md">
      <div className="relative rounded-2xl overflow-hidden mb-3 h-24" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)' }}>
        <div className="absolute inset-0 flex items-center px-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <img src="/icons/health-life/hospital.svg" alt="hospital" className="w-5 h-5 opacity-80" style={{ filter: 'var(--ds-icon-filter)' }} />
              <p className="text-white font-semibold text-[14px]">42 cashless hospitals nearby</p>
            </div>
            <p className="text-white/60 text-[12px]">Walk in, get treated — no paperwork</p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <div className="divide-y divide-white/5">
          {visible.map((h, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <img src="/icons/health-life/hospital.svg" alt="hospital" className="w-5 h-5 opacity-60" style={{ filter: 'var(--ds-icon-filter)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-white/90">{h.name}</p>
                <p className="text-[11px] text-white/40">{h.type}</p>
              </div>
              <span className="text-[11px] text-purple-300 flex-shrink-0">{h.distance}</span>
            </motion.div>
          ))}
        </div>
        {!showAll && (
          <button onClick={() => setShowAll(true)} className="w-full py-2.5 text-[13px] text-purple-300 font-medium hover:bg-white/5 transition-colors border-t border-white/5">
            View all 42 hospitals
          </button>
        )}
      </div>
    </div>
  );
}

function DemoGapAnalysis() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const gaps = [
    { feature: 'Room Rent', current: '₹5,000/day limit', acko: 'No limit', status: 'gap' as const },
    { feature: 'Consumables', current: 'Not covered', acko: 'Fully covered', status: 'gap' as const },
    { feature: 'Co-pay', current: '10% above 50 yrs', acko: 'Zero co-pay', status: 'gap' as const },
    { feature: 'Restore Benefit', current: 'Not available', acko: '100% restore', status: 'gap' as const },
    { feature: 'Waiting Period', current: '3 years PED', acko: '2 years PED', status: 'gap' as const },
    { feature: 'Day Care', current: 'Covered', acko: 'Covered', status: 'covered' as const },
    { feature: 'Ambulance', current: '₹2,000', acko: '₹2,500', status: 'covered' as const },
  ];
  const gapCount = gaps.filter(g => g.status === 'gap').length;

  return (
    <div className="max-w-md space-y-3">
      <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,0.2)' }}>
          <span className="text-[18px] font-bold text-red-400">{gapCount}</span>
        </div>
        <div>
          <p className="text-[14px] font-semibold text-white">Coverage gaps found</p>
          <p className="text-[12px] text-white/50">Your current plan has {gapCount} areas with limited coverage</p>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <div className="grid grid-cols-3 px-4 py-2.5 border-b border-white/10">
          <span className="text-[10px] text-white/40 uppercase font-semibold">Feature</span>
          <span className="text-[10px] text-white/40 uppercase font-semibold text-center">Current</span>
          <span className="text-[10px] text-purple-300 uppercase font-semibold text-right">ACKO</span>
        </div>
        {gaps.map((g, i) => (
          <button key={i} onClick={() => setExpanded(expanded === i ? null : i)}
            className={`w-full grid grid-cols-3 items-center px-4 py-3 text-left border-b border-white/5 last:border-0 transition-colors ${expanded === i ? 'bg-white/5' : 'hover:bg-white/5'}`}>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${g.status === 'gap' ? 'bg-red-400' : 'bg-green-400'}`} />
              <span className="text-[12px] text-white/80">{g.feature}</span>
            </div>
            <span className="text-[11px] text-white/40 text-center">{g.current}</span>
            <span className="text-[11px] text-purple-300 font-medium text-right">{g.acko}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function DemoPlanSwitcher() {
  const [activeTier, setActiveTier] = useState('platinum');
  const tiers = [
    { id: 'platinum', label: 'Platinum', premium: '₹12,999/yr', cover: '₹25 Lakh', features: ['Zero co-pay', 'No room rent limit', 'Full consumables', '100% restore'] },
    { id: 'lite', label: 'Lite', premium: '₹8,499/yr', cover: '₹10 Lakh', features: ['10% co-pay 50+', '₹8,000/day room', 'Basic consumables', '50% restore'] },
    { id: 'topup', label: 'Top-up', premium: '₹3,999/yr', cover: '₹15 Lakh', features: ['₹5L deductible', 'No room limit', 'Full consumables', 'Over existing cover'] },
  ];
  const active = tiers.find(t => t.id === activeTier)!;

  return (
    <div className="max-w-md">
      <div className="flex gap-1 p-1 rounded-xl mb-4" style={{ background: 'rgba(255,255,255,0.06)' }}>
        {tiers.map(tier => (
          <button key={tier.id} onClick={() => setActiveTier(tier.id)}
            className={`flex-1 py-2.5 px-2 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
              activeTier === tier.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-white/45'}`}>
            {tier.label}
          </button>
        ))}
      </div>
      <motion.div key={activeTier} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(168,85,247,0.3)' }}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[16px] font-bold text-white">ACKO {active.label}</p>
              <p className="text-[12px] text-white/50">Cover: {active.cover}</p>
            </div>
            <div className="text-right">
              <p className="text-[18px] font-bold text-white">{active.premium}</p>
            </div>
          </div>
          <div className="space-y-2">
            {active.features.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <img src="/icons/generic/Tick.svg" alt="check" className="w-3.5 h-3.5" style={{ filter: 'brightness(0) saturate(100%) invert(65%) sepia(52%) saturate(600%) hue-rotate(90deg)' }} />
                <span className="text-[13px] text-white/70">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="px-4 pb-4">
          <button className="w-full py-3 bg-purple-600 text-white rounded-xl text-[15px] font-semibold active:scale-[0.97] transition-transform">
            Select {active.label}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function DemoPdfUpload() {
  const [phase, setPhase] = useState<'idle' | 'extracting' | 'done'>('idle');

  return (
    <div className="max-w-md">
      {phase === 'idle' && (
        <div onClick={() => setPhase('extracting')}
          className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center cursor-pointer hover:border-purple-400/50 hover:bg-white/5 transition-all">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-purple-500/15 flex items-center justify-center">
            <img src="/icons/generic/PDF file.svg" alt="pdf" className="w-7 h-7 opacity-70" style={{ filter: 'var(--ds-icon-filter)' }} />
          </div>
          <p className="text-[14px] font-semibold text-white mb-1">Upload existing policy</p>
          <p className="text-[12px] text-white/40">Drop your policy PDF here or tap to browse</p>
          <p className="text-[11px] text-white/30 mt-2">PDF, up to 10MB</p>
        </div>
      )}
      {phase === 'extracting' && (
        <div className="border border-purple-400/30 rounded-2xl p-6 text-center" style={{ background: 'rgba(139,92,246,0.08)' }}>
          <div className="w-10 h-10 mx-auto mb-3 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
          <p className="text-[14px] font-semibold text-white">Extracting policy details...</p>
          <p className="text-[12px] text-white/40 mt-1">Reading Care Health Insurance — care_advantage.pdf</p>
          {setTimeout(() => setPhase('done'), 2500) && null}
        </div>
      )}
      {phase === 'done' && (
        <div className="border border-green-500/30 rounded-2xl p-5" style={{ background: 'rgba(34,197,94,0.08)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <img src="/icons/generic/Verify.svg" alt="done" className="w-5 h-5" style={{ filter: 'brightness(0) saturate(100%) invert(65%) sepia(52%) saturate(600%) hue-rotate(90deg)' }} />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-white">Policy extracted</p>
              <p className="text-[12px] text-white/50">Care Health Insurance — Care Advantage</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DemoLabSchedule() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedLab, setSelectedLab] = useState('');

  const today = new Date();
  const dates = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(today); d.setDate(d.getDate() + i + 2);
    return { value: d.toISOString().split('T')[0], label: d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }) };
  });

  const timeSlots = [
    { id: 'morning', label: 'Morning', time: '7-10 AM', note: 'Best for fasting' },
    { id: 'midday', label: 'Midday', time: '10 AM-1 PM' },
    { id: 'afternoon', label: 'Afternoon', time: '2-5 PM' },
  ];

  const labs = [
    { id: 'metropolis', name: 'Metropolis Labs', distance: '1.2 km', rating: '4.5' },
    { id: 'srl', name: 'SRL Diagnostics', distance: '2.8 km', rating: '4.3' },
    { id: 'thyrocare', name: 'Thyrocare', distance: '3.5 km', rating: '4.4' },
  ];

  return (
    <div className="max-w-md space-y-4">
      <div className="relative rounded-2xl overflow-hidden h-20" style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)' }}>
        <div className="absolute inset-0 flex items-center px-4">
          <div className="flex items-center gap-3">
            <img src="/icons/health-life/Blood test.svg" alt="lab" className="w-6 h-6 opacity-80" style={{ filter: 'var(--ds-icon-filter)' }} />
            <div>
              <p className="text-white font-semibold text-[14px]">Schedule Lab Test</p>
              <p className="text-white/60 text-[11px]">All costs covered by ACKO</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-[13px] text-white/60 font-semibold mb-2">Pick a date</h4>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {dates.map(d => (
            <button key={d.value} onClick={() => setSelectedDate(d.value)}
              className={`flex-shrink-0 px-3 py-2.5 rounded-xl border text-[12px] transition-all ${
                selectedDate === d.value ? 'border-purple-400 bg-white/15 text-white' : 'border-white/10 bg-white/5 text-white/60'}`}>
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-[13px] text-white/60 font-semibold mb-2">Time slot</h4>
        <div className="grid grid-cols-3 gap-2">
          {timeSlots.map(s => (
            <button key={s.id} onClick={() => setSelectedTime(s.id)}
              className={`p-3 rounded-xl border text-center transition-all ${
                selectedTime === s.id ? 'border-purple-400 bg-white/15' : 'border-white/10 bg-white/5'}`}>
              <p className="text-[12px] font-medium text-white/90">{s.label}</p>
              <p className="text-[10px] text-white/40">{s.time}</p>
              {s.note && <p className="text-[9px] text-green-400 mt-0.5">{s.note}</p>}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-[13px] text-white/60 font-semibold mb-2">Choose lab</h4>
        <div className="space-y-2">
          {labs.map(lab => (
            <button key={lab.id} onClick={() => setSelectedLab(lab.id)}
              className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                selectedLab === lab.id ? 'border-purple-400 bg-white/15' : 'border-white/10 bg-white/5'}`}>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <img src="/icons/health-life/lab test 3.svg" alt="lab" className="w-5 h-5 opacity-60" style={{ filter: 'var(--ds-icon-filter)' }} />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-medium text-white/90">{lab.name}</p>
                <p className="text-[11px] text-white/40">{lab.distance}</p>
              </div>
              <div className="flex items-center gap-1">
                <img src="/icons/generic/star.svg" alt="rating" className="w-3 h-3 opacity-60" style={{ filter: 'var(--ds-icon-filter)' }} />
                <span className="text-[11px] text-white/50">{lab.rating}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <button disabled={!selectedDate || !selectedTime || !selectedLab}
        className="w-full py-3 bg-purple-600 text-white rounded-xl text-[15px] font-semibold disabled:opacity-40 active:scale-[0.97] transition-all">
        Confirm Booking
      </button>
    </div>
  );
}

function DemoConfirmDetails() {
  const details = [
    { label: 'Policy Holder', value: 'Rahul Sharma' },
    { label: 'Sum Insured', value: '₹5,00,000' },
    { label: 'Members', value: 'Self (32 yrs), Spouse (30 yrs)' },
    { label: 'Renewal Date', value: '15 Aug 2026' },
    { label: 'Policy No', value: 'CH-2024-7839201' },
    { label: 'NCB', value: '10% per year' },
  ];

  return (
    <div className="max-w-md">
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <img src="/icons/generic/Policy document.svg" alt="doc" className="w-4 h-4 opacity-70" style={{ filter: 'var(--ds-icon-filter)' }} />
          </div>
          <div>
            <p className="text-[11px] text-white/40">Extracted from policy</p>
            <p className="text-[13px] text-white font-semibold">Care Health Insurance — Care Advantage</p>
          </div>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          {details.map(d => (
            <div key={d.label}>
              <p className="text-[10px] text-white/40 uppercase">{d.label}</p>
              <p className="text-[13px] text-white font-medium mt-0.5">{d.value}</p>
            </div>
          ))}
        </div>
        <div className="px-4 pb-4 flex gap-2">
          <button className="flex-1 py-2.5 rounded-xl border border-white/15 text-[13px] text-white/70 font-medium hover:bg-white/5 transition-colors">
            Edit Details
          </button>
          <button className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white text-[13px] font-semibold active:scale-[0.97] transition-transform">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function DemoVehicleDetailsCard() {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-sm">
      <div className="rounded-xl overflow-hidden shadow-[0_4px_10px_-2px_rgba(54,53,76,0.08)]" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="px-4 py-4" style={{ background: 'rgba(168,85,247,0.16)' }}>
          <div className="flex items-center gap-3">
            <div className="w-[72px] h-[72px] rounded-xl flex items-center justify-center overflow-hidden p-1 bg-white/10">
              <img src="/icons/car-bike/Car.svg" alt="car" className="w-10 h-10 opacity-50" style={{ filter: 'var(--ds-icon-filter)' }} />
            </div>
            <div>
              <h3 className="text-[18px] font-semibold text-white">Maruti Suzuki Swift</h3>
              <p className="text-[12px] mt-1 text-white/50">VXi &bull; PETROL &bull; 2022</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 space-y-4">
          <div>
            <p className="text-[14px] text-white/50">Registration</p>
            <p className="text-[14px] font-semibold mt-1 tracking-[0.01em] text-white">KA 01 AB 1234</p>
          </div>
          <div>
            <p className="text-[14px] text-white/50">Current Insurance</p>
            <p className="text-[14px] font-semibold mt-1 text-white">ICICI Lombard</p>
          </div>
          <div>
            <p className="text-[14px] text-white/50">Policy expiry</p>
            <p className="text-[14px] font-semibold mt-1 text-white">15 Apr 2026</p>
          </div>
          <div>
            <p className="text-[14px] text-white/50">NCB (No Claim Bonus)</p>
            <p className="text-[14px] font-semibold mt-1 text-white">50%</p>
          </div>

          <div className="pt-1">
            <button
              onClick={() => setConfirmed(true)}
              disabled={confirmed}
              className="w-full h-12 rounded-lg text-[14px] font-semibold transition-colors active:scale-[0.97] disabled:opacity-60 bg-purple-600 text-white"
            >
              {confirmed ? 'Confirmed' : 'This is correct'}
            </button>
            <button className="mt-2 w-full h-10 text-[14px] font-medium transition-colors text-white/50">
              This is not my vehicle
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


function DemoKycBottomSheet() {
  const [stage, setStage] = useState<'info' | 'verify'>('info');

  return (
    <div className="max-w-md mx-auto">
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-[22px] font-bold leading-tight text-white">Complete KYC</p>
              <p className="text-[13px] mt-1.5 leading-snug text-white/50">
                {stage === 'info'
                  ? 'HyperVerge, our reliable partner, will handle the KYC process for you with 100% security'
                  : 'Complete the steps below to verify your identity and activate your policy'}
              </p>
            </div>
            <button onClick={() => setStage('info')} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-white/10">
              <img src="/icons/generic/Close.svg" alt="close" className="w-4 h-4 opacity-50" style={{ filter: 'var(--ds-icon-filter)' }} />
            </button>
          </div>
        </div>

        {stage === 'info' ? (
          <div className="px-5 pb-5">
            <div className="space-y-2 mb-5">
              {[
                { step: '1', title: 'Verify your identity', desc: 'Upload PAN card or Aadhaar' },
                { step: '2', title: 'Take a quick selfie', desc: 'Face match for security' },
                { step: '3', title: 'Instant confirmation', desc: 'Approved in most cases' },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-purple-500/20 border border-purple-400/30">
                    <span className="text-[12px] font-bold text-purple-300">{item.step}</span>
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-white">{item.title}</p>
                    <p className="text-[12px] mt-0.5 text-white/50">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setStage('verify')} className="w-full py-3.5 rounded-xl text-[15px] font-semibold transition-all active:scale-[0.97] bg-purple-600 text-white">
              Start KYC Verification
            </button>
            <button className="mt-2 w-full py-2.5 text-[13px] font-medium text-white/50 hover:text-white/70 transition-colors">
              I&apos;ll do this later
            </button>
          </div>
        ) : (
          <div className="px-5 pb-5">
            <div className="h-[200px] rounded-2xl flex flex-col items-center justify-center gap-3 mb-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="w-7 h-7 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
              <p className="text-[12px] text-white/50">Loading KYC verification...</p>
            </div>
            <button onClick={() => setStage('info')} className="w-full py-3.5 rounded-xl text-[15px] font-semibold transition-all active:scale-[0.97] bg-purple-600 text-white">
              I&apos;ve Completed Verification
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


function DemoChatMessage() {
  return (
    <div className="space-y-3 max-w-md">
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
          <img src="/icons/generic/Customer service.svg" alt="bot" className="w-4 h-4" style={{ filter: 'var(--ds-icon-filter)' }} />
        </div>
        <div className="bg-white/10 border border-white/10 rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
          <p className="text-[14px] text-white/90 leading-relaxed">Hi there! I&apos;m your ACKO assistant. Let&apos;s find the perfect insurance plan for you.</p>
        </div>
      </div>
      <div className="flex justify-end">
        <div className="bg-purple-600/30 border border-purple-400/30 rounded-2xl rounded-tr-md px-4 py-3 max-w-[85%]">
          <p className="text-[14px] text-white/90">I want health insurance for my family</p>
        </div>
      </div>
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
          <img src="/icons/generic/Customer service.svg" alt="bot" className="w-4 h-4" style={{ filter: 'var(--ds-icon-filter)' }} />
        </div>
        <div className="bg-white/10 border border-white/10 rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
          <p className="text-[14px] text-white/90 leading-relaxed">Great choice! Who all do you want to cover?</p>
        </div>
      </div>
    </div>
  );
}

function DemoPostPaymentTimeline() {
  const steps = [
    { icon: '/icons/generic/Phone.svg', title: 'Tele-Medical Call', desc: 'Quick health assessment call', time: 'Within 24 hrs' },
    { icon: '/icons/health-life/hospital.svg', title: 'Medical Tests', desc: 'Basic health tests if needed', time: '2-3 days' },
    { icon: '/icons/generic/Policy document.svg', title: 'Income Verification', desc: 'Submit income proof', time: 'Upload anytime' },
    { icon: '/icons/generic/magnifier.svg', title: 'Underwriting Review', desc: 'Team reviews everything', time: '2-3 business days' },
    { icon: '/icons/generic/Verify.svg', title: 'Final Approval', desc: 'Policy becomes active!', time: 'Same day' },
  ];

  return (
    <div className="max-w-md">
      <div className="bg-white/10 border border-white/15 rounded-2xl p-5">
        <h3 className="text-[16px] font-bold text-white mb-4">What happens next</h3>
        <div className="space-y-0">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <img src={s.icon} alt={s.title} className="w-5 h-5 opacity-80" style={{ filter: 'var(--ds-icon-filter)' }} />
                </div>
                {i < steps.length - 1 && <div className="w-0.5 h-6 bg-white/10" />}
              </div>
              <div className="pb-4">
                <p className="text-[14px] font-medium text-white">{s.title}</p>
                <p className="text-[12px] text-white/50">{s.desc}</p>
                <p className="text-[11px] text-purple-300 mt-0.5">{s.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DemoAppDownloadCta() {
  return (
    <div className="max-w-md space-y-3">
      <div className="bg-white/10 border border-white/15 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <img src="/icons/generic/App.svg" alt="app" className="w-6 h-6" style={{ filter: 'var(--ds-icon-filter)' }} />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-white">ACKO App</p>
            <p className="text-[11px] text-white/50">Manage everything on the go</p>
          </div>
        </div>
        <div className="space-y-2.5 mb-5">
          {['Instant claim filing with photos', 'Roadside assistance in 30 min', '24/7 policy management'].map((feat, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <img src="/icons/generic/Tick.svg" alt="check" className="w-4 h-4 flex-shrink-0" style={{ filter: 'brightness(0) saturate(100%) invert(65%) sepia(52%) saturate(600%) hue-rotate(90deg)' }} />
              <span className="text-[12px] text-white/70">{feat}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button className="flex-1 py-3 rounded-xl text-[13px] font-semibold text-white bg-white/10 border border-white/15 hover:bg-white/15 transition-colors">
            App Store
          </button>
          <button className="flex-1 py-3 rounded-xl text-[13px] font-semibold text-white bg-white/10 border border-white/15 hover:bg-white/15 transition-colors">
            Play Store
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   LOB-specific Chat Message variants
   ═══════════════════════════════════════════════ */

function DemoChatMessageHealth() {
  return (
    <div className="space-y-3 max-w-md">
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
          <img src="/icons/generic/Customer service.svg" alt="bot" className="w-4 h-4" style={{ filter: 'var(--ds-icon-filter)' }} />
        </div>
        <div className="bg-white/10 border border-white/10 rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
          <p className="text-[14px] text-white/90 leading-relaxed">Hi! Let&apos;s find the best health plan for your family. How many members do you want to cover?</p>
        </div>
      </div>
      <div className="flex justify-end">
        <div className="bg-emerald-600/30 border border-emerald-400/30 rounded-2xl rounded-tr-md px-4 py-3 max-w-[85%]">
          <p className="text-[14px] text-white/90">Me, my wife, and 2 kids</p>
        </div>
      </div>
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
          <img src="/icons/generic/Customer service.svg" alt="bot" className="w-4 h-4" style={{ filter: 'var(--ds-icon-filter)' }} />
        </div>
        <div className="bg-white/10 border border-white/10 rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
          <p className="text-[14px] text-white/90 leading-relaxed">Great! A family floater plan will give you the best value. What&apos;s your pincode?</p>
        </div>
      </div>
    </div>
  );
}

function DemoChatMessageMotor() {
  return (
    <div className="space-y-3 max-w-md">
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
          <img src="/icons/generic/Customer service.svg" alt="bot" className="w-4 h-4" style={{ filter: 'var(--ds-icon-filter)' }} />
        </div>
        <div className="bg-white/10 border border-white/10 rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
          <p className="text-[14px] text-white/90 leading-relaxed">Welcome! Let&apos;s get your vehicle insured. Please enter your registration number.</p>
        </div>
      </div>
      <div className="flex justify-end">
        <div className="bg-blue-600/30 border border-blue-400/30 rounded-2xl rounded-tr-md px-4 py-3 max-w-[85%]">
          <p className="text-[14px] text-white/90">KA 01 AB 1234</p>
        </div>
      </div>
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
          <img src="/icons/generic/Customer service.svg" alt="bot" className="w-4 h-4" style={{ filter: 'var(--ds-icon-filter)' }} />
        </div>
        <div className="bg-white/10 border border-white/10 rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
          <p className="text-[14px] text-white/90 leading-relaxed">Found it! Maruti Suzuki Swift VXi Petrol 2022. Is this correct?</p>
        </div>
      </div>
    </div>
  );
}

function DemoChatMessageLife() {
  return (
    <div className="space-y-3 max-w-md">
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
          <img src="/icons/generic/Customer service.svg" alt="bot" className="w-4 h-4" style={{ filter: 'var(--ds-icon-filter)' }} />
        </div>
        <div className="bg-white/10 border border-white/10 rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
          <p className="text-[14px] text-white/90 leading-relaxed">Let&apos;s find the right life insurance cover for you. What&apos;s your annual income?</p>
        </div>
      </div>
      <div className="flex justify-end">
        <div className="bg-amber-600/30 border border-amber-400/30 rounded-2xl rounded-tr-md px-4 py-3 max-w-[85%]">
          <p className="text-[14px] text-white/90">Around 18 lakhs per year</p>
        </div>
      </div>
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
          <img src="/icons/generic/Customer service.svg" alt="bot" className="w-4 h-4" style={{ filter: 'var(--ds-icon-filter)' }} />
        </div>
        <div className="bg-white/10 border border-white/10 rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
          <p className="text-[14px] text-white/90 leading-relaxed">Based on your income, I&apos;d recommend a ₹1.5 Cr cover. Do you smoke?</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Main Design System Page
   ═══════════════════════════════════════════════ */

type ThemeMode = 'dark' | 'light';

const DS_THEME_STYLES = `
/* ═══════════════════════════════════════════════
   DS-level tokens (used by all showcase widgets)
   ═══════════════════════════════════════════════ */
[data-ds-theme="dark"] {
  --ds-bg: #121214;
  --ds-bg-95: rgba(18,18,20,0.95);
  --ds-surface: #1E1E22;
  --ds-surface-2: #2D2D35;
  --ds-surface-hover: #3D3D45;
  --ds-text: #FFFFFF;
  --ds-text-secondary: #94A3B8;
  --ds-text-tertiary: #64748B;
  --ds-border: rgba(255,255,255,0.05);
  --ds-border-strong: rgba(255,255,255,0.1);
  --ds-border-subtle: rgba(255,255,255,0.05);
  --ds-icon-filter: brightness(0) invert(1);
  --ds-icon-opacity: 0.85;
  --ds-card-bg: rgba(255,255,255,0.08);
  --ds-card-border: rgba(168,85,247,0.3);
  --ds-input-bg: rgba(255,255,255,0.05);
  --ds-input-border: rgba(255,255,255,0.1);
  --ds-input-text: #FFFFFF;
  --ds-input-placeholder: rgba(255,255,255,0.3);
  --ds-badge-bg: rgba(124,58,237,0.2);
  --ds-badge-text: #C4B5FD;
  --ds-badge-border: rgba(168,85,247,0.3);
  --ds-cat-active-bg: rgba(168,85,247,0.30);
  --ds-cat-active-text: #C4B5FD;
  --ds-cat-active-border: rgba(168,85,247,0.30);
  --ds-cat-bg: rgba(255,255,255,0.05);
  --ds-cat-text: rgba(255,255,255,0.50);
  --ds-version-bg: rgba(255,255,255,0.05);
  --ds-version-text: rgba(255,255,255,0.40);
  --ds-version-border: rgba(255,255,255,0.10);
  --ds-accent: #7C3AED;
  --ds-accent-bg: rgba(124,58,237,0.2);
  --ds-link: #C4B5FD;
  --ds-success: #4ADE80;
  --ds-success-bg: rgba(74,222,128,0.15);
  --ds-warning-bg: rgba(251,191,36,0.10);
  --ds-warning-text: #fbbf24;
  --ds-error-bg: rgba(248,113,113,0.10);
  --ds-error-text: #f87171;
  --ds-selected-bg: rgba(168,85,247,0.15);
  --ds-selected-border: rgba(168,85,247,0.5);
  --ds-cta-bg: #7C3AED;
  --ds-cta-hover: #6D28D9;
  --ds-cta-text: #FFFFFF;
  --ds-progress-bg: rgba(255,255,255,0.10);
  --ds-progress-fill: linear-gradient(90deg,#7C3AED,#A78BFA);
  --ds-overlay-bg: rgba(255,255,255,0.08);
  --ds-glass-bg: rgba(30,30,34,0.92);
  --ds-header-bg: #121214;
  --ds-divider: rgba(255,255,255,0.08);
  --ds-tab-bg: rgba(255,255,255,0.06);
  --ds-tab-inactive: rgba(255,255,255,0.4);
  --ds-bot-text: #F8FAFC;
  --ds-user-bubble-bg: #FFFFFF;
  --ds-user-bubble-text: #1C0B47;
  --ds-bubble-bg: rgba(255,255,255,0.08);
  --ds-bubble-border: rgba(255,255,255,0.10);
  --ds-feature-check: #4ADE80;

  /* ── App tokens (Health / Life / Home) ── */
  --app-bg: #121214;
  --app-surface: #1E1E22;
  --app-surface-2: #2D2D35;
  --app-surface-hover: #3D3D45;
  --app-text: #FFFFFF;
  --app-text-muted: #94A3B8;
  --app-text-subtle: #64748B;
  --app-border: rgba(255,255,255,0.05);
  --app-border-strong: rgba(255,255,255,0.1);
  --app-header-bg: #121214;
  --app-overlay-bg: rgba(255,255,255,0.08);
  --app-glass-bg: rgba(30,30,34,0.92);
  --app-accent: #7C3AED;
  --app-link: #C4B5FD;
  --app-divider: rgba(255,255,255,0.08);
  --app-input-bg: rgba(255,255,255,0.05);
  --app-input-border: rgba(255,255,255,0.1);
  --app-input-text: #FFFFFF;
  --app-input-placeholder: rgba(255,255,255,0.3);
  --app-badge-bg: rgba(124,58,237,0.2);
  --app-badge-text: #C4B5FD;
  --app-badge-border: rgba(168,85,247,0.3);
  --app-feature-check: #4ADE80;
  --app-plan-card-bg: rgba(255,255,255,0.08);
  --app-plan-card-border: rgba(168,85,247,0.3);
  --app-tab-bg: rgba(255,255,255,0.06);
  --app-tab-inactive: rgba(255,255,255,0.4);
  --app-bot-text: #F8FAFC;
  --app-user-bubble-bg: #FFFFFF;
  --app-user-bubble-text: #1C0B47;

  /* ── Motor tokens ── */
  --motor-bg: #121214;
  --motor-surface: #1E1E22;
  --motor-surface-2: #2D2D35;
  --motor-surface-hover: #3D3D45;
  --motor-text: #FFFFFF;
  --motor-text-muted: #94A3B8;
  --motor-text-subtle: #64748B;
  --motor-border: rgba(255,255,255,0.05);
  --motor-border-strong: rgba(255,255,255,0.1);
  --motor-overlay-bg: rgba(255,255,255,0.08);
  --motor-glass-bg: rgba(30,30,34,0.92);
  --motor-cta-bg: #7C3AED;
  --motor-cta-hover: #6D28D9;
  --motor-cta-text: #FFFFFF;
  --motor-selected-bg: rgba(168,85,247,0.15);
  --motor-selected-border: rgba(168,85,247,0.5);
  --motor-input-bg: rgba(255,255,255,0.05);
  --motor-input-border: rgba(255,255,255,0.1);
  --motor-input-text: #FFFFFF;
  --motor-input-placeholder: rgba(255,255,255,0.3);
  --motor-plan-rec-badge: #C084FC;
  --motor-plan-rec-check: #34D399;
  --motor-bot-text: #F8FAFC;
  --motor-user-bubble-bg: #FFFFFF;
  --motor-user-bubble-text: #1C0B47;
  --motor-icon-filter: brightness(0) invert(1);
  --motor-icon-opacity: 0.85;
}

[data-ds-theme="light"] {
  --ds-bg: #EDE9FA;
  --ds-bg-95: rgba(237,233,250,0.95);
  --ds-surface: #FFFFFF;
  --ds-surface-2: #F3F0FC;
  --ds-surface-hover: #E8E3F5;
  --ds-text: #111827;
  --ds-text-secondary: #6B7280;
  --ds-text-tertiary: #9CA3AF;
  --ds-border: rgba(0,0,0,0.06);
  --ds-border-strong: rgba(0,0,0,0.1);
  --ds-border-subtle: rgba(0,0,0,0.06);
  --ds-icon-filter: brightness(0);
  --ds-icon-opacity: 0.7;
  --ds-card-bg: #FFFFFF;
  --ds-card-border: rgba(109,40,217,0.2);
  --ds-input-bg: rgba(0,0,0,0.03);
  --ds-input-border: rgba(0,0,0,0.1);
  --ds-input-text: #1C0B47;
  --ds-input-placeholder: rgba(0,0,0,0.3);
  --ds-badge-bg: rgba(109,40,217,0.08);
  --ds-badge-text: #5B21B6;
  --ds-badge-border: rgba(109,40,217,0.2);
  --ds-cat-active-bg: rgba(109,40,217,0.12);
  --ds-cat-active-text: #6D28D9;
  --ds-cat-active-border: rgba(109,40,217,0.25);
  --ds-cat-bg: rgba(0,0,0,0.04);
  --ds-cat-text: rgba(0,0,0,0.50);
  --ds-version-bg: rgba(0,0,0,0.04);
  --ds-version-text: rgba(0,0,0,0.40);
  --ds-version-border: rgba(0,0,0,0.10);
  --ds-accent: #6D28D9;
  --ds-accent-bg: rgba(109,40,217,0.08);
  --ds-link: #6D28D9;
  --ds-success: #059669;
  --ds-success-bg: rgba(5,150,105,0.10);
  --ds-warning-bg: rgba(245,158,11,0.10);
  --ds-warning-text: #d97706;
  --ds-error-bg: rgba(239,68,68,0.10);
  --ds-error-text: #dc2626;
  --ds-selected-bg: rgba(168,85,247,0.1);
  --ds-selected-border: rgba(168,85,247,0.4);
  --ds-cta-bg: #6D28D9;
  --ds-cta-hover: #5B21B6;
  --ds-cta-text: #FFFFFF;
  --ds-progress-bg: rgba(0,0,0,0.08);
  --ds-progress-fill: linear-gradient(90deg,#6D28D9,#7C3AED);
  --ds-overlay-bg: rgba(0,0,0,0.04);
  --ds-glass-bg: rgba(255,255,255,0.95);
  --ds-header-bg: #EDE9FA;
  --ds-divider: rgba(0,0,0,0.06);
  --ds-tab-bg: rgba(0,0,0,0.04);
  --ds-tab-inactive: rgba(0,0,0,0.4);
  --ds-bot-text: #1C0B47;
  --ds-user-bubble-bg: linear-gradient(0deg,#5920C5,#7C47E1);
  --ds-user-bubble-text: #FFFFFF;
  --ds-bubble-bg: #FFFFFF;
  --ds-bubble-border: rgba(0,0,0,0.10);
  --ds-feature-check: #059669;

  /* ── App tokens (Health / Life / Home) ── */
  --app-bg: #EDE9FA;
  --app-surface: #FFFFFF;
  --app-surface-2: #F3F0FC;
  --app-surface-hover: #E8E3F5;
  --app-text: #111827;
  --app-text-muted: #6B7280;
  --app-text-subtle: #9CA3AF;
  --app-border: rgba(0,0,0,0.06);
  --app-border-strong: rgba(0,0,0,0.1);
  --app-header-bg: #EDE9FA;
  --app-overlay-bg: rgba(0,0,0,0.04);
  --app-glass-bg: rgba(255,255,255,0.95);
  --app-accent: #6D28D9;
  --app-link: #6D28D9;
  --app-divider: rgba(0,0,0,0.06);
  --app-input-bg: rgba(0,0,0,0.03);
  --app-input-border: rgba(0,0,0,0.1);
  --app-input-text: #1C0B47;
  --app-input-placeholder: rgba(0,0,0,0.3);
  --app-badge-bg: rgba(109,40,217,0.08);
  --app-badge-text: #5B21B6;
  --app-badge-border: rgba(109,40,217,0.2);
  --app-feature-check: #059669;
  --app-plan-card-bg: #FFFFFF;
  --app-plan-card-border: rgba(109,40,217,0.2);
  --app-tab-bg: rgba(0,0,0,0.04);
  --app-tab-inactive: rgba(0,0,0,0.4);
  --app-bot-text: #1C0B47;
  --app-user-bubble-bg: linear-gradient(0deg,#5920C5,#7C47E1);
  --app-user-bubble-text: #FFFFFF;

  /* ── Motor tokens ── */
  --motor-bg: #F8F7FC;
  --motor-surface: #FFFFFF;
  --motor-surface-2: #FFFFFF;
  --motor-surface-hover: #F3F1FA;
  --motor-text: #1C0B47;
  --motor-text-muted: #4B5563;
  --motor-text-subtle: #6B7280;
  --motor-border: rgba(0,0,0,0.08);
  --motor-border-strong: rgba(0,0,0,0.14);
  --motor-overlay-bg: rgba(0,0,0,0.04);
  --motor-glass-bg: rgba(255,255,255,0.95);
  --motor-cta-bg: #6D28D9;
  --motor-cta-hover: #5B21B6;
  --motor-cta-text: #FFFFFF;
  --motor-selected-bg: rgba(168,85,247,0.1);
  --motor-selected-border: rgba(168,85,247,0.4);
  --motor-input-bg: rgba(0,0,0,0.03);
  --motor-input-border: rgba(0,0,0,0.1);
  --motor-input-text: #1C0B47;
  --motor-input-placeholder: rgba(0,0,0,0.3);
  --motor-plan-rec-badge: #6D28D9;
  --motor-plan-rec-check: #059669;
  --motor-bot-text: #1C0B47;
  --motor-user-bubble-bg: linear-gradient(0deg,#5920C5,#7C47E1);
  --motor-user-bubble-text: #FFFFFF;
  --motor-icon-filter: brightness(0);
  --motor-icon-opacity: 0.7;
}

/* ═══════════════════════════════════════════════
   Scoped Tailwind overrides for light theme
   Text-white → dark text, matching skill spec
   ═══════════════════════════════════════════════ */
[data-ds-theme="light"] .text-white { color: var(--ds-text) !important; }
[data-ds-theme="light"] .text-white\\/90 { color: var(--ds-text) !important; }
[data-ds-theme="light"] .text-white\\/80 { color: var(--ds-text) !important; }
[data-ds-theme="light"] .text-white\\/70 { color: var(--ds-text-secondary) !important; }
[data-ds-theme="light"] .text-white\\/60 { color: var(--ds-text-secondary) !important; }
[data-ds-theme="light"] .text-white\\/50 { color: var(--ds-text-secondary) !important; }
[data-ds-theme="light"] .text-white\\/40 { color: var(--ds-text-tertiary) !important; }
[data-ds-theme="light"] .text-white\\/30 { color: var(--ds-text-tertiary) !important; }

[data-ds-theme="light"] .bg-white\\/5 { background-color: rgba(0,0,0,0.03) !important; }
[data-ds-theme="light"] .bg-white\\/10 { background-color: rgba(0,0,0,0.05) !important; }
[data-ds-theme="light"] .bg-white\\/15 { background-color: rgba(0,0,0,0.07) !important; }
[data-ds-theme="light"] .bg-white\\/20 { background-color: rgba(0,0,0,0.08) !important; }

[data-ds-theme="light"] .border-white\\/5 { border-color: rgba(0,0,0,0.05) !important; }
[data-ds-theme="light"] .border-white\\/10 { border-color: rgba(0,0,0,0.08) !important; }
[data-ds-theme="light"] .border-white\\/15 { border-color: rgba(0,0,0,0.12) !important; }
[data-ds-theme="light"] .border-white\\/20 { border-color: rgba(0,0,0,0.12) !important; }
[data-ds-theme="light"] .border-white\\/30 { border-color: rgba(0,0,0,0.18) !important; }

[data-ds-theme="light"] .placeholder-white\\/30::placeholder { color: rgba(0,0,0,0.30) !important; }
[data-ds-theme="light"] .placeholder-white\\/40::placeholder { color: rgba(0,0,0,0.40) !important; }
[data-ds-theme="light"] .placeholder\\:text-white\\/30::placeholder { color: rgba(0,0,0,0.30) !important; }
[data-ds-theme="light"] .placeholder\\:text-white\\/40::placeholder { color: rgba(0,0,0,0.40) !important; }

[data-ds-theme="light"] .hover\\:bg-white\\/10:hover { background-color: rgba(0,0,0,0.06) !important; }
[data-ds-theme="light"] .hover\\:border-white\\/20:hover { border-color: rgba(0,0,0,0.12) !important; }
[data-ds-theme="light"] .hover\\:text-white\\/70:hover { color: var(--ds-text-secondary) !important; }
[data-ds-theme="light"] .focus\\:bg-white\\/15:focus { background-color: rgba(0,0,0,0.07) !important; }

[data-ds-theme="light"] .bg-\\[\\#121214\\] { background-color: #EDE9FA !important; }
[data-ds-theme="light"] .bg-\\[\\#0a0a12\\] { background-color: #EDE9FA !important; }

[data-ds-theme="light"] .shadow-purple-900\\/20 { --tw-shadow-color: rgba(109,40,217,0.12) !important; }

[data-ds-theme="light"] .divide-white\\/5 > :not([hidden]) ~ :not([hidden]) { border-color: rgba(0,0,0,0.06) !important; }

[data-ds-theme="light"] .from-white\\/10 { --tw-gradient-from: rgba(0,0,0,0.06) !important; }
[data-ds-theme="light"] .to-white\\/5 { --tw-gradient-to: rgba(0,0,0,0.03) !important; }

/* Colored bg buttons keep white text in light mode */
[data-ds-theme="light"] [class*="bg-purple-"] { color: #FFFFFF !important; }
[data-ds-theme="light"] [class*="bg-violet-"] { color: #FFFFFF !important; }
[data-ds-theme="light"] [class*="bg-green-"] { color: #FFFFFF !important; }
[data-ds-theme="light"] [class*="bg-red-"] { color: #FFFFFF !important; }
[data-ds-theme="light"] [class*="bg-blue-"] { color: #FFFFFF !important; }

/* Inline gradients always keep white text */
[data-ds-theme="light"] [style*="linear-gradient"] { color: #FFFFFF !important; }

/* Colored status tag backgrounds soften in light mode */
[data-ds-theme="light"] .bg-emerald-500\\/15 { background-color: rgba(16,185,129,0.12) !important; }
[data-ds-theme="light"] .bg-emerald-500\\/20 { background-color: rgba(16,185,129,0.12) !important; }
[data-ds-theme="light"] .bg-amber-500\\/15 { background-color: rgba(245,158,11,0.12) !important; }
[data-ds-theme="light"] .bg-red-500\\/15 { background-color: rgba(239,68,68,0.12) !important; }
[data-ds-theme="light"] .bg-blue-500\\/15 { background-color: rgba(59,130,246,0.12) !important; }
[data-ds-theme="light"] .bg-violet-500\\/20 { background-color: rgba(139,92,246,0.12) !important; }
`;

export default function DesignSystemPage() {
  const [activeLob, setActiveLob] = useState<LobTab>('base');
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');

  return (
    <div data-ds-theme={themeMode} className="min-h-screen transition-colors duration-300" style={{ background: 'var(--ds-bg)', color: 'var(--ds-text)' }}>
      <style dangerouslySetInnerHTML={{ __html: DS_THEME_STYLES }} />
      <div className="sticky top-0 z-50 backdrop-blur-xl transition-colors duration-300" style={{ background: 'var(--ds-bg-95)', borderBottom: '1px solid var(--ds-border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-[24px] font-bold" style={{ color: 'var(--ds-text)' }}>ACKO Chat Design System</h1>
              <p className="text-[13px]" style={{ color: 'var(--ds-text-secondary)' }}>17 unified components across Health, Motor &amp; Life</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--ds-border)', background: 'var(--ds-surface)' }}>
                {([
                  { id: 'light' as ThemeMode, label: 'Light', icon: 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z' },
                  { id: 'dark' as ThemeMode, label: 'Dark', icon: 'M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z' },
                ]).map(t => (
                  <button key={t.id} onClick={() => setThemeMode(t.id)} title={t.label}
                    className="px-2.5 py-1.5 flex items-center gap-1.5 text-[11px] font-medium transition-all"
                    style={{ background: themeMode === t.id ? 'var(--ds-cat-active-bg)' : 'transparent', color: themeMode === t.id ? 'var(--ds-cat-active-text)' : 'var(--ds-cat-text)' }}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={t.icon} />
                    </svg>
                    {t.label}
                  </button>
                ))}
              </div>
              <span className="text-[11px] px-3 py-1.5 rounded-lg" style={{ color: 'var(--ds-version-text)', background: 'var(--ds-version-bg)', border: '1px solid var(--ds-version-border)' }}>v3.0</span>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {LOB_TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveLob(tab.id)}
                className="px-4 py-2 rounded-lg text-[13px] font-semibold transition-all whitespace-nowrap"
                style={{
                  background: activeLob === tab.id ? 'var(--ds-cat-active-bg)' : 'var(--ds-cat-bg)',
                  color: activeLob === tab.id ? 'var(--ds-cat-active-text)' : 'var(--ds-cat-text)',
                  border: activeLob === tab.id ? '1px solid var(--ds-cat-active-border)' : '1px solid transparent',
                }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-12">

        {/* ════════════════════════════════════════
           BASE TAB — All 17 unique component patterns
           ════════════════════════════════════════ */}
        {activeLob === 'base' && (
          <>
            {/* Chat Fundamentals */}
            <section>
              <SectionHeader title="ChatMessage" description="Bot and user message bubbles — the foundation of conversational UI" />
              <div className="grid grid-cols-1 gap-6">
                <WidgetCard title="Chat Bubbles" widgetType="ChatMessage — bot/user alternating">
                  <DemoChatMessage />
                </WidgetCard>
              </div>
            </section>

            {/* Selection & Input */}
            <section>
              <SectionHeader title="SelectionCards" description="Unified single-select component — layout adapts via props: grid, list, compact-grid, radio, plan" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title='layout="grid"' widgetType="≤4 options with icons → 2-col icon grid">
                  <UnifiedSelectionCards layout="grid" options={[
                    { id: 'opt1', label: 'Option A', icon: 'user' },
                    { id: 'opt2', label: 'Option B', icon: 'heart' },
                    { id: 'opt3', label: 'Option C', icon: 'building' },
                    { id: 'opt4', label: 'Option D', icon: 'gift', badge: 'New' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
                <WidgetCard title='layout="list"' widgetType="Stacked list — descriptions, icons, badges">
                  <UnifiedSelectionCards layout="list" options={[
                    { id: 'a', label: 'Primary', icon: 'user', description: 'Main option with details' },
                    { id: 'b', label: 'Secondary', icon: 'heart', description: 'Alternative option' },
                    { id: 'c', label: 'Tertiary', description: 'No icon — label only', badge: 'Popular' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
                <WidgetCard title='layout="compact-grid"' widgetType="Label-only → frequency, percentages, years">
                  <UnifiedSelectionCards layout="compact-grid" columns={3} options={[
                    { id: '1', label: '10%' }, { id: '2', label: '20%' }, { id: '3', label: '30%' },
                    { id: '4', label: '40%' }, { id: '5', label: '50%' }, { id: '6', label: '60%' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
                <WidgetCard title='layout="radio"' widgetType="Binary yes/no toggle">
                  <UnifiedSelectionCards layout="radio" options={[
                    { id: 'yes', label: 'Yes, proceed' },
                    { id: 'no', label: 'No, skip' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="GridSelector" description="Multi-select grid with search — icons or initials auto-rendered" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Multi-select with icons" widgetType="multiSelect=true — checkmarks on selection">
                  <UnifiedGridSelector multiSelect options={[
                    { id: 'a', label: 'Item 1', icon: 'user' }, { id: 'b', label: 'Item 2', icon: 'heart' },
                    { id: 'c', label: 'Item 3', icon: 'building' }, { id: 'd', label: 'Item 4', icon: 'child' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
                <WidgetCard title="Searchable single-select" widgetType="searchable=true — filterable, initials auto-render">
                  <UnifiedGridSelector columns={3} searchable options={[
                    { id: 'a', label: 'Alpha' }, { id: 'b', label: 'Bravo' }, { id: 'c', label: 'Charlie' },
                    { id: 'd', label: 'Delta' }, { id: 'e', label: 'Echo' }, { id: 'f', label: 'Foxtrot' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="InputField" description="Text, number, currency, pincode, and vehicle registration input variants" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Number Input" widgetType="number_input — numeric with validation">
                  <DemoNumberInput />
                </WidgetCard>
                <WidgetCard title="Text Input" widgetType="text_input — free-form text">
                  <DemoTextInput />
                </WidgetCard>
                <WidgetCard title="Currency Input" widgetType="number_input — with ₹ formatting (K/L/Cr)">
                  <DemoNumberInputWithCurrency />
                </WidgetCard>
                <WidgetCard title="Pincode Input" widgetType="pincode_input — 6-digit with location icon">
                  <DemoPincodeInput />
                </WidgetCard>
                <WidgetCard title="Vehicle Registration" widgetType="vehicle_reg_input — IND prefix, uppercase">
                  <DemoVehicleRegInput />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="DatePicker" description="DD / MM / YYYY date collection with auto-focus advancement" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Date Picker" widgetType="date_picker / dob_collection">
                  <DemoDatePicker />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="RangeSlider" description="Interactive range sliders for coverage, term, and budget selection" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Range Sliders" widgetType="coverage_slider / term_selector — dynamic formula">
                  <DemoPremiumSliders />
                </WidgetCard>
              </div>
            </section>

            {/* Display & Summary */}
            <section>
              <SectionHeader title="SummaryCard" description="Key-value display — read-only or editable rows. Absorbs premium breakdown, confirm details, vehicle info, coverage card" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Read-only" widgetType="review_summary — pre-payment review">
                  <UnifiedSummaryCard title="Plan Summary" subtitle="Review before proceeding" ctaLabel="Proceed to Payment" rows={[
                    { label: 'Name', value: 'Rahul Sharma' }, { label: 'Age', value: '32 years' },
                    { label: 'Plan', value: 'ACKO Platinum' }, { label: 'Cover', value: '₹25,00,000' },
                    { label: 'Premium', value: '₹12,999/year' },
                  ]} />
                </WidgetCard>
                <WidgetCard title="Editable" widgetType="editable_summary — pencil icons per row">
                  <UnifiedSummaryCard title="Vehicle Summary" editable ctaLabel="View Prices" rows={[
                    { label: 'Make', value: 'Maruti Suzuki' }, { label: 'Model', value: 'Swift' },
                    { label: 'Variant', value: 'VXi' }, { label: 'Fuel', value: 'Petrol' },
                    { label: 'Status', value: 'Active', editable: false },
                  ]} />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="StepProgress" description="Sequential step displays — animated loaders, calculation theaters, status trackers, and timelines" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Animated Loader" widgetType="progressive_loader — progress bar with step text">
                  <DemoProgressiveLoader />
                </WidgetCard>
                <WidgetCard title="Calculation Theater" widgetType="calculation — circular progress with step checklist">
                  <DemoCalculationTheater />
                </WidgetCard>
                <WidgetCard title="Status Tracker" widgetType="policy_tracker — done/pending step chain">
                  <DemoPolicyTracker />
                </WidgetCard>
                <WidgetCard title="Timeline" widgetType="post_payment_timeline — icon + text step chain">
                  <DemoPostPaymentTimeline />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="SearchableList" description="Filterable card list with icons, metadata, and distance — used for hospitals, garages, etc." />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Searchable List" widgetType="hospital_list / searchable_list">
                  <DemoHospitalList />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="ComparisonCard" description="Covered vs gap checklist — side-by-side comparison with status dots" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Comparison Card" widgetType="gap_results / comparison_card">
                  <DemoGapAnalysis />
                </WidgetCard>
              </div>
            </section>

            {/* Actions */}
            <section>
              <SectionHeader title="ConsentWidget" description="Checkbox with terms & conditions links and CTA button" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Consent" widgetType="consent — checkbox + T&C + CTA">
                  <DemoConsentWidget />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="PaymentGateway" description="Payment method selection with amount display — UPI, Card, Net Banking, Wallet" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Payment Gateway" widgetType="payment_gateway / payment_widget">
                  <DemoPaymentGateway />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="FileUpload" description="Document upload with extraction animation — idle → extracting → done" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="File Upload" widgetType="pdf_upload / file_upload">
                  <DemoPdfUpload />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="SchedulePicker" description="Multi-section picker — date, time slot, and provider selection" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Schedule Picker" widgetType="lab_schedule_widget / schedule_picker">
                  <DemoLabSchedule />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="VerificationFlow" description="Step-by-step identity verification — info screen → verification loading" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Verification Flow" widgetType="kyc_verification / ekyc_screen">
                  <DemoKycBottomSheet />
                </WidgetCard>
              </div>
            </section>

            {/* Completion */}
            <section>
              <SectionHeader title="Celebration" description="Success screen with confetti, policy details, and status badge" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Celebration" widgetType="celebration / motor_celebration">
                  <DemoCelebration />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="NpsFeedback" description="5-point emoji scale with optional text feedback" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="NPS Feedback" widgetType="nps_feedback">
                  <DemoNpsFeedback />
                </WidgetCard>
              </div>
            </section>

            <section className="pb-12">
              <SectionHeader title="AppDownloadCta" description="App promotion with feature list and store buttons" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="App Download CTA" widgetType="app_download_cta">
                  <DemoAppDownloadCta />
                </WidgetCard>
              </div>
            </section>
          </>
        )}

        {/* ════════════════════════════════════════
           HEALTH TAB — 15 components with health-specific data
           ════════════════════════════════════════ */}
        {activeLob === 'health' && (
          <>
            <section>
              <SectionHeader title="ChatMessage" description="Health journey conversation — family coverage discussion" />
              <div className="grid grid-cols-1 gap-6">
                <WidgetCard title="Health Chat" widgetType="ChatMessage — health journey">
                  <DemoChatMessageHealth />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="SelectionCards" description="Health-specific selection patterns — persona, family, plan tiers" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Who to cover?" widgetType='layout="grid" — persona selection'>
                  <UnifiedSelectionCards layout="grid" options={[
                    { id: 'self', label: 'Just Me', icon: 'user' },
                    { id: 'family', label: 'My Family', icon: 'family' },
                    { id: 'parents', label: 'Parents', icon: 'child' },
                    { id: 'company', label: 'Corporate', icon: 'building', badge: 'New' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
                <WidgetCard title="Policy intent" widgetType='layout="list" — buy/renew/switch'>
                  <UnifiedSelectionCards layout="list" options={[
                    { id: 'new', label: 'New Policy', description: 'First time buying health insurance' },
                    { id: 'renew', label: 'Renew Policy', description: 'Renew your existing health plan' },
                    { id: 'switch', label: 'Port / Switch', description: 'Move from another insurer', badge: 'Popular' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
                <WidgetCard title="Family members" widgetType="GridSelector — multi-select members">
                  <UnifiedGridSelector multiSelect options={[
                    { id: 'self', label: 'Self', icon: 'user' }, { id: 'spouse', label: 'Spouse', icon: 'heart' },
                    { id: 'mother', label: 'Mother', icon: 'user' }, { id: 'father', label: 'Father', icon: 'user' },
                    { id: 'son', label: 'Son', icon: 'child' }, { id: 'daughter', label: 'Daughter', icon: 'child' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
                <WidgetCard title="Payment frequency" widgetType='layout="compact-grid" — monthly vs yearly'>
                  <UnifiedSelectionCards layout="compact-grid" options={[
                    { id: 'monthly', label: 'Monthly', description: '₹1,247/mo' },
                    { id: 'yearly', label: 'Yearly', description: '₹12,999/yr', badge: 'Save 17%' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
                <WidgetCard title="Plan Switcher" widgetType="plan_switcher — tier tabs with feature comparison">
                  <DemoPlanSwitcher />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="InputField" description="Health-specific inputs — age, pincode, sum insured" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Age input" widgetType="number_input — age with 18-65 validation">
                  <DemoNumberInput />
                </WidgetCard>
                <WidgetCard title="Pincode" widgetType="pincode_input — 6-digit for hospital network">
                  <DemoPincodeInput />
                </WidgetCard>
                <WidgetCard title="Sum insured" widgetType="number_input — currency with ₹K/L/Cr format">
                  <DemoNumberInputWithCurrency />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="DatePicker" description="Date of birth collection for health plan eligibility" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="DOB" widgetType="dob_collection — DD/MM/YYYY">
                  <DemoDatePicker />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="SummaryCard" description="Health policy confirmation — extracted details from existing policy" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Confirm details" widgetType="confirm_details — extracted policy data">
                  <DemoConfirmDetails />
                </WidgetCard>
                <WidgetCard title="Review summary" widgetType="review_summary — pre-payment review">
                  <UnifiedSummaryCard title="Health Plan Summary" subtitle="Review before payment" ctaLabel="Proceed to Payment" rows={[
                    { label: 'Name', value: 'Rahul Sharma' }, { label: 'Age', value: '32 years' },
                    { label: 'Members', value: 'Self + Spouse + 1 Child' }, { label: 'Plan', value: 'ACKO Platinum' },
                    { label: 'Cover', value: '₹25,00,000' }, { label: 'Premium', value: '₹12,999/year' },
                  ]} />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="StepProgress" description="Health calculation theater — plan comparison animation" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Calculation theater" widgetType="calculation — analyzing profile & comparing plans">
                  <DemoCalculationTheater />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="SearchableList" description="Nearby cashless hospital network with distance" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Hospital list" widgetType="hospital_list — 42 cashless hospitals nearby">
                  <DemoHospitalList />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="ComparisonCard" description="Coverage gap analysis — current plan vs ACKO" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Gap analysis" widgetType="gap_results — 5 gaps found in current plan">
                  <DemoGapAnalysis />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="ConsentWidget" description="Health policy terms acceptance" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Health consent" widgetType="consent — T&C acceptance">
                  <DemoConsentWidget />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="FileUpload" description="Existing health policy PDF upload with AI extraction" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Policy PDF upload" widgetType="pdf_upload — Care Health Insurance extraction">
                  <DemoPdfUpload />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="SchedulePicker" description="Lab test scheduling — pick date, time slot, and lab" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Lab test scheduler" widgetType="lab_schedule_widget — date + time + lab">
                  <DemoLabSchedule />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="PaymentGateway" description="Health premium payment — family floater plan" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Health payment" widgetType="payment_widget — health premium ₹12,999">
                  <DemoPaymentGateway />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="Celebration" description="Health policy issuance success" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Health celebration" widgetType="celebration — policy active">
                  <DemoCelebration />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="NpsFeedback" description="Rate your health insurance buying experience" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Health NPS" widgetType="nps_feedback — experience rating">
                  <DemoNpsFeedback />
                </WidgetCard>
              </div>
            </section>

            <section className="pb-12">
              <SectionHeader title="AppDownloadCta" description="Download ACKO app for health claim management" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Health app CTA" widgetType="app_download_cta — claim & manage">
                  <DemoAppDownloadCta />
                </WidgetCard>
              </div>
            </section>
          </>
        )}

        {/* ════════════════════════════════════════
           MOTOR TAB — 10 components with motor-specific data
           ════════════════════════════════════════ */}
        {activeLob === 'motor' && (
          <>
            <section>
              <SectionHeader title="ChatMessage" description="Motor journey conversation — vehicle registration lookup" />
              <div className="grid grid-cols-1 gap-6">
                <WidgetCard title="Motor Chat" widgetType="ChatMessage — motor journey">
                  <DemoChatMessageMotor />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="SelectionCards" description="Motor-specific selections — vehicle type, fuel, NCB, brand" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Vehicle type" widgetType='layout="grid" — car vs bike'>
                  <UnifiedSelectionCards layout="grid" options={[
                    { id: 'car', label: 'Car', icon: 'car' },
                    { id: 'bike', label: 'Bike', icon: 'bike' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
                <WidgetCard title="Fuel type" widgetType='layout="list" — petrol, diesel, CNG, electric'>
                  <UnifiedSelectionCards layout="list" options={[
                    { id: 'petrol', label: 'Petrol', icon: 'fuel', description: 'Most common fuel type' },
                    { id: 'diesel', label: 'Diesel', icon: 'fuel', description: 'Higher mileage' },
                    { id: 'cng', label: 'CNG', icon: 'fuel', description: 'Bi-fuel CNG + Petrol' },
                    { id: 'electric', label: 'Electric', icon: 'flash', description: 'Battery electric vehicle', badge: 'Green' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
                <WidgetCard title="NCB percentage" widgetType='layout="compact-grid" — no claim bonus selector'>
                  <UnifiedSelectionCards layout="compact-grid" columns={3} options={[
                    { id: '0', label: '0%' }, { id: '20', label: '20%' }, { id: '25', label: '25%' },
                    { id: '35', label: '35%' }, { id: '45', label: '45%' }, { id: '50', label: '50%' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
                <WidgetCard title="Brand selector" widgetType="GridSelector — searchable car brands">
                  <UnifiedGridSelector columns={3} searchable options={[
                    { id: 'maruti', label: 'Maruti Suzuki' }, { id: 'hyundai', label: 'Hyundai' },
                    { id: 'tata', label: 'Tata' }, { id: 'kia', label: 'Kia' },
                    { id: 'mahindra', label: 'Mahindra' }, { id: 'toyota', label: 'Toyota' },
                    { id: 'honda', label: 'Honda' }, { id: 'mg', label: 'MG' },
                    { id: 'vw', label: 'Volkswagen' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="InputField" description="Motor-specific inputs — vehicle registration, owner name" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Vehicle registration" widgetType="vehicle_reg_input — IND prefix, uppercase tracking">
                  <DemoVehicleRegInput />
                </WidgetCard>
                <WidgetCard title="Owner name" widgetType="text_input — policy holder name">
                  <DemoTextInput />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="SummaryCard" description="Motor summary — vehicle details, premium breakdown, editable summary" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Vehicle details" widgetType="vehicle_details_card — fetched vehicle info">
                  <DemoVehicleDetailsCard />
                </WidgetCard>
                <WidgetCard title="Premium breakdown" widgetType="premium_breakdown — TP + OD + add-ons - NCB = total">
                  <DemoPremiumBreakdown />
                </WidgetCard>
                <WidgetCard title="Editable summary" widgetType="editable_summary — vehicle details with edit">
                  <UnifiedSummaryCard title="Vehicle Summary" editable ctaLabel="View Prices" rows={[
                    { label: 'Make', value: 'Maruti Suzuki' }, { label: 'Model', value: 'Swift' },
                    { label: 'Variant', value: 'VXi' }, { label: 'Fuel', value: 'Petrol' },
                    { label: 'Registration', value: 'KA 01 AB 1234' }, { label: 'NCB', value: '50%' },
                    { label: 'Policy status', value: 'Active', editable: false },
                  ]} />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="StepProgress" description="Motor step progress — vehicle lookup loader + policy tracker" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Vehicle lookup" widgetType="progressive_loader — checking registration">
                  <DemoProgressiveLoader />
                </WidgetCard>
                <WidgetCard title="Policy tracker" widgetType="policy_tracker — payment → inspection → KYC → issued">
                  <DemoPolicyTracker />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="VerificationFlow" description="Motor KYC — PAN/Aadhaar verification via HyperVerge" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="KYC verification" widgetType="kyc_verification — 3-step identity flow">
                  <DemoKycBottomSheet />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="PaymentGateway" description="Motor premium payment — Maruti Swift comprehensive" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Motor payment" widgetType="payment_gateway — motor premium ₹10,617">
                  <DemoPaymentGateway />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="Celebration" description="Motor policy issuance success" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Motor celebration" widgetType="motor_celebration — policy active">
                  <DemoCelebration />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="NpsFeedback" description="Rate your motor insurance experience" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Motor NPS" widgetType="nps_feedback — experience rating">
                  <DemoNpsFeedback />
                </WidgetCard>
              </div>
            </section>

            <section className="pb-12">
              <SectionHeader title="AppDownloadCta" description="Download ACKO app for roadside assistance and claims" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Motor app CTA" widgetType="app_download_cta — roadside & claims">
                  <DemoAppDownloadCta />
                </WidgetCard>
              </div>
            </section>
          </>
        )}

        {/* ════════════════════════════════════════
           LIFE TAB — 12 components with life-specific data
           ════════════════════════════════════════ */}
        {activeLob === 'life' && (
          <>
            <section>
              <SectionHeader title="ChatMessage" description="Life journey conversation — income and coverage discussion" />
              <div className="grid grid-cols-1 gap-6">
                <WidgetCard title="Life Chat" widgetType="ChatMessage — life journey">
                  <DemoChatMessageLife />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="SelectionCards" description="Life-specific selections — smoking status, frequency, riders" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Smoking status" widgetType='layout="radio" — yes/no binary'>
                  <UnifiedSelectionCards layout="radio" options={[
                    { id: 'yes', label: 'Yes, I smoke or chew tobacco' },
                    { id: 'no', label: 'No, I don\'t use tobacco' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
                <WidgetCard title="Payment frequency" widgetType='layout="compact-grid" — monthly vs yearly'>
                  <UnifiedSelectionCards layout="compact-grid" options={[
                    { id: 'monthly', label: 'Monthly', description: '₹987/mo' },
                    { id: 'yearly', label: 'Yearly', description: '₹9,999/yr', badge: 'Save 15%' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
                <WidgetCard title="Rider selection" widgetType="GridSelector — multi-select riders">
                  <UnifiedGridSelector multiSelect options={[
                    { id: 'ci', label: 'Critical Illness', icon: 'hospital' },
                    { id: 'ad', label: 'Accidental Death', icon: 'alert' },
                    { id: 'wp', label: 'Waiver of Premium', icon: 'coverage' },
                    { id: 'ti', label: 'Terminal Illness', icon: 'medicine' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
                <WidgetCard title="Income range" widgetType='layout="list" — income bracket selection'>
                  <UnifiedSelectionCards layout="list" options={[
                    { id: '5-10', label: '₹5 - 10 Lakh', description: 'Entry level' },
                    { id: '10-20', label: '₹10 - 20 Lakh', description: 'Mid range' },
                    { id: '20-50', label: '₹20 - 50 Lakh', description: 'Senior level' },
                    { id: '50+', label: '₹50 Lakh+', description: 'Executive level', badge: 'High cover' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="InputField" description="Life-specific inputs — annual income, nominee name" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Annual income" widgetType="number_input — currency with ₹K/L/Cr format">
                  <DemoNumberInputWithCurrency />
                </WidgetCard>
                <WidgetCard title="Nominee name" widgetType="text_input — nominee full name">
                  <DemoTextInput />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="DatePicker" description="Date of birth for life insurance premium calculation" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="DOB" widgetType="date_picker — DD/MM/YYYY">
                  <DemoDatePicker />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="RangeSlider" description="Coverage and term sliders — dynamic premium calculation" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Coverage & term sliders" widgetType="coverage_slider + term_selector — ₹25L to ₹10Cr, 10-40 years">
                  <DemoPremiumSliders />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="SummaryCard" description="Life coverage breakdown and review summary" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Coverage breakdown" widgetType="coverage_card — recommended ₹1.5 Cr with breakdown">
                  <DemoCoverageCard />
                </WidgetCard>
                <WidgetCard title="Review summary" widgetType="review_summary — pre-payment plan review">
                  <UnifiedSummaryCard title="Life Plan Summary" subtitle="Review your term plan" ctaLabel="Proceed to Payment" rows={[
                    { label: 'Name', value: 'Rahul Sharma' }, { label: 'Age', value: '32 years' },
                    { label: 'Cover', value: '₹1.5 Cr' }, { label: 'Term', value: '30 years' },
                    { label: 'Riders', value: 'Critical Illness, Accidental Death' },
                    { label: 'Premium', value: '₹9,999/year' },
                  ]} />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="StepProgress" description="Life post-payment timeline — medical, verification, underwriting" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Post-payment timeline" widgetType="post_payment_timeline — tele-medical to final approval">
                  <DemoPostPaymentTimeline />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="ConsentWidget" description="Life insurance terms and conditions acceptance" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Life consent" widgetType="consent — T&C acceptance">
                  <DemoConsentWidget />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="PaymentGateway" description="Life premium payment — term plan purchase" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Life payment" widgetType="payment_screen — life premium ₹9,999">
                  <DemoPaymentGateway />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="Celebration" description="Life policy issuance success" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Life celebration" widgetType="celebration — policy active">
                  <DemoCelebration />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="NpsFeedback" description="Rate your life insurance buying experience" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Life NPS" widgetType="nps_feedback — experience rating">
                  <DemoNpsFeedback />
                </WidgetCard>
              </div>
            </section>

            <section className="pb-12">
              <SectionHeader title="AppDownloadCta" description="Download ACKO app for policy management" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Life app CTA" widgetType="app_download_cta — manage & track">
                  <DemoAppDownloadCta />
                </WidgetCard>
              </div>
            </section>
          </>
        )}

      </div>
    </div>
  );
}
