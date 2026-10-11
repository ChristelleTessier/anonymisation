import { useState, useEffect } from 'react'
import { fetch_scan_settings, save_scan_settings} from '../../services/api_services'
import ConfigModal from './ConfigModal'
import EditableTagList from './EditableTagList'
import ModalActionFooter from '../common/ModalActionFooter'

const SCAN_SECTIONS = [
  { key_name: 'target_extensions', label: 'Extensions cibles' },
  { key_name: 'ignored_extensions', label: 'Extensions ignorées' },
  { key_name: 'ignored_directories', label: 'Dossiers ignorés' }
]

function format_raw_settings(data) {
  if (!data) return null
  const formatted = {}
  SCAN_SECTIONS.forEach(({ key_name }) => {
    formatted[key_name] = (data[key_name] || []).map((val) => ({
      value: val,
      status: 'normal'
    }))
  })
  return formatted
}

function ScanSettingsPanel() {
  const [initial_settings, set_initial_settings] = useState(null)
  const [current_settings, set_current_settings] = useState(null)
  const [is_loading, set_is_loading] = useState(true)
  const [error_msg, set_error_msg] = useState(null)
  const [is_modal_open, set_is_modal_open] = useState(false)

  useEffect(() => {
    let is_mounted = true

    fetch_scan_settings()
      .then((data) => {
        if (is_mounted) {
          const formatted = format_raw_settings(data)
          set_initial_settings(formatted)
          set_current_settings(formatted)
          set_is_loading(false)
        }
      })
      .catch((err) => {
        if (is_mounted) {
          set_error_msg(err.message)
          set_is_loading(false)
        }
      })

    return () => {
      is_mounted = false
    }
  }, [])

  // Détecte s'il y a au moins un élément 'added' ou 'marked_deleted'
  const has_changes = Boolean(
    current_settings &&
      SCAN_SECTIONS.some(({ key_name }) =>
        (current_settings[key_name] || []).some(
          (item) => item.status === 'added' || item.status === 'marked_deleted'
        )
      )
  )

  const handle_update_section = (key_name, new_items) => {
    set_current_settings((prev) => ({
      ...prev,
      [key_name]: new_items
    }))
  }

  // Validation finale : supprime les éléments marrons et repasse les verts à 'normal'
  const handle_confirm_all = async () => {
    if (!current_settings) return

    // 1. Filtrer et nettoyer les données locales
    const final_settings = {}
    SCAN_SECTIONS.forEach(({ key_name }) => {
      const list = current_settings[key_name] || []
      final_settings[key_name] = list
        .filter((item) => {
          const status = typeof item === 'object' ? item.status : 'normal'
          return status !== 'marked_deleted'
        })
        .map((item) => ({
          value: typeof item === 'object' ? item.value : item,
          status: 'normal'
        }))
    })

    // 2. Préparer le payload avec de simples listes de chaînes
    const payload_for_api = {}
    SCAN_SECTIONS.forEach(({ key_name }) => {
      payload_for_api[key_name] = final_settings[key_name].map((i) => i.value)
    })

    try {
      // 3. Appel de l'API pour écrire dans scan_settings.json
      await save_scan_settings(payload_for_api)

      // 4. Mise à jour de l'état local une fois l'écriture réussie
      set_current_settings({ ...final_settings })
      set_initial_settings({ ...final_settings })
      set_is_modal_open(false)
    } catch (err) {
      alert(`Erreur de sauvegarde : ${err.message}`)
    }
  }

  // Annulation finale : restaure les paramètres initiaux
  const handle_cancel_all = () => {
    set_current_settings(initial_settings)
    set_is_modal_open(false)
  }

  const target_extensions = current_settings?.target_extensions || []
  const ignored_directories = current_settings?.ignored_directories || []

  return (
    <>
      {/* Carte cliquable */}
      <div
        className="config_card clickable_card"
        onClick={() => set_is_modal_open(true)}
      >
        <h3 className="card_title">Paramètres de scan</h3>
        <p className="card_description">scan_settings.json</p>

        {is_loading && (
          <div className="card_content_placeholder">
            <span>Chargement...</span>
          </div>
        )}

        {error_msg && (
          <div className="card_content_placeholder" style={{ color: '#ef4444' }}>
            <span>Erreur</span>
          </div>
        )}

        {!is_loading && !error_msg && (
          <div className="card_summary_view">
            <span className="summary_badge">
              {target_extensions.filter((i) => i.status !== 'marked_deleted').length} extensions cibles
            </span>
            <span className="summary_badge">
              {ignored_directories.filter((i) => i.status !== 'marked_deleted').length} dossiers ignorés
            </span>
            <span className="click_hint">Cliquez pour voir les détails →</span>
          </div>
        )}
      </div>

      {/* Fenêtre modale */}
      <ConfigModal
        is_open={is_modal_open}
        on_close={() => set_is_modal_open(false)}
        modal_title="Paramètres de scan détaillés"
      >
        <div className="modal_settings_content">
          {SCAN_SECTIONS.map(({ key_name, label }) => (
            <EditableTagList
              key={key_name}
              label={label}
              items={current_settings?.[key_name] || []}
              on_update_items={(new_items) =>
                handle_update_section(key_name, new_items)
              }
            />
          ))}

          <ModalActionFooter
            has_changes={has_changes}
            on_confirm={handle_confirm_all}
            on_cancel={handle_cancel_all}
          />


        </div>
      </ConfigModal>
    </>
  )
}

export default ScanSettingsPanel
