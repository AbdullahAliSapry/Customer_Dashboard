

import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Store } from 'lucide-react';
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
  typeStore: number;
  storeIsActive: boolean; // ADD THIS LINE
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
  const location = useLocation();
  const ownerid = useSelector((state: RootState) => state.customer.customerData?.id);
  const stores = useSelector((state: RootState) => state.Dashboard.stores.stores as IStoreData[]);
     const [loading, setLoading] = useState(true);
   const [errorMessage, setErrorMessage] = useState<string | null>(null);
   const [searchTerm, setSearchTerm] = useState('');
   const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
   const apiRepository = new ApiRepository();

   console.log(stores);

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

  // Check for error messages from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setErrorMessage(location.state.message);
      // Clear the state to prevent showing the message again on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

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

   // Filter stores based on search term and status
   const filteredStores = stores?.filter(store => {
     const matchesSearch = store.dominName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          getBusinessTypeName(store.businessType).toLowerCase().includes(searchTerm.toLowerCase()) ||
                          getStoreTypeName(store.typeStore).toLowerCase().includes(searchTerm.toLowerCase());
     
     const matchesStatus = filterStatus === 'all' || 
                          (filterStatus === 'active' && store.storeIsActive) ||
                          (filterStatus === 'inactive' && !store.storeIsActive);
     
     return matchesSearch && matchesStatus;
   }) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                {t('stores.stores')}
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                {stores && stores.length > 0 
                  ? `${stores.length} ${stores.length === 1 ? 'store' : 'stores'} available`
                  : 'Manage your business stores'
                }
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Store className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

                 {/* Error Message */}
         {errorMessage && (
           <div className="mb-8 animate-slide-down">
             <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow-sm">
               <div className="flex items-center">
                 <div className="flex-shrink-0">
                   <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                     <svg className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                     </svg>
                   </div>
                 </div>
                 <div className="ml-4 flex-1">
                   <p className="text-sm font-medium text-red-800">{errorMessage}</p>
                 </div>
                 <button
                   onClick={() => setErrorMessage(null)}
                   className="ml-4 flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
                 >
                   <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                   </svg>
                 </button>
               </div>
             </div>
           </div>
         )}

                   {/* Search and Filter Section */}
          {!loading && stores && stores.length > 0 && (
            <div className="mb-6 animate-fade-in">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50">
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                  {/* Search Input */}
                  <div className="flex-1 w-full lg:w-auto">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder={t('stores.search_placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilterStatus('all')}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        filterStatus === 'all'
                          ? "bg-primary-100 text-primary-700 border border-primary-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      {t('stores.filter.all')}
                    </button>
                    <button
                      onClick={() => setFilterStatus('active')}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        filterStatus === 'active'
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      {t('stores.filter.active')}
                    </button>
                    <button
                      onClick={() => setFilterStatus('inactive')}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        filterStatus === 'inactive'
                          ? "bg-red-100 text-red-700 border border-red-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      {t('stores.filter.inactive')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Statistics Section */}
          {!loading && stores && stores.length > 0 && (
            <div className="mb-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {/* Total Stores */}
               <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-all duration-300">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm font-medium text-gray-600 mb-1">Total Stores</p>
                     <p className="text-3xl font-bold text-gray-900">{stores.length}</p>
                   </div>
                   <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                     <Store className="w-6 h-6 text-white" />
                   </div>
                 </div>
               </div>

               {/* Active Stores */}
               <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-all duration-300">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm font-medium text-gray-600 mb-1">Active Stores</p>
                     <p className="text-3xl font-bold text-green-600">
                       {stores.filter(store => store.storeIsActive).length}
                     </p>
                   </div>
                   <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                     <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                   </div>
                 </div>
               </div>

               {/* Inactive Stores */}
               <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-all duration-300">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm font-medium text-gray-600 mb-1">Inactive Stores</p>
                     <p className="text-3xl font-bold text-red-600">
                       {stores.filter(store => !store.storeIsActive).length}
                     </p>
                   </div>
                   <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                     <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                   </div>
                 </div>
               </div>

               {/* Business Types */}
               <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-all duration-300">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm font-medium text-gray-600 mb-1">Business Types</p>
                     <p className="text-3xl font-bold text-purple-600">
                       {new Set(stores.map(store => store.businessType)).size}
                     </p>
                   </div>
                   <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                     <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                     </svg>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         )}

        {loading ? (
          <div className="flex justify-center items-center h-96 animate-fade-in">
            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary-400 rounded-full animate-ping opacity-20"></div>
              </div>
              <p className="text-gray-600 font-medium">Loading your stores...</p>
            </div>
          </div>
                 ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
            {/* Create Store Card */}
                         <div
               onClick={() => navigate('/storeCreation')}
               className={cn(
                 "group relative bg-white rounded-2xl p-6 cursor-pointer",
                 "transition-all duration-300 ease-out",
                 "border-2 border-dashed border-gray-200",
                 "flex flex-col items-center justify-center min-h-[280px]",
                 "hover:border-primary-300 hover:bg-gradient-to-br hover:from-primary-50 hover:to-blue-50",
                 "hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1",
                 "transform hover:scale-105"
               )}
             >
               {/* Background Pattern */}
               <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 to-blue-50/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
               
               <div className="relative z-10 text-center">
                 <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300 shadow-lg">
                   <Plus className="w-8 h-8 text-white" />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors">
                   {t('stores.create_new_store')}
                 </h3>
                 <p className="text-gray-600 text-center leading-relaxed">
                   {t('stores.create_new_store_description')}
                 </p>
                 
                 {/* Hover Effect */}
                 <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                   <div className="inline-flex items-center gap-2 text-primary-600 font-medium">
                     <span>Get Started</span>
                     <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                     </svg>
                   </div>
                 </div>
               </div>
             </div>

                         {/* Store Cards */}
             {filteredStores.map((store, index) => (
               <div
                 key={store.id}
                 className="animate-fade-in"
                 style={{ animationDelay: `${index * 100}ms` }}
               >
                 <StoreCard
                   id={store.id.toString()}
                   name={store.dominName}
                   location={getBusinessTypeName(store.businessType)}
                   productsCount={0}
                   status={store.storeIsActive ? "active" : "inactive"}
                   primaryColor={store.primaryColor}
                   storeType={getStoreTypeName(store.typeStore)}
                   isActive={store.storeIsActive}
                 />
               </div>
             ))}
          </div>
        )}

        {!loading && (!stores || stores.length === 0) && (
          <div className="text-center py-16 animate-fade-in">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Store className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {t('stores.no_stores_found')}
              </h3>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                {t('stores.no_stores_description')}
              </p>
              <button
                onClick={() => navigate('/storeCreation')}
                className={`
                  inline-flex items-center gap-3 px-6 py-3
                  bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl
                  hover:from-primary-700 hover:to-primary-800 transition-all duration-300
                  focus:outline-none focus:ring-4 focus:ring-primary-500/30
                  transform hover:scale-105 hover:shadow-lg
                  font-medium text-lg
                `}
              >
                <Plus className="w-6 h-6" />
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