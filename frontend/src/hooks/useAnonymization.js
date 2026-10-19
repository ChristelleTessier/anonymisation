import { useState } from 'react'
import { start_anonymization } from '../services/api_scan'
// Fonction qui déclenche l'anonymisation côté backend (envoie le folder_path au serveur)

export function useAnonymization() {
  const [folder_path, set_folder_path] = useState('') // Chemin du dossier à anonymiser (managé par le hook, passé aux composants enfants)
  const [is_processing, set_is_processing] = useState(false) // Booléen : true pendant que l'appel API d'anonymisation est en cours
  // Sert à désactiver les boutons et afficher le texte "Anonymisation..."


  // Gère le clic sur le bouton "Anonymiser" en mode dossier
  // → Envoie le folder_path au backend via start_anonymization()
  // → Retourne true si succès, false sinon
  const handle_anonymize_click = async () => {
    if (!folder_path) return false // Garde-fou : renvoie false si aucun chemin saisi
    set_is_processing(true) // Désactive le bouton (feedback visuel)
    try {
      await start_anonymization(folder_path) // Appel API : lance l'anonymisation du dossier
      return true  // Signale le succès au parent (App.jsx)
    } catch (error) {
      alert('Erreur : ' + error.message) // Affiche l'erreur à l'utilisateur
      return false // Signale l'échec au parent
    } finally {
      set_is_processing(false) // Réactive le bouton (toujours exécuté)
    }
  }

  // Variables exposées au parent (App.jsx)
  return { folder_path, set_folder_path, is_processing, handle_anonymize_click }
}