import { download_validated_plan } from '../../services/api_validation' //../../styles/api_validation'

function ContentResult({ anonymized_result, title = "✅ Texte anonymisé" }) {
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
        <button
          className="btn_download_txt"
          onClick={() => {
            const blob = new Blob([anonymized_result.text], { type: 'text/plain' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = anonymized_result.filename || 'contenu.txt'
            a.click()
            URL.revokeObjectURL(url)
          }}
        >
          ⬇️ Télécharger (.txt)
        </button>
        <button
          className="btn_download_txt"
          onClick={() => download_validated_plan().catch(err => alert(`Erreur téléchargement plan : ${err.message}`))}
        >
          📄 Télécharger le plan validé (.json)
        </button>
      </div>
    </div>
  )
}

export default ContentResult