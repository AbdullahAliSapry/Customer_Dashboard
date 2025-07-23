import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ticketsApi } from '../Api/tickets';
import { Ticket } from '../interfaces/ticket';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  CircularProgress,
  Paper,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const TicketsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const data = await ticketsApi.getTickets();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return '#10b981'; // primary-500
      case 'in_progress':
        return '#f59e0b'; // secondary-500
      case 'closed':
        return '#059669'; // primary-600
      default:
        return '#6b7280'; // gray-500
    }
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'high':
        return '#ef4444'; // red-500
      case 'medium':
        return '#f59e0b'; // secondary-500
      case 'low':
        return '#10b981'; // primary-500
      default:
        return '#6b7280'; // gray-500
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: '#10b981' }} />
      </Box>
    );
  }

  return (
    <Box p={3} sx={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, backgroundColor: 'white' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h1" sx={{ 
            color: '#065f46',
            fontWeight: 600,
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}>
            {t('Tickets')}
          </Typography>
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
            }}
          >
            {t('Create New Ticket')}
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {tickets.map((ticket) => (
          <Grid item xs={12} key={ticket.id}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                },
                borderRadius: 2,
                overflow: 'hidden',
                border: '1px solid #e5e7eb',
              }}
              onClick={() => navigate(`/tickets/${ticket.id}`)}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="h6" 
                      component="h2" 
                      gutterBottom
                      sx={{ 
                        color: '#065f46',
                        fontWeight: 600,
                        fontSize: { xs: '1.1rem', md: '1.25rem' }
                      }}
                    >
                      {ticket.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      gutterBottom
                      sx={{ 
                        mb: 2,
                        color: '#4b5563',
                        lineHeight: 1.6
                      }}
                    >
                      {ticket.description}
                    </Typography>
                    <Box display="flex" gap={1} mt={1} flexWrap="wrap">
                      <Chip
                        label={t(ticket.status)}
                        sx={{
                          backgroundColor: `${getStatusColor(ticket.status)}15`,
                          color: getStatusColor(ticket.status),
                          fontWeight: 500,
                          borderRadius: 1,
                        }}
                        size="small"
                      />
                      <Chip
                        label={t(ticket.priority)}
                        sx={{
                          backgroundColor: `${getPriorityColor(ticket.priority)}15`,
                          color: getPriorityColor(ticket.priority),
                          fontWeight: 500,
                          borderRadius: 1,
                        }}
                        size="small"
                      />
                    </Box>
                  </Box>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#6b7280',
                      ml: isRTL ? 0 : 2,
                      mr: isRTL ? 2 : 0,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {format(new Date(ticket.createdAt), 'PPp', { locale: ar })}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TicketsPage; 