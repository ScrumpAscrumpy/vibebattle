import { Field } from "./Field";

export function TextAreaField({ label, value, onChange, error, rows = 5, placeholder }) {
  return (
    <Field label={label} error={error}>
      <textarea
        className="input input--textarea"
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </Field>
  );
}
