export function Field({ label, error, children, hint, caption }) {
  return (
    <label className="form-field">
      <span className="form-field__label">{label}</span>
      {caption ? <span className="panel__caption">{caption}</span> : null}
      {children}
      {hint ? <span className="form-field__hint">{hint}</span> : null}
      {error ? <span className="form-field__error">{error}</span> : null}
    </label>
  );
}
