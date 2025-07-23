import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ticketsApi } from '../Api/tickets';
import { Ticket, TicketMessage } from '../interfaces/ticket';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const TicketDetailsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isRTL = i18n.language === 'ar';
  
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (ticketId) {
      fetchTicketAndMessages();
    }
  }, [ticketId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchTicketAndMessages = async () => {
    try {
      const [ticketData, messagesData] = await Promise.all([
        ticketsApi.getTicket(ticketId!),
        ticketsApi.getTicketMessages(ticketId!),
      ]);
      setTicket(ticketData);
      setMessages(messagesData);
    } catch (error) {
      console.error('Error fetching ticket details:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files);
      setSelectedImages(prev => [...prev, ...newImages]);
      
      // Create preview URLs
      const newPreviewUrls = newImages.map(file => URL.createObjectURL(file));
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && selectedImages.length === 0) || !ticketId) return;

    setSending(true);
    try {
      const message = await ticketsApi.sendMessage({
        ticketId,
        message: newMessage.trim(),
      });
      setMessages((prev) => [...prev, message]);
      setNewMessage('');
      setSelectedImages([]);
      setImagePreviewUrls([]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return 'bg-emerald-500';
      case 'in_progress':
        return 'bg-amber-500';
      case 'closed':
        return 'bg-emerald-600';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-amber-500';
      case 'low':
        return 'bg-emerald-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-3">
        <p className="text-red-500 text-lg">{t('Ticket not found')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-3">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/tickets')}
          className={`p-2 text-emerald-700 hover:bg-emerald-50 rounded-full transition-colors ${isRTL ? 'ml-2' : 'mr-2'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-emerald-700 mb-2">{ticket.title}</h1>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusColor(ticket.status)}`}>
              {t(ticket.status)}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getPriorityColor(ticket.priority)}`}>
              {t(ticket.priority)}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-gray-50 p-6 mb-6 rounded-lg border border-gray-200">
        <p className="text-gray-600 leading-relaxed">{ticket.description}</p>
        <p className="text-sm text-gray-500 mt-4">
          {t('Created')}: {format(new Date(ticket.createdAt), 'PPp', { locale: ar })}
        </p>
      </div>

      {/* Messages */}
      <div className="h-[500px] flex flex-col rounded-lg border border-gray-200 overflow-hidden bg-white">
        <div className="flex-1 overflow-auto p-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderType === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div className={`max-w-[70%] p-4 rounded-lg ${
                message.senderType === 'user' 
                  ? 'bg-emerald-50 border border-emerald-100' 
                  : 'bg-white border border-gray-200'
              }`}>
                <p className="text-emerald-700 mb-2">{message.message}</p>
                {message.images && message.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {message.images.map((image, index) => (
                      <div 
                        key={index}
                        className="relative group cursor-pointer"
                        onClick={() => handleImageClick(image)}
                      >
                        <img
                          src={image}
                          alt={`Attachment ${index + 1}`}
                          className="w-full h-28 object-cover rounded-lg"
                        />
                        <div className="absolute top-2 right-2 bg-white/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m4-3H6" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  {format(new Date(message.createdAt), 'PPp', { locale: ar })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          {selectedImages.length > 0 && (
            <div className="mb-4 p-2 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-4 gap-2">
                {imagePreviewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg cursor-pointer"
                      onClick={() => handleImageClick(url)}
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              multiple
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t('Type your message...')}
              disabled={ticket.status === 'closed'}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
            />
            <button
              type="submit"
              disabled={(!newMessage.trim() && selectedImages.length === 0) || sending || ticket.status === 'closed'}
              className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {sending ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
              {t('Send')}
            </button>
          </form>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={handleCloseModal}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <button
              onClick={handleCloseModal}
              className="absolute -top-10 -right-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetailsPage; 