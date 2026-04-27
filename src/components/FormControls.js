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
        <label className="block text-sm font-medium text-palette-textSecondary mb-1">
          {label}
        </label>
      )}
      <input
        name={name}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`border border-palette-border px-3 py-2 rounded w-full bg-palette-surface dark:text-palette-textPrimary focus:border-lime-300 focus:outline-none focus:ring-0 ${className}`}
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
        <label className="block text-sm font-medium text-palette-textSecondary mb-1">
          {label}
        </label>
      )}
      <input
        name={name}
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`border border-palette-border px-3 py-2 rounded w-full bg-palette-surface dark:text-palette-textPrimary focus:border-lime-300 focus:outline-none focus:ring-0 ${className}`}
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
  loading = false,
}) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-palette-textSecondary mb-1">
          {label}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`border border-palette-border px-3 py-2 rounded w-full bg-palette-surface dark:text-palette-textPrimary focus:border-lime-300 focus:outline-none focus:ring-0 ${className}`}
        disabled={loading}
      >
        {loading ? (
          <option value="">Loading...</option>
        ) : (
          options?.map((opt, i) => (
            <option key={i} value={typeof opt === 'string' ? opt : opt?.value}>
              {typeof opt === 'string' ? opt : opt?.label}
            </option>
          ))
        )}
      </select>
    </div>
  )
}

const FormControls = {
  TextInput,
  NumberInput,
  DropdownSelect,
}

export default FormControls