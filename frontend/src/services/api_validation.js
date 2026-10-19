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

/**
 * Télécharge le ZIP (plan validé + fichiers anonymisés)
 */
export async function download_results() {
  const response = await fetch(`${API_BASE_URL}/chargement/download`)
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || 'Échec du téléchargement')
  }
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'anonymized_results.zip'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Lance le scan sur un contenu collé
 */
export async function scan_content(content) {
  const response = await fetch(`${API_BASE_URL}/scan_content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content}),
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const detail = typeof errorData.detail === 'string'
      ? errorData.detail
      : JSON.stringify(errorData.detail) || 'Échec du scan du contenu'
    throw new Error(detail)
  }
  return response.json()
}

/**
 * Soumet le plan validé pour le mode contenu → retourne le texte anonymisé
 */
export async function submit_content(content, plan) {
  const response = await fetch(`${API_BASE_URL}/validation/submit_content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, plan }),
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const detail = typeof errorData.detail === 'string'
      ? errorData.detail
      : JSON.stringify(errorData.detail) || 'Échec de la soumission'
    throw new Error(detail)
  }
  return response.json()
}

/**
 * Télécharge le plan d'anonymisation validé (.json)
 */
export async function download_validated_plan() {
  const response = await fetch(`${API_BASE_URL}/chargement/validated_plan`)
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || 'Échec du téléchargement du plan')
  }
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'validated_changes_plan.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Désanonymise un contenu : remplace les propositions par les valeurs d'origine
 * à l'aide du plan validé stocké sur le serveur.
 */
export async function desanitize_content(content) {
  const response = await fetch(`${API_BASE_URL}/validation/desanitize_content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const detail = typeof errorData.detail === 'string'
      ? errorData.detail
      : JSON.stringify(errorData.detail) || 'Échec de la désanonymisation'
    throw new Error(detail)
  }
  return response.json()
}