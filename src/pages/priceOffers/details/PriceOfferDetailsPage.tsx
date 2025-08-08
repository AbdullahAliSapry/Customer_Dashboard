import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { ApiRepository } from '../../../Api/ApiRepository';
import { EndPoints } from '../../../Api/EndPoints';
import { StorePriceOffer, PriceOfferItem } from '../../../interfaces/StorePriceOffers';
import { IProduct } from '../../../interfaces/ProductInterface';
import {
  DetailsHeader,
  ItemsList,
  NotesSection,
  FeedbackSection,
  SummaryCard,
  DatesCard,
  ActionsCard,
  LoadingState,
  NotFoundState
} from './components';
import { setCurrentPriceOffer } from '../../../Store/StoreSlice/PriceOffersSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Store/Store';
import { setProducts } from '../../../Store/StoreSlice/ProductSlice';

const PriceOfferDetailsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { storeId, offerId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get data from Redux store
  const offer = useSelector((state: RootState) => state.priceOffers.currentPriceOffer);
  const products = useSelector((state: RootState) => state.currentStore.products.products);
  
  // Debug logging
  console.log('Current offer from Redux:', offer);
  console.log('Current products from Redux:', products);

  useEffect(() => {
    if (offerId && storeId) {
      console.log('Loading price offer details for:', { offerId, storeId });
      loadOfferDetails();
      loadProducts();
    }
  }, [offerId, storeId]);

  const loadOfferDetails = async () => {
    if (!offerId) return;
    
    const apiRepository = new ApiRepository();
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching price offer with ID:', offerId);
      await apiRepository.getById<StorePriceOffer>(
        EndPoints.priceOffer,
        offerId,
        setCurrentPriceOffer
      );
      console.log('Price offer loaded successfully');
    } catch (error) {
      console.error('Error loading offer details:', error);
      setError('Failed to load offer details');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    if (!storeId) return;
    
    const apiRepository = new ApiRepository();
    try {
      console.log('Loading products for store:', storeId);
      await apiRepository.getAll<IProduct>(
        EndPoints.products(storeId),
        setProducts
      );
      console.log('Products loaded successfully');
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const getProductName = (productId: number) => {
    const product = products.find((p: IProduct) => p.id === productId);
    return product ? product.name : `Product ${productId}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateItemTotal = (item: PriceOfferItem) => {
    const total = item.quantity * item.unitPrice;
    const discount = item.discount; // Discount is a fixed amount, not percentage
    return total - discount;
  };

  const calculateTotal = () => {
    if (!offer) return 0;
    return offer.items.reduce((total, item) => {
      return total + calculateItemTotal(item);
    }, 0);
  };

  const isExpired = () => {
    if (!offer) return false;
    return new Date(offer.expiryDate) < new Date();
  };

  const handleBack = () => {
    navigate(`/stores/${storeId}/price-offers`);
  };

  const handleEdit = () => {
    navigate(`/stores/${storeId}/price-offers/${offerId}/edit`);
  };

  // Show loading state
  if (loading) {
    return <LoadingState />;
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button
            onClick={handleBack}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {t('common.back')}
          </button>
        </div>
      </div>
    );
  }

  // Show not found state
  if (!offer) {
    return <NotFoundState onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DetailsHeader
        offer={offer}
        isRTL={isRTL}
        isExpired={isExpired()}
        onBack={handleBack}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items List */}
            <ItemsList
              offer={offer}
              isRTL={isRTL}
              getProductName={getProductName}
              calculateItemTotal={calculateItemTotal}
            />

            {/* Notes */}
            <NotesSection notes={offer.notes} isRTL={isRTL} />

            {/* Customer Feedback */}
            <FeedbackSection feedback={offer.customerFeedback} isRTL={isRTL} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Summary Card */}
            <SummaryCard
              offer={offer}
              isRTL={isRTL}
              calculateTotal={calculateTotal}
            />

            {/* Dates Card */}
            <DatesCard
              offer={offer}
              isRTL={isRTL}
              isExpired={isExpired()}
              formatDate={formatDate}
            />

            {/* Actions */}
            <ActionsCard onEdit={handleEdit} onBack={handleBack} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceOfferDetailsPage; 