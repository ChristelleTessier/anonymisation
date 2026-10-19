import { useState, useCallback } from 'react'
import {
  fetch_validation_plan,   // Récupère le plan d'anonymisation généré par le backend (après scan)
  submit_validated_plan,   // Envoie le plan validé (mode dossier) au backend pour appliquer les changements
  submit_content,          // Envoie le plan validé + le contenu (mode contenu) au backend pour appliquer les changements
} from '../services/api_validation'


export function useValidation(
  folderPath,   // Chemin du dossier (mode dossier) — utilisé pour l'appel API de soumission
  onSuccess,    // Callback appelé après soumission réussie (met is_anonymized à true dans App.jsx)
  mode = 'dossier',  // Mode courant : 'dossier' ou 'contenu' (détermine quel API submit appeler)
  content = ''        // Texte saisi (mode contenu) — envoyé avec le plan à la soumission
) {
  const [is_open, set_is_open] = useState(false) // Booléen : true quand la ValidationModal est affichée à l'écran
  const [plan, set_plan] = useState([]) // Tableau des fichiers et modifications détectées par le scan
  // Chaque élément : { filename, decision_fichier: 'o'|'n', modif_interne: [{ decision: 'v'|'e'|'i', custom_value, ... }] }
  const [current_index, set_current_index] = useState(0)  // Index du fichier couramment affiché dans la modal (pour la navigation fichier par fichier)
  const [loading, set_loading] = useState(false)  // Booléen : true pendant le chargement du plan (fetch_validation_plan)
  const [error, set_error] = useState(null)  // Chaîne (ou null) : message d'erreur à afficher dans la modal
  const [anonymized_result, set_anonymized_result] = useState(null)  // Objet (ou null) : { text, filename } — résultat final après soumission, affiché dans ContentResult [5]

  // Ouvre la modal de validation et charge le plan depuis le backend
  // À appeler après le succès de l'anonymisation (depuis handle_anonymize dans App.jsx)
  const open_validation = useCallback(async () => {
    set_is_open(true)
    set_loading(true)
    set_error(null)
    set_anonymized_result(null)
    try {
      const data = await fetch_validation_plan()
      // Initialise les décisions par défaut pour chaque fichier et chaque modification
      //   decision_fichier: 'o'  → le fichier est validé (on conserve les changements)
      //   decision: 'v'          → la modification est validée (on garde la valeur anonymisée)
      //   custom_value: null     → pas de valeur custom (l'utilisateur peut en définir une si decision = 'e')
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


  // Ferme la modal et réinitialise l'état
  const close_validation = useCallback(() => {
    set_is_open(false)
    set_plan([])
    set_anonymized_result(null)
  }, [])


  // Met à jour la décision à l'échelle du fichier
  // decision: 'o' = on valide le fichier (on garde toutes ses modifications)
  //           'n' = on refuse le fichier (on annule toutes ses modifications)
  const update_fichier_decision = useCallback((index, decision) => {
    set_plan((prev) =>
      prev.map((f, i) => (i === index ? { ...f, decision_fichier: decision } : f))
    )
  }, [])


  // Met à jour la décision d'une modification interne
  // decision: 'v' = on valide la modification (on garde la valeur anonymisée proposée)
  //           'e' = on remplace par une valeur custom (l'utilisateur saisit sa propre valeur)
  //           'i' = on ignore la modification (on conserve la valeur d'origine)
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


  // Met à jour la valeur custom d'une modification (utilisée quand decision = 'e')
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


  // Navigation : passe au fichier suivant (sans dépasser la fin du tableau)
  const go_next = useCallback(
    () => set_current_index((i) => Math.min(i + 1, plan.length - 1)),
    [plan.length]
  )

  // Navigation : passe au fichier précédent (sans aller en dessous de 0)
  const go_prev = useCallback(
    () => set_current_index((i) => Math.max(i - 1, 0)),
    []
  )

  // Soumission finale : envoie le plan validé au backend
  // → Mode contenu : submit_content(content, plan)
  // → Mode dossier : submit_validated_plan(folderPath, plan)
  // Si le backend retourne du texte anonymisé, le stocke dans anonymized_result
  // Puis ferme la modal et appelle onSuccess (active le bouton "Charger" dans App.jsx)
  const submit = useCallback(async () => {
    try {
      let result
      if (mode === 'contenu') {
        result = await submit_content(content, plan)
      } else {
        result = await submit_validated_plan(folderPath, plan)
      }
      close_validation()
      if (result.anonymized_text) {
        set_anonymized_result({
          text: result.anonymized_text,
          filename: result.filename,
        })
      }
      if (onSuccess) onSuccess()
      return result
    } catch (e) {
      set_error(e.message)
      return null
    }
  }, [folderPath, plan, close_validation, onSuccess, mode, content])


  // Variables exposées au parent (App.jsx / ValidationModal)
  return {
    is_open,
    plan,
    current_index,
    loading,
    error,
    anonymized_result,
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