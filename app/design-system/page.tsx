'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

/* ═══════════════════════════════════════════════════════════
   ACKO Chat Design System — Widget Showcase
   All standard chat widgets rendered with demo data
   ═══════════════════════════════════════════════════════════ */

type LobTab = 'foundations' | 'assets' | 'atoms' | 'base' | 'health' | 'motor' | 'life';

const LOB_TABS: { id: LobTab; label: string; color: string }[] = [
  { id: 'foundations', label: 'Foundations', color: 'violet' },
  { id: 'assets', label: 'Asset Library', color: 'cyan' },
  { id: 'atoms', label: 'Atoms', color: 'pink' },
  { id: 'base', label: 'Base Components', color: 'purple' },
  { id: 'health', label: 'Health', color: 'emerald' },
  { id: 'motor', label: 'Motor', color: 'blue' },
  { id: 'life', label: 'Life', color: 'amber' },
];

type AssetCategory = 'all' | 'generic' | 'car-bike' | 'health-life';

const ICON_REGISTRY: { name: string; category: AssetCategory; path: string }[] = [
  ...[
    'Add user','Alarm','Alert','App','Aspect ratio','Balance','Battery low','Bill','Bookmark',
    'Broken Phone','CCTV','Calender','Camera','Cart','Chat history 3','Chat history 4',
    'Circle arrow up','Claim','Claim_Document-1','Claim_Document','Close-1','Close',
    'Commission','Compare','Consumables_cover','Covered','Customer service','Customise',
    'Delete','Delivery','Details','Discount','Document received','Download','Edit document',
    'Edit','Exclamation','Extra coverage','Fastag','File','Flash','Flip card','GPS','Gift',
    'Headphone','Home','Identity','Increase policy','Info-1','Info','Inprogress','Integration',
    'Invoice','Key','Location','Mail','Menu -03','Menu-02','Menu_01','Menu_02','Messages',
    'Money bag','Money','Multiple policies','Not covered','Notification',
    'Onboarding and offboarding','PDF file','Payment','Phone-1','Phone','Plus','Police',
    'Policy document','Policy','Print','Products','Profile','Recommendation V2',
    'Recommendation','Refresh','Refund','Renew coverage','Renew','Resources_Book','Room rent',
    'Rotation-360','Save money','Savings','Share','Slider','Snap hand','Suggest plan','Tax',
    'Tech','Tick','Time','Tools','Tracking','Transfer policy','Translate','UPI payment',
    'Verify-1','Verify','Video Camera','Zero GST','Zip file','add-on','alarm-clock',
    'arrow data transfer 3','arrow data transfer','arrow down left','arrow down right',
    'arrow down','arrow left','arrow right','arrow up left','arrow up right','arrow up',
    'arrow-left-01-stroke-standard','award','bank','battery','bolt','book-open','bookmarks',
    'calendar-days','chevron down','chevron right','chevron up','circle arrow down',
    'circle arrow left','circle arrow right','clipboard-check','clipboard-slash','clipboard',
    'cloud','credit-card','double arrow down','double arrow left','double arrow right',
    'double arrow up','facial-recognition','fingerprint','folder-open','folder','house-5',
    'image-depth','image-mountain','image-sparkle','image','images-2','industry','lightbulb-3',
    'lock-open-2','lock','magnifier','map','microphone-slash','microphone','minus','msg-writing',
    'paper-plane-2','paperclip','pin-tack','pointer','price tag','refresh-2','settings',
    'sitemap-4','square-minus','square-plus','star','stopwatch','tags','target','tasks-2',
    'thumb 01','thumb 02','triangle-warning','unavailable','wallet',
  ].map(n => ({ name: n, category: 'generic' as AssetCategory, path: `/icons/generic/${n}.svg` })),
  ...[
    'Add Car','Bike','Broken Car Glass','CNG','Car Accident Cover','Car Wishlist','Car and bike',
    'Car coverage','Car','Car_Issues','Car_Service-1','Car_Service','Car_accident','Car_front',
    'Compare cars','Diesel','Driver_Cover_Paid','Fire Accident Cover','Fuel','Garage -2','Garage',
    'New Bike','New car','Non-accidental_damage','Petrol','Pollution centre','Pre existing cover',
    'RTO documentation','Road lines','Scooter','Speedometer','Taxi_Car','Technician','Third Party',
    'Towing','Traffic','Zero Dep Car','Bike_Accident','Commercial Use_Taxi_bike',
    'Commercial Use_Taxi_car','Engine_protect','Extra_car_protect-1','Extra_car_protect','HSRP',
    'Is_this_your_bike','Is_this_your_car','New_bike_cover','New_car_cover-1','New_car_cover',
    'Passenger_Protection','Passenger_cover','Pre-existing_damage_Bike','Sold_car','Theft_cover-1',
    'Theft_cover','Used_car','Vehicle_car_value_price','bike_zero_dep_policy_cover_two_wheeler',
    'calamities_cover','discount_offer_save','illegal_driving_rash_drink_Car',
    'illegal_driving_rash_drink_bike','pillon_bike_cover','popular_Car','sell_car_bike_1',
    'special_car_star','war_terrorism_cover','wear and tear',
  ].map(n => ({ name: n, category: 'car-bike' as AssetCategory, path: `/icons/car-bike/${n}.svg` })),
  ...[
    'Ambulance','Blood test','Calculator','Child','Copay','Disease exclusion','Doctor note -Rx',
    'Doctor on call','Doctor','Family','Health checkup','Health evaluation','Life','Medicine',
    'No metal items or implants','No_alcohol','Room rent limit','Special conditions','Spouse',
    'Sum insured Exosted','Sum insured Restored','Test cancel','Test done','Test pending',
    'child 3','claim deduction','health evalution','hospital','lab test 3','medical consumables',
    'organic food','personal cover-1','personal cover','vegetarian-food',
  ].map(n => ({ name: n, category: 'health-life' as AssetCategory, path: `/icons/health-life/${n}.svg` })),
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
   Molecule Implementations — Built from Atoms + Foundations
   ═══════════════════════════════════════════════ */

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

function SelectionCard({
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
            className="relative flex flex-col items-center text-center p-5 rounded-2xl border transition-all duration-200 active:scale-[0.97] min-h-[120px] justify-center"
            style={{
              background: selected === opt.id ? 'var(--ds-selected-bg)' : 'var(--ds-overlay-bg)',
              border: `1.5px solid ${selected === opt.id ? 'var(--ds-selected-border)' : 'var(--ds-border-strong)'}`,
            }}
          >
            {opt.badge && (
              <span className="absolute top-2 right-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: 'var(--ds-accent-bg)', color: 'var(--ds-accent)' }}>
                {opt.badge}
              </span>
            )}
            {opt.icon && ICON_MAP[opt.icon] && (
              <div className="mb-2 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--ds-overlay-bg)' }}>
                <img src={ICON_MAP[opt.icon]} alt={opt.label} className="w-6 h-6" style={{ filter: 'var(--ds-icon-filter)', opacity: 'var(--ds-icon-opacity)' }} />
              </div>
            )}
            <span className="text-[15px] font-medium" style={{ color: 'var(--ds-text)' }}>{opt.label}</span>
            {opt.description && <span className="text-[13px] mt-1" style={{ color: 'var(--ds-text-tertiary)' }}>{opt.description}</span>}
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
            className="relative flex flex-col items-center py-4 px-3 rounded-xl border text-center transition-all duration-200 active:scale-[0.97]"
            style={{
              background: selected === opt.id ? 'var(--ds-selected-bg)' : 'var(--ds-overlay-bg)',
              border: `1.5px solid ${selected === opt.id ? 'var(--ds-selected-border)' : 'var(--ds-border-strong)'}`,
              color: selected === opt.id ? 'var(--ds-text)' : 'var(--ds-text-secondary)',
            }}
          >
            {opt.badge && <span className="absolute -top-2 right-3 text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: 'var(--ds-accent-bg)', color: 'var(--ds-accent)' }}>{opt.badge}</span>}
            <span className="text-[15px] font-semibold">{opt.label}</span>
            {opt.description && <span className="text-[13px] mt-1" style={{ color: 'var(--ds-text-tertiary)' }}>{opt.description}</span>}
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
            className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all duration-200 active:scale-[0.97]"
            style={{
              background: selected === opt.id ? 'var(--ds-selected-bg)' : 'var(--ds-overlay-bg)',
              border: `1.5px solid ${selected === opt.id ? 'var(--ds-selected-border)' : 'var(--ds-border-strong)'}`,
            }}
          >
            <DsRadio selected={selected === opt.id} />
            <span className="text-[15px] font-medium" style={{ color: selected === opt.id ? 'var(--ds-text)' : 'var(--ds-text-secondary)' }}>{opt.label}</span>
          </motion.button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2.5 max-w-md">
      {options.map((opt, i) => (
        <motion.button
          key={opt.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          onClick={() => handleSelect(opt.id)}
          className="text-left px-4 py-3.5 rounded-xl transition-all duration-200 active:scale-[0.97]"
          style={{
            background: selected === opt.id ? 'var(--ds-selected-bg)' : 'var(--ds-overlay-bg)',
            border: `1.5px solid ${selected === opt.id ? 'var(--ds-selected-border)' : 'var(--ds-border-strong)'}`,
          }}
        >
          <div className="flex items-center gap-3">
            {opt.icon && ICON_MAP[opt.icon] && (
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--ds-overlay-bg)' }}>
                <img src={ICON_MAP[opt.icon]} alt={opt.label} className="w-5 h-5" style={{ filter: 'var(--ds-icon-filter)', opacity: 'var(--ds-icon-opacity)' }} />
              </div>
            )}
            <div className="flex-1">
              <span className="text-[15px] font-medium" style={{ color: 'var(--ds-text)' }}>{opt.label}</span>
              {opt.description && <p className="text-[12px] mt-0.5" style={{ color: 'var(--ds-text-tertiary)' }}>{opt.description}</p>}
            </div>
            {opt.badge && <DsBadge>{opt.badge}</DsBadge>}
          </div>
        </motion.button>
      ))}
    </div>
  );
}

interface GridOption {
  id: string;
  label: string;
  icon?: string;
}

function GridSelector({
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
        <div className="mb-3">
          <DsInput
            placeholder="Search..."
            icon={<img src="/icons/generic/magnifier.svg" alt="search" className="w-4 h-4" style={{ filter: 'var(--ds-icon-filter)', opacity: '0.4' }} />}
            value={search}
            onChange={setSearch}
          />
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
              className="flex flex-col items-center text-center p-4 rounded-xl transition-all duration-150 active:scale-[0.97]"
              style={{
                background: isSelected ? 'var(--ds-selected-bg)' : 'var(--ds-overlay-bg)',
                border: `1.5px solid ${isSelected ? 'var(--ds-selected-border)' : 'var(--ds-border-strong)'}`,
              }}
            >
              <div className="mb-1.5 w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: isSelected ? 'var(--ds-accent-bg)' : 'var(--ds-overlay-bg)' }}>
                {hasIcon ? (
                  <img src={ICON_MAP[opt.icon!]} alt={opt.label} className="w-5 h-5" style={{ filter: 'var(--ds-icon-filter)', opacity: 'var(--ds-icon-opacity)' }} />
                ) : (
                  <span className="text-[11px] font-bold" style={{ color: 'var(--ds-text-tertiary)' }}>{opt.label.charAt(0)}</span>
                )}
              </div>
              <span className="text-[12px] font-medium leading-tight" style={{ color: 'var(--ds-text)' }}>{opt.label}</span>
              {multiSelect && isSelected && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ background: 'var(--ds-accent)' }}>
                  <img src={ICON_MAP.tick} alt="selected" className="w-3 h-3" style={{ filter: 'brightness(0) invert(1)' }} />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
      {multiSelect && (
        <div className="mt-4">
          <DsButton fullWidth disabled={selected.length === 0} onClick={() => selected.length > 0 && onSelect(selected)}>
            Continue ({selected.length} selected)
          </DsButton>
        </div>
      )}
    </div>
  );
}

type InputVariant = 'text' | 'number' | 'pincode' | 'currency';

interface InputFieldProps {
  variant?: InputVariant;
  placeholder?: string;
  helperText?: string;
  buttonLabel?: string;
  icon?: string;
  validate?: (v: string) => string | null;
}

function InputField({
  variant = 'text',
  placeholder = 'Enter value',
  helperText,
  buttonLabel = 'Continue',
  icon,
  validate,
}: InputFieldProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const isNumeric = variant === 'number' || variant === 'pincode' || variant === 'currency';

  const formatCurrency = (v: string) => {
    const num = parseInt(v);
    if (isNaN(num)) return '';
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)} L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(1)} K`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const handleChange = (v: string) => {
    if (variant === 'pincode') v = v.replace(/\D/g, '').slice(0, 6);
    setValue(v);
    setError('');
  };

  const handleSubmit = () => {
    if (validate) {
      const msg = validate(value);
      if (msg) { setError(msg); return; }
    }
    setError('');
  };

  return (
    <div className="max-w-sm">
      <DsInput
        type={isNumeric ? 'tel' : 'text'}
        placeholder={placeholder}
        icon={icon ? <img src={icon} alt="" className="w-5 h-5" style={{ filter: 'var(--ds-icon-filter)', opacity: '0.6' }} /> : undefined}
        suffix={variant === 'currency' && value ? formatCurrency(value) : undefined}
        helperText={helperText}
        error={error || undefined}
        value={value}
        onChange={handleChange}
      />
      <div className="mt-3">
        <DsButton
          fullWidth
          disabled={variant === 'pincode' && value.length !== 6}
          onClick={handleSubmit}
        >
          {buttonLabel}
        </DsButton>
      </div>
    </div>
  );
}

function DatePicker() {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  const inputStyle: React.CSSProperties = {
    background: 'var(--ds-input-bg)',
    border: '1px solid var(--ds-input-border)',
    color: 'var(--ds-input-text)',
  };

  return (
    <div className="w-full max-w-sm">
      <p className="text-[13px] mb-3" style={{ color: 'var(--ds-text-secondary)' }}>Select date of birth</p>
      <div className="flex gap-3">
        <input type="number" inputMode="numeric" placeholder="DD" value={day}
          onChange={(e) => { setDay(e.target.value); if (e.target.value.length >= 2) monthRef.current?.focus(); }}
          maxLength={2} style={inputStyle}
          className="flex-1 min-w-0 px-2 py-2.5 rounded text-center text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/30" />
        <input ref={monthRef} type="number" inputMode="numeric" placeholder="MM" value={month}
          onChange={(e) => { setMonth(e.target.value); if (e.target.value.length >= 2) yearRef.current?.focus(); }}
          maxLength={2} style={inputStyle}
          className="flex-1 min-w-0 px-2 py-2.5 rounded text-center text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/30" />
        <input ref={yearRef} type="number" inputMode="numeric" placeholder="YYYY" value={year}
          onChange={(e) => setYear(e.target.value)} maxLength={4} style={inputStyle}
          className="flex-[1.3] min-w-0 px-2 py-2.5 rounded text-center text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/30" />
      </div>
      {day && month && year && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[12px] mt-1.5" style={{ color: 'var(--ds-accent)' }}>
          {parseInt(day)}/{parseInt(month)}/{parseInt(year)}
        </motion.p>
      )}
      {error && <p className="text-[12px] mt-1.5" style={{ color: 'var(--ds-error-text)' }}>{error}</p>}
      <div className="mt-3">
        <DsButton fullWidth>Continue</DsButton>
      </div>
    </div>
  );
}

function VehicleRegInput() {
  const [value, setValue] = useState('');

  return (
    <div className="max-w-sm">
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
          <DsBadge variant="info">IND</DsBadge>
        </div>
        <input type="text" value={value}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          placeholder="KA 01 AB 1234" maxLength={13}
          className="w-full pl-14 pr-4 py-4 rounded text-[16px] tracking-widest font-bold uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          style={{ background: 'var(--ds-input-bg)', border: '1px solid var(--ds-input-border)', color: 'var(--ds-input-text)' }} />
      </div>
      <p className="text-[11px] mt-2 text-center" style={{ color: 'var(--ds-text-tertiary)' }}>Enter your vehicle registration number</p>
      <div className="mt-3">
        <DsButton fullWidth>Find My Vehicle</DsButton>
      </div>
    </div>
  );
}

function ProgressLoader() {
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
      <div className="rounded-2xl p-6 text-center" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border-strong)' }}>
        <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--ds-accent-bg)' }}>
          <div className="w-8 h-8 rounded-full animate-spin" style={{ border: '3px solid var(--ds-border-strong)', borderTopColor: 'var(--ds-accent)' }} />
        </div>
        <p className="text-[15px] font-semibold mb-2" style={{ color: 'var(--ds-text)' }}>Finding your vehicle</p>
        <p className="text-[13px] mb-4" style={{ color: 'var(--ds-text-secondary)' }}>{steps[currentStep]}</p>
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--ds-progress-bg)' }}>
          <motion.div className="h-full rounded-full" style={{ background: 'var(--ds-cta-bg)' }} initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
        </div>
        <p className="text-[11px] mt-2" style={{ color: 'var(--ds-text-tertiary)' }}>{progress}%</p>
      </div>
    </div>
  );
}

function CalculationLoader() {
  const [step, setStep] = useState(0);
  const steps = ['Analyzing your profile...', 'Comparing 15+ plans...', 'Calculating best premium...', 'Applying discounts...'];

  useEffect(() => {
    const interval = setInterval(() => { setStep(prev => (prev < steps.length - 1 ? prev + 1 : prev)); }, 1200);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="max-w-sm mx-auto">
      <div className="rounded-2xl p-6" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border-strong)' }}>
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
              <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--ds-border-strong)" strokeWidth="2.5" />
              <motion.path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--ds-accent)" strokeWidth="2.5"
                initial={{ strokeDasharray: '0, 100' }} animate={{ strokeDasharray: `${((step + 1) / steps.length) * 100}, 100` }} transition={{ duration: 0.8 }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full animate-spin" style={{ border: '2px solid var(--ds-border-strong)', borderTopColor: 'var(--ds-accent)' }} />
            </div>
          </div>
        </div>
        <div className="space-y-2.5">
          {steps.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: i <= step ? 1 : 0.3, x: 0 }} transition={{ delay: i * 0.3, duration: 0.4 }} className="flex items-center gap-2.5">
              {i < step ? (
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--ds-success)' }}>
                  <img src="/icons/generic/Tick.svg" alt="done" className="w-3 h-3" style={{ filter: 'brightness(0) invert(1)' }} />
                </div>
              ) : i === step ? (
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ border: '2px solid var(--ds-accent)' }}>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--ds-accent)' }} />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ border: '1px solid var(--ds-border-strong)' }} />
              )}
              <span className="text-[13px]" style={{ color: i <= step ? 'var(--ds-text)' : 'var(--ds-text-tertiary)' }}>{s}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepTracker() {
  const steps = [
    { label: 'Payment received', status: 'done' as const, detail: 'Just now', icon: '/icons/generic/Payment.svg' },
    { label: 'Vehicle inspection', status: 'done' as const, detail: 'Not required for new policy', icon: '/icons/generic/Verify.svg' },
    { label: 'KYC verification', status: 'pending' as const, detail: 'Complete within 4 days', icon: '/icons/generic/Identity.svg' },
    { label: 'Policy issued', status: 'pending' as const, detail: 'After KYC verification', icon: '/icons/generic/Policy.svg' },
  ];

  return (
    <div className="max-w-md">
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border-strong)' }}>
        <div className="flex items-center gap-3 p-4" style={{ borderBottom: '1px solid var(--ds-divider)' }}>
          <DsAvatar size="md" icon={<img src="/icons/car-bike/Car.svg" alt="car" className="w-4 h-4" style={{ filter: 'var(--ds-icon-filter)' }} />} />
          <div className="flex-1">
            <p className="text-[13px] font-semibold" style={{ color: 'var(--ds-text)' }}>Maruti Suzuki Swift</p>
            <p className="text-[11px]" style={{ color: 'var(--ds-text-tertiary)' }}>ACKO-MOT-2026-001</p>
          </div>
          <DsBadge variant="success">Active</DsBadge>
        </div>
        <div className="p-4 space-y-0">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: s.status === 'done' ? 'var(--ds-success)' : 'var(--ds-overlay-bg)', border: s.status === 'done' ? 'none' : '1px solid var(--ds-border-strong)' }}>
                  {s.status === 'done' ? (
                    <img src="/icons/generic/Tick.svg" alt="done" className="w-3 h-3" style={{ filter: 'brightness(0) invert(1)' }} />
                  ) : (<span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--ds-text-tertiary)' }} />)}
                </div>
                {i < steps.length - 1 && <div className="w-0.5 h-8" style={{ background: s.status === 'done' ? 'var(--ds-success)' : 'var(--ds-border-strong)', opacity: s.status === 'done' ? 0.5 : 1 }} />}
              </div>
              <div className="pb-4">
                <p className="text-[13px] font-medium" style={{ color: s.status === 'done' ? 'var(--ds-text)' : 'var(--ds-text-tertiary)' }}>{s.label}</p>
                <p className="text-[11px]" style={{ color: 'var(--ds-text-tertiary)' }}>{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConsentWidget() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="max-w-md">
      <div className="rounded-xl p-4" style={{ background: 'var(--ds-overlay-bg)', border: '1px solid var(--ds-border-strong)' }}>
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <DsCheckbox checked={checked} onChange={setChecked} />
          </div>
          <span className="text-[13px] leading-relaxed" style={{ color: 'var(--ds-text-secondary)' }}>
            I confirm the details provided are accurate. I agree to ACKO&apos;s{' '}
            <DsLink>Terms &amp; Conditions</DsLink> and{' '}
            <DsLink>Privacy Policy</DsLink>.
          </span>
        </div>
      </div>
      <div className="mt-3">
        <DsButton fullWidth disabled={!checked}>Confirm &amp; Proceed</DsButton>
      </div>
    </div>
  );
}

interface SummaryRow {
  label: string;
  value: string;
  editable?: boolean;
}

function SummaryCard({
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
      <div className="rounded-2xl overflow-hidden p-5 space-y-1" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border-strong)' }}>
        <div className="pb-3" style={{ borderBottom: '1px solid var(--ds-border-strong)' }}>
          <h3 className="text-[17px] font-bold" style={{ color: 'var(--ds-text)' }}>{title}</h3>
          {subtitle && <p className="text-[12px] mt-0.5" style={{ color: 'var(--ds-text-tertiary)' }}>{subtitle}</p>}
        </div>
        <div className="py-1">
          {rows.map((row) => {
            const showEdit = editable && row.editable !== false;
            return (
              <div key={row.label} className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid var(--ds-divider)' }}>
                <div>
                  <p className="text-[11px]" style={{ color: 'var(--ds-text-tertiary)' }}>{row.label}</p>
                  <p className="text-[14px] font-medium mt-0.5" style={{ color: 'var(--ds-text)' }}>{row.value}</p>
                </div>
                {showEdit && (
                  <DsIconButton variant="ghost" size="sm">
                    <img src="/icons/generic/Edit.svg" alt="edit" className="w-4 h-4" style={{ filter: 'var(--ds-icon-filter)', opacity: 'var(--ds-icon-opacity)' }} />
                  </DsIconButton>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-2">
          <DsButton fullWidth>{ctaLabel}</DsButton>
        </div>
      </div>
    </motion.div>
  );
}

function PaymentGateway() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const methods = [
    { id: 'upi', label: 'UPI', desc: 'Google Pay, PhonePe, Paytm', icon: '/icons/generic/UPI payment.svg' },
    { id: 'card', label: 'Card', desc: 'Visa, Mastercard, RuPay', icon: '/icons/generic/credit-card.svg' },
    { id: 'netbanking', label: 'Net Banking', desc: 'All major banks', icon: '/icons/generic/bank.svg' },
    { id: 'wallet', label: 'Wallet', desc: 'Paytm, Amazon Pay', icon: '/icons/generic/wallet.svg' },
  ];

  return (
    <div className="rounded-2xl overflow-hidden max-w-md" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border-strong)' }}>
      <div className="px-5 py-4 flex items-center justify-between" style={{ background: 'var(--ds-surface-2)' }}>
        <div className="flex items-center gap-3">
          <DsAvatar size="md" icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="var(--ds-accent)"><path d="M7.076 2L4 12.239l3.076 0L11.153 2zM11.669 2L8.593 12.239l3.076 0L15.746 2zM20 2l-7.077 10.239L16 22l4-9.761L16.923 2z" /></svg>} />
          <div>
            <p className="text-[13px] font-semibold" style={{ color: 'var(--ds-text)' }}>ACKO Insurance</p>
            <p className="text-[11px]" style={{ color: 'var(--ds-text-tertiary)' }}>Maruti Swift — Motor Insurance</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[11px]" style={{ color: 'var(--ds-text-tertiary)' }}>Amount</p>
          <p className="text-[18px] font-bold" style={{ color: 'var(--ds-text)' }}>₹10,617</p>
        </div>
      </div>
      <div className="p-5">
        <p className="text-[12px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--ds-text-secondary)' }}>Payment Method</p>
        <div className="space-y-2.5">
          {methods.map(m => (
            <button key={m.id} onClick={() => setSelectedMethod(m.id)}
              className="w-full flex items-center gap-3.5 p-3.5 rounded-xl transition-all text-left"
              style={{
                background: selectedMethod === m.id ? 'var(--ds-selected-bg)' : 'var(--ds-overlay-bg)',
                border: `1.5px solid ${selectedMethod === m.id ? 'var(--ds-selected-border)' : 'var(--ds-border-strong)'}`,
              }}>
              <img src={m.icon} alt={m.label} className="w-5 h-5" style={{ filter: 'var(--ds-icon-filter)', opacity: 'var(--ds-icon-opacity)' }} />
              <div className="flex-1">
                <p className="text-[14px] font-semibold" style={{ color: 'var(--ds-text)' }}>{m.label}</p>
                <p className="text-[11px]" style={{ color: 'var(--ds-text-tertiary)' }}>{m.desc}</p>
              </div>
              <DsRadio selected={selectedMethod === m.id} onChange={() => setSelectedMethod(m.id)} />
            </button>
          ))}
        </div>
        <div className="mt-5">
          <DsButton fullWidth disabled={!selectedMethod}>Pay ₹10,617</DsButton>
        </div>
      </div>
    </div>
  );
}

function CelebrationScreen() {
  const CONFETTI_COLORS = ['#FFD700', '#FF6B6B', '#4ECDC4', '#A78BFA', '#F472B6'];
  const confetti = Array.from({ length: 20 }).map(() => ({
    xPct: Math.random() * 100, rotation: Math.random() * 720,
    duration: 2 + Math.random() * 2, delay: Math.random() * 0.5,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
  }));

  return (
    <div className="max-w-sm mx-auto">
      <div className="rounded-2xl overflow-hidden relative" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border-strong)' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {confetti.map((p, i) => (
            <motion.div key={i} initial={{ y: -10, opacity: 1 }} animate={{ y: 300, opacity: 0, rotate: p.rotation }}
              transition={{ duration: p.duration, delay: p.delay, ease: 'linear', repeat: Infinity, repeatDelay: 1 }}
              className="absolute w-2 h-2 rounded-full" style={{ left: `${p.xPct}%`, backgroundColor: p.color }} />
          ))}
        </div>
        <div className="p-6 text-center relative z-20" style={{ background: 'var(--ds-success-bg)' }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10, stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center shadow-xl" style={{ background: 'var(--ds-success)' }}>
            <img src="/icons/generic/Tick.svg" alt="success" className="w-10 h-10" style={{ filter: 'brightness(0) invert(1)' }} />
          </motion.div>
          <h2 className="text-[20px] font-bold" style={{ color: 'var(--ds-text)' }}>Payment Successful!</h2>
          <p className="text-[13px] mt-2" style={{ color: 'var(--ds-text-secondary)' }}>Your policy is now active</p>
        </div>
        <div className="p-5 space-y-3 relative z-20">
          <div className="flex justify-between items-center">
            <span className="text-[12px]" style={{ color: 'var(--ds-text-tertiary)' }}>Policy Number</span>
            <span className="text-[13px] font-semibold" style={{ color: 'var(--ds-text)' }}>ACKO-2026-7839201</span>
          </div>
          <DsDivider />
          <div className="flex justify-between items-center">
            <span className="text-[12px]" style={{ color: 'var(--ds-text-tertiary)' }}>Status</span>
            <DsBadge variant="success">Active</DsBadge>
          </div>
          <DsDivider />
          <div className="flex justify-between items-center">
            <span className="text-[12px]" style={{ color: 'var(--ds-text-tertiary)' }}>Valid Until</span>
            <span className="text-[13px] font-semibold" style={{ color: 'var(--ds-text)' }}>2 Mar 2027</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeedbackForm() {
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
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all"
            style={{
              background: score === e.value ? 'var(--ds-selected-bg)' : 'var(--ds-overlay-bg)',
              border: `1.5px solid ${score === e.value ? 'var(--ds-selected-border)' : 'transparent'}`,
              transform: score === e.value ? 'scale(1.1)' : 'scale(1)',
            }}>
            <span className="text-[28px]">{e.emoji}</span>
            <span className="text-[10px] font-medium" style={{ color: score === e.value ? 'var(--ds-text)' : 'var(--ds-text-tertiary)' }}>{e.label}</span>
          </button>
        ))}
      </div>
      {score !== null && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
          <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)}
            placeholder="Any suggestions? (optional)"
            className="w-full rounded p-3 text-[13px] resize-none h-20 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            style={{ background: 'var(--ds-input-bg)', border: '1px solid var(--ds-input-border)', color: 'var(--ds-input-text)' }} />
          <DsButton fullWidth>Submit Feedback</DsButton>
        </motion.div>
      )}
    </div>
  );
}

function SearchableList() {
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
      <div className="relative rounded-2xl overflow-hidden mb-3 h-24" style={{ background: 'var(--ds-accent)' }}>
        <div className="absolute inset-0 flex items-center px-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <img src="/icons/health-life/hospital.svg" alt="hospital" className="w-5 h-5" style={{ filter: 'brightness(0) invert(1)' }} />
              <p className="font-semibold text-[14px]" style={{ color: '#FFFFFF' }}>42 cashless hospitals nearby</p>
            </div>
            <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.6)' }}>Walk in, get treated — no paperwork</p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border-strong)' }}>
        {visible.map((h, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
            className="flex items-center gap-3 px-4 py-3 transition-colors"
            style={{ borderBottom: i < visible.length - 1 ? '1px solid var(--ds-divider)' : 'none' }}>
            <DsAvatar size="md" icon={<img src="/icons/health-life/hospital.svg" alt="" className="w-4 h-4" style={{ filter: 'var(--ds-icon-filter)' }} />} />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium" style={{ color: 'var(--ds-text)' }}>{h.name}</p>
              <p className="text-[11px]" style={{ color: 'var(--ds-text-tertiary)' }}>{h.type}</p>
            </div>
            <DsLink arrow>{h.distance}</DsLink>
          </motion.div>
        ))}
        {!showAll && (
          <button onClick={() => setShowAll(true)} className="w-full py-2.5 text-[13px] font-medium transition-colors" style={{ color: 'var(--ds-link)', borderTop: '1px solid var(--ds-divider)' }}>
            View all 42 hospitals
          </button>
        )}
      </div>
    </div>
  );
}

function ComparisonCard() {
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
      <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: 'var(--ds-error-bg)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,0.2)' }}>
          <span className="text-[18px] font-bold" style={{ color: 'var(--ds-error-text)' }}>{gapCount}</span>
        </div>
        <div>
          <p className="text-[14px] font-semibold" style={{ color: 'var(--ds-text)' }}>Coverage gaps found</p>
          <p className="text-[12px]" style={{ color: 'var(--ds-text-secondary)' }}>Your current plan has {gapCount} areas with limited coverage</p>
        </div>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border-strong)' }}>
        <div className="grid grid-cols-3 px-4 py-2.5" style={{ borderBottom: '1px solid var(--ds-border-strong)' }}>
          <span className="text-[10px] uppercase font-semibold" style={{ color: 'var(--ds-text-tertiary)' }}>Feature</span>
          <span className="text-[10px] uppercase font-semibold text-center" style={{ color: 'var(--ds-text-tertiary)' }}>Current</span>
          <span className="text-[10px] uppercase font-semibold text-right" style={{ color: 'var(--ds-link)' }}>ACKO</span>
        </div>
        {gaps.map((g, i) => (
          <button key={i} onClick={() => setExpanded(expanded === i ? null : i)}
            className="w-full grid grid-cols-3 items-center px-4 py-3 text-left transition-colors"
            style={{ borderBottom: i < gaps.length - 1 ? '1px solid var(--ds-divider)' : 'none', background: expanded === i ? 'var(--ds-overlay-bg)' : 'transparent' }}>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: g.status === 'gap' ? 'var(--ds-error-text)' : 'var(--ds-success)' }} />
              <span className="text-[12px]" style={{ color: 'var(--ds-text)' }}>{g.feature}</span>
            </div>
            <span className="text-[11px] text-center" style={{ color: 'var(--ds-text-tertiary)' }}>{g.current}</span>
            <span className="text-[11px] font-medium text-right" style={{ color: 'var(--ds-link)' }}>{g.acko}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function FileUpload() {
  const [phase, setPhase] = useState<'idle' | 'extracting' | 'done'>('idle');

  return (
    <div className="max-w-md">
      {phase === 'idle' && (
        <div onClick={() => setPhase('extracting')}
          className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all"
          style={{ borderColor: 'var(--ds-border-strong)', background: 'var(--ds-overlay-bg)' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ds-accent)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--ds-border-strong)'; }}>
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center" style={{ background: 'var(--ds-accent-bg)' }}>
            <img src="/icons/generic/PDF file.svg" alt="pdf" className="w-7 h-7" style={{ filter: 'var(--ds-icon-filter)', opacity: 'var(--ds-icon-opacity)' }} />
          </div>
          <p className="text-[14px] font-semibold mb-1" style={{ color: 'var(--ds-text)' }}>Upload existing policy</p>
          <p className="text-[12px]" style={{ color: 'var(--ds-text-tertiary)' }}>Drop your policy PDF here or tap to browse</p>
          <p className="text-[11px] mt-2" style={{ color: 'var(--ds-text-tertiary)', opacity: 0.6 }}>PDF, up to 10MB</p>
        </div>
      )}
      {phase === 'extracting' && (
        <div className="rounded-2xl p-6 text-center" style={{ background: 'var(--ds-accent-bg)', border: '1px solid var(--ds-accent)' }}>
          <div className="w-10 h-10 mx-auto mb-3 rounded-full animate-spin" style={{ border: '2px solid var(--ds-accent)', borderTopColor: 'transparent' }} />
          <p className="text-[14px] font-semibold" style={{ color: 'var(--ds-text)' }}>Extracting policy details...</p>
          <p className="text-[12px] mt-1" style={{ color: 'var(--ds-text-tertiary)' }}>Reading Care Health Insurance — care_advantage.pdf</p>
          {setTimeout(() => setPhase('done'), 2500) && null}
        </div>
      )}
      {phase === 'done' && (
        <div className="rounded-2xl p-5" style={{ background: 'var(--ds-success-bg)', border: '1px solid var(--ds-success)' }}>
          <div className="flex items-center gap-3">
            <DsAvatar size="md" icon={<img src="/icons/generic/Verify.svg" alt="" className="w-5 h-5" style={{ filter: 'var(--ds-icon-filter)' }} />} />
            <div>
              <p className="text-[14px] font-semibold" style={{ color: 'var(--ds-text)' }}>Policy extracted</p>
              <p className="text-[12px]" style={{ color: 'var(--ds-text-secondary)' }}>Care Health Insurance — Care Advantage</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SchedulePicker() {
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
      <div className="relative rounded-2xl overflow-hidden h-20" style={{ background: 'var(--ds-accent)' }}>
        <div className="absolute inset-0 flex items-center px-4">
          <div className="flex items-center gap-3">
            <img src="/icons/health-life/Blood test.svg" alt="lab" className="w-6 h-6" style={{ filter: 'brightness(0) invert(1)' }} />
            <div>
              <p className="font-semibold text-[14px]" style={{ color: '#FFFFFF' }}>Schedule Lab Test</p>
              <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.6)' }}>All costs covered by ACKO</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-[13px] font-semibold mb-2" style={{ color: 'var(--ds-text-secondary)' }}>Pick a date</h4>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {dates.map(d => (
            <button key={d.value} onClick={() => setSelectedDate(d.value)}
              className="flex-shrink-0 px-3 py-2.5 rounded text-[12px] transition-all"
              style={{
                background: selectedDate === d.value ? 'var(--ds-selected-bg)' : 'var(--ds-surface)',
                border: `1px solid ${selectedDate === d.value ? 'var(--ds-selected-border)' : 'var(--ds-border-strong)'}`,
                color: selectedDate === d.value ? 'var(--ds-text)' : 'var(--ds-text-secondary)',
              }}>
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <DsDivider />

      <div>
        <h4 className="text-[13px] font-semibold mb-2" style={{ color: 'var(--ds-text-secondary)' }}>Time slot</h4>
        <div className="grid grid-cols-3 gap-2">
          {timeSlots.map(s => (
            <button key={s.id} onClick={() => setSelectedTime(s.id)}
              className="p-3 rounded text-center transition-all"
              style={{
                background: selectedTime === s.id ? 'var(--ds-selected-bg)' : 'var(--ds-surface)',
                border: `1px solid ${selectedTime === s.id ? 'var(--ds-selected-border)' : 'var(--ds-border-strong)'}`,
              }}>
              <p className="text-[12px] font-medium" style={{ color: 'var(--ds-text)' }}>{s.label}</p>
              <p className="text-[10px]" style={{ color: 'var(--ds-text-tertiary)' }}>{s.time}</p>
              {s.note && <p className="text-[9px] mt-0.5" style={{ color: 'var(--ds-success)' }}>{s.note}</p>}
            </button>
          ))}
        </div>
      </div>

      <DsDivider />

      <div>
        <h4 className="text-[13px] font-semibold mb-2" style={{ color: 'var(--ds-text-secondary)' }}>Choose lab</h4>
        <div className="space-y-2">
          {labs.map(lab => (
            <button key={lab.id} onClick={() => setSelectedLab(lab.id)}
              className="w-full text-left p-3 rounded transition-all flex items-center gap-3"
              style={{
                background: selectedLab === lab.id ? 'var(--ds-selected-bg)' : 'var(--ds-surface)',
                border: `1px solid ${selectedLab === lab.id ? 'var(--ds-selected-border)' : 'var(--ds-border-strong)'}`,
              }}>
              <DsAvatar size="md" icon={<img src="/icons/health-life/lab test 3.svg" alt="" className="w-4 h-4" style={{ filter: 'var(--ds-icon-filter)' }} />} />
              <div className="flex-1">
                <p className="text-[13px] font-medium" style={{ color: 'var(--ds-text)' }}>{lab.name}</p>
                <p className="text-[11px]" style={{ color: 'var(--ds-text-tertiary)' }}>{lab.distance}</p>
              </div>
              <div className="flex items-center gap-1">
                <img src="/icons/generic/star.svg" alt="rating" className="w-3 h-3" style={{ filter: 'var(--ds-icon-filter)', opacity: 'var(--ds-icon-opacity)' }} />
                <span className="text-[11px]" style={{ color: 'var(--ds-text-secondary)' }}>{lab.rating}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <DsButton fullWidth disabled={!selectedDate || !selectedTime || !selectedLab}>Confirm Booking</DsButton>
    </div>
  );
}

function VerificationFlow() {
  const [stage, setStage] = useState<'info' | 'verify'>('info');

  return (
    <div className="max-w-md mx-auto">
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border-strong)' }}>
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-[22px] font-bold leading-tight" style={{ color: 'var(--ds-text)' }}>Complete KYC</p>
              <p className="text-[13px] mt-1.5 leading-snug" style={{ color: 'var(--ds-text-secondary)' }}>
                {stage === 'info'
                  ? 'HyperVerge, our reliable partner, will handle the KYC process for you with 100% security'
                  : 'Complete the steps below to verify your identity and activate your policy'}
              </p>
            </div>
            <DsIconButton variant="filled" size="sm" onClick={() => setStage('info')}>
              <img src="/icons/generic/Close.svg" alt="close" className="w-3.5 h-3.5" style={{ filter: 'var(--ds-icon-filter)', opacity: '0.5' }} />
            </DsIconButton>
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
                <div key={item.step} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl" style={{ background: 'var(--ds-overlay-bg)', border: '1px solid var(--ds-border-strong)' }}>
                  <DsAvatar size="sm" initials={item.step} />
                  <div>
                    <p className="text-[14px] font-medium" style={{ color: 'var(--ds-text)' }}>{item.title}</p>
                    <p className="text-[12px] mt-0.5" style={{ color: 'var(--ds-text-tertiary)' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <DsButton fullWidth onClick={() => setStage('verify')}>Start KYC Verification</DsButton>
            <div className="mt-2 text-center">
              <DsButton variant="ghost" onClick={() => setStage('info')}>I&apos;ll do this later</DsButton>
            </div>
          </div>
        ) : (
          <div className="px-5 pb-5">
            <div className="h-[200px] rounded-2xl flex flex-col items-center justify-center gap-3 mb-4" style={{ background: 'var(--ds-overlay-bg)', border: '1px solid var(--ds-border-strong)' }}>
              <div className="w-7 h-7 rounded-full animate-spin" style={{ border: '2px solid var(--ds-accent)', borderTopColor: 'transparent' }} />
              <p className="text-[12px]" style={{ color: 'var(--ds-text-tertiary)' }}>Loading KYC verification...</p>
            </div>
            <DsButton fullWidth onClick={() => setStage('info')}>I&apos;ve Completed Verification</DsButton>
          </div>
        )}
      </div>
    </div>
  );
}

function ChatBubble() {
  return (
    <div className="space-y-3 max-w-md">
      <div className="flex items-start gap-2.5">
        <DsAvatar size="sm" icon={<img src="/icons/generic/Customer service.svg" alt="" className="w-3.5 h-3.5" style={{ filter: 'var(--ds-icon-filter)' }} />} />
        <div className="rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]" style={{ background: 'var(--ds-bubble-bg)', border: '1px solid var(--ds-bubble-border)' }}>
          <p className="text-[14px] leading-relaxed" style={{ color: 'var(--ds-bot-text)' }}>Hi there! I&apos;m your ACKO assistant. Let&apos;s find the perfect insurance plan for you.</p>
        </div>
      </div>
      <div className="flex justify-end">
        <div className="rounded-2xl rounded-tr-md px-4 py-3 max-w-[85%]" style={{ background: 'var(--ds-user-bubble-bg)', color: 'var(--ds-user-bubble-text)' }}>
          <p className="text-[14px]">I want health insurance for my family</p>
        </div>
      </div>
      <div className="flex items-start gap-2.5">
        <DsAvatar size="sm" icon={<img src="/icons/generic/Customer service.svg" alt="" className="w-3.5 h-3.5" style={{ filter: 'var(--ds-icon-filter)' }} />} />
        <div className="rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]" style={{ background: 'var(--ds-bubble-bg)', border: '1px solid var(--ds-bubble-border)' }}>
          <p className="text-[14px] leading-relaxed" style={{ color: 'var(--ds-bot-text)' }}>Great choice! Who all do you want to cover?</p>
        </div>
      </div>
    </div>
  );
}

function RangeSlider() {
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
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border-strong)' }}>
        <div className="px-5 py-5" style={{ background: 'var(--ds-accent)' }}>
          <p className="text-[11px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.6)' }}>Annual Premium</p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#FFFFFF' }}>₹{premium.toLocaleString('en-IN')}<span className="text-lg font-normal" style={{ color: 'rgba(255,255,255,0.6)' }}>/yr</span></p>
          <p className="text-[12px] mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>₹{monthly.toLocaleString('en-IN')}/mo</p>
        </div>
        <div className="px-5 py-5 space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[13px]" style={{ color: 'var(--ds-text-secondary)' }}>Coverage</span>
              <span className="text-[15px] font-bold" style={{ color: 'var(--ds-text)' }}>{formatCoverage(coverage)}</span>
            </div>
            <input type="range" min={minCoverage} max={maxCoverage} step={2500000} value={coverage}
              onChange={(e) => setCoverage(Number(e.target.value))}
              style={{ background: `linear-gradient(to right, var(--ds-accent) ${getProgress(coverage, minCoverage, maxCoverage)}%, var(--ds-progress-bg) ${getProgress(coverage, minCoverage, maxCoverage)}%)` }}
              className="ds-range w-full h-1.5 rounded-full appearance-none cursor-pointer" />
            <div className="flex justify-between mt-1">
              <span className="text-[10px]" style={{ color: 'var(--ds-text-tertiary)' }}>{formatCoverage(minCoverage)}</span>
              <span className="text-[10px]" style={{ color: 'var(--ds-text-tertiary)' }}>{formatCoverage(maxCoverage)}</span>
            </div>
          </div>
          <DsDivider />
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[13px]" style={{ color: 'var(--ds-text-secondary)' }}>Policy Term</span>
              <span className="text-[15px] font-bold" style={{ color: 'var(--ds-text)' }}>{term} years</span>
            </div>
            <input type="range" min={minTerm} max={maxTerm} step={1} value={term}
              onChange={(e) => setTerm(Number(e.target.value))}
              style={{ background: `linear-gradient(to right, var(--ds-accent) ${getProgress(term, minTerm, maxTerm)}%, var(--ds-progress-bg) ${getProgress(term, minTerm, maxTerm)}%)` }}
              className="ds-range w-full h-1.5 rounded-full appearance-none cursor-pointer" />
            <div className="flex justify-between mt-1">
              <span className="text-[10px]" style={{ color: 'var(--ds-text-tertiary)' }}>{minTerm} yrs</span>
              <span className="text-[10px]" style={{ color: 'var(--ds-text-tertiary)' }}>{maxTerm} yrs</span>
            </div>
          </div>
        </div>
        <div className="px-5 pb-5">
          <DsButton fullWidth>Continue with this plan</DsButton>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   LOB-specific Chat Bubble variants
   ═══════════════════════════════════════════════ */

function DemoChatMessageHealth() {
  return (
    <div className="space-y-3 max-w-md">
      <div className="flex items-start gap-2.5">
        <DsAvatar size="sm" icon={<img src="/icons/generic/Customer service.svg" alt="" className="w-3.5 h-3.5" style={{ filter: 'var(--ds-icon-filter)' }} />} />
        <div className="rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]" style={{ background: 'var(--ds-bubble-bg)', border: '1px solid var(--ds-bubble-border)' }}>
          <p className="text-[14px] leading-relaxed" style={{ color: 'var(--ds-bot-text)' }}>Hi! Let&apos;s find the best health plan for your family. How many members do you want to cover?</p>
        </div>
      </div>
      <div className="flex justify-end">
        <div className="rounded-2xl rounded-tr-md px-4 py-3 max-w-[85%]" style={{ background: 'var(--ds-user-bubble-bg)', color: 'var(--ds-user-bubble-text)' }}>
          <p className="text-[14px]">Me, my wife, and 2 kids</p>
        </div>
      </div>
      <div className="flex items-start gap-2.5">
        <DsAvatar size="sm" icon={<img src="/icons/generic/Customer service.svg" alt="" className="w-3.5 h-3.5" style={{ filter: 'var(--ds-icon-filter)' }} />} />
        <div className="rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]" style={{ background: 'var(--ds-bubble-bg)', border: '1px solid var(--ds-bubble-border)' }}>
          <p className="text-[14px] leading-relaxed" style={{ color: 'var(--ds-bot-text)' }}>Great! A family floater plan will give you the best value. What&apos;s your pincode?</p>
        </div>
      </div>
    </div>
  );
}

function DemoChatMessageMotor() {
  return (
    <div className="space-y-3 max-w-md">
      <div className="flex items-start gap-2.5">
        <DsAvatar size="sm" icon={<img src="/icons/generic/Customer service.svg" alt="" className="w-3.5 h-3.5" style={{ filter: 'var(--ds-icon-filter)' }} />} />
        <div className="rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]" style={{ background: 'var(--ds-bubble-bg)', border: '1px solid var(--ds-bubble-border)' }}>
          <p className="text-[14px] leading-relaxed" style={{ color: 'var(--ds-bot-text)' }}>Welcome! Let&apos;s get your vehicle insured. Please enter your registration number.</p>
        </div>
      </div>
      <div className="flex justify-end">
        <div className="rounded-2xl rounded-tr-md px-4 py-3 max-w-[85%]" style={{ background: 'var(--ds-user-bubble-bg)', color: 'var(--ds-user-bubble-text)' }}>
          <p className="text-[14px]">KA 01 AB 1234</p>
        </div>
      </div>
      <div className="flex items-start gap-2.5">
        <DsAvatar size="sm" icon={<img src="/icons/generic/Customer service.svg" alt="" className="w-3.5 h-3.5" style={{ filter: 'var(--ds-icon-filter)' }} />} />
        <div className="rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]" style={{ background: 'var(--ds-bubble-bg)', border: '1px solid var(--ds-bubble-border)' }}>
          <p className="text-[14px] leading-relaxed" style={{ color: 'var(--ds-bot-text)' }}>Found it! Maruti Suzuki Swift VXi Petrol 2022. Is this correct?</p>
        </div>
      </div>
    </div>
  );
}

function DemoChatMessageLife() {
  return (
    <div className="space-y-3 max-w-md">
      <div className="flex items-start gap-2.5">
        <DsAvatar size="sm" icon={<img src="/icons/generic/Customer service.svg" alt="" className="w-3.5 h-3.5" style={{ filter: 'var(--ds-icon-filter)' }} />} />
        <div className="rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]" style={{ background: 'var(--ds-bubble-bg)', border: '1px solid var(--ds-bubble-border)' }}>
          <p className="text-[14px] leading-relaxed" style={{ color: 'var(--ds-bot-text)' }}>Let&apos;s find the right life insurance cover for you. What&apos;s your annual income?</p>
        </div>
      </div>
      <div className="flex justify-end">
        <div className="rounded-2xl rounded-tr-md px-4 py-3 max-w-[85%]" style={{ background: 'var(--ds-user-bubble-bg)' }}>
          <p className="text-[14px]" style={{ color: 'var(--ds-user-bubble-text)' }}>Around 18 lakhs per year</p>
        </div>
      </div>
      <div className="flex items-start gap-2.5">
        <DsAvatar size="sm" icon={<img src="/icons/generic/Customer service.svg" alt="bot" className="w-3.5 h-3.5" style={{ filter: 'var(--ds-icon-filter)' }} />} />
        <div className="rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]" style={{ background: 'var(--ds-bubble-bg)', border: '1px solid var(--ds-bubble-border)' }}>
          <p className="text-[14px] leading-relaxed" style={{ color: 'var(--ds-bot-text)' }}>Based on your income, I&apos;d recommend a ₹1.5 Cr cover. Do you smoke?</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Main Design System Page
   ═══════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════
   Atom Components — Single Source of Truth
   ═══════════════════════════════════════════════ */

type DsButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link' | 'danger';
type DsSize = 'sm' | 'md' | 'lg';

function DsButton({
  variant = 'primary', size = 'md', disabled = false, loading = false,
  fullWidth = false, icon, children, onClick,
}: {
  variant?: DsButtonVariant; size?: DsSize; disabled?: boolean; loading?: boolean;
  fullWidth?: boolean; icon?: React.ReactNode; children: React.ReactNode; onClick?: () => void;
}) {
  const sizeMap = { sm: 'py-1.5 px-3 text-[12px] rounded gap-1.5', md: 'py-2.5 px-4 text-[13px] rounded gap-2', lg: 'py-3.5 px-5 text-[15px] rounded gap-2' };

  const variantStyles: Record<DsButtonVariant, React.CSSProperties> = {
    primary: { background: 'var(--ds-cta-bg)', color: 'var(--ds-cta-text)', boxShadow: 'inset 0px 2px 2px rgba(255,255,255,0.12)' },
    secondary: { background: 'var(--ds-surface)', color: 'var(--ds-text)', border: '1px solid var(--ds-accent)', boxShadow: 'inset 0px 2px 4px rgba(255,255,255,0.08)' },
    ghost: { background: 'transparent', color: 'var(--ds-accent)' },
    link: { background: 'transparent', color: 'var(--ds-link)', padding: '0' },
    danger: { background: 'var(--ds-error-bg)', color: 'var(--ds-error-text)', border: '1px solid transparent' },
  };

  return (
    <button
      onClick={onClick} disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-medium transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 ${sizeMap[size]} ${fullWidth ? 'w-full' : ''}`}
      style={variantStyles[variant]}
    >
      {loading ? (
        <div className="w-4 h-4 rounded-full animate-spin" style={{ border: '2px solid currentColor', borderTopColor: 'transparent' }} />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {variant !== 'link' ? <span>{children}</span> : <span className="underline underline-offset-2">{children}</span>}
    </button>
  );
}

function DsInput({
  type = 'text', placeholder, helperText, error, disabled = false,
  icon, suffix, value, onChange,
}: {
  type?: 'text' | 'number' | 'tel' | 'email'; placeholder?: string;
  helperText?: string; error?: string; disabled?: boolean;
  icon?: React.ReactNode; suffix?: React.ReactNode;
  value?: string; onChange?: (v: string) => void;
}) {
  return (
    <div>
      <div className="relative">
        {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center">{icon}</span>}
        <input
          type={type} placeholder={placeholder} disabled={disabled}
          value={value} onChange={(e) => onChange?.(e.target.value)}
          className={`w-full py-3 rounded text-[14px] font-medium transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/30 disabled:opacity-40 disabled:cursor-not-allowed ${icon ? 'pl-10 pr-4' : 'px-4'} ${suffix ? 'pr-16' : ''}`}
          style={{
            background: 'var(--ds-input-bg)',
            border: `1px solid ${error ? 'var(--ds-error-text)' : 'var(--ds-input-border)'}`,
            color: 'var(--ds-input-text)',
          }}
        />
        {suffix && <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[12px]" style={{ color: 'var(--ds-text-tertiary)' }}>{suffix}</span>}
      </div>
      {(helperText || error) && (
        <p className="text-[11px] mt-1.5" style={{ color: error ? 'var(--ds-error-text)' : 'var(--ds-text-tertiary)' }}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}

function DsCheckbox({
  checked = false, disabled = false, label, onChange,
}: {
  checked?: boolean; disabled?: boolean; label?: string; onChange?: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => !disabled && onChange?.(!checked)} disabled={disabled}
      className="flex items-center gap-2.5 group disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all"
        style={{
          background: checked ? 'var(--ds-accent)' : 'transparent',
          border: `2px solid ${checked ? 'var(--ds-accent)' : 'var(--ds-border-strong)'}`,
        }}>
        {checked && (
          <svg className="w-3 h-3" fill="none" stroke="#FFFFFF" viewBox="0 0 24 24" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        )}
      </div>
      {label && <span className="text-[13px]" style={{ color: 'var(--ds-text)' }}>{label}</span>}
    </button>
  );
}

function DsRadio({
  selected = false, disabled = false, label, onChange,
}: {
  selected?: boolean; disabled?: boolean; label?: string; onChange?: () => void;
}) {
  return (
    <button
      onClick={() => !disabled && onChange?.()} disabled={disabled}
      className="flex items-center gap-2.5 group disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
        style={{
          border: `2px solid ${selected ? 'var(--ds-accent)' : 'var(--ds-border-strong)'}`,
        }}>
        {selected && <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--ds-accent)' }} />}
      </div>
      {label && <span className="text-[13px]" style={{ color: 'var(--ds-text)' }}>{label}</span>}
    </button>
  );
}

function DsToggle({
  on = false, disabled = false, label, onChange,
}: {
  on?: boolean; disabled?: boolean; label?: string; onChange?: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => !disabled && onChange?.(!on)} disabled={disabled}
      className="flex items-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <div className="relative w-10 h-[22px] rounded-full transition-colors" style={{ background: on ? 'var(--ds-accent)' : 'var(--ds-border-strong)' }}>
        <div className="absolute top-[3px] w-4 h-4 rounded-full shadow-sm transition-all" style={{ left: on ? '21px' : '3px', background: on ? 'var(--ds-cta-text)' : 'var(--ds-text)' }} />
      </div>
      {label && <span className="text-[13px]" style={{ color: 'var(--ds-text)' }}>{label}</span>}
    </button>
  );
}

type DsBadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

function DsBadge({ variant = 'default', children }: { variant?: DsBadgeVariant; children: React.ReactNode }) {
  const styles: Record<DsBadgeVariant, React.CSSProperties> = {
    default: { background: 'var(--ds-badge-bg)', color: 'var(--ds-badge-text)', border: '1px solid var(--ds-badge-border)' },
    success: { background: 'var(--ds-success-bg)', color: 'var(--ds-success)' },
    warning: { background: 'var(--ds-warning-bg)', color: 'var(--ds-warning-text)' },
    error: { background: 'var(--ds-error-bg)', color: 'var(--ds-error-text)' },
    info: { background: 'var(--ds-accent-bg)', color: 'var(--ds-accent)' },
  };
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold" style={styles[variant]}>
      {children}
    </span>
  );
}

function DsLink({ href, children, arrow = false }: { href?: string; children: React.ReactNode; arrow?: boolean }) {
  return (
    <a href={href || '#'} className="inline-flex items-center gap-1 text-[13px] font-medium transition-opacity hover:opacity-80" style={{ color: 'var(--ds-link)' }}>
      <span className="underline underline-offset-2">{children}</span>
      {arrow && (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      )}
    </a>
  );
}

function DsDivider({ label }: { label?: string }) {
  if (label) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: 'var(--ds-divider)' }} />
        <span className="text-[11px] font-medium" style={{ color: 'var(--ds-text-tertiary)' }}>{label}</span>
        <div className="flex-1 h-px" style={{ background: 'var(--ds-divider)' }} />
      </div>
    );
  }
  return <div className="h-px" style={{ background: 'var(--ds-divider)' }} />;
}

function DsAvatar({
  size = 'md', initials, icon, src,
}: {
  size?: DsSize; initials?: string; icon?: React.ReactNode; src?: string;
}) {
  const sizeMap = { sm: 'w-6 h-6 text-[10px]', md: 'w-8 h-8 text-[12px]', lg: 'w-10 h-10 text-[14px]' };
  return (
    <div className={`${sizeMap[size]} rounded-full flex items-center justify-center flex-shrink-0 font-semibold overflow-hidden`}
      style={{ background: 'var(--ds-accent-bg)', color: 'var(--ds-accent)' }}>
      {src ? <img src={src} alt="" className="w-full h-full object-cover" /> : icon ? icon : initials || '?'}
    </div>
  );
}

function DsIconButton({
  variant = 'ghost', size = 'md', disabled = false, children, onClick,
}: {
  variant?: 'ghost' | 'filled'; size?: 'sm' | 'md'; disabled?: boolean;
  children: React.ReactNode; onClick?: () => void;
}) {
  const sizeMap = { sm: 'w-7 h-7 rounded-lg', md: 'w-9 h-9 rounded-xl' };
  return (
    <button onClick={onClick} disabled={disabled}
      className={`${sizeMap[size]} flex items-center justify-center transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed`}
      style={{
        background: variant === 'filled' ? 'var(--ds-overlay-bg)' : 'transparent',
        color: 'var(--ds-text-secondary)',
        border: variant === 'filled' ? '1px solid var(--ds-border-strong)' : 'none',
      }}>
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════════
   Atoms Showcase — Interactive Demos
   ═══════════════════════════════════════════════ */

function AtomsShowcase() {
  const [checkStates, setCheckStates] = useState([true, false, false]);
  const [radioVal, setRadioVal] = useState(0);
  const [toggleStates, setToggleStates] = useState([true, false]);
  const [inputVal, setInputVal] = useState('');
  const [inputErr, setInputErr] = useState('');

  return (
    <div className="space-y-12">
      {/* ── Buttons ── */}
      <section>
        <SectionHeader title="Button" description="DsButton — primary, secondary, ghost, link, danger variants · sm/md/lg sizes · loading & disabled states" />
        <div className="grid grid-cols-1 gap-6">
          <WidgetCard title="Button Variants" widgetType="DsButton — variant · size · disabled · loading · fullWidth · icon">
            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-mono mb-3" style={{ color: 'var(--ds-text-tertiary)' }}>variants (md)</p>
                <div className="flex flex-wrap items-center gap-3">
                  <DsButton variant="primary">Primary</DsButton>
                  <DsButton variant="secondary">Secondary</DsButton>
                  <DsButton variant="ghost">Ghost</DsButton>
                  <DsButton variant="link">Link Action</DsButton>
                  <DsButton variant="danger">Danger</DsButton>
                </div>
              </div>
              <DsDivider />
              <div>
                <p className="text-[11px] font-mono mb-3" style={{ color: 'var(--ds-text-tertiary)' }}>sizes</p>
                <div className="flex flex-wrap items-end gap-3">
                  <DsButton variant="primary" size="sm">Small</DsButton>
                  <DsButton variant="primary" size="md">Medium</DsButton>
                  <DsButton variant="primary" size="lg">Large</DsButton>
                </div>
              </div>
              <DsDivider />
              <div>
                <p className="text-[11px] font-mono mb-3" style={{ color: 'var(--ds-text-tertiary)' }}>states</p>
                <div className="flex flex-wrap items-center gap-3">
                  <DsButton variant="primary">Default</DsButton>
                  <DsButton variant="primary" disabled>Disabled</DsButton>
                  <DsButton variant="primary" loading>Loading</DsButton>
                  <DsButton variant="secondary" disabled>Disabled</DsButton>
                  <DsButton variant="secondary" loading>Loading</DsButton>
                </div>
              </div>
              <DsDivider />
              <div>
                <p className="text-[11px] font-mono mb-3" style={{ color: 'var(--ds-text-tertiary)' }}>full width</p>
                <div className="space-y-2">
                  <DsButton variant="primary" fullWidth>Full Width Primary</DsButton>
                  <DsButton variant="secondary" fullWidth>Full Width Secondary</DsButton>
                </div>
              </div>
              <DsDivider />
              <div>
                <p className="text-[11px] font-mono mb-3" style={{ color: 'var(--ds-text-tertiary)' }}>with icon</p>
                <div className="flex flex-wrap items-center gap-3">
                  <DsButton variant="primary" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>}>Add Item</DsButton>
                  <DsButton variant="secondary" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>}>Upload</DsButton>
                  <DsButton variant="danger" size="sm" icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>}>Delete</DsButton>
                </div>
              </div>
            </div>
          </WidgetCard>
        </div>
      </section>

      {/* ── Input ── */}
      <section>
        <SectionHeader title="Input" description="DsInput — text/number/tel/email types · icon prefix · suffix · helper text · error state" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WidgetCard title="Input States" widgetType="DsInput — type · placeholder · icon · suffix · helperText · error">
            <div className="space-y-4">
              <DsInput placeholder="Default input" helperText="Helper text goes here" />
              <DsInput placeholder="With prefix icon" icon={<svg className="w-4 h-4" style={{ color: 'var(--ds-text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>} />
              <DsInput type="number" placeholder="Amount" suffix="INR" />
              <DsInput placeholder="Error state" error="This field is required" value={inputVal} onChange={setInputVal} />
              <DsInput placeholder="Disabled input" disabled />
            </div>
          </WidgetCard>
          <WidgetCard title="Interactive Input" widgetType="DsInput — live validation demo">
            <div className="space-y-4">
              <DsInput
                type="email" placeholder="Enter email address"
                icon={<svg className="w-4 h-4" style={{ color: 'var(--ds-text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>}
                value={inputVal} onChange={(v) => { setInputVal(v); setInputErr(v && !v.includes('@') ? 'Enter a valid email' : ''); }}
                error={inputErr}
                helperText={!inputErr && inputVal ? 'Looks good!' : ''}
              />
              <DsInput type="tel" placeholder="Mobile number" helperText="10-digit Indian mobile number" />
            </div>
          </WidgetCard>
        </div>
      </section>

      {/* ── Checkbox ── */}
      <section>
        <SectionHeader title="Checkbox" description="DsCheckbox — custom styled checkbox with label · checked / unchecked / disabled states" />
        <div className="grid grid-cols-1 gap-6">
          <WidgetCard title="Checkbox States" widgetType="DsCheckbox — checked · disabled · label · onChange">
            <div className="space-y-4">
              <DsCheckbox checked={checkStates[0]} onChange={(v) => { const c = [...checkStates]; c[0] = v; setCheckStates(c); }} label="Checked — I agree to the terms & conditions" />
              <DsCheckbox checked={checkStates[1]} onChange={(v) => { const c = [...checkStates]; c[1] = v; setCheckStates(c); }} label="Unchecked — Send me updates via SMS" />
              <DsCheckbox checked={checkStates[2]} onChange={(v) => { const c = [...checkStates]; c[2] = v; setCheckStates(c); }} label="Unchecked — Add-on cyber protection" />
              <DsDivider />
              <DsCheckbox checked disabled label="Disabled checked" />
              <DsCheckbox disabled label="Disabled unchecked" />
            </div>
          </WidgetCard>
        </div>
      </section>

      {/* ── Radio ── */}
      <section>
        <SectionHeader title="Radio" description="DsRadio — custom styled radio with label · selected / unselected / disabled states" />
        <div className="grid grid-cols-1 gap-6">
          <WidgetCard title="Radio Group" widgetType="DsRadio — selected · disabled · label · onChange">
            <div className="space-y-4">
              <p className="text-[11px] font-mono" style={{ color: 'var(--ds-text-tertiary)' }}>Select your plan</p>
              {['Comprehensive Cover', 'Third Party Only', 'Own Damage Only'].map((opt, i) => (
                <DsRadio key={i} selected={radioVal === i} onChange={() => setRadioVal(i)} label={opt} />
              ))}
              <DsDivider />
              <DsRadio selected disabled label="Disabled selected" />
              <DsRadio disabled label="Disabled unselected" />
            </div>
          </WidgetCard>
        </div>
      </section>

      {/* ── Toggle ── */}
      <section>
        <SectionHeader title="Toggle" description="DsToggle — pill-shaped switch · on / off / disabled states" />
        <div className="grid grid-cols-1 gap-6">
          <WidgetCard title="Toggle States" widgetType="DsToggle — on · disabled · label · onChange">
            <div className="space-y-4">
              <DsToggle on={toggleStates[0]} onChange={(v) => { const t = [...toggleStates]; t[0] = v; setToggleStates(t); }} label="Dark mode" />
              <DsToggle on={toggleStates[1]} onChange={(v) => { const t = [...toggleStates]; t[1] = v; setToggleStates(t); }} label="Email notifications" />
              <DsDivider />
              <DsToggle on disabled label="Disabled on" />
              <DsToggle disabled label="Disabled off" />
            </div>
          </WidgetCard>
        </div>
      </section>

      {/* ── Badge ── */}
      <section>
        <SectionHeader title="Badge" description="DsBadge — default, success, warning, error, info variants for status indicators" />
        <div className="grid grid-cols-1 gap-6">
          <WidgetCard title="Badge Variants" widgetType="DsBadge — variant · children">
            <div className="flex flex-wrap items-center gap-3">
              <DsBadge>Default</DsBadge>
              <DsBadge variant="success">Active</DsBadge>
              <DsBadge variant="warning">Pending</DsBadge>
              <DsBadge variant="error">Expired</DsBadge>
              <DsBadge variant="info">New</DsBadge>
            </div>
          </WidgetCard>
        </div>
      </section>

      {/* ── Link ── */}
      <section>
        <SectionHeader title="Link" description="DsLink — inline text link with accent color · optional trailing arrow" />
        <div className="grid grid-cols-1 gap-6">
          <WidgetCard title="Link Variants" widgetType="DsLink — href · arrow · children">
            <div className="space-y-3">
              <div><DsLink>Simple link</DsLink></div>
              <div><DsLink arrow>Link with arrow</DsLink></div>
              <div><span className="text-[13px]" style={{ color: 'var(--ds-text)' }}>Read our <DsLink>terms & conditions</DsLink> before proceeding</span></div>
            </div>
          </WidgetCard>
        </div>
      </section>

      {/* ── Divider ── */}
      <section>
        <SectionHeader title="Divider" description="DsDivider — horizontal rule · optional centered label" />
        <div className="grid grid-cols-1 gap-6">
          <WidgetCard title="Divider Variants" widgetType="DsDivider — label">
            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-mono mb-3" style={{ color: 'var(--ds-text-tertiary)' }}>plain</p>
                <DsDivider />
              </div>
              <div>
                <p className="text-[11px] font-mono mb-3" style={{ color: 'var(--ds-text-tertiary)' }}>with label</p>
                <DsDivider label="OR" />
              </div>
              <div>
                <p className="text-[11px] font-mono mb-3" style={{ color: 'var(--ds-text-tertiary)' }}>with label (contextual)</p>
                <DsDivider label="Payment Methods" />
              </div>
            </div>
          </WidgetCard>
        </div>
      </section>

      {/* ── Avatar ── */}
      <section>
        <SectionHeader title="Avatar" description="DsAvatar — initials or icon based · sm / md / lg sizes" />
        <div className="grid grid-cols-1 gap-6">
          <WidgetCard title="Avatar Variants" widgetType="DsAvatar — size · initials · icon · src">
            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-mono mb-3" style={{ color: 'var(--ds-text-tertiary)' }}>sizes (initials)</p>
                <div className="flex items-end gap-3">
                  <DsAvatar size="sm" initials="A" />
                  <DsAvatar size="md" initials="CB" />
                  <DsAvatar size="lg" initials="DS" />
                </div>
              </div>
              <DsDivider />
              <div>
                <p className="text-[11px] font-mono mb-3" style={{ color: 'var(--ds-text-tertiary)' }}>with icon</p>
                <div className="flex items-end gap-3">
                  <DsAvatar size="sm" icon={<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>} />
                  <DsAvatar size="md" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>} />
                  <DsAvatar size="lg" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>} />
                </div>
              </div>
            </div>
          </WidgetCard>
        </div>
      </section>

      {/* ── Icon Button ── */}
      <section>
        <SectionHeader title="Icon Button" description="DsIconButton — square icon-only button · ghost & filled variants · sm / md sizes" />
        <div className="grid grid-cols-1 gap-6">
          <WidgetCard title="Icon Button Variants" widgetType="DsIconButton — variant · size · disabled">
            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-mono mb-3" style={{ color: 'var(--ds-text-tertiary)' }}>ghost</p>
                <div className="flex items-center gap-3">
                  <DsIconButton size="sm"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></DsIconButton>
                  <DsIconButton size="md"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg></DsIconButton>
                  <DsIconButton size="md" disabled><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></DsIconButton>
                </div>
              </div>
              <DsDivider />
              <div>
                <p className="text-[11px] font-mono mb-3" style={{ color: 'var(--ds-text-tertiary)' }}>filled</p>
                <div className="flex items-center gap-3">
                  <DsIconButton variant="filled" size="sm"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg></DsIconButton>
                  <DsIconButton variant="filled" size="md"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg></DsIconButton>
                  <DsIconButton variant="filled" size="md" disabled><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg></DsIconButton>
                </div>
              </div>
            </div>
          </WidgetCard>
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Asset Library Component
   ═══════════════════════════════════════════════ */

const ASSET_CATEGORIES: { id: AssetCategory; label: string; count: number }[] = [
  { id: 'all', label: 'All Icons', count: ICON_REGISTRY.length },
  { id: 'generic', label: 'Generic', count: ICON_REGISTRY.filter(i => i.category === 'generic').length },
  { id: 'car-bike', label: 'Car & Bike', count: ICON_REGISTRY.filter(i => i.category === 'car-bike').length },
  { id: 'health-life', label: 'Health & Life', count: ICON_REGISTRY.filter(i => i.category === 'health-life').length },
];

function AssetLibrary() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<AssetCategory>('all');
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const filtered = ICON_REGISTRY.filter(icon => {
    const matchesCategory = activeCategory === 'all' || icon.category === activeCategory;
    const matchesSearch = search === '' || icon.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 1500);
  };

  return (
    <>
      <section>
        <SectionHeader title="Asset Library" description={`${ICON_REGISTRY.length} icons across 3 categories — click any icon to copy its path`} />

        {/* Search + Category Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" stroke="var(--ds-text-tertiary)" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search icons..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-[13px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              style={{ background: 'var(--ds-input-bg)', border: '1px solid var(--ds-input-border)', color: 'var(--ds-input-text)' }}
            />
          </div>
          <div className="flex gap-1.5 p-1 rounded-xl" style={{ background: 'var(--ds-surface-2)' }}>
            {ASSET_CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className="px-3 py-2 rounded-lg text-[12px] font-semibold transition-all whitespace-nowrap"
                style={{
                  background: activeCategory === cat.id ? 'var(--ds-cta-bg)' : 'transparent',
                  color: activeCategory === cat.id ? 'var(--ds-cta-text)' : 'var(--ds-text-secondary)',
                }}>
                {cat.label} <span className="opacity-60">({cat.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-[12px] mb-4" style={{ color: 'var(--ds-text-tertiary)' }}>
          {filtered.length} icon{filtered.length !== 1 ? 's' : ''}{search && ` matching "${search}"`}
        </p>

        {/* Icon Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {filtered.map(icon => (
              <button key={icon.path} onClick={() => handleCopy(icon.path)} title={`${icon.name}\n${icon.path}`}
                className="group flex flex-col items-center gap-2 p-3 rounded-xl transition-all active:scale-95"
                style={{
                  background: copiedPath === icon.path ? 'var(--ds-success-bg)' : 'var(--ds-surface)',
                  border: `1px solid ${copiedPath === icon.path ? 'var(--ds-success)' : 'var(--ds-border-strong)'}`,
                }}>
                <div className="w-7 h-7 flex items-center justify-center">
                  <img src={icon.path} alt={icon.name} className="w-6 h-6"
                    style={{ filter: 'var(--ds-icon-filter)', opacity: 'var(--ds-icon-opacity)' }} />
                </div>
                <p className="text-[9px] leading-tight text-center truncate w-full" style={{ color: copiedPath === icon.path ? 'var(--ds-success)' : 'var(--ds-text-tertiary)' }}>
                  {copiedPath === icon.path ? 'Copied!' : icon.name}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center rounded-2xl" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border-strong)' }}>
            <svg className="w-10 h-10 mx-auto mb-3" fill="none" stroke="var(--ds-text-tertiary)" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <p className="text-[14px] font-semibold" style={{ color: 'var(--ds-text)' }}>No icons found</p>
            <p className="text-[12px] mt-1" style={{ color: 'var(--ds-text-tertiary)' }}>Try a different search term or category</p>
          </div>
        )}
      </section>

      {/* Illustrations placeholder */}
      <section>
        <SectionHeader title="Illustrations" description="Coming soon — brand illustrations for onboarding, empty states, and success moments" />
        <div className="py-12 text-center rounded-2xl" style={{ background: 'var(--ds-surface)', border: '1px dashed var(--ds-border-strong)' }}>
          <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="var(--ds-text-tertiary)" viewBox="0 0 24 24" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V4.5a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v15a1.5 1.5 0 001.5 1.5z" />
          </svg>
          <p className="text-[14px] font-semibold" style={{ color: 'var(--ds-text-secondary)' }}>Illustrations coming soon</p>
          <p className="text-[12px] mt-1" style={{ color: 'var(--ds-text-tertiary)' }}>Drop illustration SVGs into <code className="text-[11px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--ds-overlay-bg)', color: 'var(--ds-accent)' }}>public/illustrations/</code></p>
        </div>
      </section>
    </>
  );
}

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
  --ds-text-secondary: #B0B0B0;
  --ds-text-tertiary: #808080;
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
  --ds-bot-text: #FFFFFF;
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
  --app-text-muted: #B0B0B0;
  --app-text-subtle: #808080;
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
  --app-bot-text: #FFFFFF;
  --app-user-bubble-bg: #FFFFFF;
  --app-user-bubble-text: #1C0B47;

  /* ── Motor tokens ── */
  --motor-bg: #121214;
  --motor-surface: #1E1E22;
  --motor-surface-2: #2D2D35;
  --motor-surface-hover: #3D3D45;
  --motor-text: #FFFFFF;
  --motor-text-muted: #B0B0B0;
  --motor-text-subtle: #808080;
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
  --motor-bot-text: #FFFFFF;
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
  --ds-border-strong: rgba(0,0,0,0.12);
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
  --ds-accent-bg: #EDE9FE;
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
  --ds-overlay-bg: rgba(0,0,0,0.05);
  --ds-glass-bg: rgba(255,255,255,0.95);
  --ds-header-bg: #EDE9FA;
  --ds-divider: rgba(0,0,0,0.12);
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
  const [activeLob, setActiveLob] = useState<LobTab>('foundations');
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
           FOUNDATIONS TAB
           ════════════════════════════════════════ */}
        {activeLob === 'foundations' && (
          <>
            {/* ── 1. Color Tokens ── */}
            <section>
              <SectionHeader title="Color Tokens" description="ACKO palette system — 6 scales, 8 steps each. Use semantic CSS variables in components, never raw hex." />

              {/* Palette swatches */}
              <div className="space-y-6">
                {[
                  { name: 'Purple', desc: 'Brand primary', colors: { 100: '#F8F7FD', 200: '#ECEBFF', 300: '#D1C5FA', 400: '#B59CF5', 500: '#926FF3', 600: '#4E29BB', 700: '#2E1773', 800: '#18084A' } },
                  { name: 'Onyx', desc: 'Neutrals', colors: { 100: '#FFFFFF', 200: '#F6F6F6', 300: '#E7E7E7', 400: '#B0B0B0', 500: '#5D5D5D', 600: '#2F2F2F', 700: '#121212', 800: '#0A0A0A' } },
                  { name: 'Cerise', desc: 'Error / destructive', colors: { 100: '#FDF2F8', 200: '#FCE7F4', 300: '#FAD0E9', 400: '#F8A9D6', 500: '#EC5FAB', 600: '#D82A7B', 700: '#981950', 800: '#4F0826' } },
                  { name: 'Picton', desc: 'Info / links', colors: { 100: '#EEFAFF', 200: '#DEF7FF', 300: '#A1E7FD', 400: '#59D8FF', 500: '#1EB7E7', 600: '#009DE0', 700: '#006A97', 800: '#004768' } },
                  { name: 'Leafy', desc: 'Success / positive', colors: { 100: '#F3FFF2', 200: '#DAFAD7', 300: '#B2F2AD', 400: '#85E37D', 500: '#55B94D', 600: '#149A40', 700: '#1C772C', 800: '#004A19' } },
                  { name: 'Sunshade', desc: 'Warning / attention', colors: { 100: '#FFF8E7', 200: '#FFEDC5', 300: '#FFD79B', 400: '#FFC368', 500: '#F4A024', 600: '#D97700', 700: '#B15A08', 800: '#5B2C00' } },
                ].map(palette => (
                  <div key={palette.name} className="rounded-2xl p-5" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border-strong)' }}>
                    <div className="flex items-baseline gap-2 mb-3">
                      <h3 className="text-[15px] font-semibold" style={{ color: 'var(--ds-text)' }}>{palette.name}</h3>
                      <span className="text-[12px]" style={{ color: 'var(--ds-text-tertiary)' }}>{palette.desc}</span>
                    </div>
                    <div className="grid grid-cols-8 gap-2">
                      {Object.entries(palette.colors).map(([step, hex]) => (
                        <div key={step}>
                          <div className="h-12 rounded-lg mb-1.5" style={{ background: hex, border: '1px solid var(--ds-border)' }} />
                          <p className="text-[10px] font-semibold" style={{ color: 'var(--ds-text-secondary)' }}>{step}</p>
                          <p className="text-[9px] font-mono" style={{ color: 'var(--ds-text-tertiary)' }}>{hex}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Semantic tokens */}
              <div className="mt-8">
                <h3 className="text-[17px] font-semibold mb-4" style={{ color: 'var(--ds-text)' }}>Semantic Tokens</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {[
                    { group: 'Backgrounds', tokens: [
                      { name: '--ds-bg', desc: 'Page background' },
                      { name: '--ds-surface', desc: 'Card / panel' },
                      { name: '--ds-surface-2', desc: 'Elevated card / inner section' },
                      { name: '--ds-overlay-bg', desc: 'Subtle tint overlay' },
                      { name: '--ds-glass-bg', desc: 'Frosted glass panels' },
                    ]},
                    { group: 'Text', tokens: [
                      { name: '--ds-text', desc: 'Primary text' },
                      { name: '--ds-text-secondary', desc: 'Muted / supporting' },
                      { name: '--ds-text-tertiary', desc: 'Hints / subtle' },
                      { name: '--ds-link', desc: 'Links / accent text' },
                    ]},
                    { group: 'Borders', tokens: [
                      { name: '--ds-border', desc: 'Default — very subtle' },
                      { name: '--ds-border-strong', desc: 'Visible — cards, inputs' },
                      { name: '--ds-divider', desc: 'Section dividers' },
                    ]},
                    { group: 'Interactive', tokens: [
                      { name: '--ds-accent', desc: 'Brand accent' },
                      { name: '--ds-cta-bg', desc: 'Primary CTA background' },
                      { name: '--ds-cta-text', desc: 'Primary CTA text' },
                      { name: '--ds-selected-bg', desc: 'Selected state fill' },
                      { name: '--ds-selected-border', desc: 'Selected state ring' },
                    ]},
                    { group: 'Feedback', tokens: [
                      { name: '--ds-success', desc: 'Success / check' },
                      { name: '--ds-warning-text', desc: 'Warning text' },
                      { name: '--ds-error-text', desc: 'Error text' },
                    ]},
                    { group: 'Inputs', tokens: [
                      { name: '--ds-input-bg', desc: 'Input fill' },
                      { name: '--ds-input-border', desc: 'Input border' },
                      { name: '--ds-input-text', desc: 'Input value text' },
                      { name: '--ds-input-placeholder', desc: 'Placeholder text' },
                    ]},
                  ].map(g => (
                    <div key={g.group} className="rounded-2xl p-4" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border-strong)' }}>
                      <h4 className="text-[13px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--ds-text-secondary)' }}>{g.group}</h4>
                      <div className="space-y-2">
                        {g.tokens.map(t => (
                          <div key={t.name} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ background: `var(${t.name})`, border: '1px solid var(--ds-border)' }} />
                            <div className="min-w-0">
                              <p className="text-[12px] font-mono font-medium truncate" style={{ color: 'var(--ds-text)' }}>{t.name}</p>
                              <p className="text-[11px]" style={{ color: 'var(--ds-text-tertiary)' }}>{t.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── 2. Typography ── */}
            <section>
              <SectionHeader title="Typography" description="Euclid Circular B — all type scales with size, line-height, weight, and letter-spacing" />
              <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border-strong)' }}>
                {[
                  { name: 'display-xl', size: '72px', lh: '80px', weight: '700', ls: '-2px', sample: 'Aa' },
                  { name: 'display-lg', size: '56px', lh: '64px', weight: '700', ls: '-1.5px', sample: 'Display Large' },
                  { name: 'display-md', size: '48px', lh: '56px', weight: '700', ls: '-1px', sample: 'Display Medium' },
                  { name: 'display-sm', size: '40px', lh: '48px', weight: '600', ls: '-0.5px', sample: 'Display Small' },
                  { name: 'heading-xl', size: '32px', lh: '40px', weight: '600', ls: '-0.5px', sample: 'Heading XL' },
                  { name: 'heading-lg', size: '24px', lh: '32px', weight: '600', ls: '-0.3px', sample: 'Heading Large' },
                  { name: 'heading-md', size: '20px', lh: '28px', weight: '600', ls: '-0.2px', sample: 'Heading Medium' },
                  { name: 'heading-sm', size: '18px', lh: '24px', weight: '600', ls: '0', sample: 'Heading Small' },
                  { name: 'body-lg', size: '18px', lh: '28px', weight: '400', ls: '0', sample: 'Body large — used for hero descriptions and key paragraphs' },
                  { name: 'body-md', size: '16px', lh: '24px', weight: '400', ls: '0', sample: 'Body medium — default reading text across the app' },
                  { name: 'body-sm', size: '14px', lh: '20px', weight: '400', ls: '0', sample: 'Body small — card descriptions, form labels, secondary info' },
                  { name: 'label-lg', size: '14px', lh: '20px', weight: '500', ls: '0.1px', sample: 'Label Large' },
                  { name: 'label-md', size: '12px', lh: '16px', weight: '500', ls: '0.2px', sample: 'Label Medium' },
                  { name: 'label-sm', size: '11px', lh: '14px', weight: '500', ls: '0.3px', sample: 'Label Small' },
                  { name: 'caption', size: '12px', lh: '16px', weight: '400', ls: '0', sample: 'Caption — helper text, timestamps' },
                  { name: 'overline', size: '11px', lh: '16px', weight: '600', ls: '0.5px', sample: 'OVERLINE — SECTION LABELS' },
                ].map((t, i) => (
                  <div key={t.name} className="flex items-baseline gap-6 px-5 py-4" style={{ borderBottom: i < 15 ? '1px solid var(--ds-divider)' : 'none' }}>
                    <div className="w-32 flex-shrink-0">
                      <p className="text-[12px] font-mono font-medium" style={{ color: 'var(--ds-accent)' }}>{t.name}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: 'var(--ds-text-tertiary)' }}>{t.size} / {t.lh} / {t.weight}{t.ls !== '0' ? ` / ${t.ls}` : ''}</p>
                    </div>
                    <p className="flex-1 min-w-0 truncate" style={{
                      color: 'var(--ds-text)',
                      fontSize: t.name.startsWith('display') ? `min(${t.size}, 5vw)` : t.size,
                      lineHeight: t.lh,
                      fontWeight: t.weight,
                      letterSpacing: t.ls,
                    }}>{t.sample}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── 3. Spacing ── */}
            <section>
              <SectionHeader title="Spacing" description="4px base unit — consistent spacing scale used across all components" />
              <div className="rounded-2xl p-5" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border-strong)' }}>
                <div className="space-y-3">
                  {[
                    { token: '1', px: '4px' }, { token: '2', px: '8px' }, { token: '3', px: '12px' },
                    { token: '4', px: '16px' }, { token: '5', px: '20px' }, { token: '6', px: '24px' },
                    { token: '8', px: '32px' }, { token: '10', px: '40px' }, { token: '12', px: '48px' },
                    { token: '16', px: '64px' }, { token: '20', px: '80px' }, { token: '24', px: '96px' },
                  ].map(s => (
                    <div key={s.token} className="flex items-center gap-4">
                      <div className="w-16 flex-shrink-0 text-right">
                        <span className="text-[12px] font-mono font-medium" style={{ color: 'var(--ds-accent)' }}>{s.token}</span>
                        <span className="text-[10px] ml-1" style={{ color: 'var(--ds-text-tertiary)' }}>{s.px}</span>
                      </div>
                      <div className="flex-1">
                        <div className="h-3 rounded-sm" style={{ width: s.px, background: 'var(--ds-accent)', opacity: 0.7 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── 4. Radius & Stroke ── */}
            <section>
              <SectionHeader title="Radius & Stroke" description="Border radius tokens and border weight conventions" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-2xl p-5" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border-strong)' }}>
                  <h4 className="text-[13px] font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--ds-text-secondary)' }}>Border Radius</h4>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { name: 'sm', value: '6px' }, { name: 'DEFAULT', value: '8px' }, { name: 'md', value: '10px' },
                      { name: 'lg', value: '12px' }, { name: 'xl', value: '14px' }, { name: '2xl', value: '16px' },
                      { name: '3xl', value: '20px' }, { name: '4xl', value: '24px' },
                    ].map(r => (
                      <div key={r.name} className="text-center">
                        <div className="w-full aspect-square flex items-center justify-center" style={{ background: 'var(--ds-accent-bg)', border: '2px solid var(--ds-accent)', borderRadius: r.value }}>
                          <span className="text-[10px] font-mono font-medium" style={{ color: 'var(--ds-accent)' }}>{r.value}</span>
                        </div>
                        <p className="text-[11px] font-mono mt-1.5" style={{ color: 'var(--ds-text)' }}>{r.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl p-5" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border-strong)' }}>
                  <h4 className="text-[13px] font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--ds-text-secondary)' }}>Stroke Weight</h4>
                  <div className="space-y-4">
                    {[
                      { name: 'Hairline', value: '0.5px', desc: 'Retina-only dividers' },
                      { name: 'Default', value: '1px', desc: 'Cards, dividers, inputs' },
                      { name: 'Medium', value: '1.5px', desc: 'Selected states, focused inputs' },
                      { name: 'Thick', value: '2px', desc: 'Active tabs, emphasis borders' },
                    ].map(s => (
                      <div key={s.name} className="flex items-center gap-4">
                        <div className="w-24 flex-shrink-0">
                          <p className="text-[12px] font-medium" style={{ color: 'var(--ds-text)' }}>{s.name}</p>
                          <p className="text-[10px]" style={{ color: 'var(--ds-text-tertiary)' }}>{s.desc}</p>
                        </div>
                        <div className="flex-1 flex items-center">
                          <div className="w-full" style={{ height: s.value, background: 'var(--ds-accent)' }} />
                        </div>
                        <span className="text-[11px] font-mono flex-shrink-0" style={{ color: 'var(--ds-text-secondary)' }}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ── 5. Elevation ── */}
            <section>
              <SectionHeader title="Elevation" description="Box shadow hierarchy — from subtle cards to prominent modals" />
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'card', value: '0 2px 12px rgba(0,0,0,0.08)', desc: 'Default card resting state' },
                  { name: 'card-hover', value: '0 4px 20px rgba(0,0,0,0.12)', desc: 'Card on hover / focus' },
                  { name: 'dropdown', value: '0 4px 24px rgba(0,0,0,0.12)', desc: 'Menus, popover panels' },
                  { name: 'modal', value: '0 8px 40px rgba(0,0,0,0.16)', desc: 'Modals, bottom sheets' },
                  { name: 'focus', value: '0 0 0 3px #ECEBFF', desc: 'Default focus ring' },
                  { name: 'focus-purple', value: '0 0 0 3px #D1C5FA', desc: 'Brand accent focus ring' },
                ].map(s => (
                  <div key={s.name} className="text-center">
                    <div className="h-24 rounded-2xl flex items-center justify-center transition-shadow"
                      style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border)', boxShadow: s.value }}>
                      <span className="text-[12px] font-mono font-medium" style={{ color: 'var(--ds-text-secondary)' }}>{s.name}</span>
                    </div>
                    <p className="text-[11px] mt-2" style={{ color: 'var(--ds-text-tertiary)' }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── 6. Effects ── */}
            <section>
              <SectionHeader title="Effects" description="Glass, gradients, and overlay treatments" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="h-32 rounded-2xl flex items-center justify-center"
                  style={{ background: 'var(--ds-glass-bg)', backdropFilter: 'blur(16px)', border: '1px solid var(--ds-border-strong)' }}>
                  <div className="text-center">
                    <p className="text-[13px] font-semibold" style={{ color: 'var(--ds-text)' }}>Glass</p>
                    <p className="text-[11px]" style={{ color: 'var(--ds-text-tertiary)' }}>backdrop-filter: blur(16px)</p>
                  </div>
                </div>
                <div className="h-32 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #4E29BB 0%, #7C3AED 100%)' }}>
                  <div className="text-center">
                    <p className="text-[13px] font-semibold" style={{ color: '#FFFFFF' }}>Brand Gradient</p>
                    <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.6)' }}>Purple 600 → Purple 500</p>
                  </div>
                </div>
                <div className="h-32 rounded-2xl flex items-center justify-center"
                  style={{ background: 'var(--ds-overlay-bg)', border: '1px solid var(--ds-border)' }}>
                  <div className="text-center">
                    <p className="text-[13px] font-semibold" style={{ color: 'var(--ds-text)' }}>Overlay</p>
                    <p className="text-[11px]" style={{ color: 'var(--ds-text-tertiary)' }}>Subtle tint layer</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 7. Motion Primitives ── */}
            <section>
              <SectionHeader title="Motion Primitives" description="Predefined animation tokens — use sparingly for meaningful transitions" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[
                  { name: 'fade-in', duration: '300ms', easing: 'ease-out', desc: 'Opacity 0 → 1. Default entrance.' },
                  { name: 'slide-up', duration: '300ms', easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)', desc: 'Translate Y 16px → 0 with fade. Cards, modals.' },
                  { name: 'slide-down', duration: '300ms', easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)', desc: 'Translate Y -16px → 0 with fade. Dropdown menus.' },
                  { name: 'scale-in', duration: '200ms', easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)', desc: 'Scale 0.95 → 1 with fade. Toasts, alerts.' },
                  { name: 'pulse-soft', duration: '2s', easing: 'ease-in-out infinite', desc: 'Opacity pulse. Loading indicators.' },
                  { name: 'price-update', duration: '400ms', easing: 'cubic-bezier(0.165, 0.84, 0.44, 1)', desc: 'Scale bounce 1 → 1.05 → 1. Price changes.' },
                ].map(m => (
                  <div key={m.name} className="flex items-start gap-4 p-4 rounded-xl" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border-strong)' }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--ds-accent-bg)' }}>
                      <svg className="w-4 h-4" fill="none" stroke="var(--ds-accent)" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-mono font-semibold" style={{ color: 'var(--ds-text)' }}>{m.name}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: 'var(--ds-text-tertiary)' }}>{m.duration} · {m.easing}</p>
                      <p className="text-[12px] mt-1" style={{ color: 'var(--ds-text-secondary)' }}>{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 rounded-xl" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border-strong)' }}>
                <h4 className="text-[13px] font-semibold mb-2" style={{ color: 'var(--ds-text)' }}>Interaction Feedback</h4>
                <p className="text-[12px] mb-3" style={{ color: 'var(--ds-text-secondary)' }}>All interactive elements must include <code className="text-[11px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--ds-overlay-bg)', color: 'var(--ds-accent)' }}>active:scale-95</code> or <code className="text-[11px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--ds-overlay-bg)', color: 'var(--ds-accent)' }}>active:scale-[0.97]</code> for tactile press feedback.</p>
                <div className="flex gap-3">
                  <button className="px-5 py-2.5 rounded-xl text-[13px] font-semibold active:scale-95 transition-transform"
                    style={{ background: 'var(--ds-cta-bg)', color: 'var(--ds-cta-text)' }}>Press me</button>
                  <button className="px-5 py-2.5 rounded-xl text-[13px] font-semibold active:scale-[0.97] transition-transform"
                    style={{ background: 'var(--ds-surface-2)', color: 'var(--ds-text)', border: '1px solid var(--ds-border-strong)' }}>Press me too</button>
                </div>
              </div>
            </section>

            {/* ── 8. Copy Principles ── */}
            <section>
              <SectionHeader title="Copy Principles" description="ACKO content writing guidelines — voice, tone, vocabulary, and formatting rules" />
              <div className="space-y-6">
                {/* Voice & Personality */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="rounded-2xl p-5" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border-strong)' }}>
                    <h4 className="text-[13px] font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--ds-text-secondary)' }}>Core Voice</h4>
                    <div className="space-y-3">
                      {[
                        { trait: 'Clear and direct', desc: 'Professional, simple, easy to understand. Say what matters, fast.' },
                        { trait: 'Helpful and empowering', desc: 'Every line should reduce doubt, effort, or confusion.' },
                        { trait: 'User-first, not brand-first', desc: 'The user is the hero. ACKO is the enabler.' },
                        { trait: 'Localization-friendly', desc: 'Plain, neutral English that works across Indian contexts.' },
                      ].map(v => (
                        <div key={v.trait} className="flex gap-3">
                          <div className="w-1.5 rounded-full flex-shrink-0 mt-1" style={{ background: 'var(--ds-accent)', height: '16px' }} />
                          <div>
                            <p className="text-[13px] font-semibold" style={{ color: 'var(--ds-text)' }}>{v.trait}</p>
                            <p className="text-[12px]" style={{ color: 'var(--ds-text-secondary)' }}>{v.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl p-5" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border-strong)' }}>
                    <h4 className="text-[13px] font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--ds-text-secondary)' }}>Brand Personality</h4>
                    <div className="space-y-3">
                      {[
                        { trait: 'Bold', desc: 'Take a clear stand. Avoid vague claims or soft language.' },
                        { trait: 'Optimistic', desc: 'Focus on outcomes, reassurance, and confidence.' },
                        { trait: 'Practical, with a wink', desc: 'Be concise and human. Light warmth is welcome.' },
                        { trait: 'Empathetic by default', desc: 'Especially in claims, payments, errors, and delays.' },
                      ].map(v => (
                        <div key={v.trait} className="flex gap-3">
                          <div className="w-1.5 rounded-full flex-shrink-0 mt-1" style={{ background: 'var(--ds-accent)', height: '16px' }} />
                          <div>
                            <p className="text-[13px] font-semibold" style={{ color: 'var(--ds-text)' }}>{v.trait}</p>
                            <p className="text-[12px]" style={{ color: 'var(--ds-text-secondary)' }}>{v.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* The ACKO Principle */}
                <div className="rounded-2xl p-5" style={{ background: 'var(--ds-accent-bg)', border: '1px solid var(--ds-selected-border)' }}>
                  <h4 className="text-[15px] font-semibold mb-3" style={{ color: 'var(--ds-text)' }}>The ACKO Copy Principle</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      'You are not selling insurance. You are helping someone feel secure.',
                      'Make users feel smarter, calmer, and more in control.',
                      'Highlight the problem clearly, then show ACKO as the simplest way out.',
                      'Aim to be clear, not clever. Clever slows users down.',
                    ].map((p, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <span className="text-[11px] font-bold flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'var(--ds-accent)', color: '#FFFFFF' }}>{i + 1}</span>
                        <p className="text-[13px]" style={{ color: 'var(--ds-text)' }}>{p}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Adaptive Tone */}
                <div className="rounded-2xl p-5" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border-strong)' }}>
                  <h4 className="text-[13px] font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--ds-text-secondary)' }}>Adaptive Tone by Context</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      { ctx: 'New users', tone: 'Prescriptive, supportive, step-by-step' },
                      { ctx: 'Returning users', tone: 'Direct, efficient, no extra explanation' },
                      { ctx: 'Problem resolution', tone: 'Calm, empathetic, solution-led' },
                      { ctx: 'Success moments', tone: 'Positive and celebratory, never over-the-top' },
                      { ctx: 'Educational content', tone: 'Thorough but scannable. Use bullets and short sections' },
                    ].map(t => (
                      <div key={t.ctx} className="p-3 rounded-xl" style={{ background: 'var(--ds-overlay-bg)' }}>
                        <p className="text-[12px] font-semibold" style={{ color: 'var(--ds-text)' }}>{t.ctx}</p>
                        <p className="text-[11px] mt-0.5" style={{ color: 'var(--ds-text-secondary)' }}>{t.tone}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* UI Copy Standards & Language Rules */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="rounded-2xl p-5" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border-strong)' }}>
                    <h4 className="text-[13px] font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--ds-text-secondary)' }}>UI Copy Standards</h4>
                    <div className="space-y-2.5">
                      {[
                        { rule: 'Tone', detail: 'Direct and concise. No filler words.' },
                        { rule: 'Voice', detail: 'Always active. Avoid passive constructions.' },
                        { rule: 'Person', detail: 'Use "you" and "your" consistently.' },
                        { rule: 'Action', detail: 'Every message should guide the next step.' },
                      ].map(r => (
                        <div key={r.rule} className="flex gap-3">
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: 'var(--ds-badge-bg)', color: 'var(--ds-badge-text)', border: '1px solid var(--ds-badge-border)' }}>{r.rule}</span>
                          <p className="text-[12px]" style={{ color: 'var(--ds-text)' }}>{r.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl p-5" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border-strong)' }}>
                    <h4 className="text-[13px] font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--ds-text-secondary)' }}>Language Rules</h4>
                    <div className="space-y-2.5">
                      {[
                        { do: 'color, organize, canceled', dont: 'colour, organise, cancelled' },
                        { do: "you'll, can't, don't, won't", dont: 'you will, cannot, do not' },
                        { do: 'sign in, menu, checkbox', dont: 'log in, dropdown, check box' },
                        { do: 'allowlist, blocklist', dont: 'whitelist, blacklist' },
                      ].map((r, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-1 mb-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                              <span className="text-[10px] font-semibold" style={{ color: 'var(--ds-success)' }}>DO</span>
                            </div>
                            <p className="text-[12px]" style={{ color: 'var(--ds-text)' }}>{r.do}</p>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-1 mb-0.5">
                              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--ds-error-text)' }} />
                              <span className="text-[10px] font-semibold" style={{ color: 'var(--ds-error-text)' }}>DON&apos;T</span>
                            </div>
                            <p className="text-[12px]" style={{ color: 'var(--ds-text-tertiary)' }}>{r.dont}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Message Types */}
                <div className="rounded-2xl p-5" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border-strong)' }}>
                  <h4 className="text-[13px] font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--ds-text-secondary)' }}>Message Types</h4>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                    {[
                      { type: 'Success', desc: 'Brief, reassuring, celebratory', color: 'var(--ds-success)', bg: 'var(--ds-success-bg)' },
                      { type: 'Error', desc: 'Explain what happened, state next step', color: 'var(--ds-error-text)', bg: 'var(--ds-error-bg)' },
                      { type: 'Warning', desc: 'State consequences clearly', color: 'var(--ds-warning-text)', bg: 'var(--ds-warning-bg)' },
                      { type: 'Info', desc: 'Add context only if it helps action', color: 'var(--ds-accent)', bg: 'var(--ds-accent-bg)' },
                      { type: 'Empty State', desc: 'Motivate action, never blame the user', color: 'var(--ds-text-secondary)', bg: 'var(--ds-overlay-bg)' },
                    ].map(m => (
                      <div key={m.type} className="p-3 rounded-xl text-center" style={{ background: m.bg }}>
                        <p className="text-[12px] font-semibold" style={{ color: m.color }}>{m.type}</p>
                        <p className="text-[10px] mt-1" style={{ color: 'var(--ds-text-secondary)' }}>{m.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Checklist */}
                <div className="rounded-2xl p-5" style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-border-strong)' }}>
                  <h4 className="text-[13px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--ds-text-secondary)' }}>Pre-Ship Copy Checklist</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      'Is this helping the user right now?',
                      'Can this be shorter?',
                      'Is the next action obvious?',
                      'Does this sound calm, confident, and human?',
                    ].map((q, i) => (
                      <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-lg" style={{ background: 'var(--ds-overlay-bg)' }}>
                        <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0" style={{ background: 'var(--ds-success)', opacity: 0.8 }}>
                          <svg className="w-3 h-3" fill="none" stroke="#FFFFFF" viewBox="0 0 24 24" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </div>
                        <p className="text-[12px]" style={{ color: 'var(--ds-text)' }}>{q}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ════════════════════════════════════════
           ASSETS TAB — Icon & Illustration Library
           ════════════════════════════════════════ */}
        {activeLob === 'assets' && <AssetLibrary />}

        {/* ════════════════════════════════════════
           ATOMS TAB — Single source of truth for atomic UI elements
           ════════════════════════════════════════ */}
        {activeLob === 'atoms' && <AtomsShowcase />}

        {/* ════════════════════════════════════════
           BASE TAB — All 17 unique component patterns
           ════════════════════════════════════════ */}
        {activeLob === 'base' && (
          <>
            {/* Communication */}
            <section>
              <SectionHeader title="ChatBubble" description="Bot and user message bubbles — the foundation of conversational UI" />
              <div className="grid grid-cols-1 gap-6">
                <WidgetCard title="Chat Bubbles" widgetType="ChatBubble — DsAvatar + var(--ds-bubble-*) tokens">
                  <ChatBubble />
                </WidgetCard>
              </div>
            </section>

            {/* Selection */}
            <section>
              <SectionHeader title="SelectionCard" description="Unified single-select component — layout adapts via props: grid, list, compact-grid, radio" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title='layout="grid"' widgetType="SelectionCard — grid layout with icons">
                  <SelectionCard layout="grid" options={[
                    { id: 'opt1', label: 'Option A', icon: 'user' },
                    { id: 'opt2', label: 'Option B', icon: 'heart' },
                    { id: 'opt3', label: 'Option C', icon: 'building' },
                    { id: 'opt4', label: 'Option D', icon: 'gift', badge: 'New' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
                <WidgetCard title='layout="list"' widgetType="SelectionCard — stacked list with DsBadge">
                  <SelectionCard layout="list" options={[
                    { id: 'a', label: 'Primary', icon: 'user', description: 'Main option with details' },
                    { id: 'b', label: 'Secondary', icon: 'heart', description: 'Alternative option' },
                    { id: 'c', label: 'Tertiary', description: 'No icon — label only', badge: 'Popular' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
                <WidgetCard title='layout="compact-grid"' widgetType="SelectionCard — label-only compact grid">
                  <SelectionCard layout="compact-grid" columns={3} options={[
                    { id: '1', label: '10%' }, { id: '2', label: '20%' }, { id: '3', label: '30%' },
                    { id: '4', label: '40%' }, { id: '5', label: '50%' }, { id: '6', label: '60%' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
                <WidgetCard title='layout="radio"' widgetType="SelectionCard — binary choice with DsRadio">
                  <SelectionCard layout="radio" options={[
                    { id: 'yes', label: 'Yes, proceed' },
                    { id: 'no', label: 'No, skip' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="GridSelector" description="Multi-select grid with search — uses DsInput for search, DsButton for CTA" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Multi-select with icons" widgetType="GridSelector — multiSelect + DsButton CTA">
                  <GridSelector multiSelect options={[
                    { id: 'a', label: 'Item 1', icon: 'user' }, { id: 'b', label: 'Item 2', icon: 'heart' },
                    { id: 'c', label: 'Item 3', icon: 'building' }, { id: 'd', label: 'Item 4', icon: 'child' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
                <WidgetCard title="Searchable single-select" widgetType="GridSelector — DsInput search + initials fallback">
                  <GridSelector columns={3} searchable options={[
                    { id: 'a', label: 'Alpha' }, { id: 'b', label: 'Bravo' }, { id: 'c', label: 'Charlie' },
                    { id: 'd', label: 'Delta' }, { id: 'e', label: 'Echo' }, { id: 'f', label: 'Foxtrot' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
              </div>
            </section>

            {/* Inputs */}
            <section>
              <SectionHeader title="InputField" description="Text, number, currency, pincode — built on DsInput atom + DsButton CTA" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Input Variants" widgetType="InputField — DsInput + DsButton · text/number/currency/pincode">
                  <div className="space-y-6">
                    <InputField variant="text" placeholder="Enter your full name" buttonLabel="Continue" />
                    <DsDivider />
                    <InputField variant="number" placeholder="Enter your age" helperText="Between 18 and 65 years" buttonLabel="Continue"
                      validate={(v) => { const n = parseInt(v); if (isNaN(n)) return 'Please enter a valid number'; if (n < 18) return 'Minimum age is 18'; if (n > 65) return 'Maximum age is 65'; return null; }} />
                    <DsDivider />
                    <InputField variant="currency" placeholder="Enter annual income" helperText="Minimum ₹3,00,000 per year" buttonLabel="Continue" />
                    <DsDivider />
                    <InputField variant="pincode" placeholder="Enter your pincode" icon="/icons/generic/Location.svg" buttonLabel="Find Hospitals"
                      validate={(v) => !/^\d{6}$/.test(v) ? 'Please enter a valid 6-digit pincode' : null} />
                  </div>
                </WidgetCard>
                <WidgetCard title="Vehicle Registration" widgetType="VehicleRegInput — DsBadge prefix + DsButton">
                  <VehicleRegInput />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="DatePicker" description="DD / MM / YYYY date inputs with auto-focus — uses var(--ds-input-*) tokens + DsButton" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Date Picker" widgetType="DatePicker — DsButton CTA">
                  <DatePicker />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="RangeSlider" description="Interactive range sliders for coverage and term — uses var(--ds-accent) + DsButton CTA" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Range Sliders" widgetType="RangeSlider — DsDivider + DsButton">
                  <RangeSlider />
                </WidgetCard>
              </div>
            </section>

            {/* Display & Summary */}
            <section>
              <SectionHeader title="SummaryCard" description="Key-value display — uses DsIconButton for edit, DsDivider for rows, DsButton for CTA" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Read-only" widgetType="SummaryCard — DsButton CTA">
                  <SummaryCard title="Plan Summary" subtitle="Review before proceeding" ctaLabel="Proceed to Payment" rows={[
                    { label: 'Name', value: 'Rahul Sharma' }, { label: 'Age', value: '32 years' },
                    { label: 'Plan', value: 'ACKO Platinum' }, { label: 'Cover', value: '₹25,00,000' },
                    { label: 'Premium', value: '₹12,999/year' },
                  ]} />
                </WidgetCard>
                <WidgetCard title="Editable" widgetType="SummaryCard — DsIconButton edit per row">
                  <SummaryCard title="Vehicle Summary" editable ctaLabel="View Prices" rows={[
                    { label: 'Make', value: 'Maruti Suzuki' }, { label: 'Model', value: 'Swift' },
                    { label: 'Variant', value: 'VXi' }, { label: 'Fuel', value: 'Petrol' },
                    { label: 'Status', value: 'Active', editable: false },
                  ]} />
                </WidgetCard>
              </div>
            </section>

            {/* Progress */}
            <section>
              <SectionHeader title="StepProgress" description="Sequential step displays — ProgressLoader, CalculationLoader, StepTracker (merged timeline)" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Progress Loader" widgetType="ProgressLoader — var(--ds-progress-*) tokens">
                  <ProgressLoader />
                </WidgetCard>
                <WidgetCard title="Calculation Loader" widgetType="CalculationLoader — SVG + DsBadge step status">
                  <CalculationLoader />
                </WidgetCard>
                <WidgetCard title="Step Tracker" widgetType="StepTracker — DsBadge + DsAvatar + success/pending states">
                  <StepTracker />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="SearchableList" description="Filterable list with DsAvatar icons, DsLink actions, and DsDivider rows" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Searchable List" widgetType="SearchableList — DsAvatar + DsLink">
                  <SearchableList />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="ComparisonCard" description="Gap analysis with status indicators — uses var(--ds-error-*) and var(--ds-success) tokens" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Comparison Card" widgetType="ComparisonCard — DsDivider rows">
                  <ComparisonCard />
                </WidgetCard>
              </div>
            </section>

            {/* Actions */}
            <section>
              <SectionHeader title="ConsentWidget" description="DsCheckbox for consent, DsLink for T&C, DsButton for CTA" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Consent" widgetType="ConsentWidget — DsCheckbox + DsLink + DsButton">
                  <ConsentWidget />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="PaymentGateway" description="Payment method selection — DsRadio for methods, DsAvatar for branding, DsButton for CTA" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Payment Gateway" widgetType="PaymentGateway — DsRadio + DsAvatar + DsButton">
                  <PaymentGateway />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="FileUpload" description="Document upload — idle / extracting / done states with DsAvatar and var(--ds-*) tokens" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="File Upload" widgetType="FileUpload — DsAvatar + DsBadge status">
                  <FileUpload />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="SchedulePicker" description="Multi-section picker — DsButton for slots, DsDivider for sections, DsAvatar for lab icons" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Schedule Picker" widgetType="SchedulePicker — DsButton + DsDivider + DsAvatar">
                  <SchedulePicker />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="VerificationFlow" description="KYC verification — DsButton for actions, DsIconButton for close, DsAvatar for step numbers" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Verification Flow" widgetType="VerificationFlow — DsButton + DsIconButton + DsAvatar">
                  <VerificationFlow />
                </WidgetCard>
              </div>
            </section>

            {/* Completion */}
            <section>
              <SectionHeader title="CelebrationScreen" description="Success screen with confetti — DsButton CTA, DsBadge status, DsDivider rows" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Celebration" widgetType="CelebrationScreen — DsBadge + DsDivider + DsButton">
                  <CelebrationScreen />
                </WidgetCard>
              </div>
            </section>

            <section className="pb-12">
              <SectionHeader title="FeedbackForm" description="5-point emoji scale with optional text feedback — DsButton for submit" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="NPS Feedback" widgetType="FeedbackForm — DsButton submit">
                  <FeedbackForm />
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
                  <SelectionCard layout="grid" options={[
                    { id: 'self', label: 'Just Me', icon: 'user' },
                    { id: 'family', label: 'My Family', icon: 'family' },
                    { id: 'parents', label: 'Parents', icon: 'child' },
                    { id: 'company', label: 'Corporate', icon: 'building', badge: 'New' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
                <WidgetCard title="Policy intent" widgetType='layout="list" — buy/renew/switch'>
                  <SelectionCard layout="list" options={[
                    { id: 'new', label: 'New Policy', description: 'First time buying health insurance' },
                    { id: 'renew', label: 'Renew Policy', description: 'Renew your existing health plan' },
                    { id: 'switch', label: 'Port / Switch', description: 'Move from another insurer', badge: 'Popular' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
                <WidgetCard title="Family members" widgetType="GridSelector — multi-select members">
                  <GridSelector multiSelect options={[
                    { id: 'self', label: 'Self', icon: 'user' }, { id: 'spouse', label: 'Spouse', icon: 'heart' },
                    { id: 'mother', label: 'Mother', icon: 'user' }, { id: 'father', label: 'Father', icon: 'user' },
                    { id: 'son', label: 'Son', icon: 'child' }, { id: 'daughter', label: 'Daughter', icon: 'child' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
                <WidgetCard title="Payment frequency" widgetType='layout="compact-grid" — monthly vs yearly'>
                  <SelectionCard layout="compact-grid" options={[
                    { id: 'monthly', label: 'Monthly', description: '₹1,247/mo' },
                    { id: 'yearly', label: 'Yearly', description: '₹12,999/yr', badge: 'Save 17%' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
                <WidgetCard title="Plan Switcher" widgetType="plan_switcher — tier tabs with feature comparison">
                  <SelectionCard layout="grid" options={[
                    { id: 'platinum', label: 'Platinum', description: '₹12,999/yr' },
                    { id: 'lite', label: 'Lite', description: '₹8,499/yr' },
                    { id: 'topup', label: 'Top-up', description: '₹3,999/yr' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="InputField" description="Health-specific inputs — age, pincode, sum insured" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Age input" widgetType="input — age with 18-65 validation">
                  <InputField variant="number" placeholder="Enter your age" helperText="Between 18 and 65 years" buttonLabel="Continue"
                    validate={(v) => { const n = parseInt(v); if (isNaN(n)) return 'Please enter a valid number'; if (n < 18) return 'Minimum age is 18'; if (n > 65) return 'Maximum age is 65'; return null; }} />
                </WidgetCard>
                <WidgetCard title="Pincode" widgetType="input — 6-digit for hospital network">
                  <InputField variant="pincode" placeholder="Enter your pincode" icon="/icons/generic/Location.svg" buttonLabel="Find Hospitals"
                    validate={(v) => !/^\d{6}$/.test(v) ? 'Please enter a valid 6-digit pincode' : null} />
                </WidgetCard>
                <WidgetCard title="Sum insured" widgetType="input — currency with ₹K/L/Cr format">
                  <InputField variant="currency" placeholder="Enter sum insured" helperText="Minimum ₹5,00,000" buttonLabel="Continue" />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="DatePicker" description="Date of birth collection for health plan eligibility" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="DOB" widgetType="dob_collection — DD/MM/YYYY">
                  <DatePicker />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="SummaryCard" description="Health policy confirmation — extracted details from existing policy" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Confirm details" widgetType="confirm_details — extracted policy data">
                  <SummaryCard title="Policy Details" subtitle="Extracted from policy" rows={[
                    { label: 'Policy Holder', value: 'Rahul Sharma' }, { label: 'Sum Insured', value: '₹5,00,000' },
                    { label: 'Members', value: 'Self (32 yrs), Spouse (30 yrs)' }, { label: 'Renewal Date', value: '15 Aug 2026' },
                  ]} ctaLabel="Confirm" />
                </WidgetCard>
                <WidgetCard title="Review summary" widgetType="review_summary — pre-payment review">
                  <SummaryCard title="Health Plan Summary" subtitle="Review before payment" ctaLabel="Proceed to Payment" rows={[
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
                  <CalculationLoader />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="SearchableList" description="Nearby cashless hospital network with distance" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Hospital list" widgetType="hospital_list — 42 cashless hospitals nearby">
                  <SearchableList />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="ComparisonCard" description="Coverage gap analysis — current plan vs ACKO" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Gap analysis" widgetType="gap_results — 5 gaps found in current plan">
                  <ComparisonCard />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="ConsentWidget" description="Health policy terms acceptance" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Health consent" widgetType="consent — T&C acceptance">
                  <ConsentWidget />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="FileUpload" description="Existing health policy PDF upload with AI extraction" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Policy PDF upload" widgetType="pdf_upload — Care Health Insurance extraction">
                  <FileUpload />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="SchedulePicker" description="Lab test scheduling — pick date, time slot, and lab" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Lab test scheduler" widgetType="lab_schedule_widget — date + time + lab">
                  <SchedulePicker />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="PaymentGateway" description="Health premium payment — family floater plan" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Health payment" widgetType="payment_widget — health premium ₹12,999">
                  <PaymentGateway />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="Celebration" description="Health policy issuance success" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Health celebration" widgetType="celebration — policy active">
                  <CelebrationScreen />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="NpsFeedback" description="Rate your health insurance buying experience" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Health NPS" widgetType="nps_feedback — experience rating">
                  <FeedbackForm />
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
                  <SelectionCard layout="grid" options={[
                    { id: 'car', label: 'Car', icon: 'car' },
                    { id: 'bike', label: 'Bike', icon: 'bike' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
                <WidgetCard title="Fuel type" widgetType='layout="list" — petrol, diesel, CNG, electric'>
                  <SelectionCard layout="list" options={[
                    { id: 'petrol', label: 'Petrol', icon: 'fuel', description: 'Most common fuel type' },
                    { id: 'diesel', label: 'Diesel', icon: 'fuel', description: 'Higher mileage' },
                    { id: 'cng', label: 'CNG', icon: 'fuel', description: 'Bi-fuel CNG + Petrol' },
                    { id: 'electric', label: 'Electric', icon: 'flash', description: 'Battery electric vehicle', badge: 'Green' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
                <WidgetCard title="NCB percentage" widgetType='layout="compact-grid" — no claim bonus selector'>
                  <SelectionCard layout="compact-grid" columns={3} options={[
                    { id: '0', label: '0%' }, { id: '20', label: '20%' }, { id: '25', label: '25%' },
                    { id: '35', label: '35%' }, { id: '45', label: '45%' }, { id: '50', label: '50%' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
                <WidgetCard title="Brand selector" widgetType="GridSelector — searchable car brands">
                  <GridSelector columns={3} searchable options={[
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
                  <VehicleRegInput />
                </WidgetCard>
                <WidgetCard title="Owner name" widgetType="input — policy holder name">
                  <InputField variant="text" placeholder="Enter owner name" buttonLabel="Continue" />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="SummaryCard" description="Motor summary — vehicle details, premium breakdown, editable summary" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Vehicle details" widgetType="vehicle_details_card — fetched vehicle info">
                  <SummaryCard title="Vehicle Found" subtitle="KA 01 AB 1234" rows={[
                    { label: 'Make', value: 'Maruti Suzuki' }, { label: 'Model', value: 'Swift VXi' },
                    { label: 'Year', value: '2022' }, { label: 'Fuel', value: 'Petrol' },
                    { label: 'Current Insurance', value: 'ICICI Lombard' }, { label: 'NCB', value: '50%' },
                  ]} ctaLabel="This is correct" />
                </WidgetCard>
                <WidgetCard title="Premium breakdown" widgetType="premium_breakdown — TP + OD + add-ons - NCB = total">
                  <SummaryCard title="Premium Breakdown" subtitle="Maruti Suzuki Swift · Comprehensive" rows={[
                    { label: 'Third-party (TP)', value: '₹2,094' }, { label: 'Own Damage (OD)', value: '₹4,405' },
                    { label: 'Engine Protection', value: '₹999' }, { label: 'Zero Depreciation', value: '₹1,499' },
                    { label: 'NCB discount (50%)', value: '-₹2,203' }, { label: 'Total (incl. GST)', value: '₹8,017' },
                  ]} ctaLabel="Proceed to Payment" />
                </WidgetCard>
                <WidgetCard title="Editable summary" widgetType="editable_summary — vehicle details with edit">
                  <SummaryCard title="Vehicle Summary" editable ctaLabel="View Prices" rows={[
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
                  <ProgressLoader />
                </WidgetCard>
                <WidgetCard title="Policy tracker" widgetType="policy_tracker — payment → inspection → KYC → issued">
                  <StepTracker />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="VerificationFlow" description="Motor KYC — PAN/Aadhaar verification via HyperVerge" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="KYC verification" widgetType="kyc_verification — 3-step identity flow">
                  <VerificationFlow />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="PaymentGateway" description="Motor premium payment — Maruti Swift comprehensive" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Motor payment" widgetType="payment_gateway — motor premium ₹10,617">
                  <PaymentGateway />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="Celebration" description="Motor policy issuance success" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Motor celebration" widgetType="motor_celebration — policy active">
                  <CelebrationScreen />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="NpsFeedback" description="Rate your motor insurance experience" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Motor NPS" widgetType="nps_feedback — experience rating">
                  <FeedbackForm />
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
                  <SelectionCard layout="radio" options={[
                    { id: 'yes', label: 'Yes, I smoke or chew tobacco' },
                    { id: 'no', label: 'No, I don\'t use tobacco' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
                <WidgetCard title="Payment frequency" widgetType='layout="compact-grid" — monthly vs yearly'>
                  <SelectionCard layout="compact-grid" options={[
                    { id: 'monthly', label: 'Monthly', description: '₹987/mo' },
                    { id: 'yearly', label: 'Yearly', description: '₹9,999/yr', badge: 'Save 15%' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
                <WidgetCard title="Rider selection" widgetType="GridSelector — multi-select riders">
                  <GridSelector multiSelect options={[
                    { id: 'ci', label: 'Critical Illness', icon: 'hospital' },
                    { id: 'ad', label: 'Accidental Death', icon: 'alert' },
                    { id: 'wp', label: 'Waiver of Premium', icon: 'coverage' },
                    { id: 'ti', label: 'Terminal Illness', icon: 'medicine' },
                  ]} onSelect={() => {}} />
                </WidgetCard>
                <WidgetCard title="Income range" widgetType='layout="list" — income bracket selection'>
                  <SelectionCard layout="list" options={[
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
                <WidgetCard title="Annual income" widgetType="input — currency with ₹K/L/Cr format">
                  <InputField variant="currency" placeholder="Enter annual income" helperText="Minimum ₹3,00,000 per year" buttonLabel="Continue" />
                </WidgetCard>
                <WidgetCard title="Nominee name" widgetType="input — nominee full name">
                  <InputField variant="text" placeholder="Enter nominee name" buttonLabel="Continue" />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="DatePicker" description="Date of birth for life insurance premium calculation" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="DOB" widgetType="date_picker — DD/MM/YYYY">
                  <DatePicker />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="RangeSlider" description="Coverage and term sliders — dynamic premium calculation" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Coverage & term sliders" widgetType="coverage_slider + term_selector — ₹25L to ₹10Cr, 10-40 years">
                  <RangeSlider />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="SummaryCard" description="Life coverage breakdown and review summary" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Coverage breakdown" widgetType="coverage_card — recommended ₹1.5 Cr with breakdown">
                  <SummaryCard title="Recommended Cover" subtitle="Based on your profile" rows={[
                    { label: 'Cover Amount', value: '₹1.5 Cr' }, { label: 'Policy Term', value: '30 years' },
                    { label: 'Covers till age', value: '62' },
                  ]} ctaLabel="Continue with this plan" />
                </WidgetCard>
                <WidgetCard title="Review summary" widgetType="review_summary — pre-payment plan review">
                  <SummaryCard title="Life Plan Summary" subtitle="Review your term plan" ctaLabel="Proceed to Payment" rows={[
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
                  <StepTracker />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="ConsentWidget" description="Life insurance terms and conditions acceptance" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Life consent" widgetType="consent — T&C acceptance">
                  <ConsentWidget />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="PaymentGateway" description="Life premium payment — term plan purchase" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Life payment" widgetType="payment_screen — life premium ₹9,999">
                  <PaymentGateway />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="Celebration" description="Life policy issuance success" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Life celebration" widgetType="celebration — policy active">
                  <CelebrationScreen />
                </WidgetCard>
              </div>
            </section>

            <section>
              <SectionHeader title="NpsFeedback" description="Rate your life insurance buying experience" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WidgetCard title="Life NPS" widgetType="nps_feedback — experience rating">
                  <FeedbackForm />
                </WidgetCard>
              </div>
            </section>

          </>
        )}

      </div>
    </div>
  );
}
