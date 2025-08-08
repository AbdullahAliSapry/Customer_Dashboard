import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from '@mui/material';
import { Ticket } from '../../interfaces/ticketInterface';
import TicketCard from './TicketCard';

interface TicketsListProps {
  tickets: Ticket[];
  isRTL: boolean;
}

const TicketsList: React.FC<TicketsListProps> = ({ tickets, isRTL }) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <AnimatePresence>
        {tickets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              py: 8,
              flexDirection: 'column',
              gap: 2
            }}>
              <Box sx={{ 
                fontSize: 64, 
                color: '#64748b',
                opacity: 0.5
              }}>
                🎫
              </Box>
              <Box sx={{ 
                textAlign: 'center',
                color: '#64748b'
              }}>
                <Box sx={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 600, 
                  mb: 1 
                }}>
                  {t('tickets.no_tickets')}
                </Box>
                <Box sx={{ fontSize: '1rem' }}>
                  {t('tickets.no_tickets_description')}
                </Box>
              </Box>
            </Box>
          </motion.div>
        ) : (
          tickets.map((ticket, index) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              index={index}
              isRTL={isRTL}
            />
          ))
        )}
      </AnimatePresence>
    </Box>
  );
};

export default TicketsList; 