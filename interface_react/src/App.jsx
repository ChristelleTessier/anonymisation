import { useState } from 'react'
import './App.css'

function App() {
  const [folder_path, set_folder_path] = useState('')
  const [is_dragging, set_is_dragging] = useState(false)
  const [is_processing, set_is_processing] = useState(false)

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

  const handle_input_change = (e) => {
    set_folder_path(e.target.value)
  }

  const handle_anonymize = () => {
    if (!folder_path.trim()) return

    set_is_processing(true)

    // TODO: connecter la logique d'anonymisation ici
    console.log('Dossier :', folder_path)

    setTimeout(() => {
      set_is_processing(false)
      alert(`Traitement lancé pour : ${folder_path}`)
    }, 1000)
  }

  return (
    <div className="page_layout">
      <main className="content_box">
        <h1 className="main_title">Anonymisation de dossier</h1>

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
            onChange={handle_input_change}
          />
        </div>

        <button
          className="anonymize_button"
          onClick={handle_anonymize}
          disabled={!folder_path.trim() || is_processing}
        >
          {is_processing ? 'Anonymisation...' : 'Anonymiser'}
        </button>
      </main>
    </div>
  )
}

export default App
