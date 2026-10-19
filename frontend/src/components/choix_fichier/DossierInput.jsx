function DossierInput({
  folder_path,       // Chaîne : chemin du dossier saisi par l'utilisateur (affiché dans l'input)
  set_folder_path,   // Fonction : met à jour folder_path à chaque frappe dans l'input
  action = "anonymiser", // Chaîne : libellé du mode d'action (par défaut "anonymiser")
                          // → "désanonymiser" quand passé par Desanonymization [3]
                          // Sert à personnaliser le libellé affiché dans le label
  plan_path,         // Chaîne (ou undefined) : chemin du plan d'anonymisation (.json)
                      // → seulement passé par Desanonymization [3], pas par Anonymisation [1]
                      // Si undefined : le second champ n'est PAS affiché
  set_plan_path,     // Fonction : met à jour plan_path à chaque frappe dans le second input
                      // → seulement passé par Desanonymization [3]
}) {
  return (
    <div className="folder_input_group">

      {/* Champ 1 : chemin du dossier (toujours affiché) */}
      <label className="folder_input_label">
        Chemin du dossier à {action} :
      </label>
      <input
        type="text"
        className="folder_input"
        placeholder="Ex. : C:\Users\Documents\MonDossier"
        value={folder_path}
        onChange={(e) => set_folder_path(e.target.value)}
        // À chaque frappe, met à jour folder_path dans le parent
      />


      {/* Champ 2 : chemin du plan JSON (affiché uniquement en mode désanonymisation) */}
      {/* Condition : si plan_path n'est pas undefined → le parent est Desanonymization */}
      {/*             si plan_path est undefined       → le parent est Anonymisation   */}
      {plan_path !== undefined && (
        <>
          <label className="folder_input_label">
            Chemin du plan d'anonymisation (.json) :
          </label>
          <input
            type="text"
            className="folder_input"
            placeholder="Ex. : C:\Users\Documents\validated_change_plan.json"
            value={plan_path}
            onChange={(e) => set_plan_path(e.target.value)}
            // À chaque frappe, met à jour plan_path dans le parent (App.jsx)
          />
        </>
      )}
    </div>
  )
}


export default DossierInput