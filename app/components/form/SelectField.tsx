// components/form/SelectField.tsx
interface SelectOption {
    id: number | string;
    name: string;
    region?: string;
  }
  
  interface SelectFieldProps {
    label: string;
    name?: string;
    value: number | string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: SelectOption[];
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
  }
  
  export function SelectField({
    label,
    name,
    value,
    onChange,
    options,
    required = false,
    disabled = false,
    placeholder = 'Sélectionnez une option'
  }: SelectFieldProps) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300">
          {label}
          <select
            name={name}
            value={value}
            onChange={onChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-300"
            required={required}
            disabled={disabled}
          >
            <option value="">{placeholder}</option>
            {options.map(option => (
              <option key={option.id} value={option.id}>
                {option.region ? `${option.name} (${option.region})` : option.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  }