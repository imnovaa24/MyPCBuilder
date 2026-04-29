function PageHero({ eyebrow, title, description, actions }) {
  return (
    <section className="page-hero">
      {eyebrow ? <p className="page-hero__eyebrow">{eyebrow}</p> : null}
      <h1>{title}</h1>
      <p className="page-hero__description">{description}</p>
      {actions ? <div className="page-hero__actions">{actions}</div> : null}
    </section>
  );
}

export default PageHero;
