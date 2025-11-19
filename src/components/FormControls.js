import React from 'react'

export const TextInput = ({
  label,
  value,
  onChange,
  placeholder = '',
  className = '',
  name,
}) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        name={name}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`border px-3 py-2 rounded w-full ${className}`}
      />
    </div>
  )
}

export const NumberInput = ({
  label,
  value,
  onChange,
  placeholder = '',
  className = '',
  name,
}) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        name={name}
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`border px-3 py-2 rounded w-full ${className}`}
      />
    </div>
  )
}

export const DropdownSelect = ({
  label,
  value,
  onChange,
  options = [],
  className = '',
  name,
}) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`border px-3 py-2 rounded w-full ${className}`}
      >
        {options.map((opt, i) => (
          <option key={i} value={typeof opt === 'string' ? opt : opt.value}>
            {typeof opt === 'string' ? opt : opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default { TextInput, NumberInput, DropdownSelect }
