// components/form/InputField.tsx
import React from 'react';

interface InputFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  min?: string | number;
  max?: string | number;
  placeholder?: string;
}

export function InputField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required = false,
  min,
  max,
  placeholder
}: InputFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300">
        {label}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-300"
          required={required}
          min={min}
          max={max}
          placeholder={placeholder}
        />
      </label>
    </div>
  );
}