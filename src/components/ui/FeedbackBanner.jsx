export function FeedbackBanner({ type = "info", children }) {
  return <div className={`feedback-banner feedback-banner--${type}`}>{children}</div>;
}
