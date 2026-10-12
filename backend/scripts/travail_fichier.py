import json
import os

from pathlib import Path

# =========================================================================
# LECTURE DE FICHIER
# =========================================================================

def load_config_etude():
    """
    Charge la configuration technique depuis le fichier JSON externe.

    Cette méthode localise le fichier de configuration dans le dossier 'utils',
    le lit et initialise les moteurs de recherche (regex) ainsi que les 
    extensions de fichiers cibles.

    Args:
        config_name (str): Le nom du fichier de configuration (ex: 'patterns.json').

    Raises:
        SystemExit: Si le fichier est introuvable ou si le format JSON est invalide.
    """
    config_path = "utils/patterns.json"
    config = load_json(config_path)

    if config:
        dict_proposition = config.get("categories",[])
        regex_engines = config.get("def_rules",[])
    else:
        return

    config_path = "utils/settings.json"
    config = load_json(config_path)
    print(config)
    
    if config:
        target_extensions = config.get("target_extensions", [])
        ignored_extensions = config.get("ignored_extensions", [])
        ignored_dossiers = config.get('ignored_directories', [])
    else:
        return

    config_path = "utils/custom_entities.json"
    config = load_json(config_path)
    
    if config:
        nom_fichier = config.get("nom_fichier",[])
    else:
        return

    return regex_engines, target_extensions, ignored_extensions, ignored_dossiers, nom_fichier, dict_proposition


def load_json(chemin):
    directory = Path(chemin).absolute()

    if not os.path.exists(directory):
        print(f"❌ Erreur : Le fichier '{chemin}' est introuvable.")
        return
        
    with open(directory, 'r', encoding='utf-8') as f:
        return json.load(f)

def load_fichier_en_texte(chemin_fichier):
    """
    Lit le contenu d'un fichier spécifique et retourne le texte.
    """
    # Conversion en objet Path
    file_path = Path(chemin_fichier)

    # Vérification de sécurité (même si vous êtes sûr du format)
    if not file_path.exists():
        print(f"❌ Erreur : Le fichier '{file_path}' est introuvable.")
        return 

    try:
        # Lecture directe du fichier
        # encoding='utf-8' avec errors='ignore' permet de lire 
        # n'importe quel format (xml, sql, log, etc.) sans planter sur des caractères spéciaux
        content = file_path.read_text(encoding='utf-8', errors='ignore')
        return content
    except Exception as e:
        print(f"❌ Erreur lors de la lecture de {file_path}: {e}")

# =========================================================================
# ENREGISTREMENT DE FICHIER
# =========================================================================

def save_json(results, chemin_principal, chemin_complementaire):
    """
    Sauvegarde le rapport d'analyse dans un fichier JSON structuré.

    La méthode crée un sous-dossier 'json' à l'intérieur du dossier de 
    destination pour y stocker le fichier 'changes_plan.json'.

    Args:
        results (dict): Le dictionnaire contenant l'intégralité des 
            détections et de la configuration.
        output_dir (Path): Le chemin du dossier racine de destination.

    Returns:
        Path: Le chemin complet vers le fichier JSON généré.
    """
    # chemin_enregistrement = Path(chemin_principal / chemin_complementaire)
    # chemin_enregistrement.parent.mkdir(parents=True, exist_ok=True)
    chemin_enregistrement = Path("utils")/chemin_complementaire
        
    with open(chemin_enregistrement, 'w', encoding='utf-8') as f:
    #with open(chemin_complementaire, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=4, ensure_ascii=False)
    #return chemin_enregistrement

# En cours de construction TO DO
# def save_fichier(chemin, contenu, modif_nom):
#     """
#     Gère l'enregistrement en conservant l'arborescence dans le dossier d'enregistrement
#     """
#     chemin_source = Path(chemin_source)
        
#     # 1. Calculer le chemin relatif par rapport au dossier de travail (chemin_dir)
#     try:
#         chemin_relatif = chemin_source.relative_to(self.chemin_dir)
#     except ValueError:
#         # Si le fichier n'est pas dans le dossier de travail, on utilise juste son nom
#         chemin_relatif = Path(chemin_source.name)

#     # 2. Appliquer le nouveau nom si spécifié
#     if modif_nom:
#         chemin_relatif = chemin_relatif.with_name(modif_nom)

#     # 3. Construire le chemin de destination final dans le dossier d'enregistrement
#     chemin_destination = self.chemin_enregistrement / chemin_relatif

#     # 4. Écriture
#     try:
#         # Créer les dossiers parents dans le dossier d'enregistrement
#         chemin_destination.parent.mkdir(parents=True, exist_ok=True)
#         chemin_destination.write_text(contenu_modifie, encoding='utf-8')
#         print(f"✅ Sauvegardé : {chemin_destination.relative_to(self.chemin_enregistrement)}")
#     except Exception as e:
#         print(f"❌ Erreur d'écriture vers {chemin_destination}: {e}")