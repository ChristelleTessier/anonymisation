import { useState } from 'react'
import { start_anonymization } from '../services/api_scan'

export function useAnonymization() {
  const [folder_path, set_folder_path] = useState('')
  const [is_processing, set_is_processing] = useState(false)

  const handle_anonymize_click = async () => {
    if (!folder_path) return false
    set_is_processing(true)
    try {
      await start_anonymization(folder_path)
      return true  // ← signale le succès
    } catch (error) {
      alert('Erreur : ' + error.message)
      return false
    } finally {
      set_is_processing(false)
    }
  }

  return { folder_path, set_folder_path, is_processing, handle_anonymize_click }
}