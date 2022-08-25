import { ReactElement } from 'react'
import './modal.scss'

export interface ModalProps {
    active?: boolean
    body?: ReactElement
    title?: string
    onClose?: () => void
}

export const Modal = ({
    active = true,
    body = <>Lorem Ipsum</>,
    title = 'Modal title',
    onClose,
    ...props
}: ModalProps) => {
    return (
        <div className={active ? 'modal is-active' : 'modal'}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">{title}</p>
                    <button
                        className="delete"
                        aria-label="close"
                        onClick={onClose}
                    ></button>
                </header>
                <section className="modal-card-body">{body}</section>
                <footer className="modal-card-foot"></footer>
            </div>
        </div>
    )
}
