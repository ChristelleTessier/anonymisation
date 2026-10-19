import { useState, useCallback } from 'react'
import ConfigSetting from './components/ConfigSetting'
import Anonymisation from './components/Anonymisation'
import Desanonymization from './components/Desanonymization'
import CollapsibleSection from './components/common/CollapsibleSection'
import ValidationModal from './components/validation/ValidationModal'
import { useAnonymization } from './hooks/useAnonymization'
import { useValidation } from './hooks/useValidation'
import { scan_content } from './services/api_validation'
import './App.css'

function App() {
  const [variable_list, set_variable_list] = useState([]) // Liste des entités custom définies dans la configuration. Passée à ConfigSetting
  const [is_anonymized, set_is_anonymized] = useState(false) // Booléen : Indique si l'anonymisation est terminée. Sert à activer le bouton "Charger" en mode dossier 
  const [desanonymized_result, set_desanonymized_result] = useState(null) // Résultat de la désanonymisation : { text, filename }. Passé à Desanonymization → affiché par ContentResult
  const [mode, set_mode] = useState('dossier')  // Mode courant : 'dossier' ou 'contenu'. Partagé entre les deux blocs et la validation 
  const [openSection, set_open_section] = useState(null) // Identifie la section accordéon ouverte (aucune par défaut)
  const [content_anonymisation, set_content_anonymisation] = useState('') // Texte saisi dans la zone de contenu (pour Anonymisation et Desanonymization)
  const [content_desanonymisation, set_content_desanonymisation] = useState('') // Texte saisi dans la zone de contenu (pour Anonymisation et Desanonymization)
  const [plan_path, set_plan_path] = useState('') // Chemin du plan d'anonymisation (.json)

  // Gestion des évènements
  //////////////////////////

  const handle_success = useCallback(() => { // Gestion du statut du résultat de l'anonymisation
    set_is_anonymized(true)
  }, [])

  const handle_anonymize = async () => { // Gestion des étapes d'anonymisation
    if (mode === 'contenu') {
      try {
        await scan_content(content_anonymisation)
        set_is_anonymized(false)
        validation.open_validation()
      } catch (err) {
        alert(`Erreur scan : ${err.message}`)
        console.error('scan_content failed:', err)
      }
    } else {
      const success = await handle_anonymize_click()
      if (success) {
        set_is_anonymized(false)
        validation.open_validation()
      }
    }
  }

  const handle_desanonymize = async () => { // Gestion des étapes de désanonymisation
    // Simulation frontend : on affiche le contenu collé comme "résultat"
    if (mode === 'contenu') {
      set_desanonymized_result({
        text: content_desanonymisation,
        filename: 'contenu_desanonymise.txt',
      })
    } else {
      set_desanonymized_result({
        text: 'Désanonymisation du dossier terminée (simulation).',
        filename: 'resultat.txt',
      })
    }
  }

  // Lien vers Hook
  //////////////////////////

  const { folder_path, set_folder_path, is_processing, handle_anonymize_click } = useAnonymization()
  // folder_path : chemin du dossier (managé par le hook)
  // is_processing : true pendant n'importe quel appel API en cours
  // handle_anonymize_click : lance l'API d'anonymisation (mode dossier uniquement)

  const validation = useValidation(folder_path, handle_success, mode, content_anonymisation)
  // Gère le cycle de validation post-anonymisation :
  // retourne anonymized_result (affiché dans ContentResult)
  // et open_validation() (ouvre la ValidationModal)


  const toggleSection = (id) => {  // Gestion des accordon (un seul a la fois)
    set_open_section((prev) => (prev === id ? null : id))
  }

  return (
    <div className="page_layout">
      <main className="content_box">
        <h1 className="main_title">Anonymisation d'un dossier - d'un contenu</h1>

        <CollapsibleSection
          title="Paramètres de configuration"
          isOpen={openSection === 'config'}
          onToggle={() => toggleSection('config')}
        >
          <ConfigSetting
            variable_list={variable_list}
            set_variable_list={set_variable_list}
          />
        </CollapsibleSection>

        <hr className="section_divider" />

        <CollapsibleSection
          title="Anonymisation"
          isOpen={openSection === 'anonymisation'}
          onToggle={() => toggleSection('anonymisation')}
        >
          <Anonymisation
            folder_path={folder_path}
            set_folder_path={set_folder_path}
            on_anonymize={handle_anonymize}
            is_processing={is_processing}
            is_anonymized={is_anonymized}
            mode={mode}
            set_mode={set_mode}
            content={content_anonymisation}
            set_content={set_content_anonymisation}
            anonymized_result={validation.anonymized_result}

          />
        </CollapsibleSection>

      <hr className="section_divider" />


      <CollapsibleSection
        title="Désanonymisation"
        isOpen={openSection === 'desanonymisation'}
        onToggle={() => toggleSection('desanonymisation')}
      >
        <Desanonymization
            folder_path={folder_path}
            set_folder_path={set_folder_path}
            on_desanonymize={handle_desanonymize}
            is_processing={is_processing}
            is_desanonymized={desanonymized_result !== null}
            mode={mode}
            set_mode={set_mode}
            content={content_desanonymisation}
            set_content={set_content_desanonymisation}
            desanonymized_result={desanonymized_result}
            plan_path={plan_path}        
            set_plan_path={set_plan_path}
          />
        </CollapsibleSection>
      </main>

      <ValidationModal validation={validation} />
    </div>
  )
}

export default App