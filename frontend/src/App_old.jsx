// src/App.jsx
import { useState } from 'react';
import ConfigSetting from './components/ConfigSetting';
import FolderChoice from './components/FolderChoice';
import { start_anonymization } from './services/api_scan'; 
import './App.css';

function App() {
    const [folder_path, set_folder_path] = useState("");
    const [variable_list, set_variable_list] = useState([]);
    const [is_processing, setIsProcessing] = useState(false);

    const handle_anonymize = async () => {
        if (!folder_path.trim()) {
            alert("Veuillez sélectionner un dossier valide.");
            return;
        }

        setIsProcessing(true); // Met le bouton en mode "Anonymisation..." [2]
        
        try {
            // Appelle le service qui communique avec main.py
            const data = await start_anonymization(folder_path);
            
            // Si tout s'est bien passé, on affiche le message du serveur
            alert("Succès : " + data.message);
        } catch (error) {
            // Si le serveur renvoie une erreur, on l'affiche
            alert("Erreur : " + error.message);
        } finally {
            // On remet le bouton en mode normal, quoi qu'il arrive [2]
            setIsProcessing(false);
        }
    };

    return (
        <div className="page_layout">
            <main className="content_box">
                <h1 className="main_title">Anonymisation de dossier</h1>
                
                <ConfigSetting
                    variable_list={variable_list}
                    set_variable_list={set_variable_list}
                />
                
                <hr className="section_divider" />
                
                <FolderChoice 
                    folder_path={folder_path}
                    set_folder_path={set_folder_path}
                    on_anonymize={handle_anonymize} // On passe la vraie fonction
                    is_processing={is_processing}   // On passe l'état de chargement [2]
                />
            </main>
        </div>
    );
}

export default App;