import { useState, useEffect } from 'react';
import './HoursEditor.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TIMEZONES = [
  { label: '(UTC-08:00) Pacific Time', value: 'America/Los_Angeles' },
  { label: '(UTC-07:00) Mountain Time', value: 'America/Denver' },
  { label: '(UTC-06:00) Central Time', value: 'America/Chicago' },
  { label: '(UTC-05:00) Eastern Time', value: 'America/New_York' },
];

const DEFAULT_OPEN = '09:00';
const DEFAULT_CLOSE = '17:30';

const formatTime = (t) => {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
};

const hoursToState = (hoursValue) => {
  const defaults = DAYS.map((day) => ({
    day,
    enabled: day !== 'Saturday' && day !== 'Sunday',
    open: DEFAULT_OPEN,
    close: DEFAULT_CLOSE,
  }));

  if (!hoursValue) return defaults;

  let parsed = hoursValue;
  if (typeof parsed === 'string') {
    try { parsed = JSON.parse(parsed); } catch { return defaults; }
  }

  return DAYS.map((day) => {
    // exact key match first
    if (parsed[day]) {
      const val = parsed[day];
      if (val === 'Closed') return { day, enabled: false, open: DEFAULT_OPEN, close: DEFAULT_CLOSE };
      // try "HH:MM - HH:MM" format
      const match = val.match(/(\d+:\d+)\s*-\s*(\d+:\d+)/);
      if (match) return { day, enabled: true, open: match[1], close: match[2] };
      return { day, enabled: true, open: DEFAULT_OPEN, close: DEFAULT_CLOSE };
    }
    // no match → use defaults
    const isWeekend = day === 'Saturday' || day === 'Sunday';
    return { day, enabled: !isWeekend, open: DEFAULT_OPEN, close: DEFAULT_CLOSE };
  });
};

const stateToHours = (dayStates) => {
  const obj = {};
  dayStates.forEach(({ day, enabled, open, close }) => {
    obj[day] = enabled ? `${open} - ${close}` : 'Closed';
  });
  return JSON.stringify(obj);
};

const HoursEditor = ({ value, onChange }) => {
  const [timezone, setTimezone] = useState(TIMEZONES[3].value);
  const [days, setDays] = useState(() => hoursToState(value));

  useEffect(() => {
    onChange(stateToHours(days));
  }, [days]);

  const toggle = (index) => {
    setDays((prev) =>
      prev.map((d, i) => (i === index ? { ...d, enabled: !d.enabled } : d))
    );
  };

  const setTime = (index, field, val) => {
    setDays((prev) =>
      prev.map((d, i) => (i === index ? { ...d, [field]: val } : d))
    );
  };

  return (
    <div className="hours-editor">
      <div className="hours-timezone-row">
        <div className="hours-timezone-label">
          <span className="hours-tz-title">Timezone</span>
          <span className="hours-tz-sub">Set your timezone</span>
        </div>
        <select
          className="hours-tz-select"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
        >
          {TIMEZONES.map((tz) => (
            <option key={tz.value} value={tz.value}>{tz.label}</option>
          ))}
        </select>
      </div>

      <div className="hours-divider" />

      {days.map((d, i) => (
        <div key={d.day} className="hours-day-row">
          <button
            type="button"
            className={`hours-toggle ${d.enabled ? 'hours-toggle--on' : ''}`}
            onClick={() => toggle(i)}
            aria-label={`Toggle ${d.day}`}
          >
            <span className="hours-toggle-thumb" />
          </button>

          <span className="hours-day-name">{d.day}</span>

          {d.enabled ? (
            <div className="hours-time-fields">
              <div className="hours-time-box">
                <span className="hours-time-label">From</span>
                <input
                  type="time"
                  className="hours-time-input"
                  value={d.open}
                  onChange={(e) => setTime(i, 'open', e.target.value)}
                />
                <span className="hours-time-display">{formatTime(d.open)}</span>
              </div>
              <div className="hours-time-box">
                <span className="hours-time-label">To</span>
                <input
                  type="time"
                  className="hours-time-input"
                  value={d.close}
                  onChange={(e) => setTime(i, 'close', e.target.value)}
                />
                <span className="hours-time-display">{formatTime(d.close)}</span>
              </div>
            </div>
          ) : (
            <div className="hours-closed">
              <span className="hours-closed-icon">☽</span>
              <span>Closed</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default HoursEditor;
