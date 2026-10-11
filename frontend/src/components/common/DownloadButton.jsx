import { useState } from 'react'

function DownloadButton({
  download_fn,
  label = 'Télécharger',
  loading_label = 'Téléchargement...',
  className = '',
  disabled = false
}) {
  const [is_downloading, set_is_downloading] = useState(false)

  const handle_click = async () => {
    if (is_downloading || disabled) return

    set_is_downloading(true)
    try {
      await download_fn()
    } catch (err) {
      alert(`Erreur de téléchargement : ${err.message}`)
    } finally {
      set_is_downloading(false)
    }
  }

  return (
    <button
      type="button"
      className={`download_action_btn ${className} ${is_downloading ? 'loading' : ''}`}
      onClick={handle_click}
      disabled={disabled || is_downloading}
    >
      {is_downloading ? (
        <>
          <span className="download_spinner" />
          <span>{loading_label}</span>
        </>
      ) : (
        label
      )}
    </button>
  )
}

export default DownloadButton
