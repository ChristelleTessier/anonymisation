import ModifRow from './ModifRow'

function ValidationPanel({
  plan,
  current_index,
  loading,
  error,
  update_fichier_decision,
  update_modif_decision,
  update_modif_custom_value,
  go_next,
  go_prev,
  submit,
}) {
  if (loading) return <div className="validation_loading">Chargement du plan…</div>
  if (error) return <div className="validation_error">❌ {error}</div>
  if (plan.length === 0) return <div className="validation_empty">Aucun fichier à valider.</div>

  const current = plan[current_index]
  //const fileName = (current.chemin_fichier || '').split(/[\\/]/).pop()
  const nbAnonymiser = plan.filter((f) => f.decision_fichier === 'o').length
  const nbPasser = plan.length - nbAnonymiser

  return (
    <div className="validation_panel">
      {/* En-tête */}
      <div className="validation_header">
        <div>
          <h3 className="validation_title">Validation du plan d'anonymisation</h3>
          <p className="validation_subtitle">Vérifiez chaque détection avant application</p>
        </div>
        <div className="validation_stats">
          <span className="stat_chip stat_ok">{nbAnonymiser} à anonymiser</span>
          <span className="stat_chip stat_skip">{nbPasser} ignoré(s)</span>
        </div>
      </div>

      {/* Fil des fichiers */}
      <div className="validation_filestrip">
        {plan.map((f, i) => {
          const name = (f.chemin_fichier || '').split(/[\\/]/).pop()
          const classes = ['filestrip_item']
          if (i === current_index) classes.push('current')
          else if (f.decision_fichier === 'o') classes.push('ok')
          else if (f.decision_fichier === 'n') classes.push('skipped')
          return (
            <button
              key={i}
              className={classes.join(' ')}
              onClick={() => {
                if (i < current_index) { for (let k = 0; k < current_index - i; k++) go_prev() }
                else if (i > current_index) { for (let k = 0; k < i - current_index; k++) go_next() }
              }}
              title={f.chemin_fichier}
            >
              {f.decision_fichier === 'o' && '✓ '}
              {f.decision_fichier === 'n' && '⤫ '}
              {name}
            </button>
          )
        })}
      </div>

      {/* Progression */}
      <div className="validation_progress">
        <div className="validation_progress_labels">
          <span>Fichier {current_index + 1} / {plan.length}</span>
          <span>{current.modif_interne?.length || 0} détection(s)</span>
        </div>
        <div className="progress_bar">
          <div
            className="progress_fill"
            style={{ width: `${((current_index + 1) / plan.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Fichier courant */}
      <div className="validation_file_header">
        <code className="validation_filepath" title={current.chemin_fichier}>
          📄 {current.chemin_fichier}
        </code>
        <div className="file_decision_buttons">
          <button
            className={`btn_file ${current.decision_fichier === 'o' ? 'active_ok' : ''}`}
            onClick={() => update_fichier_decision(current_index, 'o')}
          >✓ Anonymiser</button>
          <button
            className={`btn_file ${current.decision_fichier === 'n' ? 'active_skip' : ''}`}
            onClick={() => update_fichier_decision(current_index, 'n')}
          >⤫ Passer</button>
        </div>
      </div>

      {/* Modifs */}
      {current.decision_fichier === 'o' && current.modif_interne?.length > 0 ? (
        <div className="validation_list">
          <div className="validation_list_head">
            <span>Catégorie</span>
            <span>Original</span>
            <span>Proposition</span>
            <span className="ta_right">Action</span>
          </div>
          {current.modif_interne.map((modif, i) => (
            <ModifRow
              key={i}
              modif={modif}
              onDecisionChange={(d) => update_modif_decision(current_index, i, d)}
              onCustomValueChange={(v) => update_modif_custom_value(current_index, i, v)}
            />
          ))}
        </div>
      ) : (
        <div className="validation_empty">
          {current.decision_fichier === 'n'
            ? 'Ce fichier sera ignoré lors de l\u2019anonymisation.'
            : 'Aucune détection dans ce fichier.'}
        </div>
      )}

      {/* Navigation */}
      <div className="validation_nav">
        <button className="btn_nav" disabled={current_index === 0} onClick={go_prev}>
          ← Précédent
        </button>
        {current_index < plan.length - 1 ? (
          <button className="btn_nav btn_next" onClick={go_next}>Suivant →</button>
        ) : (
          <button className="btn_nav btn_submit" onClick={submit}>
            ✓ Valider tout le plan
          </button>
        )}
      </div>
    </div>
  )
}

export default ValidationPanel