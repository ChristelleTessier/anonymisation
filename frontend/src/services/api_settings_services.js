const API_BASE_URL = 'http://127.0.0.1:8000/api'


/**
 * Récupère la mise en forme des json de configuration depuis le backend
 */
export async function fetch_config_specs() {
  const response = await fetch(`${API_BASE_URL}/config-specs`)
  if (!response.ok) {
    throw new Error('Impossible de récupérer la structure des configurations')
  }
  return response.json()
}

/**
 * Récupère les patterns de scan depuis le backend
 */
export async function fetch_scan_patterns() {
  const response = await fetch(`${API_BASE_URL}/scan-patterns`)

  if (!response.ok) {
    throw new Error(`Erreur lors du chargement des paramètres (${response.status})`)
  }

  return await response.json()
}


/**
 * Récupère les paramètres de scan depuis le backend
 */
export async function fetch_scan_settings() {
  const response = await fetch(`${API_BASE_URL}/scan-settings`)

  if (!response.ok) {
    throw new Error(`Erreur lors du chargement des paramètres (${response.status})`)
  }

  return await response.json()
}

/**
 * Récupère les paramètres custom depuis le backend
 */
export async function fetch_custom_entities() {
  const response = await fetch(`${API_BASE_URL}/scan-custom-entities`)

  if (!response.ok) {
    throw new Error(`Erreur lors du chargement des paramètres (${response.status})`)
  }

  return await response.json()
}

/**
 * Sauvegarde les paramètres de scan dans le backend
 */
export async function save_scan_settings(settings_payload) {
  const response = await fetch(`${API_BASE_URL}/scan-settings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings_payload),
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la sauvegarde (${response.status})`)
  }

  return await response.json()
}

/**
 * Sauvegarde la liste des entités personnalisées dans le backend
 */
export async function save_custom_entities(entities_list) {
  const response = await fetch(`${API_BASE_URL}/custom-entities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ entities: entities_list }),
  })

  if (!response.ok) {
    throw new Error(`Erreur lors de la sauvegarde (${response.status})`)
  }

  return await response.json()
}

/**
 * Télécharge l'archive zip des fichiers de configuration
 */
export async function download_config_archive() {
  const response = await fetch(`${API_BASE_URL}/download-configs`)

  if (!response.ok) {
    throw new Error(`Erreur lors du téléchargement (${response.status})`)
  }

  const blob = await response.blob()
  const download_url = window.URL.createObjectURL(blob)
  const temp_link = document.createElement('a')
  temp_link.href = download_url
  temp_link.download = 'config_files.zip'
  document.body.appendChild(temp_link)
  temp_link.click()
  temp_link.remove()
  window.URL.revokeObjectURL(download_url)
}

