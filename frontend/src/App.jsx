import { useState, useCallback } from 'react'
import ConfigSetting from './components/ConfigSetting'
import FolderChoice from './components/FolderChoice'
import ValidationModal from './components/validation/ValidationModal'
import { useAnonymization } from './hooks/useAnonymization'
import { useValidation } from './hooks/useValidation'
import { scan_content } from './services/api_validation'
import './App.css'

function App() {
  const [variable_list, set_variable_list] = useState([])
  const [is_anonymized, set_is_anonymized] = useState(false)
  const [mode, set_mode] = useState('dossier')  // 'dossier' | 'contenu'
  const [content, setContent] = useState('')
  const [filename, setFilename] = useState('')

  const { folder_path, set_folder_path, is_processing, handle_anonymize_click } =
    useAnonymization()

  const handle_success = useCallback(() => set_is_anonymized(true), [])

  const validation = useValidation(folder_path, handle_success, mode, content, filename)


  const handle_anonymize = async () => {
    if (mode === 'contenu') {
      // Mode contenu : scan du texte collé
      const success = await scan_content(content, filename)
      if (success) {
        set_is_anonymized(false)
        validation.open_validation()
      }
    } else {
      // Mode dossier : scan du dossier
      const success = await handle_anonymize_click()
      if (success) {
        set_is_anonymized(false)
        validation.open_validation()
      }
    }
  }

  return (
    <div className="page_layout">
      <main className="content_box">
        <h1 className="main_title">Anonymisation de dossier</h1>

        <ConfigSetting
          variable_list={variable_list}
          set_variable_list={set_variable_list}
        />

        <hr className="section_divider" />

        <FolderChoice
          folder_path={folder_path}
          set_folder_path={set_folder_path}
          on_anonymize={handle_anonymize}
          is_processing={is_processing}
          is_anonymized={is_anonymized}
          mode={mode}
          set_mode={set_mode}
          content={content}
          set_content={setContent}
          filename={filename}
          set_filename={setFilename}
          anonymized_result={validation.anonymized_result}

        />
      </main>

      <ValidationModal validation={validation} />
    </div>
  )
}

export default App