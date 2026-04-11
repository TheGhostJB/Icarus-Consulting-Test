import {Modal} from "@heroui/react";
import React from "react";

interface ModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title?: React.ReactNode;
    footer?: React.ReactNode;
    children: React.ReactNode;
}

export const ModalComp = (props: ModalProps) => {
    const { isOpen, onOpenChange, title, footer, children } = props;

    return (
    <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Backdrop>
            <Modal.Container>
                <Modal.Dialog>
                <Modal.CloseTrigger /> 
                {title && (
                    <Modal.Header>
                        <Modal.Heading>{title} </Modal.Heading>
                    </Modal.Header>)}
                <Modal.Body>
                    {children}
                </Modal.Body>
                {(
                    <Modal.Footer>
                    {footer}
                </Modal.Footer>)
                }
                </Modal.Dialog>
            </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    </> 
    )
}
