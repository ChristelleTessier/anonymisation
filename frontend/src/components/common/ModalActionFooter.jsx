function ModalActionFooter({
  has_changes = false,
  on_confirm,
  on_cancel,
  confirm_label = 'Valider',
  cancel_label = 'Annuler'
}) {
  return (
    <>
      {/* Ligne horizontale de séparation */}
      <hr className="modal_divider" />

      {/* Barre d'actions globale */}
      <div className="modal_footer_actions">
        <button
          type="button"
          className={`action_btn global_validate_btn ${
            has_changes ? 'active' : 'disabled'
          }`}
          onClick={on_confirm}
          disabled={!has_changes}
        >
          {confirm_label}
        </button>
        <button
          type="button"
          className="action_btn global_cancel_btn active"
          onClick={on_cancel}
        >
          {cancel_label}
        </button>
      </div>
    </>
  )
}

export default ModalActionFooter
