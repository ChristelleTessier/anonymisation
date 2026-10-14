import ConfigModal from '../config/generic/ConfigModal' 
import ValidationPanel from './ValidationPanel'

function ValidationModal({ validation }) {
  return (
    <ConfigModal
      is_open={validation.is_open}
      on_close={validation.close_validation}
      modal_title="Validation du plan d'anonymisation"
    >
      <ValidationPanel
        plan={validation.plan}
        current_index={validation.current_index}
        loading={validation.loading}
        error={validation.error}
        update_fichier_decision={validation.update_fichier_decision}
        update_modif_decision={validation.update_modif_decision}
        update_modif_custom_value={validation.update_modif_custom_value}
        go_next={validation.go_next}
        go_prev={validation.go_prev}
        submit={validation.submit}
      />
    </ConfigModal>
  )
}

export default ValidationModal