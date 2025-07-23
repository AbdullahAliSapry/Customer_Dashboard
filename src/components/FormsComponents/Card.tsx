import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  title: ReactNode;
  children: ReactNode;
  className?: string;
}

const Card = ({ title, children, className = '' }: CardProps) => {
  return (
    <motion.div
      className={`card p-6 ${className}`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <h3 className="text-lg font-medium text-neutral-800 mb-4">{title}</h3>
      {children}
    </motion.div>
  );
};

export default Card;