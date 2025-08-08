import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ApiRepository } from "../../../Api/ApiRepository";
import { EndPoints } from "../../../Api/EndPoints";
import {
  StorePriceOffer,
  PriceOfferItem,
  PriceOfferStatus,
} from "../../../interfaces/StorePriceOffers";
import { IProduct } from "../../../interfaces/ProductInterface";
import Button from "../../../components/ui/Button";
import { Save, ArrowLeft } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../Store/Store";
import { setProducts } from "../../../Store/StoreSlice/ProductSlice";
import { addPriceOffer, setCurrentPriceOffer, updatePriceOffer } from "../../../Store/StoreSlice/PriceOffersSlice";

// Components
import {
  ExpiryDateAndNotes,
  ItemsSection,
  SummarySection,
  LoadingSpinner,
  ErrorMessage,
} from "./components";

const initialItem: PriceOfferItem = {
  id: 0,
  productId: 0,
  quantity: 1,
  unitPrice: 0,
  discount: 0,
};

const CreateOrEditPriceOfferPage: React.FC = () => {
  const { t } = useTranslation();
  const { storeId, offerId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<PriceOfferStatus>(
    PriceOfferStatus.Pending
  );
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const products = useSelector(
    (state: RootState) => state.currentStore.products.products
  );
  const dispatch = useDispatch();
  const currentOffer = useSelector((state: RootState) => state.priceOffers.currentPriceOffer);

  // Load products
  const loadProducts = async () => {
    const apiRepository = new ApiRepository();
    try {
      await apiRepository.getAll<IProduct[]>(
        EndPoints.products(storeId as string),
        setProducts
      );
    } catch (err) {
      console.error("Error loading products:", err);
      throw err;
    }
  };

  // Initialize page
  useEffect(() => {
    const initPage = async () => {
      try {
        await loadProducts();
        if (offerId) {
          setIsEdit(true);
          // If currentOffer is missing or id does not match, fetch and set in Redux
          if (!currentOffer || currentOffer.id !== offerId) {
            setLoading(true);
            const apiRepository = new ApiRepository();
            await apiRepository.getById<StorePriceOffer>(
              EndPoints.priceOffer,
              offerId,
              setCurrentPriceOffer
            );
            setLoading(false);
            return;
          }
        }
      } catch {
        setError('Failed to load data');
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    initPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offerId]);

  // Set form data when currentOffer changes
  useEffect(() => {
    if (currentOffer && isEdit) {
      setExpiryDate(
        currentOffer.expiryDate
          ? new Date(currentOffer.expiryDate).toISOString().slice(0, 10)
          : ''
      );
      setNotes(currentOffer.notes || '');
      setStatus(currentOffer.status);
    }
  }, [currentOffer, isEdit]);

  // Add new item
  const handleAddItem = () => {
    if (!currentOffer) return;
    
    const newItem: PriceOfferItem = {
      ...initialItem,
      id: Math.floor(Math.random() * 1000000),
    };
    
    const updatedOffer = {
      ...currentOffer,
      items: [...currentOffer.items, newItem]
    };
    dispatch(setCurrentPriceOffer(updatedOffer));
  };

  // Remove item
  const handleRemoveItem = (id: number) => {
    if (!currentOffer) return;
    
    const updatedOffer = {
      ...currentOffer,
      items: currentOffer.items.filter((item) => item.id !== id)
    };
    dispatch(setCurrentPriceOffer(updatedOffer));
  };

  // Handle item field changes
  const handleItemChange = (
    id: number,
    field: keyof PriceOfferItem,
    value: number | string
  ) => {
    if (!currentOffer) return;
    
    const updatedItems = currentOffer.items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Validate discount doesn't exceed unit price
        if (field === 'discount' && Number(value) > updatedItem.unitPrice) {
          updatedItem.discount = updatedItem.unitPrice;
        }
        
        // Validate discount when unit price changes
        if (field === 'unitPrice' && updatedItem.discount > Number(value)) {
          updatedItem.discount = Number(value);
        }
        
        return updatedItem;
      }
      return item;
    });
    
    const updatedOffer = {
      ...currentOffer,
      items: updatedItems
    };
    dispatch(setCurrentPriceOffer(updatedOffer));
  };

  // Calculate item total
  const calculateItemTotal = (item: PriceOfferItem) => {
    const total = item.quantity * item.unitPrice;
    return total - item.discount;
  };

  // Calculate total
  const calculateTotal = () => {
    return currentOffer?.items.reduce((total, item) => total + calculateItemTotal(item), 0) || 0;
  };

  // Calculate tax
  const calculateTax = (total: number) => {
    return total * 0.15; // 15% tax
  };

  // Calculate grand total
  const calculateGrandTotal = (total: number) => {
    return total + calculateTax(total);
  };

  // Save offer
  const handleSave = async () => {
    // Validate at least one item
    if (!currentOffer || currentOffer.items.length === 0) {
      setError(t("priceOffers.addAtLeastOneItem"));
      return;
    }

    // Validate all items have products
    const itemsWithoutProduct = currentOffer.items.filter(item => !item.productId || item.productId === 0);
    if (itemsWithoutProduct.length > 0) {
      setError(t("priceOffers.selectProductRequired"));
      return;
    }

    // Validate all fields
    const invalidItems = currentOffer.items.filter(item => 
      !item.productId || 
      item.productId === 0 || 
      item.quantity <= 0 || 
      item.unitPrice <= 0 ||
      item.discount > item.unitPrice
    );
    if (invalidItems.length > 0) {
      setError(t("priceOffers.validateAllFields"));
      return;
    }

    setSaving(true);
    setError(null);
    const apiRepository = new ApiRepository();
    console.log(currentOffer);
    
    const offerData: Partial<StorePriceOffer> = {
      id: offerId,
      storeId: Number(storeId),
      items: currentOffer.items,
      expiryDate: expiryDate ? new Date(expiryDate) : new Date(),
      notes,
      status,
    };
    
    try {
      if (isEdit && offerId) {
        await apiRepository.updatewithpatch(
          EndPoints.updatePriceOffer,
          offerData,
          updatePriceOffer
        );
      } else {
        await apiRepository.create(
          EndPoints.addPriceOffer(storeId as string),
          offerData,
          addPriceOffer,
          () => ({ type: "dummy" }),
        );
      }
      // Only navigate on success
      navigate(`/store/${storeId}/price-offers`);
    } catch (err) {
      console.error("Error saving price offer:", err);
      setError(t("priceOffers.saveError"));
      // Don't navigate on error - stay on the same page
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 py-5">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 border border-gray-100">
        {/* Header */}
        <div className="flex items-center mb-5 border-b border-gray-200 pb-3">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-3">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold text-primary-600 flex-1">
            {isEdit ? t("priceOffers.editOffer") : t("priceOffers.createOffer")}
          </h1>
        </div>

        {/* Error Message */}
        {error && <ErrorMessage message={error} />}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}>
          
          {/* Expiry Date & Notes */}
          <ExpiryDateAndNotes
            expiryDate={expiryDate}
            setExpiryDate={setExpiryDate}
            notes={notes}
            setNotes={setNotes}
          />

          {/* Items Section */}
          <ItemsSection
            items={currentOffer?.items || []}
            products={products}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onItemChange={handleItemChange}
            calculateItemTotal={calculateItemTotal}
          />

          {/* Summary Section */}
          <SummarySection
            items={currentOffer?.items || []}
            calculateTotal={calculateTotal}
            calculateTax={calculateTax}
            calculateGrandTotal={calculateGrandTotal}
          />

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Button
              leftIcon={<Save size={16} />}
              onClick={handleSave}
              isLoading={saving}
              variant="primary"
              size="md"
              className="px-6 py-2 rounded-md shadow-md">
              {t("common.save")}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              size="md"
              className="px-6 py-2 rounded-md">
              {t("common.cancel")}
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CreateOrEditPriceOfferPage; 