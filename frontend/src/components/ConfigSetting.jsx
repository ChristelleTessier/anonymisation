import { useState } from 'react'
import RegexRulesPanel from './config/specific/RegexRulesPanel'
import ScanSettingsPanel from './config/specific/ScanSettingsPanel'
import CustomEntitiesPanel from './config/specific/CustomEntitiesPanel'
import DownloadButton from './common/DownloadButton'
import UploadConfigModal from './config/generic/UploadConfigModal'
import { download_config_archive } from '../services/api_settings_services'

function ConfigSetting({ variable_list, set_variable_list }) {
  const [is_upload_modal_open, set_is_upload_modal_open] = useState(false)

  const handle_confirm_upload = (selected_files) => {
    console.log('Fichiers sélectionnés pour le chargement :', selected_files)
    // Ici, vous pourrez déclencher la logique de chargement / import
  }

  return (
    <section className="config_section card_section">
      <h2 className="section_title">Paramètres de configuration</h2>

      <div className="config_panels_grid">
        {/* Élément 1 */}
        <RegexRulesPanel />

        {/* Élément 2 */}
        <ScanSettingsPanel />

        {/* Élément 3 */}
        <CustomEntitiesPanel
          variable_list={variable_list}
          set_variable_list={set_variable_list}
        />
      </div>

      {/* Barre d'actions / téléchargements sous les panneaux */}
      <div className="config_actions_bar">
        <DownloadButton
          download_fn={download_config_archive}
          label="Télécharger les configurations (.zip)"
        />

        <button
          type="button"
          className="upload_action_btn"
          onClick={() => set_is_upload_modal_open(true)}
        >
          Charger ma configuration
        </button>
      </div>

      {/* Fenêtre modale de chargement */}
      <UploadConfigModal
        is_open={is_upload_modal_open}
        on_close={() => set_is_upload_modal_open(false)}
        on_confirm_upload={handle_confirm_upload}
      />
    </section>
  )
}

export default ConfigSetting
