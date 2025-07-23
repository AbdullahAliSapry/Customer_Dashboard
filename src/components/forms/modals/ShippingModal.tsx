// import { useFormik } from "formik";
// import * as Yup from "yup";
// import Modal from "./Modal";
// import { IShippingData } from "../../../interfaces/ShippingInterface";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../Store/Store";
// import { useParams } from "react-router-dom";
// import { ApiRepository } from "../../../Api/ApiRepository";
// import { EndPoints } from "../../../Api/EndPoints";
// import { ActivateShipping } from "../../../Store/StoreSlice/ShippingSlice";
// import { useState } from "react";
// interface ShippingModalProps {
//     setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;

//     onSuccess?: () => void;
// }

// const ShippingModal: React.FC<ShippingModalProps> = ({
//     setIsOpen,
// }) => {
//     const userid = useSelector((state: RootState) => state.Auth.user.userId);
//     const {storeId} = useParams();
//     const apirepository = new ApiRepository();
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const validationSchema = Yup.object({
//         address: Yup.object({
//             streetInfo: Yup.string().required("Street information is required"),
//             city: Yup.string().required("City is required"),
//             district: Yup.string().required("District is required"),
//             flatFloor: Yup.string().required("Flat/Floor information is required"),
//             splInstructions: Yup.string()
//         }),
//         location: Yup.object({
//             latitude: Yup.number().required("Latitude is required"),
//             longitude: Yup.number().required("Longitude is required")
//         })
//     });

//     const formik = useFormik<IShippingData>({
//         initialValues: {
//             address: {
//                 streetInfo: "",
//                 city: "",
//                 district: "",
//                 flatFloor: "",
//                 splInstructions: ""
//             },
//             location: {
//                 latitude: 0,
//                 longitude: 0
//             }
//         },
//         validationSchema,
//         onSubmit: async (values) => {
//             setIsSubmitting(true);
//             const response = await apirepository.create(EndPoints.createShippingToStore(storeId?.toString() ?? "",userid),values,ActivateShipping)
//             console.log(response);
//             if(response != null){
//                 setIsSubmitting(false);
//                 setIsOpen(false);
//             }else{
//                 setIsSubmitting(false);
//             }
            
//         }
//     });

//     return (
//         <Modal setIsOpen={setIsOpen}>
//             <div className="p-6">
//                 <h2 className="text-2xl font-bold mb-6 text-gray-800">Activate Shipping</h2>
                
//                 <form onSubmit={formik.handleSubmit}>
//                     <div className="space-y-4 mb-6">
//                         <h3 className="font-medium text-lg text-gray-700">Address Information</h3>
                        
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                                 <label htmlFor="streetInfo" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Street Information *
//                                 </label>
//                                 <input
//                                     type="text"
//                                     id="streetInfo"
//                                     name="address.streetInfo"
//                                     value={formik.values.address.streetInfo}
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur}
//                                     className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                                 {formik.touched.address?.streetInfo && formik.errors.address?.streetInfo && (
//                                     <p className="mt-1 text-sm text-red-600">{formik.errors.address.streetInfo}</p>
//                                 )}
//                             </div>
                            
//                             <div>
//                                 <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
//                                     City *
//                                 </label>
//                                 <input
//                                     type="text"
//                                     id="city"
//                                     name="address.city"
//                                     value={formik.values.address.city}
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur}
//                                     className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                                 {formik.touched.address?.city && formik.errors.address?.city && (
//                                     <p className="mt-1 text-sm text-red-600">{formik.errors.address.city}</p>
//                                 )}
//                             </div>
//                         </div>
                        
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                                 <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
//                                     District *
//                                 </label>
//                                 <input
//                                     type="text"
//                                     id="district"
//                                     name="address.district"
//                                     value={formik.values.address.district}
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur}
//                                     className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                                 {formik.touched.address?.district && formik.errors.address?.district && (
//                                     <p className="mt-1 text-sm text-red-600">{formik.errors.address.district}</p>
//                                 )}
//                             </div>
                            
//                             <div>
//                                 <label htmlFor="flatFloor" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Flat/Floor *
//                                 </label>
//                                 <input
//                                     type="text"
//                                     id="flatFloor"
//                                     name="address.flatFloor"
//                                     value={formik.values.address.flatFloor}
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur}
//                                     className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                                 {formik.touched.address?.flatFloor && formik.errors.address?.flatFloor && (
//                                     <p className="mt-1 text-sm text-red-600">{formik.errors.address.flatFloor}</p>
//                                 )}
//                             </div>
//                         </div>
                        
//                         <div>
//                             <label htmlFor="splInstructions" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Special Instructions
//                             </label>
//                             <textarea
//                                 id="splInstructions"
//                                 name="address.splInstructions"
//                                 value={formik.values.address.splInstructions}
//                                 onChange={formik.handleChange}
//                                 onBlur={formik.handleBlur}
//                                 className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 rows={3}
//                             ></textarea>
//                         </div>
//                     </div>

//                     <div className="space-y-4 mb-6">
//                         <h3 className="font-medium text-lg text-gray-700">Location Information</h3>
                        
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                                 <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Latitude *
//                                 </label>
//                                 <input
//                                     type="number"
//                                     step="any"
//                                     id="latitude"
//                                     name="location.latitude"
//                                     value={formik.values.location.latitude}
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur}
//                                     className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                                 {formik.touched.location?.latitude && formik.errors.location?.latitude && (
//                                     <p className="mt-1 text-sm text-red-600">{formik.errors.location.latitude}</p>
//                                 )}
//                             </div>
                            
//                             <div>
//                                 <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Longitude *
//                                 </label>
//                                 <input
//                                     type="number"
//                                     step="any"
//                                     id="longitude"
//                                     name="location.longitude"
//                                     value={formik.values.location.longitude}
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur}
//                                     className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                                 {formik.touched.location?.longitude && formik.errors.location?.longitude && (
//                                     <p className="mt-1 text-sm text-red-600">{formik.errors.location.longitude}</p>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
                    
//                     <div className="flex justify-end space-x-3 mt-8">
//                         <button
//                             type="button"
//                             onClick={() => setIsOpen(false)}
//                             className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                             disabled={isSubmitting}
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                             disabled={isSubmitting}
//                         >
//                             {isSubmitting ? 'Activating...' : 'Activate Shipping'}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </Modal>
//     );
// };

// export default ShippingModal; 


import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "./Modal";
import { IShippingData } from "../../../interfaces/ShippingInterface";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store/Store";
import { useParams } from "react-router-dom";
import { ApiRepository } from "../../../Api/ApiRepository";
import { EndPoints } from "../../../Api/EndPoints";
import { ActivateShipping } from "../../../Store/StoreSlice/ShippingSlice";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ShippingModalProps {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onSuccess?: () => void;
}

const ShippingModal: React.FC<ShippingModalProps> = ({
    setIsOpen,
}) => {
    const { t } = useTranslation();
    const userid = useSelector((state: RootState) => state.Auth.user.userId);
    const {storeId} = useParams();
    const apirepository = new ApiRepository();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const validationSchema = Yup.object({
        address: Yup.object({
            streetInfo: Yup.string().required("shippingModal.errors.streetInfo_required"),
            city: Yup.string().required("shippingModal.errors.city_required"),
            district: Yup.string().required("shippingModal.errors.district_required"),
            flatFloor: Yup.string().required("shippingModal.errors.flatFloor_required"),
            splInstructions: Yup.string()
        }),
        location: Yup.object({
            latitude: Yup.number().required("shippingModal.errors.latitude_required"),
            longitude: Yup.number().required("shippingModal.errors.longitude_required")
        })
    });

    const formik = useFormik<IShippingData>({
        initialValues: {
            address: {
                streetInfo: "",
                city: "",
                district: "",
                flatFloor: "",
                splInstructions: ""
            },
            location: {
                latitude: 0,
                longitude: 0
            }
        },
        validationSchema,
        onSubmit: async (values) => {
            setIsSubmitting(true);
            const response = await apirepository.create(EndPoints.createShippingToStore(storeId?.toString() ?? "",userid),values,ActivateShipping)
            console.log(response);
            if(response != null){
                setIsSubmitting(false);
                setIsOpen(false);
            }else{
                setIsSubmitting(false);
            }
            
        }
    });

    return (
        <Modal setIsOpen={setIsOpen}>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{t("shippingModal.title")}</h2>
                
                <form onSubmit={formik.handleSubmit}>
                    <div className="space-y-4 mb-6">
                        <h3 className="font-medium text-lg text-gray-700">{t("shippingModal.address_title")}</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="streetInfo" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("shippingModal.streetInfo_label")} *
                                </label>
                                <input
                                    type="text"
                                    id="streetInfo"
                                    name="address.streetInfo"
                                    value={formik.values.address.streetInfo}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {formik.touched.address?.streetInfo && formik.errors.address?.streetInfo && (
                                    <p className="mt-1 text-sm text-red-600">{t(formik.errors.address.streetInfo)}</p>
                                )}
                            </div>
                            
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("shippingModal.city_label")} *
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    name="address.city"
                                    value={formik.values.address.city}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {formik.touched.address?.city && formik.errors.address?.city && (
                                    <p className="mt-1 text-sm text-red-600">{t(formik.errors.address.city)}</p>
                                )}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("shippingModal.district_label")} *
                                </label>
                                <input
                                    type="text"
                                    id="district"
                                    name="address.district"
                                    value={formik.values.address.district}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {formik.touched.address?.district && formik.errors.address?.district && (
                                    <p className="mt-1 text-sm text-red-600">{t(formik.errors.address.district)}</p>
                                )}
                            </div>
                            
                            <div>
                                <label htmlFor="flatFloor" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("shippingModal.flatFloor_label")} *
                                </label>
                                <input
                                    type="text"
                                    id="flatFloor"
                                    name="address.flatFloor"
                                    value={formik.values.address.flatFloor}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {formik.touched.address?.flatFloor && formik.errors.address?.flatFloor && (
                                    <p className="mt-1 text-sm text-red-600">{t(formik.errors.address.flatFloor)}</p>
                                )}
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="splInstructions" className="block text-sm font-medium text-gray-700 mb-1">
                                {t("shippingModal.splInstructions_label")}
                            </label>
                            <textarea
                                id="splInstructions"
                                name="address.splInstructions"
                                value={formik.values.address.splInstructions}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows={3}
                            ></textarea>
                        </div>
                    </div>

                    <div className="space-y-4 mb-6">
                        <h3 className="font-medium text-lg text-gray-700">{t("shippingModal.location_title")}</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("shippingModal.latitude_label")} *
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    id="latitude"
                                    name="location.latitude"
                                    value={formik.values.location.latitude}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {formik.touched.location?.latitude && formik.errors.location?.latitude && (
                                    <p className="mt-1 text-sm text-red-600">{t(formik.errors.location.latitude)}</p>
                                )}
                            </div>
                            
                            <div>
                                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("shippingModal.longitude_label")} *
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    id="longitude"
                                    name="location.longitude"
                                    value={formik.values.location.longitude}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {formik.touched.location?.longitude && formik.errors.location?.longitude && (
                                    <p className="mt-1 text-sm text-red-600">{t(formik.errors.location.longitude)}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3 mt-8">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={isSubmitting}
                        >
                            {t("shippingModal.cancel")}
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? t("shippingModal.activating") : t("shippingModal.activate")}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ShippingModal;