import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../Store/Store';
import { ApiRepository } from '../Api/ApiRepository';
import { EndPoints } from '../Api/EndPoints';
import { SetCurrentStore } from '../Store/DashBoardSlice/StoresSlice';
import { IStoreData } from '../interfaces/StoreInterface';
import { useTranslation } from 'react-i18next';
import { Loader } from 'lucide-react';

interface ProtectedStoreRouteProps {
  children: React.ReactNode;
}

const ProtectedStoreRoute: React.FC<ProtectedStoreRouteProps> = ({ children }) => {
  const { t } = useTranslation();
  const { storeId } = useParams();
  const [loading, setLoading] = useState(true);
  const [storeData, setStoreData] = useState<IStoreData | null>(null);

  // Get the current store from Redux state
  const currentStore = useSelector((state: RootState) => 
    state.Dashboard.stores.currentStore as IStoreData | null
  );

  useEffect(() => {
    const checkStoreAccess = async () => {
      if (!storeId) {
        setLoading(false);
        return;
      }

      try {
        // If we don't have store data or it's a different store, fetch it
        if (!currentStore || currentStore.id.toString() !== storeId) {
          const apiRepository = new ApiRepository();
          await apiRepository.getAll(
            EndPoints.store(storeId),
            SetCurrentStore
          );
          // The store data will be updated in Redux, so we'll check it in the next render
        } else {
          setStoreData(currentStore);
        }
      } catch (error) {
        console.error('Error checking store access:', error);
      } finally {
        setLoading(false);
      }
    };

    checkStoreAccess();
  }, [storeId, currentStore]);

  // Update storeData when currentStore changes
  useEffect(() => {
    if (currentStore && currentStore.id.toString() === storeId) {
      setStoreData(currentStore);
    }
  }, [currentStore, storeId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <Loader className="w-10 h-10 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // If store is not active, redirect to stores page
  if (storeData && !storeData.storeIsActive) {
    return (
      <Navigate 
        to="/stores" 
        replace 
        state={{ 
          message: t('stores.store_inactive_message'),
          type: 'error'
        }}
      />
    );
  }

  // If no store data found, redirect to stores page
  if (!storeData) {
    return (
      <Navigate 
        to="/stores" 
        replace 
        state={{ 
          message: t('stores.store_not_found'),
          type: 'error'
        }}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedStoreRoute; 