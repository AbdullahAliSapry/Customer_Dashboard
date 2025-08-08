import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Plus, Trash2, Calendar } from 'lucide-react';
import { StorePriceOffer, PriceOfferStatus, PriceOfferItem } from '../../../interfaces/StorePriceOffers';
import { ApiRepository } from '../../../Api/ApiRepository';
import { EndPoints } from '../../../Api/EndPoints';
import { addPriceOffer, updatePriceOffer } from '../../../Store/StoreSlice/PriceOffersSlice';
import { useDispatch } from 'react-redux';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import { IProduct } from '../../../interfaces/ProductInterface';

interface PriceOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: StorePriceOffer | null;
  storeId: string;
}

const PriceOfferModal: React.FC<PriceOfferModalProps> = ({
  isOpen,
  onClose,
  offer,
  storeId
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [formData, setFormData] = useState<Partial<StorePriceOffer>>({
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    notes: '',
    customerFeedback: '',
    items: []
  });

  useEffect(() => {
    if (isOpen) {
      loadProducts();
      if (offer) {
        setFormData({
          ...offer,
          expiryDate: new Date(offer.expiryDate)
        });
      } else {
        setFormData({
          expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          notes: '',
          customerFeedback: '',
          items: []
        });
      }
    }
  }, [isOpen, offer]);

  const loadProducts = async () => {
    const apiRepository = new ApiRepository();
    try {
      const response = await apiRepository.getAll<IProduct>(EndPoints.products(storeId));
      setProducts(response);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addItem = () => {
    const newItem: PriceOfferItem = {
      id: Date.now(),
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      productId: 0
    };
    setFormData(prev => ({
      ...prev,
      items: [...(prev.items || []), newItem]
    }));
  };

  const removeItem = (itemId: number) => {
    setFormData(prev => ({
      ...prev,
      items: (prev.items || []).filter(item => item.id !== itemId)
    }));
  };

  const updateItem = (itemId: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: (prev.items || []).map(item =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    }));
  };

  const getProductName = (productId: number) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : '';
  };

  const calculateItemTotal = (item: PriceOfferItem) => {
    const total = item.quantity * item.unitPrice;
    const discount = (total * item.discount) / 100;
    return total - discount;
  };

  const calculateTotal = () => {
    return (formData.items || []).reduce((total, item) => {
      return total + calculateItemTotal(item);
    }, 0);
  };

  const handleSubmit = async () => {
    const apiRepository = new ApiRepository();
    try {
      if (offer) {
        // Update existing offer
        const updatedOffer = { ...formData, id: offer.id };
        await apiRepository.update(EndPoints.priceOffer, updatedOffer, updatePriceOffer);
      } else {
        // Create new offer
        const newOffer = {
          ...formData,
          id: Date.now().toString(),
          createdAt: new Date(),
          status: PriceOfferStatus.Pending
        };
        await apiRepository.create(EndPoints.priceOffers(storeId), newOffer, addPriceOffer);
      }
      onClose();
    } catch (error) {
      console.error('Error saving price offer:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-6xl max-h-[92vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold text-primary-600">
            {offer ? t('priceOffers.editOffer') : t('priceOffers.createOffer')}
          </h2>
          <Button
            variant="ghost"
            onClick={onClose}
            leftIcon={<X size={20} />}
          />
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('priceOffers.expiryDate')}
              </label>
              <Input
                type="date"
                value={formData.expiryDate ? new Date(formData.expiryDate).toISOString().split('T')[0] : ''}
                onChange={(e) => handleInputChange('expiryDate', new Date(e.target.value))}
                leftIcon={<Calendar size={16} />}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('priceOffers.notes')}
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
              rows={4}
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder={t('priceOffers.notesPlaceholder')}
            />
          </div>

          {/* Items Section */}
          <div>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-semibold text-primary-600">{t('priceOffers.items')}</h3>
              <Button
                leftIcon={<Plus size={16} />}
                onClick={addItem}
                variant="primary"
                size="md"
              >
                {t('priceOffers.addItem')}
              </Button>
            </div>

            <div className="space-y-4">
              {(formData.items || []).map((item, index) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-5 bg-gray-50 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-primary-600 text-lg">{t('priceOffers.item')} #{index + 1}</h4>
                    <Button
                      variant="ghost"
                      onClick={() => removeItem(item.id)}
                      leftIcon={<Trash2 size={16} />}
                      className="text-red-600 hover:text-red-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('priceOffers.product')}
                      </label>
                      <Select
                        value={item.productId.toString()}
                        onChange={(e) => updateItem(item.id, 'productId', parseInt(e.target.value))}
                      >
                        <option value="">{t('priceOffers.selectProduct')}</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('priceOffers.quantity')}
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('priceOffers.unitPrice')}
                      </label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('priceOffers.discount')} (%)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={item.discount}
                        onChange={(e) => updateItem(item.id, 'discount', parseFloat(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="mt-4 text-right">
                    <span className="text-sm font-medium bg-primary-50 text-primary-700 py-2 px-3 rounded-md">
                      {t('priceOffers.itemTotal')}: {calculateItemTotal(item).toFixed(2)} {t('common.currency')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
              <span className="text-xl font-medium text-gray-900">{t('priceOffers.total')}:</span>
              <span className="text-2xl font-bold text-primary-600">
                {calculateTotal().toFixed(2)} {t('common.currency')}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-5 pt-6">
            <Button
              variant="outline"
              onClick={onClose}
              size="lg"
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.items || formData.items.length === 0}
              variant="primary"
              size="lg"
            >
              {offer ? t('common.update') : t('common.create')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceOfferModal; 