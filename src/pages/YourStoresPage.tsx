

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Loader } from 'lucide-react';
import { StoreCard } from '../components/stores/StoreCard';
import { cn } from '../utils/cn';
import { useSelector } from 'react-redux';
import { RootState } from '../Store/Store';
import { ApiRepository } from '../Api/ApiRepository';
import { SetStores } from '../Store/DashBoardSlice/StoresSlice';
import { EndPoints } from '../Api/EndPoints';
import { useTranslation } from 'react-i18next';

// Extended interface for API response which includes additional fields
interface IStoreData {
  id: number;
  dominName: string;
  phoneContact: string;
  emailContact: string;
  businessType: number;
  typeStore: number; // ADD THIS LINE
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  font: string;
  templateId: number;
  ownerId: number;
  logo: string | null;
  imageLogo: {
    id?: number;
    name?: string;
    path?: string;
    contentType?: string;
  } | null;
  socialMediaLinks: {
    id?: number;
    platform?: string;
    url?: string;
  }[];
  templateDatas: unknown;
}

const YourStores = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const ownerid = useSelector((state: RootState) => state.customer.customerData?.id);
  const stores = useSelector((state: RootState) => state.Dashboard.stores.stores as IStoreData[]);
  const [loading, setLoading] = useState(true);
  const apiRepository = new ApiRepository();

  useEffect(() => {
    const fetchStores = async () => {
      if (!ownerid) return;
      
      setLoading(true);
      try {
        await apiRepository.getAll(
          EndPoints.storebyownerid(ownerid.toString()),
          SetStores
        );
      } catch (error) {
        console.error(t('stores.error_fetching_stores'), error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [ownerid, t]);

  // Map business type to display name
  const getBusinessTypeName = (type: number): string => {
    switch (type) {
      case 0: return t('stores.business_types.ecommerce');
      case 1: return t('stores.business_types.restaurant');
      case 2: return t('stores.business_types.cafe');
      case 3: return t('stores.business_types.ecommerce');
      case 4: return t('stores.business_types.event');
      case 5: return t('stores.business_types.consulting');
      case 6: return t('stores.business_types.service');
      case 7: return t('stores.business_types.other');
      default: return t('stores.business_types.business');
    }
  };

  // Map store type to display name
  const getStoreTypeName = (typeStore: number | undefined): string => {
    if (typeStore === 0) return t('stores.type.products');
    if (typeStore === 1) return t('stores.type.services');
    return t('stores.type.unknown');
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('stores.stores')}</h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create Store Card */}
            <div
              onClick={() => navigate('/storeCreation')}
              className={cn(
                "bg-white rounded-lg shadow-sm p-6 cursor-pointer",
                "transition-all duration-200 hover:shadow-md",
                "border border-gray-100 border-dashed",
                "flex flex-col items-center justify-center min-h-[200px]",
                "hover:border-primary-300 hover:bg-primary-50/50"
              )}
            >
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('stores.create_new_store')}</h3>
              <p className="text-sm text-gray-500 text-center">
                {t('stores.create_new_store_description')}
              </p>
            </div>

            {/* Store Cards */}
            {stores && stores.map((store) => (
              <StoreCard
                key={store.id}
                id={store.id.toString()}
                name={store.dominName}
                location={getBusinessTypeName(store.businessType)}
                productsCount={0} // We'll need an API call to get this info
                status={"active"} // This should come from the API eventually
                primaryColor={store.primaryColor}
                storeType={getStoreTypeName(store.typeStore)} // NEW
              />
            ))}
          </div>
        )}

        {!loading && (!stores || stores.length === 0) && (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('stores.no_stores_found')}
              </h3>
              <p className="text-gray-500 mb-6">
                {t('stores.no_stores_description')}
              </p>
              <button
                onClick={() => navigate('/storeCreation')}
                className={`
                  inline-flex items-center gap-2 px-4 py-2
                  bg-primary-600 text-white rounded-lg
                  hover:bg-primary-700 transition-colors
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                `}
              >
                <Plus className="w-5 h-5" />
                <span>{t('stores.create_store')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YourStores;