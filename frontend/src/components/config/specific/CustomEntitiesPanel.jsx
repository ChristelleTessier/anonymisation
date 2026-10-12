import { useState, useEffect } from 'react'
import { fetch_custom_entities, save_custom_entities } from '../../../services/api_settings_services'
import ListActionFenetreSetting from '../../actions/ListActionFenetreSetting'
import ConfigModal from '../generic/ConfigModal'
import EditableTagList from '../generic/EditableTagList'


function format_raw_entities(data) {
  if (!data) return []
  const raw_list = Array.isArray(data) ? data : data.entities || []
  return raw_list.map((item) => ({
    value: typeof item === 'object' ? item.value : item,
    status: 'normal'
  }))
}

function CustomEntitiesPanel() {
  const [initial_entities, set_initial_entities] = useState([])
  const [current_entities, set_current_entities] = useState([])
  const [is_loading, set_is_loading] = useState(true)
  const [error_msg, set_error_msg] = useState(null)
  const [is_modal_open, set_is_modal_open] = useState(false)

  useEffect(() => {
    let is_mounted = true

    fetch_custom_entities()
      .then((data) => {
        if (is_mounted) {
          const formatted = format_raw_entities(data)
          set_initial_entities(formatted)
          set_current_entities(formatted)
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

  const has_changes = current_entities.some(
    (item) => item.status === 'added' || item.status === 'marked_deleted'
  )

  const handle_update_items = (new_items) => {
    set_current_entities(new_items)
  }

  // Enregistrement effectif dans custom_entities.json
  const handle_confirm_all = async () => {
    const final_list = current_entities
      .filter((item) => item.status !== 'marked_deleted')
      .map((item) => ({
        value: item.value,
        status: 'normal'
      }))

    const payload_for_api = final_list.map((item) => item.value)

    try {
      await save_custom_entities(payload_for_api)
      set_current_entities([...final_list])
      set_initial_entities([...final_list])
      set_is_modal_open(false)
    } catch (err) {
      alert(`Erreur lors de la sauvegarde : ${err.message}`)
    }
  }

  const handle_cancel_all = () => {
    set_current_entities(initial_entities)
    set_is_modal_open(false)
  }

  const active_count = current_entities.filter(
    (item) => item.status !== 'marked_deleted'
  ).length

  return (
    <>
      <div
        className="config_card clickable_card"
        onClick={() => set_is_modal_open(true)}
      >
        <h3 className="card_title">Paramètres personnalisés</h3>
        <p className="card_description">custom_entities.json</p>

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
              {active_count} paramètre(s) configuré(s)
            </span>
            <span className="click_hint">Cliquez pour voir les détails →</span>
          </div>
        )}
      </div>

      <ConfigModal
        is_open={is_modal_open}
        on_close={() => set_is_modal_open(false)}
        modal_title="Paramètres personnalisés"
      >
        <div className="modal_settings_content">
          <EditableTagList
            label="Liste des paramètres"
            items={current_entities}
            on_update_items={handle_update_items}
          />

          <ListActionFenetreSetting
            has_changes={has_changes}
            on_confirm={handle_confirm_all}
            on_cancel={handle_cancel_all}
          />


        </div>
      </ConfigModal>
    </>
  )
}

export default CustomEntitiesPanel
