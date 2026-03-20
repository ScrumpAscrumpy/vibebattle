import { Field } from "./Field";

export function TextAreaField({ label, value, onChange, error, rows = 5, placeholder, hint, caption }) {
  return (
    <Field label={label} error={error} hint={hint} caption={caption}>
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
