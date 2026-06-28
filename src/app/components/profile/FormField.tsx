import React from 'react';

const inputClass = 'w-full h-[44px] px-3 border border-border rounded-[var(--radius-input)] bg-input-background text-foreground text-[var(--text-base)] text-start focus:ring-2 focus:ring-ring/50 focus:border-ring outline-none transition-shadow';
const labelClass = 'block text-start w-full text-[var(--text-base)] font-[var(--font-weight-medium)] text-foreground';

export const FormField: React.FC<{
  id?: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}> = ({ id, label, value, onChange, type = 'text', placeholder, disabled }) => {
  const generatedId = id || `form-field-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return (
    <div className="space-y-1 w-full text-start">
      <label htmlFor={generatedId} className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>
        {label}
      </label>
      <input
        id={generatedId}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClass}
        style={{ fontFamily: "'Inter', sans-serif" }}
      />
    </div>
  );
};
