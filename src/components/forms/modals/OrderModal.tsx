// import { useFormik } from "formik";
// import * as Yup from "yup";
// import Modal from "./Modal";
// import { IOrder, OrderStatus } from "../../../interfaces/OrderInterface";
// import { updateOrder } from "../../../Store/StoreSlice/OrderSlice";
// import FieldLabel from "../../FormsComponents/FieldLabel";
// import { ApiRepository } from "../../../Api/ApiRepository";
// import { EndPoints } from "../../../Api/EndPoints";
// import { useParams } from "react-router-dom";
// import toast from "react-hot-toast";

// interface OrderModalProps {
//     setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
//     initialOrder: IOrder;
// }

// const validationSchema = Yup.object({
//     status: Yup.string()
//         .oneOf(Object.values(OrderStatus), "Invalid status")
//         .required("Status is required"),
// });

// const OrderModal = ({ setIsOpen, initialOrder }: OrderModalProps) => {
//     const { storeId } = useParams();
//     const apiRepository = new ApiRepository();

//     const formik = useFormik({
//         initialValues: {
//             status: initialOrder.status,
//         },
//         validationSchema,
//         onSubmit: async (values) => {
//             try {
//                 const updatedOrder = {
//                     ...initialOrder,
//                     status: values.status,
//                 };

//                 await apiRepository.update(
//                     EndPoints.order(storeId as string, initialOrder.id.toString()),
//                     initialOrder.id.toString(),
//                     updatedOrder,
//                     updateOrder
//                 );
                
//                 setIsOpen(false);
//                 toast.success("Order status updated successfully");
//             } catch (error) {
//                 console.error("Error updating order:", error);
//                 toast.error("Failed to update order status");
//             }
//         },
//     });

//     // Format currency
//     const formatCurrency = (amount: number) => {
//         return `SAR ${amount.toFixed(2)}`;
//     };

//     return (
//         <Modal setIsOpen={setIsOpen}>
//             <div className="p-6">
//                 <h2 className="text-2xl font-bold mb-6">Order Details</h2>
                
//                 <div className="space-y-6">
//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <FieldLabel htmlFor="orderId">Order ID</FieldLabel>
//                             <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
//                                 {initialOrder.orderId}
//                             </div>
//                         </div>
//                         <div>
//                             <FieldLabel htmlFor="date">Date</FieldLabel>
//                             <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
//                                 {initialOrder.date}
//                             </div>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <FieldLabel htmlFor="customer">Customer</FieldLabel>
//                             <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
//                                 {initialOrder.customer}
//                             </div>
//                         </div>
//                         <div>
//                             <FieldLabel htmlFor="total">Total</FieldLabel>
//                             <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50 font-medium">
//                                 {formatCurrency(initialOrder.total)}
//                             </div>
//                         </div>
//                     </div>

//                     <form onSubmit={formik.handleSubmit}>
//                         <div>
//                             <FieldLabel htmlFor="status">Status</FieldLabel>
//                             <select
//                                 id="status"
//                                 name="status"
//                                 value={formik.values.status}
//                                 onChange={formik.handleChange}
//                                 onBlur={formik.handleBlur}
//                                 className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
//                             >
//                                 {Object.values(OrderStatus).map((status) => (
//                                     <option key={status} value={status}>{status}</option>
//                                 ))}
//                             </select>
//                             {formik.touched.status && formik.errors.status && (
//                                 <p className="mt-1 text-sm text-red-500">{formik.errors.status}</p>
//                             )}
//                         </div>

//                         <div className="mt-6 flex justify-end space-x-3">
//                             <button
//                                 type="button"
//                                 onClick={() => setIsOpen(false)}
//                                 className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="submit"
//                                 className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
//                             >
//                                 Update Status
//                             </button>
//                         </div>
//                     </form>

//                     <div className="mt-6">
//                         <h3 className="text-lg font-medium mb-4">Order Items</h3>
//                         <div className="overflow-hidden border border-gray-200 rounded-md">
//                             <table className="min-w-full divide-y divide-gray-200">
//                                 <thead className="bg-gray-50">
//                                     <tr>
//                                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
//                                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
//                                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
//                                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
//                                         <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="bg-white divide-y divide-gray-200">
//                                     {initialOrder.items.map((item, index) => (
//                                         <tr key={index}>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                                 {item.productName}
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                 {item.quantity}
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                 {formatCurrency(item.price)}
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                 {item.discount}%
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
//                                                 {formatCurrency((item.price * (1 - item.discount / 100)) * item.quantity)}
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                                 <tfoot className="bg-gray-50">
//                                     <tr>
//                                         <td colSpan={4} className="px-6 py-3 text-right text-sm font-medium text-gray-900">
//                                             Total:
//                                         </td>
//                                         <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
//                                             {formatCurrency(initialOrder.total)}
//                                         </td>
//                                     </tr>
//                                 </tfoot>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </Modal>
//     );
// };

// export default OrderModal; 



import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "./Modal";
import { IOrder, OrderStatus } from "../../../interfaces/OrderInterface";
import { updateOrder } from "../../../Store/StoreSlice/OrderSlice";
import FieldLabel from "../../FormsComponents/FieldLabel";
import { ApiRepository } from "../../../Api/ApiRepository";
import { EndPoints } from "../../../Api/EndPoints";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

interface OrderModalProps {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    initialOrder: IOrder;
}

const validationSchema = Yup.object({
    status: Yup.string()
        .oneOf(Object.values(OrderStatus), "orderModal.errors.invalid_status")
        .required("orderModal.errors.status_required"),
});

const OrderModal = ({ setIsOpen, initialOrder }: OrderModalProps) => {
    const { t } = useTranslation();
    const { storeId } = useParams();
    const apiRepository = new ApiRepository();

    const formik = useFormik({
        initialValues: {
            status: initialOrder.status,
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const updatedOrder = {
                    ...initialOrder,
                    status: values.status,
                };

                await apiRepository.update(
                    EndPoints.order(storeId as string, initialOrder.id.toString()),
                    initialOrder.id.toString(),
                    updatedOrder,
                    updateOrder
                );
                
                setIsOpen(false);
                toast.success(t("orderModal.success_toast"));
            } catch (error) {
                console.error(t("orderModal.error_updating"), error);
                toast.error(t("orderModal.error_toast"));
            }
        },
    });

    // Format currency
    const formatCurrency = (amount: number) => {
        return `${t("orderModal.currency")} ${amount.toFixed(2)}`;
    };

    return (
        <Modal setIsOpen={setIsOpen}>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">{t("orderModal.title")}</h2>
                
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <FieldLabel htmlFor="orderId">{t("orderModal.order_id_label")}</FieldLabel>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                                {initialOrder.orderId}
                            </div>
                        </div>
                        <div>
                            <FieldLabel htmlFor="date">{t("orderModal.date_label")}</FieldLabel>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                                {initialOrder.date}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <FieldLabel htmlFor="customer">{t("orderModal.customer_label")}</FieldLabel>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                                {initialOrder.customer}
                            </div>
                        </div>
                        <div>
                            <FieldLabel htmlFor="total">{t("orderModal.total_label")}</FieldLabel>
                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50 font-medium">
                                {formatCurrency(initialOrder.total)}
                            </div>
                        </div>
                    </div>

                    <form onSubmit={formik.handleSubmit}>
                        <div>
                            <FieldLabel htmlFor="status">{t("orderModal.status_label")}</FieldLabel>
                            <select
                                id="status"
                                name="status"
                                value={formik.values.status}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                            >
                                {Object.values(OrderStatus).map((status) => (
                                    <option key={status} value={status}>{t(`orderModal.status.${status}`)}</option>
                                ))}
                            </select>
                            {formik.touched.status && formik.errors.status && (
                                <p className="mt-1 text-sm text-red-500">{t(formik.errors.status)}</p>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                            >
                                {t("orderModal.cancel")}
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                {t("orderModal.update_status")}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <h3 className="text-lg font-medium mb-4">{t("orderModal.order_items_title")}</h3>
                        <div className="overflow-hidden border border-gray-200 rounded-md">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("orderModal.table.product")}</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("orderModal.table.quantity")}</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("orderModal.table.price")}</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("orderModal.table.discount")}</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t("orderModal.table.subtotal")}</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {initialOrder.items.map((item, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {item.productName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.quantity}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatCurrency(item.price)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.discount}%
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                                {formatCurrency((item.price * (1 - item.discount / 100)) * item.quantity)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50">
                                    <tr>
                                        <td colSpan={4} className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                                            {t("orderModal.table.total")}:
                                        </td>
                                        <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                                            {formatCurrency(initialOrder.total)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default OrderModal;