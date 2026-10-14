import { useState } from 'react'
import ConfigSetting from './components/ConfigSetting'
import FolderChoice from './components/FolderChoice'
import ValidationModal from './components/validation/ValidationModal'
import { useAnonymization } from './hooks/useAnonymization'
import { useValidation } from './hooks/useValidation'
import './App.css'

function App() {
  const [variable_list, set_variable_list] = useState([])

  const { folder_path, set_folder_path, is_processing, handle_anonymize_click } =
    useAnonymization()

  const validation = useValidation(folder_path)

  const handle_anonymize = async () => {
    const success = await handle_anonymize_click()
    if (success) {
      validation.open_validation()
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
        />
      </main>

      <ValidationModal validation={validation} />
    </div>
  )
}

export default App