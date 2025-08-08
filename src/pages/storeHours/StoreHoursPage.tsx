import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../Store/Store';
import { 
  setStoreHours, 
  addStoreHours, 
  updateStoreHours, 
  deleteStoreHours,
  setLoading,
  setError 
} from '../../Store/StoreSlice/StoreHoursSlice';
import { StoreHouresWorkInterfafce } from '../../interfaces/StoreHouresWorkInterfafce';
import StoreHoursHeader from './components/StoreHoursHeader';
import StoreHoursStats from './components/StoreHoursStats';
import StoreHoursTable from './components/StoreHoursTable';
import StoreHoursModal from '../../components/forms/modals/StoreHoursModal';
import { ApiRepository } from '../../Api/ApiRepository';
import { EndPoints } from '../../Api/EndPoints';

const StoreHoursPage: React.FC = () => {
  const { t } = useTranslation();
  const { storeId } = useParams();
  const dispatch = useAppDispatch();
  const { storeHours, loading, error } = useAppSelector(state => state.storeHours);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStoreHours, setSelectedStoreHours] = useState<StoreHouresWorkInterfafce | null>(null);

  const apiRepository = new ApiRepository();
  useEffect(() => {
    const fetchStoreHours = async () => {
      if (!storeId) return;
      
      dispatch(setLoading(true));
      try {
        await apiRepository.getAll<StoreHouresWorkInterfafce>(
          EndPoints.storeHours(storeId || ""),
          setStoreHours,
          setError
        );
      } catch (error) {
        console.error('Error fetching store hours:', error);

      } finally {
        dispatch(setLoading(false));
      }
    };
    
    fetchStoreHours();
  }, [storeId, dispatch]);



  const handleEdit = (storeHours: StoreHouresWorkInterfafce) => {
    setSelectedStoreHours(storeHours);
    setIsModalOpen(true);
  };

  const handleDelete = async (storeHoursId: number) => {
    try {
      // TODO: Replace with actual delete API call
      // const apiRepository = new ApiRepository();
      // await apiRepository.delete(EndPoints.storeHours, storeHoursId.toString());
      
      dispatch(deleteStoreHours(storeHoursId));
    } catch (error) {
      console.error('Error deleting store hours:', error);
    }
  };

  const handleSaveStoreHours = (storeHoursData: StoreHouresWorkInterfafce) => {
    try {
      if (selectedStoreHours) {
        // Update existing
        // TODO: Replace with actual update API call
        // const apiRepository = new ApiRepository();
        // await apiRepository.update(EndPoints.storeHours, storeHoursData);
        
        dispatch(updateStoreHours(storeHoursData));
      } else {
        // Add new
        // TODO: Replace with actual create API call
        // const apiRepository = new ApiRepository();
        // const response = await apiRepository.create(EndPoints.storeHours, storeHoursData);
        
        const newStoreHours = {
          ...storeHoursData,
          id: Math.max(...storeHours.map((sh: StoreHouresWorkInterfafce) => sh.id)) + 1
        };
        dispatch(addStoreHours(newStoreHours));
      }
    } catch (error) {
      console.error('Error saving store hours:', error);
    }
  };

  const handleAddNew = () => {
    setSelectedStoreHours(null);
    setIsModalOpen(true);
  };

  const handleDeleteWithConfirmation = async (storeHoursId: number) => {
    if (!window.confirm(t('storeHours.delete_confirmation'))) {
      return;
    }
    await handleDelete(storeHoursId);
  };

  const totalDays = storeHours.length;
  const openDays = storeHours.filter(hours => !hours.isClosed).length;
  const closedDays = storeHours.filter(hours => hours.isClosed).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <StoreHoursHeader onAddNew={handleAddNew} />

        {/* Statistics Cards */}
        <StoreHoursStats 
          totalDays={totalDays}
          openDays={openDays}
          closedDays={closedDays}
        />

        {/* Store Hours Table */}
        <StoreHoursTable
          storeHours={storeHours}
          loading={loading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDeleteWithConfirmation}
          onAddNew={handleAddNew}
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <StoreHoursModal
          setIsOpen={setIsModalOpen}
          initialStoreHours={selectedStoreHours}
          onSave={handleSaveStoreHours}
          storeId={parseInt(storeId || '1')}
        />
      )}
    </div>
  );
};

export default StoreHoursPage;