import { useState } from 'react'
import ConfigSetting from './components/ConfigSetting'
import FolderChoice from './components/FolderChoice'
import ConfigModal from './components/config/generic/ConfigModal'
import ValidationPanel from './components/validation/ValidationPanel'
import { useAnonymization } from './hooks/useAnonymization'
import { useValidation } from './hooks/useValidation'
import './App.css'

function App() {
  const [variable_list, set_variable_list] = useState([])

  // Hook anonymisation (lancement)
  const { folder_path, set_folder_path, is_processing, handle_anonymize_click } =
    useAnonymization()

  // Hook validation (après l'analyse)
  const validation = useValidation(folder_path)

  // On wrap l'handler pour ouvrir la validation en cas de succès
  const handle_anonymize = async () => {
    const success = await handle_anonymize_click()
    if (success) {
      validation.open_validation()  // ← ouvre le modal avec le plan
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

      {/* Modal de validation */}
      <ConfigModal
        is_open={validation.is_open}
        on_close={validation.close_validation}
        modal_title="Validation du plan d'anonymisation"
      >
        <ValidationPanel
          plan={validation.plan}
          current_index={validation.current_index}
          loading={validation.loading}
          error={validation.error}
          update_fichier_decision={validation.update_fichier_decision}
          update_modif_decision={validation.update_modif_decision}
          update_modif_custom_value={validation.update_modif_custom_value}
          go_next={validation.go_next}
          go_prev={validation.go_prev}
          submit={validation.submit}
        />
      </ConfigModal>
    </div>
  )
}

export default App