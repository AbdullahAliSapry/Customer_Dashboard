import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

    // Animation variants
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: {
                duration: 0.3,
                ease: "easeOut" as const
            }
        },
        exit: { 
            opacity: 0,
            transition: {
                duration: 0.2,
                ease: "easeIn" as const
            }
        }
    };

    const modalVariants = {
        hidden: { 
            opacity: 0,
            scale: 0.8,
            y: 50
        },
        visible: { 
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut" as const,
                delay: 0.1
            }
        },
        exit: { 
            opacity: 0,
            scale: 0.8,
            y: 50,
            transition: {
                duration: 0.2,
                ease: "easeIn" as const
            }
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto backdrop-blur-sm"
            >
                <motion.div 
                    ref={modalRef} 
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="w-full max-w-4xl bg-white rounded-lg shadow-xl my-8 mx-4"
                    style={{ maxHeight: "90vh", overflowY: "auto" }}
                >
                    {children}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Modal;
