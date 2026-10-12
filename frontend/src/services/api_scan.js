const API_BASE_URL = 'http://127.0.0.1:8000/api'

/**
 * Envoie l'ordre de lancer l'anonymisation au backend
 * @param {string} folderPath - Le chemin du dossier à traiter
 */
export async function start_anonymization(folderPath) {
    const response = await fetch(`${API_BASE_URL}/anonymize`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folder_path: folderPath }),
    });

    if (!response.ok) {
        // On récupère le message d'erreur détaillé envoyé par FastAPI
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur lors de l\'anonymisation');
    }

    return await response.json();
}