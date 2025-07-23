// import { useFormik } from "formik";
// import * as Yup from "yup";
// import Modal from "./Modal";
// import { IProduct } from "../../../interfaces/ProductInterface";
// import { addProduct, updateProduct } from "../../../Store/StoreSlice/ProductSlice";
// import FieldLabel from "../../FormsComponents/FieldLabel";
// import TextInput from "../../FormsComponents/TextInput";
// import TextArea from "../../FormsComponents/TextArea";
// import { useParams } from "react-router-dom";
// import toast from "react-hot-toast";        
// import { useState, useRef } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../Store/Store";
// import { EndPoints } from "../../../Api/EndPoints";
// import { ApiRepository } from "../../../Api/ApiRepository";

// interface ProductModalProps {
//     setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
//     initialProduct?: IProduct | null;
// }

// const validationSchema = Yup.object({
//     name: Yup.string()
//         .required("Product name is required")
//         .min(2, "Name must be at least 2 characters"),
//     description: Yup.string()
//         .required("Description is required")
//         .min(10, "Description must be at least 10 characters"),
//     price: Yup.number()
//         .required("Price is required")
//         .min(0, "Price cannot be negative"),
//     stock: Yup.number()
//         .required("Stock is required")
//         .min(0, "Stock cannot be negative")
//         .integer("Stock must be a whole number"),
//     discount: Yup.number()
//         .min(0, "Discount cannot be negative")
//         .max(100, "Discount cannot exceed 100%")
//         .default(0),
//     duration: Yup.number()
//         .min(0, "Duration cannot be negative")
//         .integer("Duration must be a whole number")
//         .default(0),
//     isEvent: Yup.boolean(),
//     startAt: Yup.date().when('isEvent', {
//         is: true,
//         then: (schema) => schema.required("Start date is required for events"),
//         otherwise: (schema) => schema
//     }),
//     endAt: Yup.date().when('isEvent', {
//         is: true,
//         then: (schema) => schema.required("End date is required for events"),
//         otherwise: (schema) => schema
//     }),
//     categoryId: Yup.number().required("Category is required")
// });

// const ProductModal = ({ setIsOpen, initialProduct }: ProductModalProps) => {
//     const { storeId } = useParams();
//     const categories = useSelector((state: RootState) => state.currentStore.category.categories);
//     const [loading, setLoading] = useState(false);
//     const [selectedImage, setSelectedImage] = useState<File | null>(null);
//     const [imagePreview, setImagePreview] = useState<string | null>(null);
//     const fileInputRef = useRef<HTMLInputElement>(null);


//     const apiRepository = new ApiRepository();
//     const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         if (event.target.files && event.target.files[0]) {
//             const file = event.target.files[0];
//             setSelectedImage(file);
            
//             // Create preview
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 setImagePreview(e.target?.result as string);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const triggerFileInput = () => {
//         fileInputRef.current?.click();
//     };

//     const formik = useFormik({
//         initialValues: {
//             name: initialProduct?.name || "",
//             description: initialProduct?.description || "",
//             price: initialProduct?.price?.toString() || "0",
//             stock: initialProduct?.stock?.toString() || "0",
//             discount: initialProduct?.discount?.toString() || "0",
//             duration: initialProduct?.duration?.toString() || "0",
//             isEvent: initialProduct?.duration ? true : false,
//             startAt: initialProduct?.startat ? new Date(initialProduct.startat) : new Date(),
//             endAt: initialProduct?.endat ? new Date(initialProduct.endat) : new Date(),
//             categoryId: initialProduct?.categoryid?.toString() || ""
//         },
//         validationSchema,
//         onSubmit: async (values) => {
//             try {
//                 setLoading(true);
//                 const formData = new FormData();
//                 formData.append('Name', values.name);
//                 formData.append('Description', values.description);
//                 formData.append('Price', values.price);
//                 formData.append('Stock', values.stock);
//                 formData.append('Discount', values.discount);
//                 formData.append('CategoryId', values.categoryId);
//                 formData.append('StoreId', storeId as string);
                
//                 if (values.isEvent) {
//                     formData.append('Duration', values.duration);
//                     formData.append('StartAt', values.startAt.toISOString());
//                     formData.append('EndAt', values.endAt.toISOString());
//                 }
                
//                 if (selectedImage) {
//                     formData.append('ImageFile', selectedImage);
//                 }

//                 if (initialProduct?.id) {
//                     // For update, include the ID
//                     formData.append('Id', initialProduct.id.toString());
                    
//                     // Direct fetch for update to handle multipart/form-data
//                     const response = await fetch(
//                         `http://localhost:5164/api/Product/${initialProduct.id}`, 
//                         {
//                             method: 'PUT',
//                             body: formData
//                         }
//                     );
                    
//                     if (!response.ok) {
//                         throw new Error(`Error: ${response.status}`);
//                     }
                    
//                     const updatedProduct = await response.json();
//                     toast.success("Product updated successfully");
                    
//                     // Call Redux action with the updated product
//                     updateProduct(updatedProduct);
//                 } else {
//                     apiRepository.create(
//                         EndPoints.products(storeId as string),
//                         formData,
//                         addProduct
//                     );
//                 }
                
//                 setIsOpen(false);
//             } catch (error) {
//                 console.error("Error submitting product:", error);
//                 toast.error("Failed to save product");
//             } finally {
//                 setLoading(false);
//             }
//         },
//     });

//     const formatDate = (date: Date) => {
//         return date.toISOString().slice(0, 10);
//     };

//     return (
//         <Modal setIsOpen={setIsOpen}>
//             <div className="p-6">
//                 <h2 className="text-2xl font-bold mb-6">
//                     {initialProduct ? "Edit Product" : "Add New Product"}
//                 </h2>
                
//                 <form onSubmit={formik.handleSubmit} className="space-y-4">
//                     <div>
//                         <FieldLabel htmlFor="name">Product Name</FieldLabel>
//                         <TextInput
//                             id="name"
//                             value={formik.values.name}
//                             onChange={(value: string) => formik.setFieldValue("name", value)}
//                             placeholder="Enter product name"
//                             required
//                             arialabel="Product name"
//                         />
//                         {formik.touched.name && formik.errors.name && (
//                             <p className="mt-1 text-sm text-red-500">{formik.errors.name}</p>
//                         )}
//                     </div>

//                     <div>
//                         <FieldLabel htmlFor="description">Description</FieldLabel>
//                         <TextArea
//                             id="description"
//                             value={formik.values.description}
//                             onChange={(value: string) => formik.setFieldValue("description", value)}
//                             placeholder="Enter product description"
//                             required
//                             rows={3}
//                             arialabel="Product description"
//                         />
//                         {formik.touched.description && formik.errors.description && (
//                             <p className="mt-1 text-sm text-red-500">{formik.errors.description}</p>
//                         )}
//                     </div>

//                     <div>
//                         <FieldLabel htmlFor="price">Price</FieldLabel>
//                         <TextInput
//                             id="price"
//                             type="number"
//                             value={formik.values.price}
//                             onChange={(value: string) => formik.setFieldValue("price", value)}
//                             placeholder="Enter price"
//                             required
//                             arialabel="Product price"
//                         />
//                         {formik.touched.price && formik.errors.price && (
//                             <p className="mt-1 text-sm text-red-500">{formik.errors.price}</p>
//                         )}
//                     </div>

//                     <div>
//                         <FieldLabel htmlFor="stock">Stock</FieldLabel>
//                         <TextInput
//                             id="stock"
//                             type="number"
//                             value={formik.values.stock}
//                             onChange={(value: string) => formik.setFieldValue("stock", value)}
//                             placeholder="Enter stock quantity"
//                             required
//                             arialabel="Product stock"
//                         />
//                         {formik.touched.stock && formik.errors.stock && (
//                             <p className="mt-1 text-sm text-red-500">{formik.errors.stock}</p>
//                         )}
//                     </div>

//                     <div>
//                         <FieldLabel htmlFor="discount">Discount (%)</FieldLabel>
//                         <TextInput
//                             id="discount"
//                             type="number"
//                             value={formik.values.discount}
//                             onChange={(value: string) => formik.setFieldValue("discount", value)}
//                             placeholder="Enter discount percentage"
//                             arialabel="Product discount"
//                         />
//                         {formik.touched.discount && formik.errors.discount && (
//                             <p className="mt-1 text-sm text-red-500">{formik.errors.discount}</p>
//                         )}
//                     </div>

//                     <div>
//                         <FieldLabel htmlFor="categoryId">Category</FieldLabel>
//                         <select
//                             id="categoryId"
//                             name="categoryId"
//                             value={formik.values.categoryId}
//                             onChange={formik.handleChange}
//                             onBlur={formik.handleBlur}
//                             className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
//                             aria-label="Product category"
//                         >
//                             <option value="">Select a category</option>
//                             {categories.map((category) => (
//                                 <option key={category.id} value={category.id.toString()}>
//                                     {category.name}
//                                 </option>
//                             ))}
//                         </select>
//                         {formik.touched.categoryId && formik.errors.categoryId && (
//                             <p className="mt-1 text-sm text-red-500">{formik.errors.categoryId}</p>
//                         )}
//                     </div>

//                     <div>
//                         <FieldLabel htmlFor="image">Product Image</FieldLabel>
//                         <input
//                             type="file"
//                             id="image"
//                             ref={fileInputRef}
//                             accept="image/*"
//                             onChange={handleImageChange}
//                             className="hidden"
//                         />
//                         <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4 cursor-pointer hover:bg-gray-50" onClick={triggerFileInput}>
//                             {imagePreview ? (
//                                 <div className="flex flex-col items-center">
//                                     <img src={imagePreview} alt="Preview" className="w-40 h-40 object-contain mb-2" />
//                                     <span className="text-sm text-blue-500">Click to change image</span>
//                                 </div>
//                             ) : (
//                                 <div className="flex flex-col items-center">
//                                     <span className="text-gray-500 mb-1">Click to upload an image</span>
//                                     <span className="text-xs text-gray-400">(JPEG, PNG, GIF up to 5MB)</span>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     <div className="mt-4">
//                         <div className="flex items-center">
//                             <input
//                                 id="isEvent"
//                                 name="isEvent"
//                                 type="checkbox"
//                                 checked={formik.values.isEvent}
//                                 onChange={formik.handleChange}
//                                 className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
//                             />
//                             <label htmlFor="isEvent" className="ml-2 block text-sm text-gray-900">
//                                 This product is an event/time-based product
//                             </label>
//                         </div>
//                     </div>

//                     {formik.values.isEvent && (
//                         <>
//                             <div>
//                                 <FieldLabel htmlFor="duration">Duration (days)</FieldLabel>
//                                 <TextInput
//                                     id="duration"
//                                     type="number"
//                                     value={formik.values.duration}
//                                     onChange={(value: string) => formik.setFieldValue("duration", value)}
//                                     placeholder="Enter duration in days"
//                                     arialabel="Product duration"
//                                 />
//                                 {formik.touched.duration && formik.errors.duration && (
//                                     <p className="mt-1 text-sm text-red-500">{formik.errors.duration}</p>
//                                 )}
//                             </div>

//                             <div>
//                                 <FieldLabel htmlFor="startAt">Start Date</FieldLabel>
//                                 <input
//                                     id="startAt"
//                                     name="startAt"
//                                     type="date"
//                                     value={formatDate(formik.values.startAt)}
//                                     onChange={(e) => formik.setFieldValue("startAt", new Date(e.target.value))}
//                                     className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
//                                 />
//                                 {formik.touched.startAt && formik.errors.startAt && (
//                                     <p className="mt-1 text-sm text-red-500">{formik.errors.startAt as string}</p>
//                                 )}
//                             </div>

//                             <div>
//                                 <FieldLabel htmlFor="endAt">End Date</FieldLabel>
//                                 <input
//                                     id="endAt"
//                                     name="endAt"
//                                     type="date"
//                                     value={formatDate(formik.values.endAt)}
//                                     onChange={(e) => formik.setFieldValue("endAt", new Date(e.target.value))}
//                                     className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
//                                 />
//                                 {formik.touched.endAt && formik.errors.endAt && (
//                                     <p className="mt-1 text-sm text-red-500">{formik.errors.endAt as string}</p>
//                                 )}
//                             </div>
//                         </>
//                     )}

//                     <div className="mt-6 flex justify-end space-x-3">
//                         <button
//                             type="button"
//                             onClick={() => setIsOpen(false)}
//                             className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             {loading ? (
//                                 <span className="flex items-center">
//                                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                     </svg>
//                                     Processing...
//                                 </span>
//                             ) : (
//                                 `${initialProduct ? "Update" : "Create"} Product`
//                             )}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </Modal>
//     );
// };

// export default ProductModal;


import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "./Modal";
import { IProduct } from "../../../interfaces/ProductInterface";
import { addProduct, updateProduct } from "../../../Store/StoreSlice/ProductSlice";
import FieldLabel from "../../FormsComponents/FieldLabel";
import TextInput from "../../FormsComponents/TextInput";
import TextArea from "../../FormsComponents/TextArea";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";        
import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store/Store";
import { EndPoints } from "../../../Api/EndPoints";
import { ApiRepository } from "../../../Api/ApiRepository";
import { useTranslation } from "react-i18next";

interface ProductModalProps {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    initialProduct?: IProduct | null;
}

const validationSchema = Yup.object({
    name: Yup.string()
        .required("productModal.errors.name_required")
        .min(2, "productModal.errors.name_min"),
    description: Yup.string()
        .required("productModal.errors.description_required")
        .min(10, "productModal.errors.description_min"),
    price: Yup.number()
        .required("productModal.errors.price_required")
        .min(0, "productModal.errors.price_negative"),
    stock: Yup.number()
        .required("productModal.errors.stock_required")
        .min(0, "productModal.errors.stock_negative")
        .integer("productModal.errors.stock_integer"),
    discount: Yup.number()
        .min(0, "productModal.errors.discount_negative")
        .max(100, "productModal.errors.discount_max")
        .default(0),
    duration: Yup.number()
        .min(0, "productModal.errors.duration_negative")
        .integer("productModal.errors.duration_integer")
        .default(0),
    isEvent: Yup.boolean(),
    startAt: Yup.date().when('isEvent', {
        is: true,
        then: (schema) => schema.required("productModal.errors.startAt_required"),
        otherwise: (schema) => schema
    }),
    endAt: Yup.date().when('isEvent', {
        is: true,
        then: (schema) => schema.required("productModal.errors.endAt_required"),
        otherwise: (schema) => schema
    }),
    categoryId: Yup.number().required("productModal.errors.category_required")
});

const ProductModal = ({ setIsOpen, initialProduct }: ProductModalProps) => {
    const { t } = useTranslation();
    const { storeId } = useParams();
    const categories = useSelector((state: RootState) => state.currentStore.category.categories);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const apiRepository = new ApiRepository();
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedImage(file);
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const formik = useFormik({
        initialValues: {
            name: initialProduct?.name || "",
            description: initialProduct?.description || "",
            price: initialProduct?.price?.toString() || "0",
            stock: initialProduct?.stock?.toString() || "0",
            discount: initialProduct?.discount?.toString() || "0",
            duration: initialProduct?.duration?.toString() || "0",
            isEvent: initialProduct?.duration ? true : false,
            startAt: initialProduct?.startat ? new Date(initialProduct.startat) : new Date(),
            endAt: initialProduct?.endat ? new Date(initialProduct.endat) : new Date(),
            categoryId: initialProduct?.categoryid?.toString() || ""
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true);
                const formData = new FormData();
                formData.append('Name', values.name);
                formData.append('Description', values.description);
                formData.append('Price', values.price);
                formData.append('Stock', values.stock);
                formData.append('Discount', values.discount);
                formData.append('CategoryId', values.categoryId);
                formData.append('StoreId', storeId as string);
                
                if (values.isEvent) {
                    formData.append('Duration', values.duration);
                    formData.append('StartAt', values.startAt.toISOString());
                    formData.append('EndAt', values.endAt.toISOString());
                }
                
                if (selectedImage) {
                    formData.append('ImageFile', selectedImage);
                }

                if (initialProduct?.id) {
                    // For update, include the ID
                    formData.append('Id', initialProduct.id.toString());
                    
                    // Direct fetch for update to handle multipart/form-data
                    const response = await fetch(
                        `http://localhost:5164/api/Product/${initialProduct.id}`, 
                        {
                            method: 'PUT',
                            body: formData
                        }
                    );
                    
                    if (!response.ok) {
                        throw new Error(`Error: ${response.status}`);
                    }
                    
                    const updatedProduct = await response.json();
                    toast.success(t("productModal.success_update"));
                    
                    // Call Redux action with the updated product
                    updateProduct(updatedProduct);
                } else {
                    apiRepository.create(
                        EndPoints.products(storeId as string),
                        formData,
                        addProduct
                    );
                    toast.success(t("productModal.success_create"));
                }
                
                setIsOpen(false);
            } catch (error) {
                console.error("Error submitting product:", error);
                toast.error(t("productModal.error_toast"));
            } finally {
                setLoading(false);
            }
        },
    });

    const formatDate = (date: Date) => {
        return date.toISOString().slice(0, 10);
    };

    return (
        <Modal setIsOpen={setIsOpen}>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">
                    {initialProduct ? t("productModal.edit_title") : t("productModal.add_title")}
                </h2>
                
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <FieldLabel htmlFor="name">{t("productModal.name_label")}</FieldLabel>
                        <TextInput
                            id="name"
                            value={formik.values.name}
                            onChange={(value: string) => formik.setFieldValue("name", value)}
                            placeholder={t("productModal.name_placeholder")}
                            required
                            arialabel="Product name"
                        />
                        {formik.touched.name && formik.errors.name && (
                            <p className="mt-1 text-sm text-red-500">{t(formik.errors.name)}</p>
                        )}
                    </div>

                    <div>
                        <FieldLabel htmlFor="description">{t("productModal.description_label")}</FieldLabel>
                        <TextArea
                            id="description"
                            value={formik.values.description}
                            onChange={(value: string) => formik.setFieldValue("description", value)}
                            placeholder={t("productModal.description_placeholder")}
                            required
                            rows={3}
                            arialabel="Product description"
                        />
                        {formik.touched.description && formik.errors.description && (
                            <p className="mt-1 text-sm text-red-500">{t(formik.errors.description)}</p>
                        )}
                    </div>

                    <div>
                        <FieldLabel htmlFor="price">{t("productModal.price_label")}</FieldLabel>
                        <TextInput
                            id="price"
                            type="number"
                            value={formik.values.price}
                            onChange={(value: string) => formik.setFieldValue("price", value)}
                            placeholder={t("productModal.price_placeholder")}
                            required
                            arialabel="Product price"
                        />
                        {formik.touched.price && formik.errors.price && (
                            <p className="mt-1 text-sm text-red-500">{t(formik.errors.price)}</p>
                        )}
                    </div>

                    <div>
                        <FieldLabel htmlFor="stock">{t("productModal.stock_label")}</FieldLabel>
                        <TextInput
                            id="stock"
                            type="number"
                            value={formik.values.stock}
                            onChange={(value: string) => formik.setFieldValue("stock", value)}
                            placeholder={t("productModal.stock_placeholder")}
                            required
                            arialabel="Product stock"
                        />
                        {formik.touched.stock && formik.errors.stock && (
                            <p className="mt-1 text-sm text-red-500">{t(formik.errors.stock)}</p>
                        )}
                    </div>

                    <div>
                        <FieldLabel htmlFor="discount">{t("productModal.discount_label")}</FieldLabel>
                        <TextInput
                            id="discount"
                            type="number"
                            value={formik.values.discount}
                            onChange={(value: string) => formik.setFieldValue("discount", value)}
                            placeholder={t("productModal.discount_placeholder")}
                            arialabel="Product discount"
                        />
                        {formik.touched.discount && formik.errors.discount && (
                            <p className="mt-1 text-sm text-red-500">{t(formik.errors.discount)}</p>
                        )}
                    </div>

                    <div>
                        <FieldLabel htmlFor="categoryId">{t("productModal.category_label")}</FieldLabel>
                        <select
                            id="categoryId"
                            name="categoryId"
                            value={formik.values.categoryId}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                            aria-label="Product category"
                        >
                            <option value="">{t("productModal.category_placeholder")}</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id.toString()}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {formik.touched.categoryId && formik.errors.categoryId && (
                            <p className="mt-1 text-sm text-red-500">{t(formik.errors.categoryId)}</p>
                        )}
                    </div>

                    <div>
                        <FieldLabel htmlFor="image">{t("productModal.image_label")}</FieldLabel>
                        <input
                            type="file"
                            id="image"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4 cursor-pointer hover:bg-gray-50" onClick={triggerFileInput}>
                            {imagePreview ? (
                                <div className="flex flex-col items-center">
                                    <img src={imagePreview} alt={t("productModal.image_preview_alt")} className="w-40 h-40 object-contain mb-2" />
                                    <span className="text-sm text-blue-500">{t("productModal.change_image")}</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <span className="text-gray-500 mb-1">{t("productModal.upload_image")}</span>
                                    <span className="text-xs text-gray-400">{t("productModal.image_format")}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="flex items-center">
                            <input
                                id="isEvent"
                                name="isEvent"
                                type="checkbox"
                                checked={formik.values.isEvent}
                                onChange={formik.handleChange}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isEvent" className="ml-2 block text-sm text-gray-900">
                                {t("productModal.is_event_label")}
                            </label>
                        </div>
                    </div>

                    {formik.values.isEvent && (
                        <>
                            <div>
                                <FieldLabel htmlFor="duration">{t("productModal.duration_label")}</FieldLabel>
                                <TextInput
                                    id="duration"
                                    type="number"
                                    value={formik.values.duration}
                                    onChange={(value: string) => formik.setFieldValue("duration", value)}
                                    placeholder={t("productModal.duration_placeholder")}
                                    arialabel="Product duration"
                                />
                                {formik.touched.duration && formik.errors.duration && (
                                    <p className="mt-1 text-sm text-red-500">{t(formik.errors.duration)}</p>
                                )}
                            </div>

                            <div>
                                <FieldLabel htmlFor="startAt">{t("productModal.start_at_label")}</FieldLabel>
                                <input
                                    id="startAt"
                                    name="startAt"
                                    type="date"
                                    value={formatDate(formik.values.startAt)}
                                    onChange={(e) => formik.setFieldValue("startAt", new Date(e.target.value))}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                                />
                                {formik.touched.startAt && formik.errors.startAt && (
                                    <p className="mt-1 text-sm text-red-500">{t(formik.errors.startAt)}</p>
                                )}
                            </div>

                            <div>
                                <FieldLabel htmlFor="endAt">{t("productModal.end_at_label")}</FieldLabel>
                                <input
                                    id="endAt"
                                    name="endAt"
                                    type="date"
                                    value={formatDate(formik.values.endAt)}
                                    onChange={(e) => formik.setFieldValue("endAt", new Date(e.target.value))}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                                />
                                {formik.touched.endAt && formik.errors.endAt && (
                                    <p className="mt-1 text-sm text-red-500">{t(formik.errors.endAt)}</p>
                                )}
                            </div>
                        </>
                    )}

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                        >
                            {t("productModal.cancel")}
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {t("productModal.processing")}
                                </span>
                            ) : (
                                `${initialProduct ? t("productModal.update") : t("productModal.create")} Product`
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ProductModal;