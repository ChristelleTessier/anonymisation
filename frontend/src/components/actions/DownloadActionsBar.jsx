import DownloadButton from '../common/DownloadButton'
import { download_config_archive } from '../../services/api_settings_services'

function DownloadActionsBar() {
  return (
    <div className="download_actions_bar">
      {/* 1. Téléchargement des configurations JSON */}
      <DownloadButton
        download_fn={download_config_archive}
        label="Télécharger les configurations (.zip)"
      />

      {/* 2. Exemple pour vos futurs téléchargements : */}
      {/*
      <DownloadButton
        download_fn={download_scan_report}
        label="Télécharger le rapport de scan (.pdf)"
      />
      <DownloadButton
        download_fn={download_logs}
        label="Télécharger les logs (.txt)"
      />
      */}
    </div>
  )
}

export default DownloadActionsBar
