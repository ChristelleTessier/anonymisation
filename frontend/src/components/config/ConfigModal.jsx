import { useEffect } from 'react'

function ConfigModal({ is_open, on_close, modal_title, children }) {
  useEffect(() => {
    const handle_keydown = (event) => {
      if (event.key === 'Escape') {
        on_close()
      }
    }

    if (is_open) {
      window.addEventListener('keydown', handle_keydown)
    }

    return () => {
      window.removeEventListener('keydown', handle_keydown)
    }
  }, [is_open, on_close])

  if (!is_open) return null

  return (
    <div className="modal_overlay" onClick={on_close}>
      <div className="modal_container" onClick={(e) => e.stopPropagation()}>
        <header className="modal_header">
          <h3 className="modal_title">{modal_title}</h3>
          <button type="button" className="modal_close_btn" onClick={on_close}>
            ×
          </button>
        </header>

        <div className="modal_body">{children}</div>
      </div>
    </div>
  )
}

export default ConfigModal
