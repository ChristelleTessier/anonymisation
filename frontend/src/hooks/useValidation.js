import { useState, useCallback } from 'react'
import { fetch_validation_plan, submit_validated_plan } from '../services/api_validation'

export function useValidation(folderPath, onSuccess) {
  const [is_open, set_is_open] = useState(false)
  const [plan, set_plan] = useState([])
  const [current_index, set_current_index] = useState(0)
  const [loading, set_loading] = useState(false)
  const [error, set_error] = useState(null)

  // Ouvre la validation (à appeler après le succès de start_anonymization)
  const open_validation = useCallback(async () => {
    set_is_open(true)
    set_loading(true)
    set_error(null)
    try {
      const data = await fetch_validation_plan()
      // On initialise les décisions par défaut
      const initialized = data.plan.map((f) => ({
        ...f,
        decision_fichier: 'o',
        modif_interne: (f.modif_interne || []).map((m) => ({
          ...m,
          decision: 'v',
          custom_value: null,
        })),
      }))
      set_plan(initialized)
      set_current_index(0)
    } catch (e) {
      set_error(e.message)
    } finally {
      set_loading(false)
    }
  }, [folderPath])

  const close_validation = useCallback(() => {
    set_is_open(false)
    set_plan([])
  }, [])

  // Met à jour la décision à l'échelle du fichier (o / n)
  const update_fichier_decision = useCallback((index, decision) => {
    set_plan((prev) =>
      prev.map((f, i) => (i === index ? { ...f, decision_fichier: decision } : f))
    )
  }, [])

  // Met à jour la décision d'une modif interne (v / e / i)
  const update_modif_decision = useCallback((fileIdx, modifIdx, decision) => {
    set_plan((prev) =>
      prev.map((f, i) =>
        i === fileIdx
          ? {
              ...f,
              modif_interne: f.modif_interne.map((m, j) =>
                j === modifIdx ? { ...m, decision } : m
              ),
            }
          : f
      )
    )
  }, [])

  // Met à jour la valeur custom (quand decision === "e")
  const update_modif_custom_value = useCallback((fileIdx, modifIdx, value) => {
    set_plan((prev) =>
      prev.map((f, i) =>
        i === fileIdx
          ? {
              ...f,
              modif_interne: f.modif_interne.map((m, j) =>
                j === modifIdx ? { ...m, custom_value: value } : m
              ),
            }
          : f
      )
    )
  }, [])

  // Navigation
  const go_next = useCallback(() => set_current_index((i) => Math.min(i + 1, plan.length - 1)), [plan.length])
  const go_prev = useCallback(() => set_current_index((i) => Math.max(i - 1, 0)), [])

  // Soumission finale
  const submit = useCallback(async () => {
    try {
      const result = await submit_validated_plan(folderPath, plan)
      close_validation()
      if (onSuccess) onSuccess()
      return result
    } catch (e) {
      set_error(e.message)
      return null
    }
  }, [folderPath, plan, close_validation, onSuccess])

  return {
    is_open,
    plan,
    current_index,
    loading,
    error,
    open_validation,
    close_validation,
    update_fichier_decision,
    update_modif_decision,
    update_modif_custom_value,
    go_next,
    go_prev,
    submit,
  }
}