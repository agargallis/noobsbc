export default function LegalPage({ title, lead, sections }) {
  return (
    <section className="legal-page">
      <div className="legal-page-inner">
        <span className="pill">Νομικά</span>
        <h1>{title}</h1>
        <p className="legal-lead">{lead}</p>
        <div className="legal-sections">
          {sections.map((section) => (
            <article key={section.heading} className="legal-card">
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
