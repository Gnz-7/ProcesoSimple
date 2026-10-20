// Diálogo de confirmación accesible (no se usa window.confirm).
export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmLabel = 'Eliminar' }) {
  if (!open) return null

  return (
    <div className="dialog-overlay">
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        data-testid="confirm-dialog"
      >
        <h2 id="dialog-title">{title}</h2>
        <p>{message}</p>
        <div className="dialog-actions">
          <button type="button" onClick={onCancel} data-testid="confirm-cancel">
            Cancelar
          </button>
          <button type="button" className="danger" onClick={onConfirm} data-testid="confirm-accept">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
