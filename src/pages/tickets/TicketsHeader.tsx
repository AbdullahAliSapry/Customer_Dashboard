import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Box,
  Button,
  Typography,
  Tooltip,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

interface TicketsHeaderProps {
  onRefresh: () => void;
}

const TicketsHeader: React.FC<TicketsHeaderProps> = ({ onRefresh }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Box
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" component="h1" sx={{ 
              color: '#1e293b',
              fontWeight: 700,
              fontSize: { xs: '1.5rem', md: '2rem' },
              mb: 1
            }}>
              {t('tickets.tickets')}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              {t('tickets.manage_tickets')}
            </Typography>
          </Box>
          <Box display="flex" gap={2}>
            <Tooltip title={t('common.refresh')} placement="top">
              <IconButton 
                onClick={onRefresh}
                sx={{ 
                  backgroundColor: '#f1f5f9',
                  '&:hover': {
                    backgroundColor: '#e2e8f0',
                  }
                }}
              >
                <RefreshIcon sx={{ color: '#64748b' }} />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/tickets/create')}
              sx={{
                backgroundColor: '#10b981',
                '&:hover': {
                  backgroundColor: '#059669',
                },
                borderRadius: 2,
                px: 3,
                py: 1,
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
              }}
            >
              {t('tickets.create_new_ticket')}
            </Button>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default TicketsHeader; 