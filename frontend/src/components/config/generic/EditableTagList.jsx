import { useState } from 'react'
import ListActionToolbar from '../../actions/ListActionToolbar'

function EditableTagList({ label, items = [], on_update_items }) {
  // Mode actif : null | 'adding' | 'deleting'
  const [active_mode, set_active_mode] = useState(null)
  const [new_item_value, set_new_item_value] = useState('')
  const [selected_indices, set_selected_indices] = useState(new Set())

  // --- Gestion du mode Ajout ---
  const handle_start_add = () => {
    set_active_mode('adding')
    set_new_item_value('')
    set_selected_indices(new Set())
  }

  const handle_confirm_add = () => {
    const trimmed_value = new_item_value.trim()
    const already_exists = items.some((item) => item.value === trimmed_value)

    if (trimmed_value && !already_exists) {
      // Ajout avec statut 'added' (vert)
      on_update_items([...items, { value: trimmed_value, status: 'added' }])
    }
    set_new_item_value('')
    set_active_mode(null)
  }

  const handle_cancel_add = () => {
    set_new_item_value('')
    set_active_mode(null)
  }

  // --- Gestion du mode Suppression ---
  const handle_start_delete = () => {
    set_active_mode('deleting')
    set_selected_indices(new Set())
  }

  const handle_toggle_select = (index) => {
    if (active_mode !== 'deleting') return

    const updated_set = new Set(selected_indices)
    if (updated_set.has(index)) {
      updated_set.delete(index)
    } else {
      updated_set.add(index)
    }
    set_selected_indices(updated_set)
  }

  const handle_confirm_delete = () => {
    // Les éléments cochés passent au statut 'marked_deleted' (marron)
    const updated_items = items.map((item, idx) => {
      if (selected_indices.has(idx)) {
        return { ...item, status: 'marked_deleted' }
      }
      return item
    })

    on_update_items(updated_items)
    set_selected_indices(new Set())
    set_active_mode(null)
  }

  const handle_cancel_delete = () => {
    set_selected_indices(new Set())
    set_active_mode(null)
  }

  return (
    <div className="settings_group">
      {/* En-tête : Titre + Boutons */}
      <div className="settings_group_header">
        <span className="group_label">
          {label} ({items.filter((item) => item.status !== 'marked_deleted').length}) :
        </span>

        {active_mode === null && (
          <ListActionToolbar
            on_start_add={handle_start_add}
            on_start_delete={handle_start_delete}
            can_delete={items.length > 0}
          />
        )}
      </div>

      {/* Saisie d'ajout */}
      {active_mode === 'adding' && (
        <div className="inline_add_container">
          <input
            type="text"
            className="inline_input"
            placeholder="Ex : .log ou dossier"
            value={new_item_value}
            onChange={(e) => set_new_item_value(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handle_confirm_add()
              if (e.key === 'Escape') handle_cancel_add()
            }}
            autoFocus
          />
          <div className="inline_btn_row">
            <button
              type="button"
              className="action_btn validate_btn"
              onClick={handle_confirm_add}
              disabled={!new_item_value.trim()}
            >
              Valider
            </button>
            <button
              type="button"
              className="action_btn cancel_btn"
              onClick={handle_cancel_add}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Liste des tags */}
      <div className="tags_list">
        {items.map((item, idx) => {
          const is_in_selection = selected_indices.has(idx)
          const is_deleting = active_mode === 'deleting'

          // Calcul des classes d'état
          let status_class = ''
          if (item.status === 'added') {
            status_class = 'tag_pending_add' // Fond vert
          } else if (item.status === 'marked_deleted' || is_in_selection) {
            status_class = 'tag_pending_delete' // Fond marron
          }

          return (
            <span
              key={idx}
              className={`setting_tag ${is_deleting ? 'selectable_tag' : ''} ${status_class}`}
              onClick={() => handle_toggle_select(idx)}
            >
              {item.value}
            </span>
          )
        })}
      </div>

      {/* Barre de confirmation de suppression locale */}
      {active_mode === 'deleting' && (
        <div className="inline_delete_actions">
          <button
            type="button"
            className="action_btn validate_btn"
            onClick={handle_confirm_delete}
            disabled={selected_indices.size === 0}
          >
            Valider ({selected_indices.size} sélectionné{selected_indices.size > 1 ? 's' : ''})
          </button>
          <button
            type="button"
            className="action_btn cancel_btn"
            onClick={handle_cancel_delete}
          >
            Annuler
          </button>
        </div>
      )}
    </div>
  )
}

export default EditableTagList
