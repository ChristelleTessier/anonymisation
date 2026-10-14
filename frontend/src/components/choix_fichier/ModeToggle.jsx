function ModeToggle({ mode, set_mode }) {
  return (
    <div className="mode_toggle">
      <button
        className={`toggle_btn ${mode === 'dossier' ? 'active' : ''}`}
        onClick={() => set_mode('dossier')}
      >
        📁 Dossier
      </button>
      <button
        className={`toggle_btn ${mode === 'contenu' ? 'active' : ''}`}
        onClick={() => set_mode('contenu')}
      >
        📝 Contenu
      </button>
    </div>
  )
}

export default ModeToggle