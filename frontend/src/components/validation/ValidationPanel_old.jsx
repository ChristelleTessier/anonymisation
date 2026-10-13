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
  if (plan.length === 0) return <div>Aucun fichier à valider.</div>

  const current = plan[current_index]

  return (
    <div className="validation_panel">
      {/* Barre de progression */}
      <div className="validation_progress">
        <span>Fichier {current_index + 1} / {plan.length}</span>
        <div className="progress_bar">
          <div
            className="progress_fill"
            style={{ width: `${((current_index + 1) / plan.length) * 100}%` }}
          />
        </div>
      </div>

      {/* En-tête fichier */}
      <div className="validation_file_header">
        <h4>{current.chemin_fichier}</h4>
        <div className="file_decision_buttons">
          <button
            className={current.decision_fichier === 'o' ? 'active' : ''}
            onClick={() => update_fichier_decision(current_index, 'o')}
          >✅ Anonymiser</button>
          <button
            className={current.decision_fichier === 'n' ? 'active' : ''}
            onClick={() => update_fichier_decision(current_index, 'n')}
          >⏭️ Passer</button>
        </div>
      </div>

      {/* Table des modifs */}
      {current.decision_fichier === 'o' && current.modif_interne?.length > 0 && (
        <table className="validation_table">
          <thead>
            <tr>
              <th>Catégorie</th>
              <th>Original</th>
              <th>Proposition</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {current.modif_interne.map((modif, i) => (
              <ModifRow
                key={i}
                modif={modif}
                onDecisionChange={(d) => update_modif_decision(current_index, i, d)}
                onCustomValueChange={(v) => update_modif_custom_value(current_index, i, v)}
              />
            ))}
          </tbody>
        </table>
      )}

      {/* Navigation */}
      <div className="validation_nav">
        <button disabled={current_index === 0} onClick={go_prev}>
          ← Précédent
        </button>
        {current_index < plan.length - 1 ? (
          <button onClick={go_next}>Suivant →</button>
        ) : (
          <button className="btn_submit" onClick={submit}>
            ✅ Valider tout le plan
          </button>
        )}
      </div>
    </div>
  )
}

export default ValidationPanel