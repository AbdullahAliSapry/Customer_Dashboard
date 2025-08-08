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
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CategoryModalProps {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    initialCategory?: ICategory | null;
}

const validationSchema = Yup.object({
    name: Yup.string()
        .required("categoryModal.errors.name_required")
        .min(2, "categoryModal.errors.name_min")
        .max(50, "categoryModal.errors.name_max"),
    description: Yup.string()
        .required("categoryModal.errors.description_required")
        .min(10, "categoryModal.errors.description_min")
        .max(500, "categoryModal.errors.description_max"),
});

const CategoryModal = ({ setIsOpen, initialCategory }: CategoryModalProps) => {
    const { t } = useTranslation();
    const { storeId } = useParams();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const apiRepository = new ApiRepository();

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            
            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                toast.error(t('categoryModal.errors.image_size'));
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error(t('categoryModal.errors.image_type'));
                return;
            }

            setSelectedImage(file);
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formik = useFormik({
        initialValues: {
            name: initialCategory?.name || "",
            description: initialCategory?.description || "",
        },
        validationSchema,
        onSubmit: async (values) => {
            setIsSubmitting(true);
            try {
                const formData = new FormData();
                formData.append('Name', values.name);
                formData.append('Description', values.description);
                formData.append('StoreId', storeId as string);
                
                if (selectedImage) {
                    formData.append('Image', selectedImage);
                }

                await apiRepository.create(EndPoints.categories(storeId as string), formData, addCategory);
                toast.success(initialCategory ? t('categoryModal.success_update') : t('categoryModal.success_create'));
                setIsOpen(false);

            } catch (error) {
                console.error(t('categoryModal.error_submit'), error);
                toast.error(t('categoryModal.error_toast'));
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // Animation variants
    const modalVariants = {
        hidden: { 
            opacity: 0,
            scale: 0.8,
            y: 20
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut" as const
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: 20,
            transition: {
                duration: 0.2,
                ease: "easeIn" as const
            }
        }
    };

    const formVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.4,
                staggerChildren: 0.1
            }
        }
    };

    const fieldVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut" as const
            }
        }
    };

    return (
        <Modal setIsOpen={setIsOpen}>
            <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="p-6 max-w-2xl mx-auto"
            >
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="mb-6"
                >
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="text-2xl font-bold text-gray-900 mb-2"
                    >
                        {initialCategory ? t('categoryModal.title_edit') : t('categoryModal.title_add')}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                        className="text-gray-600"
                    >
                        {initialCategory ? t('categoryModal.subtitle_edit') : t('categoryModal.subtitle_add')}
                    </motion.p>
                </motion.div>
                
                <motion.form
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    onSubmit={formik.handleSubmit}
                    className="space-y-6"
                >
                    {/* Category Name */}
                    <motion.div variants={fieldVariants}>
                        <FieldLabel htmlFor="name" required>
                            {t('categoryModal.name_label')}
                        </FieldLabel>
                        <motion.div
                            whileFocus={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                        >
                            <TextInput
                                id="name"
                                value={formik.values.name}
                                onChange={(value: string) => formik.setFieldValue("name", value)}
                                placeholder={t('categoryModal.name_placeholder')}
                                required
                                arialabel={t('categoryModal.name_arialabel')}
                                className={formik.touched.name && formik.errors.name ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
                            />
                        </motion.div>
                        <AnimatePresence>
                            {formik.touched.name && formik.errors.name && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mt-2 text-sm text-red-600 flex items-center"
                                >
                                    <X size={14} className="mr-1" />
                                    {t(formik.errors.name)}
                                </motion.p>
                            )}
                        </AnimatePresence>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-1 text-xs text-gray-500"
                        >
                            {formik.values.name.length}/50 {t('categoryModal.characters')}
                        </motion.p>
                    </motion.div>

                    {/* Description */}
                    <motion.div variants={fieldVariants}>
                        <FieldLabel htmlFor="description" required>
                            {t('categoryModal.description_label')}
                        </FieldLabel>
                        <motion.div
                            whileFocus={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                        >
                            <TextArea
                                id="description"
                                value={formik.values.description}
                                onChange={(value: string) => formik.setFieldValue("description", value)}
                                placeholder={t('categoryModal.description_placeholder')}
                                required
                                rows={4}
                                arialabel={t('categoryModal.description_arialabel')}
                                className={formik.touched.description && formik.errors.description ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
                            />
                        </motion.div>
                        <AnimatePresence>
                            {formik.touched.description && formik.errors.description && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mt-2 text-sm text-red-600 flex items-center"
                                >
                                    <X size={14} className="mr-1" />
                                    {t(formik.errors.description)}
                                </motion.p>
                            )}
                        </AnimatePresence>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-1 text-xs text-gray-500"
                        >
                            {formik.values.description.length}/500 {t('categoryModal.characters')}
                        </motion.p>
                    </motion.div>

                    {/* Image Upload */}
                    <motion.div variants={fieldVariants}>
                        <FieldLabel htmlFor="image">
                            {t('categoryModal.image_label')}
                            <span className="text-gray-500 font-normal ml-1">
                                ({t('categoryModal.optional')})
                            </span>
                        </FieldLabel>
                        <input
                            type="file"
                            id="image"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        
                        <AnimatePresence mode="wait">
                            {imagePreview ? (
                                <motion.div
                                    key="preview"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="relative"
                                >
                                    <div className="border-2 border-gray-200 rounded-lg p-4">
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="flex items-center justify-center"
                                        >
                                            <img 
                                                src={imagePreview} 
                                                alt={t('categoryModal.image_alt')} 
                                                className="max-w-full max-h-48 object-contain rounded" 
                                            />
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="mt-3 flex justify-center space-x-2"
                                        >
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                type="button"
                                                onClick={triggerFileInput}
                                                className="px-3 py-1 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-colors"
                                            >
                                                {t('categoryModal.change_image')}
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                type="button"
                                                onClick={removeImage}
                                                className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                                            >
                                                {t('categoryModal.remove_image')}
                                            </motion.button>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="upload"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors"
                                    onClick={triggerFileInput}
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4"
                                    >
                                        <Upload className="text-gray-400" size={24} />
                                    </motion.div>
                                    <div className="text-center">
                                        <p className="text-gray-600 mb-1 font-medium">
                                            {t('categoryModal.upload_image')}
                                        </p>
                                        <p className="text-sm text-gray-500 mb-3">
                                            {t('categoryModal.image_formats')}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {t('categoryModal.max_size')}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.7 }}
                        className="flex justify-end space-x-3 pt-4 border-t border-gray-200"
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                            disabled={isSubmitting}
                        >
                            {t('categoryModal.cancel')}
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center"
                                >
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="rounded-full h-4 w-4 border-b-2 border-white mr-2"
                                    />
                                    {t('categoryModal.saving')}
                                </motion.div>
                            ) : (
                                initialCategory ? t('categoryModal.update') : t('categoryModal.create')
                            )}
                        </motion.button>
                    </motion.div>
                </motion.form>
            </motion.div>
        </Modal>
    );
};

export default CategoryModal;