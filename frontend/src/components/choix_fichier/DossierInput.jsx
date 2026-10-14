function DossierInput({ folder_path, set_folder_path }) {
  return (
    <div className="folder_input_group">
      <label className="folder_input_label">Chemin du dossier à anonymiser :</label>
      <input
        type="text"
        className="folder_input"
        placeholder="Ex. : C:\Users\Documents\MonDossier"
        value={folder_path}
        onChange={(e) => set_folder_path(e.target.value)}
      />
    </div>
  )
}

export default DossierInput