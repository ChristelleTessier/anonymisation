import { useState } from 'react';
import { start_anonymization } from '../services/api_services';

export function useAnonymization() {
    const [folder_path, set_folder_path] = useState("");
    const [is_processing, setIsProcessing] = useState(false);

    const handle_anonymize_click = async () => {
        if (!folder_path) return;

        setIsProcessing(true);
        try {
            const data = await start_anonymization(folder_path);
            alert("Succès : " + data.message);
        } catch (error) {
            alert("Erreur : " + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    // On retourne tout ce dont les composants ont besoin
    return {
        folder_path,
        set_folder_path,
        is_processing,
        handle_anonymize_click
    };
}