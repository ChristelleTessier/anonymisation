# TO DO -> vérifier le nom des fichier non scanné


import re
import sys

from pathlib import Path

from scripts.travail_fichier import load_config_etude, save_json


class AdvancedAnalyzer:

    # =========================================================================
    # INITIALISATION & CONFIGURATION
    # =========================================================================

    def __init__(self, directory):
        """Initialise l'analyseur en chargeant uniquement les moteurs Regex."""
        # Chemin du fichier à scanner
        self.directory = directory
        # Liste des elements a changer
        self.changes=[]

        # Récupération du fichier des recherches regrex et mise à jour de regex_engines
        retour_config = load_config_etude()
        if retour_config:
            self.regex_engines, self.target_extensions, self.ignored_extensions, self.ignored_dossiers, self.nom_fichier, _ = retour_config
        else:
            sys.exit(1)


    # =========================================================================
    # MOTEUR DE NAVIGATION
    # =========================================================================

    def _recursive_scan(self, current_path):
        """
        Parcourt récursivement les dossiers en respectant les règles d'exclusion
        des dossiers et d'inclusion des extensions.
        """
        # On utilise iterdir() pour avoir un contrôle total sur chaque élément
        for element in current_path.iterdir():
            
            # CAS 1 : C'est un dossier
            if element.is_dir():
                # Si le dossier n'est pas dans la liste des ignorés
                if element.name not in self.ignored_dossiers:
                    # On descend dedans (Récursion)
                    self._recursive_scan(element)

            # CAS 2 : C'est un fichier
            elif element.is_file():
                # On vérifie deux choses :
                # 1. L'extension n'est-elle pas dans la liste des ignorées ?
                if element.suffix not in self.ignored_extensions:
                    self._process_single_file(element)


    # =========================================================================
    # MOTEUR D'ANALYSE (DÉTECTION)
    # =========================================================================

    def _analyze_filename(self, file_path_obj):
        """
        Analyse le nom d'un fichier pour détecter la présence de données sensibles.
        
        Cette méthode parcourt les motifs de recherche (regex) définis dans la 
        configuration pour vérifier si le nom du fichier contient des informations 
        identifiables (emails, IPs, secrets, etc.). Si un motif est trouvé, elle 
        propose une action de renommage complet du fichier.
        
        Args:
            file_path_obj (pathlib.Path): L'objet chemin représentant le fichier 
                à analyser.
        
        Returns:
            - 'action' (str) : Toujours 'RENAME_FILE' pour cette méthode.
        """
        nom_fichier = file_path_obj.name
        for nom in self.nom_fichier:
            if nom in nom_fichier:
                return "A_MODIF"

    def _scan_file_content(self, file_path):
        """
        Analyse le contenu d'un fichier pour détecter des motifs sensibles via Regex.

        Cette méthode parcourt l'intégralité du contenu du fichier à l'aide de 
        moteurs d'expressions régulières (Regex) pour identifier des motifs 
        structurels prédéfinis (ex: adresses IP, emails, secrets, URLs).

        Note : L'analyse sémantique par NLP est actuellement désactivée.

        Args:
            file_path (str): Le chemin complet vers le fichier à analyser.

        Returns:
            list[dict]: Une liste de dictionnaires représentant les changements 
                proposés. Chaque dictionnaire contient :
                - 'category' (str) : La catégorie de la Regex détectée.
                - 'action' (str) : L'action associée à la catégorie (ex: 'DELETE').
                - 'original' (str) : La chaîne de caractères originale trouvée.
                - 'start' (int) : L'index de début du motif dans le fichier.
                - 'end' (int) : L'index de fin du motif dans le fichier.
                
                En cas d'erreur de lecture (encodage, permissions), retourne une 
                liste contenant un dictionnaire avec les clés 'error' et 'file'.
        """
        changes = []
        try:
            # 1. Conversion en objets Path pour manipuler les chemins facilement
            path_obj = Path(file_path)

            # 2. Lecture du contenu
            content = path_obj.read_text(encoding='utf-8')

            for regles in self.regex_engines:
                pattern = regles.get("pattern")
                categorie = regles.get("categorie")

                for match in re.finditer(pattern, content):
                    changes.append({ 
                        "category": categorie,
                        "original": match.group(),
                        "start": match.start(),
                        "end": match.end()
                        })

            # TO DO
            return self._deduplicate(changes)

        except Exception as e:
            return [{"error": str(e), "file": str(file_path)}]


    # *******************
    # A re gerer 
    # *******************
    def _deduplicate(self, changes):
        """
        Élimine les détections redondantes pour éviter les modifications multiples 
        sur la même zone de texte.

        Cette méthode est cruciale pour garantir l'intégrité du fichier lors de la 
        phase de transformation. Elle empêche qu'un même intervalle de caractères 
        soit proposé plusieurs fois (par exemple, si une regex et un autre moteur 
        identifient simultanément la même donnée).

        Args:
            changes (list[dict]): Une liste de dictionnaires représentant les 
                changements détectés. Chaque dictionnaire doit contenir les 
                clés 'file', 'start' et 'end'.

        Returns:
            list[dict]: Une liste filtrée ne contenant que des changements 
                uniques basés sur l'identité (fichier, index de début, index de fin).
        """
        unique = []
        seen = set()
        for c in changes:
            key = (c['start'], c['end'])
            if key not in seen:
                unique.append(c)
                seen.add(key)
        return unique

    def _process_single_file(self, file):
        """
        Effectue l'analyse complète d'un fichier (nom et contenu).

        Cette méthode centralise la détection pour un fichier donné en combinant
        l'analyse de son nom de fichier et l'analyse de son contenu textuel.

        Args:
            file (Path): L'objet chemin du fichier à analyser.

        Returns:
            dict: La liste mise à jour des changements détectés pour ce fichier.
        """

        # Creation du dictionnaire si absent
        dict_changes = {
            "chemin_fichier" : str(file),
            "modif_nom" : None,
            "modif_interne" : None
        }

        if file.suffix in self.target_extensions:
            # Analyse Nom
            dict_changes["modif_nom"] = self._analyze_filename(file)

            # Analyse Contenu
            dict_changes["modif_interne"] = self._scan_file_content(file)

        self.changes.append(dict_changes)

    # =========================================================================
    # ORCHESTRATION
    # =========================================================================

    def run(self):
        """
        Orchestre l'analyse complète.
        C'est maintenant une méthode très courte et facile à lire.
        """
    
        # 1. Gestion de la destination
        source_dir = Path(self.directory).absolute()
        
        # 2. Boucle d'analyse
        self._recursive_scan(source_dir)
        
        # 3. Sauvegarde 
        save_json(self.changes, "proposition_changes_plan.json")
    
    
