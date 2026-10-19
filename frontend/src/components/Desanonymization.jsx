import { useState } from 'react'
import { download_results } from '../services/api_validation'
import ModeToggle from './choix_fichier/ModeToggle'
import DossierInput from './choix_fichier/DossierInput'
import ContentInput from './choix_fichier/ContentInput'
import ContentResult from './choix_fichier/ContentResult'

function Desanonymization({
  folder_path, // Chaîne de caractères contenant le chemin du dossier à desanonymiser (utilisé en mode "dossier")
  set_folder_path, // Fonction pour modifier le chemin du dossier (passée à DossierInput)
  on_desanonymize, // Callback déclenché au clic sur "Désanonymiser" — le parent gère l'appel API 
  is_processing, // Booléen : true pendant que la desanonymisation est en cours (pour désactiver le bouton et afficher "Anonymisation...")
  is_desanonymized, // Booléen : true une fois que la desanonymisation est terminée avec succès (permet d'activer le bouton 'Charger')
  mode, // Chaîne : 'dossier' ou 'contenu' — détermine quel bloc d'input afficher
  set_mode, // Fonction pour changer le mode (passée à ModeToggle)
  content, // Chaîne : le texte saisi dans la zone de contenu (mode "contenu")
  set_content, // Fonction pour modifier le texte (passée à ContentInput)
  desanonymized_result, // Objet (ou null) contenant le résultat de la désanonymisation : { text, filename } — affiché par ContentResult
  plan_path, // Chemin du plan d'anonymisation (.json) — spécifique à la désanonymisation, nécessaire pour remonter les valeurs d'origine
  set_plan_path, // Fonction pour modifier le chemin du plan (passée à DossierInput) 
})
 {
  const [downloading, set_downloading] = useState(false) // Gère le clic sur le bouton 'Charger' → télécharge les fichiers désanonymisés depuis le serveur


  // Gestion des évènements
  //////////////////////////

  const handle_download = async () => { // Pour le stockage en des fichiers en mode dossier
    set_downloading(true)
    try {
      await download_results()
    } catch (e) {
      alert(`Erreur : ${e.message}`)
    } finally {
      set_downloading(false)
    }
  }


  // Booléen calculé : true si le champ requis selon le mode est rempli
  //   - mode 'dossier'  → folder_path non vide
  //   - mode 'contenu'  → content non vide
  // Sert à désactiver le bouton "Desanonymiser" si le champ requis n'est pas rempli
  const can_desanonymize = mode === 'dossier'
    ? folder_path.trim().length > 0 && plan_path.trim().length > 0
    : content.trim().length > 0

  return (
    <div>
      {/* Recoit mode de App.jsx*/}
      <ModeToggle mode={mode} set_mode={set_mode} /> 


      {/* Gestion de l'affichage en fonction du mode -> lien DossierInput ds Choix_fichier*/}
      {mode === 'dossier' && (
        <DossierInput 
            folder_path={folder_path} 
            set_folder_path={set_folder_path}
            action="désanonymiser"
            plan_path={plan_path}
            set_plan_path={set_plan_path}
        />
      )}

      {/* Gestion de l'affichage en fonction du mode -> lien ContentInput ds Choix_fichier*/}
      {mode === 'contenu' && (
        <ContentInput
          content={content}
          set_content={set_content}
          action="désanonymiser"
        />
      )}

      {/* Gestion des boutons (ds common/config)*/}
      <div className="button_group">
        <button
          className="anonymize_button"
          onClick={on_desanonymize}
          disabled={!can_desanonymize || is_processing}
        >
          {is_processing ? 'Désanonymisation...' : 'Désanonymiser'}
        </button>

        {/* Visible dans les 2 modes */}
        <button
          className="anonymize_button download_button"
          onClick={handle_download}
          disabled={!is_desanonymized || downloading}
        >
          {downloading ? 'Téléchargement...' : 'Charger'}
        </button>
      </div>

      <ContentResult
        anonymized_result={desanonymized_result}
        title="✅ Texte désanonymisé"
      />
    </div>
  )
}

export default Desanonymization