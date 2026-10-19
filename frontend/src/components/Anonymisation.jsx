import { useState } from 'react'
import { download_results } from '../services/api_validation'
import ModeToggle from './choix_fichier/ModeToggle'
import DossierInput from './choix_fichier/DossierInput'
import ContentInput from './choix_fichier/ContentInput'
import ContentResult from './choix_fichier/ContentResult'

function Anonymisation({
  folder_path, // Chaîne de caractères contenant le chemin du dossier à anonymiser (utilisé en mode "dossier")
  set_folder_path, // Fonction pour modifier le chemin du dossier (passée à DossierInput)
  on_anonymize, // Callback déclenché au clic sur le bouton "Anonymiser" — c'est le parent qui gère l'appel API
  is_processing, // Booléen : true pendant que l'anonymisation est en cours (pour désactiver le bouton et afficher "Anonymisation...")
  is_anonymized, // Booléen : true une fois l'anonymisation terminée avec succès (permet d'activer le bouton "Charger")
  mode, // Chaîne : 'dossier' ou 'contenu' — détermine quel bloc d'input afficher
  set_mode, // Fonction pour changer le mode (passée à ModeToggle)
  content, // Chaîne : le texte saisi dans la zone de contenu (mode "contenu")
  set_content, // Fonction pour modifier le texte (passée à ContentInput)
  anonymized_result, // Objet (ou null) contenant le résultat de l'anonymisation : { text, filename } — affiché par ContentResult
}) {

  const [downloading, set_downloading] = useState(false) // downloading -> Booléen : true pendant le téléchargement du résultat (bouton "Charger") 

  // Gestion des évènements
  //////////////////////////
  
  const handle_download = async () => { // Gère le clic sur le bouton 'Charger' → télécharge les fichiers anonymisés depuis le serveur (mode dossier uniquement)
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
  // Sert à désactiver le bouton "Anonymiser" si le champ requis n'est pas rempli
  const can_anonymize = mode === 'dossier'  
    ? folder_path.trim().length > 0
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
        />
      )}

      {/* Gestion de l'affichage en fonction du mode -> lien ContentInput ds Choix_fichier*/}
      {mode === 'contenu' && (
        <ContentInput
          content={content}
          set_content={set_content}
        />
      )}

      {/* Groupe de boutons d'action (anonymiser + télécharger) */}
      <div className="button_group">
        <button
          className="anonymize_button"
          onClick={on_anonymize}
          disabled={!can_anonymize || is_processing}
        >
          {is_processing ? 'Anonymisation...' : 'Anonymiser'}
        </button>

        {mode === 'dossier' && (
          <button
            className="anonymize_button download_button"
            onClick={handle_download}
            disabled={!is_anonymized || downloading}
          >
            {downloading ? 'Téléchargement...' : 'Charger'}
          </button>
        )}
      </div>

      <ContentResult anonymized_result={anonymized_result} />
    </div>
  )
}

export default Anonymisation