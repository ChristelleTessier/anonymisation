function ListActionToolbar({
  on_start_add,
  on_start_delete,
  can_delete = true,
  add_label = '+ Ajouter',
  delete_label = '- Supprimer'
}) {
  return (
    <div className="group_actions">
      <button
        type="button"
        className="action_btn add_item_btn"
        onClick={on_start_add}
      >
        {add_label}
      </button>
      <button
        type="button"
        className="action_btn remove_item_btn"
        onClick={on_start_delete}
        disabled={!can_delete}
      >
        {delete_label}
      </button>
    </div>
  )
}

export default ListActionToolbar
