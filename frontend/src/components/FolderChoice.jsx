import { useState } from 'react'
import { download_results } from '../services/api_validation'

function FolderChoice({ folder_path, set_folder_path, on_anonymize, is_processing, is_anonymized }) {
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

  return (
    <section className="folder_section card_section">
      <h2 className="folder_section_title">Anonymisation du dossier</h2>

      <div className="folder_input_group">
        <label className="folder_input_label">Chemin du dossier à anonymiser :</label>
        <input
          type="text"
          className="folder_input"
          placeholder="Ex. : C:\Users\Documents\MonDossier"
          value={folder_path}
          onChange={(e) => set_folder_path(e.target.value)}
        />
      </div>

      <div className="button_group">
        <button
          className="anonymize_button"
          onClick={on_anonymize}
          disabled={!folder_path.trim() || is_processing}
        >
          {is_processing ? 'Anonymisation...' : 'Anonymiser'}
        </button>

        <button
          className="anonymize_button download_button"
          onClick={handle_download}
          disabled={!is_anonymized || downloading}
        >
          {downloading ? 'Téléchargement...' : 'Charger'}
        </button>
      </div>
    </section>
  )
}

export default FolderChoice
