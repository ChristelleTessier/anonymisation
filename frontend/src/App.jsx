import { useState } from 'react'
import ConfigPanelsGrid from './components/ConfigPanelsGrid'
import FolderDropZone from './components/FolderDropZone'
import './App.css'

function App() {
  const [folder_path, set_folder_path] = useState('')
  const [variable_list, set_variable_list] = useState([])
  const [is_processing, set_is_processing] = useState(false)

  const handle_anonymize = () => {
    if (!folder_path.trim()) return

    set_is_processing(true)
    setTimeout(() => {
      set_is_processing(false)
      alert(`Anonymisation lancée pour : ${folder_path}`)
    }, 1000)
  }

  return (
    <div className="page_layout">
      <main className="content_box">
        <h1 className="main_title">Anonymisation de dossier</h1>

        {/* 1. Grille de configuration */}
        <ConfigPanelsGrid
          variable_list={variable_list}
          set_variable_list={set_variable_list}
        />

        <hr className="section_divider" />

        {/* 2. Dépôt du dossier et action */}
        <FolderDropZone
          folder_path={folder_path}
          set_folder_path={set_folder_path}
          on_anonymize={handle_anonymize}
          is_processing={is_processing}
        />
      </main>
    </div>
  )
}

export default App
