import { useState } from 'react'
import { download_results } from '../services/api_validation'
import ModeToggle from './choix_fichier/ModeToggle'
import DossierInput from './choix_fichier/DossierInput'
import ContentInput from './choix_fichier/ContentInput'
import ContentResult from './choix_fichier/ContentResult'

function Anonymisation({
  folder_path,
  set_folder_path,
  on_anonymize,
  is_processing,
  is_anonymized,
  mode,
  set_mode,
  content,
  set_content,
  anonymized_result,
}) {
  const [downloading, set_downloading] = useState(false)

  const handle_download = async () => {
    set_downloading(true)
    try {
      await download_results()
    } catch (e) {
      alert(`Erreur : ${e.message}`)
    } finally {
      set_downloading(false)
    }
  }

  const can_anonymize = mode === 'dossier'
    ? folder_path.trim().length > 0
    : content.trim().length > 0

  return (
    <div>
      <ModeToggle mode={mode} set_mode={set_mode} />

      {mode === 'dossier' && (
        <DossierInput folder_path={folder_path} set_folder_path={set_folder_path} />
      )}

      {mode === 'contenu' && (
        <ContentInput
          content={content}
          set_content={set_content}
        />
      )}

      <div className="button_group">
        <button
          className="anonymize_button"
          onClick={on_anonymize}
          disabled={!can_anonymize || is_processing}
        >
          {is_processing ? 'Anonymisation...' : 'Anonymiser'}
        </button>

        {mode === 'dossier' && (
          <button
            className="anonymize_button download_button"
            onClick={handle_download}
            disabled={!is_anonymized || downloading}
          >
            {downloading ? 'Téléchargement...' : 'Charger'}
          </button>
        )}
      </div>

      <ContentResult anonymized_result={anonymized_result} />
    </div>
  )
}

export default Anonymisation