// import React from 'react';
// import Modal from './Modal';
// import { IPayment, PaymentStatus } from '../../../interfaces/PaymentInterface';
// import FieldLabel from '../../FormsComponents/FieldLabel';

// interface PaymentDetailsModalProps {
//     setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
//     payment: IPayment;
// }

// const PaymentDetailsModal = ({ setIsOpen, payment }: PaymentDetailsModalProps) => {
//     const formatCurrency = (amount: number, currency: string) => {
//         return `${currency} ${amount.toFixed(2)}`;
//     };

//     const formatDate = (date: Date | string) => {
//         if (!date) return 'N/A';
//         const d = new Date(date);
//         return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
//     };

//     const getStatusBadgeClass = (status: PaymentStatus) => {
//         switch (status) {
//             case PaymentStatus.Completed:
//                 return 'bg-success-100 text-success-800';
//             case PaymentStatus.Pending:
//                 return 'bg-yellow-100 text-yellow-800';
//             case PaymentStatus.Failed:
//                 return 'bg-error-100 text-error-800';
//             case PaymentStatus.Refunded:
//                 return 'bg-blue-100 text-blue-800';
//             case PaymentStatus.Cancelled:
//                 return 'bg-gray-100 text-gray-800';
//             default:
//                 return 'bg-gray-100 text-gray-800';
//         }
//     };

//     return (
//         <Modal setIsOpen={setIsOpen}>
//             <div className="p-6">
//                 <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
                
//                 <div className="space-y-4">
//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <FieldLabel htmlFor="paymentId">Payment ID</FieldLabel>
//                             <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
//                                 {payment.paymentId}
//                             </div>
//                         </div>
//                         <div>
//                             <FieldLabel htmlFor="transactionId">Transaction ID</FieldLabel>
//                             <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
//                                 {payment.transactionId}
//                             </div>
//                         </div>
//                     </div>

//                     <div>
//                         <FieldLabel htmlFor="orderId">Order ID</FieldLabel>
//                         <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
//                             {payment.orderId}
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <FieldLabel htmlFor="amount">Amount</FieldLabel>
//                             <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50 font-medium">
//                                 {formatCurrency(payment.amount, payment.currency)}
//                             </div>
//                         </div>
//                         <div>
//                             <FieldLabel htmlFor="method">Payment Method</FieldLabel>
//                             <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
//                                 {payment.method}
//                             </div>
//                         </div>
//                     </div>

//                     <div>
//                         <FieldLabel htmlFor="status">Status</FieldLabel>
//                         <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
//                             <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(payment.status)}`}>
//                                 {payment.status}
//                             </span>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <FieldLabel htmlFor="customerName">Customer Name</FieldLabel>
//                             <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
//                                 {payment.customerName}
//                             </div>
//                         </div>
//                         <div>
//                             <FieldLabel htmlFor="customerEmail">Customer Email</FieldLabel>
//                             <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
//                                 {payment.customerEmail}
//                             </div>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <FieldLabel htmlFor="createdAt">Created At</FieldLabel>
//                             <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
//                                 {formatDate(payment.createdAt)}
//                             </div>
//                         </div>
//                         <div>
//                             <FieldLabel htmlFor="updatedAt">Updated At</FieldLabel>
//                             <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
//                                 {payment.updatedAt ? formatDate(payment.updatedAt) : 'N/A'}
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

// export default PaymentDetailsModal; 



import React from 'react';
import Modal from './Modal';
import { IPayment, PaymentStatus } from '../../../interfaces/PaymentInterface';
import FieldLabel from '../../FormsComponents/FieldLabel';
import { useTranslation } from 'react-i18next';

interface PaymentDetailsModalProps {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    payment: IPayment;
}

const PaymentDetailsModal = ({ setIsOpen, payment }: PaymentDetailsModalProps) => {
    const { t } = useTranslation();

    const formatCurrency = (amount: number, currency: string) => {
        return `${currency} ${amount.toFixed(2)}`;
    };

    const formatDate = (date: Date | string) => {
        if (!date) return t('paymentModal.na');
        const d = new Date(date);
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
    };

    const getStatusBadgeClass = (status: PaymentStatus) => {
        switch (status) {
            case PaymentStatus.Completed:
                return 'bg-success-100 text-success-800';
            case PaymentStatus.Pending:
                return 'bg-yellow-100 text-yellow-800';
            case PaymentStatus.Failed:
                return 'bg-error-100 text-error-800';
            case PaymentStatus.Refunded:
                return 'bg-blue-100 text-blue-800';
            case PaymentStatus.Cancelled:
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Modal setIsOpen={setIsOpen}>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">{t('paymentModal.title')}</h2>
                
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <FieldLabel htmlFor="paymentId">{t('paymentModal.payment_id_label')}</FieldLabel>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                                {payment.paymentId}
                            </div>
                        </div>
                        <div>
                            <FieldLabel htmlFor="transactionId">{t('paymentModal.transaction_id_label')}</FieldLabel>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                                {payment.transactionId}
                            </div>
                        </div>
                    </div>

                    <div>
                        <FieldLabel htmlFor="orderId">{t('paymentModal.order_id_label')}</FieldLabel>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                            {payment.orderId}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <FieldLabel htmlFor="amount">{t('paymentModal.amount_label')}</FieldLabel>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50 font-medium">
                                {formatCurrency(payment.amount, payment.currency)}
                            </div>
                        </div>
                        <div>
                            <FieldLabel htmlFor="method">{t('paymentModal.method_label')}</FieldLabel>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                                {payment.method}
                            </div>
                        </div>
                    </div>

                    <div>
                        <FieldLabel htmlFor="status">{t('paymentModal.status_label')}</FieldLabel>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(payment.status)}`}>
                                {t(`paymentModal.status.${payment.status}`)}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <FieldLabel htmlFor="customerName">{t('paymentModal.customer_name_label')}</FieldLabel>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                                {payment.customerName}
                            </div>
                        </div>
                        <div>
                            <FieldLabel htmlFor="customerEmail">{t('paymentModal.customer_email_label')}</FieldLabel>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                                {payment.customerEmail}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <FieldLabel htmlFor="createdAt">{t('paymentModal.created_at_label')}</FieldLabel>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                                {formatDate(payment.createdAt)}
                            </div>
                        </div>
                        <div>
                            <FieldLabel htmlFor="updatedAt">{t('paymentModal.updated_at_label')}</FieldLabel>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                                {payment.updatedAt ? formatDate(payment.updatedAt) : t('paymentModal.na')}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            {t('paymentModal.close')}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default PaymentDetailsModal;