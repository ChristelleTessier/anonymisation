function ContentInput({ filename, set_filename, content, set_content }) {
  return (
    <div className="content_input_group">
      <label className="folder_input_label">Nom du fichier (optionnel) :</label>
      <input
        type="text"
        className="folder_input"
        placeholder="Ex. : rapport.txt"
        value={filename}
        onChange={(e) => set_filename(e.target.value)}
      />

      <label className="folder_input_label">Contenu à anonymiser :</label>
      <textarea
        className="content_textarea"
        placeholder="Collez ici le contenu du fichier à anonymiser..."
        value={content}
        onChange={(e) => set_content(e.target.value)}
        rows={10}
      />
    </div>
  )
}

export default ContentInput