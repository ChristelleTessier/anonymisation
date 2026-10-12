import RegexRulesPanel from './config/specific/RegexRulesPanel'
import ScanSettingsPanel from './config/specific/ScanSettingsPanel'
import CustomEntitiesPanel from './config/specific/CustomEntitiesPanel'
import DownloadButton from './common/DownloadButton'
import { download_config_archive } from '../services/api_services'

function ConfigSetting({ variable_list, set_variable_list }) {
  const handle_upload_click = () => {
    // Action à gérer plus tard
    console.log('Clic sur Charger ma configuration')
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
          onClick={handle_upload_click}
        >
          Charger ma configuration
        </button>
        {/* Vous pourrez ajouter ici d'autres boutons au fur et à mesure */}
      </div>
    </section>
  )
}

export default ConfigSetting
