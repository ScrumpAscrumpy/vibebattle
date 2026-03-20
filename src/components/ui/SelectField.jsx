import { Field } from "./Field";

export function SelectField({ label, value, onChange, options, error }) {
  return (
    <Field label={label} error={error}>
      <select className="input" value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}
