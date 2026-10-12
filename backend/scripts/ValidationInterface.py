import sys
import os
import subprocess
from pathlib import Path

from scripts.travail_fichier import load_config_etude, load_json, save_json

class ValidationInterface:

    # =========================================================================
    # INITIALISATION & CONFIGURATION
    # =========================================================================

    def __init__(self, changes_plan):

        # chemin du fichier json de proposition
        self.chemin_plan_total = Path(changes_plan)
        # nom du dossier de stockage qui sera sur le bureau
        self.dossier_enregistement = self.chemin_plan_total.parents[1].name
    
        # Plan de validation initialisation
        self.validated_plan = []

        _, self.target_extensions, _, _, _, self.dict_proposition = load_config_etude()

    # =========================================================================
    # GESTION DES MENUS
    # =========================================================================

    def _display_modif_interne(self,dict_modif_interne, nom_fichier):

        dict_modif_interne = self._proposition_changement(dict_modif_interne)

        print(f"Travail sur : {nom_fichier}")

        print(f" category : {dict_modif_interne["category"]}")
        print(f" original : {dict_modif_interne["original"]}")
        print(f" proposition : {dict_modif_interne["proposition"]}")

        print("")

    # =========================================================================
    # LOGIQUE INTERNE
    # =========================================================================
    
    def _proposition_changement(self, dict_modif_interne):

        # Récupération du dictionnaire correspondant à la catégory (vide ou dictionnaire originale/proposition)
        self.dict_category = self.dict_proposition.get(dict_modif_interne["category"])
        
        if self.dict_category is not None:
            value = self.dict_category.get(dict_modif_interne["original"])
            if value is None:
                value = dict_modif_interne["category"].lower() + str(len(self.dict_category))

                # Mise a jour du dictionnaire de proposition
                self.dict_proposition.get(dict_modif_interne["category"])[dict_modif_interne["original"]] = value

            dict_modif_interne["proposition"] = value

            return dict_modif_interne

        else :
            print(f"❌ Erreur avec {self.dict_proposition}")
            sys.exit(1)
        
    def _get_user_decision(self):

        decision = input("   👉 Action [v (valider) / e (éditer) / i (ignorer)] : ").lower().strip()
        while (decision not in {"v","e","i"}):
            decision = input("   👉 Action [v (valider) / e (éditer) / i (ignorer)] : ").lower().strip()

        return decision

    def _application_user_decision(self, decision, dict_modif_interne):

        match decision:
            case "v":
                return self._mise_a_jour_plan(dict_modif_interne)
            case "e":
                value = input("saisir la valeur de remplacement : ")
                dict_modif_interne["proposition"] = value
                return self._mise_a_jour_plan(dict_modif_interne)
            case "i":
                return
            case _:
                sys.exit(1)

    def _mise_a_jour_plan(self, dict_modif_interne):

        modif = {
            "category" : dict_modif_interne["category"],
            "original" : dict_modif_interne["original"],
            "proposition" : dict_modif_interne["proposition"]
        }

        return modif  

    # =========================================================================
    # ORCHESTRATION
    # =========================================================================

    def _routine_filename(self, dict_modif_fichier, choix : str):

        travail_nom = dict_modif_fichier["modif_nom"]
        travail_interne = dict_modif_fichier["modif_interne"]     
        nom_dossier_pivot = self.dossier_enregistement.replace("_anonymized", "")

        chemin_path = Path(dict_modif_fichier["chemin_fichier"])
        parties = chemin_path.parts
        if nom_dossier_pivot in parties:
            index_pivot = parties.index(nom_dossier_pivot)
            # On reconstruit le chemin de la racine jusqu'à DossierC
            chemin_jusqua_c = Path(*parties[:index_pivot + 1])
            
            # 2. On extrait tout ce qui se trouve après ce point
            fin_chemin_enregistrement = chemin_path.relative_to(chemin_jusqua_c)

        dict_a_faire_fichier = {
            'chemin_fichier' : dict_modif_fichier['chemin_fichier'],
            'chemin_enregistrement' : f"{nom_dossier_pivot}_anonymized \\ {str(fin_chemin_enregistrement)}",
            'modif_interne' : None
        }

        if choix !="o":
            self.validated_plan.append(dict_a_faire_fichier)
            return
       
        # Gestion du nom  (gerer le suffixe -> TO DO)     
        if travail_nom:   
            nouveau_nom = "test"
            dict_a_faire_fichier["modif_nom"] = nouveau_nom

        if travail_interne:
            # Gestion des modifs internes
            liste_modif_interne = []
            
            for dict_modif in dict_modif_fichier["modif_interne"]:
            
                self._display_modif_interne(dict_modif, dict_modif_fichier["chemin_fichier"])
                decision = self._get_user_decision()
                    
                temp = self._application_user_decision(decision, dict_modif)
                if temp:
                    liste_modif_interne.append(temp)
                    
                if liste_modif_interne:
                    dict_a_faire_fichier["modif_interne"] = liste_modif_interne
                

        self.validated_plan.append(dict_a_faire_fichier)

    def run(self):
        plan = load_json(self.chemin_plan_total)
        if not plan:
            sys.exit(1)

        self.full_plan = plan
        for dict_modif_fichier in self.full_plan:
            dict_a_faire_fichier = {}

            # Nettoyage de la fenetre de travail
            command = "cls" if os.name == "nt" else "clear"
            subprocess.run([command], shell=True)

            extension = Path(dict_modif_fichier["chemin_fichier"]).suffix
            decision = "q"
            if extension in self.target_extensions:
        
                print(f"Anonimyser le fichier : {dict_modif_fichier["chemin_fichier"]} ?")
                decision = input("   👉 Action [o (oui) / n (non -> passer au fichier suivant)").lower().strip()
                dict_a_faire_fichier["chemin_fichier"] = dict_modif_fichier["chemin_fichier"]
            
                while(decision not in ["o","n"]):
                    print(f"Anonimyser le fichier : {dict_modif_fichier["chemin_fichier"]} ?")
                    decision = input("   👉 Action [o (oui) / n (non -> passer au fichier suivant)").lower().strip()

            self._routine_filename(dict_modif_fichier, decision)
        
        chemin_plan_final = save_json(self.validated_plan, self.chemin_plan_total, "")
        
        print("\n✅ Validation du plan terminé.")
        print(f"📄 Plan généré : {chemin_plan_final}")



if __name__ == "__main__":
    ValidationInterface(sys.argv[1]).run()