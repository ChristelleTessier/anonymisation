import { useState } from 'react'
import { download_results } from '../services/api_validation'

function FolderChoice({ folder_path, set_folder_path, on_anonymize, is_processing, is_anonymized }) {
  const [is_dragging, set_is_dragging] = useState(false)
  const [downloading, set_downloading] = useState(false)

  const handle_drop = (e) => {
    e.preventDefault()
    set_is_dragging(false)

    const items = e.dataTransfer.items
    if (items && items.length > 0) {
      const entry = items[0].webkitGetAsEntry?.()
      if (entry && entry.isDirectory) {
        set_folder_path(entry.fullPath || entry.name)
        return
      }
    }

    const files = e.dataTransfer.files
    if (files.length > 0) {
      set_folder_path(files[0].path || files[0].name)
    }
  }

  const handle_drag_over = (e) => {
    e.preventDefault()
    set_is_dragging(true)
  }

  const handle_drag_leave = () => {
    set_is_dragging(false)
  }

  const handle_download = async () => {  // ← NOUVEAU
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

      <div
        className={`drop_box ${is_dragging ? 'dragging' : ''}`}
        onDrop={handle_drop}
        onDragOver={handle_drag_over}
        onDragLeave={handle_drag_leave}
      >
        <p className="drop_label">Glissez-déposez votre dossier ici</p>
        <span className="drop_separator">— ou collez le chemin d'accès —</span>
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
