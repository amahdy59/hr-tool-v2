import React from 'react';
import { ltrContentProps } from './ltrContent';

const inputClass = 'w-full h-[44px] px-3 border border-border rounded-[var(--radius-input)] bg-input-background text-foreground text-[var(--text-base)] text-start focus:ring-2 focus:ring-ring/50 focus:border-ring outline-none transition-shadow';
const labelClass = 'block text-start w-full text-[var(--text-base)] font-[var(--font-weight-medium)] text-foreground';
const LTR_INPUT_TYPES = new Set(['email', 'url', 'tel', 'password']);

export const FormField: React.FC<{
  id?: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  maxLength?: number;
  forceLtr?: boolean;
}> = ({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled,
  autoComplete,
  inputMode,
  maxLength,
  forceLtr,
}) => {
  const generatedId = id || `form-field-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const shouldForceLtr = forceLtr ?? LTR_INPUT_TYPES.has(type);
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
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        className={inputClass}
        style={{ fontFamily: "'Inter', sans-serif" }}
        {...(shouldForceLtr ? ltrContentProps : {})}
      />
    </div>
  );
};
