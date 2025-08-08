/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { ApiManager } from '../../Api/ApiRepository';
import { EndPoints } from '../../Api/EndPoints';
import { StorePriceOffer, PriceOfferStatus } from '../../interfaces/StorePriceOffers';
import { setPriceOffers, deletePriceOffer } from '../../Store/StoreSlice/PriceOffersSlice';
import { RootState } from '../../Store/Store';
import PriceOfferModal from '../../components/forms/modals/PriceOfferModal';
import {
  StatsCards,
  SearchAndFilters,
  OffersTable,
  PageHeader
} from './components';

const PriceOffersPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<StorePriceOffer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const priceOffers = useSelector((state: RootState) => state.priceOffers.priceOffers);
  const { storeId } = useParams();

  useEffect(() => {
    const apiRepository = ApiManager.getApiRepository();
    apiRepository.getAll<StorePriceOffer>(
      EndPoints.GetPriceOffers(storeId as string),
      setPriceOffers
    );
  }, [storeId]);

  const handleEdit = (offer: StorePriceOffer) => {
    setSelectedOffer(offer);
    // navigate to the edit page
    navigate(`/store/${storeId}/price-offers/${offer.id}/edit`);
  };

  const handleDelete = async (offerId: string) => {
    const apiRepository = ApiManager.getApiRepository();
    try {
      await apiRepository.delete(EndPoints.priceOffer, offerId, deletePriceOffer);
    } catch (error) {
      console.error('Error deleting price offer:', error);
    }
  };

  const handleAddNew = () => {
    setSelectedOffer(null);
    // navigate to the new create page
    navigate(`/store/${storeId}/price-offers/create`);
  };

  const handleViewDetails = (offerId: string) => {
    navigate(`/store/${storeId}/price-offers/${offerId}`);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateTotal = (items: any[]) => {
    return items.reduce((total, item) => {
      const itemTotal = item.quantity * item.unitPrice;
      const discount = item.discount; 
      return total + (itemTotal - discount);
    }, 0);
  };

  const filteredOffers = priceOffers.filter(offer => 
    offer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: priceOffers.length,
    pending: priceOffers.filter(o => o.status === PriceOfferStatus.Pending).length,
    accepted: priceOffers.filter(o => o.status === PriceOfferStatus.Accepted).length,
    totalValue: priceOffers.reduce((sum, offer) => sum + calculateTotal(offer.items), 0)
  };

  const handleFilter = () => {
    // TODO: Implement filter functionality
    console.log('Filter clicked');
  };

  const handleAnalytics = () => {
    // TODO: Implement analytics functionality
    console.log('Analytics clicked');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <PageHeader onCreateNew={handleAddNew} onFilter={handleFilter} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Search and Filters */}
        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onFilter={handleFilter}
          onAnalytics={handleAnalytics}
        />

        {/* Offers Table */}
        <OffersTable
          offers={filteredOffers}
          isRTL={isRTL}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreateNew={handleAddNew}
          formatDate={formatDate}
          calculateTotal={calculateTotal}
        />
      </div>

      {isModalOpen && (
        <PriceOfferModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          offer={selectedOffer}
          storeId={storeId as string}
        />
      )}
    </div>
  );
};

export default PriceOffersPage; 