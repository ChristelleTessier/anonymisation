const API_BASE_URL = 'http://127.0.0.1:8000/api'

/**
 * Récupère le plan d'anonymisation généré par analyzer.run()
 */
export async function fetch_validation_plan() {
  const response = await fetch(
    `${API_BASE_URL}/validation/plan`
  )
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || 'Plan introuvable')
  }
  return response.json()
}

/**
 * Soumet le plan validé par l'utilisateur
 */
export async function submit_validated_plan(folderPath, plan) {
  const response = await fetch(
    `${API_BASE_URL}/validation/submit?folder_path=${encodeURIComponent(folderPath)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    }
  )
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || 'Échec de la soumission')
  }
  return response.json()
}