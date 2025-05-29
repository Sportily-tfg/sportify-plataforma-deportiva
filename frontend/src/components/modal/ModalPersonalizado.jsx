import React, { useEffect } from "react";
import PropTypes from "prop-types";
import "../../styles/ModalPersonalizado.css";

const ModalPersonalizado = ({
  isOpen,
  onClose,
  title,
  message,
  type,
  onConfirm,
  confirmText,
  cancelText,
  children,
}) => {
  // Efecto para cerrar automáticamente modales de tipo success después de 2 segundos
  useEffect(() => {
    if (isOpen && type === "success") {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); // 2000ms = 2 segundos

      return () => clearTimeout(timer); // limpiar timer si se desmonta o cambia isOpen
    }
  }, [isOpen, type, onClose]);

  if (!isOpen) return null;

  const modalTypeClass = type ? `modal-${type}` : "";

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${modalTypeClass}`}>
        <div className="modal-header">
          {type && (
            <div className="modal-icon">
              {type === "success" && "✓"}
              {type === "error" && "✕"}
              {type === "warning" && "⚠"}
              {type === "info" && "i"}
            </div>
          )}
          <h2>{title}</h2>
        </div>

        <div className="modal-body">
          {message && <p>{message}</p>}
          {children}
        </div>

        <div className="modal-buttons">
          {onConfirm ? (
            <>
              <button onClick={onConfirm} className="modal-confirm-btn">
                {confirmText || "Confirmar"}
              </button>
              <button onClick={onClose} className="modal-cancel-btn">
                {cancelText || "Cancelar"}
              </button>
            </>
          ) : (
            type !== "success" && (
              <button onClick={onClose} className="modal-cancel-btn">
                {cancelText || "Cerrar"}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

ModalPersonalizado.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string,
  type: PropTypes.oneOf(["success", "error", "warning", "info"]),
  onConfirm: PropTypes.func,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  children: PropTypes.node,
};

ModalPersonalizado.defaultProps = {
  type: "info",
};

export default ModalPersonalizado;
