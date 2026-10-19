// import { download_validated_plan } from '../../services/api_validation'

// function ContentResult({ anonymized_result, title = "✅ Texte anonymisé" }) {
//   if (!anonymized_result) return null

//   return (
//     <div className="content_result">
//       <h3 className="content_result_title">{title}</h3>
//       <textarea
//         className="content_result_textarea"
//         readOnly
//         value={anonymized_result.text}
//         rows={10}
//       />
//       <div className="content_result_actions">
//         <button
//           className="btn_copy"
//           onClick={() => navigator.clipboard.writeText(anonymized_result.text)}
//         >
//           📋 Copier
//         </button>

//         <button
//           className="btn_download_txt"
//           onClick={() => download_validated_plan().catch(err => alert(`Erreur téléchargement plan : ${err.message}`))}
//         >
//           📄 Télécharger le plan validé (.json)
//         </button>
//       </div>
//     </div>
//   )
// }

// export default ContentResult


import { download_validated_plan } from '../../services/api_validation'

function ContentResult({
  anonymized_result,
  title = "✅ Texte anonymisé",
  show_plan_download = true,  // NEW: contrôle l'affichage du bouton "Télécharger le plan validé"
}) {
  if (!anonymized_result) return null

  return (
    <div className="content_result">
      <h3 className="content_result_title">{title}</h3>
      <textarea
        className="content_result_textarea"
        readOnly
        value={anonymized_result.text}
        rows={10}
      />
      <div className="content_result_actions">
        <button
          className="btn_copy"
          onClick={() => navigator.clipboard.writeText(anonymized_result.text)}
        >
          📋 Copier
        </button>

        {/* Affiché uniquement si show_plan_download est true */}
        {show_plan_download && (
          <button
            className="btn_download_txt"
            onClick={() => download_validated_plan().catch(err => alert(`Erreur téléchargement plan : ${err.message}`))}
          >
            📄 Télécharger le plan validé (.json)
          </button>
        )}
      </div>
    </div>
  )
}

export default ContentResult