import { useEffect } from 'react'
import PropTypes from 'prop-types'

const AUTO_HIDE_MS = 4000

function Toast(props) {
  if (import.meta.env.DEV) {
    PropTypes.checkPropTypes(Toast.propTypes, props, 'prop', 'Toast')
  }

  const { message, variant = 'danger', onDismiss } = props

  useEffect(() => {
    const timer = setTimeout(onDismiss, AUTO_HIDE_MS)
    return () => clearTimeout(timer)
  }, [message, onDismiss])

  return (
    <div
      className={`toast show position-fixed top-0 end-0 m-3 text-bg-${variant}`}
      role="status"
      aria-live="polite"
    >
      <div className="d-flex">
        <div className="toast-body">{message}</div>
        <button
          type="button"
          className="btn-close btn-close-white me-2 m-auto"
          aria-label="Закрыть"
          onClick={onDismiss}
        />
      </div>
    </div>
  )
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['primary', 'danger', 'warning']),
  onDismiss: PropTypes.func.isRequired,
}

export default Toast
