import { useState, useEffect } from 'react'
import ConfigModal from '../generic/ConfigModal'
import { fetch_config_specs } from '../../../services/api_services'

function UploadConfigModal({ is_open, on_close, on_confirm_upload }) {
  const [specs, set_specs] = useState(null)
  const [selected_files, set_selected_files] = useState({})
  const [preview_item, set_preview_item] = useState(null)
  const [is_loading, set_is_loading] = useState(false)
  const [error_msg, set_error_msg] = useState(null)

  // Chargement des spécifications dès que la modale s'ouvre
  useEffect(() => {
    if (!is_open) return

    let is_mounted = true
    set_is_loading(true)
    set_error_msg(null)

    fetch_config_specs()
      .then((data) => {
        if (!is_mounted) return
        set_specs(data)

        // Coche tous les fichiers par défaut
        const default_selection = Object.keys(data).reduce((acc, key) => {
          acc[key] = true
          return acc
        }, {})
        set_selected_files(default_selection)
        set_is_loading(false)
      })
      .catch((err) => {
        if (!is_mounted) return
        set_error_msg(err.message)
        set_is_loading(false)
      })

    return () => {
      is_mounted = false
    }
  }, [is_open])

  const handle_toggle = (key) => {
    set_selected_files((prev) => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const has_selection = Object.values(selected_files).some(Boolean)

  const handle_confirm = () => {
    if (!has_selection) return
    on_confirm_upload(selected_files)
    on_close()
  }

  return (
    <>
      {/* 1. Modale principale : Choix des fichiers à importer */}
      <ConfigModal
        is_open={is_open}
        on_close={on_close}
        modal_title="Charger une configuration"
      >
        <div className="modal_settings_content">
          {is_loading && (
            <div className="card_content_placeholder">
              <span>Chargement des spécifications...</span>
            </div>
          )}

          {error_msg && (
            <div className="card_content_placeholder" style={{ color: '#ef4444' }}>
              <span>Erreur : {error_msg}</span>
            </div>
          )}

          {!is_loading && !error_msg && specs && (
            <>
              <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#64748b' }}>
                Sélectionnez les fichiers de configuration à importer :
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Object.entries(specs).map(([key, item]) => (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    {/* Case à cocher et label */}
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        color: '#1e293b',
                        flex: 1
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(selected_files[key])}
                        onChange={() => handle_toggle(key)}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      <span>
                        <strong>{item.label}</strong>{' '}
                        <span style={{ color: '#64748b', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                          ({item.filename})
                        </span>
                      </span>
                    </label>

                    {/* Bouton pour afficher la description et la structure */}
                    <button
                      type="button"
                      title="Voir la structure attendue"
                      onClick={() => set_preview_item(item)}
                      style={{
                        background: '#e2e8f0',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        color: '#475569',
                        fontSize: '0.8rem'
                      }}
                    >
                      ℹ
                    </button>
                  </div>
                ))}
              </div>

              <hr className="modal_divider" />

              <div className="modal_footer_actions">
                <button
                  type="button"
                  className={`action_btn global_validate_btn ${has_selection ? 'active' : 'disabled'}`}
                  onClick={handle_confirm}
                  disabled={!has_selection}
                >
                  Confirmer l'import
                </button>
                <button
                  type="button"
                  className="action_btn global_cancel_btn active"
                  onClick={on_close}
                >
                  Annuler
                </button>
              </div>
            </>
          )}
        </div>
      </ConfigModal>

      {/* 2. Modale de détail : Description et structure JSON attendue */}
      <ConfigModal
        is_open={Boolean(preview_item)}
        on_close={() => set_preview_item(null)}
        modal_title={`Format attendu : ${preview_item?.filename || ''}`}
      >
        {preview_item && (
          <div className="modal_settings_content">
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#334155', lineHeight: 1.5 }}>
              {preview_item.description}
            </p>

            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1e293b' }}>
              Exemple de structure attendue :
            </span>

            <pre
              style={{
                backgroundColor: '#0f172a',
                color: '#f8fafc',
                padding: '14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontFamily: 'monospace',
                overflowX: 'auto',
                margin: 0
              }}
            >
              {JSON.stringify(preview_item.example_structure, null, 2)}
            </pre>

            <div className="modal_footer_actions">
              <button
                type="button"
                className="action_btn cancel_btn"
                onClick={() => set_preview_item(null)}
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </ConfigModal>
    </>
  )
}

export default UploadConfigModal
