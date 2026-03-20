export function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="section-header">
      <div className="section-header__content">
        {eyebrow ? <span className="section-header__eyebrow">{eyebrow}</span> : null}
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {action ? <div className="section-header__action">{action}</div> : null}
    </div>
  );
}
