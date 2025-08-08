import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import { format } from 'date-fns';
  import { ar } from 'date-fns/locale';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { Ticket, ticketStatus, ticketPriority } from '../../interfaces/ticketInterface';

interface TicketCardProps {
  ticket: Ticket;
  index: number;
  isRTL: boolean;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, index, isRTL }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getStatusColor = (status: ticketStatus) => {
    switch (status) {
      case ticketStatus.Pending:
        return '#10b981';
      case ticketStatus.InProgress:
        return '#f59e0b';
      case ticketStatus.Closed:
        return '#059669';
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = (priority: ticketPriority) => {
    switch (priority) {
      case ticketPriority.High:
        return '#ef4444';
      case ticketPriority.Medium:
        return '#f59e0b';
      case ticketPriority.Low:
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: ticketStatus): string => {
    switch (status) {
      case ticketStatus.Pending:
        return t('tickets.open');
      case ticketStatus.InProgress:
        return t('tickets.in_progress');
      case ticketStatus.Closed:
        return t('tickets.closed');
      default:
        return '';
    }
  };

  const getPriorityText = (priority: ticketPriority): string => {
    switch (priority) {
      case ticketPriority.High:
        return t('tickets.high');
      case ticketPriority.Medium:
        return t('tickets.medium');
      case ticketPriority.Low:
        return t('tickets.low');
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
    >
      <Card
        sx={{
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
          },
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          backgroundColor: 'white',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        }}
        onClick={() => navigate(`/tickets/${ticket.id}`)}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexDirection={isRTL ? 'row-reverse' : 'row'}>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h6" 
                component="h2" 
                gutterBottom
                sx={{ 
                  color: '#1e293b',
                  fontWeight: 600,
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  textAlign: isRTL ? 'right' : 'left',
                  mb: 1
                }}
              >
                {ticket.title}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 2,
                  color: '#64748b',
                  lineHeight: 1.6,
                  textAlign: isRTL ? 'right' : 'left'
                }}
              >
                {ticket.description}
              </Typography>
              <Box display="flex" gap={1} mt={2} flexWrap="wrap" flexDirection={isRTL ? 'row-reverse' : 'row'} alignItems="center">
                <Chip
                  icon={<AccessTimeIcon sx={{ fontSize: 16, color: '#64748b' }} />}
                  label={format(new Date(ticket.createdAt), 'PPp', { locale: isRTL ? ar : undefined })}
                  size="small"
                  sx={{
                    backgroundColor: '#f1f5f9',
                    color: '#64748b',
                    fontWeight: 500,
                    borderRadius: 1,
                    border: '1px solid #e2e8f0',
                  }}
                />
                <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: '#e2e8f0' }} />
                <Chip
                  label={getStatusText(ticket.status)}
                  sx={{
                    backgroundColor: `${getStatusColor(ticket.status)}10`,
                    color: getStatusColor(ticket.status),
                    fontWeight: 500,
                    borderRadius: 1,
                    border: `1px solid ${getStatusColor(ticket.status)}20`,
                  }}
                  size="small"
                />
                <Chip
                  label={getPriorityText(ticket.priority)}
                  sx={{
                    backgroundColor: `${getPriorityColor(ticket.priority)}10`,
                    color: getPriorityColor(ticket.priority),
                    fontWeight: 500,
                    borderRadius: 1,
                    border: `1px solid ${getPriorityColor(ticket.priority)}20`,
                  }}
                  size="small"
                />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TicketCard; 