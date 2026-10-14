import sys
from pathlib import Path
import json
import os
import shutil
from pprint import pprint

from scripts.travail_fichier import load_config_etude, load_json, load_fichier_en_texte, save_json


class Transformer:

    def __init__(self, chemin_plan, chemin_dir):
        self.chemin_plan = Path(chemin_plan)
        self.chemin_dir = Path(chemin_dir)
        self.chemin_enregistrement = Path("anonymized")

    def _get_single_file_content(self, chemin_fichier):
        """
        Lit le contenu d'un fichier spécifique et retourne le texte.
        """
        # Conversion en objet Path
        file_path = Path(chemin_fichier)

        # Vérification de sécurité (même si vous êtes sûr du format)
        if not file_path.exists():
            print(f"❌ Erreur : Le fichier '{file_path}' est introuvable.")
            return None

        try:
            # Lecture directe du fichier
            # encoding='utf-8' avec errors='ignore' permet de lire 
            # n'importe quel format (xml, sql, log, etc.) sans planter sur des caractères spéciaux
            content = file_path.read_text(encoding='utf-8', errors='ignore')
            return content
        except Exception as e:
            print(f"❌ Erreur lors de la lecture de {file_path}: {e}")

    def _apply_transformations(self, content, plan_entries, inverse):
        """
        Prend le contenu d'un fichier et remplace les 'original' par 'proposition'
        """
        new_content = content
        for entry in plan_entries:
            if inverse :
                new_val = entry['original']
                old_val = entry['proposition']
            else:
                old_val = entry['original']
                new_val = entry['proposition']

            
            # On remplace toutes les occurrences de la valeur originale
            if old_val in new_content:
                new_content = new_content.replace(old_val, new_val)
        return new_content

    def _save_file(self, chemin_source, contenu_modifie, modif_nom):
        """
        Gère l'enregistrement en conservant l'arborescence dans le dossier d'enregistrement
        """
        chemin_source = Path(chemin_source)
        
        # 1. Calculer le chemin relatif par rapport au dossier de travail (chemin_dir)
        try:
            chemin_relatif = chemin_source.relative_to(self.chemin_dir)
        except ValueError:
            # Si le fichier n'est pas dans le dossier de travail, on utilise juste son nom
            chemin_relatif = Path(chemin_source.name)

        # 2. Appliquer le nouveau nom si spécifié
        if modif_nom:
            chemin_relatif = chemin_relatif.with_name(modif_nom)

        # 3. Construire le chemin de destination final dans le dossier d'enregistrement
        chemin_destination = self.chemin_enregistrement / chemin_relatif

        # 4. Écriture
        try:
            # Créer les dossiers parents dans le dossier d'enregistrement
            chemin_destination.parent.mkdir(parents=True, exist_ok=True)
            chemin_destination.write_text(contenu_modifie, encoding='utf-8')
            print(f"✅ Sauvegardé : {chemin_destination.relative_to(self.chemin_enregistrement)}")
        except Exception as e:
            print(f"❌ Erreur d'écriture vers {chemin_destination}: {e}")



    def run(self, bool_action):
        plan = load_json(self.chemin_plan)
        if not plan:
            sys.exit(1)
        self.plan = plan

        for travail_fichier in self.plan:
            chemin = travail_fichier.get('chemin_fichier')
            modif_interne = travail_fichier.get('modif_interne', [])
            modif_nom = travail_fichier.get("modif_nom")

            if not chemin:
                continue # sort du for

            # Lecture
            #contenu_original = self._get_single_file_content(chemin)
            contenu_original = load_fichier_en_texte(chemin)
            contenu_modifie = contenu_original

            # if contenu_original is None:
            #     continue

            if modif_interne:
                # Transformation
                contenu_modifie = self._apply_transformations(contenu_original, modif_interne, bool_action)
            

            # Sauvegarde
            self._save_file(chemin, contenu_modifie, modif_nom)
       
