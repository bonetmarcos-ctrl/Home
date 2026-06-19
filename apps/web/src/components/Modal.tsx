import { X } from "lucide-react";
import type { ReactNode } from "react";

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose(): void;
}

export function Modal({ title, children, onClose }: ModalProps) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <header>
          <h2>{title}</h2>
          <button className="icon-button" onClick={onClose} title="Cerrar" type="button">
            <X size={18} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}