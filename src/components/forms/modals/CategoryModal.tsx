// import { useFormik } from "formik";
// import * as Yup from "yup";
// import Modal from "./Modal";
// import { ICategory } from "../../../interfaces/CategoryInterface";  
// import FieldLabel from "../../FormsComponents/FieldLabel";
// import TextInput from "../../FormsComponents/TextInput";
// import TextArea from "../../FormsComponents/TextArea";
// import { useParams } from "react-router-dom";
// import toast from "react-hot-toast";
// import { useState, useRef } from "react";
// import { EndPoints } from "../../../Api/EndPoints";
// import { ApiRepository } from "../../../Api/ApiRepository";
// import { addCategory } from "../../../Store/StoreSlice/CategorySlice";

// interface CategoryModalProps {
//     setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
//     initialCategory?: ICategory | null;
// }

// const validationSchema = Yup.object({
//     name: Yup.string()
//         .required("Category name is required")
//         .min(2, "Name must be at least 2 characters"),
//     description: Yup.string()
//         .required("Description is required")
//         .min(10, "Description must be at least 10 characters"),
// });

// const CategoryModal = ({ setIsOpen, initialCategory }: CategoryModalProps) => {
//     const { storeId } = useParams();
//     const [selectedImage, setSelectedImage] = useState<File | null>(null);
//     const [imagePreview, setImagePreview] = useState<string | null>(null);
//     const fileInputRef = useRef<HTMLInputElement>(null);
//         const apiRepository = new ApiRepository();
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

//     const formik = useFormik({
//         initialValues: {
//             name: initialCategory?.name || "",
//             description: initialCategory?.description || "",
//         },
//         validationSchema,
//         onSubmit: async (values) => {
//             try {
//                 const formData = new FormData();
//                 formData.append('Name', values.name);
//                 formData.append('Description', values.description);
//                 formData.append('StoreId', storeId as string);
                
//                 if (selectedImage) {
//                     formData.append('Image', selectedImage);
//                 }

//                 apiRepository.create(EndPoints.categories(storeId as string), formData,addCategory);

//             } catch (error) {
//                 console.error("Error submitting category:", error);
//                 toast.error("Failed to save category");
//             }
//         },
//     });

//     const triggerFileInput = () => {
//         fileInputRef.current?.click();
//     };

//     return (
//         <Modal setIsOpen={setIsOpen}>
//             <div className="p-6">
//                 <h2 className="text-2xl font-bold mb-6">
//                     {initialCategory ? "Edit Category" : "Add New Category"}
//                 </h2>
                
//                 <form onSubmit={formik.handleSubmit} className="space-y-4">
//                     <div>
//                         <FieldLabel htmlFor="name">Category Name</FieldLabel>
//                         <TextInput
//                             id="name"
//                             value={formik.values.name}
//                             onChange={(value: string) => formik.setFieldValue("name", value)}
//                             placeholder="Enter category name"
//                             required
//                             arialabel="Category name"
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
//                             placeholder="Enter category description"
//                             required
//                             rows={3}
//                             arialabel="Category description"
//                         />
//                         {formik.touched.description && formik.errors.description && (
//                             <p className="mt-1 text-sm text-red-500">{formik.errors.description}</p>
//                         )}
//                     </div>

//                     <div>
//                         <FieldLabel htmlFor="image">Category Image</FieldLabel>
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
//                             className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
//                         >
//                             {initialCategory ? "Update" : "Create"} Category
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </Modal>
//     );
// };

// export default CategoryModal; 


import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "./Modal";
import { ICategory } from "../../../interfaces/CategoryInterface";  
import FieldLabel from "../../FormsComponents/FieldLabel";
import TextInput from "../../FormsComponents/TextInput";
import TextArea from "../../FormsComponents/TextArea";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useState, useRef } from "react";
import { EndPoints } from "../../../Api/EndPoints";
import { ApiRepository } from "../../../Api/ApiRepository";
import { addCategory } from "../../../Store/StoreSlice/CategorySlice";
import { useTranslation } from "react-i18next";

interface CategoryModalProps {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    initialCategory?: ICategory | null;
}

const validationSchema = Yup.object({
    name: Yup.string()
        .required("categoryModal.errors.name_required")
        .min(2, "categoryModal.errors.name_min"),
    description: Yup.string()
        .required("categoryModal.errors.description_required")
        .min(10, "categoryModal.errors.description_min"),
});

const CategoryModal = ({ setIsOpen, initialCategory }: CategoryModalProps) => {
    const { t } = useTranslation();
    const { storeId } = useParams();
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

    const formik = useFormik({
        initialValues: {
            name: initialCategory?.name || "",
            description: initialCategory?.description || "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const formData = new FormData();
                formData.append('Name', values.name);
                formData.append('Description', values.description);
                formData.append('StoreId', storeId as string);
                
                if (selectedImage) {
                    formData.append('Image', selectedImage);
                }

                apiRepository.create(EndPoints.categories(storeId as string), formData, addCategory);

            } catch (error) {
                console.error(t('categoryModal.error_submit'), error);
                toast.error(t('categoryModal.error_toast'));
            }
        },
    });

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <Modal setIsOpen={setIsOpen}>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">
                    {initialCategory ? t('categoryModal.title_edit') : t('categoryModal.title_add')}
                </h2>
                
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <FieldLabel htmlFor="name">{t('categoryModal.name_label')}</FieldLabel>
                        <TextInput
                            id="name"
                            value={formik.values.name}
                            onChange={(value: string) => formik.setFieldValue("name", value)}
                            placeholder={t('categoryModal.name_placeholder')}
                            required
                            arialabel={t('categoryModal.name_arialabel')}
                        />
                        {formik.touched.name && formik.errors.name && (
                            <p className="mt-1 text-sm text-red-500">{t(formik.errors.name)}</p>
                        )}
                    </div>

                    <div>
                        <FieldLabel htmlFor="description">{t('categoryModal.description_label')}</FieldLabel>
                        <TextArea
                            id="description"
                            value={formik.values.description}
                            onChange={(value: string) => formik.setFieldValue("description", value)}
                            placeholder={t('categoryModal.description_placeholder')}
                            required
                            rows={3}
                            arialabel={t('categoryModal.description_arialabel')}
                        />
                        {formik.touched.description && formik.errors.description && (
                            <p className="mt-1 text-sm text-red-500">{t(formik.errors.description)}</p>
                        )}
                    </div>

                    <div>
                        <FieldLabel htmlFor="image">{t('categoryModal.image_label')}</FieldLabel>
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
                                    <img src={imagePreview} alt={t('categoryModal.image_alt')} className="w-40 h-40 object-contain mb-2" />
                                    <span className="text-sm text-blue-500">{t('categoryModal.change_image')}</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <span className="text-gray-500 mb-1">{t('categoryModal.upload_image')}</span>
                                    <span className="text-xs text-gray-400">{t('categoryModal.image_formats')}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                        >
                            {t('categoryModal.cancel')}
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            {initialCategory ? t('categoryModal.update') : t('categoryModal.create')}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default CategoryModal;