import { useState } from 'react'

function VariableManager({ variable_list, set_variable_list }) {
  const [variable_input, set_variable_input] = useState('')

  const handle_add_variable = () => {
    const trimmed_value = variable_input.trim()
    if (!trimmed_value) return

    if (!variable_list.includes(trimmed_value)) {
      set_variable_list([...variable_list, trimmed_value])
    }
    set_variable_input('')
  }

  return (
    <section className="variables_section">
      <h2 className="sub_title">Ajouter des variables d'anonymisation</h2>

      <input
        type="text"
        className="variable_input"
        placeholder="Saisissez une variable..."
        value={variable_input}
        onChange={(e) => set_variable_input(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handle_add_variable()}
      />

      <button
        className="add_button"
        onClick={handle_add_variable}
        disabled={!variable_input.trim()}
      >
        Ajouter
      </button>

      {variable_list.length > 0 && (
        <div className="variables_list">
          {variable_list.map((item, index) => (
            <span key={index} className="variable_badge">
              {item}
            </span>
          ))}
        </div>
      )}
    </section>
  )
}

export default VariableManager
