// import Modal from "./Modal";
// import { IStoreCustomer, CustomerStatus } from "../../../interfaces/StoreCustomerInterface";
// import FieldLabel from "../../FormsComponents/FieldLabel";

// interface CustomerModalProps {
//     setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
//     initialCustomer: IStoreCustomer;
// }

// const CustomerModal = ({ setIsOpen, initialCustomer }: CustomerModalProps) => {
//     return (
//         <Modal setIsOpen={setIsOpen}>
//             <div className="p-6">
//                 <h2 className="text-2xl font-bold mb-6">Customer Details</h2>
                
//                 <div className="space-y-4">
//                     <div>
//                         <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
//                         <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
//                             {initialCustomer.fullName}
//                         </div>
//                     </div>

//                     <div>
//                         <FieldLabel htmlFor="email">Email</FieldLabel>
//                         <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
//                             {initialCustomer.email}
//                         </div>
//                     </div>

//                     <div>
//                         <FieldLabel htmlFor="phoneNumber">Phone</FieldLabel>
//                         <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
//                             {initialCustomer.phoneNumber}
//                         </div>
//                     </div>

//                     <div>
//                         <FieldLabel htmlFor="status">Status</FieldLabel>
//                         <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
//                             <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
//                                 ${initialCustomer.status === CustomerStatus.Active ? 'bg-success-100 text-success-800' : 'bg-error-100 text-error-800'}`}>
//                                 {initialCustomer.status}
//                             </span>
//                         </div>
//                     </div>

//                     {initialCustomer.address && (
//                         <div>
//                             <FieldLabel htmlFor="address">Address</FieldLabel>
//                             <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
//                                 {initialCustomer.address}
//                             </div>
//                         </div>
//                     )}

//                     <div className="grid grid-cols-2 gap-4">
//                         {initialCustomer.city && (
//                             <div>
//                                 <FieldLabel htmlFor="city">City</FieldLabel>
//                                 <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
//                                     {initialCustomer.city}
//                                 </div>
//                             </div>
//                         )}
//                         {initialCustomer.country && (
//                             <div>
//                                 <FieldLabel htmlFor="country">Country</FieldLabel>
//                                 <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
//                                     {initialCustomer.country}
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     {initialCustomer.postalCode && (
//                         <div>
//                             <FieldLabel htmlFor="postalCode">Postal Code</FieldLabel>
//                             <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
//                                 {initialCustomer.postalCode}
//                             </div>
//                         </div>
//                     )}

//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <FieldLabel htmlFor="createdAt">Created At</FieldLabel>
//                             <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
//                                 {initialCustomer.createdAt.toLocaleDateString()}
//                             </div>
//                         </div>
//                         <div>
//                             <FieldLabel htmlFor="updatedAt">Updated At</FieldLabel>
//                             <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
//                                 {initialCustomer.updatedAt?.toLocaleDateString() || 'N/A'}
//                             </div>
//                         </div>
//                     </div>

//                     <div className="mt-6 flex justify-end">
//                         <button
//                             type="button"
//                             onClick={() => setIsOpen(false)}
//                             className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
//                         >
//                             Close
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </Modal>
//     );
// };

// export default CustomerModal; 


import Modal from "./Modal";
import { IStoreCustomer, CustomerStatus } from "../../../interfaces/StoreCustomerInterface";
import FieldLabel from "../../FormsComponents/FieldLabel";
import { useTranslation } from "react-i18next";

interface CustomerModalProps {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    initialCustomer: IStoreCustomer;
}

const CustomerModal = ({ setIsOpen, initialCustomer }: CustomerModalProps) => {
    const { t } = useTranslation();

    return (
        <Modal setIsOpen={setIsOpen}>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">{t('customerModal.title')}</h2>
                
                <div className="space-y-4">
                    <div>
                        <FieldLabel htmlFor="fullName">{t('customerModal.full_name_label')}</FieldLabel>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                            {initialCustomer.fullName}
                        </div>
                    </div>

                    <div>
                        <FieldLabel htmlFor="email">{t('customerModal.email_label')}</FieldLabel>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                            {initialCustomer.email}
                        </div>
                    </div>

                    <div>
                        <FieldLabel htmlFor="phoneNumber">{t('customerModal.phone_label')}</FieldLabel>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                            {initialCustomer.phoneNumber}
                        </div>
                    </div>

                    <div>
                        <FieldLabel htmlFor="status">{t('customerModal.status_label')}</FieldLabel>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${initialCustomer.status === CustomerStatus.Active ? 'bg-success-100 text-success-800' : 'bg-error-100 text-error-800'}`}>
                                {t(`customerModal.status.${initialCustomer.status}`)}
                            </span>
                        </div>
                    </div>

                    {initialCustomer.address && (
                        <div>
                            <FieldLabel htmlFor="address">{t('customerModal.address_label')}</FieldLabel>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                                {initialCustomer.address}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        {initialCustomer.city && (
                            <div>
                                <FieldLabel htmlFor="city">{t('customerModal.city_label')}</FieldLabel>
                                <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                                    {initialCustomer.city}
                                </div>
                            </div>
                        )}
                        {initialCustomer.country && (
                            <div>
                                <FieldLabel htmlFor="country">{t('customerModal.country_label')}</FieldLabel>
                                <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                                    {initialCustomer.country}
                                </div>
                            </div>
                        )}
                    </div>

                    {initialCustomer.postalCode && (
                        <div>
                            <FieldLabel htmlFor="postalCode">{t('customerModal.postal_code_label')}</FieldLabel>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                                {initialCustomer.postalCode}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <FieldLabel htmlFor="createdAt">{t('customerModal.created_at_label')}</FieldLabel>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                                {initialCustomer.createdAt.toLocaleDateString()}
                            </div>
                        </div>
                        <div>
                            <FieldLabel htmlFor="updatedAt">{t('customerModal.updated_at_label')}</FieldLabel>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                                {initialCustomer.updatedAt?.toLocaleDateString() || t('customerModal.na')}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            {t('customerModal.close')}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CustomerModal;