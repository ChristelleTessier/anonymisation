import { useState } from 'react'
import RegexRulesPanel from './config/specific/RegexRulesPanel'
import ScanSettingsPanel from './config/specific/ScanSettingsPanel'
import CustomEntitiesPanel from './config/specific/CustomEntitiesPanel'
import DownloadButton from './common/DownloadButton'
import UploadConfigModal from './config/generic/UploadConfigModal'
import { download_config_archive } from '../services/api_settings_services'

function ConfigSetting({
  variable_list,  // Tableau des entités custom définies par l'utilisateur (passées à CustomEntitiesPanel)
  set_variable_list // Fonction pour modifier la liste des entités custom (passée à CustomEntitiesPanel)
}) {

  const [is_upload_modal_open, set_is_upload_modal_open] = useState(false)
  // Booléen : true quand la modale "Charger ma configuration" est ouverte

  // Gère la confirmation du chargement : appelé par UploadConfigModal quand l'utilisateur valide ses fichiers
  const handle_confirm_upload = (selected_files) => {
    console.log('Fichiers sélectionnés pour le chargement :', selected_files)
  }

  return (
    <section className="config_section card_section">
      <h2 className="section_title">Paramètres de configuration</h2>

      {/* Grille des 3 panneaux de configuration */}
      <div className="config_panels_grid">
        {/* Panneau 1 : règles regex (paramétrage des patterns de détection) */}
        <RegexRulesPanel />

        {/* Panneau 2 : paramètres du scan (options de balayage) */}
        <ScanSettingsPanel />

        {/* Panneau 3 : entités custom (liste des variables à anonymiser, gérée par le parent) */}
        <CustomEntitiesPanel
          variable_list={variable_list}
          set_variable_list={set_variable_list}
        />
      </div>

      {/* Barre d'actions : téléchargement et chargement des configurations */}
      <div className="config_actions_bar">
        {/* Bouton de téléchargement de l'archive .zip des configurations actuelles */}
        <DownloadButton
          download_fn={download_config_archive}
          label="Télécharger les configurations (.zip)"
        />

        {/* Bouton d'ouverture de la modale de chargement de configuration */}
        <button
          type="button"
          className="upload_action_btn"
          onClick={() => set_is_upload_modal_open(true)}
        >
          Charger ma configuration
        </button>
      </div>

      {/* Modale de chargement : permet à l'utilisateur de sélectionner des fichiers de config à importer */}
      <UploadConfigModal
        is_open={is_upload_modal_open}
        on_close={() => set_is_upload_modal_open(false)}
        on_confirm_upload={handle_confirm_upload}
      />
    </section>
  )
}

export default ConfigSetting
