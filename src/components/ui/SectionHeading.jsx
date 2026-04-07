export default function SectionHeading({ eyebrow, title, body, align = 'left' }) {
  return (
    <div className={`section-heading ${align === 'center' ? 'is-centered' : ''}`}>
      {eyebrow ? <span>{eyebrow}</span> : null}
      <h2>{title}</h2>
      {body ? <p>{body}</p> : null}
    </div>
  );
}
