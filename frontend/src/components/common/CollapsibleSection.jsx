function CollapsibleSection({ title, isOpen, onToggle, children }) {
  return (
    <section className="collapsible_section card_section">
      <h2
        className="collapsible_title"
        onClick={onToggle}
      >
        <span className="collapsible_arrow">{isOpen ? '▼' : '▶'}</span>
        {title}
      </h2>
      {isOpen && <div className="collapsible_body">{children}</div>}
    </section>
  )
}

export default CollapsibleSection