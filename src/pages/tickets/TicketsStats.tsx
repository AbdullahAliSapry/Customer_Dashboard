import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { ticketStatus, ticketPriority } from '../../interfaces/ticketInterface';

interface Ticket {
  id: string;
  status: ticketStatus;
  priority: ticketPriority;
}

interface TicketsStatsProps {
  tickets: Ticket[];
}

const TicketsStats: React.FC<TicketsStatsProps> = ({ tickets }) => {
  const { t } = useTranslation();

  const getTicketStats = () => {
    const stats = {
      total: tickets.length,
      open: tickets.filter(t => t.status === ticketStatus.Pending).length,
      inProgress: tickets.filter(t => t.status === ticketStatus.InProgress).length,
      highPriority: tickets.filter(t => t.priority === ticketPriority.High).length,
    };
    return stats;
  };

  const stats = getTicketStats();

  const statsData = [
    { 
      icon: <ConfirmationNumberIcon sx={{ fontSize: 32, color: '#10b981' }} />,
      value: stats.total,
      label: t('tickets.tickets'),
      color: '#10b981'
    },
    {
      icon: <PendingIcon sx={{ fontSize: 32, color: '#f59e0b' }} />,
      value: stats.open,
      label: t('tickets.open'),
      color: '#f59e0b'
    },
    {
      icon: <CheckCircleIcon sx={{ fontSize: 32, color: '#059669' }} />,
      value: stats.inProgress,
      label: t('tickets.in_progress'),
      color: '#059669'
    },
    {
      icon: <PriorityHighIcon sx={{ fontSize: 32, color: '#ef4444' }} />,
      value: stats.highPriority,
      label: t('tickets.high'),
      color: '#ef4444'
    }
  ];

  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, 
      gap: 3, 
      mb: 4 
    }}>
      <AnimatePresence>
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ 
                    p: 1.5, 
                    borderRadius: 2, 
                    backgroundColor: `${stat.color}10`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 700, 
                      color: '#1e293b',
                      fontSize: { xs: '1.8rem', md: '2.2rem' }
                    }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#64748b',
                      fontSize: '0.95rem'
                    }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </Box>
  );
};

export default TicketsStats; 