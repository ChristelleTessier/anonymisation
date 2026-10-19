import { useState } from 'react'
import { download_results } from '../services/api_validation'
import ModeToggle from './choix_fichier/ModeToggle'
import DossierInput from './choix_fichier/DossierInput'
import ContentInput from './choix_fichier/ContentInput'
import ContentResult from './choix_fichier/ContentResult'


function Desanonymization({
  folder_path, // Chaîne de caractères contenant le chemin du dossier à désanonymiser (utilisé en mode "dossier")
  set_folder_path, // Fonction pour modifier le chemin du dossier (passée à DossierInput)
  on_desanonymize, // Callback déclenché au clic sur le bouton "Désanonymiser" — c'est le parent qui gère l'appel API
  is_desanonymized, // Booléen : true une fois la désanonymisation terminée avec succès (permet d'activer le bouton "Charger")
  mode, // Chaîne : 'dossier' ou 'contenu' — détermine quel bloc d'input afficher
  set_mode, // Fonction pour changer le mode (passée à ModeToggle)
  content, // Chaîne : le texte saisi dans la zone de contenu (mode "contenu")
  set_content, // Fonction pour modifier le texte (passée à ContentInput)
  desanonymized_result, // Objet (ou null) contenant le résultat de la désanonymisation : { text, filename } — affiché par ContentResult
  plan_path, // Chemin du plan d'anonymisation (.json) — requis pour la désanonymisation (mode dossier ET contenu)
  set_plan_path, // Fonction pour modifier le chemin du plan
}) {

  const [downloading, set_downloading] = useState(false) // Booléen : true pendant le téléchargement du résultat (bouton "Charger")
  const [is_desan_processing, set_is_desan_processing] = useState(false) // Booléen : true pendant que la désanonymisation est en cours (pour désactiver le bouton et afficher "Désanonymisation...")


  // Gestion des évènements
  //////////////////////////

  // Gère le clic sur le bouton 'Charger' → télécharge les fichiers désanonymisés depuis le serveur
  const handle_download = async () => {
    set_downloading(true)
    try {
      await download_results()
    } catch (e) {
      alert(`Erreur : ${e.message}`)
    } finally {
      set_downloading(false)
    }
  }

  // Gère le clic sur le bouton "Désanonymiser" → wrapper autour du callback parent pour gérer l'état de traitement en local
  const handle_desanonymize_click = async () => {
    set_is_desan_processing(true)
    try {
      await on_desanonymize()
    } finally {
      set_is_desan_processing(false)
    }
  }

  // Booléen calculé : true si les champs requis selon le mode sont remplis
  //   - mode 'dossier'  → folder_path non vide ET plan_path non vide
  //   - mode 'contenu'  → content non vide ET plan_path non vide
  // Sert à désactiver le bouton "Désanonymiser" si les champs requis ne sont pas remplis
  const can_desanonymize = plan_path.trim().length > 0 && (
    mode === 'dossier'
      ? folder_path.trim().length > 0
      : content.trim().length > 0
  )


  return (
    <div>
      {/* Reçoit mode de App.jsx */}
      <ModeToggle mode={mode} set_mode={set_mode} />


      {/* Gestion de l'affichage en fonction du mode -> lien DossierInput ds Choix_fichier */}
      {mode === 'dossier' && (
        <DossierInput
          folder_path={folder_path}
          set_folder_path={set_folder_path}
          action="désanonymiser"
          plan_path={plan_path}
          set_plan_path={set_plan_path}
        />
      )}


      {/* Gestion de l'affichage en fonction du mode -> lien ContentInput ds Choix_fichier */}
      {mode === 'contenu' && (
        <>
          <ContentInput
            content={content}
            set_content={set_content}
            action="désanonymiser"
          />
          {/* Champ plan_path visible aussi en mode contenu */}
          <div className="folder_input_group">
            <label className="folder_input_label">
              Chemin du plan d'anonymisation (.json) :
            </label>
            <input
              type="text"
              className="folder_input"
              placeholder="Ex. : C:\Users\Documents\validated_change_plan.json"
              value={plan_path}
              onChange={(e) => set_plan_path(e.target.value)}
            />
          </div>
        </>
      )}


      {/* Groupe de boutons d'action (désanonymiser + télécharger) */}
      <div className="button_group">
        <button
          className="anonymize_button"
          onClick={handle_desanonymize_click}
          disabled={!can_desanonymize || is_desan_processing}
        >
          {is_desan_processing ? 'Désanonymisation...' : 'Désanonymiser'}
        </button>

        {/* Visible uniquement en mode dossier */}
        {mode === 'dossier' && (
            <button
            className="anonymize_button download_button"
            onClick={handle_download}
            disabled={!is_desanonymized || downloading}
            >
            {downloading ? 'Téléchargement...' : 'Charger'}
            </button>
        )}
        </div>


      <ContentResult
        anonymized_result={desanonymized_result}
        title="✅ Texte désanonymisé"
        show_plan_download={false}
      />
    </div>
  )
}


export default Desanonymization