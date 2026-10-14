import { useState } from 'react'
import { download_results } from '../services/api_validation'
import ModeToggle from './choix_fichier/ModeToggle'
import DossierInput from './choix_fichier/DossierInput'
import ContentInput from './choix_fichier/ContentInput'
import ContentResult from './choix_fichier/ContentResult'

function Desanonymization({
  folder_path,
  set_folder_path,
  on_desanonymize,
  is_processing,
  is_desanonymized,
  mode,
  set_mode,
  content,
  set_content,
  desanonymized_result,
  plan_path,
  set_plan_path,
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

  const can_desanonymize = mode === 'dossier'
    ? folder_path.trim().length > 0 && plan_path.trim().length > 0
    : content.trim().length > 0

  return (
    <div>
      <ModeToggle mode={mode} set_mode={set_mode} />

      {mode === 'dossier' && (
        <DossierInput 
            folder_path={folder_path} 
            set_folder_path={set_folder_path}
            action="désanonymiser"
            plan_path={plan_path}
            set_plan_path={set_plan_path}
        />
      )}

      {mode === 'contenu' && (
        <ContentInput
          content={content}
          set_content={set_content}
          action="désanonymiser"
        />
      )}

      <div className="button_group">
        <button
          className="anonymize_button"
          onClick={on_desanonymize}
          disabled={!can_desanonymize || is_processing}
        >
          {is_processing ? 'Désanonymisation...' : 'Désanonymiser'}
        </button>

        {/* Visible dans les 2 modes */}
        <button
          className="anonymize_button download_button"
          onClick={handle_download}
          disabled={!is_desanonymized || downloading}
        >
          {downloading ? 'Téléchargement...' : 'Charger'}
        </button>
      </div>

      <ContentResult
        anonymized_result={desanonymized_result}
        title="✅ Texte désanonymisé"
      />
    </div>
  )
}

export default Desanonymization