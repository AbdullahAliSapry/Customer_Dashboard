import { useEffect, useRef } from "react";

const Modal = ({
    children,
    setIsOpen
}: {
    children: React.ReactNode,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        // Add event listener to the document body
        document.addEventListener('mousedown', handleClickOutside);

        // Prevent scrolling when modal is open
        document.body.style.overflow = 'hidden';

        return () => {
            // Clean up
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [setIsOpen]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
            <div 
                ref={modalRef} 
                className="w-full max-w-4xl bg-white rounded-lg shadow-xl my-8 mx-4"
                style={{ maxHeight: "90vh", overflowY: "auto" }}
            >
                {children}
            </div>
        </div>
    );
};

export default Modal;
