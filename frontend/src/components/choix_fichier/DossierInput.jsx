function DossierInput({
  folder_path,
  set_folder_path,
  action = "anonymiser",
  plan_path,
  set_plan_path,
}) {
  return (
    <div className="folder_input_group">
      <label className="folder_input_label">
        Chemin du dossier à {action} :
      </label>
      <input
        type="text"
        className="folder_input"
        placeholder="Ex. : C:\Users\Documents\MonDossier"
        value={folder_path}
        onChange={(e) => set_folder_path(e.target.value)}
      />

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
          />
        </>
      )}
    </div>
  )
}

export default DossierInput