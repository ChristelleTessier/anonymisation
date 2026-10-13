function ModifRow({ modif, onDecisionChange, onCustomValueChange }) {
  return (
    <tr className={`modif_row modif_${modif.decision}`}>
      <td>{modif.category}</td>
      <td className="modif_original">{modif.original}</td>
      <td>
        {modif.decision === 'e' ? (
          <input
            className="modif_custom_input"
            value={modif.custom_value || ''}
            onChange={(e) => onCustomValueChange(e.target.value)}
            placeholder="Valeur de remplacement…"
            autoFocus
          />
        ) : (
          <span className="modif_proposition">{modif.proposition}</span>
        )}
      </td>
      <td className="modif_actions">
        <button
          className={modif.decision === 'v' ? 'active v' : ''}
          onClick={() => onDecisionChange('v')}
        >V</button>
        <button
          className={modif.decision === 'e' ? 'active e' : ''}
          onClick={() => onDecisionChange('e')}
        >E</button>
        <button
          className={modif.decision === 'i' ? 'active i' : ''}
          onClick={() => onDecisionChange('i')}
        >I</button>
      </td>
    </tr>
  )
}

export default ModifRow