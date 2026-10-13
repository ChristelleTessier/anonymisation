const CATEGORY_CLASSES = {
  SECRET: 'cat_secret',
  DB_CONNECTION: 'cat_db',
  URL_API: 'cat_api',
  URL_INSEE: 'cat_insee',
  EMAIL: 'cat_email',
  IP: 'cat_ip',
  NOM: 'cat_nom',
  TEL: 'cat_tel',
}

function ModifRow({ modif, onDecisionChange, onCustomValueChange }) {
  const catClass = CATEGORY_CLASSES[modif.category] || 'cat_default'
  const ignored = modif.decision === 'i'

  return (
    <div className={`modif_row ${ignored ? 'modif_ignored' : ''}`}>
      <div className="modif_category">
        <span className={`modif_badge ${catClass}`}>
          <span className="badge_dot" />
          {modif.category}
        </span>
      </div>

      <div className="modif_original" title={modif.original}>
        <span className="field_label">Original</span>
        <code className="value_original">{modif.original}</code>
      </div>

      <div className="modif_proposition_cell">
        {modif.decision === 'e' ? (
          <>
            <span className="field_label">Valeur de remplacement</span>
            <input
              className="modif_custom_input"
              value={modif.custom_value || ''}
              onChange={(e) => onCustomValueChange(e.target.value)}
              placeholder="Saisir la valeur…"
              autoFocus
            />
          </>
        ) : (
          <>
            <span className="field_label">Proposition</span>
            <code className={`value_proposition ${ignored ? 'value_cancelled' : ''}`}>
              {modif.proposition}
            </code>
          </>
        )}
      </div>

      <div className="modif_actions">
        <button
          className={`btn_action ${modif.decision === 'v' ? 'on_v' : ''}`}
          title="Accepter la proposition"
          onClick={() => onDecisionChange('v')}
        >✓ <span className="btn_action_label">Valider</span></button>
        <button
          className={`btn_action ${modif.decision === 'e' ? 'on_e' : ''}`}
          title="Saisir une valeur personnalisée"
          onClick={() => onDecisionChange('e')}
        >✎ <span className="btn_action_label">Éditer</span></button>
        <button
          className={`btn_action ${modif.decision === 'i' ? 'on_i' : ''}`}
          title="Ne rien faire"
          onClick={() => onDecisionChange('i')}
        >⤫ <span className="btn_action_label">Ignorer</span></button>
      </div>
    </div>
  )
}

export default ModifRow